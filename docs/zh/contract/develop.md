# 合约开发

## 内置类型
GXChain智能合约，除了C++语法支持的所有类型外，还提供了合约内置类型。

### contract\_asset
合约内的asset类型，包含2个字段：
```
    int64_t     amount;
    uint64_t    asset_id;
```
其中amount表示资产数量，asset_id表示资产的instance id(比如资产id为1.3.1， 则其instance id最后的1)。

contract_asset类型的合约示例，可参考bank合约。

### signature

合约内的signature类型， 结构体定义：
```
struct signature {
   uint8_t data[65];
};
```

示例：
```c++
    void verify(std::string raw_string, std::string pub_key, signature sig)
    {   
        print("string, ", raw_string, "\n");
        print(pub_key, "\n");
        bool flag = verify_signature(raw_string.c_str(), raw_string.length(), &sig, pub_key.c_str(), pub_key.length());
        print("ret code, ", flag, "\n");
    } 
 ```


### public\_key
合约内的public key类型, 结构体定义：
```
struct public_key {
   char data[33];
};
```


### checksum256
合约内置的sha256类型， 结构体定义：
```
struct ALIGNED(checksum256) {
   uint8_t hash[32];
};
```

示例：
```
    void issue(const std::string& question, const checksum256& hashed_answer)
    {   
        uint64_t owner = get_trx_sender();
        records.emplace(owner, [&](auto &p) {
                p.issuer = owner;
                p.question = question;
                p.hashed_answer = hashed_answer;
        }); 
    }  
```


### checksum160
合约内置的ripemd160类型，结构体定义：
```
struct ALIGNED(checksum160) {
   uint8_t hash[20];
};
```

### checksum512
合约内的sha512类型, 结构体定义：
```
struct ALIGNED(checksum512) {
   uint8_t hash[64];
};
```

### block\_id\_type
合约内置的block_id_type类型， 结构体定义：
```
typedef struct checksum160      block_id_type;
```
## 内置API

在GXChain上开发智能合约，可以调用内置API来实现更加丰富的功能

| belong | api name | description |
| --- | --- | --- |
| <graphenelib/action.h> | current_receiver | 返回当前合约账号的instance id (即帐户id的最后一位) |
| <graphenelib/action.h> | get_action_asset_id | 返回本次调用向合约发送的资产instance id (即资产id的最后一位)|
| <graphenelib/action.h> | get_action_asset_amount | 返回本次调用向合约发送的资产数量 |
| <graphenelib/asset.h> | withdraw_asset | 将当前合约帐户的资产转移到链上账户 |
| <graphenelib/asset.h> | get_balance | 获取链上账户的某资产余额 |
| <graphenelib/crypto.h> | sha256 | 计算数据的sha256 |
| <graphenelib/crypto.h> | sha512 | 计算数据的sha512 |
| <graphenelib/crypto.h> | ripemd160 | 计算数据的ripemd160 |
| <graphenelib/crypto.h> | verify_signature | 验证签名 |
| <graphenelib/global.h> | get_head_block_num | 获取最新区块号 |
| <graphenelib/global.h> | get_head_block_id | 获取最新区块hash |
| <graphenelib/global.h> | get_head_block_time | 获取最新区块的时间，返回值单位秒 |
| <graphenelib/global.h> | get_trx_sender | 获取调用合约的账号的instance_id |
| <graphenelib/global.h> | get_account_id | 根据账号名获取账号的instance_id |
| <graphenelib/global.h> | get_asset_id | 根据资产名获取资产的instance_id |
| <graphenelib/system.h> | graphene_assert | 如果条件不满足，中断本次合约的执行并会滚所有状态 |
| <graphenelib/system.h> | graphene_assert_message | 如果条件不满足，输出必要的信息，但是本次合约的执行会继续 |
| <graphenelib/system.h> | print | 用于调试时日志的打印 |



### current\_receiver

函数类型: uint64_t current_receiver()

所在头文件: include: <graphenelib/action.h>

desc: 返回当前合约账号的instance id (即帐户id的最后一位)




