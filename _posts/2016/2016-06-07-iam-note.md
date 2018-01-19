title: 亚马逊之IAM
date: 2016-06-07 14:30:46
categories:
- 笔记
tags:
- AWS
- IAM
- 权限控制
---
IAM是亚马逊的身份认证系统，英文全称是Identity and Access Management。主要管理的是用户或者应用对AWS资源的访问权限控制。

<!--more-->

__IAM控制台__
![IAM控制台](http://7arnew.com1.z0.glb.clouddn.com/images/iam-dashboard.png)

IAM主要有User, Group, Role, Policies, Identity Provider等概念, 下面对这几个概念进行简单地介绍

## Concept

### User

User（用户），操作AWS资源的最直观，也是最终的载体。

我们注册AWS用的账户也叫根账户，具有AWS所有的访问权限，AWS建议日常使用不要使用根账户来操作。而是单独在IAM控制台中创建User。

一般企业在自己的内部系统中都有自己的一套用户系统，AWS提供了AssumeRole和Federation来将外部账户和AWS的资源结合。在企业内部账户登录后，在登录AWS使用AssumeRole或者Foderation认证通过后，AWS会给予一个临时token，相应的创建一个临时账户，可以操作许可的AWS资源。

User可以访问IAM设置的别名地址登录控制台（格式为https://[别名].signin.aws.amazon.com/console）,注意登录的账户需要有控制台访问权限。

### Group

Group(组)，可以将用户分组，也可以定义组策略（Policies）。

### Role

Role（角色），可以绑定一系列的策略(Policies)，常用来定义第三方登录(比如上面提到的公司账户)账户的AWS操作权限，或者接入应用对AWS的操作权限。和组不同，Role并不能添加已有的用户。

### Policies

Policies（策略），定义对AWS操作权限的描述，AWS其实已经有了很多內建策略，如果我们并不需要那么细粒度的权限把控，其实并不需要我们自己定义。不过如果我们需要自己写策略的话，其实AWS为我们准备了策略生成器，大部分工作是可以通过表单选择完成。


__策略生成器__
![策略生成器](http://7arnew.com1.z0.glb.clouddn.com/images/iam-policy-generator.png)

### Identity Provider

Identity Provider（身份提供商），如果需要外部提供商登录，比如常见的比如Google， FaceBook这类的，就需要添加Identity Provider并配置相关选项，在两者间建立互信机制。AWS支持OpenID和SAML联合登录。

## 配置AWS Cli

创建IAM用户时会给予你一份证书，包含Access Key ID和Secret Access Key

__生成证书__
![生成证书](http://7arnew.com1.z0.glb.clouddn.com/images/iam-credencial.png)

当你AWS CLI安装完成后，需要运行`aws configure`配置CLI：

```bash
➜  ~ aws configure
AWS Access Key ID:      # IAM的Access Key ID
AWS Secret Access Key:  # IAM的Secret Access Key
Default region name:    # 默认操作Region的名称（具体参考http://docs.aws.amazon.com/zh_cn/general/latest/gr/rande.html)
Default output:         # 输出格式json/text/table
```

配置OK后就可以使用Cli操作许可的AWS资源。


## 关于IAM最佳实践

- 隐藏根账户证书
  根账户不应该拥有证书，因为根账户拥有AWS最大的权限，应当和保护信用卡信息一样重视。
- 创建单独的管理员IAM账户
  因为IAM账户易于管理，容易改变其权限和整个收回账户，所以推荐使用IAM账户管理AWS，而不是使用AWS根账户。
- 使用组赋予权限
- 使用强密码
- 使用多重验证
- 对应用赋予单独的IAM账户
- 最小权限
- 通过使用角色而非共享证书来委托访问，其他AWS账户
- 定期交替轮换证书，证书需要时常更新
- 删除不需要的证书
- 使用策略条件来增强安全性
- 监控 AWS 账户中的活动

具体有关最佳实践的描述参见<http://docs.aws.amazon.com/zh_cn/IAM/latest/UserGuide/best-practices.html>
