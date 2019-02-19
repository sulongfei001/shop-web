import './AfterSaleExpress.css';
import React from 'react';
import PropTypes from 'prop-types';
import {TransitionGroup} from 'react-transition-group';
import Fade from "../../ui/Fade/Fade";
import FullScreenLoading from "../../ui/FullScreenLoading/FullScreenLoading";
import ExpressCompanies from "../../model/ExpressCompanies";
import Alert from "../../ui/Alert/Alert";
import FixedBottom from "../../ui/FixedBottom/FixedBottom";
import SlideBottom from "../../ui/SlideBottom/SlideBottom";
import MessageBottom from "../../ui/MessageBottom/MessageBottom";
import UserContext from "../../model/UserContext";
import OrderApi from "../../api/OrderApi";
import Mask from "../../ui/Mask/Mask";
import Page from "../../ui/Page/Page";

class AfterSaleExpress extends Page {
    constructor(props) {
        super(props);
        this.submit = this.submit.bind(this);
        let {afterSaleId} = props.match.params;
        this.state = {
            loading: true,
            afterSaleId: parseInt(afterSaleId, 10)
        }
    }

    componentDidMount() {
        let {history, match} = this.props;
        if (!UserContext.isLoggedIn(history, match)) {
            return;
        }
        this.setState({
            loading: false
        });
    }

    submit() {
        let {history, afterSaleListPage} = this.props;
        let {afterSaleId, expressNo, expressCompany} = this.state;
        if (!expressCompany) {
            this.setState({alertMessage: '请选择快递公司'});
            return;
        }
        if (!expressNo || expressNo.trim().length === 0) {
            this.setState({alertMessage: '请填写快递单号'});
            return;
        }
        this.setState({
            loading: true
        }, () => {
            let userContext = UserContext.get();
            OrderApi.returnExpressCompany({
                accessToken: userContext.userToken,
                afterSaleId: afterSaleId,
                returnExpressNo: expressNo,
                returnExpressCompany: expressCompany
            }, data => {
                if (afterSaleListPage) {
                    let {afterSales} = afterSaleListPage.state;
                    for (let i = 0; i < afterSales.length; i++) {
                        if (afterSales[i].id === afterSaleId) {
                            afterSales[i].status = 4;
                            break;
                        }
                    }
                    afterSaleListPage.setState({
                        afterSales: afterSales
                    });
                }
                history.goBack();
            }, error => {
                this.setState({
                    loading: false,
                    alertMessage: error
                });
            });
        });
    }

    render() {
        let {loading, alertMessage, expressNo, expressCompany, showCompanies} = this.state;
        return (
            <div>
                <div className="AfterSaleExpress">
                    <ul className="lines">
                        <li>
                            <label>快递公司名称</label>
                            <span onClick={() => this.setState({showCompanies: true})}>{expressCompany ? ExpressCompanies.get(expressCompany) : '请选择快递公司'}</span>
                        </li>
                        <li>
                            <label>快递单号</label>
                            <input type="text" placeholder="请输入快递单号" value={expressNo ? expressNo : ''} onChange={e => this.setState({expressNo: e.target.value})}/>
                        </li>
                    </ul>
                    <FixedBottom>
                        <a className="submit" onClick={() => this.submit()}>提交信息</a>
                    </FixedBottom>
                    <TransitionGroup>
                        {showCompanies &&
                        <Fade>
                            <Mask onClick={() => this.setState({
                                showCompanies: undefined
                            })}/>
                        </Fade>
                        }
                        {showCompanies &&
                        <SlideBottom>
                            <MessageBottom title={'选择快递公司'} onClose={() => this.setState({showCompanies: undefined})} onConfirm={() => this.setState({showReasons: undefined})}>
                                <div className="companies">
                                    {ExpressCompanies.getKeyValues().map(kv =>
                                        <a key={kv.key} onClick={() => this.setState({
                                            expressCompany: kv.key,
                                            showCompanies: undefined
                                        })}>{kv.value}</a>
                                    )}
                                </div>
                            </MessageBottom>
                        </SlideBottom>
                        }
                    </TransitionGroup>
                </div>
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

AfterSaleExpress.propTypes = {
    afterSaleListPage: PropTypes.object
};

export default AfterSaleExpress;