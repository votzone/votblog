---
layout: post
title:  "Android 中Dialog的使用"
categories: Android
tags: Android
author: wq
description: 本文是参考ProAndroid的第10章Working with Dialogs的内容，在合适的地方添加了作者自己的一些见解最终成文。

---
本文是参考ProAndroid的第10章Working with Dialogs的内容，在合适的地方添加了作者自己的一些见解最终成文。

Android 中的对话框是一个展示在当前窗口上的小一号的窗口，用于展示或接受一些信息，通常在用户关闭一个对话框时会回到原来的窗口上。例如：展示一个紧急信息，接受用户输入等；Android SDK中为对话框（Dialog）提供了丰富的实现接口。同时，Android还提供了一个嵌入到Activity中的DialogFragment 来实现对话框布局。

Android中对话框样式有提醒对话框，提示对话框，选择列表对话框，单选，多选，进度，时间和日期对话框。并且还支持自定义对话框。本章并不详细描述每种Dialog的用法，而是通过一个简单的实例来解析Dialog的底层结构，这样在有新的Dialog类型时也知道怎么用。

关于对话框有一点很重要的是，在Android 3.0 Google发布了Fragment是之后，官方实例中只有FragementDialog的示例了，及时之前的版本也可以通过支持库来实现。因此本章中重点也在DialogFragment。

## 1 Android中的Dialogs
Android中的对话框是异步的，如果你之前使用过同步对话框（Windows对话框，JavaScript中web对话框等）就会有直观的对比，在同步对话框中，对话框之后的代码是在对话框返回之后执行的，而异步对话框不会等待对话框返回。因此异步对话框需要根据用户具体的选择进行接口的回调。

同时，异步对话框也意味着你可以在应用进程中关闭对话框，例如在展示一个进度对话框时，当要执行的费时操作完成之后可以关闭这个进度对话框。

## 2 理解 Dialog Fragment
本节将会介绍使用DialogFragment来展示一个简单的提醒对话框（AlertDialog）和一个自定义文本输入对话框。

### 2.1 DialogFragment 基础
在使用DialogFragment之前，我们需要知道DialogFragment继承至Fragment，因此其生命周期的行为跟Fragment是一直的，要使用DialogFragment，你需要实现一个继承了DialogFragment的类。

``` java
public class MyDialogFragment extends DialogFragment{... }
```

然后使用 fragment transaction 操作来展示这个对话框。清单 10-1 展示了其具体用法。

``` java
清单10-1
public class SomeActivity extends Activity
{
    //....other activity functions
    public void showDialog()
    {
        //construct MyDialogFragment
        MyDialogFragment mdf = MyDialogFragment.newInstance(arg1,arg2);
        FragmentManager fm = getFragmentManager();
        FragmentTransaction ft = fm.beginTransaction();
        mdf.show(ft,"my-dialog-tag");
}
    //....other activity functions
}
```

从清单 10-1 中我们可以看出，展示一个 DialogFragment有如下3步:

1. 创建一个DialogFragment；
2. 获取对应的 FragmentTransaction；
3. 通过FragmentTransaction 的show方法展示对话框；


### 2.2 构建一个FragmentDialog
与其他Fragment一样，推荐使用工厂模式的newInstance()来实现一个DialogFragment。就像Android管理Fragment的生命周期一样，使用默认的空参构造方法，然后使用bundle对象来传入参数。
#### 2.2.1 重写 onCreateView 方法
当你继承一个DialogFragment时，你可以选择重写一个或两个方法来创建对话框。第一个选择是重写onCreateView并在返回一个view；另个一选择是重写onCreateDialog方法并返回一个dialog。
清单 10-2 是一个重写onCreateView的例子

``` java
Listing 10-2. Overriding onCreateView() of a DialogFragment
public class MyDialogFragment extends DialogFragment
    implements View.OnClickListener
{
    .....other functions
    public View onCreateView(LayoutInflater inflater,
            ViewGroup container, Bundle savedInstanceState)
    {
        //Create a view by inflating desired layout
        View v = inflater.inflate(R.layout.prompt_dialog, container, false);
        //you can locate a view and set values
        TextView tv = (TextView)v.findViewById(R.id.promptmessage);
        tv.setText(this.getPrompt());
        //You can set callbacks on buttons
        Button dismissBtn = (Button)v.findViewById(R.id.btn_dismiss);
        dismissBtn.setOnClickListener(this);
        Button saveBtn = (Button)v.findViewById(R.id.btn_save);
        saveBtn.setOnClickListener(this);
        return v;
}
    .....other functions
}
```

