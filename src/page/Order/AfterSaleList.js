import './AfterSaleList.css';
import React from 'react';
import {Route, Link} from 'react-router-dom';
import {TransitionGroup} from 'react-transition-group';
import Fade from "../../ui/Fade/Fade";
import FullScreenLoading from "../../ui/FullScreenLoading/FullScreenLoading";
import DateFormatter from "../../utils/DateFormatter";
import AfterSaleStatus from "../../model/AfterSaleStatus";
import AfterSaleDetails from "./AfterSaleDetails";
import UserContext from "../../model/UserContext";
import Screen from "../../utils/Screen";
import OrderApi from "../../api/OrderApi";
import Paging from "../../utils/Paging";
import Alert from "../../ui/Alert/Alert";
import AfterSaleExpress from "./AfterSaleExpress";
import Confirm from "../../ui/Confirm/Confirm";
import Page from "../../ui/Page/Page";

class AfterSaleList extends Page {
    constructor(props) {
        super(props);
        this.scroll = this.scroll.bind(this);
        this.loadData = this.loadData.bind(this);
        this.state = {
            loading: false,
            url: props.match.url
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
        let {isLoadingData, finishedLoading, afterSales} = this.state;
        if (isLoadingData || finishedLoading) return;
        if (!afterSales) afterSales = [];
        this.setState({
            loading: afterSales.length === 0,
            isLoadingData: true
        }, () => {
            let userContext = UserContext.get();
            OrderApi.afterSaleRecordList({
                accessToken: userContext.userToken,
                pageSize: pageSize,
                pageNo: Paging.nextPageNo(afterSales.length, pageSize)
            }, data => {
                data.goodsSkuList.forEach(g => {
                    afterSales.push({
                        id: g.afterSaleId,
                        date: g.createDate,
                        status: g.state,
                        sku: {
                            id: g.goodsSkuId,
                            logo: g.pictureUrl,
                            name: g.name,
                            number: g.quantity,
                            propertyItems: g.propertyItems,
                            priceForSale: g.priceForSale,
                            goodsId: g.goodsId
                        }
                    });
                });
                this.setState({
                    loading: false,
                    afterSales: afterSales,
                    isLoadingData: false,
                    finishedLoading: data.goodsSkuList.length === 0
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
        let {match, history} = this.props;
        let {loading, afterSales, alertMessage, confirm} = this.state;
        return (
            <div>
                {!this.isChildRoute() &&
                <div className="AfterSaleList">
                    <div className="after-header">
                        <a className="active">售后记录</a>
                        <a onClick={() => history.replace(match.url.replace('list', 'apply'))}>申请售后</a>
                    </div>
                    {afterSales &&
                    <div className="after-list">
                        {afterSales.map(after =>
                            <Link key={after.id} to={match.url + '/details/' + after.id} className="after-item">
                                <div className="status-info">
                                    <label>申请时间：{DateFormatter.toYMD(new Date(after.date))}</label>
                                    <label>{AfterSaleStatus.getStatusMap().get(after.status)}</label>
                                </div>
                                <div className="pic" style={{backgroundImage: 'url(' + after.sku.logo + ')'}}/>
                                <h6>{after.sku.name}</h6>
                                <label>{after.sku.propertyItems.join(' ')}<em>×{after.sku.number}</em></label>
                                <span><em>¥</em>{after.sku.priceForSale.toFixed(2)}</span>
                                {after.status === 2 &&
                                <div className="button" onClick={e => {
                                    e.preventDefault();
                                    history.push(match.url + '/express/' + after.id);
                                }}>填写快递单号</div>
                                }
                                {after.status === 1 &&
                                <div className="button" onClick={e => {
                                    e.preventDefault();
                                    this.setState({
                                        confirm: {
                                            title: '确定要取消售后申请吗？',
                                            onConfirm: () => {
                                                this.setState({
                                                    loading: true,
                                                    confirm: undefined
                                                }, () => {
                                                    let userContext = UserContext.get();
                                                    OrderApi.afterSaleClose({
                                                        accessToken: userContext.userToken,
                                                        afterSaleIds: [after.id]
                                                    }, data => {
                                                        after.status = 14;
                                                        this.setState({
                                                            afterSales: afterSales,
                                                            loading: false
                                                        });
                                                    }, error => {
                                                        this.setState({
                                                            loading: false,
                                                            alertMessage: error
                                                        });
                                                    });
                                                });
                                            },
                                            onCancel: () => {
                                                this.setState({confirm: undefined})
                                            }
                                        }
                                    });
                                }}>取消申请</div>
                                }
                            </Link>
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
                        <Alert message={alertMessage} onClose={() => this.setState({
                            alertMessage: undefined
                        })}/>
                    </Fade>
                    }
                    {confirm &&
                    <Fade>
                        <Confirm title={confirm.title} onConfirm={() => confirm.onConfirm()} onCancel={() => confirm.onCancel()}/>
                    </Fade>
                    }
                </TransitionGroup>
                <Route path={match.url + '/details/:afterSaleId'} component={AfterSaleDetails}/>
                <Route path={match.url + '/express/:afterSaleId'} render={props =>
                    <AfterSaleExpress {...props} afterSaleListPage={this}/>
                }/>
            </div>
        );
    }
}

const pageSize = 10;

export default AfterSaleList;