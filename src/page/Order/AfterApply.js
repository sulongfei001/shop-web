import './AfterApply.css';
import React from 'react';
import { Link, Route } from 'react-router-dom';
import { TransitionGroup } from 'react-transition-group';
import Fade from "../../ui/Fade/Fade";
import FullScreenLoading from "../../ui/FullScreenLoading/FullScreenLoading";
import DateFormatter from "../../utils/DateFormatter";
import AfterApplyMake from "./AfterApplyMake";
import UserContext from "../../model/UserContext";
import OrderApi from "../../api/OrderApi";
import Paging from "../../utils/Paging";
import Alert from "../../ui/Alert/Alert";
import Screen from "../../utils/Screen";
import AfterSaleDetails from "./AfterSaleDetails";
import Page from "../../ui/Page/Page";

class AfterApply extends Page {
    constructor(props) {
        super(props);
        this.scroll = this.scroll.bind(this);
        this.loadData = this.loadData.bind(this);
        this.state = {
            url: props.match.url,
            loading: false
        };
    }

    componentDidMount() {
        let { history, match } = this.props;
        if (!UserContext.isLoggedIn(history, match)) {
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
        let { isLoadingData, finishedLoading, orders } = this.state;
        if (isLoadingData || finishedLoading) return;
        if (!orders) orders = [];
        this.setState({
            loading: orders.length === 0,
            isLoadingData: true
        }, () => {
            let userContext = UserContext.get();
            OrderApi.afterSaleList({
                accessToken: userContext.userToken,
                pageSize: pageSize,
                pageNo: Paging.nextPageNo(orders.length, pageSize)
            }, data => {
                data.goodsSkuList.forEach(g => {
                    orders.push({
                        id: g.orderExpressId + '_' + g.orderGoodsId,
                        orderExpressNo: g.orderExpressNo,
                        orderExpressId: g.orderExpressId,
                        orderGoodsId: g.orderGoodsId,
                        date: g.createDate,
                        status: g.state,
                        giftsStats: g.giftsStats,
                        addPrice: g.addPrice,
                        sku: {
                            id: g.orderExpressId,
                            logo: g.pictureUrl,
                            name: g.name,
                            number: g.quantity,
                            propertyItems: g.propertyItems,
                            priceForSale: g.priceForSale,
                            goodsId: g.goodsId
                        }
                    });
                });
                this.setState({
                    loading: false,
                    orders: orders,
                    isLoadingData: false,
                    finishedLoading: data.goodsSkuList.length === 0
                });
            }, error => {
                this.setState({
                    loading: false,
                    isLoadingData: false,
                    alertMessage: error
                });
            });
        });
    }

    render() {
        let { match, history } = this.props;
        let { loading, alertMessage, orders, data } = this.state;
        return (
            <div>
                {!this.isChildRoute() &&
                    <div className="AfterApply">
                        <div className="after-header">
                            <a onClick={() => history.replace(match.url.replace('apply', 'list'))}>售后记录</a>
                            <a className="active">申请售后</a>
                        </div>
                        {orders && orders.map(order => {
                            // console.log(order)
                            return <div key={order.id} className="apply-item">
                                <div className="info">
                                    <label>订单编号：{order.orderExpressNo}</label>
                                    <label>下单时间：{DateFormatter.toYMDHMS(new Date(order.date))}</label>
                                </div>
                                <div className="details">
                                    <div className="pic" style={{ backgroundImage: 'url(' + order.sku.logo + ')' }} />
                                    <h6>
                                        {order.giftsStats && <div className="inline-block-middle">
                                            {(order.giftsStats === 1 ? <span className="icon-promotion inline-block-middle"></span> : <span className="icon-add-price inline-block-middle"></span>)}
                                            &nbsp;
                                        </div>
                                        }
                                        {order.sku.name}
                                    </h6>
                                    <label>{order.sku.propertyItems.join(' ')}<em>×{order.sku.number}</em></label>
                                    <span><em>&yen; </em>
                                        {order.giftsStats ?
                                            (order.giftsStats === 1 ? '0.00' : order.addPrice.toFixed(2))
                                            :
                                            order.sku.priceForSale.toFixed(2)
                                        }</span>
                                    <div className="buttons">
                                        {!order.afterSaleId &&
                                            <Link to={match.url + '/make/'} onClick={() => this.setState({
                                                data: {
                                                    orderExpressId: order.orderExpressId,
                                                    orderGoodsId: order.orderGoodsId,
                                                    sku: order.sku
                                                }
                                            })} className="apply">申请售后</Link>
                                        }
                                        {order.afterSaleId &&
                                            <Link to={match.url + '/details/' + order.afterSaleId} className="apply">查看售后记录</Link>
                                        }
                                    </div>
                                </div>
                            </div>
                        }

                        )}
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
                            <Alert message={alertMessage} onClose={() => this.setState({
                                alertMessage: undefined
                            })} />
                        </Fade>
                    }
                </TransitionGroup>
                <Route path={match.url + '/make'} render={props =>
                    <AfterApplyMake {...props} data={data} afterApplyPage={this} />
                } />
                <Route path={match.url + '/details/:afterSaleId'} component={AfterSaleDetails} />
            </div>
        );
    }
}

const pageSize = 10;

export default AfterApply;