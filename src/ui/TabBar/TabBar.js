import './TabBar.css';
import imageHome from './home.png';
import imageHomeActive from './home_active.png';
import imageCategory from './category.png';
import imageCategoryActive from './category_active.png';
import imageCart from './cart.png';
import imageCartActive from './cart_active.png';
import imageMe from './me.png';
import imageMeActive from './me_active.png';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';

class TabBar extends Component {
    constructor(props) {
        super(props);
        this.checkoutHash = this.checkoutHash.bind(this)
        this.state = {
            defaultList: [
                {
                    link: "/home",
                    name: "首页",
                    pic: imageHome,
                    picActive: imageHomeActive
                },
                {
                    link: "/categories",
                    name: "分类",
                    pic: imageCategory,
                    picActive: imageCategoryActive
                },
                {
                    link: "/cart",
                    name: "购物车",
                    pic: imageCart,
                    picActive: imageCartActive
                },
                {
                    link: "/user",
                    name: "我的",
                    pic: imageMe,
                    picActive: imageMeActive
                },
            ],
            selTabIndex: 0
        }
    }

    // 简单修复商品详情跳转购物车所携带的 hash中存在home和cart 导致两个tab同时点亮
    checkoutHash(link) {
        const history = createHistory();
        let itemHash = history.location.hash.split('/');
        if (link.indexOf(itemHash[itemHash.length - 1]) !== -1) {
            return true
        } 
        return false
    }

    render() {
        const { defaultList, selTabIndex } = this.state;
        const { tabData,style,showBar,showBarIndex,children } = this.props
        let styles = Object.assign({}, style)
        if (styles && styles.height) {
            styles.lineHeight = styles.height

        }
        const defaultWidth = children ?  100 / children.length : (tabData ? 100 / tabData.length : 100 / defaultList.length)
        return (
                <div className="TabBar" >
                    <ul style={styles}>
                        {
                            children ? 
                                children
                                    :
                                (tabData ? (
                                    tabData.map((item,index) => {
                                        return (
                                            <li key={'tab'+index} 
                                                style={{ width: defaultWidth + '%',}} className="undefault-li"
                                                onClick={() => {
                                                    this.setState({
                                                        selTabIndex: index
                                                    },() => this.props.onSel(index))
                                                }}
                                            >
                                                {item.title}
                                            </li>
                                        )
                                    })) 
                                    : 
                                    (defaultList.map((item, i) => {
                                        return (
                                            <li key={'tab' + i} style={{ width: defaultWidth + '%'}}>
                                                <Link replace={true} to={item.link} style={{ backgroundImage: 'url(' + (this.checkoutHash(item.link) ? item.picActive : item.pic) + ')' }}>
                                                    <label className={`${this.checkoutHash(item.link) && 'color-main'}`}>{item.name}</label>
                                                </Link>
                                            </li>
                                        )
                                    }))
                                )
                        }
                    </ul>
                    {
                        showBar && <div className="tabbar-active" style={{ width: defaultWidth + '%', left: (showBarIndex >= 0 ? showBarIndex: selTabIndex) * defaultWidth + '%'}} />

                    }
               
                </div>
        );
    }
}

export default TabBar;