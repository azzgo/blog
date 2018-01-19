# 在DigitalOcean上搭建vpn


看来这个[DigitalOcean VPS 上如何安装 VPN](http://blog.eood.cn/digitalocean-vps-vpn)之后就,  跃跃欲试了,不过呢,我选择了ubuntu14.04的image,导致配置文档和他有很大不同,最后我放弃了文章中的搭建方法, 如果你的vpn是ubuntu12.04可以试一试.然后我参考了[Ubuntu Server下建立VPN服务器的方法](http://www.jb51.net/os/Ubuntu/34821.html)的方法,调试了下成功了.

<!-- more -->

1. 安装好后ssh登陆输入`sudo apt-get install pptpd`安装ubuntu 给我们打包好的套件
2. 然后有三个配置文件需要我们注意.

```
* /etc/pptpd.conf
* /etc/ppp/pptpd-options 
* /etc/ppp/chap-secrets ```

3. 在pptpd.conf中需要注意的是remoteip和localip
记得remoteip的形式要  
写成xxx.xxx.xxx.xxx-xxx的形式,  
不能弄成xxx.xxx.xxx.xxx-xxx.xxx.xxx.xxx,  
我调试了好久才弄清楚,可能偶太笨吧.呵呵.我的设置:

```   
remoteip=10.0.0.120-130
localip=10.0.0.1```

4. 然后是pptpd-option,里面就ms-dns需要改,把里面两个ms-dns的注释取消掉,改成你需要设置的dns name或者ip
我的设置:

```
ms-dns=8.8.8.8
ms-dns=8.8.4.4```
   
5. 最后chap-secrets是设置登录用户密码的文件,  
里面的ip要制定在remoteip域中,不然会出现错误.我的配置:
		
```        
user pptpd password 10.0.1.122```

6. 然后启动pptpd,

```
sudo service pptpd start
```

7. 这个时候你可尝试连接一下,应该是可以连接vpn了,  
不过由于remoteip设置的是内网ip,还是上不了网,  
这个时候需要做路由转发.需要开启转发功能.

```
sudo  echo 1 > /proc/sys/net/ipv4/ip_forward
```

8. 然后需要设置转发

```
sudo iptables -t nat -A POSTROUTING -s 10.0.0.0/24 -o ppp0 -j MASQUERADE
```   

 ps:上面的ppp0是pptpd启动后开启的虚拟网卡接口,  
 只有建立了vpn才能看到,可能你的接口名字和我的不一样.

这下子应该就大功告成了,享受自建vpn的快感吧.