### get\_action\_asset\_id

函数类型: uint64_t get_action_asset_id()

所在头文件: include: <graphenelib/action.h>

desc: 返回本次调用向合约发送的资产instance id (即资产id的最后一位)

返回值：返回0表示action无附带资产，返回非0表示资产的instance id 


#### example1
```c++
#include <graphenelib/action.h>
#include <graphenelib/contract.hpp>
#include <graphenelib/dispatcher.hpp>
#include <graphenelib/types.h>

using namespace graphene;

class helloworld : public contract
{
public:
helloworld(uint64_t id) 
    : contract(id)
{   
}   

//@abi action
//@abi payable
void deposit()
{   
    uint64_t asset_id = get_action_asset_id();
}   
};

GRAPHENE_ABI(helloworld, (deposit))
```

对这个合约通过钱包客户端调用
call_contract nathan helloworld {"amount":10000000,"asset_id":1.3.1} deposit "{}" GXC true
调用helloworld的deposit方法，在deposit方法的实现中调用get_action_asset_id()将返回1
            



### get\_action\_asset\_amount

函数类型: uint64_t get_action_asset_amount()

所在头文件: include: <graphenelib/action.h>

desc: 返回本次调用向合约发送的资产数量

返回值：返回0表示合约无附带资产，返回非0表示附带资产数量，数量需要除以10万




### withdraw\_asset

函数类型: void withdraw_asset(uint64_t from, uint64_t to, uint64_t asset_id, int64_t amount)

所在头文件: include: <graphenelib/asset.h>

desc: 将当前合约的资产转移到外部账户


**params:**

\<uint64_t\> from: 从哪个账号转账，一般是_self

\<uint64_t\> to: 转账到哪个外部账户，必须只传账号的instance_id，比如外部账户是1.2.33，那么传33即可

\<uint64_t\> asset_id: 指定转账的资产id，必须只传资产id的instance_id, 比如资产id是1.3.0， 那么传0即可

\<int64_t\> amount: 转账金额，这个数字包含了资产的精度，比如想转1个GXC，那么应该写100000




### get\_balance

函数类型: int64_t get_balance(int64_t account, int64_t asset_id)

所在头文件: include: <graphenelib/asset.h>

desc: 获取外部账户的某资产余额



**params:**

\<int64_t\> account: 链上账户的instace_id

\<int64_t\> asset_id: 指定资产的instance_id




### sha256

函数类型: void sha256(char data, uint32_t length, const checksum256 * hash)

所在头文件: include: <graphenelib/crypto.h>

desc: 计算数据的sha256


**params:**

\<char\> data: 用于计算sha256的字符串首地址

\<uint32_t\> length: data字符串的长度

\<const checksum256 *\> hash: 出参 用于存储计算的sha256




### sha512

函数类型: void sha512(char data, uint32_t length, const checksum512 * hash)

所在头文件: include: <graphenelib/crypto.h>

desc: 计算数据的sha512


**params:**

\<char\> data: 用于计算sha512的字符串首地址

\<uint32_t\> length: data字符串的长度

\<const checksum512 *\> hash: 出参 用于存储计算的sha512




### ripemd160

函数类型: void ripemd160(char data, uint32_t length, const checksum160 * hash)

所在头文件: include: <graphenelib/crypto.h>

desc: 计算数据的ripemd160


**params:**

\<char\> data: 用于计算ripemd160的字符串首地址

\<uint32_t\> length: data字符串的长度

\<const checksum160 *\> hash: 出参 用于存储计算的ripemd160




### verify\_signature

函数类型: bool verify_signature(const char data, uint32_t datalen, signature sig, const char * pub_key, uint32_t pub_keylen)

所在头文件: include: <graphenelib/crypto.h>

desc: 验证签名


**params:**

\<const char\> data: 签名的原始字符串

\<uint32_t\> datalen: data字符串的长度

\<signature\> sig: 签名数据

\<const char *\> pub_key: 签名私钥对应的公钥

\<uint32_t\> pub_keylen: 公钥的长度




