import './GoodsList.css'
import React from 'react';
import { Route } from 'react-router-dom';
import { TransitionGroup } from 'react-transition-group';
import Fade from "../../ui/Fade/Fade";
import FullScreenLoading from "../../ui/FullScreenLoading/FullScreenLoading";
import GoodsListView from "../../ui/GoodsListView/GoodsListView";
import Screen from "../../utils/Screen";
import GoodsDetails from "./GoodsDetails";
import FixedTop from "../../ui/FixedTop/FixedTop";
import GoodsApi from "../../api/GoodsApi";
import Alert from "../../ui/Alert/Alert";
import SearchBar from "../../ui/SearchBar/SearchBar";
import imageArrowDownRed from './arrow-down-red.png';
import Paging from "../../utils/Paging";
import imageEmpty from './empty.png';
import Page from "../../ui/Page/Page";

class GoodsList extends Page {
    constructor(props) {
        super(props);
        this.scroll = this.scroll.bind(this);
        this.loadGoods = this.loadGoods.bind(this);
        this.sort = this.sort.bind(this);
        this.reloadGoods = this.reloadGoods.bind(this);
        this.state = {
            loading: true,
            url: props.match.url,
            keyword: props.match.params.keyword,
            categoryId: props.match.params.categoryId,
            isFreeFreight: props.match.path === '/freeFreightGoodsList',
            transportRuleIds: props.match.params.transportRuleIds === undefined ? props.match.params.transportRuleIds : [props.match.params.transportRuleIds],
            sortField: 'topIndex',
            sortPatten: 'asc'
        };
    }

