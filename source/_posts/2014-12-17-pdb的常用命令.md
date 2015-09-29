title: pdb的常用命令
date: 2014-12-17 02:51:38
categories:
- 技巧
tags: 
- python 
- debug

---


####进入pdb模式

```
python -m pdb
```

调试文件

在交互式模式中

```
>>>pdb.run('文件名')
```

####pdb模式命令

<!-- more -->

* step 单步调试
* next 进入函数
* util 跳出循环
* args 查看当前变量
* 变量名x,y... 查看指定变量的值
* break [n] 设置断点到n行,直接输入break显示当前断点id和内容
* disable/enalbe 断点id 禁用/启用指定id断点
* clear 断点id 清除指定id断点
* tbreak n设置临时断点,执行遇到该断点后清除
* jump n 直接跳转到n行
* list n[,m] 列出n行周围11行代码,或列出n到m行的代码
* up/down 上下在调用栈的帧中上下移动
* where 得到当前执行行
