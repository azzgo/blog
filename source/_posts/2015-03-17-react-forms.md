title: react-forms
categories:
  - 文档翻译
tags:
  - react
  - react指南
date: 2015-03-17 12:19:02
---

表单组件比如 `<input>`, `<textarea>`, `<option>` 不同其他原生的组件. 因为他们可以通过和用户交互更改状态. 这些组件提供了可以响应用户交互的接口.

<!--more-->

更多有关 `<form>` 的事件请查看 **Form Events**.


## 交互性的 Props

表单组件支持一些可以和用户交互的 props.

- `value`, 被 `<input>` 和 `<textarea>` 组件支持.
- `checked`, 被类型为 `checkbox` 或者 `radio` 的 `<input>` 组件支持.
- `selected`, 被 `option` 组件支持.

在 HTML 中, `<textarea>` 的值是通过设置其标签间的内容设置的. 在 React 中, 你应该只使用 `value` 替代.

表单组件允许监听所有设置在 `onChange` prop 的回调. `onChange` prop 会回应用户响应, 当:

- `<input>` 或者 `<textarea>` 的 `value` 改变了.
- `<input>` 的 `checked` state 变化了
- `<option>` 的 `selected` state 变化了

类似所有的 DOM 时间, `onChange` prop 被所有元素的组件支持, 并且可以用于监听时间的冒泡.

## 受约束的组件

一个设置了 `value` 的 `<input>` 是一个受约束的组件. 在一个受约束的 `<input>` 中, 渲染的元素的值永远都是 `value` prop 值. 例如:

```javascript
render: function() {
    return <input type="text" value="Hello!" />;
}
```

这个例子中, 输入的值永远是 Hello!. 任何用户的输入对这个渲染的元素没有效果, 因为 React 声明这个值永远是 `Hello!`. 如果你想回应用户的输入更新组件的值, 你可以使用 `onChange` 事件:

```javascript
 getInitialState: function() {
    return {value: 'Hello!'};
  },
 handleChange: function(event) {
    this.setState({value: event.target.value});
  },
 render: function() {
    var value = this.state.value;
    return <input type="text" value={value} onChange={this.handleChange} />;
  }
```

这个例子里面, 我们仅仅接受了用户输入最新的值, 并更新了 `<input>` 组件的 `value` prop. 这个模式使得对用户输入做出验证之类的操作变得容易, 例如:

```javascript
handleChange: function(event) {
    this.setState({value: event.target.value.substr(0, 140)});
  }
```

这个会接受受用户的输入但是截取前 140 个字符.

## 不受约束的组件

一个 `<input>` 如果没有提供一个 `value`(或者设置值为 `null`) 的话, 它就是一个不受约束的组件. 在一个不受约束的 `<input>` 中, 渲染元素的值会反映用户的输入:

```javascript
 render: function() {
    return <input type="text" />;
  }
```

这个组件最开始会以空输入框的形式呈现. 任何用户的输入将会立刻反映到渲染的元素上去. 如果你想监听值的变化, 你可以像在受约束的组件上一样使用 `onChange` 事件.

如果你想用一个非空的值初始化这个组件的值, 你可以提供一个 `defaultValue` prop. 例如:

```javascript
render: function() {
  return <input type="text" defaultValue="Hello!" />;
}
```

这个例子执行的效果很类似上面 **受约束的组件** 的例子.

类似地, `<input>` 支持 `defaultValue`, `<select>` 支持 `<defaultChecked`.

## 高级话题

### 为什么使用受约束的组件?

```javascript
  <input type="text" name="title" value="Untitled" />
```

渲染的时候初始化了一个值 `Untitled`. 当用户更新输入时, 这个节点的 value 属性也会更改. 然而, `node.getAttribute('value')` 仍然会返回初始化的值, `Untitled`.

不像 HTML, React 组件必须表示出任何时间下的视图状态, 不仅仅是初始化时刻下的. 例如, 在 React 中:

```javascript
render: function() {
  return <input type="text" name="title" value="Untitled" />;
}
```

因为这个方法描述了视图在任何时间点的状态, 这个输入文本的值应该永远都是 `Untitled`.

### Textara 的值

在 HTML 中, `<textarea>` 的值经常是由其包裹的内容决定的.

```javascript
  <!-- 反例: 不要这么做! -->
  <textarea name="description">This is the description.</textarea>
```

对于 HTML 来说, 这让开发者很容易能够提供跨多行的值. 然而, 因为 React 是 Javascript, 我们没有字符串的限制, 可以使用 `\n` 来处理多行. 而且我们已经有了 `value` 和 `defaultValue`, 这里包裹部分的角色很暧昧. 因为这个原因, 你不应该使用包裹内容来设置值.

```javascript
  <textarea name="description" value="This is a description." />
```

如果你决定使用包裹内容, 它的行为会和 `defaultValue` 相同.

## 选择的值

在一个 HTML 的 `<select>` 标签中, 仅仅需要在 `<option>` 上添加 `selected` 属性. 在 React中, 为了让组件更加易于操作, 下面的格式被采用:

```javascript
<select value="B">
    <option value="A">Apple</option>
    <option value="B">Banana</option>
    <option value="C">Cranberry</option>
</select>
```

为了处理一个不受约束的组件, 可以替代使用 `defaultValue`.

>Note:
>
>你可以传入一个数组给 `value` 属性, 这样允许你选择多个选项: `<select multiple={true} value={['B', 'C']}>`.