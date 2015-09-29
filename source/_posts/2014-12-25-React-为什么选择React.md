title: 为什么选择React
date: 2014-12-25 16:48:50
categories: 
- 文档翻译
tags: 
- react
- react 指南
---

React 是一个由 Facebook 和 Instagram 建立的用来创建用户界面Javascript库. 很多人认为 React 是 **[MVC](http://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)** 中的 **V** (视图)层.

<!--more-->

我们构建 React 是为了解决一个问题: **构建随时间数据不断变化的大规模应用**. 为为了达到这点, React 有两个宗旨.

### 简洁性

只需要表示出在特定时间点下你的应用的外观, React会在底层数据改变时自动管理所有的 UI 组件更新.

### 声明式

当底层数据改变时, React 类似点击了一次更新按钮, 但是只会更新变化的部分.

ps: 我的理解是当数据声明它某部分变化时, React 会更新相应的部分.

## 构建可组合的组件

React 都是关于构建复用组件的. 事实上, 使用 React **唯一**要做的是构建组件. 因为其良好的封装, 组件让代码易于复用, 测试, 容易划分.

## Give It Five Minutes

React 和很多共识相悖, 第一眼看去可能会觉得疯狂.在读这篇指南 [Give it five minutes](http://37signals.com/svn/posts/3124-give-it-five-minutes) 时, 这些疯狂的想法已经在 Facebook 和Instagram 中从里到外构建并使用了数以千计的组件了.

## Learn More

你可以从[这篇博客](http://facebook.github.io/react/blog/2013/06/05/why-react.html)中了解更多我们创造 React 的动机.

