# 多层组件
categories:
  - 文档翻译
tags:
  - react
  - react 指南
date: 2015-03-06 17:24:08
---

目前, 我们看了如何写一个可以展示数据并处理用户输入的简单组件. 接下来看下 React 最好的特性: 可组合性(composability)

<!--more-->

## 动机: 关注点分离(Separation of Concerns)

你可以通过构建有良好接口的可复用组件的模块化组件库来获得使用函数或者类的同样的优点. 通过构建一个自定义的组件库, 你可以以最适合你的领域的方式表现你的 UI.

## 组合的例子

我们创建一个简单的 Avator 组件使用 Facebook 的 Graph API来展示个人图片和用户名.

```javascript
var Avatar = React.createClass({
  render: function() {
    return (
      <div>
        <ProfilePic username={this.props.username} />
        <ProfileLink username={this.props.username} />
      </div>
    );
  }
});

var ProfilePic = React.createClass({
  render: function() {
    return (
      <img src={'http://graph.facebook.com/' + this.props.username + '/picture'} />
    );
  }
});

var ProfileLink = React.createClass({
  render: function() {
    return (
      <a href={'http://www.facebook.com/' + this.props.username}>
        {this.props.username}
      </a>
    );
  }
});

React.render(
  <Avatar username="pwh" />,
  document.getElementById('example')
);
```

## 所有制

在上面的例子中, `Avatar` 拥有 `ProfilePic` 和 `ProfileLink` 的实例. 在 React 中, **一个所有者就是一个可以设置其他组件 `props` 的组件**. 更正规点, 如果一个组件 `X` 是通过组件 `Y` 的 `render()` 方法创建的, 那么就可以说 `X` 被 `Y` 所拥有. 像上面描述的, 一个组件是不能修改它自己的 `props` -- 他们永远和所有者是指的样子保持一致. 这个关键的属性保证了UI的一致性.

区分所有者-所有物关系和父代-子代关系很重要. 所有者-所有物关系特别只对 React, 而父代-子代关系指的是 DOM 中的包含关系. 在上面的例子中, `Avatar` 拥有 `div`, `ProfilePic`, `ProfileLink` 实例, 然后 `div` 是 `ProfilePic` 和 `ProfileLink` 实例的父代(但不是他们的所有者).

## 子代

当你创建一个 React 组件实例时, 你可以在开闭标签内包含一些额外的 React 组件或者 Javascript 表达式.类似这样:

```html
<Parent><Child /></Parent>
```

`Parent` 可以通过特殊的 `this.props.chirdren` prop 访问到它的子代. **`this.props.children`** 是一个不透明的数据结构: 请使用 React.Children 工具来操作他们.

### 子代冲突调节(Reconciliation)

冲突调节说的是 React 更新DOM时, 其中每一个组件都需要重新渲染的过程. 一般而言, 子代通过他们呈现的顺序解决冲突. 例如, 假设有两个渲染过程产生了下面不同的输出:

```xml
// 渲染过程 1
<Card>
  <p>Paragraph 1</p>
  <p>Paragraph 2</p>
</Card>
// 渲染过程 2
<Card>
  <p>Paragraph 2</p>
</Card>
```

直觉上, `<p>Paragraph 1</p>`被移除了. React 通过改变第一个子代的文本内容, 并且摧毁最后一个子代. React 根据子代的顺序解决冲突.

### 带有状态的子代

对于多数组件来说, 这并不是大事. 然而对于通过 `this.state` 维护数据的带状态的组件, 这可能出现一些糟糕的问题.

多是情况下, 这可以通过隐藏元素而不是摧毁它们来回避.

```xml
// 渲染过程 1
<Card>
  <p>Paragraph 1</p>
  <p>Paragraph 2</p>
</Card>
// 渲染过程 2
<Card>
  <p style={{'{{'}}display: 'none'}}>Paragraph 1</p>
  <p>Paragraph 2</p>
</Card>
```

### 动态子代

这个情形在子代经常变化(比如在搜索结果中)时或者一些新组件被添加到前端的列表中(比如流)时变得更加复杂. 这些情形每一个子代的标志和状态必须在多个渲染操作中维护起来, 你可以为每一个子代赋予一个唯一的`key`来认证:

```javascript
  render: function() {
    var results = this.props.results;
    return (
      <ol>
        {results.map(function(result) {
          return <li key={result.id}>{result.text}</li>;
        })}
      </ol>
    );
  }
```
  
  当 React 调节带有 key 的子代, 它会确保任何带有 `key` 属性的子代重新排序或者正确摧毁.
  
  `key` 整个永远直接提供给组件, 而不是提供给被包含在组件里面的 HTML 子代. 
  
```javascript
// 错误的写法!
var ListItemWrapper = React.createClass({
  render: function() {
    return <li key={this.props.data.id}>{this.props.data.text}</li>;
  }
});
var MyComponent = React.createClass({
  render: function() {
    return (
      <ul>
        {this.props.results.map(function(result) {
          return <ListItemWrapper data={result}/>;
        })}
      </ul>
    );
  }
});

// 正确的写法 :)
var ListItemWrapper = React.createClass({
  render: function() {
    return <li>{this.props.data.text}</li>;
  }
});
var MyComponent = React.createClass({
  render: function() {
    return (
      <ul>
        {this.props.results.map(function(result) {
           return <ListItemWrapper key={result.id} data={result}/>;
        })}
      </ul>
    );
  }
});
```

你也可以通过传递对象赋予子代 key. 但记住 Javascript 不保证会保持属性的顺序. 实践中除开那些可以被解析为32位无符号整型之外, 浏览器会保持正确的顺序. 数字性质的属性会按顺序排列, 并置于其他属性之前. 如果因为这个原因 React 渲染组件顺序乱了, 可以通过在每一个key钱添加一个字符串前缀来避免:

```javascript
  render: function() {
    var items = {};

    this.props.results.forEach(function(result) {
      // If result.id can look like a number (consider short hashes), then
      // object iteration order is not guaranteed. In this case, we add a prefix
      // to ensure the keys are strings.
      items['result-' + result.id] = <li>{result.text}</li>;
    });

    return (
      <ol>
        {items}
      </ol>
    );
  }
```
  
## 数据流
  
  在 React 中, 数据流通过 `props` 从所有者流向所有物组件. 这是非常有限的单向数据绑定: 所有者将他们拥有的组件的 props 绑定到基于所有者自己的 `props` 或者 `state` 计算的值上. 因为这个过程是递归发送的, 数据改变时会自动反应到它被应用的所有地方.
  
## 关于性能的注意点

你可能认为如果一个所有者很多节点的话对于 React 概不数据的花销很大.好消息是 Javascript 现在已经非常快了, `render()` 方法也非常简单, 所有在大多数应用下这个过程是非常快的. 另外性能的瓶颈几乎总是发生在改变DOM上, 而不是 JS 的执行过程, 并且 React 会通过批处理和变化监听来优化这个过程.

然而, 有时你真的想要对性能可控. 这种情形下, 仅仅需要复写 `shouldComponentUpdate()` 让它返回 false, React会跳过子树的执行, 查看 [React 指导文档](http://facebook.github.io/react/docs/component-specs.html)获取更多信息.

> Note
> 
>如果在数据真实改变的情况下, `shouldComponentUpdate()` 返回 false, React 将不能保持你的 UI 的同步变化. 在使用这个的时候请?确保你知道你在做什么, 并仅仅只在你的应用有可以察觉的性能问题时使用这个方法. 不要低估Javascript的速度, 比起 DOM 来说已经非常快了.
