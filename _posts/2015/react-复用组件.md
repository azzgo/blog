# 复用组件
categories:
  - 文档翻译
tags:
  - react 指南
  - react
date: 2015-03-16 10:03:36
---

当设计接口时, 将通用的设计元素(按钮, 表单字段, 布局组件等等)分解为可复用的良好定义的接口. 用这种方式, 下次你需要构建一些 UI 时, 可以少些很多代码, 这意味着更少的开发时间, 更少的 bug, 更少的下载流量.

<!--more-->

## Prop Validation

当你的 app 逐渐庞大时, 确保你的组件被正确的使用就很有帮助了. 你只需要指定 `propTypes`, 我们帮你完成了验证. `React.PropTypes` 扩展了一系列确保接受数据是有效的验证器. 当一个 `prop` 接受了一个非法的值, 控制台会显示一则警告. 主要由于性能的原因, `propTypes` 只在开发模式下检查. 这里一个例子演示了提供的不同的验证器:

```javascript
React.createClass({
  propTypes: {
    // You can declare that a prop is a specific JS primitive. By default, these
    // are all optional.
    optionalArray: React.PropTypes.array,
    optionalBool: React.PropTypes.bool,
    optionalFunc: React.PropTypes.func,
    optionalNumber: React.PropTypes.number,
    optionalObject: React.PropTypes.object,
    optionalString: React.PropTypes.string,

    // Anything that can be rendered: numbers, strings, elements or an array
    // containing these types.
    optionalNode: React.PropTypes.node,

    // A React element.
    optionalElement: React.PropTypes.element,

    // You can also declare that a prop is an instance of a class. This uses
    // JS's instanceof operator.
    optionalMessage: React.PropTypes.instanceOf(Message),

    // You can ensure that your prop is limited to specific values by treating
    // it as an enum.
    optionalEnum: React.PropTypes.oneOf(['News', 'Photos']),

    // An object that could be one of many types
    optionalUnion: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number,
      React.PropTypes.instanceOf(Message)
    ]),

    // An array of a certain type
    optionalArrayOf: React.PropTypes.arrayOf(React.PropTypes.number),

    // An object with property values of a certain type
    optionalObjectOf: React.PropTypes.objectOf(React.PropTypes.number),

    // An object taking on a particular shape
    optionalObjectWithShape: React.PropTypes.shape({
      color: React.PropTypes.string,
      fontSize: React.PropTypes.number
    }),

    // You can chain any of the above with `isRequired` to make sure a warning
    // is shown if the prop isn't provided.
    requiredFunc: React.PropTypes.func.isRequired,

    // A value of any data type
    requiredAny: React.PropTypes.any.isRequired,

    // You can also specify a custom validator. It should return an Error
    // object if the validation fails. Don't `console.warn` or throw, as this
    // won't work inside `oneOfType`.
    customProp: function(props, propName, componentName) {
      if (!/matchme/.test(props[propName])) {
        return new Error('Validation failed!');
      }
    }
  },
  /* ... */
});
```

## 默认 Prop 的值

React 允许你用声明的方式定义你的 `prop` 的默认值.

```javascript
var ComponentWithDefaultProps = React.createClass({
  getDefaultProps: function() {
    return {
      value: 'default value'
    };
  }
  /* ... */
});
```

`getDefaultProps()` 的结果会被缓存, 并用来确保 `this.props.value` 在父代组件没有明确指定下也会有一个值. 这让你不需要书写可笑冗余的代码来处理相同的事情.

## 转移 prop 语法: A Shortcut

一个通用的模式是 React 组件是用一种简单的方式扩展了基本的 HTML.经常会有这种情况, 你想将传入你组件的所有属性直接传入给底层的 HTML 元素而不需要额外的输入. 你可以使用 JSX 扩展语法实现这种情况: 

