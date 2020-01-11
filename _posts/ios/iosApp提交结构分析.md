## Ios App提交结构分析

工具:

Hopper Disassembler v3, cartool, 文本查看器, xcode

分析:
使用Archive 构建完成之后,我们会在 Organizer 中看到构建好的版本

![201708301504092931121](http://resource.votzone.com/201708301504092931121.png)

以`极速版` 为例,右键再Finder中打开会发现对应的`xcarchive`包,这是构建后的程序包(文件夹),右键 - 显示包内容即可查看内容.

![20170830150409330473481.png](http://resource.votzone.com/20170830150409330473481.png)

打开之后会看到如上图的内容

其中`info.plist` 包含一些应用基本信息, `极速版.xcscmblueprint` 使用文本工具查看,可以看到与版本控制相关的一些信息.

重点一 `急速版.app `很明显这是我们最终生成的包,并且是个文件夹, 右键 - 显示包内容 查看整个应用信息, 其中文件结构基本上一目了然. 与 代码中基本一一对应.

![20170830150409535740262.jpg](http://resource.votzone.com/20170830150409535740262.jpg)

`embedded.mobileprovision ` 证书及签名文件.
`CodeResources ` 当前包中所有资源文件及其hash值列表.

`极速版` 可执行文件
`Assets.car` 图片资源文件

将 `极速版` 文件拖拽入 反编译工具`Hopper Disassembler` 中, 可以看到反编译后内容

![20170830150409629447346.png](http://resource.votzone.com/20170830150409629447346.png) 

从面板左侧可以看出,这是每个.h文件中声明的方法.
在反编译后的整个界面中查找, 我们可以看到, 可执行文件为所有代码编译成的二进制文件, 只保留了.h中的方法声明.其他所有内容(代码注释, 宏定义等)都被过滤了.

使用`cartool `解压`Assets.car`文件, 可知 图片是可以完整还原的, 如下:

![201708301504096591831.png](http://resource.votzone.com/201708301504096591831.png)

再看


[1 如何查看.ipa测试包用到的证书所包含的UDID](http://www.jianshu.com/p/f1b9c2576d03)









