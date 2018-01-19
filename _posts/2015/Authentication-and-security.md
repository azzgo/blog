# Authentication and security

## Cookies 和 安全 cookies

你可以使用 `set_cookie` 方法在用户的浏览器中设置 cookies.

```python
class MainHandler(tornado.web.RequestHandler):
    def get(self):
        if not self.get_cookie("mycookie"):
            self.set_cookie("mycookie", "myvalue")
            self.write("Your cookie was not set yet!")
        else:
            self.write("Your cookie was set!")
```

cookies 并不安全, 并且可以被用户任意的修改. 如果你需要设置cookies, 比如, 确认目前登陆的用户状态, 你需要将你的cookies签名防止伪造. Tornado通过`set_secure_cookie`和`get_secure_cookie`支持签名cookies. 为了使用这些方法, 你需要在你创建应用的时候指定一个密匙赋给`cookie_secret`.你可以作为一个应用参数传入你的应用.

<!--more-->
```python
application = tornado.web.Application([
	(r"/", MainHandler),
], cookie_secret="__TODO:_GENERATE_YOUR_OWN_RANDOMVALUE_HERE__")
```

签名cookies包含编码的cookie,时间戳和一个HMAC签名. 如果一个cookie过于陈旧, 签名将不被匹配, `get_secure_cookie`会返回`None`, 就像这个cookie没有被设置. 上面例子的安全版本是这样的:

```python
class MainHanlder(tornado.web.RequestHanlder):
	def get(self):
		if not self.get_secure_cookie("mycookie"):
			self.set_secure_cookie("mycookie", "myvalue")
			self.write("Your cookie was not set yet!")
		else:
			self.write("Your cookie was set!")
```

Tornado并不一定确保cookie安全. 也就是说, cookie虽然不能被修改, 但是可以被其用户查看. `cookie_sercert`是对称密匙, 必须被安全保存-任何人只要拥有这个密匙就可以生成他们自己的cookie.

默认, Tornado的安全cookie期限是30天. 可以改变传入`set_secure_cookie`的`expires_days`参数来改变这个期限和`get_secure_cookie`的`max_age_days`参数. 

## 用户认证

当前已认证的用户可以在每个请求handler的`self.current_user`获取, 或者在每个模板中的`current_user`.默认`current_user`的值是`None`.

为了在你的应用中实现用户认证, 你需要覆写你的请求handler的`get_current_user()`方法基于当前cookie的值决定当前用户. 这里有一个简单的例子通过指定存储在cookie中的nickname让用户登入应用:

```python
class BaseHandler(tornado.web.RequestHandler):
	def get_current_user(self):
		return self.get_secure_cookie("user")

class MainHandler(BaseHandler):
	def get(self):
		if not self.current_user:
			self.redirect("/login")
			return
		name = tornado.escape.xhtml_escape(self.current_user)
		self.write("Hello, " + name)

class LoginHandler(BaseHandler):
	def get(self):
		self.write('<html><body><form action="/login" method="post">'
		'Name: <input type="text" name="name">'
                   '<input type="submit" value="Sign in">'
                   '</form></body></html>')

	def post(self):
		self.set_secure_cookie("user", self.get_argument("name"))
		self.redirect("/")

application = tornado.web.Application([
	(r"/", MainHandler),
	(r"/login", LoginHandler),
], cookie_secret="__TODO:_GENERATE_YOUR_OWN_RANDOM_VALUE_HERE__")
```

你可以使用Python修饰符`tornado.web.authenticated`要求用户登录.如果一个处理某个请求的处理方法被这个修饰符修饰, 并且用户并没有登录的话, 他们会被重定向到`login_url`(另一个应用设定). 上面的例子可以这样被重写:

```python
class MainHandler(BaseHandler):
	@tornado.web.authenicated
	def get(self):
		name = tornado.escape.xhtml_escape(self.current_user)
		self.write("Hello, " + name)

settings = {
	"cookie_secret": "__TODO:_GENERATE_YOUR_OWN_RANDOM_VALUE_HERE__",
	"login_url": "/login",
}

application = tornado.web.Application([
	(r"/", MainHandler),
	(r"/login", LoginHandler),
], **settions)
```

