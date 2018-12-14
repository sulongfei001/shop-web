import './App.css';
import React, { Component } from 'react';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { TransitionGroup } from 'react-transition-group';
import Home from './page/Home/Home';
import OrderConfirm from "./page/Order/OrderConfirm";
import WeixinOAuth from "./page/Weixin/WeixinOAuth";
import AccountLogin from "./page/Account/AccountLogin";
import OrderList from "./page/Order/OrderList";
import OrderExpress from "./page/Order/OrderExpress";
import OrderCreateComment from "./page/Order/OrderCreateComment";
import Categories from "./page/Home/Categories";
import GoodsDetails from "./page/Goods/GoodsDetails";
import GoodsList from "./page/Goods/GoodsList";
import CouponGoodsList from "./page/Goods/CouponGoodsList";
import Cart from "./page/Home/Cart";
import UserCenter from "./page/User/UserCenter";
import AddressList from "./page/Address/AddressList";
import Favourite from "./page/User/Favourite";
import AfterSaleList from "./page/Order/AfterSaleList";
import AfterApply from "./page/Order/AfterApply";
import OrderNoComments from "./page/Order/OrderNoComments";
import OrderComments from "./page/Order/OrderComments";
import Screen from "./utils/Screen";
import Fade from "./ui/Fade/Fade";
import FullScreenLoading from "./ui/FullScreenLoading/FullScreenLoading";
import Alert from "./ui/Alert/Alert";
import UserInfo from "./page/User/UserInfo";
import About from "./page/User/About";
import Confirm from "./ui/Confirm/Confirm";
import imageHorizontal from './horizontal.png';
import FullScreenPage from "./ui/FullScreenPage/FullScreenPage";
import imageQr from './qr.png';
import CustomerService from "./page/User/CustomerService";
import BabyList from "./page/Baby/BabyList";
import ActivityAgreement from "./page/Baby/Activity/ActivityAgreement";
import ActivityNone from "./page/Baby/Activity/ActivityNone";
import ActivityNone1 from "./page/Baby/Activity/ActivityNone1";
import ApplyAuditions from "./page/Baby/Activity/ApplyAuditions";
import ApplyAuditionsPass from "./page/Baby/Activity/ApplyAuditionsPass";
import ActivityList from "./page/Baby/Activity/ActivityList";
import ActivityList1 from "./page/Baby/Activity/ActivityList1";
import ApplySuccess from "./page/Baby/Activity/ApplySuccess";
import ApplySuccess1 from "./page/Baby/Activity/ApplySuccess1";
import ApplyChangeBaby from "./page/Baby/Activity/ApplyChangeBaby";
import RedirectPage from "./page/Home/RedirectPage";
import UserContext from "./model/UserContext";
import Weixin from "./utils/Weixin";
import AccountLoginForApp from "./page/Account/AccountLoginForApp";
import Mask from "./ui/Mask/Mask";
import SlideBottom from "./ui/SlideBottom/SlideBottom";
import DistrictSelect from "./ui/DistrictSelect/DistrictSelect";
import Test from "./page/Dev/Test";
import DatePicker from "./ui/DatePicker/DatePicker";
import FixedBottom from "./ui/FixedBottom/FixedBottom";
import MyCoupons from './page/Coupons/MyCoupons/MyCoupons'
import ActivityRedirect from "./page/Baby/Activity/ActivityRedirect";
import ActivityPandect from "./page/Baby/Activity/ActivityPandect";
import BabyEdit from "./page/Baby/BabyEdit";
import SaleActivity from './page/Activity/SaleActivity/index'
import Verification from './page/User/Verification'
// baby 活动页
import ActivityPayTip from './page/Baby/Activity/ActivityPayTip'
class App extends Component {
    constructor(props) {
        super(props);
        this.resize = this.resize.bind(this);
        let weixinResults = window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i);
        let isWeixin = weixinResults && weixinResults.length > 0 && weixinResults[0] === 'micromessenger';
        this.state = {
            isWeixin: isWeixin
            //isWeixin: window.WeixinJSBridge
            //isWeixin: true
        };
        Screen.setInstance(this);
        console.log("APP构造函数执行完毕");
    }

    componentDidMount() {
        UserContext.registerAppCallback();
        Weixin.registerAppCallback();
        window.addEventListener("resize", this.resize);
        this.setState({
            isApp: window.Bestnihon
        });
        if (this.state.isWeixin) Weixin.initJsSdk();
    }

    componentWillUnmount() {
        Screen.removeInstance();
        window.removeEventListener("resize", this.resize);
        UserContext.unregisterAppCallback();
        Weixin.unregisterAppCallback();
    }

    resize() {
        this.setState({
            //isHorizontal: Screen.isHorizontal()
            isHorizontal: false
        });
    }

    render() {
        let { loading, alert, confirm, districtSelect, datePick, isHorizontal, isWeixin, isApp } = this.state;
        return (
            <div className="App">
                <Router>
                    <div>
                        <Switch>
                            <Redirect exact path="/" to="/home" />
                            <Route path='/tip' component={ActivityPayTip} />
                            <Route path="/home" component={Home} />
                            <Route path="/redirect/:data" component={RedirectPage} />
                            <Route path="/cart" component={Cart} />
                            <Route path="/goods/details/:id" component={GoodsDetails} />
                            <Route path="/categories" component={Categories} />
                            <Route path="/coupongoodslist/:couponsId" component={CouponGoodsList} />
                            <Route path="/category/:categoryId" component={GoodsList} />
                            <Route path="/order/confirm/:data" component={OrderConfirm} />
                            <Route path="/weixinOauth/:code" component={WeixinOAuth} />
                            <Route path="/account/login" component={AccountLogin} />
                            <Route path="/account/loginForApp" component={AccountLoginForApp} />
                            <Route path="/order/list" component={OrderList} />
                            <Route path="/order/status/:status" component={OrderList} />
                            <Route path="/order/express/:orderExpressNo" component={OrderExpress} />
                            <Route path="/order/newComment/:data" component={OrderCreateComment} />
                            <Route path="/order/noComments" component={OrderNoComments} />
                            <Route path="/order/comments" component={OrderComments} />
                            <Route path="/user" component={UserCenter} />
                            <Route path="/address" component={AddressList} />
                            <Route path="/favourite" component={Favourite} />
                            <Route path="/after/list" component={AfterSaleList} />
                            <Route path="/after/apply" component={AfterApply} />
                            <Route path="/mycoupons" component={MyCoupons} />
                            <Route path="/verification" component={Verification} />
                            <Route path="/saleactivity/:id/:data/:type/:show" component={SaleActivity} />
                            <Redirect exact path="/search" to="/all" />
                            <Route path="/all" component={GoodsList} />
                            <Route path="/search/:keyword" component={GoodsList} />
                            <Route path="/freeFreightGoodsList" component={GoodsList} />
                            <Route path="/regulation/:transportRuleIds" component={GoodsList} />
                            <Route path="/userInfo" component={UserInfo} />
                            <Route path="/about" component={About} />
                            <Route path="/customerService" component={CustomerService} />
                            <Route path="/dev/test" component={Test} />
                            <Route path="/activity" component={ActivityPandect} />
                            <Route path="/baby/list" component={BabyList} />
                            <Route path="/baby/edit" component={BabyEdit} />
                            <Route path="/baby/activity/agreement/:typeId" component={ActivityAgreement} />
                            {/* <Route path="/baby/activity/none" component={ActivityNone} /> */}
                            <Route path="/baby/activity/none_type1" component={ActivityNone1} />
                            <Route path="/baby/activity/applyAuditions" component={ApplyAuditions} />
                            <Route path="/baby/activity/applyAuditionsPass" component={ApplyAuditionsPass} />
                            // TODO:
                            {/* <Route path="/baby/activity/list" component={ActivityList} /> */}
                            <Route path="/baby/activity/list_type1" component={ActivityList1} />
                            {/* <Route path="/baby/activity/applySuccess" component={ApplySuccess} /> */}
                            <Route path="/baby/activity/applySuccess_type1" component={ApplySuccess1} />
                            <Route path="/baby/activity/applyChangeBaby/:changeId" component={ApplyChangeBaby} />
                            <Route path="/baby/activity/partner/:partnerId/:typeId" component={ActivityRedirect} />
                        </Switch>
                    </div>
                </Router>
                <TransitionGroup>
                    {loading &&
                        <Fade>
                            <FullScreenLoading />
                        </Fade>
                    }
                    {alert &&
                        <Fade>
                            <Alert message={alert.message} onClose={alert.onClose} />
                        </Fade>
                    }
                    {confirm &&
                        <Fade>
                            <Confirm title={confirm.title} message={confirm.message} onConfirm={confirm.onConfirm} onCancel={confirm.onCancel} />
                        </Fade>
                    }
                    {districtSelect &&
                        <Fade>
                            <Mask onClick={() => districtSelect.onClose()} style={{ zIndex: 10 }} />
                        </Fade>
                    }
                    {districtSelect &&
                        <SlideBottom>
                            <DistrictSelect style={{ zIndex: 10 }} includedIds={districtSelect.includedIds} onSelected={districtSelect.onSelected} onClose={districtSelect.onClose} />
                        </SlideBottom>
                    }
                    {datePick &&
                        <Fade>
                            <Mask onClick={() => datePick.onClose()} style={{ zIndex: 10 }} />
                        </Fade>
                    }
                    {datePick &&
                        <SlideBottom>
                            <FixedBottom style={{ zIndex: 10 }}>
                                <DatePicker date={datePick.date} onCancel={datePick.onClose} onDatePicked={datePick.onPicked} />
                            </FixedBottom>
                        </SlideBottom>
                    }
                </TransitionGroup>
                {!isWeixin && !isApp && false &&
                    <FullScreenPage style={{ background: '#fff' }}>
                        <div className="no-weixin">
                            请在微信客户端打开链接<br />
                            <img src={imageQr} alt="" />
                        </div>
                    </FullScreenPage>
                }
                {isHorizontal &&
                    <FullScreenPage style={{ background: '#fff' }}>
                        <div className="horizontal" style={{ backgroundImage: 'url(' + imageHorizontal + ')' }}>
                            暂不支持横屏
                    </div>
                    </FullScreenPage>
                }
            </div>
        );
    }
}

export default App;
