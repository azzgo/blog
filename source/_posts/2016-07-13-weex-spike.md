title: Weex 初步体验
date: 2016-07-13 21:59:11
categories:
- 笔记
tags:
- weex
- Hybird
- Vue
---
阿里推出的类似React Native和Native Script的从前端都mobile的解决方案，主要研究如何将Front End的开发技术和体验移植到Mobile开发中去。现在看起来阿里想做的方案是一套代码可以在Browser, Android和IOS三个平台几乎无缝的运行。scope可谓大大的。

<!--more-

## 原理

目前看来[原理](http://alibaba.github.io/weex/doc/advanced/how-it-works.html)方面，官方给了下面的workflow和示意图。

```
Weex file --------------frontend(source code)
↓ (transform) --------- frontend(build tool)
JS bundle ------------- frontend(bundle code)
↓ (deploy) ------------ server
JS bundle in server --- server
↓ (compile) ----------- client(js-engine)
Virtual DOM tree ------ client(weex-jsframework)
↓ (render) ------------ client(render-engine)
Native view ----------- client(render-engine)
```

![TB1ootBMpXXXXXrXXXXwi60UVXX-596-397.png](http://7arnew.com1.z0.glb.clouddn.com/image/00CA97975A5A3A08B792A559DB899BD6.png)

![TB1_SA4MXXXXXXGaXXXpZ8UVXXX-519-337.png](http://7arnew.com1.z0.glb.clouddn.com/image/F0C9AB660E5F35139628F71FD32C1649.png)

大概可以理解为weex工具使用类似webpack之类的工具将你的JS代码打包为一个JS Bundle文件，然后通过一个封装的JS Framework将你的JS Buddle转化为一个Vitual DOM结构，再交给RenderEngine将CSS, Event等相关东西attach上去，最终渲染在目标平台上讲页面渲染出来。

## 体验

### 运行Weex PlayGround

关于Getting Starting的指导可以参考官方[Github](https://github.com/alibaba/weex)

### 个人体会

我基本花了三天才把这一套东西整个Run起来，整体上觉得有几点感觉不是很满意。

1. 整个工具链还没有出来，我不知道如何初始化一个完整项目，我指的是初始化一个项目，包含JS的脚手架还有目标平台。无法使用命令行添加平台支持，使用命令行打包和运行应用到原生平台上去。
2. 从Playgroud这个官方的Demo应用来看，组件还相当不完善，UI在两个平台上看都是IOS风格的，颜色感觉是从Bootstrap那边抄过来的感觉。还有就是所有的触碰操作都没有反馈，感觉是在摸玻璃板。不过整体感觉就是Web页面在手机上的感觉，还体会不到其原生方面相同或者类似的体验。

### 看法

个人感觉阿里画的scope很大——write once, run anywhere，还有就是vue现在的生态圈子是相对不如React的，感觉现在基本应该观望，看几个月后的生态如何。毕竟其离React Native还差的很远，React Native的坑也不少。