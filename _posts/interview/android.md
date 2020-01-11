什么是ANR，如何避免
[[ListView原理与优化|ListView-Optimize]]
ContentProvider实现原理
介绍Binder机制
匿名共享内存，使用场景
如何自定义View，如果要实现一个转盘圆形的View，需要重写View中的哪些方法？(onLayout,onMeasure,onDraw)
Android事件分发机制
Socket和LocalSocket
[[如何加载大图片|Android-Large-Image]]
HttpClient和URLConnection的区别，怎么使用https
Parcelable和Serializable区别
Android里跨进程传递数据的几种方案。(Binder,文件[面试官说这个不算],Socket,匿名共享内存（Anonymous Shared Memory))
布局文件中，layout_gravity 和 gravity 以及 weight的作用。
ListView里的ViewType机制
TextView怎么改变局部颜色(SpannableString或者HTML)
Activity A 跳转到 Activity B，生命周期的执行过程是啥？(此处有坑 ActivityA的OnPause和ActivityB的onResume谁先执行)
Android中Handler声明非静态对象会发出警告，为什么，非得是静态的？(Memory Leak)
ListView使用过程中是否可以调用addView(不能，话说这题考来干啥。。。)
[[Android中的Thread, Looper和Handler机制(附带HandlerThread与AsyncTask)|Android-handler-thread-looper]]
Application类的作用
View的绘制过程
广播注册后不解除注册会有什么问题？(内存泄露)
属性动画(Property Animation)和补间动画(Tween Animation)的区别，为什么在3.0之后引入属性动画(官方解释：调用简单)
有没有使用过EventBus或者Otto框架，主要用来解决什么问题，内部原理
设计一个网络请求框架(可以参考Volley框架)
网络图片加载框架(可以参考BitmapFun)
Android里的LRU算法原理
BrocastReceive里面可不可以执行耗时操作?
Service onBindService 和startService 启动的区别