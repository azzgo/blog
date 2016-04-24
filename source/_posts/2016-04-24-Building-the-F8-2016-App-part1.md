title: 我们如何构建2016 F8 App的 Part1
date: 2016-04-24 11:51:26
categories:
- 文档翻译
tags:
- F8
- tutorial
---
在这个第一部分，我们会谈到我们如何筹划这个App的；在后面的部分章节我们会分享示例代码，讨论多平台设计的考量，分析app的数据层，解释我们的测试策略。

<!--more-->

## 改用React Native

在2015年的F8会议中，IOS版本的app已经使用React Native开发的了，但是Android版本还是使用的原生代码。在2015年之前，两个平台都使用的原生语言编写的。

自从React Native发布了Android版本，就出现了一个机会，减少App界面上的逻辑和UI代码。一些Facebook的小组已经可以在使用React Native时重用[85%左右的应用代码](https://code.facebook.com/posts/1189117404435352/react-native-for-android-how-we-built-the-first-cross-platform-react-native-app/)了。

React Native还有快速搭建可视化的组件原型的优势，可以和UI设计师紧密配合——具体的信息我们会在[part two](http://makeitopen.com/tutorials/building-the-f8-app/design/)讨论。

所以说，如果我们采用React Native，我们还需要考虑些什么？我们开始讨论吧。

## 选择数据层

在2014年和2015年F8的app都使用的[Parse Cloud Code](https://parse.com/)作为我们的数据后端。因此在我们开始筹划2016的app时，使用Parse能允许重用的以前数据结构，让我们更快的开始。

还有其他原因支持我们使用Parse——很多在app上显示的内容需要在大会临近和大会期间频繁地更新，并且需要无需技术专家（精通excel表格的除外）参与的情况更新。Parse Cloud的控制台很好的满足了这些要求。

综上考虑，Parse作为此次app开发的绝佳数据后端。但是考虑到[Parse Cloud Code平台关闭的声明](http://blog.parse.com/announcements/moving-on/)，我们决定使用新的开源的[Parse Server](http://blog.parse.com/announcements/moving-on/)和[Parse Dashboard](https://github.com/ParsePlatform/parse-dashboard)项目。

因为React Native并不需要和一个数据层紧密连接，比如在开发一个React Native应用中UI和app逻辑时可以使用简单的数据mock的形式开发。意味着只有数据的结构保持一致，你可以更换数据源而只需要较少的调整。对于F8 App来说，我们可以在开发完成后轻松地将Parse Cloud Code更换成开源的Parse Server。我们在[data part](http://makeitopen.com/tutorials/building-the-f8-app/data/)部分详细讨论。

## React Native的数据访问

为了将Parse和React Native结合到一起工作，有一个[Parse + React包](https://github.com/ParsePlatform/ParseReact)提供了必要的绑定，但是还是有些问题——因为大会期间的wifi连接情况变化多样，F8 App必须要能离线工作。因为当F8 App 发布后，Parse+React并能不支持离线同步数据，所以我们必须自己开发对离线支持。

还有另外一个因素影响做这个决定——小组的规模，比如Relay更适合在一个更大的小组中石油，但是F8 app只有一个人开发，加上少数几个人support设计。这对你在一个app中选择哪种数据获取方式有很大影响。

GraphQL和Ralay怎么样？虽然他们可以很好的和React Native一起工作，Ralay（[这个时间点](https://github.com/facebook/relay/wiki/Roadmap#in-progress)）并没有离线支持，并且GraphQL并不被Parse支持。如果在编写这个app时使用它们，那就必须构建一个GraphQL-Parse的API，并要hack出能为Relay提供离线存储支持的方法。

启动配置一个GraphQL server对一个有着短期Deadline的人非常困难。考虑到这个app需要发布到app store，我们需要简单高效的选择，有其他方案么？

综上，Redux成了这个app的最佳选择。Redux提供了Flux架构的简单实现，提供了更多对于数据存储和缓存的控制，基本支持了从Parse Cloud一次性同步到App。

对于App存储版本，Redux提供最佳的功能和app易用直接的平衡。App发布后，我们重新审视这个App,并引入了Relay和GraphQL，我们会在[Relay and GraphQL Addendum](http://makeitopen.com/tutorials/building-the-f8-app/relay/)中详细叙述。

## 我们的开发技术栈

使用React Native作为我们app的框架，Redux作为数据层，我们需要引入一些技术和工具支持：

- 开源的[Parse Server](https://github.com/ParsePlatform/parse-server)提供数据存储，在[Node.js](https://nodejs.org/en/)上运行
- [Flow](http://flowtype.org/)能捕获React Native中的Javascript代码的类型错误
- 单元测试，使用[Jest framework](http://facebook.github.io/jest/)运行我们书写更加复杂的测试。
- 我们使用[React Native Facebook SDK](https://github.com/facebook/react-native-fbsdk)为Android何ios提供快速的Facebook服务整合。
- 我们使用Facebook的[Nucide](http://nuclide.io/)编辑器开发，它[內建支持React Native](http://nuclide.io/docs/platforms/react-native/)。
- 我们使用git作为版本控制，并且在[Github](https://github.com/fbsamples/f8app)上跟踪开发进展。

还有一些小的类库，我们会在接下来的教程中提到时高亮提示。

在您继续浏览之前，我们推荐你先学习一些基础知识，以便更好的理解。

- [React.js from the project’s own tutorial](http://facebook.github.io/react/docs/tutorial.html)
- [concept of modular components](http://facebook.github.io/react/docs/thinking-in-react.html#step-1-break-the-ui-into-a-component-hierarchy)
- [JSX syntax](http://facebook.github.io/react/docs/jsx-in-depth.html)
- [follow React Native’s introductory tutorial](http://facebook.github.io/react-native/docs/tutorial.html#content)