DialogFragment就像一个Fragment一样，将onCreateView中生成的view以对话框形式展示。

#### 2.2.2 重写onCreateDialog
DialogFragment 还可以通过重写onCreateDialog方法来使用，清单10-3 展示了一个例子

``` java
Listing 10-3. Overriding onCreateDialog() of a DialogFragment
public class MyDialogFragment extends DialogFragment
    implements DialogInterface.OnClickListener
{
    .....other functions
    @Override
    public Dialog onCreateDialog(Bundle icicle)
    {
        AlertDialog.Builder b = new AlertDialog.Builder(getActivity())
          .setTitle("My Dialog Title")
          .setPositiveButton("Ok", this)
          .setNegativeButton("Cancel", this)
          .setMessage(this.getMessage());
        return b.create();
    }
    .....other functions
}
```

通过重写onCreateDialog，可以简单直接的返回一个对话框，但是远没有重写onCreateView灵活。

### 2.3 展示一个DialogFragment
当你构造完一个DialogFragment时，需要使用一个FragmentTransaction来展示它。DialogFragment 对象的show()方法接受一个transaction作为参数，用于将该DialogFragment添加到Activity中；然而show()方法并不会修改transaction的返回栈。如果向要添加，需要先将其添加到返回栈在调用show()方法。show方法有如下两种形式：

``` java
public int show(FragmentTransaction transaction, String tag)
public int show(FragmentManager manager, String tag)
```

第一个show() 接受transaction 和tag来展示对话框，返回值为transaction的提交结果；第二个show()方法直接接受一个FragmentManager，该方法是一个简便的show方法，但是使用该方法将不能为transaction添加返回栈。

使用DialogFragment的一个优点是可以通过Fragment的状态管理机制来管理对话框，例如当你在对话框展示的时候旋转屏幕，不需要自己实现状态的管理，可以直接教给Fragment来实现。DialogFragment也提供了界面控制的方法，例如title和样式。

### 2.4 隐藏一个DialogFragment
隐藏一个DialogFragment的方法有两种，第一种是通过调用DialogFragment对象的dismiss()方法。清单 10-4展示了通过按钮时间调用dismiss()方法。

``` java
Listing 10-4. Calling dismiss()
if (someview.getId() == R.id.btn_dismiss)
{
    //use some callbacks to advise clients
    //of this dialog that it is being dismissed
    //and call dismiss
    dismiss();
    return;
}
```


DialogFragment 的dismiss()方法将对话框从fragmentManager中移除并且提交这次改变；同时如果该DialogFragment 有返回栈时，dismiss()会自动出栈。调用dismiss()还会调用DialogFragment的销毁回调，包括onDismiss()。

对话框的销毁回调有onCancel()和onDismiss() 两个； 一个Dialog对象有dismiss()和cancel()两个方法可以调用的，而DialogFragment仅保留了dismiss()方法；

在Android官方文档中，Dialog的onCancel()回调是为取消按钮设计的，当用户按返回家或者主动调用cancel时会执行onCancel()回调；而如果用户按了确认按钮（不适用cancel()而使用dismiss()），销毁对话框时只会执行onDismiss();

尽管DialogFragment中不能主动调用cancel()，但是用户按返回键依然会触发onCancel()； 通过onCreateDialog方法可以获取Dialog对象的引用，依旧可以调用cancel；

需要注意的是onDismiss并非与dismiss()一一对应，因为在旋转屏幕时也会隐藏并回调onDismiss。

另一种隐藏对话框的方式为替换。清单 10-5 展示了如何进行DialogFragment的替换；

```java
Listing 10-5. Setting Up a Dialog for a Back Stack
if (someview.getId() == R.id.btn_invoke_another_dialog)
{
    Activity act = getActivity();
    FragmentManager fm = act.getFragmentManager();
    FragmentTransaction ft = fm.beginTransaction();
    ft.remove(this);
    ft.addToBackStack(null);
    //null represents no name for the back stack transaction
    HelpDialogFragment hdf =
        HelpDialogFragment.newInstance(R.string.helptext);
    hdf.show(ft, "HELP");
    return; 
}
```

