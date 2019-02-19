import './Cart.css';
import React from 'react';
import { TransitionGroup } from 'react-transition-group';
import { Route } from 'react-router-dom';
import Fade from "../../ui/Fade/Fade";
import FullScreenLoading from "../../ui/FullScreenLoading/FullScreenLoading";
import CartStore from "../../utils/CartStore";
import imageUnchecked from './unchecked.png';
import imageChecked from './checked.png';
import imageLocation from './location.png';
import imagePath from './path.png';
import FixedBottom from "../../ui/FixedBottom/FixedBottom";
import TabBar from "../../ui/TabBar/TabBar";
import Alert from "../../ui/Alert/Alert";
import OrderConfirm from "../Order/OrderConfirm";
import Confirm from "../../ui/Confirm/Confirm";
import GoodsApi from "../../api/GoodsApi";
import UserContext from "../../model/UserContext";
import imageEmptyCart from './empty-cart.png';
import FollowApi from "../../api/FollowApi";
import Screen from "../../utils/Screen";
import Page from "../../ui/Page/Page";
import CouponGetList from '../Coupons/Common/CouponGetList';
import SlideBottom from "../../ui/SlideBottom/SlideBottom";
import MessageBottom from "../../ui/MessageBottom/MessageBottom";
import Mask from "../../ui/Mask/Mask";
import Float from '../Activity/SaleActivity/img/Float@3x.png';
import Circle from '../Activity/SaleActivity/img/Circle@3x.png';
import Group from '../Activity/SaleActivity/img/Group@3x.png';
import AddPrice from '../Activity/SaleActivity/img/AddPrice@2x.png';
import Common from '../../utils/Common';
class Cart extends Page {
    constructor(props) {
        super(props);
        this.init = this.init.bind(this);
        this.selectDistrict = this.selectDistrict.bind(this);
        this.getValidSkuList = this.getValidSkuList.bind(this);
        this.isAllSelected = this.isAllSelected.bind(this);
        this.toggleAll = this.toggleAll.bind(this);
        this.confirm = this.confirm.bind(this);
        this.del = this.del.bind(this);
        this.favourite = this.favourite.bind(this);
        this.toggleEditing = this.toggleEditing.bind(this);
        this.clickSku = this.clickSku.bind(this);
        this.caculateSkuList = this.caculateSkuList.bind(this);
        this.fetchCoupons = this.fetchCoupons.bind(this);
        this.selActivity = this.selActivity.bind(this);
        this.sortSkuList = this.sortSkuList.bind(this);
        this.giftJumpTip = this.giftJumpTip.bind(this);
        this.getAllGoods = this.getAllGoods.bind(this);
        this.singleDel = this.singleDel.bind(this);
        this.delGift = this.delGift.bind(this);
        this.jumpActivity = this.jumpActivity.bind(this);
        this.checkActivity = this.checkActivity.bind(this);
        this.submitOrder = this.submitOrder.bind(this);
        this.autoScrollGoods = this.autoScrollGoods.bind(this);
        this.checkSkuList = this.checkSkuList.bind(this);
        this.state = {
            url: props.match.url,
            loading: true,
            total: 0
        };
    }

    componentDidMount() {
        this.init()
    }

    componentWillUnmount() {
        clearInterval(this.scrollTopTimer);
        clearInterval(this.cartCurrentTimer);
    }

    init() {
        let { history, match } = this.props;
        if (!UserContext.isLoggedIn(history, match)) return;
        let userContext = UserContext.get();
        let cartSkuList = CartStore.getSkuList();
        let body = {
            accessToken: userContext.userToken,
            goodsSkuList: cartSkuList.map(s => {
                return {
                    goodsSkuId: s.skuId,
                    quantity: s.buyNumber
                };
            }),
            giftsItemGoodsIds: cartSkuList.map(item => {
                return item.giftId
            }).filter(i => {
                return typeof i === 'number'
            }),   // 赠送物品id
            goodsSkuIds: cartSkuList.map(item => item.skuId)
        };
        if (cartSkuList.length > 0) {
            GoodsApi.goodsCart(body, data => {
                if (data.isCoupon) {
                    this.setState({
                        couponIdList: data.goodsSkuList.map(item =>
                            Number(item.goodsId)
                        )
                    })
                }
                this.cartNowTime = data.now;
                this.setState({
                    loading: false,
                    skuList: this.sortSkuList(data.goodsSkuList, data.giftsList),
                    pay: 0,
                    total: 0,
                    discount: 0,
                    promotionRuleList: data.giftsList,
                    discountRuleList: data.discountRuleList,

                }, () => {
                    let { skuList } = this.state;
                    this.currentTimer();
                    this.caculateSkuList(skuList);
                    this.checkActivity();
                    this.autoScrollGoods()
                });
            }, error => {
                this.setState({
                    loading: false,
                    alertMessage: error
                });
            });
        } else {
            this.setState({
                loading: false,
                skuList: []
            });
        }
    }

    selectDistrict(district, parentDistricts, addressInfo) {
        let { skuList } = this.state;
        skuList.forEach(items => {
            let item = items.goodsList;
            for (let i = 0; i < item.length; i++) {
                item[i].disabled = item[i].transportRule.rules
                    .filter(rule => rule.districtId === 0 || rule.districtId === district.id || parentDistricts.filter(d => d.id === rule.districtId).length > 0).length === 0;
            }
        });
        this.setState({
            selectedDistrict: district,
            showDistrict: undefined,
            skuList: skuList
        });
    }

    getValidSkuList() {
        let goodsList = this.getAllGoods();
        return goodsList ? goodsList.filter(sku => sku.selected && !sku.disabled) : [];
    }

