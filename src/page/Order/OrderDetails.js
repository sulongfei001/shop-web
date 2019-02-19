import './OrderDetails.css';
import React from 'react';
import { TransitionGroup } from 'react-transition-group';
import { Link, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import UserContext from "../../model/UserContext";
import Fade from "../../ui/Fade/Fade";
import FullScreenLoading from "../../ui/FullScreenLoading/FullScreenLoading";
import OrderStatus from "../../model/OrderStatus";
import DateFormatter from "../../utils/DateFormatter";
import imageLocation from './location.png';
import imagePath from './path.png';
import FixedBottom from "../../ui/FixedBottom/FixedBottom";
import Confirm from "../../ui/Confirm/Confirm";
import Weixin from "../../utils/Weixin";
import Alert from "../../ui/Alert/Alert";
import OrderApi from "../../api/OrderApi";
import OrderExpress from "./OrderExpress";
import GoodsDetails from "../Goods/GoodsDetails";
import Page from "../../ui/Page/Page";
import Screen from "../../utils/Screen";
import Common from '../../utils/Common'
import OrderConfirm from './OrderConfirm'
class OrderDetails extends Page {
    constructor(props) {
        super(props);
        console.log('===>', props)
        this.goToPay = this.goToPay.bind(this);
        this.cancel = this.cancel.bind(this);
        this.refreshList = this.refreshList.bind(this);
        this.confirmReceive = this.confirmReceive.bind(this);
        this.countDown = this.countDown.bind(this)
        this.submitOrder = this.submitOrder.bind(this)
        this.checkBuyAgain = this.checkBuyAgain.bind(this)
        let { orderId, expressId, showReorder } = props.match.params;
        this.state = {
            url: props.match.url,
            loading: true,
            orderId: parseInt(orderId, 10),
            expressId: parseInt(expressId, 10),
            headCountDown: null,   //  头部倒计时
            headCountDownTXT: null,  // 头部倒计时文字展示
            showReorder: Number(showReorder)
        };
    }


    componentDidMount() {
        if (!this.checkUserLoggedIn()) {
            return;
        }
        let userContext = UserContext.get();
        let { orderId, expressId } = this.state;
        OrderApi.orderInfo({
            accessToken: userContext.userToken,
            orderId: orderId,
            orderExpressId: expressId
        }, data => {
            let { deliveryAddress, totalGoodsPrice, totalExpressPrice, totalPrice, goodsSkuList, invoice, order, discountPrice } = data;
            /**
            *        giftsStats;促销状态：1.满赠；2.换购；3.满减
            **/

            this.setState({
                order: {
                    couponPrice: data.couponPrice,
                    no: order.orderNo,
                    orderExpressNo: order.orderExpressNo,
                    state: order.orderState,
                    expressState: order.orderExpressState,
                    updateTime: order.updateDate,
                    address: {
                        name: deliveryAddress.consignee,
                        phoneNumber: deliveryAddress.phoneNumber,
                        districts: deliveryAddress.districtList,
                        content: deliveryAddress.address,
                        post: deliveryAddress.postCode
                    },
                    // skuList: goodsSkuList.filter(item => !item.giftsStats).map(s => {
                    skuList: goodsSkuList.map(s => {
                        return {
                            addPrice: s.addPrice,
                            id: s.goodsSkuId,
                            logo: s.pictureUrl,
                            name: s.name,
                            number: s.quantity,
                            propertyItems: s.propertyItems,
                            priceForSale: s.priceForSale,
                            goodsId: s.goodsId,
                            giftsStats: s.giftsStats
                        };
                    }),
                    // giftsList: goodsSkuList.filter(item => item.giftsStats === 1),
                    totalGoodsPrice: totalGoodsPrice,
                    totalExpressPrice: totalExpressPrice,
                    totalPrice: totalPrice,
                    invoice: {
                        need: invoice.flag,
                        title: invoice.invoiceType === 1 ? '公司' : '个人',
                        companyName: invoice.companyName,
                        taxpayerId: invoice.taxpayerNumber
                    },
                    payMethod: order.payment ? '微信支付' : undefined,
                    payTransactionId: order.paymentNo,
                    payTime: order.payDate,
                    discountPrice: discountPrice
                },
                endTime: data.endTime,
                currentTime: data.currentTime,
                goodsSkuList: data.goodsSkuList
            }, () => this.countDown());

        }, error => {
            this.setState({
                loading: false,
                alertMessage: error
            });
        });
    }

    componentWillUnmount() {
        clearInterval(this.state.headCountDown)
    }

    goToPay() {
        let { order, orderId } = this.state;
        let { listPage } = this.props
        Screen.loading(true, () => Weixin.goToPay({
            orderNo: order.no,
            onSuccess: (list) => {
                order.state = 2;
                order.expressState = 2;
                Common.timerPolling(
                    {
                        orderId,
                        success: (list) => {
                            let parentOrders = listPage.state.orders
                            parentOrders.forEach((item, index) => {
                                if (item.orderId === orderId) {
                                    parentOrders.splice(index, 1, ...list)
                                }
                            })
                            this.setState({
                                order: order
                            }, () => {
                                this.refreshList()
                                listPage.setState({
                                    orders: parentOrders
                                })
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

    cancel() {
        this.setState({
            confirm: {
                title: '确定要取消此订单吗？',
                onConfirm: () => {
                    this.setState({
                        loading: true,
                        confirm: undefined
                    }, () => {
                        let userContext = UserContext.get();
                        let { order, orderId } = this.state;
                        OrderApi.orderCancel({
                            accessToken: userContext.userToken,
                            orderId: orderId
                        }, data => {
                            order.state = 3;
                            this.setState({
                                loading: false,
                                order: order
                            }, () => {
                                this.refreshList();
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

    confirmReceive() {
        Screen.confirm('要确认收货吗？', undefined, () => Screen.loading(true, () => {
            let userContext = UserContext.get();
            let { expressId, order } = this.state;
            OrderApi.orderExpressReceipt({
                accessToken: userContext.userToken,
                orderExpressId: expressId
            }, data => {
                order.expressState = 4;
                this.setState({ order: order }, () => Screen.loading(false, () => this.refreshList()));
            }, error => {
                Screen.loading(false, () => Screen.alert(error));
            });
        }));
    }

    // 重新下单按钮
    submitOrder() {
        let { goodsSkuList } = this.state
        let skuList = []
        goodsSkuList.forEach(item => {
            if (!item.giftsStats || item.giftsStats === 4) {
                let obj = {}
                obj = {
                    id: item.goodsSkuId,
                    number: item.quantity
                }
                skuList.push(obj)
            }
        })
        this.props.history.push(this.props.match.url + '/reconfirm/' + encodeURIComponent(JSON.stringify({
            requestSkuList: skuList
        })));
    }

    // 不是刷新,直接重置数据 假装刷新
    refreshList() {
        clearInterval(this.state.headCountDown)
        let { listPage } = this.props;
        if (listPage) {
            let { order, orderId, expressId } = this.state;
            let { orders } = listPage.state;
            orders.forEach(o => {
                if (o.orderId === orderId && o.expressId === expressId) {
                    o.state = order.state;
                    o.expressState = order.expressState;
                }
            });
            listPage.setState({
                orders: orders
            });
        }
    }

    // 头部倒计时 计算
    countDown() {
        let { endTime, order, currentTime } = this.state
        // 只有待付款状态 1 才有倒计时
        if (order.state !== 1) return this.setState({ loading: false })
        let time = endTime - currentTime
        this.setState({
            headCountDownTXT: Common.toHDMS(time),
            loading: false
        })
        clearInterval(this.state.headCountDown)
        this.state.headCountDown = setInterval(() => {
            time = time - 1000
            if (time > 0) {
                this.setState({
                    headCountDownTXT: Common.toHDMS(time)
                })
            } else {
                clearInterval(this.state.headCountDown)
                order.state = 4
                this.setState({
                    order: order
                }, () => {
                    this.refreshList()
                })
            }
        }, 1000)
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
        let { match, history, listPage } = this.props;
        let { loading, alertMessage, confirm, order, expressId, headCountDownTXT, showReorder } = this.state;
        let showExpressDetails = order && [3, 4, 5].indexOf(order.expressState) > -1;
        console.log(order)
        return (
            <div>
                {!this.isChildRoute() &&
                    <div className="OrderDetails">
                        {order &&
                            <a className="order-header" style={{ backgroundImage: showExpressDetails ? ('url(' + imagePath + ')') : '' }} onClick={() => {
                                if (showExpressDetails) history.push(match.url + '/express/' + expressId);
                            }}>
                                <h6>{OrderStatus.get(order.state, order.expressState)}</h6>
                                {showExpressDetails &&
                                    <label>物流信息：实时跟踪</label>
                                }
                                {
                                    order.state === 1 ?
                                        <span>剩{headCountDownTXT}自动关闭</span> :
                                        <span>{DateFormatter.toYMDHMS(new Date(order.updateTime))}</span>
                                }
                            </a>
                        }
                        {order &&
                            <div className="order-address">
                                <label style={{ backgroundImage: 'url(' + imageLocation + ')' }}>{order.address.name + '　' + order.address.phoneNumber}</label>
                                <span>{order.address.districts.reduce((a, b) => a + ' ' + b) + ' ' + order.address.content}</span>
                            </div>
                        }
                        {order &&
                            <div className="order-sku">
                                {order.skuList.map((sku, skuIndex) => {
                                    console.log('sku', sku)
                                    return <Link key={skuIndex} to={match.url + '/goods/details/' + sku.goodsId} style={{ backgroundImage: 'url(' + sku.logo + ')' }}>
                                        <h6>
                                            {sku.giftsStats === 2 && <span><span className="icon-add-price" />&nbsp;</span>}
                                            {sku.giftsStats === 4 && <span><span className="icon-time-limit" />&nbsp;</span>}
                                            {sku.name}
                                        </h6>
                                        <label>{sku.propertyItems.reduce((a, b) => a + ' ' + b)}<em>×{sku.number}</em></label>
                                        {(!sku.giftsStats || sku.giftsStats === 2) && <p className='f30 color-main mt20'><em className='color-main f30'>&yen; </em>{!sku.giftsStats && sku.priceForSale.toFixed(2)}
                                            {sku.giftsStats === 2 && sku.addPrice.toFixed(2)}
                                        </p>}
                                        {sku.giftsStats === 1 &&
                                            <div className={`${sku.giftsStats === 1 && 'icon-promotion'} mt20`}></div>
                                        }
                                    </Link>
                                }
                                )}
                            </div>
                        }
                        {order &&
                            <div className="order-price">
                                <label>商品总额</label>
                                <span>&yen;{order.totalGoodsPrice.toFixed(2)}</span>
                                <label>运费</label>
                                <span>&yen;{order.totalExpressPrice.toFixed(2)}</span>
                                {order.couponPrice > 0 &&
                                    <div>
                                        <label>优惠金额</label>
                                        <span>&yen;{order.couponPrice.toFixed(2)}</span>
                                    </div>
                                }
                                <h6>应付总额：<em>&yen;{order.totalPrice.toFixed(2)}</em></h6>
                            </div>
                        }
                        {order &&
                            <div className="order-info">
                                {order.invoice && order.invoice.need &&
                                    <div className="order-invoice">
                                        <label>发票类型：普通发票</label>
                                        <label>发票抬头：{order.invoice.title}</label>
                                        {order.invoice.title === '公司' &&
                                            <label>公司名称：{order.invoice.companyName}</label>
                                        }
                                        {order.invoice.title === '公司' &&
                                            <label>纳税人识别号：{order.invoice.taxpayerId}</label>
                                        }
                                    </div>
                                }
                                <label>订单编号：{order.orderExpressNo ? order.orderExpressNo : order.no}</label>
                                {order.payMethod &&
                                    <label>支付方式：{order.payMethod}</label>
                                }
                                {order.payTransactionId &&
                                    <label>支付交易单号：{order.payTransactionId}</label>
                                }
                                {order.payTime &&
                                    <label>下单时间：{DateFormatter.toYMDHMS(new Date(order.payTime))}</label>
                                }
                                {order && (order.state || [3, 4, 5].indexOf(order.expressState) > -1) &&
                                    // {order && (order.state || [3, 4, 5].indexOf(order.expressState) > -1) && !(order.skuList.length === 1 && order.skuList[0].giftsStats) &&
                                    <FixedBottom>
                                        <div className="order-buttons">
                                            {this.checkBuyAgain(order) &&
                                                <a onClick={() => this.submitOrder()}>{showReorder ? '重新下单' : '再次购买'}</a>
                                            }
                                            {order.state === 1 &&
                                                <a onClick={() => this.goToPay()}>立即付款</a>
                                            }
                                            {(order.state === 1) &&
                                                <a onClick={() => this.cancel()}>取消订单</a>
                                            }
                                            {showExpressDetails &&
                                                <Link to={match.url + '/express/' + expressId}>查看物流</Link>
                                            }
                                            {order.expressState === 3 &&
                                                <a onClick={() => this.confirmReceive()}>确认收货</a>
                                            }
                                        </div>
                                    </FixedBottom>
                                }
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
                    {confirm &&
                        <Fade>
                            <Confirm title={confirm.title} message={confirm.message} onConfirm={confirm.onConfirm} onCancel={confirm.onCancel} />
                        </Fade>
                    }
                </TransitionGroup>
                <Route path={match.url + '/express/:expressId'} component={OrderExpress} />
                <Route path={match.url + '/goods/details/:id'} component={GoodsDetails} />
                <Route path={match.url + '/reconfirm/:data'} component={OrderConfirm} />
            </div>
        );
    }
}

OrderDetails.propTypes = {
    listPage: PropTypes.object
};

export default OrderDetails;