上述代码中，通过fragmenttransaction的remove将当前DialogFragment移除，并且添加了一个新的 HelpDialogFragment，在添加新对象之前，通过ft的addToBackStack方法添加了返回栈。这样当用户按返回键之后又会返回之前的对话框。

Dialog 销毁过程的启示

FragmentManager会管理所有加入其中的Fragment的状态，即当你触发设备配置项（device-configuration）时（例如旋转屏幕），fragment也会跟着重新创建。DialogFragment通过show()和dismiss()方法将自己添加到FragmentManager或从中移除。需要注意的是，show()方法是包含一个添加操作的，而每个Fragment只能被添加一次，因此我们不能先将DialogFragment对象添加到FragmentManager 再执行show()操作。

如果你想要在对话框隐藏之后还保留其状态，你可以在其Activity中保留或者在一个非DialogFragment的Fragment中保留。

## 3 一个DialogFragment 的案例
本节通过一个实例App演示了DialogFragment的使用，并且使用到了fragment与activity的交互，案例共用到5个java文件：

* MainActivity.java：应用程序的主Activity。通过简单的Textview展示了帮助文本，并且通过Menu可以启动Dialog。
* PromptDialogFragment.java：一个DialogFragment的案例。通过layout自定义了view 并且允许用户输入信息。包含3个按钮：保存，取消和帮助。注：在启动帮助对话框时使用技巧将本对话框加入返回栈。
* AlertDialogFragment.java：一个DialogFragment的案例，通过AlertBuilder直接在Fragment中创建一个Dialog，这是旧的创建对话框的方式。
* HelpDialogFragment.java：一个展示了帮助信息的非常简单的fragment，该帮助信息可以由主Activity或者PromptDialog启动，在创建时确认具体展示方式。
* OnDialogDoneListener.java：用Activity 实现，用于从fragment获取消息的接口。
为了使Activity监听fragment，可以在onAttach()方法中使用类型判断，根据当前class是否为OnDialogDoneListener类型来设置监听器，而不需要手动传入参数，代码如下：

	``` java
try {
    OnDialogDoneListener test = (OnDialogDoneListener)act;
}
catch(ClassCastException cce) {
    // Here is where we fail gracefully.
    Log.e(MainActivity.LOGTAG, "Activity is not listening");
}
```



### 3.1 嵌入式对话框的实现
从上述例子中除了弹出对话框的形式，我们还将提示对话框进行了嵌入式显示。将PromptDialogFragment当做一个Fragment嵌入到主Activity 内layout中的FrameLayout中，这样整个PromptDialogFragment的view将按照你预想的方式展示到指定的位置而不再是一个对话框形式。

同时，由于DialogFragment的dismiss方法中执行的操作正是从Fragmentmanager中移除一个Fragment，完美的跟嵌入式的显示方式向结合。


## 4 一些Google推荐的对话框方案
1、自定义对话可以通过Activity的Dialog样式来实现，只需要在清单文件中将activity的主题设置为Theme.Holo.Dialog即可。

``` xml
<activity android:theme="@android:style/Theme.Holo.Dialog" >
```

2、将Activity显示为大屏对话框，而小屏依然为全屏Activity，需要将Activity的主题设置为Theme.Holo.DialogWhenLarge。

``` xml
<activity android:theme="@android:style/Theme.Holo.DialogWhenLarge" >
```

## 5 总结
本章讨论了异步对话框及其在Android中的实现，分为如下部分：

1. Dialog是什么，我们为什么需要Dialog。
2. 异步对话框的特性。
3. 展示一个对话框的三个步骤。
4. 创建一个Fragment。
5. DialogFragment中创建一个对话框的两种办法。
6. FragmentTransaction展示对话框的步骤。
7. 当对话框展示过程中按返回键后的操作。
8. 返回栈和管理DialogFragments状态。
9. 如何接受对话框上按钮点击后的消息。
10. Fragment和Dialog交互的一个简洁方案。
11. 一个对话框中再次展示另个对话的实现。
12. 一些Google推荐的对话框方案。


## 参考：

[Android Doc Dialog](https://developer.android.google.cn/guide/topics/ui/dialogs)

### 代码：
[https://github.com/votzone/DroidCode/tree/master/ProAndroid/DialogFragmentDemo](https://github.com/votzone/DroidCode/tree/master/ProAndroid/DialogFragmentDemo)