---
layout: post
title:  "IOS Spam 上架被拒原因分析及处理办法"
categories: Ios Programmer
tags: Ios Programmer
author: votzone
description: IOS Spam 上架被拒分析及处理办法

---

#IOS Spam 上架被拒原因分析及处理办法

## 问题描述
上传审核了一个马甲应用，根据之前的经验，在上架之前详细分析和对比的生成的ipa文件然后根据别人给的意见添加了一定比例的垃圾代码，删除了多余的资源文件以减少相同比例，甚至将每个图片资源的名称都改了名称，但还是提示了如下问题：

```
4. 3 Design: Spam
Guideline 4.3 - Design

We noticed that your app provides the same feature set as other apps submitted to the App Store; it simply varies in content or language, which is considered a form of spam.

The next submission of this app may require a longer review time.

```


## 初探

Project 和 Target 名称

![ios_porject_targets.png](http://resource.votzone.com/ios_porject_targets.png)

Target 名称是可以单独修改的，Project名称需要与左边 Progject Nagivator 中名称一致，并且修改Project Navigator会提示修改 Target名称；

Scheme 名称

![ios_scheme_name.png](http://resource.votzone.com/ios_scheme_name.png)

分析ipa文件可知，Scheme名称会是主可执行文件的名称，也就是生成的ipa文件名。

![ios_ipa_main_exe_file.png](http://resource.votzone.com/ios_ipa_main_exe_file.png)

点击如上Scheme会弹出`Manage Scheme`点击进入编辑Scheme界面

![iso_go_manage_scheme.png](http://resource.votzone.com/iso_go_manage_scheme.png)


![ios_scheme_edit.png](http://resource.votzone.com/ios_scheme_edit.png)



## 混淆代码

### 分析过程

首先观察并对比如下 obj-c 代码反编译后生成的二进制文件

外部声明宏定义字符串

```obj-c
#define xxx_ooo @"xxx_ooo"
#define xxx_ooo_1 @"xxx_ooo_111"
#define xxx_ooo_2 @"xxx_ooo_222"

```
temp.h文件
  
```
#import <Foundation/Foundation.h>

@interface temp : NSObject

@end

```

temp.m 文件

```
#import "temp.h"

@implementation temp

-(void) heheda{
    NSString *str = xxx_ooo_1;
}

-(void) aiyouwei{
    NSString *str = xxx_ooo_2;
    NSLog(@"%@", str);
}

-(void) zhijieting{
    if(NO){
        [self heheda];
    }
}

-(void) jianjieting{
// [BBJQUtilkit shouldexe] 直接返回false
    if([BBJQUtilkit shouldexe]){
        [self heheda];
    }
}

@end
```

* 二进制文件分析

1. 字符串分析  
![nsstring](http://resource.votzone.com/nsstring.jpg)
虽然我们在代码中使用宏定义声明了三个字符串，但是二进制文件中只存在`xxx_ooo_222`一个字符串

2. 代码判断  

```
-(void) heheda{
    NSString *str = xxx_ooo_1;
}
```

![call_func_empty_1](http://resource.votzone.com/call_func_empty_1.jpg)
`bx lr`： 将lr 寄存器中内容返回到pc寄存器，相当于`return;`

```
-(void) zhijieting{
    if(NO){
        [self heheda];
    }
}
```

![call_func_empty_1](http://resource.votzone.com/call_func_empty_2.jpg)
同上，也是直接返回；

```
-(void) jianjieting{
    if([BBJQUtilkit shouldexe]){
        [self heheda];
    }
}
```

![call_func_empty_1](http://resource.votzone.com/call_func_empty_3.jpg)

有具体代码实现

分析可以看出，虽然`zhijieting `和`jianjieting `两个方法的逻辑是相同的，但是由于`jianjieting `多调用了一层，导致编译器认为这是个正常的判断，从而正确的将我们的代码编译了。而`zhijieting `则不然，因为是对常量值NO做判断，在编译阶段直接优化了所有代码。

### junk 构建方案
根据以上推理和测试，我们基本可以确认那些代码会在编译阶段保留，这样我们先构建junk代码；

假设需要构建10个junk 类，每个类中有公共属性，公共方法和私有方法，每个类模板如下

```
// 文件junk1.h

@interface junk1
@property(nonatmic, strong) NSString *junk1_string1
...
@property(nonatmic, strong) NSString *junk1_stringN

-(void) junk1_public_func1;
...
-(void) junk1_public_funcN;
@end

// 文件junk1.m
#import "junk1.h"
@implemente junk1()
-(void) junk1_public_func1{
if([Util callexec()]){
	[[[junk2 alloc]init] junk2_public_funcX]
	...
	[[[junkX alloc]init] junkX_public_funcY]
}
}
...
-(void) junk1_public_funcN{
// 同junk1_public_func1
}

-(void) junk1_private_func1{
// 同junk1_public_func1
}
...
-(void) junk1_private_funcN{
// 同junk1_public_func1
}

@end

```

如上给出了junk1类的示例代码，其他代码相同。  
为了方便脚本实现，每个类头文件（.h）文件名与实现文件(.m)文件名相同且都为类名。


### python脚本实现

#### 随机字符串
>>随机字符串用于类名、变量名和方法名，我们的目的就是将这些名词合理的组合起来，因此构建出合理的随机字符串时脚本实现junk代码的基础。  
为了使随机字符串在一定程度上有意义，我的方案是准备一篇英文文献作为输入源，根据根据需要的长度来获取一个字符串。这样构建随机切出来的字符串会有一定的意义，以防**审核时机器扫码代码会识别太过无意义的类名和方法名（这个场景纯属猜测，具体机器扫码什么策略谁也不知道）**。  

由于是找的英文文章，其中会包含部分不合适的字符，需要过滤，因此我们随机字符串生成分两步：  

1. 过滤文章  
	
	```python
	def code_filter():
   		input_path = "./junkcode/coderes.txt"
	    out_path = './junkcode/coderes_out.txt'
   		with open(input_path,"r") as infile:
      		with open(out_path,"w") as outfile:
           	lines = "".join(infile.readlines())
            	nstring = MutableString()
            	for ch in lines:
            	# 判断每个字符是否为字母或者下划线
                	if ch in "abcdefghigklmnopqrstuvwxyz_ABCDEFGHIJKLMNOPQRSTUVWXYZ":
                    	nstring += ch
				outfile.writelines(str(nstring))

	```  
	>> coderes.txt中包含的是原始文章，coderes_out.txt为过滤后的文章。

2. 截取指定长度  
	
	```python
	coderes = "" # 保存所有文本信息
	cur_index = 0 # 当前位置计数器
	# 首先将所有过滤后的文本读取出来
	with open('./junkcode/coderes_out.txt') as resfile:
   		coderes = coderes.join(resfile.readlines())
   		
	def get_code_str():
    	global cur_index
		rslen = len(coderes)
    	if cur_index+20 >rslen:
        	cur_index = 0
    	cur_index += 20
    	# 返回根据当前位置确定的长度为20的字符串
    	return coderes[cur_index-20: cur_index]
	```
	
#### 构建junk 类

构建junk 类也分为两步，第一步创建出junk模板，第二步根据已有的junk类名为所有方法添加调用，如下代码为构建junk类的基本流程，详细代码见附件。

```
def create_junk_frame():

    if not os.path.exists(junk_path):
        os.mkdir(junk_path)
    with open (os.path.join(junk_path, "all_juk.h"), "w") as ajkfile:
        for i in range(0, 150):# 创建150个junk类，类名以“CLASS_”开头
            class_name = "CLASS_" + get_code_str()
            
            # 根据class_name初步创建
            create_class(junk_path, class_name)

            # 将所有类import到all_juk.h文件，方便之后拖入工程
            ajkfile.writelines(includ_header.format(class_name))

    ## 提取所有可用方法
    extract_func_call(junk_path)

    ## 为每个m文件中{}添加方法
    add_func_ctn_in_m(junk_path)
    
# 初步创建类框架的代码
def create_class(filepath,classname):
    h_file_path = os.path.join(filepath, classname+".h")
    m_file_path = os.path.join(filepath, classname + ".m")
    with open(h_file_path,"w") as hfile:
        with open(m_file_path,"w") as mfile:
            # 首先写入h文件和m文件的头部信息
            hfile.writelines(h_header_f.format(classname))
            mfile.writelines(m_header_f.format(classname))

            #为h文件写入 get_random_10() 个属性
            for i in range(0, get_random_10()):
                hfile.writelines(prop_formate.format(get_code_str()))
				
			#为m文件写入get_random_10()个属性
            for i in range(0, get_random_10()):
                mfile.writelines(m_func_realize.format(get_code_str(), "{}"))
			  
			#写入20个方法，根据should_static()方法随机判断是否需要为static方法（+，-）
            for i in range(0, get_random_20()):
                func_name = get_code_str()
                if should_static():
                    hfile.writelines(h_func_static.format(func_name))
                    mfile.writelines(m_func_static.format(func_name, "{}"))
                else:
                    hfile.writelines(h_func_dec.format(func_name))
                    mfile.writelines(m_func_realize.format(func_name, "{}"))

			# 写入h问价和m问价尾部信息
            hfile.writelines("@end")
            mfile.writelines("@end")
# 为每个m文件中{}添加方法     
def add_func_ctn_in_m(root_path):
    for root, dirs, files in os.walk(root_path):
        for file_name in files:
        	#找到m文件
            if file_name.endswith(".m"):
                class_name = file_name[:-2]
                mfile_path = os.path.join(root, file_name)
                with open(mfile_path) as rfile:
                    with open(mfile_path+"_","w") as wfile:
                        line = rfile.readline()
                        while line:
                        	# 查找其中包含{}的行，在create_class()时，我们将所有的方法实现为空方法，因此这里直接查找
                            if "{}" in line:
                                self_static = line.startswith("+")
                                func_name = line[line.index(")")+1: line.index("{")].strip(" ")
                                # 添加10行代码
                                ten_line_code = get_10_line_code(class_name, func_name,self_static)
                                line = line.replace("{}", "{"+ten_line_code+"}")
                            wfile.writelines(line)
                            line = rfile.readline()

                os.remove(mfile_path)
                os.rename(mfile_path+"_",mfile_path)

```


#### 添加junk类调用

考虑这样一个场景：当前代码添加了200个junk类，在二进制文件上与之前相比有很大不同，但是**当前代码是全包含之前代码**的。这样机器也可能会认为你在修改别人的代码，从而报spam。

初始代码：  

```
-(void) origion_fun_gaiming{
    NSString *a = @"";
    NSLog(@"%@",a);

    // JunkClass 为插入的代码调用
    [JunkClass junk_func];
    
    NSData *data =[NSData dataWithContentsOfFile:a];
    NSLog(@"%lu", (unsigned long)data.length);
    
}
```
于是我们做如下对比,源代码反编译图
![func_hunxiao_ori](http://resource.votzone.com/func_hunxiao_ori.png)

改名后反编译截图：
![func_hunxiao_gaiming](http://resource.votzone.com/func_hunxiao_gaiming.png)

添加junk调用反编译图
![func_hunxiao_hunxiao](http://resource.votzone.com/func_hunxiao_hunxiao.png)

从图中可以看出，添加一行调用后，反编译后会有明显不同，假如每隔的我们每隔3-5行就添加一行随机junk代码的调用，可以保证将原来的代码被充分混淆。

根据我们之前的分析，我们指定如下混淆方案：  
1. 在.h 文件中添加类为junk 类中的属性；
2. 在.m 文件的代码部分每个3-5行添加junk调用

```python
# 混淆代码

def insert_junk_call():
	# 抽取所有junk 类名及其方法
    extract_func_call(junk_path)

    for dir in need_hunxiao_dir:
        full_dir = os.path.join(base_path_dir,dir)
        # 如上代码进入需要混淆的类所在目录
        
        # 遍历所有文件
        for root, dirs, files in os.walk(full_dir):
            for file_name in files:
            	
            	# 对.h文件进行混淆
                if file_name.endswith(".h"):
                    h_hunxiao(os.path.join(root, file_name))
				# 对.m文件进行混淆
                if file_name.endswith(".m"):
                    m_hunxiao(os.path.join(root, file_name))
                  
# 混淆头文件                    
def h_hunxiao(h_file_path):
    hunxiao_codes = ""
    import_headers = ""
    for i in range(0, get_random_5()):
    	# gethunxiao_pro() 获取import 代码和 属性声明代码，其格式如下
    	# h_hunxiao_f='''@property(nonatomic, strong) {0} *{1};'''
		# import_header_f = '''#import "{0}.h"'''
        hunxiao_one, header_one = gethunxiao_pro()
        hunxiao_codes += hunxiao_one + "\n"
        import_headers += header_one+"\n"
     
     # 将以上获取的import 代码和 属性声明代码写入文件
     with open(h_file_path) as rfile:
        with open(h_file_path+"_", "w") as wfile:
            line = rfile.readline()
            after_interface = False
            while line:

                if "@interface" in line:
                    line = import_headers + line
                    after_interface = True

                if "@end" in line and after_interface:
                    line = hunxiao_codes + line

                wfile.writelines(line)
                line = rfile.readline()

    os.remove(h_file_path)
    os.rename(h_file_path+"_",h_file_path)
    
#混淆m文件
def m_hunxiao(m_file_path):
    with open(m_file_path) as rfile:
        with open(m_file_path+"_", "w") as wfile:
            cur_depth = 0
            line_counter = 0  #一个计数器，每隔3行写入一个junk调用
            line = rfile.readline()
            depth_counter = 0
            last_depth = 0
            while line:

                cur_depth += line.count("{")
                cur_depth -= line.count("}")

                if last_depth> 0 and cur_depth <=0:
                    depth_counter += 1

                if cur_depth > 0 and ";" in line and "return" not in line:
                    line_counter += 1
                    if line_counter % 3 == 0 and depth_counter > 1:
                        line += dict_all_func_call[get_random_int(len(dict_all_func_call))]

                last_depth = cur_depth
                wfile.writelines(line)
                line = rfile.readline()

    os.remove(m_file_path)
    os.rename(m_file_path+"_",m_file_path)

```

#### 字符串提取

根据前期的调研我们知道程序中的字符串也会出现在二进制文件中，**假如机器扫描时将字符串作为一个判断标准**，那么在过spam时就需要考虑将字符串提取出来并做处理了。

我的方案：自己定义一个方法，方法接受给定key值，通过`NSLocalizedString `获取对应字符串，判断字符串是否为加密，如果加密则解密后返回，否则直接返回。

```obj-c
// the fu*k code
+(NSString*) decodekeycode:(NSString*) keycode{
    NSString *str = NSLocalizedString(keycode, nil);
    if([str hasPrefix:app_id]){
        // app_id 为解密字符串所需key
        str = [str substringFromIndex:app_id.length];
        NSData *nsdata = [[NSData alloc] initWithBase64EncodedData:str options:0];
        NSData *nsCode = [app_id dataUsingEncoding:NSUTF8StringEncoding];     
        const char *bytes = [nsdata bytes];
        const char *codebytes = [nsCode bytes];      
        char* buffer = malloc([nsdata length]);   
        for(int i=0; i<[nsdata length]; i++){
            int j = i % [nsCode length];
            buffer[i] = bytes[i]^codebytes[j];
     	}
        NSData * nsBuffer = [[NSData alloc]initWithBytes:buffer length:[nsdata length]];
        return [[NSString alloc] initWithData:nsBuffer encoding:NSUTF8StringEncoding];
    }
    return str;
}
```

要实现如上的功能，需要python的强力支持，至少需要做到两步  
一、生成唯一key值
唯一key的作用有两个，一是唯一标识文本，二是在新马甲中能够统一修改，这样在新的马甲与本体不会因为字符串相同被查。

```
# key = 要修改的key值
# code = 当前应用id
def newKey(key, code, ):
    print code, key
    new_key = key+ code
    m5 = hashlib.md5()
    m5.update(new_key)
    return m5.hexdigest()
```

二、加密字符串  
因为字符串都提取到strings文件中，如果将文本全部明文暴露的话还是有可能被认为spam，在此我们*变种base64加密*，变种通过一个异或操作，将每个马甲的文本变得不同，通过base64将亦或后的数据变为能够通过文本保存的格式。

```
def encodeValue(code, value):

    orxstr = ""
    for i in range(0, len(value)):
        j = i % len(code)
        rst = ord(list(value)[i]) ^ ord(list(code)[j])
        orxstr = orxstr + chr(rst)

    res = base64.b64encode(orxstr)
    print res
    return code +res
    
def decodeValue(code, value):
    res = base64.b64decode(value[len(code):])
    orxstr = ""
    for i in range(0, len(res)):
        j = i% len(code)
        rst = ord(list(res)[i]) ^ ord(list(code)[j])
        orxstr = orxstr + chr(rst)
    res = orxstr
    return res

```

### 图片及其他资源

图片资源肯定要修改，ipa文件中car文件即包含了工程中的图片资源，可以使用[`cartool`](https://github.com/steventroughtonsmith/cartool) 来提取。

从`cartool` 我们能够看出，图片资源的名称被保留了，因此我们需要修改工程中图片名称，同时也需要将切图换一下，以防机器进行图片相似度匹配。

在一些情况下，我们也许会将一些资源例如固定的json数据，提示html页面放到工程中，这写资源在打包后会原封不动的放到ipa文件中，所以我们需要修改这些文件内容，最好修改成服务端下载的。

## 源码下载
当前代码比较混乱，暂时不放到github上了，单独将py文件拿出来。
[代码下载](http://resource.votzone.com/python%E6%B7%B7%E6%B7%86objc-%E4%BB%A3%E7%A0%81.zip)




