title: React-关于 refs 更多
categories:
  - 文档翻译
tags:
  - react
  - react指南
date: 2015-03-18 08:45:06
---

 在通过渲染方法返回你的 UI 结构后, 你可能需要对组建实例做出一些方法调用什么的. 一般这种事没有必要, 应用 React 数据流会确保最新的 `props` 通过渲染方法被送到每个子代上去. 但是这也有些少数情况, 可能仍然有必要做些操作.
 <!--more-->
 
 比如当你想要一个 `<input /> ` 元素(已经存在于你的子代实例中) 在其值更新为空的时候自动聚焦.
 
```javascript
  var App = React.createClass({
    getInitialState: function() {
      return {userInput: ''};
    },
    handleChange: function(e) {
      this.setState({userInput: e.target.value});
    },
    clearAndFocusInput: function() {
      this.setState({userInput: ''}); // Clear the input
      // We wish to focus the <input /> now!
    },
    render: function() {
      return (
        <div>
          <div onClick={this.clearAndFocusInput}>
            Click to Focus and Reset
          </div>
          <input
            value={this.state.userInput}
            onChange={this.handleChange}
          />
        </div>
      );
    }
  });  
```

注意这个例子中, 我们想对输入做些处理, 不能通过他本身的 props 推断出来. 这个情形中, 我么想告诉输入组件现在应该处于聚焦的状态. 然而, 这里有一些问题. 从 `render()` 方法返回的不是真正的组件, 它只是一个实例的描述 --- 一个快照.

> Note:
> 
> 记住, 从 `render()` 返回的并不是真正渲染的实例. 从 `render()` 返回的只是一个在特定时间下的实例的描述.


这意味着你不能从 `render()` 返回的描述中获取什么有效的东西.

```javascript
// 反例, 不要这么做

  render: function() {
    var myInput = <input />;          // I'm going to try to call methods on this
    this.rememberThisInput = myInput; // input at some point in the future! YAY!
    return (
      <div>
        <div>...</div>
        {myInput}
      </div>
    );
  }
```  

这个反例中, `<input />` 只是一个 `<input />` 的描述. 这个段貌似用来创建一个真正的的 `<input>` 实例.

## ref 字符串属性

React 支持非常特殊的属性使你可以获取从 `render()` 中输出的任何组件. 这个特殊的属性允许你引用从 `render()` 返回的相关联的实例. 它可以保证能获取任何时间下的正确的实例.

简单来说: 
	
- 赋予一个 ref 属性到任意从 `render` 返回的组件组件上:

```javascript
<input ref="myInput" />
```

- 其他代码(通常是事件处理器代码), 通过 `this.refs` 访问到实例:

```javascript
this.refs.myInput
```

你可以直接调用 `React.findDOMNode(this.refs.myInput)` 直接访问到组件的 DOM 节点.

## ref 回调属性

ref 属性可以是一个回调函数而不是一个字符串名字. 这个回调函数会在组件挂载时马上被执行. 其引用的组件会作为参数传递, 回调可以立刻使用这个组件或者保存这个引用将来使用.

```javascript
  <input ref={ function(component){ React.findDOMNode(component).focus();} } />
```

## 完整的例子

```javascript
render: function() {
      return (
        <div>
          <div onClick={this.clearAndFocusInput}>
            Click to Focus and Reset
          </div>
          <input
            ref="theInput"
            value={this.state.userInput}
            onChange={this.handleChange}
          />
        </div>
      );
    }
  });
```

这个例子里面, 我们的渲染函数返回了一个 `<input />` 实例的描述. 只要子代组件有 `ref="theInput` 属性, 并从 render 返回的话, 真正的实就可以通过 `this.refs.theInput` 获取. 这个甚至可以在更高级的组件上(非 DOM)生效, 比如 `<Typehead ref="myTypehead" />`.


