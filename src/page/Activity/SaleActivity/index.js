import React from 'react';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import { Link, Route } from 'react-router-dom';
import Screen from "../../../utils/Screen";
import PageRoot from '../../../ui/PageRoot/PageRoot'
import Page from '../../../ui/Page/Page'
import TabBar from '../../../ui/TabBar/TabBar'
import FixedTop from '../../../ui/FixedTop/FixedTop'
import FixedBottom from '../../../ui/FixedBottom/FixedBottom'
import SlideBottom from '../../../ui/SlideBottom/SlideBottom'
import MessageBottom from '../../../ui/MessageBottom/MessageBottom'
import Mask from '../../../ui/Mask/Mask'
import Fade from '../../../ui/Fade/Fade'
import FullScreenLoading from '../../../ui/FullScreenLoading/FullScreenLoading'
import Float from './img/Float@3x.png'
import Circle from './img/Circle@3x.png'
import DoubleTopArrow from './img/double-top-arrow@3x.png'
import DoubleDownArrow from './img/double-down-arrow@3x.png'
import DoubleDefArrow from './img/double-arrow@3x.png'
import "./index.css"
import UserContext from '../../../model/UserContext'
import ActivityApi from '../../../api/ActivityApi'
import Alert from "../../../ui/Alert/Alert"
import CartStore from "../../../utils/CartStore"
import Common from '../../../utils/Common'
import GoodsDetail from '../../Goods/GoodsDetails'
import Sku from '../../../ui/Sku/sku'
class Promotion extends Page {

    constructor(props) {
        super(props)
        this.selTab = this.selTab.bind(this)
        this.selGift = this.selGift.bind(this)
        this.init = this.init.bind(this)
        this.autoScroll = this.autoScroll.bind(this)
        this.giftBtnText = this.giftBtnText.bind(this)
        this.isStartAutoScroll = this.isStartAutoScroll.bind(this)
        this.scroll = this.scroll.bind(this)
        this.setSku = this.setSku.bind(this)
        this.checkPrice = this.checkPrice.bind(this)
        this.jumpCart = this.jumpCart.bind(this)
        this.addGiftsId2Sku = this.addGiftsId2Sku.bind(this)
        this.checkActivity = this.checkActivity.bind(this)
        this.itemInSelGiftList = this.itemInSelGiftList.bind(this)
        this.totalPrice = this.totalPrice.bind(this)
        this.checkMaxNumber = this.checkMaxNumber.bind(this)
        this.closeSkuSelect = this.closeSkuSelect.bind(this)
        this.state = {
            goodsTotalPrice: 0,
            loading: true,
            showBarIndex: 0,
            giftList: null,
            selGiftList: [],
            selectedItems: [],
            pageGoodsList: [],
            buyNumber: 1,
            total: null, // 总页数
            sortField: 'createDate', //排序字段
            pageSize: 10, // 每页固定行数
            pageNo: 0, // 第几页
            activityId: +props.match.params.id, // 活动id
            activityType: +props.match.params.type, // 活动类型 1.满赠；2.换购；3.满减
            isShow: +props.match.params.show // 是否直接展示赠品
        }
    }

    componentDidMount() {
        let data = JSON.parse(decodeURIComponent(this.props.match.params.data))
        this.setState({
            giftsItemGoodsIds: data ? data.giftsItemGoodsIds : null,
            goodsSkuList: data ? data.goodsSkuList : []
        }, () => {
            this.init()
        })
        window.addEventListener("scroll", this.scroll);
    }

    componentWillUnmount() {
        clearInterval(this.timer)
        window.removeEventListener("scroll", this.scroll);
    }