    isAllSelected() {
        let goodsList = this.getAllGoods();
        let selectedGoodsList = goodsList.filter(sku => sku.selected).length;
        return selectedGoodsList > 0 && goodsList.length === selectedGoodsList
    }

    toggleAll() {
        let { skuList, editing } = this.state;
        let selected = this.isAllSelected();
        let goodsList = this.getAllGoods();
        console.log('selceted', selected);
        goodsList.forEach(sku => {
            sku.selected = !selected;
            CartStore.addAttr('skuId', sku.id, 'sel', !selected)
        });
        if (editing) {
            this.setState({ skuList: skuList });
        } else {
            this.caculateSkuList(skuList);
        }
    }

    confirm() {
        let selectedGoodsList = this.getValidSkuList();
        if (selectedGoodsList.length === 0) {
            this.setState({ alertMessage: '请至少选择一样商品' });
            return;
        }
        //  满赠检测  1.检查有无选择赠品  2. 库存检测
        let { skuList } = this.state;
        let tip, leftBtn, rightBtn, leftFn;
        let rightFn = function () {
            this.setState({
                alertMessage: undefined,
                doubleBtn: null
            }, () => this.submitOrder())
        }.bind(this);
        for (let i = 0, len = skuList.length; i < len; i++) {
            let item = skuList[i];
            let isSelItem = item.goodsList.some(g => g.selected);
            if (!ACTIVITY_STATUS.indexOf(item.status) !== -1 || !isSelItem) continue
            leftFn = function () {
                this.setState({
                    alertMessage: undefined,
                    doubleBtn: null
                }, () => this.jumpActivity(item))
            }.bind(this);

            // if (!item.passGiftRule) {
            //     tip = '订单还未满足条件哦~'
            //     leftBtn = '返回选择'
            //     rightBtn = '继续下单'
            //     leftFn = function () {
            //         this.setState({
            //             alertMessage: undefined,
            //             doubleBtn: null
            //         })
            //     }.bind(this)
            // } else 
            if (!item.giftItemGoodsInfo || item.giftItemGoodsInfo.length === 0) {
                tip = '您参加的活动还未选择赠品，是否继续下单';
                leftBtn = '选择赠品';
                rightBtn = '继续下单';
            } else if (item.giftItemGoodsInfo && item.giftItemGoodsInfo.some(g => {
                return g.totalNumber < 1
            })) {
                tip = '预选赠品已无货，需要继续下单吗';
                leftBtn = '更换赠品';
                rightBtn = '继续下单'
            }
        }
        if (tip) {
            this.setState({
                title: leftBtn && rightBtn && '系统提示',
                alertMessage: tip,
                doubleBtn: {
                    leftBtn,
                    rightBtn,
                    leftFn,
                    rightFn
                }
            })
        } else {
            this.submitOrder()
        }
    }

    // 提交订单
    submitOrder() {
        let selectedGoodsList = this.getValidSkuList();
        let { skuList } = this.state;
        let goodsList = selectedGoodsList.map(sku => {
            return { id: sku.id, number: sku.number };
        });
        skuList.forEach(item => {
            if (item.goodsList.some(i => i.selected)) {
                (item.giftItemGoodsInfo && item.giftItemGoodsInfo.length > 0) && item.giftItemGoodsInfo.forEach(g => {
                    let obj = {
                        id: g.goodsSku.goodsSkuId,
                        number: 1, // 赠品数量恒为一
                        giftsItemGoodsId: g.giftsItemGoodsId
                    };
                    goodsList.push(obj);
                })
            }
        });
        let { history, match } = this.props;
        history.push(match.url + '/confirm/' + encodeURIComponent(JSON.stringify({
            fromCart: true,
            requestSkuList: goodsList
        })));
    }

    del() {
        let { skuList } = this.state;
        let goodsList = this.getAllGoods()
        if (goodsList.filter(sku => sku.selected).length === 0) {
            this.setState({ alertMessage: '请至少选择一样商品' });
            return;
        }
        this.setState({
            confirm: {
                title: '确定要删除所选的商品吗？',
                onConfirm: () => {
                    goodsList.filter(sku => sku.selected).forEach(sku => CartStore.removeSku(sku.id));
                    for (let i = 0; i < skuList.length; i++) {
                        let goodsList = skuList[i].goodsList;
                        for (let n = 0; n < goodsList.length; n++) {
                            if (goodsList[n].selected) {
                                goodsList.splice(n, 1);
                                n--
                            }
                        }
                        if (goodsList && goodsList.length === 0) {
                            skuList.splice(i, 1);
                            i--
                        }
                    }
                    this.setState({
                        confirm: undefined,
                        skuList
                    });
                },
                onCancel: () => {
                    this.setState({ confirm: undefined });
                }
            }
        });
    }

    // 单独商品删除
    singleDel(e, item) {
        e.stopPropagation();
        let { skuList } = this.state;
        this.setState({
            confirm: {
                title: '确定要删除所选的商品吗？',
                onConfirm: () => {
                    CartStore.removeSku(item.id);
                    for (let i = 0; i < skuList.length; i++) {
                        let goodsList = skuList[i].goodsList;
                        for (let n = 0; n < goodsList.length; n++) {
                            if (goodsList[n].id === item.id) {
                                goodsList.splice(n, 1);
                                n--
                            }
                        }
                        if (goodsList && goodsList.length === 0) {
                            skuList.splice(i, 1);
                            i--
                        }
                    }
                    this.setState({
                        confirm: undefined,
                        skuList
                    });
                },
                onCancel: () => {
                    this.setState({ confirm: undefined });
                }
            }
        });
    }

