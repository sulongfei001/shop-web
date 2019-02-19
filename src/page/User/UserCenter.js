import './UserCenter.css';
import React from 'react';
import {Link, Route} from 'react-router-dom';
import {TransitionGroup} from 'react-transition-group';
import Fade from "../../ui/Fade/Fade";
import FullScreenLoading from "../../ui/FullScreenLoading/FullScreenLoading";
import imagePath from './path.png';
import imageOrder1 from './orderStatus1.png';
import imageOrder2 from './orderStatus2.png';
import imageOrder3 from './orderStatus3.png';
import imageOrder4 from './orderStatus4.png';
import imageAfterSale from './afterSale.png';
import imageFavourite from './favourite.png';
import babyIcon from "./babyIcon.png";
import imageCoupons from './coupons@3x.png';
import imageHexiao from './Group Copy@2x.png'
import imageAddress from './address.png';
import TabBar from "../../ui/TabBar/TabBar";
import UserContext from "../../model/UserContext";
import OrganizationContext from "../../model/OrganizationContext";
import Alert from "../../ui/Alert/Alert";
import FixedBottom from '../../ui/FixedBottom/FixedBottom'
import OrderApi from "../../api/OrderApi";
import OrderList from "../Order/OrderList";
import AddressList from "../Address/AddressList";
import Favourite from "./Favourite";
import AfterSaleList from "../Order/AfterSaleList";
import OrderNoComments from "../Order/OrderNoComments";
import OrderComments from "../Order/OrderComments";
import AfterApply from "../Order/AfterApply";
import imageCs from './cs.png';
import ApplyIcon from "./ApplyIcon.jpg";
import Page from "../../ui/Page/Page";

class UserCenter extends Page {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            url: props.match.url,
        };
    }

    componentDidMount() {
        let partnerId = this.props.match.params.partnerId;
        if (!partnerId) partnerId = 0;
        let organizationContext =  OrganizationContext.get();
        organizationContext.organizationId = partnerId;
        OrganizationContext.set(organizationContext);
        this.props.history.replace(organizationContext.organizationId);
        if (!UserContext.isLoggedIn(this.props.history, this.props.match)) {
            return;
        }
        let userContext = UserContext.get();
        OrderApi.userInfo({
            accessToken: userContext.userToken,
        }, data => {
            this.setState({
                userId: data.userId,
                loading: false,
                avatar: data.avatar,
                nickname: data.userName,
                orderCounts: [data.noPaymentTotal, data.noDeliverTotal, data.noReceiptTotal, data.noCommentsTotal, data.afterSaleTotal]
            });
        }, error => {
            this.setState({
                loading: false,
                alertMessage: error
            });
        });
    }

    render() {
        let {match} = this.props;
        let {loading, avatar, nickname, orderCounts, alertMessage} = this.state;
        return (
            <div>
                {!this.isChildRoute() &&
                <div className="UserCenter">
                    {avatar && nickname &&
                    <Link to="/userInfo" style={{backgroundImage: 'url(' + imagePath + ')'}} className="user-info">
                        <div style={{backgroundImage: 'url(' + avatar + ')'}}/>
                        <h6>昵称：{nickname}</h6>
                    </Link>
                    }
                    {orderCounts &&
                    <div className="user-orders">
                        <Link to={'/order/list'} className="all-order" style={{backgroundImage: 'url(' + imagePath + ')'}}>
                            <label>我的订单</label>
                            <label>查看全部订单</label>
                        </Link>
                        <div className="order-items">
                            <Link to={'/order/status/1'} style={{backgroundImage: 'url(' + imageOrder1 + ')'}}>
                                待付款
                                {orderCounts[0] > 0 &&
                                <em>{orderCounts[0]}</em>
                                }
                            </Link>
                            <Link to={'/order/status/2'} style={{backgroundImage: 'url(' + imageOrder2 + ')'}}>
                                待发货
                                {orderCounts[1] > 0 &&
                                <em>{orderCounts[1]}</em>
                                }
                            </Link>
                            <Link to={'/order/status/3'} style={{backgroundImage: 'url(' + imageOrder3 + ')'}}>
                                待收货
                                {orderCounts[2] > 0 &&
                                <em>{orderCounts[2]}</em>
                                }
                            </Link>
                            <Link to={'/order/noComments'} style={{backgroundImage: 'url(' + imageOrder4 + ')'}}>
                                评价
                                {orderCounts[3] > 0 &&
                                <em>{orderCounts[3]}</em>
                                }
                            </Link>
                            <Link to={'/after/list'} style={{backgroundImage: 'url(' + imageAfterSale + ')'}}>
                                退换货
                                {orderCounts[4] > 0 &&
                                <em>{orderCounts[4]}</em>
                                }
                            </Link>
                        </div>
                    </div>
                    }
                    <div className="user-buttons">
                        <Link to={'/activity'} style={{backgroundImage: 'url(' + imagePath + ')'}}>
                            <label style={{backgroundImage: 'url(' + ApplyIcon + ')'}}>
                                活动
                            </label>
                        </Link>
                        <Link to={'/baby/list'} style={{backgroundImage: 'url(' + imagePath + ')'}}>
                            <label style={{backgroundImage: 'url(' + babyIcon + ')'}}>
                                宝宝信息
                            </label>
                        </Link>
                        <Link to={'/verification'} style={{backgroundImage: 'url(' + imagePath + ')'}}>
                            <label style={{backgroundImage: 'url(' + imageHexiao + ')'}}>
                                我的核销
                            </label>
                        </Link>
                        <Link to={'/mycoupons'} style={{backgroundImage: 'url(' + imagePath + ')'}}>
                            <label style={{backgroundImage: 'url(' + imageCoupons + ')'}}>
                                我的优惠券
                            </label>
                        </Link>  
                        <Link to={'/favourite'} style={{backgroundImage: 'url(' + imagePath + ')'}}>
                            <label style={{backgroundImage: 'url(' + imageFavourite + ')'}}>
                                我的收藏
                            </label>
                        </Link>
                        <Link to={'/address'} style={{backgroundImage: 'url(' + imagePath + ')'}}>
                            <label style={{backgroundImage: 'url(' + imageAddress +')'}}>
                                收货地址
                            </label>
                        </Link>
                        <Link to="/customerService" style={{backgroundImage: 'url(' + imagePath + ')'}}>
                            <label style={{backgroundImage: 'url(' + imageCs + ')'}}>
                                客服与帮助
                            </label>
                        </Link>
                    </div>
                    <FixedBottom>
                        <TabBar />
                    </FixedBottom>
                </div>
                }
                <TransitionGroup>
                    {loading &&
                    <Fade>
                        <FullScreenLoading/>
                    </Fade>
                    }
                    {alertMessage &&
                    <Fade>
                        <Alert message={alertMessage} onClose={() => this.setState({
                            alertMessage: undefined
                        })}/>
                    </Fade>
                    }
                </TransitionGroup>
                <Route path={match.url + '/order/list'} component={OrderList}/>
                <Route path={match.url + '/order/status/:status'} component={OrderList}/>
                <Route path={match.url + '/order/noComments'} component={OrderNoComments}/>
                <Route path={match.url + '/order/comments'} component={OrderComments}/>
                <Route path={match.url + '/address'} component={AddressList}/>
                <Route path={match.url + '/favourite'} component={Favourite}/>
                <Route path={match.url + '/after/list'} component={AfterSaleList}/>
                <Route path={match.url + '/after/apply'} component={AfterApply}/>
            </div>
        );
    }
}

export default UserCenter;