如果你在`post()`方法上修饰了`authenticated`修饰符, 并且用户并没有登录, 服务器会返回一个`403`响应.`@authenticated`修饰符仅仅是`if not self.current_user: self.redirect()`的缩写.

## 第三方认证

`tornado.auth`模块实现了认证和授权协议.这个模块里包括记录站点的用户可以被授权访问那些内容或者服务, 是否可以下载某个资源或者发布一条讯息.

这里有个例子使用了Google的认证, 将Google的证书保存在一个cookie中以便以后使用.

```python
class GoogleHandler(tornado.web.RequestHandler, tornado.auth.GoogleMixin):
	@tornado.web.asynchronous
	def get(self):
		if self.get_argument("openid.mode", None):
			self.get_authenticated_user(self._on_auth)
			return
		self.authenticate_redirect()
	
	def _on_auth(self, user):
		if not user:
			self.authenticate_redirect()
			return
		## 保存用户相关 比如 set_secure_cookie()
```

查看`tornado.auth`模块了解更多细节.

## 跨域请求伪造(CSRF)保护

跨域请求伪造, 或者叫做XSRF,是web应用的一种常见问题. 查看[维基条目](http://en.wikipedia.org/wiki/Cross-site_request_forgery)了解更多关于XSRF的工作方式.

普遍接受的解决方案是在每个用户的cookie中放入一个不可预测的值, 让这个值作为每个表单提交的额外参数. 如果这个cookie中的值在表单提交的时候不能被匹配, 那么这个请求就很可能是伪造的.

Tornado有内奸的XSRF保护机制. 要在你的应用中启用, 可以在应用设置中设置`xsrf_cookies`:

```python
settings = {
	"cookie_secret: "__TODO:_GENERATE_YOUR_OWN_RANDOM_VALUE_HERE__",
	"login_url": "/login",
	"xsrf_cookies" True,
}

application = tornado.web.Application([
	(r"/", MainHandler),
	(r"/login", LoginHandler),
], **settings)
```

如果`xsrf_cookies`被设置了, Tornado web应用程序会设置`_xsrf`cookie, 它会拒绝所有请求中没有包含正确的`_xsrf`值的`POST`,`PUT`和`DELETE`请求.如果你将这个设置打开了, 你需要在所有的`POST`表单中包含这个表单域.你可以通过特殊的`UIModule`模块的`xsrf_form_html()`, 在所有的目标中启用.

```python
<form action="/new_message" method="post">
	{% module xsrf_form_html() %}
	<input type="text" name="message"/>
	<input type="submit" value="Post"/>
</form>
```

如果你提交Ajax的`POST`请求, 你可能需要在每一个请求中包含`_xsrf`字段. 这里有个我们使用JQuery的Ajax的`POST`请求自动在每一个请求中包含`_xsrf`的值.

```python
function getCookie(name){
	var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
	return r ? r[1] : undefined;
}

jQuery.postJSON = function(url, args, callback) {
	args._xsrf = getCookie("_xsrf");
	$.ajax({url: url, data: $.param(args), dataType: "text", type: "POST",
		success: function(response) {
		callback(eval("(" + response + ")"));
	}});
};
```

对于`PUT`和`DELELTE`请求, XSRF token可能需要通过HTTP头`X-XSRFToken`传递. XSRF cookie在`xsrf_form_html`使用的时候被设定, 但是在在一个纯Javascript应用, 你可能需要使用通过`self.xsrf_token`收到设置(当然读取设置的cookie也可以).

如果你需要定制XSRF的行为, 你可以覆写`RequestHandler.check_xsrf_cookie()`. 例如, 如果你有一个API, 他的认证并不需要使用cookie, 你可以禁用XSRF, 可以使用`check_xsrf_cookie()`. 
