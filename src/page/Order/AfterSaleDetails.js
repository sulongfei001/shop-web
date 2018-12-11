import './AfterSaleDetails.css';
import React from 'react';
import {TransitionGroup} from 'react-transition-group';
import Fade from "../../ui/Fade/Fade";
import FullScreenLoading from "../../ui/FullScreenLoading/FullScreenLoading";
import DateFormatter from "../../utils/DateFormatter";
import AfterSaleRecordFrom from "../../model/AfterSaleRecordFrom";
import Alert from "../../ui/Alert/Alert";
import UserContext from "../../model/UserContext";
import OrderApi from "../../api/OrderApi";
import AfterSaleReasons from "../../model/AfterSaleReasons";
import Page from "../../ui/Page/Page";

class AfterSaleDetails extends Page {
    constructor(props) {
        super(props);
        let {afterSaleId} = props.match.params;
        this.state = {
            loading: true,
            afterSaleId: afterSaleId
        };
    }

    componentDidMount() {
        let {history,match} = this.props;
        if (!UserContext.isLoggedIn(history, match)) {
            return;
        }
        let {afterSaleId} = this.state;
        let userContext = UserContext.get();
        OrderApi.afterSaleInfo({
            accessToken: userContext.userToken,
            afterSaleId: afterSaleId
        }, data => {
            this.setState({
                loading: false,
                afterSaleNo: data.afterSaleNo,
                sku: {
                    date: data.createDate,
                    reason: AfterSaleReasons.get()[data.reason - 1],
                    number: data.quantity,
                    description: data.remark,
                    pics: data.pictureList
                },
                records: data.afterSaleTransactionList.map(a => {
                    return {
                        id: a.afterSaleTransactionId,
                        from: a.from,
                        date: a.date,
                        status: a.state,
                        message: a.description
                    };
                })
            });
        }, error => {
            this.setState({
                loading: false,
                alertMessage: error
            });
        });
    }

    render() {
        let {loading, alertMessage, afterSaleNo, sku, records} = this.state;
        return (
            <div>
                {records &&
                <div className="AfterSaleDetails">
                    <div className="after-header">
                        <h5>最新记录</h5>
                        <label>{records[records.length - 1].message}　{DateFormatter.toYMDHMS(new Date(records[records.length - 1].date))}</label>
                    </div>
                    <div className="after-sku">
                        <div className="details">
                            <label>售后单号：{afterSaleNo}</label>
                        </div>
                    </div>
                    <div className="after-sku">
                        <div className="info">
                            <label>自己</label>
                            <label>{DateFormatter.toYMDHMS(new Date(sku.date))}</label>
                        </div>
                        <div className="details">
                            <label>申请售后原因：{sku.reason}</label>
                            <label>申请数量：{sku.number}</label>
                            <label>问题描述：{sku.description}</label>
                            {sku.pics && sku.pics.length > 0 &&
                            <div>
                                <label>上传图片：</label>
                                {sku.pics &&
                                <span className="pics">
                                {sku.pics.map((pic, i) =>
                                    <a key={i} style={{backgroundImage: 'url(' + pic + ')'}}> </a>
                                )}
                                </span>
                                }
                            </div>
                            }
                        </div>
                    </div>
                    {records.map((record, i) => {
                        return i === 0 ? '' : (
                            <div key={record.id} className="record-item">
                                <div className="info">
                                    <label>{AfterSaleRecordFrom.getFromMap().get(record.from)}</label>
                                    <label>{DateFormatter.toYMDHMS(new Date(record.date))}</label>
                                </div>
                                <div className="details">
                                    <label>{record.message}</label>
                                </div>
                            </div>
                        );
                    })}
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
                        <Alert message={alertMessage} onClose={() => this.setState({alertMessage: undefined})}/>
                    </Fade>
                    }
                </TransitionGroup>
            </div>
        );
    }
}

export default AfterSaleDetails;