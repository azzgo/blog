title: tornado-一个Tornado-Web-应用结构
categories:
  - 文档翻译
tags:
  - web 框架
  - 项目结构
date: 2015-03-12 16:29:29
---

一个 Tornado web 应用通常由一个或者 `RequestHandler` 子类, 一个包含多个路由的 `Application` 对象, 和一个 `main()` 方法来启动一个服务器.

<!--more-->

一个最小化的 "Hello World" 例子看起来类似这样:

```python
from tornado.ioloop import IOLoop
from tornado.web import RequestHandler, Application, url

class HelloHandler(RequestHandler):
    def get(self):
        self.write("Hello, world")

def make_app():
    return Application([
        url(r"/", HelloHandler),
        ])

def main():
    app = make_app()
    app.listen(8888)
    IOLoop.current().start()
```

## `Application` 对象

`Application` 对象负责全局配置, 包括匹配请求 handler 的路由表.

路由表是一系列 `URLSpec` 对象的列表(或者元祖). 每一个都至少包含一个正则表达式和一个 handler 类.顺序很重要, 第一个匹配的规则会被使用. 如果正则表达式包含匹配组的话, 这些组会作为路径参数传入 handler 的 HTTP 方法. 如果一个字典作为 URLSpec 的第三个元素, 它提供参数的初始化值, 将被传递给 `RequestHandler.initialize`. 最后 `URLSpec` 可能永拥有名称, 可以用在 `RequestHandler.reverse_url` 中.

例如, 这个根路由 `/` 的片段会匹配到 `MainHandler` 而 `/story/` 及后面的数字会匹配到 `StoryHandler`. 这些数字会被传递给 `StroyHandler.get`.

```python
class MainHandler(RequestHandler):
    def get(self):
        self.write('<a href="%s">link to story 1</a>' %
                   self.reverse_url("story", "1"))

class StoryHandler(RequestHandler):
    def initialize(self, db):
        self.db = db

    def get(self, story_id):
        self.write("this is story %s" % story_id)

app = Application([
    url(r"/", MainHandler),
    url(r"/story/([0-9]+)", StoryHandler, dict(db=db), name="story")
    ])
```

`Application` 构造器可以接收多个参数来定制应用的行为和启用一些可选的特性; 查看 `Application.setting` 获取完整的清单.

## 子类 `RequestHandler`

大多数 Web 应用的工作都在 `RequestHandler` 的子类中完成了. Handler 子类的主要入口是其中的 HTTP 方法命名的方法: get(),
post(), etc. 每一个 Handler 都可能定义一个或者多种这种方法来处理多种 HTTP 动作. 像上面描述的那样, 这些方法带着关联的路由中匹配组匹配的参数调用

在一个 handler 中, 调用比如 `RequestHandler.render` 或者 `RequestHandler.write` 会产生一个 response. `render()` 通过名称载入一个 `Template` 并和参数一起呈现. `write()` 是用来呈现不是基于模板的输出; 可以接受字符串, 字节, 字典(字典会被编码成 JSON).

## 处理请求输入

请求 handler 使用 `self.request` 可以访问到当前的请求. 查看 `HTTPServerRequest` 的定义获取详细的属性清单.

使用 HTML 表单请求的数据会被解析, 你可以使用像是 `get_query_argument` 和 `get_body_argument` 方法获取.

```python
class MyFormHandler(RequestHandler):
    def get(self):
        self.write('<html><body><form action="/myform" method="POST">'
                   '<input type="text" name="message">'
                   '<input type="submit" value="Submit">'
                   '</form></body></html>')

    def post(self):
        self.set_header("Content-Type", "text/plain")
        self.write("You wrote " + self.get_body_argument("message"))
```

因为 HTML 表单编码很随意, `RequestHandler` 有不同的方法来处理参数列表. 使用 `get_query_arguments` 和 `get_body_arguments` 而不是单数版本来处理列表.

通过表单上传的文件可以通过 `self.request.files` 访问, 他将由 `<input type='file'>` 的元素 name 作为 key 映射到 files 列表. 每个文件都是一个 `{"filename": ..., "content_type":..., "body":...}` 格式的字典. `file` 对象只会在文件使用表单(Content-Type 为 multipart/form-data) 上传是才会出现. 如果没有使用这种方式的话, 上传的数据可以通过 `self.request.body` 访问. 默认上传的文件会完全缓存在内存中; 如果你需要处理特别大的文件的以至于不能放在内存中的话, 可以参考 `stream_request_body` 类修饰符.

