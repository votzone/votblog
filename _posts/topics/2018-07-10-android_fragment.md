---
layout: post
title:  "Android中Fragment的使用"
categories: Android
tags: Android
author: wq
description: Fragment可能是我心中一直以来的执念，由于Android开发并没有像一般流程一样系统的学习，而是直接在公司项目中改bug开始的。当时正是Fragment被提出来的时候，那时把全部精力放到了梳理代码业务逻辑上，错过了Fragment首班车，而这一等就到现在。

---
> Fragment可能是我心中一直以来的执念，由于Android开发并没有像一般流程一样系统的学习，而是直接在公司项目中改bug开始的。当时正是Fragment被提出来的时候，那时把全部精力放到了梳理代码业务逻辑上，错过了Fragment首班车，而这一等就到现在。

Android发布的前两个版本只适配小尺寸的手机。开发适配小尺寸手机app只需要考虑怎么将控件布局到Activity中，怎样打开一个新的Activity等就可以了。然而Android3.0开始支持平板，屏幕尺寸增大到10寸。这在很大程度上提升了Android开发的难度，因为支持的屏幕尺寸变大导致了更多不同尺寸手机的产生，一个简单的Activity很难同时适配这么多不同的尺寸。以邮件应用为例，在小尺寸的手机上我们可以使用一个Activity来显示邮件标题，另一个Activity显示邮件详情。但是在大屏幕的平板上有更合理的方式：同一个Activity的左侧显示标题，右侧显示详情。

Android 3.0引入了一个核心的类Fragment，这个类能够优雅的实现上述邮件例子中的屏幕适配问题。同时Android也发布了一个官方的支持库 support-v4，使用该库能够使用Fragment的接口适配之前的Android版本。有了这个库，我们能够容易的为手机，平板甚至电视来开发应用程序。

## 1、Fragment是什么？
以上面提到的邮件app为例，我们希望邮件App在小屏幕的手机上一个Activity显示标题，一个Activity显示详情。而在大屏幕平板上左边显示标题右边显示详情。

假如我们仅使用Activity来实现这个需求，我们需要根据设备类型创建两个不同的Activity显示流程。针对手机，需要两个Activity来协作，一个包含ListView的Activity来显示标题，另一个包含其他控件组合来显示详情；而针对平板，需要重新创建一个包含ListView和其他控件的Activity。在使用如上的方案时，我们可以通过<include>标签重用layout布局文件。但是编码部分呢？没有一个很好的方式来重用代码。Fragment就是为了解决这个重用的问题。

Fragment的主要功能是将布局和其对应的代码组合到一起统一管理和重用。针对邮件App，可以将显示标题的ListView部分组合为一个Fragment，显示详情的部分组合为一个Fragment，这样在针对手机和平板适配时，Activity只需要根据不同情况显示不同的Fragment即可，优雅的解决了代码和布局重用的问题。如下所示：

![FragmentDesign](figure_1_fragment_disign.png)

## 2、Fragment的构成
Fragment用于管理UI，因此其内部肯定有视图层级，为了在Fragment销毁后重建一致，需要传入一个bundle来重新配置视图。

当Fragment被销毁后重建时，Android会调用Fragment的空参构造方法来生成一个新的对象，并通过一个传入bundle参数的方法设置其状态。因此我们在继承以Fragment时必须保留其空构造方法。

因为每个Fragment都有自己的视图，很有可能的一种设计是：在某个操作后，将Activity中原来的Fragment替换为一个新的Fragment，而同时又想要在按返回键时返回到原来的Fragment，因此Fragment又有一个返回栈的设计。

## 3、Fragment的生命周期
Fragment的生命周期与Activity有很多相同，但更复杂，具体流程如下图：

![FragmentLifecycle](figure_2_fragment_lifecycle.png)
Fragment是一个继承至Object的类，与Activity不同，Android并不为我们事先创建好该对象，因此在将Fragment附加给一个Activity时必须自己创建一个Fragment对象。
在之前也提到过，Android虽然不创建Fragment，但是当Fragment附加到Activity时，Android会管理其销毁和重建，重建过程类似于如下代码：

``` java
public static MyFragment newInstance(int index) {
    MyFragment f = new MyFragment();
    Bundle args = new Bundle();
    args.putInt("index", index);
    f.setArguments(args);
    return f;
}
```

因此我们在创建一个Fragment时有必要按照如上代码的方式来创建Fragment实例。

当我们将创建的Fragment实例附加给Activity时，其生命周期的回调方法即开始起作用了。
### onInflate( ) 回调
通过在layout中添加<fragment>标签的方式使用Fragment时，onInflate()会执行。其主要目的是为了提供<fragment>标签中的属性，可以从该回调中读取属性并保留以后使用。
### onAttach( )回调
当Fragment附加到Activity后立即进行onAttach()，回调会传入所附加的Activity作为Context上下文。

```
@Override
public void onAttach(Context context) {
    super.onAttach(context);
    if (context instanceof OnFragmentInteractionListener) {
        mListener = (OnFragmentInteractionListener) context;
    } else {
        throw new RuntimeException(context.toString()
                + " must implement OnFragmentInteractionListener");
    }
}
```
> 上述代码使用onAttach()回调优雅的实现了listener的赋值。

