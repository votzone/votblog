## pod安装和一些操作

### 使用brew 安装

```shell
brew install cocoapods;

```

### 项目中有多个target时的配置方式

情景描述: 通常一个project 中有一个项目,使用官方描述的方案即可.
当前情景中的项目中有两个target, `TargetA`和`TargetB`可以使用如下方式

```ruby

# 方式1 直接对两个target都添加pod导入
# Podfile
platform :ios, '9.0'
use_frameworks!

target 'TargetA' do
    pod 'Quick', '0.5.0'
    pod 'Nimble', '2.0.0-rc.1'
end

target 'TargetB' do
    pod 'Quick', '0.5.0'
    pod 'Nimble', '2.0.0-rc.1'
end

# 方式2 
# Podfile
platform :ios, '9.0'
use_frameworks!

def testing_pods
    pod 'Quick', '0.5.0'
    pod 'Nimble', '2.0.0-rc.1'
end

target 'TargetA' do
    testing_pods
end

target 'TargetB' do
    testing_pods
end

```