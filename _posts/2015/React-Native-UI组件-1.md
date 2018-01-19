# 构建原生React Native Android的UI组件 (一)
date: 2015-11-23 15:47:12
categories:
- coding
tags:
- react native
- react
- android
---

Facebook 的React Native在今年09月15日发布了其Android版本, 到目前为止, React Native已经发布到了0.14版本. 该技术让我们可以使用其封装的组件以React的书写方式书写Android应用. Facebook 已经为我们封装了很多组件和工具, 如果官方封装的组件不能满足我们的开发需求, 比如我们需要自定义或者引用一些第三方的UI组件, 肿么办?
<!--more-->
React Native官方文档中也描述了我们如何将组件暴露给RN, 我们就来尝试一下.

根据官方文档, 我们主要只需要实现两个类, ReactPackage 和 ViewManager.

比如我想要使用TimePicker, 我想在React Native中也能够使用, So let's do it.

## 准备工作

我假定你已经有一个初始化的0.14版本的React Native项目, 这个目录下应该有一个Android目录, 里面存放的是一个Android工程. 

如果没有这个目录可以使用下面的命令快速创建一个

```bash
react-native android
```

## 实现类

### 实现ViewManger

我们首先需要实现ViewManger, 将原始UI组件包装成为React Native可识别的组件, 我们这里使用ViewManager的一个包装类, 这个类为我们实现了FLexbox布局, 背景色, 透明度等样式属性.

下面是最简单的实现代码.

```java
public class TimePickerManager extends SimpleViewManager<TimePicker> {

    public static String REACT_CLASS = "TimePicker";;

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected TimePicker createViewInstance(ThemedReactContext reactContext) {
        return new TimePicker(reactContext);
    }

}
```

###  实现ReactPackage

这里我们覆写了`getName`和`createViewInstance`方法, `getName`返回组件的名称, createViewInstance返回组件的实例.

然后需要实现一个ReactPackage来管理添加我们所有的UI组件, 这个组件需要实现三个方法: `createNativeModules`, `createJSModules`, `createViewManagers`. 我们这里只需要关注`createViewManagers`就可以了, `createNativeModules`是用来暴露Java类和方法的, `createJSModules`这个方法并不明确, 官方文档并没有提及, 貌似是用来给原生代码提供JS接口的地方.下面我们简单地实现下`createViewManagers`方法. 其他的方法如果不需要使用就简单的返回`Collections.emptyList();`就可以了.

下面是简单的实现代码.

```java
@Override
public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
	return Arrays.<ViewManager>asList(
		new TimePickerManager()
	);
}
```

 
### 添加Package到React Native

接下来我们需要将我们的Package添加到React Native的组件库里面就可以了, 

其实你会发现MainActivity里面已经提示了方法了, 你只需要想下面代码中加一条`addPackage`方法就可以了.

```java
 mReactInstanceManager = ReactInstanceManager.builder()
                .setApplication(getApplication())
                .setBundleAssetName("index.android.bundle")
                .setJSMainModuleName("index.android")
                .addPackage(new MainReactPackage())
                .addPackage(new CustomUIPackage())						// 将你自定义的Package类添加到这里
                .setUseDeveloperSupport(BuildConfig.DEBUG)
                .setInitialLifecycleState(LifecycleState.RESUMED)
                .build();
```


### 实现Javascript方面的组件

Javascript需要定义一个模块, 作为一个接口, 将Native的组件导出为React的一个组件, requireNativeComponent需要两个参数, 第一个参数是组件的名称, 对应`ViewManger`中`getName`返回的字符串, 第二个参数是一个对象, 用来定义javascript调试时输出组件的名称, 和组件prop的类型要求, 这些参数是required的.

下面是最简单的实现.

```javascript
// ImageView.js

import { requireNativeComponent, propTypes} from 'react-native';

const iface = {
  name: 'TimePicker',
  propTypes: {}
};

module.exports = requireNativeComponent('TimePicker', iface);
```

当然requireNativeComponent还有第三个参数, 是和事件相关的. 我之后有时间会研究研究.

这样我们的TimePicker就可以在Javascript中使用了.

## 使用

我们在index.android.js中使用如下代码就可以在模拟器中看到效果了.

```javascript
import React, {
  AppRegistry,
  StyleSheet
} from 'react-native';

import TimePicker from './lib/timepicker';

const styles = StyleSheet.create({
  timepicker: {
    flex: 1
  }
});

 
class App extends React.Component {
  render() {
    return (
        <TimePicker style={styles.timepicker}/>
    );
  }
}


AppRegistry.registerComponent('App', () => App);
```


这个组件必须设置样式才可以看到, 这个是因为`SimpleViewManager`默认没有设置宽高, 但是我尝试了一些方法单并不work, 现在是使用flex布局让它自动撑开的.
比如

```java
   @Override
   protected TimePicker createViewInstance(ThemedReactContext reactContext) {
	   TimePicker timePicker = new TimePicker(reactContext);
	   timePicker.setLayoutParams(new ViewGroup.LayoutParams(
	       ViewGroup.LayoutParams.MATCH_PARENT,
	       ViewGroup.LayoutParams.WRAP_CONTENT
	   ));
	   return timePicker;
   }
```

看下效果图

![Demo](file:///Users/loomla/Pictures/screenshot/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202015-11-21%2023.21.21.jpeg)

## 结论

大体上定义一个自定义组件还是比较容易的, 但是尝试下来还是感觉文档里面有不少坑, 很多API没有提及作用, 然后不知道如何定义默认样式等等.

根据文档, 在ViewManager还可以定义props传入一些属性. 还有因为javascript和原生代码是通过异步通信的, 所以所有原生程序执行的数据都得通过回调传递给javascript. 这里可以定义这些回调函数.

大家一起快乐的玩耍吧, React Native.
