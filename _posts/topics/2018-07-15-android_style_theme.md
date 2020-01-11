---
layout: post
title:  "Android中样式和主题"
categories: Android
tags: Android
author: wq
description: 样式（Style）和主题（Theme）在Android中批量控制View或窗口的外观。

---
样式（Style）和主题（Theme）在Android中批量控制View或窗口的外观。具体的讲：样式是指为 View 或窗口指定外观和格式的属性集合。样式可以指定高度、填充、字体颜色、字号、背景色等许多属性。 样式是在与指定布局的 XML 不同的 XML 资源中进行定义。主题是对整个 Activity 或应用（Application）而不是对单个 View（如上例所示）应用的样式。 以主题形式应用样式时，Activity 或应用中的每个视图都将应用其支持的每个样式属性。 例外：Android 5.0(API level 21) 和 Android Support Library v22.1中，可以为一个View指定Theme，这将改变View及其子View的样式。

## 使用样式（Style）
在Android的layout布局中，假如想要设计一个展示错误信息的TextView，我们可以如下配置：

``` xml
<TextView
    android:id="@+id/tvStyled"
    android:layout_width="fill_parent"
    android:layout_height="wrap_content"
    android:textColor="#FF0000"
    android:typeface="monospace"
    android:text="@string/styledText" />
```

代码中我们将显示错误提示的TextView的textColor设置为红色（#FF0000）和字体设置为等宽字体。

假如需要将另外一个TextView也设置为错误提示的样式，我们可以直接将textColor和typeface值复制过去，也可以使用Style的方式。使用Style只需要两步：

1. 在res/values/styles.xml中创建新的style

``` xml
<style name="ErrorText">
    <item name="android:layout_width">fill_parent</item>
    <item name="android:layout_height">wrap_content</item>
    <item name="android:textColor">#FF0000</item>
    <item name="android:typeface">monospace</item>
</style>
```

2. 在需要的控件上设置style

``` xml
<TextView
    android:id="@+id/errors"
    style="@style/ErrorText"
    android:text="There's trouble down at the mill." />
```
为控件设置style的语法为：`@[package:]style/style_name`，在包名相同的情况下，方括号内的`package:`部分是可以省略的。而如果包名不同时不可省略，例如我们想要引用系统资源（包名android）中定义的style，可以这样使用：

``` xml
<TextView
    android:id="@+id/tv"
    style="@android:style/TextAppearance.Holo.Widget.TextView"
    android:layout_width="fill_parent"
    android:layout_height="wrap_content" />
```
> 注：style 不仅可以用于TextView，也可用于Button、EditText等所有view视图。

### Sytle的继承

如果想要在已有样式的基础上添加或修改写属性，可以通过sytle标签的parent属性来实现：

``` xml
<style name="AppTheme" parent="Theme.AppCompat.Light.DarkActionBar">
    <!-- Customize your theme here. -->
    <item name="colorPrimary">@color/colorPrimary</item>
    <item name="colorPrimaryDark">@color/colorPrimaryDark</item>
    <item name="colorAccent">@color/colorAccent</item>
</style>
```

> AppTheme继承了Theme.AppCompat.Light.DarkActionBar，并在其基础上设置了三个color属性

上述案例的Style分布在两个不同的包中，只能通过parent属性来继承，**如果Style定义在同一个包中**，可以通过句点前缀的方式来实现：

``` xml
<style name="ErrorText.Danger">
    <item name="android:textStyle">bold</item>
</style>
```

> `Errottext.Danger` 这个style 在`ErrotText` 的基础上添加了粗体效果。

### 样式属性

在`res/values/styles.xml`中定义样式时，通过item标签为style添加样式属性，那么Android中都支持哪些样式呢？参考[R.attr](https://developer.android.google.cn/reference/android/R.attr), R.attr中所有属性都可以通过item标签添加到style中。

不同View指定同一个style时，当style中包含View不支持的Item，会自动忽略该值。

## 使用主题（Theme）
在定义上主题与样式是一致的，两者并没有区别并且是可以共用的。主题一般在AndroidManifest.xml文件中通过标签用于Application或者Activity，在Android5.0之后可以用于View。

Theme和Style的区别在于指定时，首先是语法不同，样式的指定在View中使用style标签如`style="@android:style/TextAppearance.Holo.Widget.TextView"`；指定主题使用`android:theme`属性赋值，并且对于Application和Activity均提供 `public void setTheme(int res)`的方式来动态设置。

同时**Theme的指定是递归传递的**，例如为Application指定了主题，应用中所有View都默认使用该主题所代表样式。为Activity指定了主题，则所有属于Activity的view具有该主题所代表样式。在Android 5.0 之后为ViewGroup指定主题，其所有子view都默认包含该主题所代表样式。

## 参考

[https://developer.android.google.cn/guide/topics/ui/look-and-feel/themes](https://developer.android.google.cn/guide/topics/ui/look-and-feel/themes)

[https://developer.android.google.cn/guide/topics/resources/style-resource](https://developer.android.google.cn/guide/topics/resources/style-resource)

[https://developer.android.google.cn/guide/topics/ui/themes](https://developer.android.google.cn/guide/topics/ui/themes)

[R.styleable.Theme](https://developer.android.google.cn/reference/android/R.styleable.html#Theme) 提供了可在主题中使用的标准属性的列表。