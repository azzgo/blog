# tornado-协程
categories:
  - 文档翻译
tags:
  - tornado
  - 并发
  - 异步
date: 2015-02-06 16:21:24
---

协程是在 Tornado 中推荐的书写异步代码的方式. 协程使用 Python 的 `yield` 关键字挂起和恢复代码执行, 而不是链式的的回调(像是 gevent 中的并发的轻量级线程有时也叫协程, 但是在 Tornado 中所有的协程使用清晰的上下文切换, 并以异步函数的方式调用)

协程几乎和同步代码一样, 却无需承担多线程的代价. 这使并发变得容易.

<!--more-->

例子

```python
from tornado import gen

@gen.coroutine
def fetch_coroutine(url):
    http_client = AsyncHTTPClient()
    response = yield http_client.fetch(url)
    # 在 python 3.3 之前的版本, 从一个生成器中返回一个值是不被允许的
    # 你只能代替使用
    #   raise gen.Return(response.body)
    return response.body
```

## 他如何工作的

一个包含 `yield` 的函数就是一个生成器. 所有的生成器都是异步的; 当调用他们时会返回一个生成器对象, 而不是等待它运行完成.
`@gen.coroutine` 修饰符通过 `yield` 表达式和生成器通讯, 并返回一个可以调用的 `Future`.

这是协程修饰符内部循环的简化版本:

```python
# tornado.gen.Runner 内部循环的简化版本
def run(self):
    # send(x) 使当前的 yield 返回x,
    # 在下一个 yield 获得时返回
    future = self.gen.send(self.next)
    def callback(f):
        self.next = f.result()
        self.run()
    future.add_done_callback(callback)
```

这个修饰符从生成器里接受一个 `Furtre`, 等待(并不阻塞) Future 完成, 然后"打开" `Futrue` 并将结果返回给生成器, 作为yield 表达式的结果. 大多数异步代码不需要直接操作 `Future` 类, 出发需要立刻从一个异步函数立刻返回, 给一个 yield 表达式.

## 协程模式

### 与回调交互

为了能在不使用 `Future` 而是要调用下和异步代码交互, 将调用包裹在 `Task` 中. 这会为你添加回调参数, 并返回一个可以 yield 的 `Future`.

```python
@gen.coroutine
def call_task():
    # 会被转化为
    #   some_function(other_args, callback=callback)
    yield gen.Task(some_function, other_args)
```

### 调用阻塞函数

从一个协程中调用一个阻塞函数最简单的方式就是调用 `ThreadPoolExecutor`. 它会返回一个兼容协程的 `Future`.

```python
thread_pool = ThreadPoolExecutor(4)

@gen.coroutine
def call_blocking():
    yield thread_pool.submit(blocking_func, args)
```

### 并行

协程修饰符可以识别值为 `Future` 的列表和字典, 并且并行地等待这些 `Future`.

```python
@gen.coroutine
def parallel_fetch(url1, url2):
    resp1, resp2 = yield [http_client.fetch(url1),
                          http_client.fetch(url2)]

@gen.coroutine
def parallel_fetch_many(urls):
    responses = yield [http_client.fetch(url) for url in urls]
    # responses is a list of HTTPResponses in the same order

@gen.coroutine
def parallel_fetch_dict(urls):
    responses = yield {url: http_client.fetch(url)
                        for url in urls}
    # responses is a dict {url: HTTPResponse}
```

### Interleaving

某些情况下, 先存储一个 `Future` 比起直接 yield 更有用, 你可以在等待之前开启另外的操作:

```python
@gen.coroutine
def get(self):
    fetch_future = self.fetch_next_chunk()
    while True:
        chunk = yield fetch_future
        if chunk is None: break
        self.write(chunk)
        fetch_future = self.fetch_next_chunk()
        yield self.flush()
```

### Looping

Looping 是协程的一个小技巧, 因为 Python 中没办法在所有的 `for` 和 `while` 循环中 yield, 也没法捕获所有 yield 的结果. 作为替代, 你需要区别返回访问结果的循环的条件, 比如 [Motor](http://motor.readthedocs.org/en/stable/) 的例子.

```python
import motor
db = motor.MotorClient().test

@gen.coroutine
def loop_example(collection):
    cursor = db.collection.find()
    while (yield cursor.fetch_next):
        doc = cursor.next_object()
```