    // 赠品删除
    delGift(e, skuIndex, giftIndex) {
        console.log(e, skuIndex, giftIndex);
        e.stopPropagation();
        this.setState({
            confirm: {
                title: '确定要删除所选的商品吗？',
                onConfirm: () => {

                    let { skuList } = this.state;
                    let item = skuList[skuIndex].goodsList;
                    let target = skuList[skuIndex].giftItemGoodsInfo;
                    let goodsSkuIds = item.map(i => {
                        return i.id
                    });
                    CartStore.removeSku(goodsSkuIds, 'giftId');
                    target.splice(giftIndex, 1);
                    this.setState({
                        confirm: undefined,
                        skuList
                    });
                },
                onCancel: () => {
                    this.setState({ confirm: undefined });
                }
            }
        });


    }

    // 收藏
    favourite() {
        let { skuList } = this.state;
        let goodsList = this.getAllGoods();
        if (goodsList.filter(sku => sku.selected).length === 0) {
            this.setState({ alertMessage: '请至少选择一样商品' });
            return;
        }
        this.setState({
            confirm: {
                title: '确定要将所选商品移入收藏吗？',
                onConfirm: () => {
                    let goodsIds = [];
                    goodsList.filter(sku => sku.selected).forEach(s => {
                        CartStore.removeSku(s.id);
                        goodsIds.push(s.goodsId);
                    });
                    let userContext = UserContext.get();
                    Screen.loading(true, () => FollowApi.goodsFollow({
                        accessToken: userContext.userToken,
                        goodsIds: goodsIds
                    }, () => Screen.loading(false, () => {
                        for (let i = 0; i < skuList.length; i++) {
                            let goodsList = skuList[i].goodsList;
                            for (let n = 0; n < goodsList.length; n++) {
                                if (goodsList[n].selected) {
                                    goodsList.splice(n, 1);
                                    n--
                                }
                            }
                            if (goodsList && goodsList.length === 0) {
                                skuList.splice(i, 1);
                                i--
                            }
                        }
                        this.setState({
                            confirm: undefined,
                            skuList
                        })
                    }

                    ), error => Screen.loading(false, () => Screen.alert(error))));
                },
                onCancel: () => {
                    this.setState({ confirm: undefined });
                }
            }
        });
    }

    toggleEditing() {
        let { editing, skuList } = this.state;
        this.setState({
            editing: !editing
        });
        if (editing) {
            this.caculateSkuList(skuList);
            this.checkActivity()
        }
    }

    clickSku(sku, skuList, skuIndex) {
        if (sku.disabled) return;
        sku.selected = !sku.selected;
        CartStore.addAttr('skuId', sku.id, 'sel', sku.selected);
        // CartStore.addGoodsAttr(sku.id, 'sel', sku.selected)
        // let { editing } = this.state
        this.setState({
            skuList
        }, () => {
            this.checkActivity();
            this.caculateSkuList(skuList);
        })
    }

    caculateSkuList(skuList) {
        if (!skuList || skuList.length === 0) return;
        let goodsList = this.getAllGoods().filter(i => i.selected);
        // 加价购商品
        let giftList = [];
        skuList.forEach(item => {
            if (item.status === 2 && item.giftItemGoodsInfo && item.giftItemGoodsInfo.length > 0) {
                return giftList.push(...item.giftItemGoodsInfo)
            }
        });
        let total = 0;
        goodsList.forEach(goods => {
            let itemPrice = goods.timeLimit ? goods.timeLimit.buyPrice : goods.priceForSale
            let itemTotal = Common.accMul(goods.number, itemPrice)
            total = Common.accAdd(total, itemTotal)
        });
        giftList.forEach(gift => {
            total = Common.accAdd(total, gift.addPrice)
        });
        this.setState({
            total
        })
    }

    // 优惠券领取mask
    fetchCoupons() {
        this.setState({
            showCouponGetList: true
        })
    }

    selActivity(item) {
        let { singleGoodsInfo } = this.state;
        console.log('选择活动', item, '选择的goods', singleGoodsInfo);
        if (item.giftsId !== singleGoodsInfo.activityId) {
            CartStore.addAttr('skuId', singleGoodsInfo.id, 'activityId', item.giftsId);
            CartStore.removeSku([singleGoodsInfo.id], 'giftId')
        }
        this.setState({
            showPromotion: false,
            loading: true,
            scrollId: singleGoodsInfo.id
        }, () => {
            window.scrollTo(0, 0);
            this.init()
        })
    }

    // 获取所有goods
    getAllGoods() {
        let { skuList } = this.state;
        let goods = [];
        skuList && skuList.forEach(item => {
            goods = [...goods, ...item.goodsList]
        });
        return goods
    }

    //  判断是否失效 缺货
    isStock(item) {
        let target = item.timeLimit;
        if (target) {
            return target.stock < 1 || (this.cartNowTime > target.activeTimeEnd || this.cartNowTime < target.activeTimeStart) || target.buyNumber === 0
        } else {
            return item.stock < 1
        }
    }

