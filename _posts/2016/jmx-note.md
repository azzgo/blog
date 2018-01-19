# JMX 学习笔记
date: 2016-07-11 21:55:19
categories:
- 笔记
tags:
- jmx
- java
---
JMX全称Java Management Extensions, 为Java应用提供管理扩展功能。在Java 5的时候引入

<!--more-->

# 概念

|Name|Description|
|:----|:-----|
| MBean | 全称为Managed Bean, 你可以实现一个MBean来JMX提供管理内容|
| MBean Server(也叫JMX Agent)| 提供集中注册管理MBean功能，允许远程通过他代理操作MBean|
| JMX Connectors | 通过实现不同的通讯协议，来允许远程访问|
| Jconsole |一款JMX图形客户端，运行用户访问本地或者远程的JMX，默认包含在Java SDK工具中|

# Referering Java Opts

启动Java可以赋予JVM Machine一些参数，例如设置运行内存堆栈的大小。此处列举一些有关JMX的相关参数

|参数名|类型|描述|
|:------|:--|:---|
|-Dcom.sun.management.jmxremote|布尔|是否支持远程JMX访问，默认true|
|-Dcom.sun.management.jmxremote.port|数值|监听端口号，方便远程访问|
|-Dcom.sun.management.jmxremote.authenticate|布尔|是否需要开启用户认证,默认开启|
|-Dcom.sun.management.jmxremote.ssl|布尔|是否对连接开启SSL加密，默认开启|
|-Dcom.sun.management.jmxremote.access.file|路径|对访问用户的权限授权的文件的路径，默认路径`JRE_HOME/lib/management/jmxremote.access`|
|-Dcom.sun.management.jmxremote. password.file|路径|设置访问用户的用户名和密码，默认路径`JRE_HOME/lib/management/ jmxremote.password`|

例如，你需要启动一个常驻后台的springboot程序(比如app.jar)，如何开启一个支持远程访问的JMX，可以尝试下面的命令

```bash
java -jar app.jar \
-Dcom.sun.management.jmxremote \
-Dcom.sun.management.jmxremote.port=10080 \
-Dcom.sun.management.jmxremote.authenticate=false \
-Dcom.sun.management.jmxremote.ssl=false
```
对于关于JMX相关的参数你配置这些就够了，就可以使用Jconsole连接，

![Jconsole Panel](http://7arnew.com1.z0.glb.clouddn.com/%2Fimage%2Fjpg%2Fjconsolelogin.png)

这个仅仅限于你在本地访问，也就是说远程访问。

你需要支持远程访问协议，也就是前面描述的JMX Connector，可以添加一个参数

`-Djava.rmi.server.hostname=服务器的IP地址或者域名`

就可以开启远程RMI协议访问，正常情况此时应该就能正常看到类似下面的界面

![JMX Runtime](http://7arnew.com1.z0.glb.clouddn.com//image/jpg/jconsole.png)

不过在我的工作做，此时发现仍然不能再远程访问，查询了相关资料后，有可能是防火墙的原因屏蔽了相关接口。在Java启动时，JMX会绑定一个接口，RMI也会绑定一个接口，在复杂网络环境下，有可能你通过打开防火墙允许了JMX端口的通过，但是由于没有放行RMI，远程连接也是会失败的。

这是因为JMX在远程连接时，会随机开启一个RMI端口作为连接的数据端口，很有可能这个端口会被防火墙给阻止，以至于连接超时失败。好在在Java7u25版本后可`-Dcom.sun.management.jmxremote.rmi.port=端口号`来定死这个端口，好消息是，你可以将这个端口和`jmx.port`的端口设置成一个端口，这样防火墙策略就只需要同行一个端口就可以了。

额外内容：

## Sample for authtication

```ini
# password file
monitorRole password1
controlRole password2
```

```ini
# access file
monitorRole readonly
controlRole readwrite
```

## References

- http://docs.oracle.com/javase/7/docs/technotes/guides/management/agent.html
- http://stackoverflow.com/questions/20884353/why-java-opens-3-ports-when-jmx-is-configured/21552812#21552812
- http://stackoverflow.com/questions/7163173/jmx-enabled-java-application-appears-to-open-a-random-high-order-port-when-jmx-c
- http://jingyan.baidu.com/article/acf728fd3c568af8e410a37a.html
