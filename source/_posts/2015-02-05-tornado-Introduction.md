title: tornado-Introduction
date: 2015-02-05 16:59:21
categories:
- 文档翻译
tags:
- tornado
- python
---

Tornado 是一个 Python 的 web 框架, 也是一个异步的网络库, 基于 FirendFeed 开发. 通过使用非阻塞的网络 I/O, Tornado 可以支持数以万计的连接, 在长连接, WebSorket, 和其他要求长连接的应用几乎是完美的解决方案.

Tornado 可以大概分成4个组件:

- 一个 Web 框架(包括创建应用的子类 RequestHandler, 和其他各种支持的类)
- 客户端喝服务器端的 HTTP 工具(AsyncHTTPClient 和 HTTPServer)
- 一个异步网络库( IOLoop 和 IOStream), 用于构建 HTTP 组件块, 或者用于调用其他协议.
- 一个协程库(tornado.gen), 用于将代码写的更加直白, 而不是回调函数链的形式.

Tornado Web 框架和其 HTTP 服务可以完全替代 WSGI. 尽管可以在 WSGI 容器中(WSGIAdapter)中运行使用 Tornado Web 框架, 或者将 Tornado HTTP 服务作为容器运行其他的 WSGI 框架(WSGIContainer), 两种方案都有一些限制, 如果你像完全利用 Tornado 的优点的话, 你可以将 Tornado Web 框架和 HTTP 服务一起使用.