    // skuList数据整合
    sortSkuList(skuList, giftList) {
        // sku整理
        let sku = skuList.map(s => {
            return {
                maxNumber: s.maxNumber,
                id: s.goodsSkuId,
                goodsId: s.goodsId,
                logo: s.pictureUrl,
                name: s.name,
                number: s.quantity,
                propertyItems: s.propertyItems,
                priceForSale: s.priceForSale,
                stock: s.stock,
                activityGiftList: s.activityGiftList,
                giftCouponMappingList: s.giftCouponMappingList,
                transportRule: {
                    type: s.transportRule.type,
                    rules: s.transportRule.transportRuleItems.map(r => {
                        return {
                            districtId: r.districtId,
                            district: r.districtName,
                            firstNumber: r.firstNumber,
                            firstPrice: r.firstPrice,
                            addNumber: r.addNumber,
                            addPrice: r.addPrice,
                            maxNumber: r.maxNumber
                        };
                    })
                },
                timeLimit: s.timeLimit
            };
        });
        //  sku列表 限时购商品在普通商品之上
        sku = sku.sort(item => {
            console.log(item.timeLimit);
            if (item.timeLimit) {return -1}
            return 1
        });
        // 本地缓存拿购物车sku信息
        let cartSkuList = CartStore.getSkuList();
        // sku 中添加活动 id
        cartSkuList.forEach(item => {
            sku.forEach(i => {
                if (i.id === item.skuId) {
                    item.activityId && (i.activityId = item.activityId)
                    item.sel && (i.selected = item.sel)
                }
            })
        });

        let res = [];
        let obj;
        // 将缺货商品单独拿出来
        // 将 失效的商品也塞进去
        let noStockGoodsList = [];
        for (let i = 0; i < sku.length; i++) {
            let item = sku[i];
            if (this.isStock(item)) {
                obj = {};
                obj.status = 0;
                obj.goodsList = [item];
                noStockGoodsList.push(obj);
                sku.splice(i, 1);
                i--
            }
        }
        this.setState({
            noStockGoodsList
        });


        // 当存在活动规则的时候进行排序
        if (giftList && giftList.length > 0) {
            // 促销活动按照时间先后排序
            giftList = giftList.sort((a, b) => {
                return a.activeTimeStart - b.activeTimeStart
            });

            // 根据商品已有的活动id来分组
            giftList.forEach(item => {
                obj = {};
                for (let i = 0; i < sku.length; i++) {
                    if (sku[i].activityId === item.giftsId && item.goodIds.indexOf(sku[i].goodsId) !== -1 && (sku[i].timeLimit ? sku[i].timeLimit.isCouponActvity : true)) {
                        obj.status = item.status;
                        obj.goodsList = obj.goodsList ? [...obj.goodsList, sku[i]] : [sku[i]];
                        sku.splice(i, 1);
                        i--
                    }
                }
                if (JSON.stringify(obj) !== '{}') {
                    obj.activityId = item.giftsId;
                    obj.giftsItems = item.giftsItems;
                    res.push(obj)
                }
            });

            // 将无活动id的商品分组
            giftList.forEach((item, gindex) => {
                obj = {};
                item.goodIds.forEach((g, index) => {
                    for (let i = 0; i < sku.length; i++) {
                        if (sku[i].goodsId === g && (sku[i].timeLimit ? sku[i].timeLimit.isCouponActvity : true)) {
                            CartStore.addAttr('goodsId', g, 'activityId', item.giftsId);
                            sku[i].activityId = item.giftsId;
                            obj.goodsList = obj.goodsList ? [...obj.goodsList, sku[i]] : [sku[i]];
                            obj.status = item.status;
                            sku.splice(i, 1);
                            i--
                        }
                    }
                });
                if (JSON.stringify(obj) !== '{}') {
                    obj.activityId = item.giftsId;
                    obj.giftsItems = item.giftsItems;
                    res.push(obj)
                }
            })
        }


        console.log('4.将剩余的按照活动下面的goods id来排序', res);

        // //  将限时购商品加入
        // limitBuyList.forEach(l => {
        //     res.push(l)
        // })

        // 剩余单品加入
        sku.forEach(item => {
            obj = {
                status: 0,
                goodsList: [item]
            };
            res.push(obj)
        });
        // 将同一活动id下的商品集合到一起
        for (let i = 0, len = res.length; i < len; i++) {
            if (!res[i + 1]) break;
            if (res[i].activityId === res[i + 1].activityId || (res[i].status + res[i + 1].status === 0)) {
                res[i].goodsList = [...res[i].goodsList, ...res[i + 1].goodsList];
                res.splice(i + 1, 1);
                i--
            }
        }
        return this.checkSkuList(res, giftList)
    }

    // 初始化判断是否满足满赠条件
    checkSkuList(list, activityList) {
        list.forEach(item => {
            //  暂时只编辑 满赠 换购 , 满减 暂未开发, 限时购 和 普通商品不参与
            if (ACTIVITY_STATUS.indexOf(item.status) !== -1) {
                let rule = item.giftsItems.sort((a, b) => {
                    return a.conditionPrice - b.conditionPrice
                });
                item.giftsItems = rule;
                console.log('5.排序规则升序排列,仅需要满足最低即可', rule);
                let giftsList = [];
                rule.forEach(g => {
                    g.giftsItemGoods.forEach(i => {
                        i.addPrice = g.addPrice;
                        if (i.selected) {
                            i.totalNumber >= 1 ?
                                giftsList = [...giftsList, i] :
                                CartStore.removeSku(item.goodsList.map(m => m.id), 'giftId')
                        }
                    })
                });
                item.giftItemGoodsInfo = giftsList;

                // 商品满足哪些活动条件, 将其塞入goods中
                item.goodsList.forEach(l => {
                    let arr = [];
                    activityList.forEach(p => {
                        if (p.giftsId === l.activityId || p.goodIds.indexOf(l.goodsId) !== -1) {
                            arr.push(p)
                        }
                    });
                    l.activityList = JSON.parse(JSON.stringify(arr))
                })
            }
        });
        return list
    }

