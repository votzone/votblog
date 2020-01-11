---
layout: post
title:  "python的struct模块"
categories: python
tags: python
author: wq
description: Thinking In python struct。

---
Python中缺少类似C语言structs这样直接对字节序列进行序列化和反序列化的语法，作为一门脚本语言这是不必要的，但作为一门完整的编程语言必须提供这样的能力，否则不能独立的处理二进制文件和数据流。struct模块即为处理这类问题而诞生。

要处理字节序需要三个能力：首先是字节和变量值的互相转化，其次是字节序序问题，最后是数据对其的处理。

python中的基本变量类型有限，分别为int，float，bool类型。并且根据不同的运行环境所占用的长度不确定，这点跟C语言完全没法比。因此模块中我们需要提供一个确定变量和字节长度的转换方法，也就是struct模块中的 [`Format Characters`](https://docs.python.org/3/library/struct.html#format-characters)。还有字节序的问题，Inter x86 和AMD64 系列主机都是小尾数，而网络字节序是大尾数的字节序，并且有时我们要处理一份二进制文件事先并不知道其是大尾数还是小尾数表示，这些都需要开发人员去指定，因此需要提供对字节序的控制，在struct中也有对应的处理 [Byte Order](https://docs.python.org/3/library/struct.html#byte-order-size-and-alignment)。 最后就是数据对其的处理，我们知道C语言中为了更有效的处理struct类型会进行对其处理，例如结构体 Student代码如下，如果按照基本类型计算 一个char占用一个字节，两个int共占用8个自己，应该是9个字节的长度，但实际占用了12个字节。C编译器在处理如下结构体时一般按4字节对齐，这样在`gender`和`class_id`之间会有3个字节用于对齐。

```
struct Student{
    char gender;
    int class_id;
    int age;
};

int main(int argc, const char * argv[]) {
    // insert code here...
    printf("length of int %ld\n",sizeof(int));
    printf("length of Student %ld\n",sizeof(Student));
    return 0;
}

>> output
length of int 4
length of Student 12

```
struct 模块中将对其与字节序控制结合在一起，通过结构化字符串的首字符控制，如下：

字符 | 字节序 | 是否sizeof对其
---|---|---
`@` | 本机      | 是
`=` | 本机      | 否
`>` | 小尾数    | 否
`<` | 大尾数    | 否
`!` | 网络字节序（大尾数）| 否
> `@` 是默认字符，如果结构化字符串没有字节序控制符则默认为`@`。

接下来看变量和字节转换控制符有哪些：

符号 | C 类型 | Python 类型 | 字节长度
---|---|---|---
`x` | 对其位 | - | -
`c` | `char` | 长度为1的 `bytes` 字符串 | 1
`b` | `signed char` | `int` | 1
`B` | `unsigned char` | `int` | 1
`?` | `_Bool` | `bool` | 1
`h` | `short` | `int` | 2
`H` | `unsigned short` | `int` | 2
`i` | `int` | `int` | 4
`I` | `unsigned int` | `int` | 4
`l` | `long` | `int` | 4
`L` | `unsigned long` | `int` | 4
`q` | `long long` | `int` | 4
`Q` | `unsigned long long` | `int` | 4
`n` | `ssize_t` | `int` | -
`N` | `size_t` | `int` | -
`e` | 半精度浮点数（c不支持） | `float` | 2
`f` | `float` | `float` | 4
`d` | `double` | `float` | 8
`s` | `char[]` | `bytes` | -
`p` | `char[]` | `bytes` | -
`P` | `void *` | `bytes` | -

struct通过格式化字符串将字节和变量互转，格式化字符串由上述的`字节序字符`+`格式化字符`组成，且字节序字符可省略。例如： `>hhl` 表示两个`short` 和一个`long`。
```
>>> from struct import *
>>> pack('>hhl', 1, 2, 3)
b'\x00\x01\x00\x02\x00\x00\x00\x03'
>>> unpack('>hhl', b'\x00\x01\x00\x02\x00\x00\x00\x03')
(1, 2, 3)

```
连续的格式化字符可以通过数字简写，`>hhl`完全等价与 `>2hl`。
上例中`pack`和`unpack`是struct模块中的两个方法，分别表示将变量值转换为二进制字符串和从二进制字符串中转换出变量值。在struct模块中有4个基本的转换函数、一个批量转换的迭代器方法和一个计算长度的函数：

```
struct.pack(format, v1, v2, ...)  # 打包
struct.pack_into(format, buffer, offset, v1, v2, ...)
struct.unpack(format, buffer) # 解码
struct.unpack_from(format, buffer, offset=0)
```
如上4个基本转换函数，其中`pack`和`unpack`是一对，`pack`将`v1`，`v2`的值按照`format`的格式转化为二进制字符串，`unpack`将二进制字符串`buffer`按照`format`的格式转换一元组。`pack_into`和`unpack_into`是一对，`pack_into`将`v1`，`v2`的值转换成的二进制依次放入`buffer`中`offset`开始的位置。`unpack_into`则从`buffer`的`offset`开始转换出变量值。

```
struct.calcsize(format)
```
`calcsize`方法类似于C语言中`sizeof(Struct)` 用于计算format具体占用多少字符。

```
struct.iter_unpack(format, buffer)
```
`iter_unpack`以迭代方式转换`buffer`中的字节，每次都会读取并转化`calcsize（format）`长度的字节。

以上都是对struct模块中功能的介绍，为了更清楚的看怎么使用，还是需要例子。

1、使用基础的pack/unpack打包三个int型变量

```
>>> from struct import *
>>> pack('>hhl', 1, 2, 3)
b'\x00\x01\x00\x02\x00\x00\x00\x03'
>>> unpack('>hhl', b'\x00\x01\x00\x02\x00\x00\x00\x03')
(1, 2, 3)
>>> calcsize('hhl')
8
```
> 上述代码与官网代码中format字符串不同，加了个`>`符号，因为在mac操作系统python 2.7 的环境中c编译的`long`占用8个字节因此`l`长度为8。整个结果并按住8位对其，pack结果为：`'\x01\x00\x02\x00\x00\x00\x00\x00\x03\x00\x00\x00\x00\x00\x00\x00'`。

2、unpack 的结果可以直接通过变量接受，也可以使用命名元组。
```
>>> record = b'raymond   \x32\x12\x08\x01\x08'
>>> name, serialnum, school, gradelevel = unpack('<10sHHb', record)

>>> from collections import namedtuple
>>> Student = namedtuple('Student', 'name serialnum school gradelevel')
>>> Student._make(unpack('<10sHHb', record))
Student(name=b'raymond   ', serialnum=4658, school=264, gradelevel=8)
```

3、由于对其的原因，格式化字符的位置可能影响结构化的长度。

```
>>> pack('ci', b'*', 0x12131415)
b'*\x00\x00\x00\x12\x13\x14\x15'
>>> pack('ic', 0x12131415, b'*')
b'\x12\x13\x14\x15*'
>>> calcsize('ci')
8
>>> calcsize('ic')
5
```
> `struct` 模块不会对末尾的字符对其，如上`c`表示一个字节，在C语言中一个结构体不论先写`int`还是`char`最终长度都为8，但是`struct`模块中不同。如果想要结尾的字符也对其，需要用接下来的方法。

4、结尾使用 `0 + 格式化字符`的方式来结尾对其
```
>>> pack('llh', 1, 2, 3)
b'\x01\x00\x00\x00\x02\x00\x00\x00\x03\x00'
>>> pack('llh0l', 1, 2, 3)
b'\x00\x00\x00\x01\x00\x00\x00\x02\x00\x03\x00\x00'
```
> 格式字符串`llh`最后的h占用2位，而格式字符串`llh0l`共占用12位

5、`数字 + c`和`数字 + s`的区别
```
>>> scbytes = b'abcde'
>>> unpack('5s',scbytes)
(b'abcde',)
>>> unpack('5c',scbytes)
(b'a', b'b', b'c', b'd', b'e')
>>>
```
> 可见 `数字+c`的方式解码出5个长度为1的字符串，而`数字+s`的方式解码出长度为5的一个字符串

除了直接使用函数的方式打包和解码，`struct`模块也支持使用类的方式。类定义如下：

```
    class struct.Struct(format)
        pack(v1, v2, ...)
        pack_into(buffer, offset, v1, v2, ...)
        unpack(buffer)
        unpack_from(buffer, offset=0)
        iter_unpack(buffer)
        format
        size
```
> 类定义包含五个方法和两个属性，其中五个方法与模块中的方法一致。而size属性则是calcsize方法的体现。

```
>>> record=b'raymond   \x32\x12\x08\x01\x08'
>>> ray = Struct('<10sHHb')
>>> ray.unpack(record)
(b'raymond   ', 4658, 264, 8)
>>> ray.pack(b'raymond   ', 4658, 264, 8)
b'raymond   2\x12\x08\x01\x08'
```