Tornado 不会解析 JSON 请求体. 应用如果希望使用 JSON 而不是表单形式编码, 可以覆写 `prepare` 来解析他们的请求.

```python
def prepare(self):
    if self.request.headers["Content-Type"].startswith("application/json"):
        self.json_args = json.loads(self.request.body)
    else:
        self.json_args = None
```

## 覆盖 RequestHandler 的方法

除了 `get()/post()/` 等方法, `RequestHandler` 还包含其他被设计在需要的时候用来覆盖的方法. 没有请求都会按下面的顺序调用方法:

1. 每一个请求都会创建一个新的 `RequestHandler` 对象.
2. 使用来自 `Application` 配置中的初始化参数调用 `initialize()`. `initialize` 应该仅仅将参数存入成员变量中, 不应该产生任何输出, 除非调用类似 `send_error` 的方法.
3. 调用 `prepare` 方法. 这个方法可以说你的定制基类的方法中最有用的方法, 被所有你的 handler 子类共享. 不管哪种 HTTP 方法会被使用, `prepare` 都会被调用. `prepare` 可以产生输出; 如果调用了 `finish`(或者 `redirect` 等), 请求出来过程就会在这终止.
4. HTTP 方法中的一种被调用: `get()`, `post()`, `put()` 等之一. 如果 URL 正则匹配包含匹配组, 它们会作为参数传入这个方法.
5. 当请求完成后, `on_finish()` 被调用. 对于同步 handler 这个会在 HTTP 方法返回后立刻被调用. 对于异步 handler 会在调用 `finish()` 方法后被调用.

所有在 `RequestHandler` 文档中标注的都设计为可以被覆写. 其中一些常常被覆写的方法包括:

- write_error - 用来输出错误页面
- on_connection_close - 当客户端断开连接时调用; 注意并不保证关闭的连接会被正确的侦测到.
- get_current_user - 查看 `用户认证`
- get_user_locale - 为当前用户返回一个 `Locale`.
- set_default_headers - 可以用来在响应中设置一个额外的 Header(比如设置自定义 `Server` 头)

## 错误处理

如果一个 handler 引发一个异常, Tornado 会调用 `RequestHandler.write_error` 生成一个错误页面. `tornado.web.HTTPError` 可以被用来生成一个特定的状态码; 所有其他种类的错误都会返回500状态码.

默认的错误页面包含了一个错误栈输出, 和一行描述性输出(比如: "500: Internal Server Error"). 为了产生一个自定义的错误页面, 覆写 `RequestHandler.write_error`(可以放在所有你的 handler 的基础类中).这个方法可以仅仅通过 `write` 和 `render` 方法来产生输出. 如果错误是由于一个异常引起的, `exc_info` 元祖会作为一个参数被传递(注意这个异常不保证和当前在 `sys.exc_info` 中的异常一致, 所以必须使用 `traceback.format_exception` 而不是 `traceback.format_exc`).

也可以直接在 handler中通过调用 `set_status`, 写一个响应并返回 而不是调用 `write_error`. 

注意: 特殊的异常 `tornado.web.Finish`可能会终止 handler 的处理, 并且不会调用 `write_error`, 仅仅直接返回.

对于 404错误, 会使用 ``default_handler_class` 的 `Application_setting`. 这个 handler 应该覆盖 `prepare` 方法, 所有它对所有 HTTP 方法都有用. 它应该像上述方式产生一个错误页面: 要不发出一个 HTTPError(404) 并覆写 `write_error`, 要不调用 `self.set_status(404)` 并直接在 `prepare()` 方法产生一个响应.

## 重定向

有两种方法你可以在 Tornado 中重定向: RequestHandler.redirect 和 `RedirectHandler`.

你可以在 `RequestHandler` 中使用 `self.redirect()`将用户重定向到任何地方. 也有一个可选的参数 `permanent`, 用来指定这个重定向操作是否是永久性的. `permanent` 的默认值是 `False`, 这会生成一个 `302 Found` HTTP 响应码, 非常适合在用户成功发出 `POST` 请求后重定向操作中使用. 如果 `permanent` 是 true 的话, 将生成一个 `301 Moved Permanently` HTTP 响应码.

`RedirectHandler` 让你可以直接在 `Application` 的路由表中配置重定向. 例如, 要配置一个简单静态跳转:

```python
app = tornado.web.Application([
    url(r"/app", tornado.web.RedirectHandler,
        dict(url="http://itunes.apple.com/my-app-id")),
    ])