    // 点选之后计算是否促销条件
    checkActivity() {
        let { skuList } = this.state;
        skuList.forEach(item => {
            if (ACTIVITY_STATUS.indexOf(item.status) !== -1) {
                let itemPrice = 0;
                item.goodsList.forEach(i => {
                    if (i.selected) {

                        let price = i.timeLimit ? i.timeLimit.buyPrice : i.priceForSale;
                        itemPrice = Common.accAdd(itemPrice, Common.accMul(price, i.number))
                    }
                });

                // 是否满足最低要求
                let rule = item.giftsItems[0];
                // 最低要求差多少
                let difference = Common.addition(rule.conditionPrice, itemPrice);

                let level;   // 目前到达的第几个规则价格限制
                let levelRule = []; // 向下兼容的规则信息
                item.goodsList.forEach(sku => {
                    sku.activityList.forEach(f => {
                        if (sku.activityId === f.giftsId) {
                            f.giftsItems.forEach(g => {
                                if (itemPrice >= g.conditionPrice) {
                                    level = g.conditionPrice;
                                    levelRule.push(g)
                                }
                            })
                        }
                    })
                });
                //向下兼容的规则数组去重
                let newSetRule = [];
                levelRule.forEach(f => {
                    if (!newSetRule.some(s => s.giftsItemId === f.giftsItemId)) {
                        newSetRule.push(f)
                    }
                });
                // 规则信息中的所有赠品信息
                let ruleGifts = [];
                newSetRule.forEach(l => {
                    ruleGifts.push(...l.giftsItemGoods)
                });

                // 判断规则中的赠品与现有的赠品信息是否抵触,抵触则删除
                if (ruleGifts && ruleGifts.length > 0) {
                    item.giftItemGoodsInfo && item.giftItemGoodsInfo.forEach(i => {
                        if (!ruleGifts.some(s => s.giftsItemGoodsId === i.giftsItemGoodsId)) {
                            delete item['giftItemGoodsInfo'];
                            CartStore.removeSku(item.goodsList.map(ii => ii.id), 'giftId')
                        }
                    })
                } else if (ruleGifts.length === 0) {
                    delete item['giftItemGoodsInfo'];
                    CartStore.removeSku(item.goodsList.map(ii => ii.id), 'giftId')
                }
                item.selectedPrice = itemPrice;
                item.giftDifferencePrice = difference;
                // 1: 满赠 2:换购  判断处理
                if (item.status === 1) {
                    item.giftHeadTip = difference > 0 ? `满${rule.conditionPrice}可领取赠品,还差${difference}元`
                        : `已满 ${level}元,可领取赠品`
                } else if (item.status === 2) {
                    item.giftHeadTip = difference > 0 ? `购满${rule.conditionPrice}元,即可换购商品` : `已满${level}元,可加价${rule.addPrice}元换购商品`
                }

                item.passGiftRule = difference > 0 ? false : true
            }
        });
        console.log('6.第一次检查是否满足初始条件', skuList)
        this.setState({
            skuList
        })
    }

    // 满赠跳转提示
    giftJumpTip(item) {
        let difference = item.giftDifferencePrice;
        let status = item.status;
        if (status === 1) {
            return difference > 0 ? ADD_ON_ITEM : (item.giftItemGoodsInfo && item.giftItemGoodsInfo.length > 0 ? '更换赠品' : '领赠品')
        } else if (status === 2) {
            return difference > 0 ? ADD_ON_ITEM : (item.giftItemGoodsInfo && item.giftItemGoodsInfo.length > 0 ? '重新换购' : '去换购')
        }
    }

    jumpActivity(item, skuIndex) {
        let showGiftsInfo = this.giftJumpTip(item) !== ADD_ON_ITEM ? 1 : 0;
        let { skuList } = this.state;
        let giftsItemGoodsIds = item.giftItemGoodsInfo && item.giftItemGoodsInfo.length > 0 && item.giftItemGoodsInfo.map(i => {
            return i.giftsItemGoodsId
        });
        let selcetedGoodsSkuList = item.goodsList.filter(ii => {
            return ii.selected
        });
        let goodsSkuList = selcetedGoodsSkuList.map(i => {
            return {
                id: i.id,
                price: i.timeLimit ? i.timeLimit.buyPrice : i.priceForSale
            }
        });
        let type = skuList[skuIndex].status;
        let urlObj = {
            giftsItemGoodsIds,
            goodsSkuList
        };
        this.props.history.push('/saleactivity/' + item.activityId + '/' + encodeURIComponent(JSON.stringify(urlObj)) + '/' + type + '/' + showGiftsInfo)
    }

    // goods修改后自动滚动到 goods位置
    autoScrollGoods() {
        let { scrollId } = this.state;
        if (scrollId) {
            let el = document.getElementById(scrollId);
            let distanceY = el.offsetTop;
            let step = 0;
            this.scrollTopTimer = setInterval(() => {
                step += 5;
                if (step >= distanceY) {
                    window.scrollTo(0, distanceY);
                    clearInterval(this.scrollTopTimer)
                } else {
                    window.scrollTo(0, step)
                }
            }, 4)
        }
    }

    isShowGoodsList() {
        let { skuList, noStockGoodsList } = this.state;
        if (skuList && skuList.length > 0) {
            return true
        } else if (noStockGoodsList && noStockGoodsList.length > 0) {
            return true
        } else {
            return false
        }
    }

    currentTimer() {
        if (!this.cartNowTime) return;
        this.cartCurrentTimer = setInterval(() => {
            this.cartNowTime += 1000;
            let goods = this.getAllGoods().filter(i => i.timeLimit);
            if (goods.length === 0) {
                clearInterval(this.cartCurrentTimer)
            } else {
                this.checkLimitGoods(goods)
            }
        }, 1000)
    }

