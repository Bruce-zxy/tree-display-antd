import React from 'react';
import ReactDom from 'react-dom';

import { Router, Route, hashHistory } from 'react-router';

import DatePicker from 'antd/lib/date-picker';  // 加载 JS
import 'antd/lib/date-picker/style/css';        // 加载 CSS
import moment from 'moment';
const { MonthPicker, RangePicker } = DatePicker;

const dateFormat = 'YYYY/MM/DD';
const monthFormat = 'YYYY/MM';
import SearchTree from './SearchTree.jsx';


var App = React.createClass({
    render: function() {
        return (
            <div>
                <h5 className="title">hello, yeoman app!</h5>
                <div>React Router: </div>
                <div><a href="#/list">list page</a></div>
                <div><a href="#/detail">detail page</a></div>
                <div><a href="#/tree">tree</a></div>
                <DatePicker defaultValue={moment('2015/01/01', dateFormat)} format={dateFormat} />
            </div>
        );
    }
});

var List = React.createClass({
    render: function() {
        return (
            <div>
                <h5 className="title">hello, yeoman app!</h5>
                <div><a href="#/">返回首页</a></div>
                <div>这是列表页</div>
            </div>
        );
    }
});

var Detail = React.createClass({
    render: function() {
        return (
            <div>
                <h5 className="title">hello, yeoman app!</h5>
                <div><a href="#/">返回首页</a></div>
                <div>这是详情页</div>
            </div>
        );
    }
});

//最终渲染
ReactDom.render((
    <Router history={hashHistory}>
        <Route path='/' component={App}></Route>
        <Route path='/list' component={List} />
        <Route path='/detail' component={Detail} />
        <Route path='/tree' component={SearchTree} />
    </Router>
), document.getElementById('app'));