    init() {
        let { pageSize, pageNo, activityId, sortField, sortPatten, total, selGiftList } = this.state
        pageNo++
        if (total && pageNo > total) return console.warn('已获取所有数据')
        if (this.isRequesting) return console.warn('正在请求中')
        this.isRequesting = true
        let userText = UserContext.get()
        let body = {
            accessToken: userText.userToken,
            giftsId: activityId,
            pageSize,
            pageNo,
            sortField,
            sortPatten
        }
        // 排序字段文档
        // "sortField":"topIndex", //排序字段（非必须）
        // "sortPatten": "asc",    //排序方式（非必须）
        // "createDate";//排序字段——时间
        // "salesVolume";//排序字段——销量
        // "priceForSale";//排序字段——价格
        // "topIndex";//排序字段——置顶位置
        // "asc";//排序方式——升序
        // "desc";//排序方式——降序
        ActivityApi.list(body, data => {
            let { goodsList, giftsItemGoodsIds, nowSelGiftList, activityType, showGift, isShow } = this.state
            let giftList = []
            let headTip = '限时促销: '
            data.gifts.giftsItems.forEach(item => {
                headTip += `满${item.conditionPrice}可${activityType === 1 ? '领取赠品' : '换购商品'} ，`
                item.giftsItemGoods.forEach(i => {
                    i.conditionPrice = item.conditionPrice
                    i.addPrice = item.addPrice
                })
                giftList = [...giftList, ...item.giftsItemGoods]
            })
            nowSelGiftList = nowSelGiftList ? nowSelGiftList : (giftsItemGoodsIds ? giftList.filter(i => {
                return giftsItemGoodsIds.indexOf(i.giftsItemGoodsId) > -1
            }) : null)
            headTip = headTip.replace(/ ，$/, '。 ')

            let currentGoodsList = this.sort(data.goodsList)

            currentGoodsList.forEach(item => {
                item.goodsSkus.forEach(i => {
                    if (i.timeLimit) {
                        console.log('timeLimit', item)
                    }
                })
            })
            this.setState({
                total: Math.ceil(data.total / pageSize),
                loading: false,
                conditionPrice: data.gifts.giftsItems.map(i => {
                    return i.conditionPrice
                }),
                gifts: data.gifts,
                selGiftList: nowSelGiftList ? JSON.parse(JSON.stringify(nowSelGiftList)) : selGiftList,
                giftList: giftList.sort((a, b) => { return b.totalNumber - a.totalNumber }),
                goodsList: goodsList ? [...goodsList, ...currentGoodsList] : [...currentGoodsList],
                showGift: isShow ? isShow : showGift,
                headTip,
                pageNo,
                nowSelGiftList
            }, () => {
                if (pageNo === 1) {
                    this.checkActivity()
                    this.isStartAutoScroll()
                }
            })
            this.isRequesting = false
        }, error => {
            this.isRequesting = false
            this.setState({
                alertMessage: error,
                loading: false
            })
        })

    }

    // 无库存商品滞后
    sort(list) {
        list.sort(item => {
            if (this.isStock(item.goodsSkus)) {
                return -1
            } else {
                return 1
            }
        })
        console.log(list)
        return list
    }
    scroll() {
        if (Screen.scrollHeight() - Screen.availHeight() - Screen.scrollTop() < 150) {
            this.init()
        }
    }

    selTab(newIndex) {
        let { showBarIndex, sortField, sortPatten } = this.state
        // 价格升序降序判断
        if (showBarIndex !== 2 && newIndex === 2) {
            // 第一次点击价格
            sortPatten = 'desc'
        } else if (showBarIndex === 2 && newIndex === 2) {
            // 再次点击
            sortPatten = sortPatten === 'asc' ? 'desc' : 'asc'
        } else if (showBarIndex === 2 && newIndex !== 2) {
            sortPatten = null
        }

        if (newIndex === 0) {
            sortField = 'createDate'
        } else if (newIndex === 1) {
            sortField = 'salesVolume'
        } else {
            sortField = 'priceForSale'
        }
        this.setState({
            showBarIndex: newIndex,
            pageNo: 0,
            total: null,
            goodsList: null,
            loading: true,
            sortPatten,
            sortField
        }, () => this.init())
    }

