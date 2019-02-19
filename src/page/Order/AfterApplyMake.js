import './AfterApplyMake.css';
import React from 'react';
import PropTypes from 'prop-types';
import {TransitionGroup} from 'react-transition-group';
import Fade from "../../ui/Fade/Fade";
import FullScreenLoading from "../../ui/FullScreenLoading/FullScreenLoading";
import imagePath from './path.png';
import imageCamera from './camera.png';
import UserContext from "../../model/UserContext";
import Uploader from "../../utils/Uploader";
import Confirm from "../../ui/Confirm/Confirm";
import Alert from "../../ui/Alert/Alert";
import FixedBottom from "../../ui/FixedBottom/FixedBottom";
import Mask from "../../ui/Mask/Mask";
import MessageBottom from "../../ui/MessageBottom/MessageBottom";
import SlideBottom from "../../ui/SlideBottom/SlideBottom";
import OrderApi from "../../api/OrderApi";
import AfterSaleReasons from "../../model/AfterSaleReasons";
import Screen from "../../utils/Screen";
import Page from "../../ui/Page/Page";

class AfterApplyMake extends Page {
    constructor(props) {
        super(props);
        this.canDec = this.canDec.bind(this);
        this.canInc = this.canInc.bind(this);
        this.dec = this.dec.bind(this);
        this.inc = this.inc.bind(this);
        this.confirmDeletePic = this.confirmDeletePic.bind(this);
        this.submit = this.submit.bind(this);
        this.resize = this.resize.bind(this);
        let data = props.data
        this.state = {
            loading: true,
            orderExpressId: data.orderExpressId,
            orderGoodsId: data.orderGoodsId,
            sku: data.sku
        };
    }

    componentDidMount() {
        let {history, match} = this.props;
        if (!UserContext.isLoggedIn(history, match)) {
            return;
        }
        this.uploader = Uploader.create('lnkUploadAfterPic', 'order/after', up => {
            let {pics} = this.state;
            if (!pics) pics = [];
            pics.push(up);
            this.setState({pics: pics});
        }, error => this.setState({alertMessage: error}));

        window.addEventListener('resize', this.resize);

        this.setState({
            loading: false,
            number: 1,
            reasons: AfterSaleReasons.get(),
            aspectRatio: Screen.clientHeight() / Screen.clientWidth()
        });
    }

    componentWillUnmount() {
        if (this.uploader) this.uploader.destroy();
        window.removeEventListener('resize', this.resize);
    }

    resize() {
        this.setState({
            aspectRatio: Screen.clientHeight() / Screen.clientWidth()
        });
    }

    canDec() {
        let {number} = this.state;
        return number > 1;
    }

    dec() {
        if (this.canDec()) {
            this.setState({
                number: this.state.number - 1
            });
        }
    }

    canInc() {
        let {number, sku} = this.state;
        return number < sku.number;
    }

    inc() {
        if (this.canInc()) {
            this.setState({
                number: this.state.number + 1
            });
        }
    }

    confirmDeletePic(pic) {
        this.setState({
            confirm: {
                message: '要删除这张照片吗？',
                onConfirm: () => this.setState({
                    pics: this.state.pics.filter(p => p.url !== pic.url),
                    confirm: undefined
                }),
                onCancel: () => this.setState({confirm: undefined})
            }
        });
    }