### get\_head\_block\_num

函数类型: int64_t get_head_block_num()

所在头文件: include: <graphenelib/global.h>

desc: 返回最新区块号




### get\_head\_block\_id

函数类型: int64_t get_head_block_id()

所在头文件: include: <graphenelib/global.h>

desc: 返回最新区块hash




### get\_head\_block\_time

函数类型: int64_t get_head_block_time()

所在头文件: include: <graphenelib/global.h>

desc: 获取最新区块的时间，返回值单位秒




### get\_trx\_sender

函数类型: int64_t get_trx_sender()

所在头文件: include: <graphenelib/global.h>

desc: 获取调用合约的账号的instance_id




### get\_account\_id

函数类型: int64_t get_account_id(const char * data, uint32_t length)

所在头文件: include: <graphenelib/global.h>

desc: 根据账号名获取账号的instance_id

返回值： 返回-1表示无此帐户名，返回值>=0 表示帐户的instance id

**params:**

\<const char *\> data: 账号名，例如nathan

\<uint32_t\> length: 账号名的长度，例如nathan的长度是6

如果帐户存在，返回帐户的instance_id，如果帐户不存在，则返回-1



### get\_asset\_id

函数类型: int64_t get_asset_id(const char * data, uint32_t length)

所在头文件: include: <graphenelib/global.h>

desc: 根据资产名获取资产的instance_id

返回值： 返回-1表示无此资产名，返回值>=0 表示资产的instance id

**params:**

\<const char *\> data: 资产名

\<uint32_t\> length: 账号名的长度，例如nathan的长度是6




### graphene\_assert

函数类型: void graphene_assert(uint32_t test, const char* msg)

所在头文件: include: <graphenelib/system.h>

desc: 如果条件不满足，中断本次合约的执行并会滚所有状态


**params:**

\<uint32_t\> test: 

\<const char*\> msg: 




### graphene\_assert\_message

函数类型: void graphene_assert_message(uint32_t test, const char* msg, uint32_t msg_len)

所在头文件: include: <graphenelib/system.h>

desc: 如果条件不满足，输出必要的信息，但是本次合约的执行会继续


**params:**

\<uint32_t\> test: 

\<const char*\> msg: 

\<uint32_t\> msg_len: 




### print

函数类型: void print(const char* ptr)

所在头文件: include: <graphenelib/system.h>

desc: 用于调试时日志的打印


**params:**

\<const char*\> ptr: 

## 多索引表

