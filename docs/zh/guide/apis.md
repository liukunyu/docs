# API Reference

GXChain的节点提供WebSocket和JSONRPC两种接口形式

## 链相关

### `get_chain_id`
获取链id

``` bash
curl POST --data '{
    "jsonrpc": "2.0",
    "method": "call",
    "params": [0, "get_chain_id", []],
    "id": 1
}' https://node1.gxb.io/rpc
```

### `get_dynamic_global_properties`
获取动态全局对象


``` bash
curl POST --data '{
    "jsonrpc": "2.0",
    "method": "call",
    "params": [0, "get_dynamic_global_properties", []],
    "id": 1
}' https://node1.gxb.io/rpc
```


## 区块相关

### `get_block`

通过区块号获取区块信息

``` bash
curl POST --data '{
    "jsonrpc": "2.0",
    "method": "call",
    "params": [0, "get_block", [1]],
    "id": 1
}' https://node1.gxb.io/rpc
```

### `get_block_header`

根据区块号获取区块头信息

``` bash
curl POST --data '{
    "jsonrpc": "2.0",
    "method": "call",
    "params": [0, "get_block_header", [1]],
    "id": 1
}' https://node1.gxb.io/rpc
```

## 对象相关

在GXChain里面，通过不同的对象来存储不同类型的数据，常见的有以下几种类型

| ID | Object Type |
| :--- | :--- |
| 1.2.x | 帐户对象 |
| 1.3.x | 资产对象 |
| 1.5.x | 理事会成员对象 |
| 1.6.x | 见证人对象 |
| 1.10.x | 提案对象 |
| 1.11.x | 操作历史对象 |
| 1.13.x | 待解冻余额对象 |
| 1.14.x | 预算项目对象 |
| 1.25.x | 忠诚计划冻结余额对象 |
| 2.0.0 | 系统全局参数对象 |
| 2.1.x | 动态参数对象 |
| 2.3.x | 资产动态参数对象 |
| 2.5.x | 帐户余额对象 |
| 2.6.x | 帐户统计对象 |
| 2.7.x | 交易对象 |
| 2.8.x | 区块摘要对象 |
| 2.9.x | 帐户交易历史对象 |
| 2.12.x | 见证人调度表对象 |

### `get_objects`

根据对象ID获取对象信息

``` bash
curl --data '{
    "jsonrpc": "2.0",
    "method": "call",
    "params": [0, "get_objects", [["1.25.100","1.2.200"]]], "id": 1
}' https://node1.gxb.io/rpc
```

## 账户相关


### `get_account_count`

获取链上帐户总数量

``` bash
curl --data '{
    "jsonrpc": "2.0",
    "method": "call",
    "params": [0, "get_account_count", []],
    "id": 1
}' https://node1.gxb.io/rpc
```


### `get_account_by_name`

根据`account_name`获取`account`信息，**不包含**关联对象的信息，如账户资产余额、待解冻余额、忠诚计划冻结余额等

``` bash
curl --data '{
    "jsonrpc": "2.0",
    "method": "call",
    "params": [0, "get_account_by_name", ["nathan"]],
    "id": 1
}' https://node1.gxb.io/rpc
```

### `get_full_accounts`

根据`account_ids`获取完整账户信息，**包含**关联对象的信息，如账户资产余额，冻结余额等

``` bash
curl --data '{
    "jsonrpc": "2.0",
    "method": "call",
    "params": [0, "get_full_accounts", [["1.2.1"],false]],
    "id": 1
}' https://node1.gxb.io/rpc
```

### `is_account_registered`
查询帐户名是否已注册。 若已注册，则返回true，未注册或者帐户名不合法，返回false

``` bash
curl --data '{
    "jsonrpc": "2.0",
    "method": "call",
    "params": [0, "is_account_registered", ["nathan"]],
    "id": 1
}' https://node1.gxb.io/rpc
```


## 资产相关

### `list_assets`

根据首字母查询资产

``` bash
curl --data '{
    "jsonrpc": "2.0",
    "method": "call",
    "params": [0, "list_assets", ["A", 100]],
    "id": 1
}' https://node1.gxb.io/rpc
```

### `lookup_asset_symbols`

根据资产名称获取资产详情

``` bash
curl --data '{
    "jsonrpc": "2.0",
    "method": "call",
    "params": [0, "lookup_asset_symbols", [["GXS"]]],
    "id": 1
}' https://node1.gxb.io/rpc
```

### `get_account_balances`
根据帐户id和资产id获取帐户余额， 如果资产id不指定，返回全部资产余额

``` bash
curl --data '{
    "jsonrpc": "2.0",
    "method": "call",
    "params": [0, "get_account_balances", ["1.2.42", ["1.3.0", "1.3.1"]]],
    "id": 1
}' https://node1.gxb.io/rpc

```

### `get_named_account_balances`

根据帐户名和资产id获取帐户余额， 如果资产id不指定，返回全部资产余额

``` bash
curl --data '{
    "jsonrpc": "2.0",
    "method": "call",
    "params": [0, "get_named_account_balances", ["gxbfoundation", ["1.3.0", "1.3.1"]]],
    "id": 1
}' https://node1.gxb.io/rpc

```
## 公信节点相关

### `get_trust_nodes`

获取所有的公信节点所属帐户id

``` bash
curl --data '{
    "jsonrpc": "2.0",
    "method": "call",
    "params": [0, "get_trust_nodes", []],
    "id": 1
}' https://node1.gxb.io/rpc
```

### `get_witness_by_account`

根据`account_id`获取`公信节点`信息，包括节点公钥、总票数、缺块数等

``` bash
curl --data '{
    "jsonrpc": "2.0",
    "method": "call",
    "params": [0, "get_witness_by_account", ["1.2.748971"]],
    "id": 1
}' https://node1.gxb.io/rpc
```

### `get_table_objects`






