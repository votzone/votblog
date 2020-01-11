1. 安装nginx

sudo apt-get install nginx

2. vsftpd

2.1 安装vsftpd

```
sudo apt-get install vsftpd

打开配置文件sudo vim /etc/vsftpd.conf，如下修改
#禁止匿名访问
anonymous_enable=NO
#接受本地用户
local_enable=YES
#允许上传
write_enable=YES
#用户只能访问限制的目录
chroot_local_user=YES
#设置固定目录，在结尾添加。如果不添加这一行，各用户对应自己的目录（用户家目录），当然这个文件夹自己建
local_root=/home/ftp

mkdir /home/ftp/data
建立新用户和密码
sudo useradd -d /home/ftp -M ftptest
sudo passwd ftptest

sudo chmod 777 data
```

2.5 登录错误:
```
sudo vim /etc/pam.d/vsftpd
注释掉
#auth    required pam_shells.so
```
2.6 创建过滤账户名:
vim /etc/vsftpd.user_list
添加账户名 ftpjph


2.5 每个linux账户均可登录, 可访问自己的目录

http://www.linuxidc.com/Linux/2017-06/144807.htm
http://www.linuxidc.com/Linux/2016-08/133933.htm
