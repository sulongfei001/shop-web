import './GoodsDetails.css';
import React from 'react';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import { Link, Route } from 'react-router-dom';
import Fade from "../../ui/Fade/Fade";
import Swipe from "../../ui/Swipe/Swipe";
import imageArrowRight from './arrow-right.png';
import imageChecked from './checked.png';
import imageFavour from './favourite.png';
import imageFavourActive from './favouriteActive.png';
import imageHome from './tabbar_icon_home@2x.png'
import imageBag from '../../ui/TabBar/cart.png';
import imageArrowDown from './arrow-down.png';
import LazyLoadImg from "../../ui/LazyLoadImg/LazyLoadImg";
import Animate from "../../utils/Animate";
import SlideBottom from "../../ui/SlideBottom/SlideBottom";
import Mask from "../../ui/Mask/Mask";
import Screen from "../../utils/Screen";
import MessageBottom from "../../ui/MessageBottom/MessageBottom";
import Alert from "../../ui/Alert/Alert";
import Common from '../../utils/Common'
import FixedTop from "../../ui/FixedTop/FixedTop";
import FixedBottom from "../../ui/FixedBottom/FixedBottom";
import FullScreenLoading from "../../ui/FullScreenLoading/FullScreenLoading";
import GoodsComment from "./GoodsComment";
import Cart from "../Home/Cart";
import GoodsApi from "../../api/GoodsApi";
import UserContext from "../../model/UserContext";
import FollowApi from "../../api/FollowApi";
import Page from "../../ui/Page/Page";
import Share from "../../utils/Share";
import CouponGetList from '../Coupons/Common/CouponGetList'
import PageRoot from "../../ui/PageRoot/PageRoot";
import OrderConfirm from '../Order/OrderConfirm'
import ActivityApi from '../../api/ActivityApi'
import Group from '../Activity/SaleActivity/img/Group@3x.png'
import AddPrice from '../Activity/SaleActivity/img/AddPrice@2x.png'
import complimentary from '../Activity/SaleActivity/img/complimentaryIcon.png'
import vipIconMark from '../Activity/SaleActivity/img/icon_mark_vip2.png'
import Golden from './bar_golden@2x.png'
import Red from './bar_red@2x.png'
import Sku from '../../ui/Sku/sku'
class GoodsDetails extends Page {
    constructor(props) {
        super(props);
        this.tabScroll = this.tabScroll.bind(this);
        this.mainPropertyClick = this.mainPropertyClick.bind(this);
        this.selectTransportDistrict = this.selectTransportDistrict.bind(this);
        this.districtSelected = this.districtSelected.bind(this);
        this.toggleFavour = this.toggleFavour.bind(this);
        this.recommend = this.recommend.bind(this);
        this.loadGoods = this.loadGoods.bind(this);
        this.tabClick = this.tabClick.bind(this);
        this.showGetCoupon = this.showGetCoupon.bind(this);
        this.checkBanner = this.checkBanner.bind(this);
        this.videoPlay = this.videoPlay.bind(this);
        this.selPromotion = this.selPromotion.bind(this);
        this.initPromotionRule = this.initPromotionRule.bind(this);
        this.jumpHome = this.jumpHome.bind(this);
        this.jumpCart = this.jumpCart.bind(this);
        this.closeSkuSelect = this.closeSkuSelect.bind(this);
        this.checkVirtual = this.checkVirtual.bind(this);
        this.selGoodsDetails = this.selGoodsDetails.bind(this);
        this.state = {
            tab: {
                show: false
            },
            loading: true,
            url: props.match.url,
            virtualText: null
        };
        this.animate = new Animate();
    }

    componentDidMount() {
        window.addEventListener("scroll", this.tabScroll);
        let goodsId = this.props.match.params.id;
        this.loadGoods(goodsId);
        Screen.scrollToTop();
        let promotionEl = document.getElementsByClassName('promotion-index-root')[0];
        promotionEl && (promotionEl.style.display = 'none')
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.tabScroll);
        this.animate.dispose();
        clearInterval(this.countDownTimer)
        clearInterval(this.limitBuyBeginTimer)
        clearTimeout(this.virtualTimer)