```

`RedirectHandler` 也支持正则表达式. 下列规则将会让以 `/pictures/`开头的地址都导向到以 `/photos/` 开头的地址:

```python
app = tornado.web.Application([
    url(r"/photos/(.*)", MyPhotoHandler),
    url(r"/pictures/(.*)", tornado.web.RedirectHandler,
        dict(url=r"/photos/\1")),
    ])
```

不像 `RequestHandler.redirect`, `RedirectHandler` 默认使用永久性的重定向. 这是因为路由表在运行时并不会改变, 可以假设匹配关系是永久的. 相比而言, 在 handler 中的重定向由于逻辑的变化可能会导致返回结果的变化. 如果需要让 `RedirectHandler` 返回一个暂时的跳转, 在 `RedirectHandler` 初始化参数中添加 `permanent=False`.

## 异步 Handlers

Tornado Handlers 默认是同步运行的( 当 `get()`/`post()` 方法返回时, 请求被认为是完成了的, 然后响应被发送出去. 因为一个 handler 在运行的时候其他请求默认是阻塞的, 任何长期运行的请求应该以异步的方式运行. 关于这个话题更多细节在 **异步和非阻塞 I/O** 中有讲到; 这个区块仅仅覆盖在 `RequestHandler` 子类中的异步技术.

让一个 Handler 以异步方式最简单的方法是添加 `coroutine` 修饰符. 这久允许你用 `yield` 关键字执行一个非阻塞的 I/O, 知道这个协程返回前, 响应式不会返回的. 查看 **协程** 章节了解更多.

有些情况下, 协程可能比起回调风格来说不那么方便, 这种情况下可以用 `tornado.web.asynchronous` 修饰符替代. 这个修饰符下, 响应并不会自动发送出去, 请求会一直挂起, 知道某个回调函数调用了 `RequestHandler.finish`. 应用需确保这个方法被调用, 否则用户的浏览器会一直挂起.

这有个例子, 使用 Tornado 内建的 `AsyncHTTPClient` 调用 FriendFeed 的 API:

```python
class MainHandler(tornado.web.RequestHandler):
    @tornado.web.asynchronous
    def get(self):
        http = tornado.httpclient.AsyncHTTPClient()
        http.fetch("http://friendfeed-api.com/v2/feed/bret",
                   callback=self.on_response)

    def on_response(self, response):
        if response.error: raise tornado.web.HTTPError(500)
        json = tornado.escape.json_decode(response.body)
        self.write("Fetched " + str(len(json["entries"])) + " entries "
                   "from the FriendFeed API")
        self.finish()
```

当 `get()` 返回了, 请求并没有接受, 当 HTTP client 最终调用了 `on_response()` 时, 请求仍然开启, 响应最终在调用 self.finish()` 方法时写入到客户端.

作为对比, 这有一个使用协程的相同的例子:

```python
class MainHandler(tornado.web.RequestHandler):
    @tornado.gen.coroutine
    def get(self):
        http = tornado.httpclient.AsyncHTTPClient()
        response = yield http.fetch("http://friendfeed-api.com/v2/feed/bret")
        json = tornado.escape.json_decode(response.body)
        self.write("Fetched " + str(len(json["entries"])) + " entries "
                   "from the FriendFeed API")
```

更多高级的几部例子, 查看 [聊天应用示例](https://github.com/tornadoweb/tornado/tree/stable/demos/chat), 其中使用了长轮询技术实现的 ajax 聊天室. 长轮询的用户可能想覆写 `on_connection_close()` 来在客户端关闭连接后用来做清理更正(当时请用前请看下此方法的 `docstring` 中的警告)        