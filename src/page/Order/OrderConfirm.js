import './OrderConfirm.css'
import React from 'react';
import { Route, Link } from 'react-router-dom';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import Fade from "../../ui/Fade/Fade";
import imageLocation from './location.png';
import imagePath from './path.png';
import imageChecked from './checked.png';
import imageHelp from './help.png';
import imageClose from './close.png';
import imageClock from './clock.png';
import imageWeixin from './weixin.png';
import FixedBottom from "../../ui/FixedBottom/FixedBottom";
import SlideBottom from "../../ui/SlideBottom/SlideBottom";
import MessageBottom from "../../ui/MessageBottom/MessageBottom";
import Mask from "../../ui/Mask/Mask";
import RadioButton from "../../ui/RadioButton/RadioButton";
import Stretch from "../../ui/Stretch/Stretch";
import Alert from "../../ui/Alert/Alert";
import AddressList from "../Address/AddressList";
import FixedCenter from "../../ui/FixedCenter/FixedCenter";
import Confirm from "../../ui/Confirm/Confirm";
import UserContext from "../../model/UserContext";
import FullScreenLoading from "../../ui/FullScreenLoading/FullScreenLoading";
import Weixin from "../../utils/Weixin";
import GoodsApi from "../../api/GoodsApi";
import OrderApi from "../../api/OrderApi";
import CartStore from "../../utils/CartStore";
import Screen from "../../utils/Screen";
import Page from "../../ui/Page/Page";
import reminder from "./reminder.png";
import introduce from "./introduce.png";
import CouponList from '../Coupons/Common/CouponList'
import Common from '../../utils/Common'
class OrderConfirm extends Page {
    constructor(props) {
        super(props);
        let { fromCart, requestSkuList } = JSON.parse(decodeURIComponent(props.match.params.data));
        this.state = {
            url: props.match.url,
            loading: true,
            fromCart: fromCart,
            requestSkuList: requestSkuList,
            showVerify: false,
            showAutonym: false,
            verifyName: "",
            verifyRank: ""
        };
        this.saveInvoice = this.saveInvoice.bind(this);
        this.switchInvoice = this.switchInvoice.bind(this);
        this.closeDialogs = this.closeDialogs.bind(this);
        this.alert = this.alert.bind(this);
        this.switchAddress = this.switchAddress.bind(this);
        this.submitOrder = this.submitOrder.bind(this);
        this.setRemainingPayTime = this.setRemainingPayTime.bind(this);
        this.cancelSubmit = this.cancelSubmit.bind(this);
        this.goToPay = this.goToPay.bind(this);
        this.loadData = this.loadData.bind(this);
        this.cancelVerify = this.cancelVerify.bind(this);
        this.showIntroduce = this.showIntroduce.bind(this);
        this.cancelAutonym = this.cancelAutonym.bind(this);
        this.verifySubmit = this.verifySubmit.bind(this);
        this.submitOrderProcess = this.submitOrderProcess.bind(this);
    }

    componentDidMount() {
        let { match, history } = this.props;
        if (!UserContext.isLoggedIn(history, match)) {
            return;
        }
        this.loadData();
        let userContext = UserContext.get();
        this.setState({
            verifyName: userContext.identityCardName,
            verifyRank: userContext.identityCard
        });
    }

