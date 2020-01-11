---
layout: post
title:  "滤镜效果相关调研"
categories: Programmer
tags: Programmer
author: Votzone
description: 图片滤镜效果调研
---

css3 filter 可以通过filter属性实现滤镜效果:
参考:http://www.runoob.com/cssref/css3-pr-filter.html
http://www.w3cplus.com/css3/ten-effects-with-css3-filter

滤镜效果有10种: 相关详见如上参考链接
filter name 效果 值 默认 
grayscale 灰度 将图像转换为灰度图像 0-1 0 
sepia 复古 将图像转换为深褐色 0-1 0 
saturate 饱和度 转换图像的饱和度 0-+ 1 
hue-rotate 色相旋转 给图像应用色相旋转 0-360 0 deg 
invert 反色 翻转输入图像 0-1 0 
opacity 透明度 转化图像透明度 0-1 0 
brightness 亮度 给图片一种线性乘法,使其更亮或更暗 0-+ 1 
contrast 对比度 调整图像对比度 0-+ 1 
blur 模糊 给图像设置高斯模糊 0-+ 0 px 
drop-shadow 阴影 给图片设置一个阴影效果   



Java端通过处理imagebuffer 字节流添加滤镜效果
开源代码: jhlabs项目http://www.jhlabs.com/ip/index.html
该项目实现了多种滤镜效果并且开放源代码, 经过试验和测试,如上css3 10中filter效果有部分可以通过修改jhlabs代码实现

filter name jhlabs对应Filter 说明
grayscale 灰度 GrayscaleFilter rate: 原始filter直接修改为灰白,添加一个rate值控制转化的比例
sepia 复古 SepiaToneFilter noise: 原始filter通过random随机生成noise实现复古,修改为可控
saturate 饱和度 SaturationFilter 效果不同
hue-rotate 色相旋转 - -
invert 反色 InvertFilter invertness: 原始filter直接将颜色值全部反转,添加一个invertness参数控制反转比例
opacity 透明度 OpacityFilter 无效果
brightness 亮度 ContrastFilter 该filter有brightness 和contrast两个参数 , 实现亮度和对比度
contrast 对比度 ContrastFilter 同上
blur 模糊 BlurFilter, BoxBlurFilter,VariableBlurFilter,MotionBlurFilter, LensBlurFilter LensBlurFilter 的效果类似, css的模糊效果直接作用于页面,模糊的大小和单位针对图片在界面上的显示大小, jhlabs的效果针对图片本身大小
drop-shadow 阴影 - 根据css效果图可知,该效果在图片之外,与图片本身无关

总结: 如上对比可知,
确认能实现的效果: grayscale, sepia, invert, brightness, contrast
不确定的效果: blur
待研究的效果: hue-rotate, saturate
不需要考虑的效果: drop-shadow

附件:https://github.com/yanchl/imagefilter



