## IOS 开发中各种设置

### 状态栏设置

再info.plist 文件中添加`View controller-based status bar appearance` 并设置值为`NO`,否则如下操作均不起作用.


全局设置:

```
[UIApplication sharedApplication].statusBarStyle = UIStatusBarStyleLightContent;
```

设置 单一Controller

```obj-c
// 方法一:
self.navigationController.navigationBar.barStyle = UIBarStyleBlack;

//方法二: 重写preferredStatusBarStyle方法
- (UIStatusBarStyle)preferredStatusBarStyle {
//    return UIStatusBarStyleLightContent;
    return UIStatusBarStyleDefault;
}

```

[参考](http://www.jianshu.com/p/63f758796438)


### bitcode

调试运行没问题, 但是打包(Archive)时会报以下错误.

```
ios linker command failed with exit code 1
```
设置 target -> build settings -> Enable Bitcode = NO;

再导入第三方库时经常会出现这个问题, 讲bitcode 设置为no一般可以解决问题;


### ios 多语言设置

1. 再Project 中添加可以被本地化的语言
2. 本地化xib,storyborad等文件
3. 本地化字符串 Localizable.strings文件
4. 本地化名称infoPlist.strings文件

本地化字符串时,使用宏定义 `NSLocalizedString(@"test",nil);`来获取对应语言字符串;
宏定义第二个参数为`comment`, 对该字符串的注释;

[参考链接](http://blog.csdn.net/lwjok2007/article/details/46547085)