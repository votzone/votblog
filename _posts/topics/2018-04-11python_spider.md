---
layout: post
title:  "一个小爬虫的实现"
categories: Python, Spider
tags: 
author: Wq
description: 使用python 提供的urllib2库和HTMLParser实现一个小爬虫，用于爬取静态html中手机号信息；

---

老板要爬一些简单的数据，大概是给定一个日期和基础url拼接一个请求，通过get方式拿到html文件然后提取想要的数据就行了。  
鉴于老板mac环境，就用mac自带的python 2.7了。

## 网络请求包选择
python中有很多库能够实现网络请求，例如urllib，urllib2，urllib3，httplib，httplib2，requests等。  

在Python 2.x中

| 库名称		  | 说明  |
|:------------- |---------------:|
| urllib | 提供了一些比较原始基础的方法，比如：urlencode |
| urllib2 | 提供了修改url请求头的方法 |
| urllib3 | 非标准库 |
| httplib | http客户端协议，通常不直接使用 |
| httplib2 | 非标准库 |
| requests | 非标准库 |

在Python 3.x中

| 库名称		  | 说明  |
|:------------- |---------------:|
| urllib | 有 |
| urllib2 | 无 |
| urllib3 | 非标准库 |
| httplib | 无 |
| httplib2 | 非标准库 |
| requests | 非标准库 |



## HTMl解析包选择
python中自带html解析库HTMLParser，在python 2.x中叫HTMLParser，在 3.x中改名为html.parser。

## 代码实现
要爬取的网页只要结构如下：[要爬取的网页](http://blog.votzone.com/onlinedata/cpa.html) ，其中客户姓名可能为空。要爬取内容仅为手机号。

经过上面的分析，我们确定使用urllib2和HTMLParser 来实现这个小爬虫，先看两个库的基本用法;

1、 urllib2 的基本用法


```
// get 请求
headers = {"User-Agent":"Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36"}

request = urllib2.Request(url,headers = headers)

response = urllib2.urlopen(request)

print(response.read())

// post请求
headers = {"User-Agent":"Mozilla...."}

formate = {
    "type":"AUTO",
    "doctype":"json",
    "xmlVersion":"2.0",
    "ue":"utf-8",
    "action":"FY_BY_ENTER",
    "typoResult":"true"
}

data = urllib.urlencode(formate)

request = urllib2.Request(url, data=data, headers = headers)

response = urllib2.urlopen(request)

print("-"*30)
print(response.read())

```

从上述代码我们可以看出，response为请求到的结果，可以通过 read()的方法以文本形式独处内容。


2、HTMLParser 的基本用法

```
from HTMLParser import HTMLParser

# create a subclass and override the handler methods
class MyHTMLParser(HTMLParser):
    def handle_starttag(self, tag, attrs):
        print "Encountered a start tag:", tag

    def handle_endtag(self, tag):
        print "Encountered an end tag :", tag

    def handle_data(self, data):
        print "Encountered some data  :", data

# instantiate the parser and fed it some HTML
parser = MyHTMLParser()
parser.feed('<html><head><title>Test</title></head>'
            '<body><h1>Parse me!</h1></body></html>')
            
```

运行一下上述代码我们就能分析得出，HTMLParser通过被继承重写其中关键方法，来处理被feed的html文本。

我们要做的就是将两个库组合到一起而已。

3、小爬虫实现

HTMLParser 需要自己继承来实现自己的逻辑



[参考1](https://blog.csdn.net/permike/article/details/52437492)
[参考2](https://docs.python.org/2.6/library/htmlparser.html)