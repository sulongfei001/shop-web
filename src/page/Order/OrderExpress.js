import './OrderExpress.css'
import React from 'react';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import Fade from "../../ui/Fade/Fade";
import FullScreenLoading from "../../ui/FullScreenLoading/FullScreenLoading";
import UserContext from "../../model/UserContext";
import OrderApi from "../../api/OrderApi";
import Alert from "../../ui/Alert/Alert";
import ExpressCompanies from "../../model/ExpressCompanies";
import Page from "../../ui/Page/Page";

class OrderExpress extends Page {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            expressId: props.match.params.expressId
        };
    }

    componentDidMount() {
        if (!UserContext.isLoggedIn(this.props.history, this.props.match)) {
            return;
        }
        let {expressId} = this.state;
        let userContext = UserContext.get();
        OrderApi.expressCompanyList({
            accessToken: userContext.userToken,
            orderExpressId: expressId
        }, data => {
            this.setState({
                loading: false,
                companyName: ExpressCompanies.get(data.expressCompany),
                expressNo: data.expressNo,
                expressHistories: data.expressCompanyList.map(c => {
                    return {
                        message: c.remark,
                        date: c.datetime
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
        let {loading, companyName, expressNo, expressHistories, alertMessage} = this.state;
        return (
            <div>
                <div className="OrderExpress">
                    <div className="basic-info">
                        <div>
                            <label>物流公司：</label>
                            <span>{companyName}</span>
                        </div>
                        <div>
                            <label>物流单号：</label>
                            <span>{expressNo}</span>
                        </div>
                    </div>
                    <ul className="express-history">
                        {expressHistories && expressHistories.map((h, i) =>
                            <li key={i}>
                                <div className={i === 0 ? 'node-current' : (i === expressHistories.length - 1 ? 'node-final' : 'node-basic')}>
                                    <div className="node"/>
                                    <div className="line"/>
                                </div>
                                <div className="express-info">
                                    <label>{h.message}</label>
                                    <span>{h.date}</span>
                                </div>
                            </li>
                        )}
                    </ul>
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
                </div>
            </div>
        );
    }
}

export default OrderExpress;