    componentDidMount() {
        window.addEventListener("scroll", this.scroll);
        this.loadGoods();
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.scroll);
    }

    scroll() {
        if (Screen.scrollHeight() - Screen.availHeight() - Screen.scrollTop() < 200) {
            this.loadGoods();
        }
    }

    reloadGoods(request, fullReload) {
        let { keyword, categoryId, sortField, sortPatten, isFreeFreight, transportRuleIds } = this.state;
        if (!request.name && !fullReload) request.name = keyword;
        if (!request.categoryId && !fullReload) request.categoryId = categoryId;
        if (!request.isFreeFreight && !fullReload && isFreeFreight !== false && isFreeFreight !== undefined) request.isFreeFreight = isFreeFreight;
        if (!request.transportRuleIds && !fullReload && transportRuleIds !== undefined) request.transportRuleIds = transportRuleIds;
        if (!request.sortField && !fullReload) request.sortField = sortField;
        if (!request.sortPatten && !fullReload) request.sortPatten = sortPatten;
        request.pageNo = 1;
        request.pageSize = pageSize;
        this.loadingGoods = true;
        this.setState({
            keyword: request.name,
            categoryId: request.categoryId,
            isFreeFreight: request.isFreeFreight,
            transportRuleIds: request.transportRuleIds,
            sortField: request.sortField,
            sortPatten: request.sortPatten,
            goodsList: [],
            loading: true
        });
        if (request.name !== undefined && request.name.length === 0) request.name = undefined;
        console.log('reloadbody', request)
        GoodsApi.goodsList(request, data => {
            this.loadingGoods = false;
            let goodsList = data.goodsList.map(g => {
                return {
                    id: g.goodsId,
                    pic: g.pictureUrl,
                    name: g.name,
                    price: g.priceForSale,
                    goodsType: g.giftsStatsList,
                    sales: g.salesVolume,
                    timeLimitPrice: g.timeLimitPrice
                };
            });
            this.setState({
                loading: false,
                categoryName: data.categoryName,
                goodsList: goodsList
            });
        }, error => {
            this.loadingGoods = false;
            this.setState({
                alertMessage: error,
                loading: false
            });
        });
    }

    loadGoods() {
        if (this.loadingGoods === true || this.finishLoading) return false;
        this.loadingGoods = true;
        let { goodsList, keyword, categoryId, sortField, sortPatten, isFreeFreight, transportRuleIds } = this.state;
        if (goodsList === undefined) goodsList = [];
        let pageNo = Paging.nextPageNo(goodsList.length, pageSize)
        let request = {
            pageSize: pageSize,
            pageNo,
            sortField: sortField,
            sortPatten: sortPatten
        };
        if (keyword) request.name = keyword;
        if (categoryId) request.categoryId = categoryId;
        if (isFreeFreight) request.isFreeFreight = 1;
        if (transportRuleIds) request.transportRuleIds = transportRuleIds;
        // 暂时注释掉这两个,写法有问题
        // if (isFreeFreight !== false) request.isFreeFreight = 1;
        // if (transportRuleIds !== undefined) request.transportRuleIds = transportRuleIds;
        GoodsApi.goodsList(request, data => {
            this.loadingGoods = false;
            if (data.goodsList.length < pageSize) this.finishLoading = true;
            data.goodsList.forEach(g => goodsList.push({
                id: g.goodsId,
                pic: g.pictureUrl,
                name: g.name,
                price: g.priceForSale,
                sales: g.salesVolume,
                goodsType: g.giftsStatsList,
                timeLimitPrice: g.timeLimitPrice
            }));
            this.setState({
                loading: false,
                categoryName: data.categoryName,
                goodsList: goodsList
            },()=>{
                if (pageNo === 1) {
                    window.scrollTo(0,1)
                    window.scrollTo(0,0)
                }
            });
        }, error => {
            this.loadingGoods = false;
            this.setState({
                alertMessage: error,
                loading: false
            });
        });
    }

    sort(f, p) {
        let { sortField, sortPatten } = this.state;
        if (f === 'topIndex') {
            sortPatten = 'asc';
        } else if (f === 'salesVolume') {
            sortPatten = 'desc';
        } else if (f === 'createDate') {
            sortPatten = 'desc';
        } else if (f === 'priceForSale') {
            sortPatten = f === sortField ? (sortPatten === 'asc' ? 'desc' : 'asc') : p;
        }
        this.finishLoading = false;
        sortField = f;
        this.reloadGoods({
            sortField: sortField,
            sortPatten: sortPatten
        });
    }

    render() {
        let { loading, keyword, categoryId, categoryName, goodsList, sortField, sortPatten, alertMessage, isFreeFreight, transportRuleIds } = this.state;
        let { match, location, history } = this.props;
        return (
            <div>
                {!this.isChildRoute() &&
                    <div className="GoodsList">
                        {goodsList &&
                            <FixedTop>
                                {(keyword !== undefined || (keyword === undefined && categoryId === undefined && isFreeFreight === undefined && transportRuleIds === undefined)) &&
                                    <SearchBar keyword={keyword} onSubmit={keyword => {
                                        this.reloadGoods({
                                            name: keyword
                                        }, true);
                                    }} />
                                }
                                {categoryId &&
                                    // <a className="category-header" onClick={() => history.goBack()}> 去除返回功能
                                    <a className="category-header">
                                        <label>{categoryName}</label>
                                        {/* 去除下箭头 <label style={{backgroundImage: 'url(' + imageArrowDownRed + ')'}}>{categoryName}</label> */}
                                    </a>
                                }
                                {(isFreeFreight || transportRuleIds) &&
                                    <a className="category-header" onClick={() => history.goBack()}>
                                        <label style={{ backgroundImage: 'url(' + imageArrowDownRed + ')' }}>活动专区</label>
                                    </a>
                                }
                                {goodsList.length > 0 &&
                                    <div className="goods-sort">
                                        <a className={sortField === 'topIndex' ? 'active' : ''} onClick={() => this.sort('topIndex', 'asc')}>推荐</a>
                                        <a className={sortField === 'salesVolume' ? 'active' : ''} onClick={() => this.sort('salesVolume', 'desc')}>销量</a>
                                        <a className={sortField === 'createDate' ? 'active' : ''} onClick={() => this.sort('createDate', 'desc')}>新品</a>
                                        <a className={sortField === 'priceForSale' ? 'active' : ''} onClick={() => this.sort('priceForSale', 'asc')}>
                                            价格
                                    {sortField === 'priceForSale' &&
                                                (sortPatten === 'asc' ? '↑' : '↓')
                                            }
                                        </a>
                                    </div>
                                }
                            </FixedTop>
                        }
                        {goodsList && goodsList.length > 0 &&
                            <GoodsListView goodsList={goodsList} routePrefix={match.url} />
                        }
                        {goodsList && goodsList.length === 0 &&
                            <div className="empty" style={{ backgroundImage: 'url(' + imageEmpty + ')' }}>
                                未搜索到任何商品
                        </div>
                        }
                    </div>
                }
                <TransitionGroup>
                    {loading &&
                        <Fade>
                            <FullScreenLoading />
                        </Fade>
                    }
                    {alertMessage &&
                        <Fade>
                            <Alert message={alertMessage} onClose={() => this.setState({ alertMessage: undefined })} />
                        </Fade>
                    }
                </TransitionGroup>
                <Route location={location} key={'goodsDetails'} path={match.url + '/goods/details/:id'} component={GoodsDetails} />
            </div>
        );
    }
}

const pageSize = 10;

export default GoodsList;