    loadData(addressId) {
        let { invoice, requestSkuList, selCoupon, address } = this.state;
        if (!invoice) {
            invoice = {
                need: false,
                title: undefined,
                companyName: undefined,
                taxpayerId: undefined,
            };
        }
        let userContext = UserContext.get();
        let request = {
            accessToken: userContext.userToken,
            goodsList: requestSkuList.map(p => {
                return {
                    goodsSkuId: p.id,
                    quantity: p.number,
                    giftsItemGoodsId: p.giftsItemGoodsId ? p.giftsItemGoodsId : null
                };
            })
        };
        let couponsGoodsList = requestSkuList.map(p => {
            return {
                goodsSkuId: p.id,
                quantity: p.number,
                giftsItemGoodsId: p.giftsItemGoodsId ? p.giftsItemGoodsId : null
            };
        }).filter(i => !i.giftsItemGoodsId)
        if (addressId || address) request.deliveryAddressId = addressId || address.id;
        if (selCoupon) request.couponCodeId = selCoupon.couponCodeId
        GoodsApi.orderConfirmData(request,
            data => {
                let address = undefined;
                let { deliveryAddress, isSeaAmoy, goodsSkuList, orderExpressList, serviceTags, totalGoodsPrice, totalExpressPrice, totalPrice, discountInfoList, coupon } = data;
                console.log('data', data)
                if (deliveryAddress) {
                    address = {
                        id: deliveryAddress.deliveryAddressId,
                        name: deliveryAddress.consignee,
                        phoneNumber: deliveryAddress.phoneNumber,
                        isDefault: deliveryAddress.isDefault,
                        districts: deliveryAddress.districtList.map(d => {
                            return {
                                id: d.districtId,
                                name: d.name
                            };
                        }),
                        content: deliveryAddress.address,
                        supported: deliveryAddress.supported
                    };
                }
                let giftsList = goodsSkuList.filter(item => item.giftsItemGoodsId)
                // let goodsSkuIds = []
                // goodsSkuList.map(item => {
                //     let obj = {}
                //     obj.goodsSkuId = Number(item.goodsSkuId)
                //     obj.quantity = item.quantity
                //     goodsSkuIds.push(obj)
                // }),

                this.setState({
                    loading: false,
                    address: address,
                    isAddAddress: address ? Common.checkAddress(address.districts) : true,
                    // goodsSkuIds: goodsSkuIds,
                    skuList: goodsSkuList.filter(i => !i.giftsItemGoodsId).map(s => {
                        return {
                            id: s.goodsSkuId,
                            number: s.quantity,
                            logo: s.pictureUrl,
                            name: s.name,
                            propertyItems: s.propertyItems,
                            priceForSale: s.priceForSale,
                            timeLimit: s.timeLimit,
                            activityGiftList: s.activityGiftList,
                            giftCouponMappingList: s.giftCouponMappingList
                        };
                    }),
                    giftsList: giftsList.map(g => {
                        return {
                            addPrice: g.addPrice,
                            status: g.giftsStats,
                            id: g.goodsSkuId,
                            number: g.quantity,
                            logo: g.pictureUrl,
                            name: g.name,
                            propertyItems: g.propertyItems,
                            priceForSale: g.priceForSale,
                            giftsItemGoodsId: g.giftsItemGoodsId
                        }
                    }),
                    expressList: orderExpressList.map(o => {
                        return {
                            expressPrice: o.transportFee,
                            freeFreightPrice: o.freeFreightPrice,
                            skuList: o.goodsSkuList.map(s => {
                                return {
                                    addPrice: s.addPrice,
                                    giftsStats: s.giftsStats,
                                    logo: s.pictureUrl,
                                    name: s.name,
                                    number: s.quantity,
                                    propertyItems: s.propertyItems,
                                    priceForSale: s.priceForSale,
                                    giftsItemGoodsId: s.giftsItemGoodsId,
                                    timeLimit: s.timeLimit,
                                };
                            })
                        };
                    }),
                    serviceTags: serviceTags.map(t => {
                        return {
                            name: t.name,
                            description: t.remark
                        };
                    }),
                    totalGoodsPrice: totalGoodsPrice,
                    totalExpressPrice: totalExpressPrice,
                    isSeaAmoy: isSeaAmoy,
                    totalPrice: totalPrice,
                    invoice: invoice,
                    discounts: discountInfoList.map(d => {
                        return {
                            discountPrice: d.discountPrice,
                            name: d.discountName,
                        }
                    }),
                    coupon: coupon,  // 用户之前选择的优惠券，服务器保存
                    couponsGoodsList
                });
            },
            error => {
                this.setState({
                    loading: false,
                    alertMessage: error
                });
            });
    }

    componentWillUnmount() {
        this.timer && clearInterval(this.timer)
        this.timeout && clearTimeout(this.timeout);
    }

    alert(message, title) {
        this.setState({
            alertMessage: message,
            alertTitle: title,
        });
    }

    closeDialogs() {
        this.setState({
            showServiceTag: undefined,
            showInvoice: undefined,
            showExpress: undefined,
            showExpressPrice: undefined,
            showDiscounts: undefined
        });
    }

    switchInvoice(enabled) {
        let { invoiceEdit } = this.state;
        invoiceEdit.need = enabled;
        if (invoiceEdit.need && !invoiceEdit.title) {
            invoiceEdit.title = '个人';
        }
        this.setState({
            invoiceEdit: invoiceEdit
        });
    }

    setInvoice(name, value) {
        let { invoiceEdit } = this.state;
        if (!invoiceEdit) invoiceEdit = {};
        invoiceEdit[name] = value;
        this.setState({
            invoiceEdit: invoiceEdit
        });
    }

