import './Favourite.css';
import React from 'react';
import {Route, Link} from 'react-router-dom';
import {TransitionGroup} from 'react-transition-group';
import Fade from "../../ui/Fade/Fade";
import FullScreenLoading from "../../ui/FullScreenLoading/FullScreenLoading";
import GoodsDetails from "../Goods/GoodsDetails";
import Screen from "../../utils/Screen";
import UserContext from "../../model/UserContext";
import FollowApi from "../../api/FollowApi";
import Alert from "../../ui/Alert/Alert";
import Paging from "../../utils/Paging";
import imageEmpty from './empty.png';
import FullScreenPage from "../../ui/FullScreenPage/FullScreenPage";
import Page from "../../ui/Page/Page";

class Favourite extends Page {
    constructor(props) {
        super(props);
        this.loadData = this.loadData.bind(this);
        this.scroll = this.scroll.bind(this);
        this.del = this.del.bind(this);
        this.state = {
            url: props.match.url,
            loading: true
        };
    }

    componentDidMount() {
        if (!UserContext.isLoggedIn(this.props.history, this.props.match)) {
            return;
        }
        window.addEventListener("scroll", this.scroll);
        this.loadData();
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.scroll);
    }

    scroll() {
        if (Screen.scrollHeight() - Screen.availHeight() - Screen.scrollTop() < 200) {
            this.loadData();
        }
    }

    loadData() {
        let userContext = UserContext.get();
        if (this.isLoading || this.finishLoading) return;
        let {skuList} = this.state;
        this.isLoading = true;
        if (!skuList) skuList = [];
        this.setState({
            loading: true
        });
        FollowApi.favouriteList({
            accessToken: userContext.userToken,
            pageNo: Paging.nextPageNo(skuList.length, pageSize),
            pageSize: pageSize
        }, data => {
            this.isLoading = false;
            if (data.goodsSkuList.length < pageSize) this.finishLoading = true;
            data.goodsSkuList.forEach(s => {
                skuList.push({
                    id: s.goodsSkuId,
                    logo: s.pictureUrl,
                    name: s.name,
                    propertyItems: s.propertyItems,
                    priceForSale: s.priceForSale,
                    goodsId: s.goodsId
                });
            });
            this.setState({
                loading: false,
                skuList: skuList
            });
        }, error => {
            this.isLoading = false;
            this.setState({
                loading: false,
                alertMessage: error
            });
        });
    }

    del(sku) {
        let {skuList} = this.state;
        let userContext = UserContext.get();
        this.setState({
            loading: true
        });
        FollowApi.goodsUnfollow({
            accessToken: userContext.userToken,
            goodsIds: [sku.goodsId]
        }, data => {
            this.setState({
                loading: false,
                skuList: skuList.filter(s => s.id !== sku.id)
            })
        }, error => {
            this.setState({
                loading: false,
                alertMessage: error
            });
        });
    }

    render() {
        let {loading, skuList, alertMessage} = this.state;
        let {match} = this.props;
        return (
            <div>
                {!this.isChildRoute() &&
                <div className="Favourite">
                    {skuList && skuList.length > 0 &&
                    <div className="fav-items">
                        {skuList.map(sku => {
                            let style = {};
                            if (sku.transform) style.transform = sku.transform;
                            let calculateMoveX = (e, sku) => {
                                let moveX = this.itemStartX - e.changedTouches[0].clientX;
                                if (sku.moveX) {
                                    moveX = sku.moveX + moveX;
                                }
                                if (moveX < 0) {
                                    moveX = 0;
                                } else if (moveX > Screen.maxWidth() * 0.14) {
                                    moveX = Screen.maxWidth() * 0.14;
                                }
                                return moveX;
                            };
                            return (
                                <div key={sku.id} className="fav-item" onTouchStart={e => {
                                    this.itemStartX = e.touches[0].clientX;
                                }} onTouchMove={e => {
                                    sku.transform = 'translateX(-' + calculateMoveX(e, sku) + 'px)';
                                    this.setState({skuList: skuList});
                                }} onTouchEnd={e => {
                                    let moveX = calculateMoveX(e, sku)
                                    if (moveX > Screen.maxWidth() * 0.07) {
                                        moveX = Screen.maxWidth() * 0.14;
                                    } else  {
                                        moveX = 0;
                                    }
                                    sku.transform = 'translateX(-' + moveX + 'px)';
                                    sku.moveX = moveX;
                                    this.setState({skuList: skuList});
                                }}>
                                    <Link to={match.url + '/goods/details/' + sku.goodsId} className="fav-sku" style={style}>
                                        <div className="pic" style={{backgroundImage: 'url(' + sku.logo + ')'}}/>
                                        <h6>{sku.name}</h6>
                                        <label>{sku.propertyItems.join(' ')}</label>
                                        <span><em>¥</em>{sku.priceForSale.toFixed(2)}</span>
                                    </Link>
                                    <a className="fav-del" style={style} onClick={() => this.del(sku)}>删除</a>
                                </div>
                            );
                        })}
                    </div>
                    }
                    {skuList && skuList.length === 0 &&
                    <FullScreenPage style={{backgroundColor: '#fff'}}>
                        <div className="empty" style={{backgroundImage: 'url(' + imageEmpty + ')'}}>
                            您还没有相关收藏
                        </div>
                    </FullScreenPage>
                    }
                </div>
                }
                <TransitionGroup>
                    {loading &&
                    <Fade>
                        <FullScreenLoading/>
                    </Fade>
                    }
                    {alertMessage &&
                    <Fade>
                        <Alert message={alertMessage} onClose={() => this.setState({
                            alertMessage: undefined
                        })}/>
                    </Fade>
                    }
                </TransitionGroup>
                <Route path={match.url + '/goods/details/:id'} component={GoodsDetails}/>
            </div>
        );
    }
}

const pageSize = 10;

export default Favourite;