    // 是否开启头部滚动
    isStartAutoScroll() {
        let scrollTip = this.refs.scrollTip
        if (scrollTip.scrollWidth > scrollTip.offsetWidth) {
            scrollTip.scrollLeft = 0
            clearInterval(this.timer)
            this.autoScroll(scrollTip)
        }
    }

    // 头部滚动
    autoScroll(el) {
        let base = el.scrollLeft
        let tip1 = el.children[0]
        let tip2 = el.children[1]
        let txt = tip1.innerHTML
        tip2.innerHTML = txt
        this.timer = setInterval(() => {
            base++
            el.scrollLeft = base
            if (base >= tip1.offsetWidth) {
                clearInterval(this.timer)
                el.scrollLeft = 0
                this.autoScroll(el)
            }
        }, 60)
    }

    setSku(target) {
        let { goodsSkuList } = this.state
        console.log('target', goodsSkuList, target)
        let main = {
            selectedSku: undefined,
            skuList: target.goodsSkus.map(s => {
                return {
                    goodsId: target.goodsId,
                    id: s.goodsSkuId,
                    itemIds: [s.propertyItemId1, s.propertyItemId2, s.propertyItemId3, s.propertyItemId4].filter(i => i > 0),
                    price: s.price,
                    salePrice: s.priceForSale,
                    maxBuy: s.maxNumber,
                    stock: s.stock,
                    logo: s.pictureUrl,
                    timeLimit: s.timeLimit
                }
            }),
            selectedItems: [],
            properties: target.goodsProperties.map(p => {
                return {
                    name: p.displayName,
                    items: p.propertyItems.map(i => {
                        let item = {
                            id: i.propertyItemId,
                            name: i.itemValue

                        };
                        let mainItems = target.goodsMainProperties.filter(p => p.propertyItemId === item.id);
                        if (mainItems.length > 0) {
                            item.logo = mainItems[0].picture;
                            item.pictures = mainItems[0].pictureList;
                            item.originalPictures = mainItems[0].originalPictureList;
                        }
                        return item;
                    })
                };
            }),
        }
        main.properties.forEach(() => {
            main.selectedItems.push(undefined)
        });
        let checkMaxNumberBol = this.checkMaxNumber(main)
        // 单一sku属性 直接加入购物车
        if (main.properties.every(m => m.items.length === 1)) {
            if (checkMaxNumberBol) {
                main.alertMessage = checkMaxNumberBol
                this.setState(main)
                return 
            }
            main.alertMessage = '已加入购物车'
            let obj = {
                id: main.skuList[0].id,
                price: main.skuList[0].salePrice
            }
            goodsSkuList.push(obj)
            main.goodsSkuList = goodsSkuList
        } else {
            main.showSku = true
            main.goodsProperties = target.goodsProperties
            main.goodsSkus = target.goodsSkus
            main.goodsMainProperties = target.goodsMainProperties
            main.goodsId = target.goodsId
        }

        this.setState(main, () => {
            if (!main.showSku) {
                let { activityId } = this.state
                let item = main.skuList[0]
                if (!checkMaxNumberBol) {
                    // 当存在限购时 直接更新商品数量
                    if (item.timeLimit && item.timeLimit.status === 3) {
                        let skuList = CartStore.getSkuList()
                        let goods = skuList.filter(i => i.skuId === item.id)
                        let buyNumber = 1
                        if (goods.length > 0) {
                            let limitNum = item.timeLimit.buyNumber
                            let nowNum = 1 + buyNumber
                            buyNumber = nowNum > limitNum ? limitNum : nowNum
                        }
                        CartStore.updateSku(item.id, buyNumber, item.goodsId)
                    } else {
                        CartStore.addSku(item.id, 1, activityId, item.goodsId);
                    }
                }

                this.pageSelGoods(item, 1)
            }
        })


    }

