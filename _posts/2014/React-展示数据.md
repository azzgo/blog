# React-展示数据


使用一个 UI 最基本的功能就是你可以展示一下数据. React 可以很容易地展示数据并在数据改变谁保持界面更新一致.

## Getting Started

<!--more-->

看下这个简单的例子. 使用下面的代码创建一个 `hello-react.html` 文件:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Hello React</title>
    <script src="http://fb.me/rreact-0.12.2.js"></script>
    <script src="http://fb.me/JSXTransformer-0.12.2.js"></script>
  </head>
  <body>
    <div id="example"></div>
    <script type="text/jsx">

      // ** 你的代码在这里! **

    </script>
  </body>
</html>
```

对应接下来的文档, 我们仅仅关注 Javascript 代码并都像上面那样嵌入一个模板中. 将注释的占位符替换为下面的 JS:

```javascript
var HelloWorld = React.createClass({
  render: function() {
    return (
      <p>
        Hello, <input type="text" placeholder="Your name here" />!
        It is {this.props.date.toTimeString()}
      </p>
    );
  }
});

setInterval(function() {
  React.render(
    <HelloWorld date={new Date()} />,
    document.getElementById('example')
  );
}, 500);
```


## 反应式更新

在浏览器中打开 `hello-react.html`, 并在文本框中键入你的名字. 注意 React 仅仅改变了UI中的时间字符串 -- 你键入在文本框中的字段仍在. 即使你没有书写任何代码来管理这个行为. React 为你算出正确的输出.

如果不需要的话, React是不会操作DOM的. **它使用迅捷的, 虚拟DOM来高效地执行区分和计算DOM变化**.

这个组件的输入被称为 `props` -- "properties" 的简称. 他们在JSX语法中作为属性传入. 你可以认为这些对于组件式不变的, **也就是说, 不要对 `this.props` 执行写操作**.

## 组件就像是函数

React的组件非常简单. 你可以把他们想成是一个接收 `props` 和 `state`(后面讨论) 的函数, 并返回 HTML. 因为他们非常简单, 使得容易解释.

> 注:
>
> **一项限制**: React 组件只能呈现一个单一的节点, 所以说如何你像返回多个节点, 你**必须**将他们包裹在一个根节点中.

## JSX 语法

我们坚信组件是关注点分离的正确方式, 而不是 "模板" 和 "展现逻辑".  我们认为标签和代码生成是紧密联系在一起的. 另外, 展示逻辑经常非常复杂, 而使用模板来表现又显得非常笨重.

> ps: 展示逻辑(display logic): 通过设置 css 的 display 属性来呈现页面.

我们发现对于这个问题的最好解决方法就是生成 直接由 Javascript 生成的 HTML 组件树. 你可以运用一个编程语言多有的表达能力带构建 UI.

为了更容易地做到这点, 我们创建了简单的, **可选**的类似HTML的语法来创建节点树.

**JSX 让你可以使用 HTML 语法来创建 Javascript 对象.** 比如在Reack中你需要生成一个连接, 使用纯 Javascript 你会这么写.

`React.createElement('a', {href: 'http://facebook.github.io/react/'}, 'Hello!')`

使用 JSX 就变成了:

`<a href="http://facebook.github.io/react/">Hello!</a>`

我们发现这让构建 React apps 更加容易, 并且设计师更愿意使用这种语法, 但是每个人都有他们自己的工作流, **所以 JSX 不是在 React 中强制使用.**

JSX 非常小. 想了解更多, 可以查看 [深入 JSX](/react/docs/jsx-in-depth.html). 或者查看在[我们的动态 JSX 编译器](/react/jsx-compiler.html)的转换操作.

JSX 类似于 HTML, 但是两者并不一样. 查看 [JSX gotchas](/react/docs/jsx-gotchas.html) 了解关键的不同点.

使用 JSX 最简单入门的方法是在浏览器中使用 `JSXTransformer`. 我们强烈建议你不要在你的产品中使用这个. 你们使用我们的命令行工具 [react-tools](http://npmjs.org/package/react-tools) 包文件来预编译你的代码.

## 不用 JSX 的 React

JSX 完全是可选的. 你不必在 React 中使用  JSX. 你可以通过 `React.createElement`来创建这些树结构. 其第一个参数是标签, 传入的属性对象作为第二个参数, 子代作为第三个参数.

```javascript
var child = React.createElement('li', null, 'Text Content');
var root = React.createElement('ul', { className: 'my-list' }, child);
React.render(root, document.body);
```

为了方便你可以创建一个速记的工厂函数来从自定义的组件创建元素.

```javascript
var Factory = React.createFactory(ComponentClass);
...
var root = Factory({ custom: 'prop' });
React.render(root, document.body);
```
React 已经有一些内建的工厂函数来创建一些常见的 HTML 标签:

```javascript
var root = React.DOM.ul({ className: 'my-list' },
             React.DOM.li(null, 'Text Content')
           );
```
