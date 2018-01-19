# 交互性和动态-UI
date: 2015-01-22 22:16:23
categories:
- 文档翻译
tags:
- react
- react 指南
---


你已经学到如何在 React 中[展示数据](/2014/12/25/React-展示数据/). 现在看一看如果让我们的 UI 具有交互性.

<!--more-->
## 一个简单的例子

```javascript
var LikeButton = React.createClass({
  getInitialState: function() {
    return {liked: false};
  },
  handleClick: function(event) {
    this.setState({liked: !this.state.liked});
  },
  render: function() {
    var text = this.state.liked ? 'like' : 'haven\'t liked';
    return (
      <p onClick={this.handleClick}>
        You {text} this. Click to toggle.
      </p>
    );
  }
});

React.render(
  <LikeButton />,
  document.getElementById('example')
);
```


## 事件处理与合成事件

在 React 中你只需要将你的事件处理器命名为一个驼峰式的 prop, 和你在原本的 HTML 做的事情很类似. React 通过合成事件系统确保所有的事件在 IE8 中行为一致. 也就是说, React 知道如何处理事件冒泡和捕获事件这些细节, 然后事件会传递给你的事件处理器, 并不过你使用的何种浏览器, 保证和 [W3C 细则](http://www.w3.org/TR/DOM-Level-3-Events/)兼容.

如果你想在比如一部手机或者平板上使用 React 的话, 仅仅需要调用 `React.initializeTouchEvents(true);`  来启用触摸事件处理.


## 底层: 自动绑定和事件分派

在底层, React 做了少部分事情以便你的代码拥有良好的性能和可读性.

**自动绑定:** 当在 Javascript 中创建回调时, 你经常需要清晰的指定将一个方法绑定到它的实例上去, 比如正确 `this`值. 在 React 中, 每个方法都会被自动绑定到它的组件实例上. React 会缓存绑定用的方法提升 CPU 和内存的效率. 并且 less typing!

**事件分派:** React 实际上不会分派事件处理器到节点. 当 React 启动后, 它会在顶层使用单一的事件监听器监听所有的事件. 当一个组件挂起或者取消挂起, 事件处理器仅仅会在其内部的映射表中添加或者移除. 当一个事件发生后, React 知道如何根据这张映射表来分派事件. 当映射表中没有事件处理器时, React事件处理器仅仅执行一次空指令. 想要了解更多, 查看 [David Walsh's excellent blog post](http://davidwalsh.name/event-delegate).


## 组件就是状态机器

React 将 UI 当做简单的状态机器. 考虑 UI 的各种状态及呈现这些状态, 可以让你的 UI 保持一致.

在 React中, 你只需要更新一个组件的状态, 然后基于这个状态呈现一个新的 UI. React 会负责为你以最具效率的方式更新DOM.


## 状态是如何工作的

用来通知 React 数据改变了的方式就是调用 `setState(data, callback)`. 这个方法将 `data` 整合到  `this.state` 中并重新呈现组件. 当组件完成重新呈现的过程, 可选的 callback 会被调用. 大多数情况下你不需要提供一个 `callback`, 因为React 会帮你负责UI的更新.


## 什么组件应该拥有状态?

你大多数组件应该仅仅从 `props` 属性中接受数据并呈现它. 然而有时你需要对用户的输入, 一个服务的请求或者每个一段时间做出响应, 这种情况下, 你应该使用状态.

**让你的组件尽可能多地保持无状态.** 这样你可以将状态独立出他的逻辑位置并保持最小冗余, 让他更容易解释你的应用.

一个常见的模式是创建几个无状态的组件仅仅用来呈现数据, 一个状态化的组件包含他们, 通过 `props` 传入状态到子代. 状态化的组件封装所有耦合的逻辑, 而无状态的组件仅仅需要用声明的方式呈现数据.


## 状态应该包含什么?

**状态应该包含那种被事件处理器改变时会触发 UI 更新的数据.** 在真实的 app 中, 这个数据可能会趋向于非常小, 并且是被 JSON 序列化的. 当构建一个状态化的组件, 尽可能让状态的表示小, 并存储在 `this.state` 中. 在 `render()` 中仅仅需要基于这个状态计算出你需要的信息. 你会发现用这种方式属性应用更容易写出正确的应用, 因为在状态中添加冗余或者计算的值意味着你需要经期地将他们保持同步更新而不是依赖 React 帮你计算.

## 状态不应该包含什么?

`this.state` 应该只包含你需要用来表现你 UI 的状态的最小数据量. 比如, 它不应该包含:

* **计算出的数据:** 不要担心基于状态预计算的值 -- 如果你将所有的计算放在 `render()` 中, 你更容易确保你的 UI  的一致性. 例如, 如果你有一组项目的数组在状态中, 你像将他们的数量作为一个字符串来呈现, 你只需要在你的 `render()` 方法中书写 `this.state.listItems.length + 'list items'` 而不是将这个储存在状态中.
* **React 组件:** 基于处理过的 props 和 state 在 `render()` 中编译他们.
* **来自props的重复数据:** 尝试使用 props 作为真实的来源. 一个有效的使用是将 props 储存在state中来获取其前一个值, 因为 props 可以经常改变.

