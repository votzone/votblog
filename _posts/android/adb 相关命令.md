# adb 相关命令

## 从手机中提取指定apk

```
1. 列出所有apk的包名
adb  shell pm list packages

2. 根据包名获取apk路径
adb pm path xx.xx

3. 获取apk
adb pull /data/app/xx.xx.apk ./xx.apk

```

## 使用aapt解析包信息

```
aapt d badging xx.apk
```