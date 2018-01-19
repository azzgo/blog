title: "模板和UI"
date: 2015-04-13 19:59:56
categories:
- 文档翻译
tags:
- tornado
- python
---

Tornado 包含了一个简单快捷灵活的模板这部分就讲解语言. 这种语言和与其相关的国际化的话题.

Tornado 也可以使用任何其他的 Python 模板语言, 尽管并没有提供方法将他们整合到系统的 `RequestHandler.render`. 仅仅需要渲染这些第三方模板引擎的模板成一段字符串, 然后将其传入 `RequestHandler.write` 中即可.

<!--more-->

## 配置模板

默认 Tornado 在 Python 文件目录中寻找模板然后渲染它们. 要2015-04-12 21:36:06将你的模板文件放到不同的目录中去, 请使用 `Application setting` 中的 `template_path`(或者如果你希望在不同的 Handler 中使用不同的模板目录的话, 请覆写 `RequestHandler.get_template_path` 方法).

如果要从一个非文件系统中载入模板, 你可以继承 `tornado.template.BaseLoader` 并实例化一个实例传入 `template_loader` 应用设置中.

编译过的模板文件默认会被缓存; 要关闭缓存特性, 便于调试开发, 将应用设置中写入 `compiled_template_cache=False` 或者 `debug=True`.

## 模板语法

一个 Tornado 模板就是嵌入了 Python 的控制逻辑和表达式的 HTML(或者任何其他基于文本的格式).


```
<html>
<head>
<title>{{ title }}</title>
</head>
<body>
  <ul>
    {% for item in items %}
    <li>{{ escape(item) }}</li>
    {% end %}
  </ul>
</body>
</html>
```

 
如果你将这个模板保存为 `template.html` 并和你的 Python 源文件放到相同的目录中, 你可以用这种方式渲染模板:
 
```python
class MainHandler(tornado.web.RequestHandler):
   def get(self):
       items = ["Item 1", "Item 2", "Item 3"]
       self.render("template.html", title="My title", items=items)
```

{% raw %} 
<p>
Tornado 模板支撑控制语句和表达式. 控制语句被 <code>&#123;%</code> 和 <code>%&#125;</code>包裹. 比如 <code>&#123;% if len(items) > 2%&#125;</code>. 表达式被 <code>&#123;&#123;</code> 和 <code>&#125;&#123;</code> 包围, 比如 <code>&#123;&#123; item[0] &#125;&#125;</code>.
</p>
{% endraw %} 

控制语句基本和 Python 的语句相同. 我们支持 `if`, `for`, `while` 和 `try`, 所有这些都在 {% raw %}<code>&#123;% end %&#125;</code>{% endraw %}  处终止. 我们也支持模板继承语句 `extends` 和 `block` 语句, 在 `tornado.template` 文档中有描述.


表达式可以是任意的 Python 表达式, 包括函数调用. 模板中的代码执行的命名空间中包含下面的对象和函数(这个清单只适用于使用`RequestHandler.render` 和 `render_string`的时候. 如果你在一个 `RequestHandler` 类外直接使用 `tornado.template`, 里面很多项都不存在于命名空间).

- `escape`: `tornado.escape.xhtml_escape` 的别名
- `xhtml_escape`: `tornado.escape.xhtml_escape` 的别名
- `url_escape`: `tornado.escape.url_escape` 的别名
- `json_encode`: `tornado.escape.json_encode` 的别名
- `squeeze`: `tornado.escape.squeeze` 的别名
- `linkify`: `tornado.escape.linkify` 的别名
- `datetime`: Python 的 `datetime` 模块
- `handler`: 当前的 `RequestHandler` 对象
- `request`: `handler.request` 的别名
- `current_user`: `handler.current_user` 的别名
- `locale`: `handler.locale` 的别名
- `_`: `handler.locale.translate` 的别名
- `static_url`: `handler.static_url` 的别名
- `xsrf_form_html`: `handler.xsrf_form_html` 的别名
- `reverse_url`: `Application.reverse_url` 的别名
- 所有 `Application` 的 `ui_modules` 和 `ui_methods` 的设置
- 所有传入 `render` 或者 `render_string` 的关键字

