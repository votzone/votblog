# 自动化测试
 无线客户端的发展很快，特别针对是android和ios两款无线操作系统的客户端应用，相应的测试工具也应运而生，这里主要给大家介绍一些针对iPhoneApp的自动化测试工具。
　　首先，我们把这些测试框架分为三大类：接口测试工具、注入式UI测试工具、录放式UI测试工具。
　　一、接口测试工具，主要在iphone SDK提供的单元测试框架的基础上，完成代码的接口功能测试。
　　这类工具用的比较多的是SDK本身提供的test unit，以及google的google-toolbox-for-mac工具。google的GTM工具是在test unit上做了一层封装，可以简单、快速的完成测试脚本编写，提供完善的测试日志和报告，并提供部分简单的UI测试功能。
　　详细的文档可以参考这里：http://code.google.com/p/google-toolbox-for-mac/wiki/iPhoneUnitTesting
　　二、注入式UI测试工具，可以完成对被测应用的UI功能测试，需要在源代码中加入一些必须的测试代码。优点是可以模拟用户的操作，测试被测应用的相关功能，可以覆盖比较全的应用功能。缺点是因为在源代码中插入了必须的测试代码，而这些应用发布时需要去除，引入了被测应用和发布应用不一致的风险。
　　UISpec,提供了用例运行前的准备和运行的恢复功能，UIQuery功能，以及较为完善的校验功能，但该工具的使用比较复杂，脚本的编写也很繁琐，虽然对UI可以query，但无法方便、清晰、直观的查看应用控件的属性。
　　详细的文档可以参考这里：http://code.google.com/p/uispec/wiki/Documentation
　　Bromine,脚本编写简单，对控件的操作，完全模拟touch事件实现，但控件的定位通过对控件重画，并插入定位需要的信息，xpath的描述串也稍显复杂，校验功能相对较弱。
　　详细的文档可以参考这里：http://code.google.com/p/bromine/
　　三、录放式UI测试工具，主要通过录制用户的操作行为，通过回放来完成对被测应用的功能测试，这类工具对UI的功能测试相对是比较弱的。
　　比较常用的有Instrument、FoneMonke 。
　　Instrument，是iOS提供的主要用于分析应用的性能和用户行为的工具，利用它可以完成对被测应用的简单的UI测试。
　　FoneMonke，是国外提供的一个开源的，免费的录制/回放工具。网站：http://www.gorillalogic.com/fonemonkey
　　以上是了解的一些针对iPhone App的自动化测试工具，大家感兴趣的可以了解了解，欢迎交流、学习！
　　
　　
# 微信自动化加好友

## 实现Wx自动加好友；

可用设备：手机，电脑，web服务器

方案：

手机自动模拟认为操作，实现加好友和发朋友圈功能；

Wx多开，为了避免频繁登录，需要在每台手机上多开wx，登录多个帐号；

web端控制手机：通过web端控制手机的执行流程；

## 设计方案：
1、多开：根据已有开源项目DroidPlugin和现有apk“多开盒子”，搞定自己的多开工程项目；

2、模拟操作：用于实现模拟认为操作；

3、控制逻辑：用于与web端交互，读取配置，并执行相应的模拟操作；

4、守护功能：用于处理常规问题，实现恢复崩溃和重启功能;

## 实现细节：
1、DroidPlugin 和 “多开盒子”研究分析，实现自己的多开项目；

- 确定能够多开的上限；

2、帐号相关：

多开情况是否会封号，如何避免？

频繁加好友等操作是否会引起封号？

3、配置文件相关：

有哪些信息需要配置？

- 设备唯一id，gps，ip地址，当前操作/操作序列，操作时间间隔，终止条件；

- 已添加好友列表（ban表）同步；
- 打招呼内容；
- 朋友圈内容；
- 不可恢复异常警报；

怎样的细化流程？
- web端按帐号操作还是按手机操作？

- 好友管理功能：
- web端发送指定命令到手机，收集各个手机中每个帐号的好友列表；
- 删除重复的好友；

4、模拟哪些人为操作？
- 加好友/接收好友申请；

- 发朋友圈；
- 删除重复好友；
- 获取所有好友信息；
- 日志；
- 登录、注销、切换帐号？

5、web端功能

- 管理手机/帐号

- 配置
- 好友
- 发送朋友圈

6、其他：
- 唯一标识一台手机的信息：
- - http://www.jianshu.com/p/178786f833b6
- - imei，meid，device_id, mac, serial number, android_id

7、守护功能：

- 重启微信、多开、控制和模拟逻辑app

- 启用辅助功能（Accessibility）
- 系统重启？


8、群控系统：
- 每隔xx秒提交一次加好友请求；

- 定时发布任务；
- 同一部加分机器，多个微信帐号切换间隔；
- 每个Wx提交加粉任务的时候，单次提交的间隔时间参数设置；
- 同一个wx多个任务执行的间隔时间；
- 每个任务加好友或营销的数量参数；