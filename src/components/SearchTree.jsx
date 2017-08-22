import React from "react";
import {Input, Tree} from "antd";
import 'antd/lib/tree/style/css';        // 加载 CSS
import 'antd/lib/input/style/css';        // 加载 CSS
import { Table, Button } from 'antd';
import 'antd/lib/table/style/css';        // 加载 CSS
import 'antd/lib/button/style/css';        // 加载 CSS
import axios from "axios";
const TreeNode = Tree.TreeNode;
const Search = Input.Search;
// import LTable from "ltable";
const gData = [{"leaf":false,"title":"医院1","key":"org_1","children":[{"leaf":true,"title":"科室1-1","key":"det_11"},{"leaf":true,"title":"科室1-2","key":"det_12"},{"leaf":true,"title":"科室1-3","key":"det_13"}]},{"leaf":false,"title":"医院2","key":"org_2","children":[{"leaf":true,"title":"科室2-1","key":"det_21"},{"leaf":true,"title":"科室2-2","key":"det_22"},{"leaf":true,"title":"科室2-3","key":"det_23"}]},{"leaf":false,"title":"医院","key":"org_3"}];

// 数据请求封装成函数，方便调用
function fetchData(url, self) {
    axios.get(url).then(function (data) {
        // 数据源在data.data中
        var datas = data.data
        for (var i in datas) {
            if (datas.hasOwnProperty(i)) {
                // series是每个数据的编号，可根据columns里的内容自定义
                datas[i].series = ++i;
            }
        }
        // 使用this.setState方法更新dataSource的数据源
        self.setState({
            dataSource: data.data
        })
    });
}

var dataList = [];
const generateList = (data) => {
    for (let i = 0; i < data.length; i++) {
        const node = data[i];
        const key = node.key;
        dataList.push({ key, title: node.title });
        if (node.children) {
           generateList(node.children, node.title);
        }
    }
};
generateList(gData);


const getParentKey = (title, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
        const node = tree[i];
        if (node.children) {
            if (node.children.some(item => item.title === title)) {
                parentKey = node.key;
            } else if (getParentKey(title, node.children)) {
                parentKey = getParentKey(title, node.children);
            }
        }
    }
     //console.log(parentKey);
    return parentKey;
};



class SearchTree extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            expandedKeys: [],
            searchValue: '',
            autoExpandParent: true,
            gData: gData,
            // 用于存放数据源，在axios异步请求以后更新this.setState({dataSource: data.data})即可
            dataSource: [],
            // Table表格的顶格标题数据，dataIndex是数据对应的下表，key是唯一识别标号
            columns: [{
                title: '序号',
                dataIndex: 'series',
                key: 'series'
            }, {
                title: '姓名',
                dataIndex: 'name',
                key: 'name'
            }, {
                title: '生日',
                dataIndex: 'birthday',
                key: 'birthday'
            }, {
                title: '电话',
                dataIndex: 'tel',
                key: 'tel'
            }, {
                title: '身份证号',
                dataIndex: 'idCard',
                key: 'idCard'
            }, {
                title: '住址',
                dataIndex: 'address',
                key: 'address'
            }]
        };
    }

    findNodeBykey(key){
        for (let i = 0; i < gData.length; i++) {
            if (gData[i].key == key) {
                return gData[i];
            }
        }
    }
    // 建议使用WillMount，DIdMount可能会出现频闪
    componentWillMount() {
        const self = this;
        let orgId = 0;
        fetchData('http://localhost:3000/data1', self); 
    }
    onSelect (selectedKeys,info,node) {
        console.log('selected', info.node.props.eventKey);
        var _key=info.node.props.eventKey;
        const self = this;
        var orgId=_key.substring(4);
        var _keyName=_key.substring(0,3);

        if(_keyName=="org"){
            // orgId= info[0].substring(4);
            // let node= this.findNodeBykey(info[0]);//获取节点
            // console.log("node======="+node)
            fetchData('http://localhost:3000/data2', self)
            if(_keyName=="dep"){
                var topOrgId;
                fetchData('http://localhost:3000/data2' + 1 + '/' + orgId, self);
            }
        }
    }
    onExpand(expandedKeys) {
        console.log(expandedKeys)

        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    }
    onChange(e) {
        const value = e.target.value;
        const expandedKeys = dataList.map((item) => {
            if (item.title.indexOf(value) > -1) {
                return getParentKey(item.title, gData);
            }
            return null;
        }).filter((item, i, self) => {
            return item && self.indexOf(item) === i;
        });
        this.setState({
            expandedKeys,
            searchValue: value,
            autoExpandParent: true,
        });
    }
    render() {
       // console.log(this.state.gData)
        const { searchValue, expandedKeys, autoExpandParent } = this.state;
        const loop = (data) => data.map((item) => {
            const index = item.title.indexOf(searchValue);
            const beforeStr = item.title.substr(0, index);
            const afterStr = item.title.substr(index + searchValue.length);
            const title = index > -1 ? (
                <span>
          {beforeStr}
                    <span style={{ color: '#1a27e7' }}>{searchValue}</span>
                    {afterStr}
        </span>
            ) : <span>{item.title}</span>;
            if (item.children) {
                return (
                    <TreeNode key={item.key} title={title}>
                      {loop(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode key={item.key} title={title} />;
        });
        return (
            <div style={styles}>
                <div style={styles.childLeft}>
                    <Search style={styles.search} placeholder="请输入查询关键字" onChange={this.onChange.bind(this)} />
                    <Tree
                        onExpand={this.onExpand.bind(this)}
                        expandedKeys={expandedKeys}
                        autoExpandParent={autoExpandParent}
                        onSelect={this.onSelect.bind(this)}
                    >
                        {loop(gData)}
                    </Tree>
                </div>
                <div style={styles.childRight}>
                    <Table dataSource={this.state.dataSource} columns={this.state.columns} />
                </div>
            </div>
        );
    }
}

// 样式对象
const styles = {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-around',
    search: {
        width: '100%'
    },
    childLeft: {
        background: '#fff',
        width: '25%'
    },
    childRight: {
        background: '#fff',
        width: '65%'
    }
}

export default SearchTree;