    submit() {
        let {reason, number, description, orderExpressId, orderGoodsId, pics, reasons} = this.state;
        let {history, afterApplyPage} = this.props;
        if (!reason) {
            this.setState({ alertMessage: '请选择申请售后原因' });
            return;
        }
        if (!description) {
            this.setState({ alertMessage: '请填写问题描述' });
        }
        if (description.length < 10) {
            this.setState({ alertMessage: '问题描述需要至少输入10个字' });
            return;
        }
        this.setState({
            loading: true
        }, () => {
            let userContext = UserContext.get();
            if (!pics) pics = [];
            OrderApi.afterSaleCreate({
                accessToken: userContext.userToken,
                orderExpressId: orderExpressId,
                orderGoodsId: orderGoodsId,
                quantity: number,
                reason: reasons.indexOf(reason) + 1,
                remark: description,
                pictureUrls: pics.map(pic => pic.relativeUrl)
            }, data => {
                if (afterApplyPage) {
                    let {orders} = afterApplyPage.state;
                    for (let i = 0; i < orders.length; i++) {
                        if (orders[i].id === orderExpressId + '_' + orderGoodsId) {
                            orders[i].afterSaleId = data.afterSaleId;
                            break;
                        }
                    }
                    afterApplyPage.setState({
                        orders: orders
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
        let {loading,alertMessage,confirm,sku,number,reason,description,pics,showReasons,reasons,aspectRatio} = this.state;
        return (
            <div className="AfterApplyMake">
                {sku &&
                <div>
                    <div className="sku">
                        <div className="logo" style={{backgroundImage: 'url(' + sku.logo + ')'}}/>
                        <h6>{sku.name}</h6>
                        <label>{sku.propertyItems.join(' ')}<em>×{sku.number}</em></label>
                        <span><em>¥</em>{sku.priceForSale.toFixed(2)}</span>
                    </div>
                    <a className="reason" style={{backgroundImage: 'url(' + imagePath + ')'}} onClick={() => this.setState({showReasons: true})}>
                        <label><em>*</em>申请售后原因</label>
                        <span>{reason ? reason : '请选择'}</span>
                    </a>
                    <div className="number">
                        <label><em>*</em>申请数量</label>
                        <span>
                            <a className={this.canDec() ? '' : 'disabled'} onClick={this.dec}>-</a>
                            <a>{number}</a>
                            <a className={this.canInc() ? '' : 'disabled'} onClick={this.inc}>+</a>
                        </span>
                    </div>
                    <div className="description">
                        <label><em>*</em>问题描述</label>
                        <textarea value={description ? description : ''} placeholder="请您在此描述详细问题" onChange={e => this.setState({ description: e.target.value })}/>
                    </div>
                </div>
                }
                <div className="upload" style={{display: showReasons ? 'none' : 'block'}}>
                    <label>上传图片</label>
                    <a id="lnkUploadAfterPic" className="button-upload" style={{backgroundImage: 'url(' + imageCamera + ')', zIndex: ''}}>最多8张</a>
                    {pics && pics.map(pic =>
                        <a key={pic.relativeUrl} className="pic" style={{backgroundImage: 'url(' + pic.url + '?x-oss-process=style/order_after)'}} onClick={() => this.confirmDeletePic(pic)}> </a>
                    )}
                </div>
                {aspectRatio > 1.2 &&
                <FixedBottom>
                    <a className="submit" onClick={() => this.submit()}>提交</a>
                </FixedBottom>
                }
                <TransitionGroup>
                    {showReasons &&
                    <Fade>
                        <Mask onClick={() => this.setState({
                            showReasons: undefined
                        })}/>
                    </Fade>
                    }
                    {showReasons &&
                    <SlideBottom>
                        <MessageBottom title={'申请售后原因'} onClose={() => this.setState({showReasons: undefined})} onConfirm={() => this.setState({showReasons: undefined})}>
                            <div className="reasons">
                                {reasons.map(r =>
                                    <a key={r} onClick={() => this.setState({
                                        reason: r,
                                        showReasons: undefined
                                    })}>{r}</a>
                                )}
                            </div>
                        </MessageBottom>
                    </SlideBottom>
                    }
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
                    {confirm &&
                    <Fade>
                        <Confirm message={confirm.message} onConfirm={confirm.onConfirm} onCancel={confirm.onCancel}/>
                    </Fade>
                    }
                </TransitionGroup>
            </div>
        );
    }
}

AfterApplyMake.propTypes = {
    afterApplyPage: PropTypes.object
};

export default AfterApplyMake;