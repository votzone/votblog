---
layout: post
title:  "Android Studio 升级、配置"
categories: Android
tags: Android
author: Wq
description: Android Studio 的升级之后对应Gradle 版本变化，升级及其相应问题和处理。

---

1、Android Studio 升级到 3.1 又开始卡了。

2、Gradle 版本指定  
通过修改 项目目录下 gradle/wrapper/gradle-wrapper.properites文件中的 distributionUrl 值对应的gradle版本，可以为当前项目指定Gradle 版本。

通过该方法设置的是项目默认gradle 版本，即 Settings -> Build, Execution, Deployment -> Gradle 设置页面 Use default gradle wrapper（recommend）选项时版本。

3、Gradle 4.1 之后会默认将 support，design 等依赖库放入maven库，因此会在项目的 build.gradle中多添加一个google maven的依赖。

```
maven { url 'https://maven.google.com/' }
// 404 将链接替换为 https://dl.google.com/dl/android/maven2/
// 或者直接使用 google()
```

4、指定flavorDimensions  
Gradle 4.0 之后的版本在使用productFlavors 时，需要使用flavorDimensions 为其指定维度，之前的版本只需要指定一个渠道。
默认情况下可以在 android->defaultConfig 下设置一个默认值

```
android{
	defaultcConfig{
	flavorDimensions "versionCode"
	}
}
```

5、AS 管理Gradle 目录  
AS将gradle 的不同版本放在 ${home}/.gradle/ 目录下