    saveInvoice() {
        let { invoiceEdit } = this.state;
        if (invoiceEdit.need) {
            if (invoiceEdit.title === '公司') {
                let alertMessages = [];
                if (!invoiceEdit.companyName || invoiceEdit.companyName.length === 0) {
                    alertMessages.push('公司名称');
                }
                if (!invoiceEdit.taxpayerId || invoiceEdit.taxpayerId.length === 0) {
                    alertMessages.push('纳税人识别号');
                }
                if (alertMessages.length > 0) {
                    this.alert('请填写' + alertMessages.reduce((a, b) => a + '和' + b));
                    return;
                }
            }
        }
        this.setState({
            showInvoice: undefined,
            invoice: invoiceEdit
        });
    }

    switchAddress(address) {
        this.props.history.goBack();
        this.setState({
            loading: true,
            address
        });
        this.loadData(address.id);
    }

    submitOrder() {
        let { address, isSeaAmoy, isAddAddress } = this.state;

        if (!address || address.supported === false) {
            this.setState({ alertMessage: '请选择一个有效的配送地址' });
        } else if (isAddAddress) {
            this.setState({ alertMessage: '您的地址信息不完整,请完善您的信息', confirmText: '去完善' });
        } else {
            if (isSeaAmoy) {
                this.setState({
                    showVerify: true,
                });
            } else {
                this.submitOrderProcess();
            }
        }
    }

    submitOrderProcess() {
        let { address, invoice, skuList, fromCart, verifyName, verifyRank, selCoupon, giftsList } = this.state;
        this.setState({
            confirm: {
                title: '是否确认提交支付？',
                onConfirm: () => {
                    let userContext = UserContext.get();
                    this.setState({
                        loading: true,
                        confirm: undefined
                    });
                    let goodsList = skuList.map(s => {
                        return {
                            goodsSkuId: s.id,
                            quantity: s.number,
                            priceForSale: s.timeLimit ? s.timeLimit.buyPrice : s.priceForSale
                        };
                    })
                    giftsList.forEach(item => {
                        let obj = {}
                        obj.goodsSkuId = item.id
                        obj.quantity = item.number
                        obj.priceForSale = item.priceForSale
                        obj.giftsItemGoodsId = item.giftsItemGoodsId
                        goodsList.push(obj)
                    }
                    )
                    OrderApi.create({
                        accessToken: userContext.userToken,
                        from: 1,
                        deliveryAddressId: address.id,
                        identityCardName: verifyName,
                        identityCard: verifyRank,
                        invoice: {
                            flag: invoice.need,
                            invoiceType: invoice.title === '个人' ? 0 : 1,
                            companyName: invoice.companyName,
                            taxpayerNumber: invoice.taxpayerId
                        },
                        couponCodeId: selCoupon ? selCoupon.couponCodeId : undefined,
                        goodsList
                    }, data => {
                        Common.timerPolling(
                            {
                                uuid: data.uuid,
                                success: res => {
                                    console.log('成功回调', this, fromCart)
                                    if (fromCart) {
                                        skuList.forEach(s => {
                                            CartStore.removeSku(s.id);
                                        });
                                    }
                                    this.setRemainingPayTime();
                                    this.setState({
                                        loading: false,
                                        orderNo: res.orderNo,
                                        orderId: res.orderId,
                                        paymentExpires: Date.now() + 900000,
                                        showPayment: true
                                    });
                                },
                                fail: err => {
                                    this.setState({
                                        loading: false,
                                        alertMessage: err
                                    })
                                }
                            },
                            Common.orderStatus
                        )
                    }, error => {
                        this.setState({
                            loading: false,
                            alertMessage: error
                        });
                    });
                },
                onCancel: () => {
                    this.setState({ confirm: undefined });
                }
            }
        });
    }

