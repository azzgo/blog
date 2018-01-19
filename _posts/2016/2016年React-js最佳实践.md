# 2016年React.js最佳实践
date: 2016-02-10 15:03:34
categories:
- 文档翻译
tags:
- react best-practice redux flux
---

原文：RisingStack的CTO Péter Márton写的[React.js Best Practices for 2016](https://blog.risingstack.com/react-js-best-practices-for-2016/?utm_source=javascriptweekly&utm_medium=email)

<!--more-->
2015年是React的年份，出现了数不清的发布和开发者大会。关于去年这些重要里程碑的详细情况，可以查看[React in 2015这份清单](https://blog.risingstack.com/react-in-2015/)

2016年最有趣的问题是：我们应该如何编写一份应用程序，有哪些推荐的类库？

> 作为一名长时间使用React.js工作的开发者，我有一套自己的答案和最佳实践，可能你并不是每一点都和我达成一致。你有任何意见和点子都欢迎留下评论，这样我们可以详细讨论。

如果你刚刚接触React.js，请查看我们的[React.js 教程](https://blog.risingstack.com/the-react-way-getting-started-tutorial/)或者Pete Hunt的[React howto](https://github.com/petehunt/react-howto)

## 处理数据

在React应用程序中处理程序非常容易，但是难在同时处理。

你可以通过多种方式给React组件传入属性来构建渲染树，然而你应该用哪种方式更新你的View并不是一直都很确切的。

2015年随着许多不同的flux类库的发布，持续出现了更多函数式和响应式的解决方案。

我们看下现在的情况

### Flux

根据我的经验，Flux经常被过度使用（就是说人们经常在不需要使用它的时候使用了）

Flux提供了一个干净的方法来储存和更新你应用的state并在需要的时候触发渲染。

Flux对管理App全局状态非常有用：管理用户登录，路由状态或者激活账号。但是如果你开始用来管理你的临时和局部数据时会非常痛苦。

我们并不推荐使用Flux管理路由相关的数据，类似`/item/:itemId`。相反你只需要在你的组件中获得和储存状态就可以了。这种情形下，当你的组件销毁时，局部状态会随之销毁。

如果你需要更多地了解Flux，[The Evolution of Flux Frameworks](https://medium.com/@dan_abramov/the-evolution-of-flux-frameworks-6c16ad26bb31#.90lamiv5l)非常值得阅读。

### 使用Redux

> Redux是一个对应JavaScript应用来说可预测的状态容器。

如果你认为你需要使用Flux或者一个类似的解决方案，你应该看看[redux](https://github.com/rackt/redux)和[Dan Abramov](https://twitter.com/dan_abramov)的[Getting started with redux](https://egghead.io/series/getting-started-with-redux)课程。

> Redux在Flux点子基础上更进一步，并且避免了其复杂性。

### 确保你的State扁平

API经常返回一个嵌套的资源。这样可能在一个Flux钟或者基于Redux的架构中不好处理。我们推荐使用类似[normalizr](https://github.com/gaearon/normalizr)的库将数据扁平化，并且__尽可能保持你的state扁平__

正面提示:

```javascript
const data = normalize(response, arrayOf(schema.user))

state = _.merge(state, data.entities)  
```

（我们推荐使用[isomorphic-fetch](https://www.npmjs.com/package/isomorphic-fetch)访问我们的API）

### 使用immutable state

> 共享可变的state是罪恶之源 —— Pete Hunt, React.js Conf 2015

[Immutable 对象](https://en.wikipedia.org/wiki/Immutable_object)使用一个在创建后便不可用改变其状态的对象。

Immutable 对象可以治好我们的头痛并且能通过引用引用判等__提升渲染的性能__。类似在`shouldComponentUpdate`：

```javascript
shouldComponentUpdate(nexProps) {  
 // instead of object deep comparsion
 return this.props.immutableFoo !== nexProps.immutableFoo
}
```

#### 如何在JavaScrpt中实现immutability?

关键之处在于需要小心的书写类似下面例子的房子，你需要一直在单元测试中检查[deep-freeze-node](https://www.npmjs.com/package/deep-freeze-node)（在变化之前冻结，在之后验证结果）

```javascript
return {  
  ...state,
  foo
}

return arr1.concat(arr2)  
```

相信我，这些都是非常明白的例子。

简单一些也不那么原生的一种就是使用[immutable.js](https://facebook.github.io/immutable-js/)

```javascript
import { fromJS } from 'immutable'

const state = fromJS({ bar: 'biz' })  
const newState = foo.set('bar', 'baz')
```

Imuutable.js是快速的，蕴含在其中的想法是美丽的。我推荐观看[Lee Byron](https://twitter.com/leeb)的[Immutable Data and React](https://www.youtube.com/watch?v=I7IdS-PbEgI)，即便你并不想使用它。能帮助你深入了解其工作方式。

### Observables和Reactive解决方案

如果你不喜欢Flux/Redux或者说想要更加响应式，不要失望！有另外的方案可以处理你的数据。这有一份你可能需要的类库清单：

- [cycle.js](http://cycle.js.org/)（一个函数响应式Javascript框架）
- [rx-flux](https://github.com/fdecampredon/rx-flux)（结合Flux架构的RxJs)
- [redux-rx](https://github.com/acdlite/redux-rx)(一份关于Redux的RxJs工具集）
- [mobservable](https://mweststrate.github.io/mobservable/)（Observable数据,响应式函数，简洁的代码）

## 路由

几乎所有的客户端应用程序都有路由。如果你在浏览器中使用React.js，你会遇到需要一些库来解决的瓶颈。

我们的选择是[rackt](https://github.com/rackt)社区的[react-router](https://github.com/rackt/react-router). Rackt总是有些React粉丝喜爱的高质量资源。

为了整合`react-router`需要查阅他们的[文档](https://github.com/rackt/react-router/tree/master/docs)，但是更加重要的是：如果你在使用Flux/Redux的话，我们推荐__保持你们的路由状态__和你么的store状态/全局状态保持一致。

一致的路由状态可以帮助你更好的通过Flux/Redux的Actions来控制路由行为。

Redux的用户可以通过[react-router-redux](https://github.com/rackt/react-router-redux)库直接做的这点。

### 代码分离，懒加载

只有一小部分`webpack`用户知道可以通过将你的应用代码分割成不同的bundler，输出多个JavasScript块：

```javascript
require.ensure([], () => {  
  const Profile = require('./Profile.js')
  this.setState({
    currentComponent: Profile
  })
})
```

这个方案极其有用，因为这样用户的浏览器就不用下载基本不使用的代码了。

使用更多的chunk必定造成更多的HTTP请求——但是在[HTTP/2 multiplexed](https://http2.github.io/faq/#why-is-http2-multiplexed)技术下不是什么问题。

结合[chunk哈希](https://christianalfoni.github.io/react-webpack-cookbook/Optimizing-caching.html)你可以在每次代码更改后优化你的缓存比例。


下一个版本的react-router会大幅优化代码分割。

关于react-router未来的特性，请查询[Ryan Florence](https://twitter.com/ryanflorence)发布的博客[Welcome to Future of Web Application Delivery](https://medium.com/@ryanflorence/welcome-to-future-of-web-application-delivery-9750b7564d9f#.vuf3e1nqi)

## 组件

很多人都抱怨过JSX。但是首先，你需要知道一点，在React中JSX是可选的。

最后，JSX的代码会被Babel编译为普通的JavaScript。所有你可以不使用JSX直接编写JavaScript代码，但是当你使用JSX时候书写HTML时感觉会更自然。

> JSX是一种JavaScript语法的扩展，看起来有点像XML。你可以在React中使用简单的JSX语法编译器。——[JSX in depth](https://facebook.github.io/react/docs/jsx-in-depth.html)

如果想了解更多JSX的信息，可以查阅[JSX Looks Like An Abomination - But it's Good for You](https://medium.com/javascript-scene/jsx-looks-like-an-abomination-1c1ec351a918#.ca28nvee6)

### 使用类

React和ES2015的类能很好的结合工作。

```javascript
class HelloMessage extends React.Component {  
  render() {
    return <div>Hello {this.props.name}</div>
  }
}
```

我们倾向高阶组件而不是mixins。仍然选择`createClass`更像是个语法问题而不是技术问题。我们相信使用`createClass`而不是`React.Component`并没有什么错，反之亦然。

### PropType

如果你仍然不检查组件的属性，你应该在2016年开始了。这样做可以为你节约数小时的时间，相信我。

```javascript
MyComponent.propTypes = {  
  isLoading: PropTypes.bool.isRequired,
  items: ImmutablePropTypes.listOf(
    ImmutablePropTypes.contains({
      name: PropTypes.string.isRequired,
    })
  ).isRequired
}
```

是的，可以通过[react-immutable-proptypes](https://www.npmjs.com/package/react-immutable-proptypes)来验证Immutable.js属性

### 高阶组件

现在[mixins are dead](https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750)，并且不被ES6的类组件语法支持，我们应该寻找一个不同的方案。

什么事高阶组件？

```javascript
PassData({ foo: 'bar' })(MyComponent)  
```

基本上，你可以compose一个原来的组件并扩展其行为来获得一个新的组件。你可以在多种场景下使用，比如认证：`requireAuth({role: 'admin'})(MyComponent)（在高阶组件中验证用户是否登录，并在未登录后重定向）或者将你们的组件和Flux/Redux store连接起来。

在RisingStack，我们推荐分离获取数据和控制逻辑到高阶组件中去，保持我们的View尽可能简单。

## 测试

测试和测试覆盖率在开发周期中非常重要。幸运的是，React.js社区总结了些非常棒的库来帮助我们实现这点。

### 组件测试

我们最喜欢的测试库是Airbnb的[enzyme](https://github.com/airbnb/enzyme)。使用它的shallow render特性，你可以测试逻辑和组件的渲染输出，非常的棒。但是仍然不能替代你的selenium测试，但是你可以子啊前端测试中上一个台阶。

```javascript
it('simulates click events', () => {  
  const onButtonClick = sinon.spy()
  const wrapper = shallow(
    <Foo onButtonClick={onButtonClick} />
  )
  wrapper.find('button').simulate('click')
  expect(onButtonClick.calledOnce).to.be.true
})
```

看起来非常整洁，对吧？

你想使用chai作为断言库？你可能会喜欢[chai-enyzime](https://github.com/producthunt/chai-enzyme)

### Redux 测试

__测试一个Reducer__应该非常容易，它仅仅响应一个action并改变之前的state为一个新的state：

```javascript
it('should set token', () => {  
  const nextState = reducer(undefined, {
    type: USER_SET_TOKEN,
    token: 'my-token'
  })

  // immutable.js state output
  expect(nextState.toJS()).to.be.eql({
    token: 'my-token'
  })
})
```

__测试actions__也很简单，除了异步的那种。为了测试异步的redux action我们推荐使用[redux-mock-store](https://www.npmjs.com/package/redux-mock-store)，它会帮到你的。

```javascript
it('should dispatch action', (done) => {  
  const getState = {}
  const action = { type: 'ADD_TODO' }
  const expectedActions = [action]

  const store = mockStore(getState, expectedActions, done)
  store.dispatch(action)
})
```

关于更一步的[redux 测试](http://rackt.org/redux/docs/recipes/WritingTests.html)请访问其官方文档。

### 使用 npm

虽然React.js可以很好的在没有code bundle的情况下工作，但是我们还是推荐使用[Webpack](https://webpack.github.io/)或者[Browserify](http://browserify.org/)，能够用到强大的npm。Npm有着非常多高质量的React.js包，并且可以很好地管理你的依赖。

(请不要忘记复用你的componnents，这是一种很好的优化你的代码的方式）

### Bundle size

这个问题并不是React相关的，但是因为很多人都会Bundle他们的React应用，我觉得在这里提及一下非常有必要。

当你在bunle你的源代码时，你应当一直清楚你的bundle文件的大小。为了使文件大小最小，你应该考虑你引入依赖。

考虑下面的代码片段，两种不同的方式会导致输出文件大小有很大的不同：

```javascript
import { concat, sortBy, map, sample } from 'lodash'

// vs.
import concat from 'lodash/concat';  
import sortBy from 'lodash/sortBy';  
import map from 'lodash/map';  
import sample from 'lodash/sample';  
```

查看[Reduce Your bundle.js File Size By Doing This One Thing](https://lacke.mn/reduce-your-bundle-js-file-size/)获得更深入了解。

我们也竟然喜欢将代码分割为至少`vendors.js`和`app.js`两个文件，因为vendors相比我们的基础代码更新比较小。

通过对输出文件名称hash，并长时间缓存，我们可以在需要的时候动态减少代码的尺寸。

如果你刚接触Webpack,可以查看这篇文件[React webpack cookbook](https://christianalfoni.github.io/react-webpack-cookbook)

### 组件级别热加载

如果你曾使用livereload写过单页应用，你可能知道当你在一些状态管理上非常恼火，当你在你的编辑器中保持新的代码后必须重载整个页面。你必须重新走一遍应用各种操作，如果你经常做这些事，会疯的。

在React中，可以重载一个组件，并保持其状态，boom，世上再也没有痛苦了。

设置参考[react-transform-boilerplate](https://github.com/gaearon/react-transform-boilerplate)

### 使用ES2015

我提到过在使用JSX时，我们会通过[Babel.js](https://babeljs.io/)来编译。

Babel可以做更多的事，让我们可以在今天为浏览器书写ES6/ES2015的代码。在RisingStack，我们在浏览器和服务器端都使用ES2015的特性。

### Linters

可能你已经在为你的Javascript代码使用了一份style guide，但是你知不知道这还有专门为React的style guide?我们高度推荐选择一份并遵循它。

在Rising Stack, 我们不仅在CI系统上跑Linter也在`git push`时运行linter。详细查看[pre-push](https://www.npmjs.com/package/pre-push)和[pre-commit](https://www.npmjs.com/package/pre-commit)

我们使用[eslint-plugin-react](https://www.npmjs.com/package/eslint-plugin-react)作为我们React.js代码的标准格式。

（我们不在使用任何分号）

## GraphQL 和 Relay

GraphQL和Relay是相对比较新的技术。在RisingStack，我们现在并不会在产品中使用它们。

我们写了一个库叫做[graffiti](https://github.com/risingstack/graffiti)，是一个为Relay设计的MongoDB的ORM，允许通过已有的mongoose models创建一个GraphQL服务。如果你对这些新技术感兴趣，推荐你查看下，并在本地玩一玩。

##  从这些React.js最佳实践拿走你需要的

文件有些强调的技术和类库和React.js并不相关 ——但是永远保持视野开阔, 并关注社区的动向。React社区在2015年受到[Elm architecture](https://github.com/evancz/elm-architecture-tutorial/) 的很多启发。
