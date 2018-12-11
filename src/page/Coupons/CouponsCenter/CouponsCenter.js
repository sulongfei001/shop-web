import React from 'react';
import { Link } from 'react-router-dom';
import { TransitionGroup } from 'react-transition-group';
import FullScreenLoading from '../../../ui/FullScreenLoading/FullScreenLoading';
import Screen from '../../../utils/Screen';
import FixedTop from '../../../ui/FixedTop/FixedTop';
import Alert from '../../../ui/Alert/Alert';
import Page from '../../../ui/Page/Page';
import Mask from '../../../ui/Mask/Mask';
import Fade from '../../../ui/Fade/Fade';
import SlideTop from '../../../ui/SlideTop/SlideTop'
import './CouponsCenter.css';
import Common from '../../../utils/Common';
import CouponsApi from '../../../api/CouponsApi';
import UserContext from '../../../model/UserContext';
import PageRoot from '../../../ui/PageRoot/PageRoot'

class GoodsList extends Page {
    constructor(props) {
        super(props);
        this.scroll = this.scroll.bind(this);
        this.init = this.init.bind(this);
        this.selTab = this.selTab.bind(this);
        this.fetchCoupon = this.fetchCoupon.bind(this);
        this.fullUl = this.fullUl.bind(this);
        this.checkLogin = this.checkLogin.bind(this);
        this.checkPercent = this.checkPercent.bind(this)
        this.state = {
            loading: true,
            tabLoading: false,
            isRequesting: false, // 是否正在请求
            pageSize: 10, // 每页多少数据
            pageNo: 1, // 第几页
            pageTotal: null, // 总页数
            couponCategoryId: null, //分类id
        };
    }

