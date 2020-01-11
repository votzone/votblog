---
layout: post
title:  "Android中获取Bitmap的方式"
categories: Diary
tags: Diary
author: wq
description: Android中获取Bitmap的方式;

---
原文来至于[原文](http://blog.csdn.net/u012861467/article/details/52013795)

## 按获取方式分：

### 以文件流的方式获取

假设在sdcard下有 test.png图片  

```
FileInputStream fis = new FileInputStream("/sdcard/test.png");  
Bitmap bitmap=BitmapFactory.decodeStream(fis);
```

### 以R文件的方式
假设 res/drawable下有 test.jpg文件
```
Bitmap bitmap =BitmapFactory.decodeResource(getResources(), R.drawable.test);
```
或 

```
BitmapDrawable bitmapDrawable = (BitmapDrawable) getResources().getDrawable(R.drawable.test);
Bitmap bitmap = bitmapDrawable.getBitmap();
```

### 以ResourceStream的方式，不用R文件

```
Bitmap bitmap=BitmapFactory.decodeStream(getClass().getResourceAsStream(“/res/drawable/test.png”));
```

### 以文件流+R文件的方式

```
InputStream in = getResources().openRawResource(R.drawable.test);
Bitmap bitmap = BitmapFactory.decodeStream(in);
```
或   
```
InputStream in = getResources().openRawResource(R.drawable.test);
BitmapDrawable bitmapDrawable = new BitmapDrawable(in);
Bitmap bitmap = bitmapDrawable.getBitmap();
```

>注意：openRawResource可以打开drawable, sound, 和raw资源，但不能是string和color。

## 从资源存放路径分：
### 图片放在sdcard中

```
Bitmap imageBitmap = BitmapFactory.decodeFile(path);      
//(path 是图片的路径，跟目录是/sdcard)
```

### 图片在项目的res文件夹下面

```
ApplicationInfo appInfo = getApplicationInfo();  
//得到该图片的id(name 是该图片的名字，"drawable" 是该图片存放的目录，appInfo.packageName是应用程序的包)  

int resID = getResources().getIdentifier(fileName, "drawable", appInfo.packageName);
Bitmap imageBitmap2 = BitmapFactory.decodeResource(getResources(), resID);

```

### 图片放在src目录下
```
String path = "com/xiangmu/test.png"; //图片存放的路径
InputStream in = getClassLoader().getResourceAsStream(path); //得到图片流
Bitmap imageBitmap3 = BitmapFactory.decodeStream(in);
```

### 图片放在Assets目录
```
InputStream in = getResources().getAssets().open(fileName);  
Bitmap imageBitmap4 = BitmapFactory.decodeStream(in);
```