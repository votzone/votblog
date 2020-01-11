## linux man 命令后面的圆括号的意义

我们经常会看到 在说一个对象的man page 的时候，会有这样的格式：
`mmap(2) ` `shm_open(3)`
这个后面的数字是什么意思呢，通过 man man 命令就可以知道，这个是数字是`section` ,
大多数类unix 操作系统，都采用相同的section 的约定：

```
Section 1
user commands (introduction)
Section 2
system calls (introduction)
Section 3
library functions (introduction)
Section 4
special files (introduction)
Section 5
file formats (introduction)
Section 6
games (introduction)
Section 7
conventions and miscellany (introduction)
Section 8
administration and privileged commands (introduction)
Section L
math library functions
Section N
tcl functions
```

## git

### git 标签
标签可以针对某一时间点的版本做标记，常用于版本发布。

列出标签  

```
$ git tag # 在控制台打印出当前仓库的所有标签
$ git tag -l ‘v0.1.*’ # 搜索符合模式的标签
```

打标签
git标签分为两种类型：轻量标签和附注标签。轻量标签是指向提交对象的引用，附注标签则是仓库中的一个独立对象。建议使用附注标签。

**创建轻量标签**  
`$ git tag v0.1.2-light`

**创建附注标签**  
`$ git tag -a v0.1.2 -m “0.1.2版本”`

创建轻量标签不需要传递参数，直接指定标签名称即可。
创建附注标签时，参数a即annotated的缩写，指定标签类型，后附标签名。参数m指定标签说明，说明信息会保存在标签对象中。

切换到标签

与切换分支命令相同，用`git checkout [tagname]`
查看标签信息
用git show命令可以查看标签的版本信息：
`$ git show v0.1.2`

删除标签
误打或需要修改标签时，需要先将标签删除，再打新标签。
`$ git tag -d v0.1.2 # 删除标签`

参数d即delete的缩写，意为删除其后指定的标签。

给指定的commit打标签
打标签不必要在head之上，也可在之前的版本上打，这需要你知道某个提交对象的校验和（通过`git log`获取）。

**补打标签**

`$ git tag -a v0.1.1 9fbc3d0`

标签发布
通常的git push不会将标签对象提交到git服务器，我们需要进行显式的操作：

```
$ git push origin v0.1.2 # 将v0.1.2标签提交到git服务器
$ git push origin –tags # 将本地所有标签一次性提交到git服务器
```

注意：如果想看之前某个标签状态下的文件，可以这样操作

1. `git tag`   查看当前分支下的标签

2. `git  checkout v0.21`   此时会指向打v0.21标签时的代码状态，（但现在处于一个空的分支上）

3. `cat  test.txt`   查看某个文件

### git push

```
git push
git push https://username:password@github.com/jmcx-git/dream-album-wx-app.git

git pull
git checkout -b local-branchname origin/remote_branchname

git tag
git checkout -b branch_name tag_name


```

### git pull 

```
// 合并远程代码
git pull origin master --allow-unrelated-histories
```

## shell


### 文件中字符替换
1. 检查修改后的名称是否已经被占用
2. 重命名文件
3. 替换字符

```
grep -rl "BankCard" .| xargs sed -i "" 's/BankCard/YHKModel/g'
grep -rl "BmobKit " .
grep -rl "majieke" .| xargs sed -i "" 's/majieke/kukesb/g'
grep -rl "MaJieKe" .| xargs sed -i "" 's/MaJieKe/KuKeSB/g'

grep -rl "UIKeyboardFrameEndMaJieKeUserInfoKey" . | xargs sed -i "" 's/UIKeyboardFrameEndMaJieKeUserInfoKey/UIKeyboardFrameEndUserInfoKey/g'
grep -rl "#import \"MaJieKe" . | xargs sed -i "" 's/#import \"MaJieKe/#import \"/g'

grep -rl "NSLocalizedString(@\"信用额度\",nil)" . | xargs sed -i "" 's/NSLocalizedString(@\"信用额度\",nil)/NSLocalizedString(@\"ab602feab945c9c3e34cedb52a0c00e1\",nil)/g'

grep -rl "NSLocalizedString(@\"first_page_running_text" /Users/chunleiyan/AfterJM/LoanSpace/iosLetsLoan/tmp/letsloan | xargs sed -i "" 's/NSLocalizedString(@\"first_page_running_text/NSLocalizedString(@\"ec5df37fc89119982e64889ddb7286d2/g'

```

**统计代码行数**  
如果想列出每个文件的行数，输入命令：

```
find.-name"*.m"-or-name"*.h"-or-name"*.xib"-or-name"*.c"|xargswc-l```

如果想直接列出总代码行数，输入命令：

```
find.-name"*.m"-or-name"*.h"-or-name"*.xib"-or-name"*.c"|xargsgrep-v"^$"|wc-l```