```javascript
var CheckLink = React.createClass({
  render: function() {
    // This takes any props passed to CheckLink and copies them to <a>
    return <a {...this.props}>{'√ '}{this.props.children}</a>;
  }
});

React.render(
  <CheckLink href="/checked.html">
    Click here!
  </CheckLink>,
  document.getElementById('example')
);
```

## 单一子代

使用 `React.PropTypes.element` 你可以指定一个组件只能有一个子代.

```javascript
var MyComponent = React.createClass({
  propTypes: {
    children: React.PropTypes.element.isRequired
  },

  render: function() {
    return (
      <div>
        {this.props.children} // This must be exactly one element or it will throw.
      </div>
    );
  }

});
```

## Mixins

在 React 中, 组件是重用代码的最佳途径, 但是某些时候组件可能会共享一些通用的方法, 这些方法很难重用. 这种情形叫做 [Cross-cutting concern](http://en.wikipedia.org/wiki/Cross-cutting_concern). React 提供了 `mixin` 来解决这个问题.

一个通用的情形是一个组件想定时更新它本身. 这很容易使用 `setInterval()` 实现, 但为了节省内存在你不需要的时候取消定时非常重要. React 提供了生命周期方法来让你可以在组件创建和销毁时做一下操作. 我们创建一个简单的 mixin -- 使用这些方法来提供一个简单的 `setInterval()` 方法, 并在销毁时自动做清理操作.

```javascript
var SetIntervalMixin = {
  componentWillMount: function() {
    this.intervals = [];
  },
  setInterval: function() {
    this.intervals.push(setInterval.apply(null, arguments));
  },
  componentWillUnmount: function() {
    this.intervals.map(clearInterval);
  }
};

var TickTock = React.createClass({
  mixins: [SetIntervalMixin], // Use the mixin
  getInitialState: function() {
    return {seconds: 0};
  },
  componentDidMount: function() {
    this.setInterval(this.tick, 1000); // Call a method on the mixin
  },
  tick: function() {
    this.setState({seconds: this.state.seconds + 1});
  },
  render: function() {
    return (
      <p>
        React has been running for {this.state.seconds} seconds.
      </p>
    );
  }
});

React.render(
  <TickTock />,
  document.getElementById('example')
);
```

mixin 的一个良好特性就是如果一个组件使用了多个使用了相同生命周期方法的 mixin 的话(比如所有的生命某些 mixin 都想在组件销毁时做一些清理操作), 所有这些生命周期方法都被保证会被调用. 定义在 mixin 上的方法会按照列出的顺序被执行.

## ES6 类

你可以像 Javascript 类一样定义你的 React 类. 例如使用 ES6 的类 语法:

```javascript
class HelloMessage extends React.Component {
  render() {
    return <div>Hello {this.props.name}</div>;
  }
}
React.render(<HelloMessage name="Sebastian" />, mountNode);
```

这个 API 和 `React.createClass` `很类似, 除了没有 `getInitialState`. 作为替代你可以在构造器中设置你自己的 `state`.

另外的不同点是 `propTypes` 和 `defaultProps` 作为属性定义到构造器中而不是单纯的类中. 

```javascript
export class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {count: props.initialCount};
  }
  tick() {
    this.setState({count: this.state.count + 1});
  }
  render() {
    return (
      <div onClick={this.tick.bind(this)}>
        Clicks: {this.state.count}
      </div>
    );
  }
}
Counter.propTypes = { initialCount: React.PropTypes.number };
Counter.defaultProps = { initialCount: 0 };
```

### 没有自动绑定

方法遵循和 ES6 类相同的语法, 意味着他们不能自动自动绑定到 this 到实例上去. 你必须明确地使用 `.bind(this`.

### 没有 Mixin

不幸的是 ES6 并没有任何 mixin 的支持. 因此, 在 React 中使用 ES6 类的时候, 你不能获取 mixin 的支持. 对此, 我们正在努力让它能够支持这种需求在不借助 mixin 的情况下.
