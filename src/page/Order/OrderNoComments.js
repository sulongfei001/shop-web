import './OrderComments.css';
import React from 'react';
import {Link, Route} from 'react-router-dom';
import {TransitionGroup} from 'react-transition-group';
import UserContext from "../../model/UserContext";
import OrderApi from "../../api/OrderApi";
import Paging from "../../utils/Paging";
import Screen from "../../utils/Screen";
import Fade from "../../ui/Fade/Fade";
import FullScreenLoading from "../../ui/FullScreenLoading/FullScreenLoading";
import Alert from "../../ui/Alert/Alert";
import FixedTop from "../../ui/FixedTop/FixedTop";
import OrderDetails from "./OrderDetails";
import OrderCreateComment from "./OrderCreateComment";
import Page from "../../ui/Page/Page";

class OrderNoComments extends Page {
    constructor(props) {
        super(props);
        this.scroll = this.scroll.bind(this);
        this.loadData = this.loadData.bind(this);
        this.state = {
            loading: false,
            url: props.match.url,
        };
    }

    componentDidMount() {
        let {history, match} = this.props;
        if (!UserContext.isLoggedIn(history, match)) {
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

    loadData() {
        let {isLoadingData, finishedLoading, goodsList} = this.state;
        if (isLoadingData || finishedLoading) return;
        if (!goodsList) goodsList = [];
        this.setState({
            loading: goodsList.length === 0,
            isLoadingData: true
        }, () => {
            let userContext = UserContext.get();
            OrderApi.notCommentsList({
                accessToken: userContext.userToken,
                pageSize: pageSize,
                pageNo: Paging.nextPageNo(goodsList.length, pageSize)
            }, data => {
                data.goodsList.forEach(g => {
                    goodsList.push({
                        goodsId: g.goodsId,
                        orderId: g.orderId,
                        expressId: g.orderExpressId,
                        skuId: g.goodsSkuId,
                        name: g.name,
                        logo: g.pictureUrl,
                        giftsStats:g.giftsStats
                    });
                });
                this.setState({
                    loading: false,
                    goodsList: goodsList,
                    isLoadingData: false,
                    finishedLoading: data.goodsList.length === 0
                });
            }, error => {
                this.setState({
                    loading: false,
                    isLoadingData: false,
                    alertMessage: error
                });
            });
        });
    }

    render() {
        let {match} = this.props;
        let {loading, alertMessage, goodsList} = this.state;
        console.log(goodsList)
        return (
            <div>
                {!this.isChildRoute() &&
                <div className="OrderComments">
                    {!loading &&
                    <FixedTop>
                        <div className="status-list">
                            <div className="status-link">
                                <a>待评价</a>
                                <a onClick={() => this.props.history.replace(match.url.replace('noComments', 'comments'))}>已评价</a>
                            </div>
                            <div className="status-active"/>
                        </div>
                    </FixedTop>
                    }
                    {goodsList && goodsList.length > 0 &&
                    <div className="goods-list">
                        {goodsList.map(g =>
                            <div key={g.expressId + '_' + g.skuId} className="goods-item">
                                <div className="pic" style={{backgroundImage: 'url(' + g.logo + ')'}}/>
                                <h6>
                                {
                                    g.giftsStats &&  (g.giftsStats === 1 ?<span className=" inline-block-middle"><span className="icon-promotion"/>&nbsp;
                                    </span>:
                                    <span className=" inline-block-middle">
                                    <span className="icon-add-price"/>&nbsp;
                                    </span>    
                                )
                                }
                                {g.name}
                                </h6>
                                <div className="buttons">
                                    {!g.commented &&
                                    <Link to={match.url + '/new/' + g.orderId + '/' + g.expressId + '/' + g.skuId + '/' + encodeURIComponent(g.logo)}>评价</Link>
                                    }
                                    {g.commented &&
                                    <a>已评价</a>
                                    }
                                    <Link to={match.url + '/order/' + g.orderId + '/' + g.expressId}>查看订单</Link>
                                </div>
                            </div>
                        )}
                    </div>
                    }
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
                        <Alert message={alertMessage} onClose={() => {
                            this.setState({
                                alertMessage: undefined
                            });
                        }}/>
                    </Fade>
                    }
                </TransitionGroup>
                <Route path={match.url + '/order/:orderId/:expressId'} component={OrderDetails}/>
                <Route path={match.url + '/new/:orderId/:expressId/:skuId/:logo'} render={props =>
                    <OrderCreateComment {...props} parent={this}/>
                }/>
            </div>
        );
    }
}

const pageSize = 10;

export default OrderNoComments;