##### 注意：

1、你可以保存Context对象作为Activity的引用也可以不这么做，因为Fragment有一个getActivity()会返回你所需要的Activity。

2、在onAttach()之后就不能再进行setArgument()调用了，因为onAttach()时已经附加到Activity，应该在之前确定Fragment的各个参数。因此setArgument()应该尽早调用。

### onCreate()回调
onCreate是下一个要执行的方法，回调方法执行时，整个Fragment的参数设置已经齐全了，包括Bundle传入的参数和所属Activity对象，但并不意味着视图层级已经构造完成了。同时回调方法不一定在Activity实例的onCreate之后。该回调的存在目的：

1. 获取传入的bundle；
2. 为Fragment提供一个尽早执行的入口，用于获取所需数据；

> 注： 回调方法都在主线程，因此是不能执行耗时较长的方法例如网络请求或者读取本地较大文件等。可以在onCreate中创建线程来获取数据，再通过handle 或者Loader的方式返回结果。


### onCreateView( )回调
onCreateView()试下一个要执行的回调方法，该方法中创建了一个视图层级（view 对象）并返回。参数包括一个LayoutInflater，一个ViewGroup和一个Bundle。需要注意的是尽管有parent（ViewGroup），我们并不能将创建的view 附加给parent。此处的parent仅仅在创建view时提供一些参考，之后会自动附加。

```
public View onCreateView(LayoutInflater inflater,
    ViewGroup container, Bundle savedInstanceState) {
    if(container == null)
    return null;
    View v = inflater.inflate(R.layout.details, container, false);
    TextView text1 = (TextView) v.findViewById(R.id.text1);
    text1.setText(myDataSet[ getPosition() ] );
    return v;
}
```

注:container 为null，说明没有Fragment没有视图层级上。
### onViewCreated( ) 回调
onCreateView之后并且在UI布局之前，其参数是一个view，即刚刚在onCreateView中返回的view。
### onActivityCreated( ) 回调
在onActivityCreated()回调方法之后，Fragment就可以与用户进行交互了。onActivityCreated()在Activity的onCreate()之后，并且Activity所有用到的Fragment都已准备完成。
### onViewStateRestored( ) 回调
该回调在Android 4.2之后引入，在Fragment重建时调用，之前重建时必须将重建逻辑放在在onActivityCreated()，现在可以放到这里。
### onStart( ) 回调
此时，Fragment已经可见，该回调与Activity的onStart()一致，之前在Activity中onStart回调的代码可以直接放到这里。
### onResume( ) 回调
与Activity的onResume()回调一致。
### onPause( ) 回调
与Activity的onPause()一致。
### onSaveInstanceState( )回调
与Activity相同，Fragment也提供一个能够保存状态的回调。通过该回调方法，可以将Fragment中的状态值以bundle的形式保存起来，在onViewStateRestored()的时候重建。需要注意的是，Fragment之所以被回收就是因为内存问题，因此应该只保留需要保留的数据。

如果该Fragment依赖于另一个Fragment，不要试图保存其直接的引用，而应该使用id或者tag。

注：尽管该回调通常发生在onPause()之后，但这并不意味着就在onPause之后立即执行。
### onStop( ) 回调
与Activity的onStop()一致。
### onDestroyView( ) 回调
在创建的view视图从Activity脱离（detach)之前的回调。
### onDestroy( ) 回调
在View销毁之后，Fragment真正开始销毁了，此时已然能够找到该Fragment但是该Fragment已经不能进行任何操作。
### onDetach( ) 回调
从Activity脱离，Fragment不在拥有view视图层级。

## 使用 setRetainInstance( )
Fragment与Activity是分开存在的两个对象，因此在Activity销毁并重建时有两种选择：1、完全重建Fragment；2、在销毁时保留Fragment对象并在Activity重建时使用，正如上图8-2中虚线路径。

Fragment将这种选择交给了开发者，通过提供的 setRetainInstance()方法来决定使用哪种办法。如果方法传入false则使用第一种，否则使用第二种方式。
该方法设置的时机可以在onCreate()、onCreateView()以及onActivityCreate()，越早越好。

