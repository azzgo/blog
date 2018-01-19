title: JSX扩展
date: 2015-01-22 07:55:09
categories:
- 文档翻译
tags:
- react
- react 指南
---


如果你知道你提早世道你想放到一个组件上的属性的话, 使用 JSX 非常简单:

```javascript
  var component = <Component foo={x} bar={y} />;
```

<!--more-->

## 可变 Props 不好

如果你不知道你想设置的属性, 你可能会试图以后添加到对象上去.

```javascript
  var component = <Component />;
  component.props.foo = x; // bad
  component.props.bar = y; // also bad
```
这是反模式的, 因为这意味着我们不能检测出正确的属性类型. 这意味难以追踪你的属性类型错误(propTypes errors).

这个 prop 应该被考虑为是不可变的. 可变的 prop 对象可能会导致不可预知的后果, 这点上一个冻结的对象会比较完美.

## Spread Attributes

现在你可以试试 JSX 中被称作 spread attributes 的新特性:

```javascript
  var props = {};
  props.foo = x;
  props.bar = y;
  var component = <Component {...props} />;
```

这个你传入的属性的对象是组建 prop 的副本.

你可以将这个属性应用到多个组建上. 需要说明的是顺序非常重要, 后面的属性会覆盖前面的.

```javascript
  var props = { foo: 'default' };
  var component = <Component {...props} foo={'override'} />;
  console.log(component.props.foo); // 'override'
```

## 这奇异的 `...` 符号是个啥?

`...` 操作符(或者叫 spread 操作符) 在  [ES6中数组](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator)已经获得支持了. 也有一项关于 [Object Rest and Spread Properties](https://github.com/sebmarkbage/ecmascript-rest-spread) 的 ES7 的提议 . 我们利用这些获得支持和开发中的标准来在 JSX 中提供更加简洁的语法.
