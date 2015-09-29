title: react表单demo
categories:
- coding
tags:
- demo
- react
date: 2015-03-22 15:55:33
---

react 文档看到差不多了, 根据网上的一个登录表单psd文件, 写了个demo, 权当练手.

![demo效果](http://loomla.qiniudn.com/images/form1-result.jpg "demo效果")

[demo效果地址](http://p.azzfun.net/app/form1/)

<!--more-->

我也不太会写教程, 就直接贴代码了, 写一些注释希望能便于理解
<br />

html文档基本没什么好说的, 基本的html5骨架

```html
<!doctype html>
<html>
<head>
  <meta charset="UTF-8">
  <title>表单demo</title>
  <link rel="stylesheet" href="form.css">
</head>
<body>
  <script src="form.js"></script>
</body>
</html>
```

less代码

```less
out: form.css


html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}

body {
  border-top: 1px solid transparent;
  min-height: 610px;
  background: url(bg.png) no-repeat no-repeat;
  background-color: #69A41E;
  background-size: 100% 100% ;
}

.form-board {
  background: rgba(255,253,253,0.20);
  // 利用内阴影实现表单框的立体效果, 在输入框和按钮上也有类似的用法
  // box-shadow 第一个参数加上 insert 将实现内阴影效果
  box-shadow: inset -3px -3px 0px 0px rgba(0,0,0,0.30), inset 3px 3px 0px 0px rgba(255,255,255,0.39);
  width: 659px;
  height: 390px;
  margin: 200px auto 0;
  padding-top: 1px;
  & > form{
    display: block;
    height: 100%;
    width: 100%;
  }
}

.form-group{
  width: 535px;
  height: 65px;
  position: relative;
  & input{
    border: none;
  }
  &.email-group {
    margin: 54px auto 0;
  }
  & .email-field{
    background: rgba(1,44,70,0.51);
    font-size: 28px;
    color: #fff;
    padding-left: 25px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    box-shadow: inset -2px 2px 3px 0px rgba(0,0,0,0.50), inset 2px -3px 1px 0px rgba(255,255,255,0.60);
    width: 100%;
    height: 100%;

    &:focus{
      box-shadow: 0px 0px 5px 5px #5677FC;
      border: 1px solid #5677FC;
    }
  }
  & .email-label {
    position: absolute;
    left: 25px;
    top: 15px;
    font-family: Georgia, serif;
    font-size: 27.15px;
    color: #ECF1ED;
    line-height: 32px;
    cursor: text;
    // 对email上的label在点击表单情况下会隐藏, 不影响输入, 对此加入了动画效果看上去更加舒服
    // 下面的password输入的label也有一样的实现
    -webkit-transition: 0.5s all ease-out;
    -moz-transition: 0.5s all ease-out;
    transition: 0.5s all ease-out;

    &.fade-out{
      opacity: 0;
      -webkit-transform: translateY(-30px);
      -moz-transform: translateY(-30px);
      transform: translateY(-30px);
    }
}

  & .email-icon {
    position: absolute;
    right: 26px;
    top: 22px;
  }

  &.pass-group{
    margin: 33px auto 0;
  }

  & .pass-field {
    font-size: 28px;
    color: #fff;
    padding-left: 25px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    background: rgba(1,44,70,0.51);
    box-shadow: inset -2px 2px 3px 0px rgba(0,0,0,0.50), inset 2px -3px 1px 0px rgba(255,255,255,0.60);
    width: 100%;
    height: 100%;

    &:focus{
      box-shadow: 0px 0px 5px 5px #5677FC;
      border: 1px solid #5677FC;
    }
  }
  & .pass-label {
    position: absolute;
    left: 25px;
    top: 13px;
    font-family: Georgia, serif;
    font-size: 27.15px;
    color: #ECF1ED;
    line-height: 32px;
    cursor: text;
    -webkit-transition: 0.5s all ease-out;
    -moz-transition: 0.5s all ease-out;
    transition: 0.5s all ease-out;

    &.fade-out{
      opacity: 0;
      -webkit-transform: translateY(-30px);
      -moz-transform: translateY(-30px);
      transform: translateY(-30px);
    }
  }

  & .pass-icon {
    position: absolute;
    right: 26px;
    top: 12px;
  }

  &.login-group{
    margin: 56px auto 0;
    & button{
      width: 100%;
      height: 100%;
      border: none;
      text-align: center;
      background: #004545;
      box-shadow: inset -2px -2px 3px 0px rgba(0,0,0,0.30), inset 2px 2px 1px 0px #006B6B;
      font-family: Georgia, serif;
      font-size: 24px;
      color: #178A8A;
      line-height: 28px;

      &:active, &:focus{
        border: none;
        box-shadow: none;
        box-shadow: inset 2px 2px 3px 0px rgba(0,0,0,0.30), inset -2px -2px 1px 0px #006B6B;
        background: #008080;
        color: #31FFFF;
      }

      &:hover{
        color: #31FFFF;
      }
    }
  }
}
```

React 的 JSX 文件

```javascript
var React = require('react');

/*
Email 输入字段
在输入字段中聚焦和失焦时绑定父代传入props的监听器
判断是否需要隐藏label标签
*/
var EmailField = React.createClass({
  render: function(){
    var classes = this.props.isfocus ? "pass-label fade-out": "pass-label";
    return(
      <div className="form-group email-group">
        <label htmlFor="email" className={classes}>EMAIL</label>
        <img src="email-icon.svg" className="email-icon"></img>
        <input onFocus={this.props.focus} onBlur={this.props.focus} id="email" className="email-field" type="email" />
      </div>
    );
  }
});


/*
Password 输入字段
在输入字段中聚焦和失焦时绑定父代传入props的监听器
判断是否需要隐藏label标签
*/
var PassWordField = React.createClass({
  render: function(){
    var classes = this.props.isfocus ? "pass-label fade-out": "pass-label";
    return (
      <div className="form-group pass-group">
        <label htmlFor="password" className={classes}>PASSWORD</label>
        <img src="pass-icon.svg" className="pass-icon"></img>
        <input id="password" onFocus={this.props.focus} onBlur={this.props.focus} className="pass-field" type="password" />
      </div>
    );
  }
});

/*
登陆按扭
*/
var LoginButton = React.createClass({
  render: function(){
    return (
      <div className="form-group login-group">
        <button>LOGIN TO YOUR ACCOUN</button>
      </div>
    );
  }
});

/*
表单根组件
管理所有组件的状态
*/
var Form = React.createClass({
  getInitialState: function(){
    return {
      emailFocus: false,
      passFocus: false
    };
  },
  emailForcusHandler: function(e){
    if(e.type === "focus"){
      this.setState({
        emailFocus: true
      });
      return;
    }
    if(e.type === "blur" && e.target.value === ""){
      this.setState({
        emailFocus: false
      });
      return;
    }
  },
  passForcusHandler: function(e){
    if(e.type === "focus"){
      this.setState({
        passFocus: true
      });
      return;
    }
    if(e.type === "blur" && e.target.value === ""){
      this.setState({
        passFocus: false
      });
      return;
    }

  },
  render: function() {
    return (
      <div className="form-board">
        <form action="">
          <EmailField focus={this.emailForcusHandler} isfocus={this.state.emailFocus}/>
          <PassWordField focus={this.passForcusHandler} isfocus={this.state.passFocus} />
          <LoginButton />
        </form>
      </div>
    );
  }

});

React.render(<Form />, document.body);

```


代码文件

[百度云](http://pan.baidu.com/s/1sjK8jSx)

记得运行前编译下less, 和 jsx(用browserify编译)