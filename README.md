# melody-cli
> @melody-core 组织是一个年轻团队组成的开源组织，寓意旋律之主。@melody-core/melody-cli 是由组织内@六弦 @wxydesign 开发的命令行集成管理工具，它的能力来源于它集成的外部套件。

一个强大的、便捷的命令行集成管理工具，支持插拔式的命令工具集成，拥有完善的文档，支持自定义套件开发与集成。

## 背景故事
小明是某大厂的程序员，他善于使用各种命令行工具来实现他的某些需求———但随着公司以及社区的命令行工具安装的越来越多，他开始烦恼于如何记忆他们、管理他们； 而小明正在烦恼的时候，却不知道隔壁业务线又产出了新的命令行工具。<br>
+ 小明期望有一个统一的入口，来集成和管理所有命令 
+ 小明期望能方便的统一观察所有公司内产出的命令行工具，而不是单独的一个个了解它们。

而小明期望的，就是@melody-core/melody-cli的存在意义。

## 快速使用
> node版本支持: >=8.0.0  本地需要安装yarn

```shell
    # 安装
    sudo yarn global add @melody-core/melody-cli
    # 运行 melody 命令 即可查看帮助和文档
```

## 概念

### 命令行管理工具

melody-cli，是用来管理命令行工具的命令行工具。这么说可能有点绕，也许下面的例子可以让你明白：

> @melody-core/leo 是旋律组织开发的模板脚手架命令工具，它的作用是快速生成项目——类似”create-raect
-app“、”@vue/cli“，但@melody-core/leo集成的模板更加丰富，因为它的模板是不断增加的。

```shell
    #  @melody-core/leo 可以单独安装使用，但也可以将其作为melody-cli的一个套件；
    # 我们可以通过 melody search 或者 melody search @melody-core/leo来获取到leo的信息
    melody search
    # 安装套件
    melody install @melody-core/leo
    # 即可使用套件
    melody leo  
```
### 套件
每个符合melody-cli套件规范的npm包，都可以被视作为它的套件。套件可以理解为插件，可以扩展melody的命令，从而扩展melody的功能。
> 例如 @melody-core/leo 

而每个套件都是独立的npm包，因此它们当然也可以被单独安装使用。
```shell
    # 单独安装 @melody-core/leo
    sudo yarn global add @melody-core/leo
    # 使用它
    leo  
```
然而就像背景里讲的那样，我们为了方便集成管理，更期望用一个统一的入口去集成所有的命令，这让我们可以更方便的管理所有包，更可以随时了解组织内产出的包。

### 套件类别
为了更方便的管理套件，我们给每个套件定义一个类别,方便用户们进一步分类和了解该套件。


## 特性

+ 自动化管理自身 - 每次运行melody-cli时，它会告诉你是否需要更新它。
+ 插拔式管理套件 - 方便的集成和管理套件。
+ 关注点分离 - melody-cli与套件之间几乎是完全解耦的，每个套件都可以是独立的。
+ 便捷自由的套件开发 - 如果你想开发一个套件，建议直接使用leo的cli套件模板哦。



## 基础命令

| 命令 | 描述 |  具体使用 | 补充  |
| -- | ----- | ----- | -------------|
| melody search |  查询套件 |  melody search [package] | 不填参数时，默认查找所有melody-cli套件 |
| melody install | 安装套件 | melody install <package> | package必填，例：melody install @melody-core/leo |
| melody remove | 删除套件 | melody remove <package> | package必填，例：melody remove @melody-core/leo |
| melody update | 更新套件 | melody update [package] | 不填参数时，默认更新所有melody-cli套件 |

## 官方套件
> 运行命令 melody search 即可查看所有官方命令行套件哦

| 包 | 命令 | 描述 |  具体使用 | 补充  |
| -- | ---- |----- | ----- | -------------|
| @melody-core/leo | leo | 生成模板的脚手架命令 | melody leo [command] [options]| 一个便捷集成和管理项目模板的脚手架命令行工具 |

## 自定义套件

### 套件开发
> 你可以自由的开发自定义套件并在melody-cli中集成它，我们为您提供了 melody-kit-template 模板，您可以用过leo来选择它快速生成您的项目

```shell
   # 前置，安装了leo套件，并且在联网环境(为了拉下模板)。
   melody leo init 
   # 此处选择  melody-kit-template 即可。
```

### 使用开发模式来调试您的套件
在你进入了项目的根目录后，即可用--dev参数来开启melody套件开发模式
```shell
    # 前置，在自定义套件项目的根目录下
    melody  --dev
    # 这时候你就能在test命令分类下查看到您自定义的套件命令，并可以运行它
```

### 发布套件

```shell
    # 套件项目根目录下运行：
    melody publish 
```

## 开发文档

### commander
如果你想开发套件，甚至参与melody-cli的开发，建议你先玩一下commander，因为melody-cli和套件原则上都是基于它开发的。 <br>
它的官方文档地址：
https://github.com/tj/commander.js/blob/HEAD/Readme_zh-CN.md