    setRemainingPayTime() {
        let { paymentExpires } = this.state;
        if (paymentExpires) {
            let millis = paymentExpires - Date.now();
            if (millis < 0) millis = 0;
            millis = Math.round(millis / 1000);
            let remaining = {
                minute: millis % 60 === 0 ? (millis / 60) : ((millis - millis % 60) / 60),
                second: millis % 60
            };
            let minute = remaining.minute.toString();
            let second = remaining.second.toString();
            if (minute.length === 1) minute = '0' + minute;
            if (second.length === 1) second = '0' + second;
            this.setState({ remainingPayTime: minute + ' : ' + second });
        } else {
            this.setState({ remainingPayTime: '15 : 00' });
        }
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.setRemainingPayTime();
        }, 1000);
    }

    cancelSubmit() {
        this.setState({
            confirm: {
                title: '确认要取消付款吗？',
                onConfirm: () => {
                    this.props.history.goBack()
                },
                onCancel: () => {
                    this.setState({ confirm: undefined });
                }
            }
        });
    }

    cancelVerify() {
        Screen.confirm('确认要取消实名认证吗？', undefined, () => this.setState({
            showVerify: false,
        }));
    }

    showIntroduce() {
        this.setState({
            showAutonym: true
        });
    }

    cancelAutonym() {
        this.setState({
            showAutonym: false
        });
    }

    verifySubmit() {
        let { verifyRank, verifyName } = this.state;
        let reg = new RegExp(/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/)
        console.log('身份证号', reg.test(verifyRank))
        if (!verifyName || verifyName.length === 0) {
            Screen.alert("请输入您的真实姓名！");
        } else if (!verifyRank || verifyRank.length === 0) {
            Screen.alert("请输入您的身份证号码！");
        } else if (!reg.test(verifyRank)) {
            Screen.alert("请输入正确的身份证号! ")
        } else {
            this.setState({
                showVerify: false
            });
            let userContext = UserContext.get();
            userContext.identityCardName = verifyName;
            userContext.identityCard = verifyRank;
            UserContext.set(userContext);
            this.submitOrderProcess();
        }
    }

    goToPay() {
        Screen.loading(true, () => {
            let { orderNo, orderId } = this.state;
            Weixin.goToPay({
                orderNo: orderNo,
                onSuccess: () => Common.timerPolling(
                    {
                        orderId,
                        success: () => this.props.history.replace('/order/list'),
                    },
                    Common.payPolling
                ),
                onFail: () => { Screen.loading(false, () => Screen.alert('支付失败')); },
            });
        });
    }

    render() {
        let { match } = this.props;
        let {
            address, skuList, invoice, expressList, serviceTags, invoiceEdit, showDiscounts,
            totalGoodsPrice, totalExpressPrice, totalPrice, remainingPayTime, discounts,
            showServiceTag, showInvoice, showExpress, showExpressPrice, showPayment,
            alertMessage, alertTitle, confirm, loading, showVerify, showAutonym, verifyRank, verifyName, coupon, showCouponList,
            giftsList, couponsGoodsList, isAddAddress, confirmText
        } = this.state;
        let linkItemStyle = { backgroundImage: 'url(' + imagePath + ')' };
        let serviceTagStyle = { backgroundImage: 'url(' + imageChecked + ')' };
        return (
            <div>
                {!this.isChildRoute() &&
                    <div className="OrderConfirm">
                        {skuList &&
                            <div>
                                <Link to={match.url + '/address/' + skuList.map(s => s.id).join(',')} className="address"
                                    style={{ backgroundImage: 'url(' + imagePath + ')' }}>
                                    {address && address.supported === false &&
                                        <label className="not-supported">该地区暂不支持配送</label>
                                    }
                                    {address &&
                                        <h6>
                                            <h5>
                                                {address.name} {address.phoneNumber}
                                            </h5>
                                            {
                                                isAddAddress && <h5 className="f24 color-main" style={{ float: 'right', lineHeight: '.42rem' }}>地址信息不完整请补全</h5>
                                            }
                                        </h6>
                                    }
                                    <div className="content" style={{ backgroundImage: 'url(' + imageLocation + ')' }}>
                                        {address && address.isDefault &&
                                            <em>[默认] </em>
                                        }
                                        <label>
                                            {address ? (address.districts.map(d => d.name).reduce((a, b) => a + b) + ' ' + address.content) : '添加新地址'}

                                        </label>
                                    </div>
                                </Link>
                                <div className="break" />
                                <div className="sku-details">
                                    <ul>
                                        {skuList.map(sku => {
                                            let price = sku.timeLimit ? sku.timeLimit.buyPrice : sku.priceForSale
                                            return <li key={sku.id} className='liTop'>
                                                <img src={sku.logo} alt="" />
                                                <h6>
                                                    {sku.timeLimit && <div className='limit-buy-img' />}
                                                    {sku.name}
                                                </h6>
                                                <label
                                                    className="property">{sku.propertyItems.reduce((a, b) => a + ' / ' + b)}
                                                </label>
                                                <label className="price mt20">&yen; {price.toFixed(2)} × {sku.number}</label>

                                                {(sku.activityGiftList != null || sku.giftCouponMappingList != null) &&
                                                    <div className='complimentaryGoods'>
                                                        <div className='complimentaryTitle'>
                                                            赠品
                                                        </div>
                                                        <div className='complimentaryList'>
                                                            <ul>
                                                                {sku.activityGiftList.map((a,index) => {
                                                                    return(
                                                                        <li key={index + a.goodsSkuId}>
                                                                            <span><label>{a.goodsName}</label><em> × {sku.number}</em></span>
                                                                        </li>
                                                                    )
                                                                })}
                                                                {sku.giftCouponMappingList.map((a,index) => {
                                                                    return(
                                                                        <li key={index + a.couponId}>
                                                                            <span><label>{a.couponName}</label><em> × {sku.number}</em></span>
                                                                        </li>
                                                                    )
                                                                })}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                }

                                            </li>
                                        }

                                        )}
                                    </ul>
                                </div>
                                {(giftsList && giftsList.length > 0) && <div className="break" />}

                                {
                                    (giftsList && giftsList.length > 0) &&
                                    <div className="sku-details">
                                        <ul>
                                            {
                                                giftsList.map(sku => {
                                                    return <li key={sku.giftsItemGoodsId}>
                                                        <img src={sku.logo} alt="" />
                                                        <h6>
                                                            {sku.status === 2 && <span style={{ float: 'none' }} className='inline-block-middle'><div className="icon-add-price" />&nbsp;</span>}
                                                            {sku.name}
                                                        </h6>
                                                        <label
                                                            className="property">{sku.propertyItems.reduce((a, b) => a + ' / ' + b)}</label>
                                                        <div className='promotion-info'>
                                                            <label className="price">&yen; {sku.status === 1 ? '0.00' : (sku.status === 2 ? sku.addPrice : sku.priceForSale)}
                                                            </label>
                                                            {
                                                                sku.status === 1 &&
                                                                <span className='fr icon-promotion'></span>
                                                            }
                                                        </div>
                                                    </li>
                                                })
                                            }
                                        </ul>
                                    </div>
                                }

                                <div className="break" />
                                <ul className="link">
                                    <li style={linkItemStyle}>
                                        <a onClick={() => {
                                            if (address) {
                                                this.setState({ showExpress: true });
                                            } else {
                                                Screen.alert('请先选择配送地址');
                                            }
                                        }}>
                                            <label>配送</label>
                                            <span>{address ? (expressList.length + '单') : '请先选择配送地址'}</span>
                                        </a>
                                    </li>
                                </ul>
                                {serviceTags.length > 0 &&
                                    <div>
                                        <div className="break" />
                                        <ul className="link">
                                            <li style={linkItemStyle}>
                                                <a onClick={() => this.setState({ showServiceTag: true })}>
                                                    <label>说明</label>
                                                    <span>
                                                        {serviceTags.map(tag =>
                                                            <span key={tag.name} className="service-tag" style={serviceTagStyle}>
                                                                {tag.name}
                                                            </span>
                                                        )}
                                                    </span>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                }
                                <div className="break" />
                                <ul className="link invoice">
                                    <li>
                                        <a>
                                            <label>商品金额</label>
                                            <span className="goods-price"><em>¥</em>{totalGoodsPrice.toFixed(2)}</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a onClick={() => {
                                            if (address) {
                                                this.setState({ showExpressPrice: true });
                                            } else {
                                                Screen.alert("请先选择收货地址");
                                            }
                                        }}>
                                            <label>运费</label>
                                            <span className="express-price">
                                                <em style={{ backgroundImage: 'url(' + imageHelp + ')' }}>¥</em>{totalExpressPrice.toFixed(2)}
                                            </span>
                                        </a>
                                    </li>
                                    <li style={linkItemStyle}>
                                        <a onClick={() => {
                                            if (address) {
                                                this.setState({ showCouponList: true });
                                            } else {
                                                Screen.alert("请先选择收货地址");
                                            }
                                        }}>
                                            <label>商品优惠券</label>
                                            {coupon ?
                                                <span className="express-price">
                                                    <em>-&yen;</em>{(coupon.price).toFixed(2)}</span> :
                                                <span className="express-price">
                                                    去选择
												</span>
                                            }
                                        </a>
                                    </li>
                                    {discounts && discounts.length > 0 &&
                                        <li>
                                            <a onClick={() => this.setState({ showDiscounts: true })}>
                                                <label>优惠价格</label>
                                                <span className="express-price">
                                                    <em style={{ backgroundImage: 'url(' + imageHelp + ')' }}>¥</em>{discounts.map(d => d.discountPrice).reduce((a, b) => a + b).toFixed(2)}
                                                </span>
                                            </a>
                                        </li>
                                    }
                                </ul>
                                {false &&
                                    <div className="break" />
                                }
                                {false &&
                                    <ul className="link">
                                        <li>
                                            <a onClick={() => {
                                                let invoiceEdit = {};
                                                Object.assign(invoiceEdit, invoice);
                                                this.setState({
                                                    showInvoice: true,
                                                    needInvoice: !!invoice,
                                                    invoiceEdit: invoiceEdit
                                                })
                                            }}>
                                                <label>发票</label>
                                                <span>{invoice.need ? invoice.title : '暂不需要发票'}</span>
                                            </a>
                                        </li>
                                    </ul>
                                }
                                <FixedBottom>
                                    <div className="buttons">
                                        <label>应付总额： &yen; {totalPrice.toFixed(2)}</label>
                                        <a onClick={this.submitOrder}>提交订单</a>
                                    </div>
                                </FixedBottom>
                            </div>
                        }
                        <TransitionGroup>
                            {(showServiceTag || showInvoice || showExpress || showExpressPrice || showDiscounts) &&
                                <Fade>
                                    <Mask onClick={() => this.closeDialogs()} />
                                </Fade>
                            }
                            {showServiceTag &&
                                <SlideBottom>
                                    <MessageBottom title={'服务说明'}
                                        onClose={() => this.setState({ showServiceTag: undefined })}
                                        onConfirm={() => this.setState({ showServiceTag: undefined })}>
                                        {serviceTags.map(t =>
                                            <div key={t.name} className="tag-details">
                                                <h6>{t.name}</h6>
                                                <p>{t.description}</p>
                                            </div>
                                        )}
                                    </MessageBottom>
                                </SlideBottom>
                            }
                            {showInvoice &&
                                <SlideBottom>
                                    <MessageBottom title={'发票'}
                                        confirmText={'确定'}
                                        onClose={() => this.setState({ showInvoice: undefined })}
                                        onConfirm={() => this.saveInvoice()}>
                                        <div className="invoice-details">
                                            <ul className="lines">
                                                <li>
                                                    <span>
                                                        <RadioButton checked={invoiceEdit.need}
                                                            onChange={(checked) => this.switchInvoice(checked)} />
                                                    </span>
                                                    <label>开具发票</label>
                                                </li>
                                            </ul>
                                            <TransitionGroup>
                                                {invoiceEdit.need &&
                                                    <Stretch>
                                                        <ul className="lines">
                                                            <li>
                                                                <span>普通发票</span>
                                                                <label>发票类型</label>
                                                            </li>
                                                            <li>
                                                                <label>发票抬头</label>
                                                                <div className="tags">
                                                                    <a className={(invoiceEdit && invoiceEdit.title === '个人') ? 'active' : ''}
                                                                        onClick={() => this.setInvoice('title', '个人')}>个人</a>
                                                                    <a className={(invoiceEdit && invoiceEdit.title === '公司') ? 'active' : ''}
                                                                        onClick={() => this.setInvoice('title', '公司')}>公司</a>
                                                                </div>
                                                                <TransitionGroup>
                                                                    {invoiceEdit.title === '公司' &&
                                                                        <Stretch>
                                                                            <div className="company">
                                                                                <input type="text" name="companyName"
                                                                                    placeholder="请填写公司名称"
                                                                                    value={invoiceEdit.companyName ? invoiceEdit.companyName : ''}
                                                                                    onChange={(e) => this.setInvoice('companyName', e.target.value)} />
                                                                                <label className="top-margin">纳税人识别号</label>
                                                                                <a className="help"
                                                                                    style={{ backgroundImage: 'url(' + imageHelp + ')' }}
                                                                                    onClick={() => this.alert(taxpayerDescriptions[1], taxpayerDescriptions[0])}> </a>
                                                                                <input type="text" name="taxpayerId"
                                                                                    placeholder="请填写纳税人识别号"
                                                                                    value={invoiceEdit.taxpayerId ? invoiceEdit.taxpayerId : ''}
                                                                                    onChange={(e) => this.setInvoice('taxpayerId', e.target.value)} />
                                                                            </div>
                                                                        </Stretch>
                                                                    }
                                                                </TransitionGroup>
                                                            </li>
                                                        </ul>
                                                    </Stretch>
                                                }
                                            </TransitionGroup>
                                        </div>
                                    </MessageBottom>
                                </SlideBottom>
                            }
                            {showExpress &&
                                <SlideBottom>
                                    <FixedBottom
                                        style={{ overflow: 'auto', maxHeight: '70%', "-webkit-overflow-scrolling": 'touch' }}>
                                        <div className="express-list">
                                            <h5>配送</h5>
                                            <span
                                                className="subtitle">因商品来自不同的仓库，配送到{address.districts.map(d => d.name).reduce((a, b) => a + b)}将会按照以下订单配送方式发送货物</span>
                                            <div className="break" />
                                            {expressList.map((express, i) =>
                                                <div key={i} className="express-item">
                                                    <h6>包裹 {i + 1}</h6>
                                                    {express.skuList.map((sku, i) => {
                                                        let priceObj = {
                                                            1: 0,
                                                            2: sku.addPrice
                                                        }
                                                        let price = priceObj[sku.giftsStats] >= 0 ? priceObj[sku.giftsStats] : (sku.timeLimit ? sku.timeLimit.buyPrice : sku.priceForSale)
                                                        return <div key={i} className="sku-item">
                                                            <img src={sku.logo} alt="" className="logo" />
                                                            <label className="name">
                                                                {sku.giftsStats === 2 && <span style={{ float: 'none' }} className='inline-block-middle'><div className="icon-add-price" />&nbsp;</span>}
                                                                {sku.name}</label>
                                                            <label className="property">
                                                                {sku.propertyItems.reduce((a, b) => a + ' / ' + b)}
                                                                <span>×{sku.number}</span>
                                                            </label>
                                                            <div style={{ width: '4.8rem' }}>
                                                                <label className="price"><em>&yen; </em>
                                                                    {price.toFixed(2)}
                                                                </label>
                                                                {sku.giftsStats === 1 && <span className='fr icon-promotion' style={{ marginTop: '.35rem' }}></span>}
                                                            </div>
                                                        </div>
                                                    }

                                                    )}
                                                </div>
                                            )}
                                            <FixedBottom>
                                                <a className="confirm" onClick={() => this.setState({ showExpress: undefined })}>确认</a>
                                            </FixedBottom>
                                        </div>
                                    </FixedBottom>
                                </SlideBottom>
                            }
                            {showExpressPrice &&
                                <Fade>
                                    <FixedCenter width={6} widthUnit={'rem'}>
                                        <div className="express-prices">
                                            <h6>包含的运费信息</h6>
                                            {expressList.map((express, i) =>
                                                <div key={i} className="item">
                                                    <label>包裹 {i + 1}</label>
                                                    {express.freeFreightPrice &&
                                                        <div className="pricesPostage">
                                                            <span className="postage">(已满{express.freeFreightPrice}元  免运费)</span>
                                                            <span className="price">&yen; {express.expressPrice.toFixed(2)}</span>
                                                        </div>
                                                    }
                                                    {!express.freeFreightPrice &&
                                                        <span>&yen; {express.expressPrice.toFixed(2)}</span>
                                                    }

                                                </div>
                                            )}
                                            <a onClick={() => this.setState({ showExpressPrice: undefined })} className="confirm">知道了</a>
                                        </div>
                                    </FixedCenter>
                                </Fade>
                            }
                            {showDiscounts &&
                                <Fade>
                                    <FixedCenter width={6} widthUnit={'rem'}>
                                        <div className="express-prices">
                                            <h6>您所参加的活动</h6>
                                            {discounts.map((discount, i) =>
                                                <div key={i} className="discount-item">
                                                    <label>{discount.name}</label>
                                                    <span>优惠金额：&yen; {discount.discountPrice.toFixed(2)}</span>
                                                </div>
                                            )}
                                            <a onClick={() => this.setState({ showDiscounts: undefined })}
                                                className="confirm">确定</a>
                                        </div>
                                    </FixedCenter>
                                </Fade>
                            }
                            {showVerify &&
                                <Fade>
                                    <Mask onClick={() => this.cancelVerify()} />
                                </Fade>
                            }
                            {showVerify &&
                                <SlideBottom>
                                    <FixedBottom>
                                        <div className="verify">
                                            <div className="header">
                                                <a className="close" style={{ backgroundImage: 'url(' + imageClose + ')' }}
                                                    onClick={() => this.cancelVerify()}> </a>
                                                <label className="title">实名认证</label>
                                            </div>
                                            <div className="reminder">
                                                <label className="reminderTitle" style={{ backgroundImage: 'url(' + reminder + ')' }}>海关要求购买跨境商品需提供实名信息</label>
                                            </div>
                                            <div className="message">
                                                <div className="messageName">
                                                    <input type="text" placeholder="您的真实姓名" value={!verifyName ? '' : verifyName}
                                                        onChange={event => this.setState({ verifyName: event.target.value })} />
                                                </div>
                                                <div className="messageRank">
                                                    <input type="text" placeholder="您的身份证号码(将加密处理)" maxLength="18" value={!verifyRank ? '' : verifyRank}
                                                        onChange={event => this.setState({ verifyRank: event.target.value })} />
                                                </div>
                                            </div>
                                            <div className="introduce" onClick={this.showIntroduce}>
                                                <label className="introduceTitle" style={{ backgroundImage: 'url(' + introduce + ')' }}>了解实名认证</label>
                                            </div>
                                            <a className="verifyBtn" onClick={this.verifySubmit}>提交</a>
                                        </div>
                                    </FixedBottom>
                                </SlideBottom>
                            }
                            {showAutonym &&
                                <Fade>
                                    <Mask style={{ zIndex: 2 }} onClick={() => this.cancelAutonym()} />
                                </Fade>
                            }
                            {showAutonym &&
                                <Fade>
                                    <FixedCenter width={6.4} widthUnit={'rem'}>
                                        <div className="autonym">
                                            <h6>为什么需要实名认证</h6>
                                            <ul>
                                                <li>• 根据海关最新政策，购买境外物品，需保证购买人的身份证号码与支付软件所绑定的身份证号码一致，才能完成清关。</li>
                                                <li>• 您的身份证信息将加密保管，淘最霓虹保证信息安全，绝不对外泄露！</li>
                                                <li>• 任何身份认证问题可联系我们021-62332188</li>
                                            </ul>
                                            <a className="confirm" onClick={this.cancelAutonym}>知道了</a>
                                        </div>
                                    </FixedCenter>
                                </Fade>
                            }
                            {showPayment &&
                                <Fade>
                                    <Mask onClick={() => this.cancelSubmit()} />
                                </Fade>
                            }
                            {showPayment &&
                                <SlideBottom>
                                    <FixedBottom>
                                        <div className="payment">
                                            <div className="header">
                                                <a className="close" style={{ backgroundImage: 'url(' + imageClose + ')' }}
                                                    onClick={() => this.cancelSubmit()}> </a>
                                                <label className="title" style={{ backgroundImage: 'url(' + imageClock + ')' }}>支付剩余时间<span>{remainingPayTime}</span></label>
                                            </div>
                                            <div className="methods">
                                                <a className="weixin"
                                                    style={{ backgroundImage: 'url(' + imageWeixin + ')' }}>微信支付</a>
                                            </div>
                                            <a className="submit" onClick={this.goToPay}>确认支付&nbsp;&nbsp;¥{totalPrice}</a>
                                        </div>
                                    </FixedBottom>
                                </SlideBottom>
                            }
                            {loading &&
                                <Fade>
                                    <FullScreenLoading />
                                </Fade>
                            }
                            {alertMessage &&
                                <Fade>
                                    <Alert title={alertTitle} message={alertMessage} confirmText={confirmText}
                                        onClose={(e) => {
                                            if (isAddAddress && e) {
                                                this.props.history.push(match.url + '/address/' + skuList.map(s => s.id).join(','))
                                            }
                                            this.setState({ alertMessage: undefined, confirmText: undefined, alertTitle: undefined })
                                        }} />
                                </Fade>
                            }
                            {confirm &&
                                <Fade>
                                    <Confirm title={confirm.title} onConfirm={confirm.onConfirm} onCancel={confirm.onCancel} />
                                </Fade>
                            }
                            {showCouponList &&
                                <Fade>
                                    <Mask onClick={() => {
                                        this.setState({
                                            showCouponList: false
                                        });
                                    }} />
                                </Fade>
                            }
                            {showCouponList &&
                                <SlideBottom>
                                    <FixedBottom>
                                        <CouponList
                                            goodsSkuIds={couponsGoodsList}
                                            deliveryAddressId={address.id}
                                            onClose={() => this.setState({
                                                showCouponList: false
                                            })}
                                            onSel={(item) => {
                                                if (item) {
                                                    this.setState({
                                                        selCoupon: item,
                                                        showCouponList: false
                                                    }, () => this.loadData())
                                                } else {
                                                    this.setState({
                                                        showCouponList: false
                                                    })
                                                }
                                            }}
                                            lastSelCoupon={coupon ? coupon : null}
                                        />
                                    </FixedBottom>
                                </SlideBottom>
                            }
                        </TransitionGroup>
                    </div>
                }
                <Route path={match.url + '/address/:skuIdList'} render={props => (
                    <AddressList {...props} orderConfirmPage={this} onSelect={this.switchAddress} />
                )} />
            </div>
        );
    }
}

const taxpayerDescriptions = [
    '什么是纳税人识别号？',
    '纳税人识别号为营业执照上的同意社会信用代码或税务登记证上的税号，一般为15到20位，部分含英文字母，为确保发票开具的准确性，建议与公司财务确认后填写'
];

export default OrderConfirm;