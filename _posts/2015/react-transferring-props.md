# 转接 Props
categories:
  - 文档翻译
tags:
  - react
  - react指南
date: 2015-03-16 13:03:20
---

在 React中, 经常需要因为抽象化的需求, 封装一个组件. 外部的组件暴露一个简单的属性, 内部可能做了更加复杂的调用细节.

<!--more-->

你可以使用 JSX 扩展属性将 `props` 和额外的属性整合:

```javascript
return <Component {...this.props} more="values" />;
```

你可以不是呀 JSX, 你可以使用任何对象工具方法替代, 比如说 ES6 的 `Object.assign` 或者 Underscore 的 `_.extend`:

```javascript
return Component(Object.assign({}, this.props, { more: 'values' }));
```

本节余下部分介绍了关于最佳实践. 使用了 JSX 和实验性的 ES7 语法.

## 手动转接

大多数时间下, 你应该明确将属性传递. 那样确保你只会暴露内部 API 的一个子集.

```javascript
var FancyCheckbox = React.createClass({
  render: function() {
    var fancyClass = this.props.checked ? 'FancyChecked' : 'FancyUnchecked';
    return (
      <div className={fancyClass} onClick={this.props.onClick}>
        {this.props.children}
      </div>
    );
  }
});
React.render(
  <FancyCheckbox checked={true} onClick={console.log.bind(console)}>
    Hello world!
  </FancyCheckbox>,
  document.body
);
```

但是 `name` prop 怎么办? 或者说 `title` prop? 抑或是 `onMouseOver`?

## 在 JSX 中使用 `...` 转接

> Note:
> 
> 在下面的例子中, 必须启用 `--harmony` 标识开启实验性的 ES7 语法. 如果使用的浏览器中的 jSX 转化器, 你只需要在将你的 script 标签改写为 `<script type="text/jsx;harmony=true">`. 查看下面的**剩余和扩展属性 ...** 了解更多.

有时将每一个属性都单独传递很傻很可笑. 那种情形下, 你可以使用**解构声明**将剩余的属性解析为一个未知属性的集合.

列出所有你可能会用到的属性, 后面跟上 `...other`.

```javascript
var { checked, ...other } = this.props;
```

这确保了你将所有除了你将处理和使用的属性其余属性都传入.

```javascript
var FancyCheckbox = React.createClass({
  render: function() {
    var { checked, ...other } = this.props;
    var fancyClass = checked ? 'FancyChecked' : 'FancyUnchecked';
    // `other` contains { onClick: console.log } but not the checked property
    return (
      <div {...other} className={fancyClass} />
    );
  }
});
React.render(
  <FancyCheckbox checked={true} onClick={console.log.bind(console)}>
    Hello world!
  </FancyCheckbox>,
  document.body
);
```

> Note
> 
> 上面的例子中, `checked` prop 也是个有效的 DOM 属性. 如果你不用这种方式解构, 你可能不经意间直接传递进来了.

在转接未知的其他属性时, 都要使用这种解构模式.

```javascript
var FancyCheckbox = React.createClass({
  render: function() {
    var fancyClass = this.props.checked ? 'FancyChecked' : 'FancyUnchecked';
    // ANTI-PATTERN: `checked` would be passed down to the inner component
    return (
      <div {...this.props} className={fancyClass} />
    );
  }
});
```

## 使用并转接相同的 Prop

如果你的组件既想做一些处理, 又想将他传递, 你可以通过明确指定重新传递 (`checked = {checked}`). 相比传入完整的 `this.props` 这种方案更加推荐, 因为这样更易重构和排错.

```javascript
var FancyCheckbox = React.createClass({
  render: function() {
    var { checked, title, ...other } = this.props;
    var fancyClass = checked ? 'FancyChecked' : 'FancyUnchecked';
    var fancyTitle = checked ? 'X ' + title : 'O ' + title;
    return (
      <label>
        <input {...other}
          checked={checked}
          className={fancyClass}
          type="checkbox"
        />
        {fancyTitle}
      </label>
    );
  }
});
```

> Note
> 
> 顺序很重要. 将你要使用的属性放在 `...other` 之前, 确保它们不会被覆盖. 上面的例子中我们就确保 input 属性的类型必须为 `checkbox`.

## 剩余和扩展属性 `...`

剩余属性允许你从一个对象中解析出余下的属性放置到一个新的对象中去. 在解构模式中, 它排除了索要已经列出的属性.

这是一个 ES7 的提议的应用.

```javascript
var { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };
x; // 1
y; // 2
z; // { a: 3, b: 4 }
```

> Note
> 
> 使用 [JSX 命令行工具](http://npmjs.org/package/react-tools) 带上 `--harmony` 标识开启实验性的 ES7 语法.

## 使用 Underscore 转接

如果你不使用 JSX, 你可以使用一个库来完成相同的模式. Underscore 支持 `_.omit` 来过滤掉属性和 `_extend` 来将属性复制到一个新对象上.

```javascript
var FancyCheckbox = React.createClass({
  render: function() {
    var checked = this.props.checked;
    var other = _.omit(this.props, 'checked');
    var fancyClass = checked ? 'FancyChecked' : 'FancyUnchecked';
    return (
      React.DOM.div(_.extend({}, other, { className: fancyClass }))
    );
  }
});
```