    componentDidMount() {
        if (this.checkLogin()) {
            this.init();
        }
        window.addEventListener('scroll', this.scroll);
        window.addEventListener('touchstart', this.fullUl);
        this.setState({
            headHeight: parseFloat(window.getComputedStyle(this.refs.head, null).height)
        })
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.scroll);
        window.removeEventListener('touchstart', this.fullUl);
    }

    // 滚动判断 加载新数据
    scroll() {
        if (Screen.scrollHeight() - Screen.availHeight() - Screen.scrollTop() < 200) {
            this.init();
        }
    }

    // 判断用户登陆
    checkLogin() {
        const { history, match } = this.props
        return UserContext.isLoggedIn(history, match)
    }

    // 获取数据
    init() {
        let {
            pageSize,
            pageNo,
            couponCategoryId,
            isRequesting,
            couponList,
            pageTotal,
        } = this.state;
        if (pageTotal && pageNo > pageTotal) return console.warn('已达页数限制------');
        if (isRequesting) {
            return console.warn('有请求正在进行中-----');
        } else {
            this.setState({
                isRequesting: true,
            });
        }
        let userContext = UserContext.get();
        let body = {
            accessToken: userContext.userToken, //访问令牌（必须）
            couponCategoryId, // 优惠券分类id
            pageSize, // 每页多少行
            pageNo, // 第几页
        };
        CouponsApi.couponCenter(
            body,
            data => {
                pageNo += 1;
                let fetchData = data.couponList
                fetchData.forEach(i => {
                    i.clickNum = 0
                })
                couponList = couponList
                    ? [...couponList, ...fetchData]
                    : fetchData;
                this.setState(
                    {
                        isRequesting: false,
                        loading: false,
                        tabLoading: false,
                        categoryList: data.categoryList,
                        pageTotal: Math.ceil(data.total / pageSize),
                        couponList,
                        pageNo,
                    }
                    //   () => {
                    // 暂时注释,下方这种情况出现机率不大,为了更好的用户体验,展示tab
                    //     // 为防止出现分类列表发生更新，导致下标出现问题，需要根据id来匹配index
                    //     if (couponCategoryId) {
                    //       let { categoryList } = this.state;
                    //       categoryList.forEach((item, index) => {
                    //         if (couponCategoryId === item.couponCategoryId) {
                    //           this.ulScroll(index);
                    //         }
                    //       });
                    //     } else {
                    //       this.ulScroll();
                    //     }
                    //   },
                );
            },
            error => {
                this.setState({
                    alertMessage: error,
                    isRequesting: false,
                    loading: false,
                    tabLoading: false
                });
            },
        );
    }

    //选择tab
    selTab(item, index) {
        this.ulScroll(index)
        this.setState(
            {
                showType: false,
                tabLoading: true,
                pageNo: 1,
                couponList: [],
                pageTotal: null,
                couponCategoryId: item ? item.couponCategoryId : null,
            },
            () => this.init()
        );
    }

    // 填充ul
    fullUl() {
        if (!this.checkoutTab()) return
        let { categoryList } = this.state;
        if (!categoryList) return;
        let tab = this.refs.couponTab;
        if (!tab) return;
        let tabLastItem = tab.children[tab.children.length - 1];
        let w =
            parseFloat(window.getComputedStyle(tab, null).width) -
            parseFloat(window.getComputedStyle(tabLastItem, null).width);
        this.setState(
            {
                copyUlWidth: w,
            },
            () => {
                window.removeEventListener('touchstart', this.fullUl);
            },
        );
    }

    // ul动画效果
    ulScroll(index) {
        let { isUlScroll } = this.state
        if (!isUlScroll) return
        let tab = this.refs.couponTab;
        let basicX = tab.scrollLeft;
        let tabWidth = parseFloat(window.getComputedStyle(tab, null).width)
        let item = index >= 0 ? tab.children[index + 1] : tab.children[0];
        let itemOffsetLeft = item.offsetLeft;
        let itemWidthHalf = parseFloat(window.getComputedStyle(item, null).width) / 2
        let centerX = tabWidth / 2;
        let itemX = itemOffsetLeft - centerX + itemWidthHalf
        let timer;
        clearInterval(timer);
        timer = setInterval(() => {
            let bol;
            if (itemX > basicX) {
                basicX = basicX + 2;
                bol = basicX >= itemX && true;
            } else {
                basicX = basicX - 2;
                bol = basicX <= itemX && true;
            }
            if (bol) {
                tab.scrollLeft = itemX;
                clearInterval(timer);
            } else {
                tab.scrollLeft = basicX;
            }
        }, 1);
    }

    // 判断cate分类是否超出ul的宽度
    checkoutTab() {
        let tab = this.refs.couponTab;
        let tabWidth = parseFloat(window.getComputedStyle(tab, null).width)
        let tabItem = tab.children
        let tabItemWidth = 0
        for (let i = 0, len = tabItem.length; i < len; i++) {
            let itemWidth = parseFloat(window.getComputedStyle(tabItem[i], null).width)
            tabItemWidth += itemWidth
        }
        if (tabItemWidth < tabWidth) {
            return false
        }
        this.setState({
            isUlScroll: true
        })
        return true
    }

    // 领取优惠券
    fetchCoupon(item) {
        this.setState({
            tabLoading: true,
        });
        let userContext = UserContext.get();
        let body = {
            accessToken: userContext.userToken, //访问令牌（必须）
            couponId: item.couponId, //优惠券id (必填)
            source: 2, //来源(2：全场赠劵，3：商品详情领取)(必填)
            activityId: item.activityId, // 非必填 活动ID
        };
        CouponsApi.couponReceive(
            body,
            data => {
                let { couponList } = this.state;
                item.clickNum++
                couponList.forEach(i => {
                    if (i.couponId === item.couponId) {
                        i.quantity = Common.accAdd(item.quantity, Common.accDiv(1, Common.accMul(item.totalNumber, 100)))
                        item.clickNum >= item.maxNumber && (i.state = 2)
                    }
                }
                );
                this.setState({
                    couponList,
                    tabLoading: false,
                    alertMessage: '领取成功'
                });
            },
            error => {
                this.setState({
                    tabLoading: false,
                    alertMessage: error
                });
            },
        );
    }

    // 百分比检测
    checkPercent(percent) {
        if (!percent || percent === 0) {
            return '0%'
        }
        return percent < 1 ? '1%' : Math.floor(percent) + '%'
    }

    render() {
        const {
            categoryList,
            couponList,
            alertMessage,
            loading,
            headHeight,
            showType,
            couponCategoryId,
            copyUlWidth,
            tabLoading
        } = this.state;

        const CouponStatus = ({ item }) => {
            //状态，1：未领取，2：未使用，3：已使用，4：已领完
            const state = item.state;
            return (
                <div className="coupons-status fr">
                    {state === 1 && (
                        <div>
                            <h1 className="color-000 f24 mt20">已抢{this.checkPercent(item.quantity)}</h1>
                            <div className="status-loading">
                                <span
                                    className="loading-line"
                                    style={{ width: this.checkPercent(item.quantity) }}
                                />
                            </div>
                            <div
                                className="mt10 f24 btn margin-auto color-fff bac-orange"
                                onClick={() => this.fetchCoupon(item)}
                            >
                                立即领取
                            </div>
                        </div>
                    )}
                    {state === 2 && (
                        <div>
                            <h1 className="mt20 f24">有效期</h1>
                            <h6 className="color-999 f14 status-date mt10">
                                {Common.timestampToTime(item.activeTimeStart)}-{Common.timestampToTime(
                                    item.activeTimeEnd,
                                )}
                            </h6>
                            <Link
                                to={'/coupongoodslist/' + item.couponId}
                                className="mt10 f24 btn margin-auto bac-main color-fff"
                            >
                                去使用
                            </Link>
                        </div>
                    )}
                    {state === 3 && (
                        <div className="one-el-middle">
                            <div className="btn ban color-fff f24">已使用</div>
                        </div>
                    )}
                    {state === 4 && (
                        <div className="one-el-middle">
                            <div className="btn ban color-fff f24">已领完</div>
                        </div>
                    )}
                </div>
            );
        };
        let opacity = {
            full: { opacity: 1 },
            empty: { opacity: 0.7 },
        };
        return (
            <PageRoot>
                <div className="coupons-center">
                    {!this.isChildRoute() && (
                        <div>
                            {categoryList && (
                                <FixedTop style={{ borderBottom: '1px solid #E8E8E8', zIndex: '1' }}>
                                    <div className="coupons-head clearfix bac-white">
                                        <ul className="coupon-tab fl" ref="couponTab">
                                            <li
                                                className="color-000"
                                                style={!couponCategoryId ? opacity.full : opacity.empty}
                                                onClick={() => this.selTab()}
                                            >
                                                全部
                                            </li>
                                            {categoryList.map((item, index) => {
                                                return (
                                                    <li
                                                        key={item.couponCategoryId}
                                                        className='color-000'
                                                        style={
                                                            couponCategoryId &&
                                                                couponCategoryId === item.couponCategoryId
                                                                ? opacity.full
                                                                : opacity.empty
                                                        }
                                                        onClick={() => this.selTab(item, index)}
                                                    >
                                                        {item.categoryName}
                                                    </li>
                                                );
                                            })}
                                            {copyUlWidth && (
                                                <li style={{ width: copyUlWidth + 'px' }} />
                                            )}
                                        </ul>
                                        <div
                                            className="icon-arrow-down fr"
                                            onClick={e => this.setState({ showType: true })}
                                        />
                                    </div>
                                </FixedTop>
                            )}
                            <div className="h90" ref='head' />
                            {couponList && (
                                <ul
                                    className="padding-40 coupon-list"
                                    ref="centerContent"
                                >
                                    {couponList.map((item, index) => {
                                        return (
                                            <li className="clearfix mb20" key={item.activityId}>
                                                <img
                                                    className="coupons-img fl"
                                                    src={item.pictureUrl}
                                                    alt={item.couponName}
                                                    title={item.couponName}
                                                />
                                                <div className="coupons-info fl">
                                                    <h1 className="f24 color-000 two-txt">{item.couponName}</h1>
                                                    <h2 className="f36 color-main coupons-info-rule">
                                                        &yen;{item.price}&nbsp;<span className="f24 color-main">
                                                            {item.ruleInfo}{' '}
                                                        </span>
                                                    </h2>
                                                </div>
                                                <CouponStatus item={item} />
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                            {
                                tabLoading && <div style={{ position: 'fixed', height: window.screen.height - headHeight + 'px', top: headHeight, width: '100%' }}>
                                    <FullScreenLoading style={{ position: 'absolute' }} />
                                </div>
                            }
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
                                    onClose={() => this.setState({ alertMessage: false })}
                                />
                            </Fade>
                        )}
                        {showType &&
                            <SlideTop>
                                <FixedTop>
                                    <div className="coupon-type-title bac-white">分类</div>
                                    <ul className="mask-coupon-type padding-40 clearfix bac-white">
                                        {categoryList.map((item, index) => {
                                            return (
                                                <li
                                                    className="fl"
                                                    key={item.couponCategoryId}
                                                    onClick={() => this.selTab(item, index)}
                                                >
                                                    {item.categoryName}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </FixedTop>
                            </SlideTop>
                        }
                        {showType &&
                            <Fade>
                                <Mask onClick={e => this.setState({ showType: false })} />
                            </Fade>}

                    </TransitionGroup>
                </div>
            </PageRoot>
        );
    }
}

export default GoodsList;
