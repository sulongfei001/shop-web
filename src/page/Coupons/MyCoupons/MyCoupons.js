import React from 'react';
import { Link, Route } from 'react-router-dom';
import { TransitionGroup } from 'react-transition-group';
import FullScreenLoading from '../../../ui/FullScreenLoading/FullScreenLoading';
import Screen from '../../../utils/Screen';
import FixedTop from '../../../ui/FixedTop/FixedTop';
import Alert from '../../../ui/Alert/Alert';
import Page from '../../../ui/Page/Page';
import Fade from '../../../ui/Fade/Fade';
import './MyCoupons.css';
import Common from '../../../utils/Common';
import CouponsApi from '../../../api/CouponsApi';
import UserContext from '../../../model/UserContext';
import RedeemCoupons from '../Common/RedeemCoupons';
import GoodsListView from '../../../ui/GoodsListView/GoodsListView';
import GoodsDetails from '../../Goods/GoodsDetails'
import PageRoot from '../../../ui/PageRoot/PageRoot'

class MyCoupons extends Page {
    constructor(props) {
        super(props);
        this.selTab = this.selTab.bind(this);
        this.init = this.init.bind(this);
        this.scroll = this.scroll.bind(this);
        this.state = {
            loading: true,
            couponList: null,
            selTabState: 1,
            pageSize: 10, // 每页多少数据
            pageNo: 1, // 第几页
            pageTotal: null, // 总页数
            isRequesting: false, // 正在请求中
        };
    }
    componentDidMount() {
        this.init();
        window.addEventListener('scroll', this.scroll);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.scroll);
    }

    scroll() {
        let { couponList } = this.state;
        if (!couponList || couponList.length === 0) return;
        if (Screen.scrollHeight() - Screen.availHeight() - Screen.scrollTop() < 200) {
            this.init();
        }
    }

    //我的优惠券
    init() {
        let {
            selTabState,
            pageSize,
            pageNo,
            pageTotal,
            couponList,
            isRequesting,
        } = this.state;
        //页数限制
        if (pageTotal && pageNo > pageTotal) return console.error('全部加载完毕');
        if (isRequesting) {
            return console.error('正在请求中');
        } else {
            this.setState({
                isRequesting: true,
            });
        }
        let userContext = UserContext.get();
        let body = {
            accessToken: userContext.userToken, //访问令牌（非必须）
            state: selTabState, //状态,1：未使用，2：已使用，3：已过期 (必填)
            pageSize, //每页多少行 (必填)
            pageNo, //第几页  (必填)
        };
        CouponsApi.couponUser(
            body,
            data => {
                pageNo += 1;
                this.setState({
                    couponList: couponList
                        ? [...couponList, ...data.couponList]
                        : data.couponList,
                    state: data.state,
                    recommendGoodsList: data.recommendGoodsList,
                    pageTotal: Math.ceil(data.total / pageSize),
                    loading: false,
                    isRequesting: false,
                    pageNo,
                });
            },
            error => {
                this.setState({
                    loading: false,
                    isRequesting: false,
                    alertMessage: error,
                });
            },
        );
    }

    // tab栏选择
    selTab(state) {
        window.scrollTo(0, 0);
        this.setState(
            {
                selTabState: state,
                loading: true,
                couponList: null,
                pageTotal: null,
                pageNo: 1,
            },
            () => this.init(),
        );
    }

    render() {
        //state :1, //状态,1：未使用，2：已使用，3：已过期 (必填)
        const headTab = [
            { name: '未使用', state: 1 },
            { name: '已使用', state: 2 },
            { name: '已过期', state: 3 },
        ];
        const {
            selTabState,
            couponList,
            state,
            alertMessage,
            loading,
            recommendGoodsList,
        } = this.state;
        const { match, location } = this.props
        return (
            <PageRoot>
                {!this.isChildRoute() && (
                    <div className="my-coupons">
                        <FixedTop>
                            <ul className="my-coupons-head bac-white">
                                {headTab.map((item, index) => {
                                    return (
                                        <li
                                            key={`tab${index}`}
                                            className={`f32 ${selTabState === item.state ? 'active color-main ' : 'color-000'}`}
                                            onClick={() => this.selTab(item.state)}
                                        >
                                            {item.name}
                                        </li>
                                    );
                                })}
                            </ul>
                            {selTabState === 1 && (
                                <RedeemCoupons
                                    onRefesh={() => {
                                        this.setState({
                                            loading: true,
                                            couponList: null,
                                            pageSize: 10, // 每页多少数据
                                            pageNo: 1, // 第几页
                                            pageTotal: null, // 总页数
                                            isRequesting: false, // 正在请求中
                                        }, () => this.init())
                                    }}
                                />
                            )}
                        </FixedTop>
                        {state === 1 ? <div className="h178" /> : <div className="h90" />}

                        {couponList &&
                            couponList.length > 0 && (
                                <ul className="my-coupons-list bac-white">
                                    {couponList.map(item => {
                                        return (
                                            <li key={item.couponCodeId} className="clearfix">
                                                <div className={`fl list-left ${state === 3 && 'bac-grey'}`}>
                                                    <div className="middle" style={{ width: '1.73rem' }}>
                                                        <p className="txt-center">
                                                            <span className={`f24  ${state === 3 ? 'color-fff' : 'color-000'}`}>
                                                                &yen;
                                                            </span>
                                                            <span className={`f42  ${state === 3 ? 'color-fff' : 'color-000'}`}>
                                                                {item.price}
                                                            </span>
                                                        </p>
                                                        <p className={`f24 txt-center ${state === 3 ? 'color-fff' : 'color-000'}`}>
                                                            {item.ruleInfo}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="fl list-center">
                                                    <p>
                                                        <span className="ticket-type">
                                                            {Common.couponRoleType(item.couponRoleType)}
                                                        </span>
                                                        <span className={`one-txt ticket-rule ${state === 3 ? 'color-999' : 'color-000'}`}>
                                                            {item.couponName}
                                                        </span>
                                                    </p>
                                                    <p className="f24 mt20 color-999">
                                                        {Common.timestampToTime(item.activeTimeStart)}-{Common.timestampToTime(item.activeTimeEnd)}
                                                    </p>
                                                </div>
                                                <div className="fr list-right">
                                                    {state === 1 ? (
                                                        <Link
                                                            to={'/coupongoodslist/' + item.couponId}
                                                            className="btn middle color-fff bac-main f24 txt-center"
                                                        >
                                                            立即使用
                            </Link>
                                                    ) : (
                                                            <div className="btn middle color-fff bac-grey f24 txt-center">
                                                                {state === 2 ? '已使用' : '已过期'}
                                                            </div>
                                                        )}
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}

                        {couponList &&
                            couponList.length === 0 && (
                                <div>
                                    <div className="nodata">
                                        <div className="middle">
                                            <div className="nodata-img" />
                                            <p className="nodata-tip">还没有优惠券哦～</p>
                                        </div>
                                    </div>
                                    <div className="mt20">
                                        <h1 className="nodata-goods-title">猜你喜欢</h1>
                                        <GoodsListView
                                            goodsList={recommendGoodsList}
                                            routePrefix={match.url}
                                        />
                                    </div>
                                </div>
                            )
                        }
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
                )}
                <Route location={location} key={'goodsDetails'} path={match.url + '/goods/details/:id'} component={GoodsDetails}/>
                {/* <Route location={location} key={'goodsDetails'} path={match.url + '/goods/details/:id'} component={GoodsDetails}/> */}
            </PageRoot>
        );
    }
}

export default MyCoupons;