## Fragment 简单案例
[案例代码](https://github.com/votzone/DroidCode/tree/master/Fragments)
案例是一个类似于邮件的布局的小说展示应用，分为横屏和竖屏不同布局，横屏时显示左右结构，竖屏时先后显示。为了简化实现过程，所有数据为内存中的数据。

首先是main.xml的实现，对于横屏和竖屏分别实现两个不同的main.xml布局（分别对应res/layout 文件目录和res/layout-land目录）

```xml
<?xml version="1.0" encoding="utf-8"?>
<!-- This file is res/layout/main.xml -->
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
        android:orientation="vertical"
        android:layout_width="match_parent"
        android:layout_height="match_parent">
    <fragment class="com.androidbook.fragments.bard.TitlesFragment"
            android:id="@+id/titles"
            android:layout_width="match_parent"
            android:layout_height="match_parent" />
</LinearLayout>
```

``` xml
<?xml version="1.0" encoding="utf-8"?>
<!-- This file is res/layout-land/main.xml -->
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
        android:orientation="horizontal"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:background="#fff">
    <fragment class="com.androidbook.fragments.bard.TitlesFragment"
            android:id="@+id/titles" android:layout_weight="1"
            android:layout_width="0px"
            android:layout_height="match_parent"
            android:background="#00550033" />
    <FrameLayout
            android:id="@+id/details" android:layout_weight="2"
            android:layout_width="0px"
            android:layout_height="match_parent" />
</LinearLayout>
```

当手机竖屏是，创建的MainActivity中只包含一个TitleFragment，当为横屏时包含两部分，因此我们实现一个方法来确定是否为多面板应用。

```
public boolean isMultiPane() {
    return getResources().getConfiguration().orientation == Configuration.ORIENTATION_LANDSCAPE;
}
```

我们在加载TitlesFragment完成之后做这么一件事：加载一篇文章。对于横屏的显示到右边对于竖屏显示到新的Activity。因此该实现逻辑需要放到MainActivity，TitlesFragment在适合的事件调用MainActivity即可。

```
@Override
public void onAttach(Activity myActivity) {
   Log.v(MainActivity.TAG, "in TitlesFragment onAttach; activity is: " + myActivity);
   super.onAttach(myActivity);
   this.myActivity = (MainActivity)myActivity;
}
```

```
@Override
public void onActivityCreated(Bundle icicle) {
    super.onActivityCreated(icicle);
    ......
    myActivity.showDetails(mCurCheckPosition);
}
```

showDetails的实现

``` java
public void showDetails(int index) {
   Log.v(TAG, "in MainActivity showDetails(" + index + ")");
    if (isMultiPane()) {
        // Check what fragment is shown, replace if needed.
        DetailsFragment details = (DetailsFragment)
                getFragmentManager().findFragmentById(R.id.details);
        if (details == null || details.getShownIndex() != index) {
            // Make new fragment to show this selection.
            details = DetailsFragment.newInstance(index);
            
            // Execute a transaction, replacing any existing
            // fragment inside the frame with the new one.
            Log.v(TAG, "about to run FragmentTransaction...");
            FragmentTransaction ft
                    = getFragmentManager().beginTransaction();
            //ft.setCustomAnimations(R.animator.fragment_open_enter,
            //    R.animator.fragment_open_exit);
            ft.setCustomAnimations(R.animator.bounce_in_down,
                  R.animator.slide_out_right);
            //ft.setCustomAnimations(R.animator.fade_in,
            //    R.animator.fade_out);
            //ft.setTransition(FragmentTransaction.TRANSIT_FRAGMENT_FADE);
            ft.replace(R.id.details, details);
            ft.addToBackStack(TAG);
            ft.commit();
        }
    } else {
        // Otherwise we need to launch a new activity to display
        // the dialog fragment with selected text.
        Intent intent = new Intent();
        intent.setClass(this, DetailsActivity.class);
        intent.putExtra("index", index);
        startActivity(intent);
    }
}
```
根据横竖屏的不同，分别显示到右边或者新的Activity。
整体实现完毕，详见代码 [https://github.com/votzone/DroidCode/tree/master/Fragments](https://github.com/votzone/DroidCode/tree/master/Fragments)

### 注意：
#### 1、在案例中Fragment的添加和替换有两种方式

1) 通过xml直接添加fragmet标签，指定其实现类即可。

2) 通过FragmentManager来动态添加，就像DetailsFragment中一样，或者拿到父view添加：

``` java    
DetailsFragment details = DetailsFragment.newInstance(getIntent().getExtras());
getFragmentManager().beginTransaction()
    .add(android.R.id.content, details)
    .commit();
```
	
#### 2、使用Fragment的引用时，可以通过FragmentManager的`findFragmentById` 或`findFragmentByTag` 的方式获取。

#### 3、在onSaveInstanceState的参数bundle实例中保存状态

``` java
@Override
public void onSaveInstanceState(Bundle icicle) {
   Log.v(MainActivity.TAG, "in TitlesFragment onSaveInstanceState");
    super.onSaveInstanceState(icicle);
    icicle.putInt("curChoice", mCurCheckPosition);
}
```
#### 4、与Fragment之间的交互（获取引用）的方法
1）通过`FragmentManager`的`findFragmentByTag`或者`findFragmentById`来找到该Fragment，然后调用方法

```
FragmentOther fragOther = (FragmentOther)getFragmentManager().findFragmentByTag("other");
fragOther.callCustomMethod( arg1, arg2 );
```

2）通过`getTargetFragment()`找到当前Fragment的TargetFragment来获取引用;

```
TextView tv = (TextView)getTargetFragment().getView().findViewById(R.id.text1);
tv.setText("Set from the called fragment");
```

对一个Fragment设置TargetFragment需要使用FragmentManager，如下：

```
mCalledFragment = new CalledFragment();
mCalledFragment.setTargetFragment(this, 0);
fm.beginTransaction().add(mCalledFragment, "work").commit();
```