    closeSkuSelect() {
        this.setState({
            showSku: false
        });
    }

    // 当前页面添加的商品
    pageSelGoods(item, num) {
        let { pageGoodsList } = this.state
        let inPageGoodsList = pageGoodsList && pageGoodsList.some(i => { return i.id === item.id })
        if (inPageGoodsList) {
            pageGoodsList.forEach(i => {
                if (i.id === item.id) {
                    i.buyNumber = Common.accAdd(i.buyNumber, num)
                }
            })
        } else {
            item.buyNumber = num
            pageGoodsList.push(item)
        }
        this.setState({
            pageGoodsList
        }, () => {
            this.checkActivity()
            this.addGiftsId2Sku()
        })
    }

    selGift(item) {
        let { selGiftList } = this.state

        let isItemInSelGiftId = selGiftList.indexOf(item)
        if (isItemInSelGiftId > -1) {
            selGiftList.splice(isItemInSelGiftId, 1)
        } else {
            selGiftList.unshift(item)
            //  目前只做单选
            selGiftList.length = 1
        }
        this.setState({
            giftFootTip: this.checkPrice(item),
            selGiftList
        }, () => {
            this.giftBtnText()
        })
    }

    itemInSelGiftList(item) {
        let { selGiftList } = this.state
        if (selGiftList && selGiftList.length > 0) {
            return selGiftList.some(i => { return i.giftsItemGoodsId === item.giftsItemGoodsId })
        }
        return false

    }

    // 赠品未满足提示
    checkPrice(item) {
        let { goodsTotalPrice, activityType } = this.state
        let priceDifference = Common.addition(item.conditionPrice, goodsTotalPrice)
        if (priceDifference > 0) {
            return activityType === 1 ? `此赠品需满${item.conditionPrice}才能兑换哦~` : `此商品需满${item.conditionPrice}才能换购哦~`
        }
        return false
    }

    // 活动条件检测
    checkActivity() {
        let { conditionPrice, activityType } = this.state
        let price = this.totalPrice()
        let isPass = this.isPass(price)
        let minPrice = Math.min.apply(Math, conditionPrice)
        // 小计 提示
        let goodsFootTip
        if (isPass) {
            goodsFootTip = activityType === 1 ? '已满足条件,请选择赠品' : '已满足换购条件，请参加换购'
        } else {
            goodsFootTip = `再买¥${Common.addition(minPrice, price)}可${activityType === 1 ? '获得赠品' : '换购商品'}`
        }
        this.setState({
            goodsTotalPrice: price,
            goodsFootTip
        }, () => this.giftBtnText())
    }

    // 是否满足兑换条件
    isPass(price) {
        let { conditionPrice, goodsTotalPrice } = this.state
        price = price ? price : goodsTotalPrice
        let isOk
        for (let i = 0, len = conditionPrice.length; i < len; i++) {
            if (price >= conditionPrice[i]) {
                isOk = true
                break
            }
        }
        return isOk
    }

    // 赠品按钮文字描述
    giftBtnText() {
        let { nowSelGiftList, goodsFootTip, activityType, btnText } = this.state
        const btnTextObj = {
            1: {
                CHANGE: '更换赠品',
                SEL: '选择赠品'
            },
            2: {
                CHANGE: '重新换购',
                SEL: '换购商品'
            }
        }
        if (this.isPass()) {
            if (nowSelGiftList && nowSelGiftList.length > 0) {

                btnText = btnTextObj[activityType].CHANGE
                goodsFootTip = `已满足条件,已选择${activityType === 1 ? '赠品' : '商品'}`
            } else {
                btnText = btnTextObj[activityType].SEL
            }
        } else {
            btnText = null
        }
        this.setState({
            goodsFootTip,
            btnText
        })
    }

    jumpCart() {
        this.props.history.push('/cart')
    }

