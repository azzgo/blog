# Iptables笔记(部分摘抄)

五个hook function（规则链）：
*Input: 主要和想进入本机的数据包有关(filter)
*Output: 主要和本机送出的数据包有关(fiter)
* Forward: 和需要转发到下一个计算机的数据包有关(filter)
* PREROUTING: 包送入时修改包
* POSTROUTING: 包即将送出修改包
* OUTPUT: 路由判断之前
表
* filter 默认的表,不需要-t 指定 具有INPUT OUTPUT FORWARD __chains__
* nat 用于修改一个数据包来创建一个新的连接
* mangle
* raw

<!--more-->

---------------------------------------------
* -F 默认清除fileter表中的所有chains
* -X 默认清除filter中所有自定义chains
* -L 显示filter中的规则
* -n 以ip形式显示

--------------------------------------------------

命令

* -A 添加一个规则到尾端
* -I 插入一个规则
* -D 删除一条规则
* -R 替换一条规则
* -N新建一条chains
* -P 定义默认链的默认规则
* -E 重命名链

------------------------------

匹配参数

-p --protocol 协议 tcp,udp,udplite, icmp,....
-s --source 源地址
-d --destination 目标地址
-j --jump 目标
-i 来源接口,网卡接口eth0..仅仅用在nat表中
-o 目标接口,同上一行

------------

处理动作

* ACCEPT 接受
* DROP 悄悄丢弃,请求端没有回应
* REJECT 明确拒绝
* SNAT 源地址转换
* DNAT 目标地址转换
* REDIRECT 端口重定向
* LOG 记录访问

------------

##一些常用例子

开启22端口,对应ssh很重要

```
[root@tp ~]# iptables -A INPUT -p tcp --dport -j 22 ACCEPT```


如果做了WEB服务器,开启80端口.

```
[root@tp ~]# iptables -A INPUT -p tcp --dport 80 -j ACCEPT```

如果做了邮件服务器,开启25,110端口.


```
[root@tp ~]# iptables -A INPUT -p tcp --dport 110 -j ACCEPT
[root@tp ~]# iptables -A INPUT -p tcp --dport 25 -j ACCEPT```

如果做了FTP服务器,开启21端口

```
[root@tp ~]# iptables -A INPUT -p tcp --dport 21 -j ACCEPT
[root@tp ~]# iptables -A INPUT -p tcp --dport 20 -j ACCEPT```


如果做了DNS服务器,开启53端口
	
```
[root@tp ~]# iptables -A INPUT -p tcp --dport 53 -j ACCEPT```


如果你还做了其他的服务器,需要开启哪个端口,照写就行了.
上面主要写的都是INPUT链,凡是不在上面的规则里的,都DROP
允许icmp包通过,也就是允许ping,

```
[root@tp ~]# iptables -A OUTPUT -p icmp -j ACCEPT (OUTPUT设置成DROP的话)
[root@tp ~]# iptables -A INPUT -p icmp -j ACCEPT    (INPUT设置成DROP的话)```


允许loopback!(不然会导致DNS无法正常关闭等问题)

```
IPTABLES -A INPUT -i lo -p all -j ACCEPT (如果是INPUT DROP)
IPTABLES -A OUTPUT -o lo -p all -j ACCEPT(如果是OUTPUT DROP)```

nat服务器

```
iptables -t nat -A POSTROUTING -o ppp0 -j MASQUERADE```


或者指定来源地址和目标地址
源地址转换

```
iptables -t nat -A POSTROUTING -s 192.168.80.0/24 -d 192.168.0.0/24 -j SNAT --to-source 192.168.0.127```

目标地址转换

```
iptables -t nat -A PREROUTING -s 192.168.0.0/24 -d 192.168.0.127 -p tcp --dport 80 -j DNAT --to-destination 192.168.80.13```
