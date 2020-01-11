---
layout: post
title:  "Android签名生成和互转"
categories: Android
tags: Android
author: wq
description: Android签名生成和互转，百度渠道上传是一直提示签名有问题，于是研究了一下jks签名和pk8签名之前互相转换的流程，写了bat 脚本方便以后再次遇到这类问题时快速处理。

---

Android 的签名有两种方式，一种使用jdk 提供的jarsigner工具签名keystore 文件，另一种是Android 自己提供的signapk.jar 通过.pk8（密钥）和.x509.pem（证书）两个签名文件完成签名。  
之前对一个包签名都是直接使用signapk来的，因为这样不需要输入密码即可直接签名，简单直接，今天上传百度时遇到问题了，下载下来签名的说明文档后说需要使用jarsigner 来签名，于是研究了下两个签名之间相互转换的问题。  
并且为了降低以后再次遇到这类问题时查找资料的成本，写了个简易的bat脚本半自动化操作。

### 工具
[openssl](http://slproweb.com/products/Win32OpenSSL.html) 安装完成之后, 将bin目录加入环境变量即可使用openssl

keytool : jdk/bin目录下的工具

signapk.jar: 用于Android签名的工具（源码在aosp的源代码下）

jarsigner：jdk中的工具，用于给jar签名（也可以给任意一个zip包签名）

## 一、两种不同签名方案的签名过程
jarsigner 是jdk 提供的工具，安装jdk之后就可以使用了，使用jarsigner签名的命令如下：  

```
jarsigner -verbose -storepass 12345678 -keystore testkey.jks -signedjar signed_out.apk 111.zip testkey
```

其中  
`-verbose` 表示输出详细信息.  
`-storepass` 表示签名库的密码.   
`-keystore` 表示签名文件路径.  
`-signedjar` 表示签名后输出文件路径.  

最后跟需要签名的`文件路径` 和 keystore 的`别名`.  
更详细参数可以通过 jarsigner -help 查看，中文的还是很清楚。

![jarsigner.png](assets/jarsigner.png)

signapk 是android 提供的单独为apk签名的工具，使用方法：

```
java -jar signapk.jar testkey.x509.pem testkey.pk8 111.zip signed_out.apk
```

通过如上分析可知，jarsigner 签名需要提供一个签名文件jks 和签名库密码，并且如果签名库密码跟密钥密码不同还需另外提供密钥密码；**（下文我们称jks签名或jks签名库）**  
signapk 签名只需提供一个pk8文件和一个x509.pem文件即可。**（下文将这两个文件简称为pk8签名）**

## 二、将pk8签名转换为jks 签名库
接下来我们解决百度渠道的签名问题，第一步就需要将我们的pk8签名 转换为 jks签名。
通过网上搜索，我们了解到java签名库文件通常的后缀有.keystore 和.jks，因此我们可以认为之前**eclipse时代的.keystore签名与Android Studio 时代的.jks 签名是相同格式的**。

现在我们有pk8签名，可以使用openssl 和keytool 两个工具来将其合并到jks签名库
下面以实例介绍将`testkey.pk8/testkey.x509.pem` 签名文件 合并到`testkey.jks` 签名库，并设置其密码`12345678`和别名`testkey`

1. `openssl pkcs8 -inform DER -nocrypt -in testkey.pk8 -out testkey.pem`   
使用 open ssl 将pk8 解密为 pem 文件, 此时生成一个testkey.pem 文件

2. `openssl pkcs12 -export -in testkey.x509.pem -inkey testkey.pem -out platform.p12 -password pass:12345678 -name testkey`   
将两个pem 文件导入platform.p12文件中,并设置 别名 testkey 和keypass 密码:12345678 (别名和密码可自定义)
会新生成 platform.p12
3. `keytool -importkeystore -deststorepass 12345678 -destkeystore testkey.jks -srckeystore platform.p12 -srcstoretype PKCS12 -srcstorepass 12345678`  
使用keytool 将之前生成的platform.p12导入 testkey.jks 签名中,并设置storepass密码(12345678) 
需要正确提供keypass 密码
此时即生成了需要的testkey.jks 签名文件
4. `keytool -list -v -keystore testkey.jks`  
查看生成的 签名信息

注意: 

* storepass 和 keypass 可以不同
两个密码相同情况下 使用jarsigner 签名时只需提供storepass即可
否则需要提供两个密码

* keytool -list 查看时只需提供storepass即可

有了jks签名库，我们可以使用如下方法为空包签名

```jarsigner -verbose -storepass 12345678 -keystore testkey.jks -signedjar jks_out.apk 111.zip testkey```

命令通过提供-stroepass（密码） 和别名(testkey) 将输入文件111.zip 签名为jks_out.apk

接下来我们提供一个将pk8签名生成jks的简易bat脚本， 脚本中需要配置 openssl keytool 路径，并且手动设置需要签名的文件名

脚本见文章末尾github代码库中 cvt2jks.bat

工具运行目录如下

![cvt2jks.png](assets/cvt2jks.png)

[参考](https://blog.csdn.net/S_targaze_R/article/details/50739802)

## 三、从将jks签名库中抽取pk8签名

openssl能够将signapk 用的签名合并到 jarsigner签名, 同样也可以分离出来,具体操作步骤:

1. `keytool -importkeystore -srckeystore testkey.jks -destkeystore testkey.p12 -srcstoretype JKS -deststoretype PKCS12 -srcstorepass 12345678 -deststorepass 12345678 -noprompt`    
首先将testkey.jks 转化为 .p12文件, 在执行过程中需要输入srcstore密码和 deststroe 密码, 这里在命令行中 通过-srcstorepass 和-deststorepass指定

2. `openssl  pkcs12 -in testkey.p12 -nodes -out testkey_all.rsa.pem -password pass:12345678`   
使用openssl 的pkcs12 指令将p12文件中的证书导出   
-password pass:12345678 为了省略之后的输入密码步骤
3. 通过网上的教程可知,如上代码同时导出了密钥 和 证书, 需要手动的将证书复制出来生成 .x509.pem签名； 查看openssl帮助文档, 我们知道可以只导出证书或者密钥,于是我们可以通过 -nokeys 参数只导出证书  
`openssl pkcs12 -in testkey.p12 -nodes -nokeys -out testkey.x509.pem -password pass:12345678`  

4. 通过-cacerts 参数之导出密钥
`openssl pkcs12 -in testkey.p12 -nodes -cacerts -out testkey.rsa.pem -password pass:12345678`

5. 根据2-4 中生成的密钥文件生成pk8, 可以使用`testkey_all.rsa.pem` 也可是使用`testkey.rsa.pem`   
`openssl pkcs8 -topk8 -outform DER -in testkey.rsa.pem -inform PEM -out testkey.pk8 -nocrypt`  

如上`testkey.pk8` 和 `testkey.x509.pem` 即为所需签名

一个简易bat 脚本
见文章末尾github代码库中 jks2pk8.bat 文件

[参考](https://blog.csdn.net/sendwave/article/details/73699352)

## 四、探究jks 签名的生成
我们知道可以使用Android Studio 来生成jks, 是不是有命令行工具呢？keytool 就可以实现 这个操作。

核心命令 

```keytool -genkey -v -keystore app.jks -alias app -keyalg RSA -validity 999999```

如上,指定了 要生成的签名`文件名称` , `别名` 和`有效期(日)`。

运行过程中需要输入两个密码 一个是密码口令(keypass),一个是密钥库口令(storepass)   
可以通过-keypass 和 -storepass 指定

简易 bat脚本
见文章末尾github代码库中 genkey.bat 文件

[参考](https://blog.csdn.net/darkengine/article/details/42773745)

## 五、签名案例分析
创建一个jks 签名app.jks, 将jks 签名拆分为signapk需要的pk8签名, 然后再将pk8 签名合并回jks   
分别用如上三个签名对同意文件进行签名操作, 对比如下: 证书都相同!

![signature_compare](assets/signature_compare.png)


PS：附使用 signapk.jar 和jarsigner 工具签名的命令行操作

signapk.jar 签名示例

```java -jar signapk.jar testkey.x509.pem testkey.pk8 111.zip jifei_out.apk```

jarsigner 工具签名示例

```jarsigner -verbose -storepass 12345678 -keystore testkey.jks -signedjar jks_out.apk 111.zip testkey```
最后的testkey 为别名

脚本：
[https://github.com/votzone/DroidCode/tree/master/Signature](https://github.com/votzone/DroidCode/tree/master/Signature)