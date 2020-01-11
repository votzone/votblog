---
layout: post
title:  "Android Unity 消息传递"
categories: Android, Unity, 逆向
tags: Android, Unity, 逆向
author: Wq
description: Android 和Unity之间的消息传递

---

在Android中，我们可以通过反射由Native 调用Java层代码，在Java层通过JNI调回Native，那在Unity开发的游戏中，是怎么实现与Java层的交互？

## Unity向Java层传递消息

Unity 的Android游戏一般有一个主Activity，即 `com.unity3d.player. UnityPlayerNativeActivity `， 这个Activity的实例为`com.unity3d.player.UnityPlayer -> currentActivity `

Unity 脚本中，可以通过` AndroidJavaClass  `和`AndroidJavaObject` 来实现类似于反射的调用。脚本如下：

```
	message = GUILayout.TextField (stringToEdit, GUILayout.Width(300),GUILayout.Height(100));
	if(GUI.Button(new Rect(10,120,200,100),"调用Android方法")){
		using (AndroidJavaClass jc = new AndroidJavaClass("com.unity3d.player.UnityPlayer"))
		{
			using( AndroidJavaObject jo = jc.GetStatic<AndroidJavaObject>("currentActivity"))
			{
				//要传递过去的参数
				object[] message=new object[2];
				message [0] = 1;
				message [1] = message;
				jo.Call("OnUnityMessage",message);
			}
		}
	}
```

## Java向Unity传递消息

Java 向Unity传递消息只有一行代码

`UnityPlayer.UnitySendMessage("Main Camera", "OnAndroidMessage", message);`

参数1： 表示要发送对象（GameObject-> name）的名称，我们可以在Unity中通过为GameObject的name赋值来确定，或者直接写入已知名称如上 `Main Camera`；  
参数2：表示对象脚本中的方法名(非静态)；   
参数3：参数；   

注意：Java向Unity传递消息只能发送到对象，不能发送给静态方法；