    addGiftsId2Sku() {
        let { nowSelGiftList, activityId } = this.state
        if (nowSelGiftList && nowSelGiftList.length > 0) {
            console.log('jinru', nowSelGiftList)
            nowSelGiftList.forEach(item => {
                CartStore.addAttr('activityId', activityId, 'giftId', item.giftsItemGoodsId)
            })
        }
    }

    totalPrice() {
        let skuList = CartStore.getSkuList()
        let { goodsSkuList } = this.state
        let newSet = []
        for (let i = 0, len = goodsSkuList.length; i < len; i++) {
            if (!newSet.some(r => r.id === goodsSkuList[i].id)) {
                newSet.push(goodsSkuList[i])
            }
        }
        let price = 0
        skuList.forEach(item => {
            newSet.forEach(i => {
                let singlePrice = 0
                if (item.skuId === i.id) {
                    singlePrice = Common.accMul(i.price, item.buyNumber)
                }
                price = Common.accAdd(price, singlePrice)
            })
        })
        return price
    }

    checkMaxNumber(item) {
        let skuList = CartStore.getSkuList()
        let selMaxNumber = item.maxBuy || item.skuList[0].maxBuy
        let selSkuId = item.id || item.skuList[0].id
        let selBuyNumber = item.buyNumber || 1
        if (skuList.some(s => s.skuId === selSkuId && Common.accAdd(selBuyNumber, s.buyNumber) > selMaxNumber)) {
            return `最大购买数为${selMaxNumber}`
        }
        return false


    }

