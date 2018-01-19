# React Demo

最近看 Facebook 的 React 库, 有篇[文章](http://ourjs.com/detail/5483d2d10dad0fbb6d000014)可以读下, 蛮有意思的, 预测了下15年js开发的走向.

<!--more-->

恩, 这个demo是一个精简的幻灯片, 四张水果的背景图, 每张上面有文字描述, 下面有radio按钮用来切换图片.

大致的示意图差不多这个样子

![示意图](http://loomla.qiniudn.com/images/demo-sketch.png)

React 需要构建组件, 从外到里吗我构建这么几个组件

- CarouseBox 最外层的组件, 用来管理状态, 并提供显示范围的可视区
	- div 一层盒子用来包含所有的幻灯片
		- CarouselPane * 4 幻灯片组件, 用来负责每一个幻灯片的呈现
	- div 按钮组, 放置交互用的按钮
		- FloatingActionButton 放置 prev 按钮, 点击切换到前一张幻灯片
		- IconButton * 4 四个 Radio 按钮, 可以点击切换幻灯片, 也用来显示当前幻灯片位子
		- FloatingActionButton 放置 next 按钮, 点击切换到下一张幻灯片
		
整个 deme 我使用了 react 和 [material-ui](http://material-ui.com/) 库. 其中 material-ui 库是基于 react 和 Google 的 Material Design 设计语言开发的 UI 库, deme 中的按钮组件就是使用里面的组件.

首先我们需要先将 React 中的虚拟 DOM 书写出来, 基本是这个样子

```javascript
var CarouselBox = React.createClass({
 render: function() {
  return (
   <div>
	<div>
	  <CarouselPane active={true} img="1" title="苹果">
		苹果是种低热量食物，每100克只产生60千卡热量；苹果中营养成份可溶性大，易被人体吸收，故有“活水”之称。有利于溶解硫元素，使皮肤润滑柔嫩。苹果中还有铜、碘、锰、锌、 钾等元素，人体如缺乏这些元素，皮肤就会干燥、易裂、奇痒。把它敷在黑眼圈的地方，可以助于消除黑眼圈。
	</CarouselPane>							<CarouselPane img="2" title="草莓">
	    草莓营养价值高，含丰富的维生素C ，有帮助消化的功效，与此同时，草莓还可以巩固齿龈，清新口气，润泽喉部。春季人的肝火往往比较旺盛，吃点草莓可以起到抑制作用。另外，草莓最好在饭后吃，因为其含有大量果胶及纤维素，可促进胃肠蠕动、帮助消化、改善便秘，预防痔疮、肠癌。
    </CarouselPane>
    <CarouselPane img="3" title="番茄">
	  番茄营养丰富，具特殊风味。具有减肥瘦身、消除疲劳、增进食欲、提高对蛋白质的消化、减少胃胀食积等功效。
	</CarouselPane>
	<CarouselPane img="4" title="猕猴桃">
	   蒲江猕猴桃具有“果形美观、香气浓郁、酸甜爽口、风味独特、营养丰富”的独特品质。因其果实含有丰富的维生素C、钙、铁、碳水化合物、脂肪、蛋白质以及多种人体需要的氨基酸，营养十分丰富，深受广大消费者喜爱。
	</CarouselPane>
   </div>	
   <div>
   	<FloatingActionButton icon="hardware-keyboard-arrow-left" secondary={true} />
	<IconButton className="btn btn-apple" icon="toggle-radio-button-on" tooltip="苹果"  />
	<IconButton className="btn btn-rasberry" icon="toggle-radio-button-off" tooltip="草莓" onClick={this.handleRasberry} />
	<IconButton className="btn btn-tomato" icon="toggle-radio-button-off" tooltip="番茄" />
	<IconButton className="btn btn-kiwi" icon="toggle-radio-button-off" tooltip="猕猴桃" } />
	<FloatingActionButton  icon="hardware-keyboard-arrow-right" secondary={true} />
   </div>
</div>
 )}
})
```

然后我们需要添加一些事件处理器来处理按钮的交互设置, 这里使用 React 中的状态来管理不同幻灯片的呈现

```javascript
var CarouselBox = React.createClass({
  // 初始化状态
  getInitialState: function() {
    return {choosed: 1};
  },
  // 所有的事件都会调用的函数, 用来处理状态的改变和动画的处理
  handleClick: function (num) {
    var box = this.refs.handleBox.getDOMNode();
    var texts = box.getElementsByTagName('p');
    for(var i = 0; i< texts.length; i++) {
      texts[i].className = "";
    }
    box.style.transform = "translateX(-" + (num - 1) * 25 + "%)";
    setTimeout(function(){texts[num-1].className = "active";}, 500);
    this.setState({choosed: num});
  },
  handleApple: function() {
    this.handleClick(1);
  },
  handleRasberry: function () {
    this.handleClick(2);
  },
  handleTomato: function () {
    this.handleClick(3);
  },
  handleKiwi: function () {
    this.handleClick(4);
  },
  handlePrev: function () {
    if (this.state.choosed > 1) {
      this.handleClick(this.state.choosed - 1);
    }
  },
  handleNext: function () {
    if (this.state.choosed < 4) {
      this.handleClick(this.state.choosed + 1);
    }
  },
  ...
```

为了可以访问到DOM, 这里我使用了 React 的 ref:

```javascript
<div ref="handleBox">
  <CarouselPane active={true} img="1" title="苹果">
    苹果是种低热量食物，每100克只产生60千卡热量；苹果中营养成份可溶性大，易被人体吸收，故有“活水”之称。有利于溶解硫元素，使皮肤润滑柔嫩。苹果中还有铜、碘、锰、锌、 钾等元素，人体如缺乏这些元素，皮肤就会干燥、易裂、奇痒。把它敷在黑眼圈的地方，可以助于消除黑
  </CarouselPane>
...
```

然后再上门的 js 代码中使用了 ref 的 getDOMNode 方法

```javascript
var box = this.refs.handleBox.getDOMNode();
```

最后在按钮上添加了点击事件, 在组件上添加了样式的完整代码如下所示

```javascript
var React = require('react');
var mui = require('material-ui');

// 组件
var FloatingActionButton = mui.FloatingActionButton;
var IconButton = mui.IconButton;

var injectTapEventPlugin = require("material-ui/node_modules/react-tap-event-plugin");
//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

var CarouselBox = React.createClass({
  getInitialState: function() {
    return {choosed: 1};
  },
  handleClick: function (num) {
    var box = this.refs.handleBox.getDOMNode();
    var texts = box.getElementsByTagName('p');
    for(var i = 0; i< texts.length; i++) {
      texts[i].className = "";
    }
    box.style.transform = "translateX(-" + (num - 1) * 25 + "%)";
    setTimeout(function(){texts[num-1].className = "active";}, 500);
    this.setState({choosed: num});
  },
  handleApple: function() {
    this.handleClick(1);
  },
  handleRasberry: function () {
    this.handleClick(2);
  },
  handleTomato: function () {
    this.handleClick(3);
  },
  handleKiwi: function () {
    this.handleClick(4);
  },
  handlePrev: function () {
    if (this.state.choosed > 1) {
      this.handleClick(this.state.choosed - 1);
    }
  },
  handleNext: function () {
    if (this.state.choosed < 4) {
      this.handleClick(this.state.choosed + 1);
    }
  },
  render: function() {
    return (
      <div className="carousel" >
        <div ref="handleBox" className="carousel-box">
          <CarouselPane active={true} img="1" title="苹果">
            苹果是种低热量食物，每100克只产生60千卡热量；苹果中营养成份可溶性大，易被人体吸收，故有“活水”之称。有利于溶解硫元素，使皮肤润滑柔嫩。苹果中还有铜、碘、锰、锌、 钾等元素，人体如缺乏这些元素，皮肤就会干燥、易裂、奇痒。把它敷在黑眼圈的地方，可以助于消除黑眼圈。
          </CarouselPane>
          <CarouselPane img="2" title="草莓">
            草莓营养价值高，含丰富的维生素C ，有帮助消化的功效，与此同时，草莓还可以巩固齿龈，清新口气，润泽喉部。春季人的肝火往往比较旺盛，吃点草莓可以起到抑制作用。另外，草莓最好在饭后吃，因为其含有大量果胶及纤维素，可促进胃肠蠕动、帮助消化、改善便秘，预防痔疮、肠癌。
          </CarouselPane>
          <CarouselPane img="3" title="番茄">
            番茄营养丰富，具特殊风味。具有减肥瘦身、消除疲劳、增进食欲、提高对蛋白质的消化、减少胃胀食积等功效。
          </CarouselPane>
          <CarouselPane img="4" title="猕猴桃">
            蒲江猕猴桃具有“果形美观、香气浓郁、酸甜爽口、风味独特、营养丰富”的独特品质。因其果实含有丰富的维生素C、钙、铁、碳水化合物、脂肪、蛋白质以及多种人体需要的氨基酸，营养十分丰富，深受广大消费者喜爱。
          </CarouselPane>
        </div>
        <div className="btns-box">
          <FloatingActionButton className="prev" icon="hardware-keyboard-arrow-left" secondary={true} disabled={this.state.choosed === 1} onClick={this.handlePrev} />
          <IconButton className="btn btn-apple" icon={this.state.choosed === 1 ? "toggle-radio-button-on": "toggle-radio-button-off"} tooltip="苹果"  onClick={this.handleApple} />
          <IconButton className="btn btn-rasberry" icon={this.state.choosed === 2 ? "toggle-radio-button-on": "toggle-radio-button-off"} tooltip="草莓" onClick={this.handleRasberry} />
          <IconButton className="btn btn-tomato" icon={this.state.choosed === 3 ? "toggle-radio-button-on": "toggle-radio-button-off"} tooltip="番茄"  onClick={this.handleTomato} />
          <IconButton className="btn btn-kiwi" icon={this.state.choosed === 4 ? "toggle-radio-button-on": "toggle-radio-button-off"} tooltip="猕猴桃"  onClick={this.handleKiwi} />
          <FloatingActionButton className="next" icon="hardware-keyboard-arrow-right" secondary={true} disabled={this.state.choosed === 4} onClick={this.handleNext}/>
        </div>
      </div>
    );
  }
});

var CarouselPane = React.createClass({
  render: function() {
    return (
      <div className={"carousel-item bg bg-" + this.props.img}>
        <h1>{this.props.title}</h1>
        <p className={this.props.active === true ? "active" : ""}>{this.props.children}</p>
      </div>
    );
  }
});

React.render(
  <CarouselBox />,
  document.body
);
```

对应的 less 如下

```less
@import "node_modules/material-ui/src/less/scaffolding.less";

// Define a custom less file to override any variables defined in scaffolding.less
@import "my-custom-overrides.less";

@import "node_modules/material-ui/src/less/components.less";

// 自定义样式

.carousel {
    position: relative;
    height: 100%;
    width: 100%; 
    overflow: hidden;
    .carousel-box {
        transition: all 800ms ease-in;
        position: absolute;
        left: 0%;
        height: 100%;
        width: 400%;
        .carousel-item {
            display: inline-table;
            height: 100%;
            width: 25%;
            padding-top: 18vh;
            &:after {
                content: '';
                position: absolute;
                top: 15%;
                width: 100%;
                height: 60%;
                max-height: 270px;
                background: rgba(255, 255, 255, 0.3);
            }
            h1 {
                position: relative;
                z-index: 2;
                text-align: center;
                color: @pink-500;
                font-size: 40px;
            }
            p {
                position: relative;
                z-index: 2;
                text-indent: 1.5em;
                margin: 30px auto;
                width: 60%;
                min-width: 300px;
                color: @deep-purple-900;
                font-size: 20px;
                transition: all 400ms ease;
                opacity: 0;
            }
            .active {
                transform: translateY(-30px);
                opacity: 1;
            }
        }
    }
}


.btns-box {
    position: absolute;
    z-index: 2;
    bottom: 30px;
    width: 100%;
    display: table-cell;
    text-align: center;

    .btn {
        color: @red-300;
    }
    .prev {
        bottom: 0px;
    }

    .next {
        bottom: 0px;
    }
}

.bg {
    background-size: auto 130%;
    background-position: center;
    background-repeat: no-repeat;
    &.bg-1 {
        background-color: red;
        background-image: url(http://loomla.qiniudn.com/mui/img/1.jpg);
    }
    &.bg-2 {
        background-color: red;
        background-image: url(http://loomla.qiniudn.com/mui/img/2.jpg);
    }
    &.bg-3 {
        background-color: red;
        background-image: url(http://loomla.qiniudn.com/mui/img/3.jpg);
    }
    &.bg-4 {
        background-color: green;
        background-image: url(http://loomla.qiniudn.com/mui/img/4.jpg);
    }
}
```

demo的地址我放在我的域名下了.

[demo](http://p.azzfun.net/app/mui-demo/)




