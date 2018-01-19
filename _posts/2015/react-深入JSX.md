# 深入JSX
date: 2015-01-22 07:51:15
categories:
- 文档翻译
tags:
- react
- react 指南
---


[JSX](http://facebook.github.io/jsx/) 是一种 Javascript 语法扩展, 看起来类似于 XML. 使你能够在 React 中使用一个简单的语法转换.

## 为什么选 JSX?

你不必在 React中非要使用 JSX. 你可以单纯地使用原本的 JS. 但是, 我们强烈推荐使用 JSX 因为它简洁并且和定义带有树形树形结构的语法相似.

对应随意的开发着来说更为熟悉, 比如设计师.

XML 有着平衡开闭标签的好处.这让比起函数调用或者对象字面量来说更容易构建打算树.

它并没有更改 Javascript 的语法.

<!--more-->

## HTML 标签 vs. React 组件

React 既可以呈现 HTML 标签(字符串) 或者 React 组件(类)

为了呈现一个 HTML 标签, 只需要在 JSX 中使用小写标签名:

```javascript
var myDivElement = <div className="foo" />;
React.render(myDivElement, document.body);
```

为了呈现一个 React 组件, 仅仅需要创建一个大写字母开头的变量.

```javascript
var MyComponent = React.createClass({/*...*/});
var myElement = <MyComponent someProperty={true} />;
React.render(myElement, document.body);
```

React 的 JSX 使用大写和小写字母来区分本地的组件类和 HTML 标签.

> Note:
>
> 
> 因为 JSX 是 Javascript, 像是 `class` 和 `for` 这种标识符作为 XML 属性名称是不鼓励的.
> React DOM 组件希望 DOM 属性名分别为 `className` 和 `htmlFor`.

## 转化

React JSX 从一个类似 XML 的语法到原生的Javascript. XML 元素时, 属性和子代都会被转化为 `React.createElement` 的参数.

```javascript
var Nav;
// Input (JSX):
var app = <Nav color="blue" />;
// Output (JS):
var app = React.createElement(Nav, {color:"blue"});
```

注意为了能够使用 `<Nav />`, `Nav` 变量必须处于作用域中.

JSX 也允许使用 XML 语法制定子代:

```javascript
var Nav, Profile;
// Input (JSX):
var app = <Nav color="blue"><Profile>click</Profile></Nav>;
// Output (JS):
var app = React.createElement(
  Nav,
  {color:"blue"},
  React.createElement(Profile, null, "click")
);
```

使用 JSX 编译器来尝试 JSX 并看看它是如何被转化为原生的Javascript的. 
还有 HTML 到 JSX 的转化器来转化你的 HTML 到 JSX.

如果你像使用JSX, Getting Started 指南展示了如何完成安装.

> Note:
>
>  JSX 表达式总会被转化为一个 React 元素. 实际的过程可能有所不同.
>  一个优化的模式可以通过把 React 元素作为一个对象字面量内嵌入 `React.createElement` 绕过验证代码.

## 组件命名空间

如果在构建一个包含许多子代的组件, 比如一个表单, 你可能需要声明很多个变量:

```javascript
// 可笑的声明代码块
var Form = MyFormComponent;
var FormRow = Form.Row;
var FormLabel = Form.Label;
var FormInput = Form.Input;

var App = (
  <Form>
    <FormRow>
      <FormLabel />
      <FormInput />
    </FormRow>
  </Form>
);
``` 

为了让它更加简单和易用, 命名空间组件让你可以使用一个拥有其他组件作为它的属性的组件.

```javascript
var Form = MyFormComponent;

var App = (
  <Form>
    <Form.Row>
      <Form.Label />
      <Form.Input />
    </Form.Row>
  </Form>
);
```

要做到这点, 你仅仅需要创建你的 "子组件" 然后作为属性赋值给你的主组件.

```javascript
var MyFormComponent = React.createClass({ ... });

MyFormComponent.Row = React.createClass({ ... });
MyFormComponent.Label = React.createClass({ ... });
MyFormComponent.Input = React.createClass({ ... });
```

JSX 为在编译代码时正确处理这些.

```javascript

var App = (
  React.createElement(Form, null, 
    React.createElement(Form.Row, null, 
      React.createElement(Form.Label, null), 
      React.createElement(Form.Input, null)
    )
  )
);
```

> Note:
> 这个仅仅在 0.11 版本以上可用


## JavaScript 表达式

### 属性表达式

为了使用 一段Javascript 表达式作为一个属性的值, 将表达式包裹在一对花括号(`{}`)中而不是引号(`""`)中.

```javascript
// Input (JSX):
var person = <Person name={window.isLoggedIn ? window.name : ''} />;
// Output (JS):
var person = React.createElement(
  Person,
  {name: window.isLoggedIn ? window.name : ''}
);
```

### 子代表达式

同样, Javascript 表达式也可以用在表示子代上:

```javascript
// Input (JSX):
var content = <Container>{window.isLoggedIn ? <Nav /> : <Login />}</Container>;
// Output (JS):
var content = React.createElement(
  Container,
  null,
  window.isLoggedIn ? React.createElement(Nav) : React.createElement(Login)
);
```

### 注释

很容易在你的 JSX 中添加评论; 他们仅仅就是 JS 表达式. 你只需要在一个标签的子代内时在评论周围要包上 `{}`.

```javascript
var content = (
  <Nav>
    {/* child comment, put {} around */}
    <Person
      /* multi
         line
         comment */
      name={window.isLoggedIn ? window.name : ''} // end of line comment
    />
  </Nav>
);
```

> NOTE:
> 
> JSX 和 HTML 相似, 但是并不完全一致. 查看 JSX gotchas 获取其中关键的相异点.