    // 商品缺货判断 ture 有货 false: 无货
    isStock(sku) {
        return sku.some(i => {
            if (i.timeLimit) {
                return i.timeLimit.buyNumber > 1
            }
            return i.stock > 1
        })

    }
    render() {
        const { match } = this.props
        const { goodsId, goodsMainProperties, goodsProperties, goodsSkus, loading, showBarIndex, showGift, giftList, selGiftList, showSku, sortPatten, goodsList, alertMessage, headTip, goodsTotalPrice, goodsFootTip, giftFootTip, btnText, nowSelGiftList, activityType } = this.state
        const selStyle = {
            sel: { backgroundImage: "url(" + Float + ")" },
            unSel: { backgroundImage: "url(" + Circle + ")" }
        }
        const arrowStyle = {
            top: { backgroundImage: 'url(' + DoubleTopArrow + ')' },
            down: { backgroundImage: 'url(' + DoubleDownArrow + ')' },
            def: { backgroundImage: 'url(' + DoubleDefArrow + ')' }
        }

        return (
            <PageRoot>
                <div className="promotion-index-root">
                    <FixedTop>
                        <TabBar
                            showBarIndex={showBarIndex}
                            showBar={true}
                        >
                            <li className="promotion-li" onClick={() => this.selTab(0)}>新品</li>
                            <li className="promotion-li" onClick={() => this.selTab(1)}>销量</li>
                            <li className="promotion-li" onClick={() => this.selTab(2)}>价格 <span className="promotion-price" style={sortPatten ? (sortPatten === 'asc' ? arrowStyle.top : arrowStyle.down) : arrowStyle.def}></span></li>
                        </TabBar>
                        <div className="promotion-head">
                            <div className="promotion-head-box one-el-middle" ref="scrollTip">
                                <p className="promotion-head-txt">
                                    {headTip}
                                </p>
                                <p className="promotion-head-txt"></p>
                            </div>

                        </div>
                    </FixedTop>

                    <ul className="promotion-content">
                        {
                            goodsList && goodsList.map((item, index) => {
                                return (
                                    <li className="clearfix" key={item.goodsId}>
                                        <Link to={match.url + '/goods/details/' + item.goodsId} >
                                            <div style={{ backgroundImage: 'url(' + item.pictureUrl + ')', position: 'relative' }} className="promotion-goods-img">
                                                {!this.isStock(item.goodsSkus) && <p className='no-stock-tip'>缺货</p>}
                                            </div>
                                        </Link>

                                        <div className="promotion-goods-info">
                                            <p className="two-txt">
                                                {
                                                    item.goodsSkus.some(i => i.timeLimit) &&
                                                    <span className="sku-limit-buy" />
                                                }
                                                {item.name}
                                            </p>
                                            <span className="price">&yen;{item.priceForSale}</span>
                                            {this.isStock(item.goodsSkus) && <div className="add-cart" onClick={() => this.setSku(item)} />}
                                        </div>
                                    </li>
                                )
                            })
                        }
                    </ul>
                    <div className="break20"></div>

                    <FixedBottom>
                        <div className="promotion-foot">
                            <div className="total">
                                <p className="total-price">
                                    小计:&yen;{goodsTotalPrice}
                                </p>
                                <p className="total-tip">
                                    {goodsFootTip}
                                </p>
                            </div>

                            <div className="look" onClick={
                                () => {
                                    this.setState({
                                        selGiftList: nowSelGiftList ? JSON.parse(JSON.stringify(nowSelGiftList)) : selGiftList,
                                        showGift: true
                                    })
                                }}>
                                {btnText || (activityType === 1 ? '查看赠品' : '查看换购')}
                            </div>

                            <div className="cart" onClick={() => this.jumpCart()}>
                                去购物车
                            </div>
                        </div>
                    </FixedBottom>
                    <TransitionGroup>
                        {
                            (showGift || showSku) &&
                            <Fade>
                                <Mask
                                    style={{ zIndex: 1 }}
                                    onClick={() => {

                                        this.setState({
                                            showGift: false,
                                            isShow: false,
                                            giftFootTip: null,
                                            showSku: false,
                                            selGiftList: []
                                        }, () => {
                                            console.log(this.state.selGiftList)
                                            this.closeSkuSelect()
                                        })
                                    }}
                                />
                            </Fade>
                        }
                        {
                            showGift &&
                            <SlideBottom>
                                <MessageBottom
                                    title={activityType === 1 ? '赠品选择' : '换购选择'}
                                    onClose={() => {
                                        this.setState({ showGift: false, isShow: false, giftFootTip: null })
                                    }}
                                    onConfirm={() => { }}
                                    leftTitle={true}
                                    hideBtn={true}
                                >
                                    <div className="gift-box">
                                        <div className="gift">
                                            {
                                                giftList.map((item, index) => {
                                                    return (
                                                        <div key={index} className="gift-item clearfix" onClick={e => {
                                                            if (item.totalNumber >= 1) {
                                                                this.selGift(item)
                                                            }
                                                        }}>
                                                            <div className="gift-sel">
                                                                <span
                                                                    className="sel one-el-middle"
                                                                    style={item.totalNumber >= 1 ? (this.itemInSelGiftList(item) ? selStyle.sel : selStyle.unSel) : {}}
                                                                />

                                                            </div>
                                                            <Link to={match.url + '/goods/details/' + item.goods.goodsId}>
                                                                <div className="ml30 gift-goods-img" style={{ backgroundImage: 'url(' + item.goods.pictureUrl + ')' }}>
                                                                    {goodsTotalPrice < item.conditionPrice &&
                                                                        <div className="img-tip">满{item.conditionPrice}可{activityType === 1 ? '兑换' : '换购'}</div>
                                                                    }
                                                                </div>
                                                            </Link>
                                                            <div className="gift-info ml20">
                                                                <p className="two-txt">{item.goods.name}</p>
                                                                <div> {item.goods.propertyItems.toString()}<em>&times; 1</em></div>
                                                                <div style={{ width: '100%', height: '.5rem' }}>
                                                                    <span className="price fl">
                                                                        &yen;&nbsp;{activityType === 1 ? '0.00' : item.addPrice}
                                                                    </span>
                                                                    {item.totalNumber < 1 &&
                                                                        <span className='btn fr bac-main color-fff txt-center'>{activityType === 1 ? '已赠完' : '缺货'}</span>
                                                                    }
                                                                </div>

                                                            </div>
                                                            {
                                                                this.itemInSelGiftList(item) && giftFootTip && <p className="fr mt20 mb30 gift-tip">
                                                                    {giftFootTip}
                                                                </p>
                                                            }

                                                        </div>
                                                    )
                                                })
                                            }
                                            <div className="break20"></div>
                                        </div>
                                        {
                                            giftList &&
                                            <FixedBottom>
                                                <div className="gift-foot">
                                                    <div className="gift-sel-info">
                                                        {/* 已选择{selGiftList.length}/{giftList.length}件 */}
                                                        已选择{selGiftList.length}/1件
                                                        </div>
                                                    <div className={`${(selGiftList.length > 0 && !giftFootTip) ? 'bac-main' : 'bac-grey'} gift-btn`} onClick={() => {
                                                        let { selGiftList, giftFootTip } = this.state
                                                        if (selGiftList.length === 0 || giftFootTip) return console.error('拒绝选择')
                                                        if (giftFootTip) selGiftList = []
                                                        this.setState({
                                                            showGift: false,
                                                            isShow: false,
                                                            nowSelGiftList: giftFootTip ? nowSelGiftList : JSON.parse(JSON.stringify(selGiftList)),
                                                            giftFootTip: null,
                                                            selGiftList
                                                        }, () => {
                                                            this.giftBtnText()
                                                            this.addGiftsId2Sku()
                                                        })
                                                    }}>
                                                        确定
                                                        </div>
                                                </div>
                                            </FixedBottom>
                                        }
                                    </div>
                                </MessageBottom>
                            </SlideBottom>
                        }
                        {
                            showSku &&
                            <SlideBottom>
                                <Sku
                                    confirmText={'加入购物车'}
                                    goodsId={goodsId}
                                    goodsProperties={goodsProperties}
                                    goodsSkus={goodsSkus}
                                    goodsMainProperties={goodsMainProperties}
                                    // limitBuyTotal={limitBuyTotal}
                                    // limitBuyNumber={limitBuyNumber}
                                    onClose={this.closeSkuSelect}
                                    onSel={(item, num) => {
                                        console.log('选择===>', item, num)
                                        let { goodsSkuList, activityId } = this.state
                                        let isTimelimit = item.timeLimit && item.timeLimit.status === 3
                                        let obj = {
                                            id: item.id,
                                            price: isTimelimit ? item.timeLimit.buyPrice : item.salePrice
                                        }
                                        goodsSkuList.push(obj)

                                        // 当存在限购时 直接更新商品数量
                                        if (isTimelimit) {
                                            let skuList = CartStore.getSkuList()
                                            let goods = skuList.filter(i => i.skuId === item.id)
                                            let buyNumber = 1
                                            if (goods.length > 0) {
                                                let limitNum = item.timeLimit.buyNumber
                                                let nowNum = 1 + buyNumber
                                                buyNumber = nowNum > limitNum ? limitNum : nowNum
                                            }
                                            CartStore.updateSku(item.id, buyNumber, item.goodsId)
                                        } else {
                                            CartStore.addSku(item.id, num, activityId, item.goodsId);
                                        }

                                        this.pageSelGoods(item, num)
                                        this.setState({
                                            showSku: false,
                                            alertMessage: '已加入购物车'
                                        })
                                    }}
                                />
                            </SlideBottom>
                        }
                        {
                            loading &&
                            <Fade>
                                <FullScreenLoading />
                            </Fade>
                        }
                        {alertMessage &&
                            <Fade timeout={0}>
                                <Alert message={alertMessage} onClose={() => this.setState({ alertMessage: undefined })} />
                            </Fade>
                        }
                    </TransitionGroup>
                </div>
                <Route path={match.url + '/goods/details/:id'} render={props =>
                    <GoodsDetail {...props} />
                } />
            </PageRoot>
        )
    }
}

export default Promotion;