        let promotionEl = document.getElementsByClassName('promotion-index-root')[0];
        promotionEl && (promotionEl.style.display = 'block')
    }

    loadGoods(goodsId, whetherDot) {
        let userContext = UserContext.get();
        GoodsApi.goodsGet({
            goodsId: goodsId,
            accessToken: userContext.userToken
        }, data => {
            let { favourite, goods, goodsProperties, goodsSkus, serviceTags, transportRule, commentsInfo, recommendGoodsList, goodsParameters, goodsMainProperties, couponInfoList, giftsInfoList, giftsInfoTwoList, now, activityGiftList, giftCouponMappingList } = data;
            let { picturePolling, vedioPolling, pictureDetails, vedioDetails, virtualFlag, virtualEndDate, virtualStartDate } = goods
            let goodsVideo = {
                picturePolling, vedioPolling, pictureDetails, vedioDetails
            };
            this.currentTime = now; //  服务器 时间
            let goodsDetails = {
                goodsProperties,
                goodsSkus,
                goodsMainProperties,
                goodsId: +goodsId,
                name: goods.name,
                subtitle: goods.subtitle,
                isVirtual: {
                    flag: virtualFlag,
                    eTime: virtualEndDate,
                    sTime: virtualStartDate
                },
                properties: goodsProperties.map(p => {
                    return {
                        name: p.displayName,
                        items: p.propertyItems.map(i => {
                            let item = {
                                id: i.propertyItemId,
                                name: i.itemValue
                            };
                            let mainItems = goodsMainProperties.filter(p => p.propertyItemId === item.id);
                            if (mainItems.length > 0) {
                                item.logo = mainItems[0].picture;
                                item.pictures = mainItems[0].pictureList;
                                item.originalPictures = mainItems[0].originalPictureList;
                            }
                            return item;
                        })
                    };
                }),
                skuList: goodsSkus.map(s => {
                    return {
                        goodsId: +goodsId,
                        id: s.goodsSkuId,
                        itemIds: [s.propertyItemId1, s.propertyItemId2, s.propertyItemId3, s.propertyItemId4].filter(i => i > 0),
                        price: s.price,
                        salePrice: s.priceForSale,
                        maxBuy: s.maxNumber,
                        stock: s.stock,
                        timeLimit: s.timeLimit
                    };
                }),
                serviceTags: serviceTags.map(t => {
                    return {
                        name: t.name,
                        description: t.remark
                    };
                }),
                transportRule: {
                    departureDistrict: transportRule.departureDistrict,
                    type: transportRule.type,
                    freeFreightPrice: transportRule.freeFreightPrice,
                    rules: transportRule.transportRuleItems.map(r => {
                        console.log(transportRule)
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
                totalComments: commentsInfo.totalComments,
                comments: commentsInfo.commentsList.map(c => {
                    return {
                        avatar: c.avatar,
                        nickname: c.userName,
                        content: c.content,
                        pictures: c.pictureList
                    };
                }),
                recommends: recommendGoodsList.map(g => {
                    return {
                        id: g.goodsId,
                        cover: g.pictureUrl,
                        name: g.name,
                        priceForSale: g.priceForSale
                    };
                }),
                parameters: goodsParameters.map(p => {
                    return {
                        name: p.displayName,
                        value: p.parameterValue
                    };
                }),
                moreParameter: false,
                pictures: goods.pictureList,
                selectedItems: [],
                isFavourite: favourite,
                loading: false,
                goodsVideo
            };
            if (giftsInfoTwoList && giftsInfoTwoList.length > 0) {
                goodsDetails.giftsInfoTwoList = giftsInfoTwoList.toString()

            }
            if (couponInfoList && couponInfoList.length > 0) {
                goodsDetails.couponInfoList = couponInfoList;
                goodsDetails.couponId = [Number(goodsDetails.goodsId)]
            }
            if (activityGiftList && activityGiftList.length > 0){
                goodsDetails.activityGiftList = activityGiftList[0].goodsName.toString()
            }
            if (giftCouponMappingList && giftCouponMappingList.length > 0){
                goodsDetails.giftCouponMappingList = giftCouponMappingList.toString()
            }
            if (giftsInfoList && giftsInfoList.length > 0) {
                goodsDetails.giftsInfoList = giftsInfoList.toString()
            }
            goodsDetails.properties.forEach(() => {
                goodsDetails.selectedItems.push(undefined)
            });
            goodsDetails.transportRule.selIndex = 0;
            goodsDetails.mainItemId = goodsDetails.properties[0].items[0].id;
            goodsDetails.loading = false;

            this.setState(goodsDetails, () => {
                let { isVirtual } = goodsDetails
                isVirtual.eTime && isVirtual.flag === 2 && this.checkVirtual(isVirtual)
                this.isBeginLimitBuy()
                // this.defaultSel()
            })
            Share.prepare({
                enabled: true,
                title: goodsDetails.name,
                content: goodsDetails.subtitle,
                url: 'https://shop.yiyayiyawao.com/?from=singlemessage&isappinstalled=0#/goods/details/' + goodsDetails.goodsId,
                logo: goodsDetails.properties[0].items[0].logo,
            });
            if (!whetherDot) {
                window.MtaH5.clickStat('click_goods', { 'name': goods.name });
            }
        }, error => {
            this.setState({
                alertMessage: error
            });
        });
    }

    // 虚拟商品库存判断
    checkVirtual(data) {
        let { eTime, sTime } = data
        if (this.currentTime >= eTime) {
            console.log('终结')
            this.setState({
                virtualText: '活动结束'
            });
            clearTimeout(this.virtualTimer)
        } else {
            this.virtualTimer = setTimeout(() => {
                this.currentTime += 1000
                this.checkVirtual(data)
            }, 1000)
        }
    }

    mainPropertyClick(itemId) {
        this.setState({
            mainItemId: itemId
        });
    }

    rule2Name(rule) {
        let type = this.state.transportRule.type;
        if (rule.firstPrice === 0 && rule.addPrice === 0) return '免运费';
        return rule.firstNumber + (type === 1 ? '件' : '公斤') + '以内' + rule.firstPrice + '元';
    }

    rule2Details(rule) {
        let type = this.state.transportRule.type;
        let unit = type === 1 ? '件' : '公斤';
        let details = [];
        details.push(rule.firstNumber + unit + '以内' + rule.firstPrice + '元');
        details.push('每增加' + rule.addNumber + unit + '加收' + rule.addPrice + '元');
        details.push('每个包裹最多' + rule.maxNumber + unit);
        return details;
    }

    tabScroll() {
        if (this.stopTabScroll !== true && this.state.name && !this.isChildRoute()) {
            let { tab } = this.state;
            tab.show = Screen.scrollTop() > this.firstLine.offsetTop - 150;
            if (Screen.scrollTop() > this.detailsLine.offsetTop - 50) {
                tab.index = 2;
            } else if (Screen.scrollTop() > this.commentLine.offsetTop - 50) {
                tab.index = 1;
            } else {
                tab.index = 0;
            }
            this.setState({
                tab: tab
            });
        }
    }

    tabClick(index) {
        let { tab } = this.state;
        if (index !== tab.index) {
            tab.index = index;
            let offsetTop;
            switch (index) {
                case 0:
                    offsetTop = this.firstLine.offsetTop - 30;
                    break;
                case 1:
                    offsetTop = this.commentLine.offsetTop - 30;
                    break;
                case 2:
                    offsetTop = this.detailsLine.offsetTop - 30;
                    break;
                default:
                    offsetTop = 0;
                    break;
            }
            let component = this;
            component.stopTabScroll = true;
            this.setState({
                tab: tab
            });
            if (Screen.scrollHeight() - Screen.availHeight() < offsetTop) {
                offsetTop = Screen.scrollHeight() - Screen.availHeight();
            }
            this.animate.start(Screen.documentElement(), { scrollTop: offsetTop }, 100, () => component.stopTabScroll = false);
        }
    }

    selectTransportDistrict() {
        Screen.selectDistrict(this.districtSelected);
    }

    districtSelected(district, parentDistricts) {
        let { transportRule } = this.state;
        let ruleDistrictIds = transportRule.rules.map(rule => rule.districtId);
        let selIndex = ruleDistrictIds.indexOf(district.id);
        let id;
        while (selIndex < 0 && parentDistricts.length > 0) {
            id = parentDistricts.shift().id;
            selIndex = ruleDistrictIds.indexOf(id);
        }
        transportRule.selIndex = selIndex < 0 ? 0 : selIndex;
        this.setState({
            selectDistrict: undefined,
            transportRule: transportRule,
            selectedDistrict: district
        });
    }

    closeSkuSelect() {
        this.setState({
            selectSku: undefined,
        })
    }

    toggleFavour() {
        let { history, match } = this.props;
        console.log('收藏')
        if (UserContext.isLoggedIn(history, match)) {
            let { isFavourite } = this.state;
            let userContext = UserContext.get();
            this.setState({
                loading: false
            }, () => {
                let request = {
                    accessToken: userContext.userToken,
                    goodsIds: [match.params.id]
                };
                let apiDelegate = isFavourite === true ? FollowApi.goodsUnfollow : FollowApi.goodsFollow;
                apiDelegate(request, data => {
                    this.setState({
                        isFavourite: !isFavourite,
                        loading: false
                    });
                }, error => {
                    this.setState({
                        loading: false,
                        alertMessage: error
                    });
                });
            });
        }
    }

    checkBanner() {
        let { properties, mainItemId, goodsVideo } = this.state
        let { picturePolling, vedioPolling } = goodsVideo
        let itemArr = properties[0].items.filter(item => item.id === mainItemId)
        let pic = itemArr.map(item => {
            let array = [];
            if (item.pictures) {
                for (let i = 0; i < item.pictures.length; i++) {
                    array.push({
                        pic: item.pictures[i],
                        picRaw: item.originalPictures[i]
                    });
                }
            }
            return array;
        })[0]
        if (vedioPolling && picturePolling) {
            pic.unshift({ pic: picturePolling, video: vedioPolling, isVideo: true })
        }
        return pic
    }

    recommend(goodsId) {
        this.setState({
            loading: true
        });
        let whetherDot = false;
        this.loadGoods(goodsId, whetherDot);
        Screen.scrollToTop();
    }

    // 判断用户登陆
    checkLogin() {
        const { history, match } = this.props
        return UserContext.isLoggedIn(history, match)
    }

    // 展示领券列表
    showGetCoupon() {
        this.checkLogin() && this.setState({ showCouponGetList: true })
    }

    // video Play
    videoPlay() {
        let el = document.getElementById('goodsVideo')
        el.play()
    }

    // 获取点击促销信息
    selPromotion(item) {
        /**
        * 促销状态：1.满赠；2.换购；3.满减
        */
        this.setState({
            showPromotion: false
        }, () => this.props.history.push('/saleactivity/' + item.giftsId + '/' + null + '/' + item.status + '/0'))
    }

    //赠品点击跳转详情页
    selGoodsDetails(item){
        this.setState({
            showPromotion: false
        },() => {
            this.props.history.push('/home/goods/details/' + item.id);
            window.location.reload();
        });


    }

    // 获取促销规则
    initPromotionRule() {
        let userContext = UserContext.get();
        let { goodsId } = this.state
        let body = {
            accessToken: userContext.userToken,
            goodsId: +goodsId
        }
        ActivityApi.rule(body, data => {
            this.setState({
                promotionRuleList: data.giftsList,
                activityComplimentaryList: data.activityComplimentaryList,
                ruleLoading: false
            })
        }, error => {
            this.setState({
                alertMessage: error,
                ruleLoading: false
            })
        })
    }

    isBeginLimitBuy() {
        let { skuList } = this.state
        let timeLimitList = skuList.map(s => s.timeLimit).filter(i => i)
        if (!timeLimitList.some(i => i)) return console.warn('不存在限时购')

        // 已开始活动 ＞ 预告活动 ＞ 未开始活动
        let isBegin = timeLimitList.some(t => t.status === 3)

        // 进行中活动 生效时间按近及远排序
        let timeList = timeLimitList.filter(t => t.status === 3).sort((a, b) => {
            return a.activeTimeStart - b.activeTimeStart
        });

        console.log('startList', timeList)

        // 预告中活动 时间按近及远排序
        let beforeTimeList = timeLimitList.filter(t => t.status === 2).sort((a, b) => {
            return a.beforeTime - b.beforeTime
        });

        if (isBegin) {
            // 有活动开始,且正在进行中
            for (let i = 0, len = timeList.length; i < len; i++) {
                let item = timeList[i]
                if (this.isLimitIng(item.activeTimeStart, item.activeTimeEnd)) {
                    let time = Common.addition(Common.addition(item.activeTimeEnd, this.currentTime), 1000)
                    return time > 1000 ? this.currentCountDown(time) : console.warn('离截至时间不到1000ms, 不予显示')
                } else {
                    console.warn(i + '活动已经结束')
                }
            }

        } else {
            // 只有预告
            this.limitBuyBeginTimer = setInterval(() => {
                this.currentTime += 1000
                if (timeList && timeList.length > 0 && this.currentTime >= timeList[0].activeTimeStart) {
                    console.log('进入活动开始')
                    clearInterval(this.limitBuyBeginTimer)
                    this.setLimitStatus()
                }
            }, 1000)
            this.setState({
                showLimitBuy: true,
                beforeTime: beforeTimeList[0].activeTimeStart,
                limitPriceText: this.setLimitPriceText(),
                countDownTotal: beforeTimeList[0].buyNumber,
            })
        }
    }

    // 倒计时
    currentCountDown(time) {
        let countDownText, limitPriceText, countDownTotal
        let num = 0;
        this.countDownTimer = setInterval(() => {
            num++;
            if (num === 1) {
                limitPriceText = this.setLimitPriceText()
                countDownTotal = this.setLimitBuyTotal()
                this.setState({
                    limitPriceText,
                    countDownTotal
                })
            }
            time -= 1000;
            this.currentTime += 1000;
            countDownText = Common.toHDMS(time, true)
            this.setState({
                countDownText: countDownText ? countDownText.split(':') : false,
                showLimitBuy: countDownText
            }, () => {
                if (!countDownText) {
                    clearInterval(this.countDownTimer)
                    this.setLimitStatus()
                }
            })
        }, 1000)
    }

    // 限时购价格显示
    setLimitPriceText() {
        let { skuList } = this.state;
        let list = skuList.map(i => {
            return i.timeLimit ? i.timeLimit.buyPrice : i.salePrice
        }).sort();
        list = Array.from(new Set(list));
        this.setState({
            isLimitTip: list.length > 1
        });
        return list[0]
    }

    // 限时购   最大限购件数
    setLimitBuyTotal() {
        let { skuList } = this.state;
        let ing = skuList.filter(i => i.timeLimit && i.timeLimit.status === 3).sort((a, b) => {
            return a.activeTimeStart - b.activeTimeStart
        });
        let total;
        ing.forEach(item => {
            if (this.currentTime > item.timeLimit.activeTimeStart && this.currentTime < item.timeLimit.activeTimeEnd) {
                total = item.timeLimit.maxNumber
            }
        });
        return total
    }

    // 预告时间截止 检查是否有活动需要开始, 需要则改变 status
    setLimitStatus() {
        let { skuList } = this.state;
        skuList.forEach(item => {
            if (item.timeLimit && this.currentTime >= item.timeLimit.activeTimeStart && this.currentTime < item.timeLimit.activeTimeEnd) {
                item.timeLimit.status = 3
            } else {
                item.timeLimit = null
            }
        });
        this.setState({ skuList }, () => {
            console.log('预告时间截止, 检测遍历状态,再次检测是否有其他进行中或预告的限时购')
            this.isBeginLimitBuy()
        })
    }

    // 活动是否在进行中
    isLimitIng(s, e) {
        return s <= this.currentTime && this.currentTime < e
    }

    jumpHome() {
        this.props.history.push('/home')
    }

    jumpCart() {
        let { match } = this.props;
        let url = match.url + '/cart';
        this.props.history.push(url)
    }
    render() {
        let {
            goodsId,
            properties, skuList, name, subtitle, transportRule, serviceTags, comments, mainItemId,
            totalComments, recommends, parameters, pictures, tab, moreParameter,
            isFavourite, loading, selectedDistrict,
            showRuleDetails, showServiceTagDetails, selectSku, alertMessage, showCouponGetList, couponInfoList, couponId, goodsVideo,
            showPromotion, ruleLoading, promotionRuleList, giftsInfoList, giftsInfoTwoList, countDownText, showLimitBuy, beforeTime, activityGiftList, giftCouponMappingList, activityComplimentaryList,
            limitPriceText, isLimitTip, countDownTotal, goodsProperties, goodsSkus, goodsMainProperties, virtualText
        } = this.state;
        let pictureDetails;
        let vedioDetails;
        // 详情视频
        if (goodsVideo) {
            pictureDetails = goodsVideo.pictureDetails;
            vedioDetails = goodsVideo.vedioDetails
        }
        let { match } = this.props;
        let mainProperty = this.state.properties ? this.state.properties[0] : undefined;
        let minPrice;
        let maxPrice;
        let minSalePrice;
        let maxSalePrice;
        let districtIds = transportRule ? transportRule.rules.map(rule => rule.districtId) : [];
        if (districtIds.length === 0) districtIds = undefined;
        let totalStock = 0;
        if (skuList) {
            for (let i = 0; i < skuList.length; i++) {
                let sku = skuList[i];
                minPrice = minPrice ? Math.min(sku.price, minPrice) : sku.price;
                maxPrice = maxPrice ? Math.max(sku.price, maxPrice) : sku.price;
                minSalePrice = minSalePrice ? Math.min(sku.salePrice, minSalePrice) : sku.salePrice;
                maxSalePrice = maxSalePrice ? Math.max(sku.salePrice, maxSalePrice) : sku.salePrice;
                totalStock += sku.stock;
            }
        }
        const activityIcon = {
            group: { backgroundImage: 'url(' + Group + ')',marginLeft: '.15rem'},
            addPrice: { backgroundImage: 'url(' + AddPrice + ')', width: '.82rem',marginLeft: '.15rem'},
            vipIconMark: {backgroundImage: 'url('+vipIconMark+')',width: '1rem',marginLeft: '.15rem'},
            complimentary: {backgroundImage: 'url('+complimentary+')',width: '0.82rem',marginLeft: '.05rem'}
        };
        const limitTimeImg = {
            ed: { backgroundImage: 'url(' + Golden + ')' }, //  未开始
            ing: { backgroundImage: 'url(' + Red + ')' }  // 正在进行中
        };

        return (
            <PageRoot>
                {!this.isChildRoute() &&
                    <div className="GoodsDetails">
                        {(properties && properties.length > 0) &&
                            <Swipe
                                height={'5.67rem'}
                                banners={this.checkBanner()}
                            />
                        }
                        <div className="clear" ref={input => this.firstLine = input} />
                        {
                            showLimitBuy && <div className="limit-buy-root" style={countDownText ? limitTimeImg.ing : limitTimeImg.ed}>
                                <div className="limit-buy-left">
                                    <em className={`f48 inline-block-middle ${countDownText ? 'color-fff' : 'color-golden'}`}>&yen;</em>
                                    <span className={`ml10 f72 inline-block-middle ${countDownText ? 'color-fff' : 'color-golden'}`}>{limitPriceText}
                                        {
                                            isLimitTip && <span className={`f28 ${countDownText ? 'color-fff' : 'color-golden'}`}>起</span>
                                        }
                                    </span>
                                    <div className="ml20 inline-block-middle">
                                        <p className="f20 color-white h20">每人限购{countDownTotal}件</p>
                                        <span className="limit-buy-img" />
                                    </div>
                                </div>
                                {
                                    countDownText ?
                                        <div>
                                            <h1 className="countdown-title">距离结束:</h1>
                                            <div className='countdown'>
                                                {countDownText.length > 3 && <span>{countDownText[0]}</span>}
                                                {countDownText.length > 3 && <span>天</span>}
                                                <span>{countDownText.length > 3 ? countDownText[1] : countDownText[0]}</span>
                                                <span>：</span>
                                                <span>{countDownText.length > 3 ? countDownText[2] : countDownText[1]}</span>
                                                <span>：</span>
                                                <span>{countDownText.length > 3 ? countDownText[3] : countDownText[2]}</span>
                                            </div>
                                        </div>
                                        :
                                        <div className="limit-buy-time">
                                            {Common.limitTime(beforeTime, this.currentTime)}
                                        </div>
                                }

                            </div>
                        }


                        {mainProperty &&
                            <div className="property-select">
                                <div className="property">
                                    <label className="property-name inline-block-middle">{mainProperty.name}</label>
                                    <div className="property-img inline-block-middle">
                                        {mainProperty.items.map(item =>
                                            <a key={item.id} className={item.id === mainItemId ? 'selected' : ''}
                                                onClick={() => this.mainPropertyClick(item.id)}>
                                                {item.logo ? <img src={item.logo} alt="" /> : <span>{item.name}</span>}
                                            </a>
                                        )}
                                    </div>

                                </div>
                            </div>
                        }

                        {name &&
                            <div className="info">
                                {
                                    !countDownText && <div className="price-info">
                                        <span className="sale-price">
                                            {minSalePrice === maxSalePrice ? ('¥' + minSalePrice.toFixed(2)) : ('¥' + minSalePrice.toFixed(2) + '~¥' + maxSalePrice.toFixed(2))}
                                        </span>
                                        <span className="price">
                                            {minPrice === maxPrice ? ('¥' + minPrice.toFixed(2)) : ('¥' + minPrice.toFixed(2) + '~¥' + maxPrice.toFixed(2))}
                                        </span>
                                    </div>
                                }
                                {/*{!countDownText && <div className="vipPrice-info">*/}
                                        {/*<span className="vipSale-price">*/}
                                            {/*{'¥' + minSalePrice.toFixed(2)}*/}
                                        {/*</span>*/}
                                        {/*<span className="promotion-type" style={activityIcon.vipIconMark}></span>*/}
                                    {/*</div>*/}
                                {/*}*/}
                                <h4>{name}</h4>
                                <span className="subtitle">{subtitle}</span>
                            </div>
                        }
                        {
                            (giftsInfoList || giftsInfoTwoList || activityGiftList) && <div
                                className={'activity-info'}
                                onClick={() => {
                                    this.checkLogin() &&
                                        this.setState({
                                            showPromotion: true,
                                            ruleLoading: true
                                        }, () => this.initPromotionRule())
                                }
                                }>
                                <div className="inline-block-middle title">
                                    促销
                                </div>
                                <div className="inline-block-middle content">
                                    {
                                        giftsInfoList && <div className='promotionBox'><p className='one-txt color-000 f24 gifts-info promotion-info'>
                                                {giftsInfoList}
                                            </p>
                                        </div>
                                    }
                                    {
                                        giftsInfoTwoList && <div className='promotionBox'><p className='one-txt color-000 f24 redemption-info promotion-info'>
                                            {giftsInfoTwoList}
                                            </p>
                                        </div>
                                    }
                                    {
                                        activityGiftList &&<div className='promotionBox'><p className='one-txt color-000 f24 complimentary-info promotion-info'>
                                            {activityGiftList}
                                        </p>
                                        </div>
                                    }
                                    <img src={imageArrowRight} alt="" className="activity-arrow inline-block-middle"/>
                                </div>
                            </div>
                        }
                        {transportRule &&
                            <ul className="other-info">
                                {couponInfoList && <li>
                                    <a onClick={this.showGetCoupon}>
                                        <img src={imageArrowRight} alt="" className="arrow" />
                                        <label>领券</label>
                                        <span className='one-txt coupons-type color-main f24'>{couponInfoList.toString().replace(/,/g, ' ')}</span>
                                    </a>
                                </li>}

                                <li>
                                    <a onClick={this.selectTransportDistrict}>
                                        <img src={imageArrowRight} alt="" className="arrow" />
                                        <label>配送</label>
                                        <span>{transportRule.departureDistrict} 至 {selectedDistrict ? selectedDistrict.name : transportRule.rules[transportRule.selIndex].district}</span>
                                    </a>
                                </li>
                                <li>
                                    <a onClick={e => this.setState({ showRuleDetails: true })}>
                                        <img src={imageArrowRight} alt="" className="arrow" />
                                        <label>运费</label>
                                        {transportRule.freeFreightPrice &&
                                            <span><span>满</span><span className="number">{transportRule.freeFreightPrice}</span><span>元免运费</span></span>
                                        }
                                        {!transportRule.freeFreightPrice &&
                                            <span>{this.rule2Name(transportRule.rules[transportRule.selIndex])}</span>
                                        }
                                    </a>
                                </li>
                                <li>
                                    <a className="tags" onClick={e => this.setState({ showServiceTagDetails: true })}>
                                        <img src={imageArrowRight} alt="" className="arrow" />
                                        <label>说明</label>
                                        <div>
                                            {serviceTags.map(tag =>
                                                <span key={tag.name}>
                                                    <img src={imageChecked} alt="" />
                                                    <em>{tag.name}</em>
                                                </span>
                                            )}
                                        </div>
                                    </a>
                                </li>
                            </ul>
                        }
                        <div className="break" ref={input => this.commentLine = input} />
                        {comments &&
                            <div className="comments">
                                <h5>
                                    <Link to={match.url + '/comments/' + goodsId}>
                                        <img src={imageArrowRight} className="arrow" alt="" />
                                        商品评论 （{totalComments}）
                            </Link>
                                </h5>
                                <div className="comment">
                                    <div className="container">
                                        <ul style={{ width: (comments.length * 12.25 + comments.filter(c => c.pictures && c.pictures.length > 0).length * 7.75) * 0.32 + 'rem' }}>
                                            {comments.map((c, i) =>
                                                <li key={i}
                                                    style={{ width: (c.pictures && c.pictures.length > 0 ? 20 : 12.25) * 0.32 + 'rem' }}>
                                                    <img src={c.avatar} alt="" className="avatar" />
                                                    <label className="nickname">{c.nickname}</label>
                                                    {(c.pictures && c.pictures.length > 0) &&
                                                        <img src={c.pictures[0]} alt="" className="pic" />
                                                    }
                                                    <p>{c.content}</p>
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        }
                        <div className="break" />
                        {recommends &&
                            <div className="recommends">
                                <h5>商品推荐</h5>
                                <div className="recommend">
                                    <div className="container">
                                        <ul style={{ width: (recommends.length * 8.3) * 0.32 + 'rem' }}>
                                            {recommends.map(r =>
                                                <li key={r.id}>
                                                    <a onClick={() => this.recommend(r.id)}
                                                        style={{ backgroundImage: 'url(' + r.cover + ')' }}>
                                                        <label>{r.name}</label>
                                                        <span>¥{r.priceForSale.toFixed(2)}</span>
                                                    </a>
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        }
                        <div className="break" ref={input => this.detailsLine = input} />
                        {parameters &&
                            <div className="parameters">
                                <h5>商品详情</h5>
                                {vedioDetails && pictureDetails && <video
                                    id='goodsVideo'
                                    width='100%'
                                    height='200px'
                                    className='goods-video'
                                    src={vedioDetails}
                                    poster={pictureDetails}
                                    playsInline='true'
                                    controls
                                    onClick={() => this.videoPlay()}
                                ></video>}


                                <div className="table-container">
                                    <table>
                                        <tbody>
                                            {parameters.map((p, index) =>
                                                (index < 6 || moreParameter) &&
                                                <tr key={p.name}>
                                                    <td>{p.name}</td>
                                                    <td>{p.value}</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                    {moreParameter !== true && parameters.length > 6 &&
                                        <a className="more-parameter"
                                            onClick={() => this.setState({ moreParameter: !moreParameter })}>
                                            展开
                                            <img src={imageArrowDown} alt="" />
                                        </a>
                                    }
                                </div>
                                <div className="pic-container">
                                    {pictures.map(p =>
                                        <LazyLoadImg key={p} src={p} />
                                    )}
                                </div>
                            </div>
                        }
                        {tab && tab.show === true &&
                            <Fade>
                                <FixedTop>
                                    <div className="tabs" style={{ left: Screen.margin(), right: Screen.margin() }}>
                                        <div className="tab">
                                            <a onClick={() => this.tabClick(0)}>商品</a>
                                        </div>
                                        <div className="tab">
                                            <a onClick={() => this.tabClick(1)}>评价</a>
                                        </div>
                                        <div className="tab">
                                            <a onClick={() => this.tabClick(2)}>详情</a>
                                        </div>
                                        <div className="indicator" style={{ marginLeft: (33.3333 * tab.index) + '%' }} />
                                    </div>
                                </FixedTop>
                            </Fade>
                        }
                        {name &&
                            <FixedBottom>
                                <div className="buttons">
                                    <div className="tab-bar" onClick={this.jumpHome}>
                                        <img src={imageHome} alt="" />
                                        <h1 className='f20 color-333'>首页</h1>
                                    </div>
                                    <div className="tab-bar"
                                        onClick={() => this.toggleFavour()}>
                                        <img src={isFavourite ? imageFavourActive : imageFavour} alt="" />
                                        <h1 className='f20 color-333'>
                                            收藏
                                        </h1>
                                    </div>
                                    <div className="tab-bar" onClick={this.jumpCart}>
                                        <img src={imageBag} alt="" />
                                        <h1 className='f20 color-333'>
                                            购物车
                                        </h1>
                                    </div>
                                    {
                                        virtualText && <a className="stock-out">{virtualText}</a>
                                    }
                                    {totalStock === 0 && !virtualText &&
                                        <a className="stock-out">暂无商品</a>
                                    }
                                    {totalStock > 0 && !virtualText &&
                                        <a className="add-cart" onClick={e => this.setState({ selectSku: ADD_TO_CART })}>
                                            加入购物车
                                        </a>
                                    }
                                    {totalStock > 0 && !virtualText &&
                                        <a className="buy-now" onClick={e => this.setState({ selectSku: BUY_NOW })}>
                                            立即购买
                                        </a>
                                    }
                                </div>
                            </FixedBottom>
                        }

                        <div className="final-break" />
                        <TransitionGroup>
                            {(showRuleDetails || showServiceTagDetails || selectSku || alertMessage || showCouponGetList || showPromotion) &&
                                <Fade key="mask" style={{ zIndex: 2 }}>
                                    <Mask onClick={() => {
                                        this.setState({
                                            selectDistrict: undefined,
                                            showRuleDetails: undefined,
                                            showServiceTagDetails: undefined,
                                            showCouponGetList: undefined,
                                            showPromotion: false
                                        });
                                        this.closeSkuSelect();
                                    }} />
                                </Fade>
                            }
                            {showRuleDetails &&
                                <SlideBottom>
                                    <MessageBottom title={'运费说明'}
                                        onClose={() => this.setState({ showRuleDetails: undefined })}
                                        onConfirm={() => this.setState({ showRuleDetails: undefined })}>
                                        <div className="line"> </div>
                                        <div className="rule-details">

                                            {transportRule.rules[transportRule.selIndex].firstPrice + transportRule.rules[transportRule.selIndex].addPrice === 0 &&
                                                <p>免运费</p>
                                            }
                                            {transportRule.rules[transportRule.selIndex].firstPrice + transportRule.rules[transportRule.selIndex].addPrice > 0 && transportRule.freeFreightPrice &&
                                                <div>
                                                    <p className="detailsPostage"><span>满</span><span className="PostageNumber">{transportRule.freeFreightPrice}元</span><span>免运费</span></p>
                                                    <p className="detailsPostageNext">未满指定金额按以下规则计算:</p>
                                                    {this.rule2Details(transportRule.rules[transportRule.selIndex]).map(d =>
                                                        <p key={d}>{d}</p>
                                                    )}
                                                </div>
                                            }
                                            {transportRule.rules[transportRule.selIndex].firstPrice + transportRule.rules[transportRule.selIndex].addPrice > 0 && !transportRule.freeFreightPrice &&
                                                <div>
                                                    {this.rule2Details(transportRule.rules[transportRule.selIndex]).map(d =>
                                                        <p key={d}>{d}</p>
                                                    )}
                                                </div>
                                            }
                                        </div>
                                    </MessageBottom>
                                </SlideBottom>
                            }
                            {showServiceTagDetails &&
                                <SlideBottom>
                                    <MessageBottom title={'服务说明'}
                                        onClose={() => this.setState({ showServiceTagDetails: undefined })}
                                        onConfirm={() => this.setState({ showServiceTagDetails: undefined })}>
                                        {serviceTags.map(t =>
                                            <div key={t.name} className="tag-details">
                                                <h6>{t.name}</h6>
                                                <p>{t.description}</p>
                                            </div>
                                        )}
                                    </MessageBottom>
                                </SlideBottom>
                            }
                            {
                                selectSku &&
                                <SlideBottom>
                                    <Sku
                                        {...this.props}
                                        goodsId={goodsId}
                                        goodsProperties={goodsProperties}
                                        goodsSkus={goodsSkus}
                                        goodsMainProperties={goodsMainProperties}

                                        onClose={this.closeSkuSelect}
                                        confirmText={selectSku}
                                    />
                                </SlideBottom>
                            }
                            {
                                showCouponGetList &&
                                <SlideBottom>
                                    <MessageBottom
                                        title={'领优惠券'}
                                        onClose={() => this.setState({ showCouponGetList: undefined })}
                                        onConfirm={() => this.setState({ showCouponGetList: undefined })}
                                        leftTitle={true}
                                        hideBtn={true}
                                    >
                                        <CouponGetList couponIdList={couponId} />
                                    </MessageBottom>
                                </SlideBottom>
                            }
                            {
                                showPromotion &&
                                <SlideBottom>
                                    <MessageBottom
                                        title='限时促销'
                                        onClose={() => this.setState({ showPromotion: undefined })}
                                        onConfirm={() => this.setState({ showPromotion: undefined })}
                                        leftTitle={true}
                                        hideBtn={true}
                                    >
                                        <div className='promotion-root'>
                                            {
                                                ruleLoading ? <FullScreenLoading style={{ position: 'absolute' }} /> :
                                                    <ul>
                                                        {
                                                            promotionRuleList.map(item => {
                                                                return (
                                                                    <li className='promotion' key={item.giftsId} onClick={() => this.selPromotion(item)}>
                                                                        {item.status === 1 && <div>
                                                                            <span className="promotion-type" style={activityIcon.group} ></span>
                                                                            <span className='promotion-content'>
                                                                                {item.giftsItem.toString()}
                                                                            </span>
                                                                        </div>
                                                                        }
                                                                        {item.status === 2 && <div>
                                                                            <span className="promotion-type" style={activityIcon.addPrice} ></span>
                                                                            <span className='promotion-content' style={{marginLeft: '.16rem' }}>
                                                                                {item.giftsItem.toString()}
                                                                            </span>
                                                                        </div>
                                                                        }
                                                                        <img src={imageArrowRight} alt='' className='promotion-arrow' />
                                                                    </li>
                                                                )
                                                            })
                                                        }

                                                        {/*赠品信息*/}
                                                        {activityComplimentaryList != null &&
                                                            <li className='promotion'>
                                                                <div className='complimentaryBox'>
                                                                    <span className="complimentary-type">
                                                                        <span style={activityIcon.complimentary}></span>
                                                                    </span>
                                                                    <div className='complimentary-content'>
                                                                        { activityComplimentaryList.map((item, index) => {
                                                                            return(
                                                                                <div key={index + item.id}>
                                                                                    {item.type == 1 &&
                                                                                    <span className='promotion-content-next' onClick={() => this.selGoodsDetails(item)}>
                                                                                        {item.name + '(赠完即止)'}
                                                                                    </span>
                                                                                    }
                                                                                    {item.type == 2 &&
                                                                                    <span className='promotion-content-next'>
                                                                                        {item.name + '(赠完即止)'}
                                                                                    </span>
                                                                                    }
                                                                                    {item.type == 1 &&
                                                                                    <img src={imageArrowRight} alt='' className='promotion-arrow' />
                                                                                    }
                                                                                </div>
                                                                            )
                                                                        }) }
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        }
                                                    </ul>
                                            }

                                        </div>

                                    </MessageBottom>
                                </SlideBottom>
                            }
                            {loading &&
                                <Fade>
                                    <FullScreenLoading />
                                </Fade>
                            }
                            {alertMessage &&
                                <Fade>
                                    <Alert message={alertMessage} onClose={() => {this.props.history.goBack()}} />
                                </Fade>
                            }
                        </TransitionGroup>
                    </div>
                }
                <Route path={match.url + '/Order/confirm/:data'} component={OrderConfirm} />
                <Route path={match.url + '/comments/:goodsId'} component={GoodsComment} />
                {/* cart 跳转路径若要更改,tabbar中也要相应的更改 */}
                <Route path={match.url + '/cart'} component={Cart} />
            </PageRoot>
        );
    }
}

const ADD_TO_CART = '加入购物车';
const BUY_NOW = '立即购买';
export default GoodsDetails;