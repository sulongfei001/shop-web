import './GoodsList.css';
import React from 'react';
import { TransitionGroup } from 'react-transition-group';
import Fade from '../../ui/Fade/Fade';
import FullScreenLoading from '../../ui/FullScreenLoading/FullScreenLoading';
import GoodsListView from '../../ui/GoodsListView/GoodsListView';
import Screen from '../../utils/Screen';
import FixedTop from '../../ui/FixedTop/FixedTop';
import CouponsApi from '../../api/CouponsApi';
import Alert from '../../ui/Alert/Alert';
import Paging from '../../utils/Paging';
import imageEmpty from './empty.png';
import Page from '../../ui/Page/Page';
import UserContext from '../../model/UserContext';
class CouponGoodsList extends Page {
    constructor(props) {
        super(props);
        this.scroll = this.scroll.bind(this);
        this.loadGoods = this.loadGoods.bind(this);
        this.sort = this.sort.bind(this);
        this.reloadGoods = this.reloadGoods.bind(this);
        this.state = {
            loading: true,
            url: props.match.url,
            couponsId: Number(props.match.params.couponsId),
            sortField: 'topIndex',
            sortPatten: 'asc',
        };
    }

    componentDidMount() {
        window.addEventListener('scroll', this.scroll);
        this.loadGoods();
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.scroll);
    }

    scroll() {
        if (Screen.scrollHeight() - Screen.availHeight() - Screen.scrollTop() < 200) {
            this.loadGoods();
        }
    }

    reloadGoods(request, fullReload) {
        let userContext = UserContext.get();
        let {
            couponsId,
            sortField,
            sortPatten
        } = this.state;
        if (!request.couponsId && !fullReload) request.couponId = couponsId;
        if (!request.sortField && !fullReload) request.sortField = sortField;
        if (!request.sortPatten && !fullReload) request.sortPatten = sortPatten;
        request.pageNo = 1;
        request.pageSize = pageSize;
        this.loadingGoods = true;
        this.setState({
            couponId: request.couponsId,
            sortField: request.sortField,
            sortPatten: request.sortPatten,
            goodsList: [],
            loading: true,
        });
        if (request.name !== undefined && request.name.length === 0) request.name = undefined;
        request.accessToken = userContext.userToken;
        CouponsApi.couponGoodsList(
            request,
            data => {
                this.loadingGoods = false;
                let goodsList = data.goodsList.map(g => {
                    return {
                        id: g.goodsId,
                        pic: g.pictureUrl,
                        name: g.name,
                        price: g.priceForSale,
                        sales: g.salesVolume,
                    };
                });
                this.setState({
                    loading: false,
                    categoryName: data.categoryName,
                    goodsList: goodsList,
                });
            },
            error => {
                this.loadingGoods = false;
                this.setState({
                    alertMessage: error,
                    loading: false,
                });
            },
        );
    }

    loadGoods() {
        if (this.loadingGoods || this.finishLoading) return;
        this.loadingGoods = true;
        let {
            goodsList,
            couponsId,
            sortField,
            sortPatten
        } = this.state;
        let userContext = UserContext.get();
        if (goodsList === undefined) goodsList = [];
        let pageNo = Paging.nextPageNo(goodsList.length, pageSize)
        let request = {
            accessToken: userContext.userToken,
            pageSize: pageSize,
            pageNo,
            sortField: sortField,
            sortPatten: sortPatten,
        };
        if (couponsId) request.couponId = couponsId;
        CouponsApi.couponGoodsList(
            request,
            data => {
                this.loadingGoods = false;
                if (data.goodsList.length < pageSize) this.finishLoading = true;
                data.goodsList.forEach(g =>
                    goodsList.push({
                        id: g.goodsId,
                        pic: g.pictureUrl,
                        name: g.name,
                        price: g.priceForSale,
                        sales: g.salesVolume,
                    }),
                );
                this.setState({
                    loading: false,
                    categoryName: data.categoryName,
                    goodsList: goodsList,
                },()=>{
                    if (pageNo === 1) {
                        window.scrollTo(0,1)
                        window.scrollTo(0,0)
                    }});
            },
            error => {
                this.loadingGoods = false;
                this.setState({
                    alertMessage: error,
                    loading: false,
                });
            },
        );
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
            sortPatten =
                f === sortField ? (sortPatten === 'asc' ? 'desc' : 'asc') : p;
        }
        this.finishLoading = false
        sortField = f;
        this.reloadGoods({
            sortField: sortField,
            sortPatten: sortPatten,
        });
    }

    render() {
        let {
            loading,
            goodsList,
            sortField,
            sortPatten,
            alertMessage,
        } = this.state;
        return (
            <div>
                {!this.isChildRoute() && (
                    <div className="GoodsList">
                        {goodsList && (
                            <FixedTop>
                                {goodsList.length > 0 && (
                                    <div className="goods-sort">
                                        <a
                                            className={sortField === 'topIndex' ? 'active' : ''}
                                            onClick={() => this.sort('topIndex', 'asc')}
                                        >
                                            推荐
                    </a>
                                        <a
                                            className={sortField === 'salesVolume' ? 'active' : ''}
                                            onClick={() => this.sort('salesVolume', 'desc')}
                                        >
                                            销量
                    </a>
                                        <a
                                            className={sortField === 'createDate' ? 'active' : ''}
                                            onClick={() => this.sort('createDate', 'desc')}
                                        >
                                            新品
                    </a>
                                        <a
                                            className={sortField === 'priceForSale' ? 'active' : ''}
                                            onClick={() => this.sort('priceForSale', 'asc')}
                                        >
                                            价格
                      {sortField === 'priceForSale' &&
                                                (sortPatten === 'asc' ? '↑' : '↓')}
                                        </a>
                                    </div>
                                )}
                            </FixedTop>
                        )}
                        {goodsList &&
                            goodsList.length > 0 && (
                                <GoodsListView style={{ paddingTop: '2rem' }} goodsList={goodsList} routePrefix={''} />
                            )}
                        {!this.loadingGoods && goodsList &&
                            goodsList.length === 0 && (
                                <div
                                    className="empty"
                                    style={{ backgroundImage: 'url(' + imageEmpty + ')' }}
                                >
                                    未搜索到任何商品
                </div>
                            )}
                    </div>
                )}
                <TransitionGroup>
                    {loading && (
                        <Fade>
                            <FullScreenLoading />
                        </Fade>
                    )}
                    {alertMessage && (
                        <Fade>
                            <Alert
                                message={alertMessage}
                                onClose={() => this.setState({ alertMessage: undefined })}
                            />
                        </Fade>
                    )}
                </TransitionGroup>
            </div>
        );
    }
}

const pageSize = 10;

export default CouponGoodsList;
