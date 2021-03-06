# 快速开始
## 入门指导

本教程的目的是为GXChain智能合约开发提供指导，包括合约开发、部署、调试以及常见错误归类等相关内容。

GXChain智能合约采用C++语言编写，通过[Webassembly](https://webassembly.org/)虚拟机编译后部署在GXChain区块链网络上。编译后的智能合约主要包括abi文件与wast文件，abi文件是合约定义的接口文件，wast文件为中间代码文件。  

**开发智能合约之前，你需要做如下准备:**

- 对C++语言开发有一定程度的了解
- 对Linux、Mac系统命令有一定程度的了解
- 在本地启动gxb-core节点(witness_node和cli_wallet程序)（源码编译教程点[这里](https://github.com/gxchain/gxb-core)）


### 1. 启动本地私链

编译完成后，切换到witness_node程序所在目录，使用如下命令启动本地出块节点，data保存配置信息、生成的区块信息等。 启动本地私链教程点击[这里](../guide/private_chain.md )

```
./witness_node -d data
```

启动后大致如下图所示（请记录下Chain ID，cli_wallet连接时会使用到）：

![](./png/chain_id.jpg)

出块节点运行之后，切换到cli_wallet目录，运行如下命令，启动cli_wallet客户端与出块节点交互，包括创建账号、部署合约、合约调用等功能，均可通过cli_wallet客户端进行测试。(chain-id 切换为自己的id)

```
./cli_wallet -sws://localhost:11011 --chain-id=679beed54a9081edfd3ede349a0aa1962ea2dc9d379808fecce56226cb199c84
```

启动后大致如下图所示：（**初次启动显示为new**）

![](./png/cli_wallet.jpg)


### 2. 创建一个新钱包


首先你需要为你的钱包创建一个新的密码。这个密码被用于加密所有钱包的私钥。在教程中我们使用如下密码：`supersecret`

但你可以使用字母和数字的组合来创建属于你的密码。通过以下命令来创建你的密码：:

```
>>> set_password supersecret
```

现在你可以解锁你新建的钱包了：

```
unlock supersecret
```

### 3. 申领初始余额

资产账户包含在钱包账户中， 要向你的钱包中添加钱包账户, 你需要知道账户名以及账户的私钥。
在例子中，我们将通过`import_key`命令向现有钱包中导入my-genesis.json中初始化的`nathan`帐户：

```
import_key nathan 5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3
```

::: warning 提示
* `nathan`在初始文件中会被用于定义账户名,  如果你修改过`my-genesies.json` 文件，你可以填入一个不同的名字。并且，请注意`5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3`是定义在`config.ini`内的私钥
:::

现在我们已经将私钥导入进钱包, my-genesis.json中初始化的余额，需要通过`import_balance`命令来申领，无需申明费用：

```
import_balance nathan ["5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3"] true
```

你可以通过以下命令来检视你的账户：

```
get_account nathan
```

用以下命令获取账户余额：

```
list_account_balances nathan
```

### 4. 创建账户

现在我们讲创建一个新的账户`alpha` ，这样我们可以在 `nathan`和`alpha`两个账户中来回转账了。

通常我们用一个已有账户来创建新账户，因为登记员需要缴纳注册费用。 并且，登记员的账户需要进入Also, there is the requirement  lifetime member \(LTM\)状态。因此我们必须在创建新账户前，先将账户`nathan`升级到LTM状态， 使用`upgrade_account`命令来升级账户：

```
upgrade_account nathan GXC true
```
返回的信息中，在`membership_expiration_date`边上你会发现`2106-02-07T06:28:15`。 如果你看到`1970-01-01T00:00:00`，说明之前的操作出现了错误，`nathan`没能成功升级。

成功升级后，我们可以通过`nathan`来注册新账户，但首先我们需要拥有新账户的公钥。通过使用`suggest_brain_key`命令来生成公私钥对：

```
// 生成秘钥对
suggest_brain_key
```

然后调用register\_account / register\_account2接口创建新帐户

```
register_account alpha GXC6vQtDEgHSickqe9itW8fbFyUrKZK5xsg4FRHzQZ7hStaWqEKhZ GXC6vQtDEgHSickqe9itW8fbFyUrKZK5xsg4FRHzQZ7hStaWqEKhZ nathan nathan 10 true
```

使用transfer3命令转移部分资产到账户

```
transfer3 nathan alpha 1000 GXC test GXS true
```

使用如下命令查看资产余额：

```
list_account_balances alpha
```
## Hello World合约简介

在阅读本篇教程之前，假定您已经阅读完了[入门指导](#入门指导)

### 1. 功能简介与部署调用

####  1.0 合约功能

[Hello World合约](https://github.com/gxchain/gxb-core/tree/dev_master/contracts/examples/helloworld)是一个最精简的GXChain合约，通过分析该合约，我们可以掌握智能合约开发的基本框架。该合约实现了一个`hi action`，action是合约给外部调用提供的接口，功能为打印两次`hi user(user为调用action的参数)`字符串到控制台，输出结果如下

![](./png/console_print.jpg)

####  1.1 编译合约
智能合约编写完成后包括xxx.hpp文件和xxx.cpp文件，需要编译为xxx.wast文件和xxx.abi文件，才能部署到区块链上。您可以使用GXChain提供的gxx工具，编译wast和abi文件，该工具可以在目录`~/gxb-core/build/tools/gxx`找到。您可以切换到gxx所在目录，然后使用如下命令进行编译：

```
//编译wast文件，路径需要替换成你自己的
./gxx -o /Users/zhaoxiangfei/code/gxb-core/contracts/examples/helloworld/helloworld.wast /Users/zhaoxiangfei/code/gxb-core/contracts/examples/helloworld/helloworld.cpp

//编译abi文件，路径需要替换成自己的
./gxx -g /Users/zhaoxiangfei/code/gxb-core/contracts/examples/helloworld/helloworld.abi /Users/zhaoxiangfei/code/gxb-core/contracts/examples/helloworld/helloworld.hpp
```
####  1.2 部署合约

您可以使用如下命令部署Hello World合约，hello为合约用户名（执行部署合约命令则会创建一个合约账户，合约账户的资产只能通过合约来控制），nathan为支付手续费的账户，0 0 表示虚拟机类型和版本，/Users/zhaoxiangfei/code/gxb-core/contracts/examples/helloworld 为合约路径（**包括wast文件和abi文件**），GXS表示手续费类型，true表示是否广播。

```
// 部署合约
deploy_contract hello nathan 0 0 /Users/zhaoxiangfei/code/gxb-core/contracts/examples/helloworld GXS true
```

::: warning 注意
* 部署合约时，支付手续费的账户必须已经导入过私钥（上面命令支付账户为`nathan`），且账户余额足够支付手续费
:::

####  1.3 调用合约

您可以使用如下命令调用合约接口，GXChain的调用合约接口可以附加资产发送选项。附加资产的调用方式，会将资产发送到合约账户。合约账户的资产，只能通过合约自身代码使用提现API`withdraw_asset`来控制。
```
// 不附带资产
call_contract nathan hello null hi "{\"user\":\"gxchain!!!\"}" GXS true

// 附带资产(附带资产的action，需要在合约中添加 // @abi payable )
call_contract nathan hello {"amount":10000000,"asset_id":1.3.1} hi "{\"user\":\"gxchain!!!\"}" GXS true

```

::: warning 带转移资产的action定义
```
// @abi action
// @abi payable
void hi(std::string user)
{
	    {
        for (int i = 0; i < 2; ++i) {
            print("hi, ", user, "\n");
        }
    }
}
```
:::

### 2. 代码解析

Hello World智能合约只包含一个action，是一个最简单的智能合约。我们可以以此为例，分析智能合约的基本框架。

合约的开发包括**定义一个合约类，并提供一个apply接口**，apply接口可以使用系统提供的`GRAPHENE_ABI`来定义。

![](./png/hello_code.jpg)

以上，一个基础智能合约就完成了。其中头文件所在目录为`/Users/zhaoxiangfei/code/gxb-core/contracts/graphenelib`(更改为你的对应目录)，合约开发过程中，引入相关头文件之后，便可以使用合约的内置类型和内置api函数了。下一篇教程分析一个较为复杂的智能合约-红包合约。

## 红包合约简介

在阅读本篇教程之前，假定您已经阅读完了[入门指导](#入门指导)

### 1. 功能简介与部署调用

####  1.0 合约功能

[红包合约](https://github.com/gxchain/gxb-core/tree/dev_master/contracts/examples/redpacket)是一个相对复杂的合约，通过对红包合约的分析，我们来说明多索引表、内置API调用等功能的使用方式。

红包合约包括三个action：创建红包（issue）、打开红包（open）、关闭红包（close)。
> 注：调用创建红包（issue）接口可以附带资产；如果红包未抢完，发行者可以关闭红包，余额退还。
> 发红包需要设置一个口令（公钥），抢红包时，需要使用口令对应的私钥对自己用户id进行签名才可以抢成功。

- **调用发红包接口，调用过程与结果反馈如下**
```
# 发红包 pubkey为随机生成的口令 ：下面调用表示发5个红包，总金额为11 GXS（1.3.1表示GXS资产）
unlocked >>> call_contract nathan redpacket {"amount":1100000,"asset_id":1.3.1} issue "{\"pubkey\":\"GXC81z4c6gEHw57TxHfZyzjA52djZzYGX7KN8sJQcDyg6yitwov5b\",\"number\":5}" GXS true
{
  "ref_block_num": 15124,
  ...
  ...
  ...
  "signatures": [
    "1f7fade01ef08d986282164c1428fee37ecc5817c4e6bdc7c160220cf965b881d7417874ab22be48047becf62936e6a060a3e06c65e3548e90a72ddc1720794db3"
  ]
}
# 查看合约账户资产，当前合约只有一个用户发红包，所以金额为一个用户发送的资产11 GXS
unlocked >>> list_account_balances redpacket
11 GXS

# 查看红包table信息，subpackets是随机分成的5个子红包序列，pub_key用来验证签名
unlocked >>> get_table_objects redpacket packet 0 -1 10
[{
    "issuer": 17,
    "pub_key": "GXC81z4c6gEHw57TxHfZyzjA52djZzYGX7KN8sJQcDyg6yitwov5b",
    "total_amount": {
      "amount": 1100000,
      "asset_id": 1
    },
    "number": 5,
    "subpackets": [
      350531,
      150227,
      390591,
      66767,
      141884
    ]
  }
]

```

抢红包，需要知道发红包口令对应的私钥。即发红包时创建的口令为：GXC81z4c6gEHw57TxHfZyzjA52djZzYGX7KN8sJQcDyg6yitwov5b，那么需要知道该口令对应的私钥（此口令的私钥为5J9vj4XiwVQ2HNr22uFrxgaaerqrPN7xZQER9z2hwSPeWdbMKBM）。然后使用私钥对用户instanceid进行签名（签名方式使用cli_wallet提供了sign_string方法，instanceid为为账号id的最后一个字段，例如nathan的账号id是1.2.17，那么他的instanceid是17）

- **调用抢红包接口，调用过程与结果反馈如下**
```
#使用私钥对instanceid进行签名
unlocked >>> get_account_id nathan
"1.2.17"
unlocked >>> sign_string 5J9vj4XiwVQ2HNr22uFrxgaaerqrPN7xZQER9z2hwSPeWdbMKBM 17
"1f1d104d5750beba9fd4b0637ce69cf54721a57cce91ca81904653307eb72b0a840bd8a80c58df0a7be206a4c5c5b1fa0d96d497667e54579e717d499d0a3498b2"

#调用接口 抢红包
call_contract nathan redpacket null open "{\"issuer\":\"nathan\",\"sig\":\"1f1d104d5750beba9fd4b0637ce69cf54721a57cce91ca81904653307eb72b0a840bd8a80c58df0a7be206a4c5c5b1fa0d96d497667e54579e717d499d0a3498b2\"}" GXS true
#合约账户所剩余额
list_account_balances redpacket
unlocked >>> list_account_balances redpacket
7.09409 GXS
#合约账户剩余红包分配序列，由5个减少为4个，减少的项为390591，代表3.90591个GXS 被抢走
unlocked >>> get_table_objects redpacket packet 0 -1 10
[{
    "issuer": 17,
    "pub_key": "GXC81z4c6gEHw57TxHfZyzjA52djZzYGX7KN8sJQcDyg6yitwov5b",
    "total_amount": {
      "amount": 1100000,
      "asset_id": 1
    },
    "number": 5,
    "subpackets": [
      350531,
      150227,
      66767,
      141884
    ]
  }
]
# 抢红包记录
unlocked >>> get_table_objects redpacket record 0 -1 10
[{
    "packet_issuer": 17,
    "accounts": [{
        "account_id": 17,
        "amount": 390591
      }
    ]
  }
]

```
::: warning 提示
get_table_objects的参数分别为：

redpacket（合约名）、record（表名）、0（lower）、-1（upper）、10（limit）
:::

- **调用关闭红包接口，该接口只能由发红包的用户调用，会将未抢完的红包返回给用户，调用过程与结果反馈如下**

```
# 您可以使用如下命令关闭红包
unlocked >>> call_contract nathan redpacket null close "{}" GXS true

# 获取合约账户资产余额
unlocked >>> list_account_balances redpacket
0 GXS
```

####  1.1 编译合约

您可以使用如下命令编译智能合约的abi文件和wast文件

```
# 其中的redpacket.cpp所在路径需要替换为你自己的路径
./gxx -g /Users/zhaoxiangfei/code/gxb-core/contracts/examples/redpacket/redpacket.abi /Users/zhaoxiangfei/code/gxb-core/contracts/examples/redpacket/redpacket.cpp

# 其中的redpacket.cpp所在路径需要替换为你自己的路径
./gxx -o /Users/zhaoxiangfei/code/gxb-core/contracts/examples/redpacket/redpacket.wast /Users/zhaoxiangfei/code/gxb-core/contracts/examples/redpacket/redpacket.cpp
```

#### 1.2  部署合约

您可以使用如下命令部署Redpacket红包合约

```
# 需要将智能合约所在路径替换为你自己的路径
deploy_contract redpacket nathan 0 0 /Users/zhaoxiangfei/code/gxb-core/contracts/examples/redpacket GXS true
```

#### 1.3 调用合约

```
# 发红包 
unlocked >>> call_contract nathan redpacket {"amount":1100000,"asset_id":1.3.1} issue "{\"pubkey\":\"GXC81z4c6gEHw57TxHfZyzjA52djZzYGX7KN8sJQcDyg6yitwov5b\",\"number\":5}" GXS true

# 抢红包
call_contract nathan redpacket null open "{\"issuer\":\"nathan\",\"sig\":\"1f1d104d5750beba9fd4b0637ce69cf54721a57cce91ca81904653307eb72b0a840bd8a80c58df0a7be206a4c5c5b1fa0d96d497667e54579e717d499d0a3498b2\"}" GXS true

# 您可以使用如下命令关闭红包
unlocked >>> call_contract nathan redpacket null close "{}" GXS true
```

### 2. 代码解析

红包合约代码包含了内置API的调用，多索引表的使用。通过分析红包合约，我们来简略说明如何使用它们，合约框架可以参考上篇教程[Hello World合约简介](#hello-world合约简介)。
- 注释 // @abi payable表示该action可以附带资产，用来生成正确的abi文件
```
// @abi action
// @abi payable
void issue(std::string pubkey, uint64_t number){
	...
}
```

- 使用断言graphene_assert，失败时回滚action
```
graphene_assert(pubkey.size() > prefix_len, "invalid public key");
graphene_assert(pubkey.substr(0, prefix_len) == prefix, "invalid public key");
```

- 调用[内置API](./develop.html#内置api)
```
//引入相关头文件，内置API文档，请点击“内置API”
int64_t total_amount = get_action_asset_amount();
```

- 多索引表简单介绍

```
//每一个多索引表称为一个table，在合约开发中，定义为一个类。
//注释部分是用来生成abi文件的，详细内容请查看abi文件详解部分
//@abi table packet i64
struct packet {
    uint64_t                issuer;
    std::string             pub_key;
    contract_asset          total_amount;
    uint32_t                number;
    vector<int64_t>         subpackets;							// 可以定义复杂类型

    uint64_t primary_key() const { return issuer; }				// 定义一个主键函数，返回的值作为主键索引是唯一的。

    GRAPHENE_SERIALIZE(packet, (issuer)(pub_key)(total_amount)(number)(subpackets))
};

//定义多索引表类型
typedef graphene::multi_index<N(packet), packet> packet_index;
//声明多索引表类型的一个实例
packet_index            packets;

//增加
packets.emplace(owner, [&](auto &o) {
    o.issuer = owner;
    ...
});
//修改
packets.modify(packet_iter, sender, [&](auto &o) {
            o.subpackets.erase(subpacket_it);
});
//删除
packets.erase(packet_iter);
``` 