    // 检测限时购商品是否失效
    checkLimitGoods(goods) {
        if (goods && goods.length > 0) {
            let disabled = [];
            goods.forEach(item => {
                if (this.cartNowTime > item.timeLimit.activeTimeEnd) {
                    disabled.push(item.id)
                }
            });
            if (disabled && disabled.length > 0) {
                let { skuList, noStockGoodsList } = this.state;
                skuList.forEach(item => {
                    let goodsList = item.goodsList;
                    for (let i = 0; i < goodsList.length; i++) {
                        let index = disabled.indexOf(goodsList[i].id);
                        if (index >= 0) {
                            noStockGoodsList = (noStockGoodsList && noStockGoodsList.length > 0) ? noStockGoodsList : [{ status: 0, goodsList: [] }]
                            noStockGoodsList[0].goodsList.unshift(goodsList[i]);
                            goodsList.splice(i, 1);
                            i--
                        }
                    }
                });
                // console.log('nostockgoods', noStockGoodsList)
                this.setState({
                    skuList, noStockGoodsList
                })

            }
        }
    }

    render() {
        let { loading, skuList, editing, selectedDistrict, alertMessage, confirm, total, showCouponGetList, couponIdList, showPromotion, doubleBtn, title, singleGoodsInfo, noStockGoodsList } = this.state;
        let { match } = this.props;
        let editStyle = {
            basic: { border: '1px solid #ddd' },
            active: { border: '1px solid #ff4242', color: '#ff4242' }
        };
        const selStyle = {
            sel: { backgroundImage: 'url(' + Float + ')' },
            unSel: { backgroundImage: 'url(' + Circle + ')' }
        };
        const activityIcon = {
            1: Group,
            2: AddPrice
        };
        const GoodsItem = ({ sku, skuIndex }) => {
            let classNames = ['cart-item'];
            sku.disabled && classNames.push('disabled');
            let maxNumber = sku.timeLimit ? sku.timeLimit.buyNumber : sku.maxNumber;
            let priceForSale = sku.timeLimit ? sku.timeLimit.buyPrice : sku.priceForSale;
            return (
                <div id={sku.id}>
                    <div className={classNames.join(' ')} onClick={() => {
                        this.clickSku(sku, skuList, skuIndex)
                    }}>
                        <div className="cart-check"
                            style={{ backgroundImage: 'url(' + (sku.selected ? imageChecked : imageUnchecked) + ')' }} />
                        <div className="cart-img" style={{ backgroundImage: 'url(' + sku.logo + ')' }} />
                        {
                            !editing ?
                                <div>
                                    <h6 className="two-txt">
                                        {sku.timeLimit && <span className='limit-buy-img' />}
                                        {sku.name}
                                    </h6>
                                    <label>
                                        {sku.propertyItems.reduce((a, b) => a + ' ' + b)}
                                        <em> &times;{sku.number}</em>
                                    </label>
                                    <div className='cart-item-info'>
                                        <em className='f28 color-main'>&yen;</em>
                                        <span className="f28 color-main">{priceForSale.toFixed(2)}</span>
                                        {
                                            sku.timeLimit && <span className="f28 color-main fr">限购{sku.timeLimit.maxNumber}件(已购{sku.timeLimit.alreadyBuyNumber}件)</span>
                                        }
                                    </div>
                                </div> :
                                <div className='fl ml16'>
                                    <div className='cart-editing'>
                                        <div className="number-set mb20 mt20">
                                            <a className={sku.number === 1 ? 'disabled' : ''} onClick={e => {
                                                e.stopPropagation();
                                                if (sku.number > 1) {
                                                    sku.number--;
                                                }
                                                this.setState({ skuList: skuList });
                                                CartStore.updateSku(sku.id, sku.number);
                                            }}>-</a>
                                            <a>{sku.number}</a>
                                            <a
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    let number = sku.number;
                                                    if (number++ >= maxNumber) {
                                                        this.setState({
                                                            alertMessage: `最大购买数为${maxNumber}`
                                                        })
                                                    } else {
                                                        sku.number++;
                                                        this.setState({ skuList: skuList });
                                                        CartStore.updateSku(sku.id, sku.number);
                                                    }

                                                }}>+</a>
                                        </div>
                                        <div className='f26 color-000'>
                                            {sku.propertyItems.reduce((a, b) => a + ' ' + b)}
                                            <em className='f26 color-999'> &times;{sku.number}</em>
                                        </div>
                                        <p className='f28 color-main mt20'>
                                            <em className='f24 color-main'>&yen;</em>
                                            {priceForSale.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                        }
                        {
                            editing && <div className='cart-editing-del' onClick={(e) => this.singleDel(e, sku)}>
                            </div>
                        }
                        {
                            sku.disabled &&
                            <div className="not-supported">
                                此商品暂不支持配送到{selectedDistrict.name}
                            </div>
                        }
                        {/*显示单赠品信息*/}
                        {(sku.activityGiftList != null || sku.giftCouponMappingList !=null) &&
                        <div className='complimentaryGoods'>
                            <div className='complimentaryTitle'>
                                赠品
                            </div>
                            <div className='complimentaryList'>
                                <ul>
                                    {sku.activityGiftList.map(a => {
                                        return(
                                            <li>
                                                <span><label>{a.goodsName}</label><em> × {sku.number}</em></span>
                                            </li>
                                        )
                                    })}
                                    {sku.giftCouponMappingList.map(a => {
                                        return (
                                            <li>
                                                <span><label>{a.couponName}</label><em> × {sku.number}</em></span>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                        </div>
                        }
                    </div>
                    {
                        sku.activityList && sku.activityList.length > 1 && <div className="item-foot">
                            <span className="inline-block-middle f24 color-fff">促销</span>

                            <span className="inline-block-middle f24 color-fff ml30 one-txt" style={{ width: '5rem' }}>
                                {
                                    sku.activityList.map(a => {
                                        if (a.giftsId === sku.activityId) {
                                            return a.giftsItems.map(r => {
                                                return `满${r.conditionPrice}可${a.status === 1 ? '领取赠品' : '换购商品'}`
                                            }).toString()
                                        }
                                    })
                                }
                            </span>
                            <span className="inline-block-middle f24 color-fff fr" onClick={() => {
                                this.setState({
                                    showPromotion: true,
                                    changeSkuIndex: skuIndex,
                                    singleGoodsInfo: sku
                                })
                            }}>
                                修改
                            </span>
                        </div>
                    }

                </div>

            )
        };
        const NoStockGoodsItem = ({ sku }) => {
            let priceForSale = sku.timeLimit ? sku.timeLimit.buyPrice : sku.priceForSale;
            return (
                <div id={sku.id}>
                    <a className='cart-item' style={{ backgroundColor: '#f9f9f9' }}>
                        <div className='cart-check'>
                            <span className='no-stock-title f20 color-fff'>
                                {sku.timeLimit ? '失效' : '缺货'}
                            </span>
                        </div>
                        <div className="cart-img" style={{ backgroundImage: 'url(' + sku.logo + ')' }} />
                        <div>
                            <h6 className="color-999">
                                {sku.timeLimit && <div className='limit-buy-img' />}
                                {sku.name}</h6>
                            <label className="color-999">
                                {sku.propertyItems.reduce((a, b) => a + ' ' + b)}
                                {
                                    !sku.stock < 1 && <em> &times;{sku.number}</em>
                                }

                            </label>
                            <div className='cart-item-info color-999'>
                                <em className='f28 color-999'>&yen;</em>
                                {priceForSale.toFixed(2)}
                            </div>
                        </div>
                    </a>

                </div>

            )
        };
        const GiftItem = (({ sku, skuIndex, giftIndex }) => {
            let goodsSku = sku.goodsSku;
            let { skuList } = this.state;
            let itemStatus = skuList[skuIndex].status;
            // console.log(sku, skuIndex, giftIndex, itemStatus)
            return (
                <a className="cart-item">
                    <div className="cart-check">
                        {itemStatus === 1 && <span className={`cart-item-icon one-el-middle`}></span>}
                    </div>
                    <div className="cart-img" style={{ backgroundImage: 'url(' + goodsSku.pictureUrl + ')' }} />
                    <div>
                        <h6>
                            {itemStatus === 2 && <span><img src={activityIcon[2]} className="item-head-img inline-block-middle" alt='' />&nbsp;</span>}
                            {goodsSku.name}
                        </h6>
                        <label>
                            {goodsSku.propertyItems.reduce((a, b) => a + ' ' + b)}
                            <em> &times;1</em>
                        </label>
                        <div className='cart-item-info'>
                            <em className='color-main f28'>&yen; {itemStatus === 2 ? sku.addPrice : '0.00'}</em>
                        </div>
                    </div>
                    {
                        editing && <div className='cart-editing-del' onClick={(e) => this.delGift(e, skuIndex, giftIndex)}>
                        </div>
                    }
                </a>
            )
        });

        return (
            <div className="cart-root">
                {!this.isChildRoute() &&
                    <div className="Cart">
                        {this.isShowGoodsList() &&
                            <div>
                                <a className="cart-location" style={{ backgroundImage: 'url(' + imagePath + ')' }} onClick={() => Screen.selectDistrict(this.selectDistrict)}>
                                    <label style={{ backgroundImage: 'url(' + imageLocation + ')' }}>
                                        {selectedDistrict ? ('送至：' + selectedDistrict.name) : '请选择收货地区'}
                                    </label>
                                </a>
                                <div className="cart-list">
                                    <div className="cart-header">
                                        <a className="check-all" style={{ backgroundImage: 'url(' + (this.isAllSelected() ? imageChecked : imageUnchecked) + ')' }} onClick={e => {
                                            this.toggleAll()
                                            this.checkActivity()
                                        }}></a>
                                        <span>购物车（{this.getAllGoods().filter(ff => ff.selected).length}）</span>
                                        {couponIdList &&
                                            <a className="cart-coupons fr color-main" onClick={this.fetchCoupons}>优惠券领取</a>}
                                    </div>
                                    <div className="cart-items">
                                        {
                                            skuList && skuList.map((items, index) => {
                                                let goodsList = items.goodsList;
                                                return (
                                                    <div key={'group' + index}>
                                                        {
                                                            ACTIVITY_STATUS.indexOf(items.status) !== -1 && <div className="item-head">
                                                                <img
                                                                    src={activityIcon[items.status]}
                                                                    style={items.status === 2 ? { width: '.82rem' } : {}} className="item-head-img inline-block-middle" alt='' />
                                                                <span className="inline-block-middle ml30 f28">{items.giftHeadTip}</span>
                                                                <span className="inline-block-middle fr f28 color-main" onClick={() => this.jumpActivity(items, index)}>{this.giftJumpTip(items)}
                                                                    <span className="icon-red-r-arrow ml10" /></span>
                                                            </div>
                                                        }
                                                        {goodsList.map((sku, i) => {
                                                            return <GoodsItem sku={sku} skuIndex={index} key={sku.id} />
                                                        })
                                                        }
                                                        {
                                                            ACTIVITY_STATUS.indexOf(items.status) !== -1 &&
                                                            <div>
                                                                {
                                                                    items.giftItemGoodsInfo && items.giftItemGoodsInfo.map((item, i) => {
                                                                        return (
                                                                            <GiftItem sku={item} skuIndex={index} giftIndex={i} key={item.goodsSkuId} />
                                                                        )
                                                                    })
                                                                }
                                                            </div>
                                                        }
                                                    </div>
                                                )
                                            })
                                        }
                                        {
                                            noStockGoodsList && noStockGoodsList.length > 0 &&
                                            <div>
                                                <div style={{ height: '.18rem', backgroundColor: '#f9f9f9' }}></div>
                                                <div className='no-stock-txt clearfix'>
                                                    <span className="icon-warn fl" />
                                                    <span className="fl f24 color-333">
                                                        当前有{noStockGoodsList[0].goodsList.length}件商品缺货或失效
                                                    </span>
                                                    <span className="fr clear-no-stock f24" onClick={() => {
                                                        noStockGoodsList[0].goodsList.forEach(item => CartStore.removeSku(item.id))
                                                        this.setState({
                                                            noStockGoodsList: null
                                                        })
                                                    }}>清空失效商品</span>
                                                </div>
                                                {
                                                    noStockGoodsList[0].goodsList.map((sku, i) => {
                                                        return <NoStockGoodsItem sku={sku} key={'noStock' + i} />
                                                    })
                                                }

                                            </div>
                                        }
                                    </div>
                                </div>
                                <FixedBottom>
                                    <div className="cart-selection">
                                        <a className="cart-edit f28 color-000 ml30" onClick={this.toggleEditing} style={editing ? editStyle.basic : editStyle.active}>{editing ? '完成' : '编辑'}</a>
                                        {editing &&
                                            <a className="delete" onClick={this.del}>删除商品</a>
                                        }
                                        {editing &&
                                            <a className="favourite" onClick={this.favourite}>移入收藏</a>
                                        }
                                        {!editing &&
                                            <label className="cart-price">
                                                商品总额：<em>&yen; {total.toFixed(2)}</em>
                                            </label>
                                        }
                                        {!editing &&
                                            <a className="confirm" onClick={this.confirm}> 结算（{this.getValidSkuList().length}）</a>
                                        }
                                    </div>
                                </FixedBottom>
                            </div>
                        }
                        {(!skuList || skuList.length === 0) &&
                            <div className="empty" style={{ backgroundImage: 'url(' + imageEmptyCart + ')' }}>
                                购物车中暂无商品
                            </div>
                        }

                        <FixedBottom>
                            <TabBar />
                        </FixedBottom>
                    </div>
                }
                <TransitionGroup>
                    {(showCouponGetList || showPromotion) &&
                        <Fade >
                            <Mask
                                style={{ zIndex: 2 }}
                                onClick={() => {
                                    this.setState({
                                        showCouponGetList: undefined,
                                        showPromotion: false
                                    });
                                }} />
                        </Fade>
                    }
                    {loading &&
                        <Fade>
                            <FullScreenLoading />
                        </Fade>
                    }
                    {alertMessage &&
                        <Fade timeout={0}>
                            <Alert
                                message={alertMessage}
                                onClose={() => this.setState({ alertMessage: undefined, doubleBtn: null })}
                                title={title}
                                doubleBtn={doubleBtn}
                            />
                        </Fade>
                    }
                    {confirm &&
                        <Fade>
                            <Confirm title={confirm.title} message={confirm.message} onConfirm={confirm.onConfirm} onCancel={confirm.onCancel} />
                        </Fade>
                    }

                    {showCouponGetList &&
                        <SlideBottom>
                            <MessageBottom
                                title={'领优惠券'}
                                onClose={() => this.setState({ showCouponGetList: undefined })}
                                onConfirm={() => this.setState({ showCouponGetList: undefined })}
                                leftTitle={true}
                                hideBtn={true}
                            >
                                <CouponGetList couponIdList={couponIdList} />
                            </MessageBottom>
                        </SlideBottom>
                    }
                    {showPromotion &&
                        <SlideBottom>
                            <MessageBottom
                                title={'修改促销'}
                                onClose={() => this.setState({ showPromotion: false })}
                                onConfirm={() => this.setState({ showPromotion: false })}
                                leftTitle={true}
                                hideBtn={true}
                            >
                                <ul>
                                    {
                                        singleGoodsInfo.activityList.map((p, i) => {
                                            return (
                                                <li className="promotion" key={p.giftsId} onClick={() => {
                                                    this.selActivity(p)
                                                }}>
                                                    <div className="inline-block-middle promotion-sel-img" style={singleGoodsInfo.activityId === p.giftsId ? selStyle.sel : selStyle.unSel}></div>
                                                    <p className={`f32 inline-block-middle ${singleGoodsInfo.activityId === p.giftsId ? 'color-main' : 'color-000'} ml10`} style={{ width: '6rem' }}>
                                                        {p.giftsItems.map(pp => {
                                                            return (
                                                                `满${pp.conditionPrice}元可${p.status === 1 ? '领取赠品' : '换购商品'}`
                                                            )
                                                        }).toString()}
                                                    </p>
                                                </li>
                                            )
                                        })
                                    }

                                </ul>
                            </MessageBottom>
                        </SlideBottom>
                    }
                </TransitionGroup>
                <Route path={match.url + '/confirm/:data'} component={OrderConfirm} />
            </div>
        );
    }
}
const ACTIVITY_STATUS = [1, 2];// 1: 满赠  2: 换购  3: 满减(未开发)    0:普通商品
const ADD_ON_ITEM = '去凑单';
export default Cart;