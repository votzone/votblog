## mac 装机必备

homebrew


### cartool
打开ios 安装包, 会看到所有资源被打包成 Assets.car文件了.
如何查看car文件中的内容,网上有使用大神写的cartool工具到处图片的操作;
为了使用更简单,于是自己编译了一个cartool ,放到 环境变量 中,以后就可以直接使用cartool命令解压了.

cartool 文件添加环境变量

![20170828150390546037984](http://resource.votzone.com/20170828150390546037984.jpg)

[cartool github](https://github.com/steventroughtonsmith/cartool)

### 启动任何来源的应用

sudo spctl --master-disable