当你构建一个真实的应用, 你会用到上面所有的特性, 特别是模板继承. 在 `tornado.template` 部分阅读上面所有的特性(某些特性, 包含 `UIModules` 是在 `tornado.web` 模块中实现的)

底层的钩子中, Tornado 模板直接转换为 Python 代码直接拷贝给呈现模板的 Python 函数. 我们不会处理模板语言中的任何错误; 这样我们提供了灵活性而不是严格的模板错误处理. 这样, 如果你在你的模板表达式中写了一些随机的东西, 会子啊执行模板的时候得到随机的模板错误.


所有模板的输出默认都使用 `tornado.escape.xhtml_escape` 函数转义的. 这个行为可以通过传入 `autoscape=None` 给 `Application` 或者 `tornado.template.Loader` 构造器改变. 如果一个模板构造器中有 `{{"{"}}% autoescape None %{{"}"}}` 指令, 或者单行表达式 `{{'{'}}{ ... }{{'}'}}` 用 `{{'{'}}% raw ... %{{'}'}}` 表示, 也可以关闭转义行为. 另外, 在需要使用其他转义函数处理的地方可以把前面的 `None` 换成函数名.



注意尽管 Tornado 自动转义的功能可以避免 XSS 攻击, 但是并不适用所有的情况. 表达式出现在某些位置( 比如 Javascript 或者 CSS, 可能需要用另一种的转义方式). 另外, 必须注意要使用双引号, 用在 HTML 属性的 `xhtml_escape` 可能包含不可信的内容, 或者用在属性上的转义函数(查看 <http://wonko.com/post/html-escaping>).



## 国际化

当前用户的地区(在于他是否登录)可以从请求 handler 的 `self.locale` 中获取, 在模板中是 `locale`. locale 的名称( 比如 `en_US`) 可以从 `locale.name` 获得, 你可以使用 `Locale.translate` 方法翻译字符串. 模板中也有个全局函数 `_()` 用来翻译字符串. 这个翻译字符串有两种形式:

```python
_("翻译这段字符串")
```

这样可以基于当前地区翻译

```python
_("A person liked this", "%(num)d people liked this",
  len(people)) % {"num": len(people)}
```

这个可以基于第三个参数的值觉得单复数. 上面的例子中, 如果 `len(people)` 的值是`1`, 翻译第一段字符串, 否则呈现第二段字符串.

最常见的翻译模式是使用 Python 变量命名的占位符(上面的`%(num)d`).

这有一份正确的国际化模板

```html
<html>
   <head>
      <title>FriendFeed - {{ _("Sign in") }}</title>
   </head>
   <body>
     <form action="{{ request.path }}" method="post">
       <div>{{ _("Username") }} <input type="text" name="username"/></div>
       <div>{{ _("Password") }} <input type="password" name="password"/></div>
       <div><input type="submit" value="{{ _("Sign in") }}"/></div>
       {% module xsrf_form_html() %}
     </form>
   </body>
 </html>
```

默认我们使用浏览器发出的 `Accept-Language` 头侦测用户的地区. 如果没有找到一个正确的 `Accept-Language` 值, 我们会选择 `en_US`. 如果你允许你的用户设置他们的地区作为偏好设置, 你可以覆写默认的地区选择方法 `RequestHandler.get_user_locale`:

```python
class BaseHandler(tornado.web.RequestHandler):
    def get_current_user(self):
        user_id = self.get_secure_cookie("user")
        if not user_id: return None
        return self.backend.get_user_by_id(user_id)

    def get_user_locale(self):
        if "locale" not in self.current_user.prefs:
            # Use the Accept-Language header
            return None
        return self.current_user.prefs["locale"]
```

如果 `get_user_locale` 返回 None, 我们会回退到 `Accept-Language` 头.

`tornado.locale` 模板支撑以两种方式载入翻译: `.mo` 格式和`.csv` 格式. 应用会通过 `tornado.locale.load_translations` 或者 `tornado.locale.load_gettext_translations` 在启动时载入. 查看这两种方法获得等多关于支撑格式的信息.

你可以在你的应用中通过 `tornado.locale.get_supported_locales()` 获得支持地区的列表. 用户的地区会匹配在支持的列表中选取最相近的地区. 例如, 如果用户的地区是 `es_GT`, 而 `es` 地区是被支持的. `self.locale` 会返回 `es`. 如果没有匹配项目, 会回退到 `en_US`.

## UI modules

Tornado 支持 UI modules, 这样更容易在多个应用中使用标准的复用的 UI 组件. UI modules 类似一个特殊的函数调用, 在你的页面中渲染组件, 并且, 他们可以包含独立的 Css 和 Javascript.

例如, 如果你要实现一个博客, 你想将博客文章放在博客主页和每个博客分类页面,你可以做一个 `Entry` 模块在两种页面上都渲染.首先,为你的UI模块创造一个Python模块, 比如 `uimodules.py`:

```python
class Entry(tornado.web.UIModule):
    def render(self, entry, show_comments=False):
        return self.render_string(
            "module-entry.html", entry=entry, show_comments=show_comments)
```

告诉 Tornado 在你应用的配置中 `ui_modules` 设置为 `uimodules.py` .

```python
from . import uimodules

class HomeHandler(tornado.web.RequestHandler):
    def get(self):
        entries = self.db.query("SELECT * FROM entries ORDER BY date DESC")
        self.render("home.html", entries=entries)

class EntryHandler(tornado.web.RequestHandler):
    def get(self, entry_id):
        entry = self.db.get("SELECT * FROM entries WHERE id = %s", entry_id)
        if not entry: raise tornado.web.HTTPError(404)
        self.render("entry.html", entry=entry)

settings = {
    "ui_modules": uimodules,
}
application = tornado.web.Application([
    (r"/", HomeHandler),
    (r"/entry/([0-9]+)", EntryHandler),
], **settings)
```

在模板中, 你可以使用 `{{'{'}}% module %{{'}'}}` 语句调用一个模块. 例如, 你可以调用 `Entry` 模块, 在 `home.html` 中:

```python
{% for entry in entries %}
  {% module Entry(entry) %}
{% end %}
```

在 `entry.html` 中:

```python
{% module Entry(entry, show_comments=True) %}
```

模块可以包含自定义的 CSS 和 Javascript 函数. 通过重写 `embedded_css`, `embebded_javascript`, `javascript_files` 或者 `css_files` 方法:

```python
class Entry(tornado.web.UIModule):
    def embedded_css(self):
        return ".entry { margin-bottom: 1em; }"

    def render(self, entry, show_comments=False):
        return self.render_string(
            "module-entry.html", show_comments=show_comments)
```

CSS 和 Javascript 模块只会被包含一次, 不管一个模板在一个页面上使用了多少次. CSS 永远会被置于页面的 `<head>` 部分, Javascript 总是放在 `</body>` 前页面的底部.

额外的 Python 代码不是必须的, 一个模板文件本身可以被用作一款模块. 比如, 前面例子可以重写放入 `module-entry.html`:

```html
{{ set_resources(embedded_css=".entry { margin-bottom: 1em; }") }}
<!-- more template html... -->
```

修改的模板慕课可以这样调用:

```html
{% module Template("module-entry.html", show_comments=True) %}
```

`set_resources` 函数只能在模板中通过 `{{'{'}}% module Template(...) %{{'}'}}` 调用. 和 `{{'{'}}% include ... %{{'}'}}` 指令不同, 模板模块的命令空间和他们包含的模板是相互独立的 -- 他们只能访问到全局命名空间和他们自己的关键字参数.
