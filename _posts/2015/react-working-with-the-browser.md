# react - working with the browser
categories:
  - 文档翻译
tags:
  - react
  - react指南
date: 2015-03-17 14:39:17
---

React 提供了一些强力的封装, 让你从大多数情况的 DOM 操作中解放出来, 但是有些时候你需要访问到底层的 API, 也许需要和第三方的库或者现存的代码打交道.

<!--more-->

## 虚拟 DOM

React 如此的快的原因是因为他从不直接操作 DOM. React 在内存中维持一个 DOM 的表示. `render()` 方法返回一个关于 DOM 的描述, React 会区分内存中表示的描述的不同, 以便用最快的方式更新浏览器.

另外, React 使用完整的合成事件系统, 为了保证所有的事件对象在不同的浏览器都符合 W3C 准则. 你甚至可以在 IE8 中使用一些 HTML5 事件.

多数时间下你应该保持 React 的"伪浏览器模式", 因为这样性能更加良好, 更容易扩展. 但是有时你需要访问底层的 API, 也许是要整合一个第三方库(比如一个 JQuery 插件). React 提供了便捷的接口让你可以直接处理底层的 API.

## Refs 和 findDOMNode()

为了和浏览器交互, 你需要一个 DOM 节点的引用. React 中有一个 React.findDOMNode(comonent) 方法来获取一个组件的 DOM 的节点.

> Note:
> 
> `findDOMNode()` 只在挂载的方法上有效(也就是说, 组件已经被放置的在 DOM 中 了). 如果你试图在一个没有挂载的组件上调用这个方法(比如在一个组件的 `render()` 调用 `findDOMNode()`, 这时组件还没有被创建), 一个异常会被触发.

为了获取一个 React 组件的的引用, 你可以使用 `this` 获取当前的 React 组件, 或者你可以使用 ref是引用一个你自己的组件, 类似这样:

```javascript
var MyComponent = React.createClass({
  handleClick: function() {
    // Explicitly focus the text input using the raw DOM API.
    React.findDOMNode(this.refs.myTextInput).focus();
  },
  render: function() {
    // The ref attribute adds a reference to the component to
    // this.refs when the component is mounted.
    return (
      <div>
        <input type="text" ref="myTextInput" />
        <input
          type="button"
          value="Focus the text input"
          onClick={this.handleClick}
        />
      </div>
    );
  }
});

React.render(
  <MyComponent />,
  document.getElementById('example')
);
```

## 更多关于 Refs

了解更多有关 refs, 包含更有效地使用它们, 查看 **更多关于 Refs** 部分.

## 组件的生命周期

组件的生命周期有三个主要的方法:

- **挂载**: 当一个被插入 DOM
- **更新**: 当一个组件被重新渲染
- **卸载**: 一个组件从 DOM 移除时

React 提供生命周期方法, 允许你挂接到这些过程. 我们提供了 **will** 方法, 在过程前调用, **did** 方法在过程发生后调用.

### 挂载

- `getInitialState(): object`: 在组件挂载前调用, 具有状态的组件应该调用这个方法, 并返回初始化的状态值.
- `componentWillMount`: 在挂载之前立刻调用
- `componentDidMount()`: 在组件挂载之后立刻调用. 需要 DOM 节点参与的初始化操作应该发生在这个方法中.

### 更新

- `componentWillReceiveProps(object nextProps)`: 在挂载的组件接受到一个新的 `prop`时调用. 这个方法应该用来比较 `this.props` 和 `nextProps` 并通过 `this.setState()` 来执行一些状态转化.
- `shouldComponentUpdate(Object nextProps, object nextState): boolean`: 在一个组件决定是否更新 DOM. 返回 false React 将跳过 DOM 更新.
- `componentWillUpdate(object nextProps, object nextState)`: 在组件更新前调用, 你在这不能调用 `this.setState()`.
- `componentDidUpdate(object, prevProps, object prevState)`: 在更新发生后立刻调用.

### 卸载

- `componentWillUnmount()`: 在一个组件将被卸载销毁时调用. 这里应该放置些清理用的代码.

## 挂载时可用的方法

挂载混合的组件也支持下列方法:

- `findDOMNode(): DOMElement` 可以任何已挂载的组件上调用, 为了获得一个渲染的 DOM 节点.
- `forceUpdate()` 在当你知道一些深层的组件状态已经变化了且没有调用 `this.setState()`时可以在任何已挂载的组件上调用.

## 浏览器支持和腻子

在 Facebook, 我们支持老的浏览器, 包含 IE8. 我们长期使用腻子来允许我们书写一些超前的 JS. 这意味着我们不必有一串麻烦的浏览器 hack 在我们的代码中并且我们的代码仍然可用 "正常工作", 例如, 不需要查看 new Date(), 我们只需要写 `Date.now()` 就行了. 因为开源的 React 使用同样的方式在内部处理了, 我们可以使用这个原则超前使用 JS.

除了这个哲学, 我们也接受这样的姿态, 作为这个 JS 库的作者. 不应该将腻子作为我们库的一部分. 如果每个库都这样做到的话, 很有可能通用的脚本会被下载多次. 如果你的产品需要支持老浏览器的画, 你可以使用像是 [es5-shim](https://github.com/kriskowal/es5-shim)的库.

### 需要腻子支持的老浏览器

来自 [kriskowal](https://github.com/kriskowal/es5-shim) `es5-shim.js` 提供了 React需要的下列方法:

- Array.isArray
- Array.prototype.every
- Array.prototype.forEach
- Array.prototype.indexOf
- Array.prototype.map
- Date.now
- Function.prototype.bind
- Object.keys
- String.prototype.split
- String.prototype.trim

也是来自 [kriskowal](https://github.com/kriskowal/es5-shim) 的`es5-sham.js` 提供了下面 React 需要的:

- Object.create
- Object.freeze

未解压版本的 React, 需要 [paulmillr](https://github.com/paulmillr/console-polyfill) 的 console 腻子:

- console.*

当在 IE8 中使用 HTML5 的元素, 像是`<section>`, `<article>`, `<nav>`, `<header>`, `<footer>`. 有必要使用 [html5shiv](https://github.com/aFarkas/html5shiv), 或者类似的脚本.

### 跨浏览器的问题

尽管 React 封装不同浏览器的不同点上已经足够好了, 但是某些浏览器扔有一些限制或者现在的浏览器的诡异行为还找不到有效的处理方式.

### IE8 上的 onScroll 事件

在 IE8 中, `onScroll` 事件不能冒泡, IE8 上也没有提供定义好的处理方法来捕获这个事件, 意味着对 React 而言不能监听这些事件. 当前这个事件只能在 IE8 中被忽略掉.

查看 [onScroll 不能在 IE8 中工作](https://github.com/facebook/react/issues/631) 的 Github issue 获取更多信息.
