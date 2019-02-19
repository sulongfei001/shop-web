import './OrderList.css';
import React from 'react';
import { Route, Link } from 'react-router-dom';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import FixedTop from "../../ui/FixedTop/FixedTop";
import FullScreenLoading from "../../ui/FullScreenLoading/FullScreenLoading";
import Fade from "../../ui/Fade/Fade";
import UserContext from "../../model/UserContext";
import OrderStatus from "../../model/OrderStatus";
import Weixin from "../../utils/Weixin";
import Alert from "../../ui/Alert/Alert";
import Confirm from "../../ui/Confirm/Confirm";
import imagePath from './path.png';
import DateFormatter from "../../utils/DateFormatter";
import OrderExpress from "./OrderExpress";
import OrderCreateComment from "./OrderCreateComment";
import Paging from "../../utils/Paging";
import OrderApi from "../../api/OrderApi";
import GoodsDetails from "../Goods/GoodsDetails";
import OrderDetails from "./OrderDetails";
import Screen from "../../utils/Screen";
import Page from "../../ui/Page/Page";
import Common from '../../utils/Common';
import PageRoot from '../../ui/PageRoot/PageRoot'
import TabBar from '../../ui/TabBar/TabBar'
class OrderList extends Page {
    constructor(props) {
        super(props);
        this.switchStatus = this.switchStatus.bind(this);
        this.goToPay = this.goToPay.bind(this);
        this.cancel = this.cancel.bind(this);
        this.loadData = this.loadData.bind(this);
        this.getOrderState = this.getOrderState.bind(this);
        this.getOrderExpressState = this.getOrderExpressState.bind(this);
        this.isChildRoute = this.isChildRoute.bind(this);
        this.scroll = this.scroll.bind(this);
        this.confirmReceive = this.confirmReceive.bind(this);
        this.submitOrder = this.submitOrder.bind(this);
        this.checkOrderState = this.checkOrderState.bind(this)
        this.checkBuyAgain = this.checkBuyAgain.bind(this)
        this.state = {
            url: props.match.url,
            loading: true,
            status: props.match.params.status === undefined ? 0 : parseInt(props.match.params.status, 10)
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

    getOrderState(status) {
        switch (status) {
            case 1:
                return 1;
            default:
                return undefined;
        }
    }

    getOrderExpressState(status) {
        switch (status) {
            case 2:
                return 2;
            case 3:
                return 3;
            case 4:
                return 4;
            default:
                return undefined;
        }
    }

    loadData() {
        if (this.isLoading || this.finishLoading) return;
        this.isLoading = true;
        let { status, orders } = this.state;
        if (!orders) orders = [];
        if (orders.length === 0) {
            this.setState({
                loading: true
            });
        }
        let userContext = UserContext.get();
        let request = {
            accessToken: userContext.userToken,
            pageSize: 10,
            pageNo: Paging.nextPageNo(orders.length, pageSize),
            orderState: this.getOrderState(status),
            orderExpressState: this.getOrderExpressState(status)
        };
        OrderApi.list(request, data => {
            this.isLoading = false;
            if (data.orderList.length === 0) this.finishLoading = true;
            data.orderList.forEach(o => {
                orders.push({
                    id: o.orderId + '_' + o.orderExpressId,
                    orderId: o.orderId,
                    expressId: o.orderExpressId,
                    date: o.createDate,
                    state: o.orderState,
                    expressState: o.orderExpressState,
                    totalPrice: o.payPrice,
                    no: o.orderNo,
                    skuList: o.goodsList.map(g => {
                        return {
                            id: g.goodsSkuId,
                            logo: g.pictureUrl,
                            name: g.name,
                            propertyItems: g.propertyItems,
                            priceForSale: g.priceForSale,
                            goodsId: g.goodsId,
                            number: g.quantity,
                            giftsStats: g.giftsStats,
                            addPrice: g.addPrice,
                            timeLimit: g.timeLimit,
                            buyPrice: g.buyPrice
                        };
                    })
                });
            });
            this.setState({
                loading: false,
                orders: orders
            });
        }, error => {
            this.isLoading = false;
            this.setState({
                loading: false,
                alertMessage: error
            });
        });
    }

    switchStatus(newStatus) {
        let { status } = this.state;
        this.finishLoading = undefined;
        if (newStatus !== status) {
            this.setState({
                status: newStatus,
                orders: [],
                loading: true
            }, () => {
                this.loadData();
            });
            //this.props.history.replace("/order/status/" + newStatus);
        }
    }

    goToPay(order, orders) {
        let orderId = order.orderId
        Screen.loading(true, Weixin.goToPay({
            orderNo: order.no,
            onSuccess: (list) => {
                Common.timerPolling(
                    {
                        orderId: order.orderId,
                        success: (list) => {
                            orders.forEach((item, index) => {
                                if (item.orderId === orderId) {
                                    orders.splice(index, 1, ...list)
                                }
                            })
                            this.setState({
                                orders: orders
                            })
                        }
                    },
                    Common.payPolling
                )
            },
            onFail: () => {
                Screen.loading(false, () => Screen.alert('支付失败'));
            },
        }));
    }

    cancel(order, orders) {
        this.setState({
            confirm: {
                message: '确定要取消此订单吗？',
                onConfirm: () => {
                    this.setState({
                        loading: true,
                        confirm: undefined
                    }, () => {
                        let userContext = UserContext.get();
                        OrderApi.orderCancel({
                            accessToken: userContext.userToken,
                            orderId: order.orderId
                        }, data => {
                            order.state = 3;
                            this.setState({
                                loading: false,
                                orders: orders
                            });
                        }, error => {
                            this.setState({
                                loading: false,
                                alertMessage: error
                            });
                        });
                    });
                },
                onCancel: () => this.setState({ confirm: undefined })
            }
        });
    }

    confirmReceive(order, orders) {
        this.setState({
            confirm: {
                title: '要确认收货吗？',
                onConfirm: () => {
                    this.setState({
                        confirm: undefined,
                        loading: true
                    }, () => {
                        let userContext = UserContext.get();
                        OrderApi.orderExpressReceipt({
                            accessToken: userContext.userToken,
                            orderExpressId: order.expressId
                        }, data => {
                            order.expressState = 4;
                            this.setState({
                                loading: false,
                                orders: orders
                            });
                        }, error => {
                            this.setState({
                                loading: false,
                                alertMessage: error
                            });
                        });
                    });
                },
                onCancel: () => {
                    this.setState({
                        confirm: undefined
                    });
                }
            }
        });
    }

    // 重新下单
    submitOrder(order) {
        console.log('order', order)
        let skuList = []
        order.skuList.forEach(item => {
            if (!item.giftsStats ||item.giftsStats === 4) {
                let obj = {}
                obj = {
                    id: item.id,
                    number: item.number
                }
                skuList.push(obj)
            }

        })
        this.props.history.push('/order/confirm/' + encodeURIComponent(JSON.stringify({
            requestSkuList: skuList
        })));
    }

    // 根据状态来判断重新下单的展示
    checkOrderState(state) {
        // 3 取消 4 关闭 5 后台取消 6 后台完成 2 已支付
        const reorder = [3, 4, 5]
        return reorder.indexOf(state) > -1 ? 1 : 0
    }

    // 满赠 加价购 不显示再次购买按钮
    checkBuyAgain(order) {
        let { state, skuList } = order
        if (state !== 1) {
            if (skuList && skuList.length === 1 && skuList.some(s => s.giftsStats === 1 || s.giftsStats === 2)) {
                return false
            } else {
                return true
            }
        } else {
            return false
        }
    }

    render() {
        let { match } = this.props;
        const tabData = [
            { title: '全部' },
            { title: '待付款' },
            { title: '待发货' },
            { title: '待收货' }
        ]
        let { loading, status, orders, alertMessage, confirm } = this.state;
        return (
            <PageRoot>
                {!this.isChildRoute() &&
                    <div className="OrderList">
                        <FixedTop>
                            <TabBar tabData={tabData}
                                style={{ height: '.88rem' }}
                                onSel={(index) =>
                                    this.switchStatus(index)
                                }
                                showBar={true}
                                showBarIndex={status}
                            ></TabBar>
                        </FixedTop>

                        <ul className="order-list">
                            {orders && orders.map(order => {
                                let detailsRoute = match.url;
                                let showReorder = this.checkOrderState(order.state)
                                let status = order.skuList[0].giftsStats
                                let price = {
                                    1: 0,
                                    2: order.skuList[0].addPrice,
                                    4: order.skuList[0].buyPrice
                                }
                                if (order.expressId) {
                                    detailsRoute += '/expressOrder/' + order.orderId + '/' + order.expressId + '/' + showReorder;
                                } else {
                                    detailsRoute += '/order/' + order.orderId + '/' + showReorder;
                                }
                                return (
                                    <li key={order.id} className='clearfix'>
                                        <Link to={detailsRoute} className="item-header clearfix" style={{ backgroundImage: 'url(' + imagePath + ')' }}>
                                            <label>{DateFormatter.toYMD(new Date(order.date))}</label>
                                            <span>{OrderStatus.get(order.state, order.expressState)}</span>
                                        </Link>
                                        {order.skuList.length === 1 ?
                                            <Link to={detailsRoute} className="sku-item clearfix" style={{ backgroundImage: 'url(' + order.skuList[0].logo + ')' }}>
                                                <h6>
                                                    {order.skuList[0].giftsStats === 2 && <span><span className='icon-add-price' />&nbsp;</span>}
                                                    {order.skuList[0].giftsStats === 4 && <span><span className='icon-time-limit' />&nbsp;</span>}
                                                    {order.skuList[0].name}
                                                </h6>
                                                <label>
                                                    {order.skuList[0].propertyItems.reduce((a, b) => a + ' / ' + b)}
                                                    <em>× {order.skuList[0].number}</em>
                                                </label>
                                                <div className='sku-item-info'>
                                                    <span className='f28 color-main'>
                                                        <em>&yen;</em>
                                                        {
                                                           (price[status] || order.skuList[0].priceForSale).toFixed(2)
                                                        }
                                                        {/* {order.skuList[0].giftsStats === 1 ? '0.00' : (order.skuList[0].giftsStats === 2 ? order.skuList[0].addPrice.toFixed(2) : .toFixed(2))} */}
                                                    </span>
                                                    {
                                                        order.skuList[0].giftsStats === 1 && <span className='fr icon-promotion'></span>
                                                    }
                                                </div>
                                            </Link>
                                            :
                                            <div className="sku-list clearfix">
                                                <div style={{ width: (1.84 * order.skuList.length + 0.2) + 'rem' }} className='clearfix'>
                                                    {order.skuList.map((sku, skuIndex) =>
                                                      {  console.log(sku)
                                                        return   <Link to={detailsRoute} key={skuIndex} style={{ backgroundImage: 'url(' + sku.logo + ')' }}> </Link>}
                                                    )}
                                                </div>
                                            </div>
                                        }
                                        {
                                            // (order.skuList.length > 1 || !order.skuList.some(i => i.giftsStats === 1 || i.giftsStats)) && (
                                            (order.skuList && order.skuList.length > 0) && (
                                                <div className="item-buttons">
                                                    <label>共{order.skuList.map(sku => sku.number).reduce((a, b) => a + b)}件商品　{order.state === 1 ? '需' : '实'}付款：¥ {order.totalPrice.toFixed(2)}</label>
                                                    <div>
                                                        {order.state === 1 &&
                                                            <a onClick={() => this.goToPay(order, orders)}>立即付款</a>
                                                        }
                                                        {(order.state === 1) &&
                                                            <a onClick={() => this.cancel(order, orders)}>取消订单</a>
                                                        }
                                                        {this.checkBuyAgain(order) &&
                                                            <a onClick={() => this.submitOrder(order)}>{showReorder ? '重新下单' : '再次购买'}</a>
                                                        }
                                                        {order.expressState === 3 &&
                                                            <Link to={match.url + '/express/' + order.expressId}>查看物流</Link>
                                                        }
                                                        {order.expressState === 3 &&
                                                            <a onClick={() => this.confirmReceive(order, orders)}>确认收货</a>
                                                        }

                                                    </div>
                                                </div>
                                            )
                                        }

                                    </li>
                                );
                            })}
                        </ul>
                        {this.finishLoading && orders && orders.length > 0 &&
                            <div className="bottom-line">
                                已经到底部啦～～
                            </div>
                        }
                        {/* {
							(!orders || orders.length === 0) && <div className='txt-center'>
								空空如也~~
							</div>
						} */}
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
                            {confirm &&
                                <Fade>
                                    <Confirm title={confirm.title} message={confirm.message} onConfirm={confirm.onConfirm} onCancel={confirm.onCancel} />
                                </Fade>
                            }
                        </TransitionGroup>
                    </div>
                }
                <Route path={match.url + '/order/:orderId/:showReorder'} render={props =>
                    <OrderDetails {...props} listPage={this} />
                } />
                <Route path={match.url + '/expressOrder/:orderId/:expressId/:showReorder'} render={props =>
                    <OrderDetails {...props} listPage={this} />
                } />
                <Route path={match.url + '/goods/details/:id'} component={GoodsDetails} />
                <Route path={match.url + '/express/:expressId'} component={OrderExpress} />
                <Route path={match.url + '/newComment/:data'} render={props =>
                    <OrderCreateComment {...props} parent={this} />
                } />
            </PageRoot>
        );
    }
}

const pageSize = 10;

export default OrderList;