#### <a name="index"></a>index
* [合约存储简介](#smart_contract_storage_brief_introduction)
* [示例代码](#example)
* [定义存储类型](#define_type)
* [增](#add)
* [删](#delete)
* [查](#find)
* [改](#modify)


### <a name="smart_contract_storage_brief_introduction"></a>合约存储简介
用于持久化存储合约数据  
数据必须以c++类的实例为单位存储，所以必须在合约中定义存储的c++类，每个类一张表，类似于关系型数据库的单表，不同的是他有以下特点：  
```  
支持多索引   
不支持联合索引   
只有主键是唯一的   
索引类型只支持uint64_t类型   
如果想要将字符串作为索引，必须用合约库中的uint64_t string_to_name(string str)将字符串转为uint64_t，字符串长度限制为12个字符以内，只能包括([a-z].[1-5])共32个字符   
对于除主键以外的索引，当有多条记录索引值一样时，获取的对象是最早插入存储的记录   
支持增删查改操作  
```
后面的内容围绕example来说明  
[go_back](#index)  


### <a name="example"></a>示例代码
```c++
#include <graphenelib/contract.hpp>
#include <graphenelib/dispatcher.hpp>
#include <graphenelib/multi_index.hpp>
#include <graphenelib/print.hpp>

using namespace graphene;

class multindex : public contract
{
    struct offer;

  public:
    multindex(uint64_t id)
        : contract(id)
        , offers(_self, _self)
    {
    }

    //@abi action
    void additem(uint64_t i1, uint64_t i2, std::string name)
    {
        uint64_t pk = offers.available_primary_key();
        print("pk=", pk);
        offers.emplace(0, [&](auto &o) {
            o.id = pk;
            o.idx1 = i1;
            o.idx2 = i2;
            o.stringidx = graphenelib::string_to_name(name.c_str());
        });
    }

    //@abi action
    void getbypk(uint64_t key)
    {
        auto it = offers.find(key);
        if (it != offers.end()) {
            dump_item(*it);
        }
    }

    //@abi action
    void getbyidx1(uint64_t key)
    {
        auto idx = offers.template get_index<N(idx1)>();
        auto matched_offer_itr = idx.lower_bound(key);
        if (matched_offer_itr != idx.end()) {
            dump_item(*matched_offer_itr);
        }
    }

    //@abi action
    void getbyidx2(uint64_t key)
    {
        auto idx = offers.template get_index<N(idx2)>();
        auto matched_offer_itr = idx.lower_bound(key);
        if (matched_offer_itr != idx.end()) {
            dump_item(*matched_offer_itr);
        }
    }
    
    //@abi action
    void getbystring(std::string key)
    {
        auto idx = offers.template get_index<N(stringidx)>();
        auto matched_offer_itr = idx.lower_bound(N(key));
        if (matched_offer_itr != idx.end()) {
            dump_item(*matched_offer_itr);
        }
    }

  private:
    void dump_item(const offer &o)
    {
        print("offer.id:", o.id, "\n");
        print("offer.idx1:", o.idx1, "\n");
        print("offer.idx2:", o.idx2, "\n");
        graphenelib::name n;
        n.value = o.stringidx;
        print("offer.stringidx:", n.to_string().c_str(), "\n");
    }

  private:
    //@abi table offer i64
    struct offer {
        uint64_t id;
        uint64_t idx1;
        uint64_t idx2;
        uint64_t stringidx;

        uint64_t primary_key() const { return id; }

        uint64_t by_index1() const { return idx1; }

        uint64_t by_index2() const { return idx2; }
        
        uint64_t by_stringidx() const {return stringidx; }

        GRAPHENE_SERIALIZE(offer, (id)(idx1)(idx2)(stringidx))
    };

    typedef multi_index<N(offer), offer,
                        indexed_by<N(idx1), const_mem_fun<offer, uint64_t, &offer::by_index1>>,
                        indexed_by<N(idx2), const_mem_fun<offer, uint64_t, &offer::by_index2>>,
                        indexed_by<N(stringidx), const_mem_fun<offer, uint64_t, &offer::by_stringidx>>>
        offer_index;

    offer_index offers;
};

GRAPHENE_ABI(multindex, (additem)(getbypk)(getbyidx1)(getbyidx2)(getbystring))

```


### <a name="define_type"></a>定义存储类型
```c++
  private:
    //@abi table offer i64
    struct offer {
        uint64_t id;
        uint64_t idx1;
        uint64_t idx2;
        uint64_t stringidx;

        uint64_t primary_key() const { return id; }

        uint64_t by_index1() const { return idx1; }

        uint64_t by_index2() const { return idx2; }
        
        uint64_t by_stringidx() const {return stringidx; }

        GRAPHENE_SERIALIZE(offer, (id)(idx1)(idx2)(stringidx))
    };

    typedef multi_index<N(offer), offer,
                        indexed_by<N(idx1), const_mem_fun<offer, uint64_t, &offer::by_index1>>,
                        indexed_by<N(idx2), const_mem_fun<offer, uint64_t, &offer::by_index2>>,
                        indexed_by<N(stringidx), const_mem_fun<offer, uint64_t, &offer::by_stringidx>>>
        offer_index;

    offer_index offers;
```

类型必须要带注释//@abi table offer i64  
@abi table固定写法  
offer是表名字，根据业务需求自定义不能超过12个字符并且只能是[a-z][1-5].共32种字符，以字母和.开头  
i64是索引类型，固定写i64即可  

对于struct offer{...}就是普通的c++类，最下面的GRAPHENE_SERIALIZE(offer, (id)(idx1)(idx2)(stringidx))用于序列化  
GRAPHEN\_SERIALIZE(类型名, (字段名1)(字段名2)(字段名3)(字段名4)...)  

uint64_t primary\_key() const { return id; } 这段代码的函数名和类型都是固定的，不能改动，用于指定唯一主键，这里把id作为主键  

其他3个函数用于定义二级索引时使用  

下面的代码用于根据定义的c++类来定义索引：  
```
    typedef multi_index<N(offer), offer,  
                        indexed_by<N(idx1), const_mem_fun<offer, uint64_t, &offer::by_index1>>,  
                        indexed_by<N(idx2), const_mem_fun<offer, uint64_t, &offer::by_index2>>,  
                        indexed_by<N(stringidx), const_mem_fun<offer, uint64_t, &offer::by_stringidx>>>  
        offer_index;  
typedef multi_index<N(offer), offer,这一行代码N(offer)与注释'//@abi table offer i64'中的offer要一致  
, offer用于指定之前定义的类型名字 
``` 

```
indexed_by<N(idx1), const_mem_fun<offer, uint64_t, &offer::by_index1>>,这段代码用于定义一个二级索引，一个表可以定义最多16个二级索引，这里定义了3个  
N(idx1)用于定义索引名  
const_mem_fun<offer, uint64_t, &offer::by_index1>尖括号中第一个参数是之前定义的offer类型名，第二个参数是索引的类型，第三个参数是索引调用的offer类中的函数名  
```

最后需要在合约中定义索引的实例变量offer_index offers， 在合约的构造函数中需要使用合约的_self(合约id)来初始化：   
```c++_
    multindex(uint64_t id)
        : contract(id)
        , offers(_self, _self)
    {
    }
```
[go_back](#index)  


#### <a name="add"></a>增
```c++
uint64_t pk = offers.available_primary_key();
print("pk=", pk);
offers.emplace(0, [&](auto &o) {
    o.id = pk;
    o.idx1 = i1;
    o.idx2 = i2;
    o.stringidx = graphenelib::string_to_name(name.c_str());
});
```
uint64_t pk = offers.available\_primary\_key(); 用于获取自增主键的下一个合法主键，也可以自己指定  

```c++
offers.emplace(0, [&](auto &o) {  
    o.id = pk;  
    o.idx1 = i1;  
    o.idx2 = i2;  
    o.stringidx = graphenelib::string_to_name(name.c_str());  
});
```

插入对象用lambda表达式来给新增的对象o赋值

o.stringidx = graphenelib::string_to_name(name.c_str());这里就是用字符串类型作为索引的实现方式，不支持直接用字符串作为索引

[go_back](#index)  


#### <a name="delete"></a>删
请先阅读[查](#find)  
删除一般通过表的迭代器删除，一般先调用find来找到需要删除的对象的迭代器来删除

offers.delete(it);  it是查找返回的对象的迭代器
[go_back](#index)  


#### <a name="find"></a>查
```c++
auto idx = offers.template get_index<N(stringidx)>();
auto matched_offer_itr = idx.lower_bound(N(key));
if (matched_offer_itr != idx.end()) {
    dump_item(*matched_offer_itr);
}
```

auto idx = offers.template get_index<N(stringidx)>();获取offer表名字为stringidx的索引，offer表有4个索引，一个是主键索引，其他3个二级分别是idx1，idx2，  stringidx，主键索引的查找更方便一些，不需要通过索引的名字先获取索引，再根据索引查找对应的key，而是直接offers.find(pk)，同样也是返回对象的迭代器。  

auto matched_offer_itr = idx.lower_bound(N(key));通过索引查找字符串key对应的主键对象，并返回相应的迭代器matched_offer_itr  
[go_back](#index)  


#### <a name="modify"></a>改

请请先阅读[查](#find)  

修改对象一般是通过对象的迭代器和lambda表达式来修改

```c++
offers.modify(it, 0, [&](auto &o) {
  //这里是对象的修改代码
  o.idx1 = 1000;
});
```
[go_back](#index)  
