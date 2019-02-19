import './AccountLogin.css';
import React from 'react';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import imageClose from './close.png';
import FixedBottom from "../../ui/FixedBottom/FixedBottom";
import FullScreenPage from "../../ui/FullScreenPage/FullScreenPage";
import Fade from "../../ui/Fade/Fade";
import Alert from "../../ui/Alert/Alert";
import RegexPatterns from "../../utils/RegexPatterns";
import AccountApi from "../../api/AccountApi";
import FullScreenLoading from "../../ui/FullScreenLoading/FullScreenLoading";
import UserContext from "../../model/UserContext";
import SlideBottom from "../../ui/SlideBottom/SlideBottom";
import Mask from "../../ui/Mask/Mask";
import FixedTop from "../../ui/FixedTop/FixedTop";
import Weixin from "../../utils/Weixin";
import Screen from "../../utils/Screen";
import Page from "../../ui/Page/Page";
import imageLogo from './logo.png';
import imagePhone from './phone.png';
import imagePassword from './password.png';

class AccountLogin extends Page {
    constructor(props) {
        super(props);
        this.getVerificationCode = this.getVerificationCode.bind(this);
        this.coolDown = this.coolDown.bind(this);
        this.coolDownTick = this.coolDownTick.bind(this);
        this.login = this.login.bind(this);
        this.resize = this.resize.bind(this);
        this.state = {
            coolDownSeconds: 0,
            show: false
        };
    }

    componentDidMount() {
        let userContext = UserContext.get();
        if (UserContext.isWeixin()) {
            if ((userContext.weixinTokenExpires && parseInt(userContext.weixinTokenExpires, 10) - parseInt(Date.now(), 10) < 1000000) || !userContext.weixinToken || !userContext.weixinOpenId) {
                Screen.alert('微信授权过期，需重新授权', () => {
                    UserContext.remove();
                    Weixin.goToOAuthPage('/');
                });
                return;
            }
        }
        window.addEventListener('resize', this.resize);
        this.setState({
            show: true,
            aspectRatio: Screen.clientHeight() / Screen.clientWidth()
        });
        Screen.loading(false);
    }

    componentWillUnmount() {
        if (this.coolDownTimer) {
            clearTimeout(this.coolDownTimer);
        }
        window.removeEventListener('resize', this.resize);
    }

    resize() {
        this.setState({
            aspectRatio: Screen.clientHeight() / Screen.clientWidth()
        });
    }

    setFormData(name, value) {
        let {formData} = this.state;
        if (!formData) formData = {};
        formData[name] = value;
        this.setState({formData: formData});
    }

    getVerificationCode() {
        let {formData, coolDownSeconds} = this.state;
        if (coolDownSeconds > 0) return;
        if (formData && formData.phoneNumber && formData.phoneNumber.match(RegexPatterns.phoneNumber())) {
            this.coolDown();
            AccountApi.sendAuthorizeSms({
                phoneNumber: formData.phoneNumber,
                authorizeType: 1
            }, data => {
                this.setState({smsToken: data.smsToken});
            }, error => this.setState({alertMessage: error}));
        } else {
            this.setState({alertMessage: INVALID_PHONE_NUMBER});
        }
    }

    coolDown() {
        if (this.coolDownTimer) {
            clearTimeout(this.coolDownTimer);
        }
        this.setState({
            coolDownSeconds: 90
        });
        this.coolDownTimer = setTimeout(this.coolDownTick, 1000);
    }

    coolDownTick() {
        clearTimeout(this.coolDownTimer);
        let {coolDownSeconds} = this.state;
        coolDownSeconds--;
        this.setState({coolDownSeconds: coolDownSeconds});
        if (coolDownSeconds > 0) {
            this.coolDownTimer = setTimeout(this.coolDownTick, 1000);
        }
    }

    login() {
        let userContext = UserContext.get();
        let {formData, smsToken} = this.state;
        if (!formData || !formData.phoneNumber || !formData.phoneNumber.match(RegexPatterns.phoneNumber())) {
            this.setState({alertMessage: INVALID_PHONE_NUMBER});
            return;
        }
        if (!formData || !formData.verificationCode || !formData.verificationCode.match('^[0-9]{4}$')) {
            this.setState({alertMessage: EMPTY_VERIFICATION_CODE});
            return;
        }
        if (!smsToken) {
            this.setState({alertMessage: NO_VERIFICATION_CODE});
            return;
        }
        this.setState({show: false});
        if (UserContext.isWeixin()) {
            AccountApi.authorizeWithWeixin({
                weixinToken: userContext.weixinToken,
                weixinOpenId: userContext.weixinOpenId,
                smsToken: smsToken,
                verificationCode: formData.verificationCode
            }, data => {
                userContext.userToken = data.accessToken;
                UserContext.set(userContext);
                this.props.history.replace(userContext.pathname);
            }, error => {
                this.setState({
                    show: true,
                    alertMessage: error
                });
            });
        } else if (UserContext.isBestnihonApp()) {
            window.Bestnihon.getAccessToken();
        } else {
            AccountApi.authorizeWithPhone({
                smsToken: smsToken,
                verificationCode: formData.verificationCode,
                autoRegister: true,
            }, data => {
                userContext.userToken = data.accessToken;
                UserContext.set(userContext);
                this.props.history.replace(userContext.pathname);
            }, error => {
                this.setState({
                    show: true,
                    alertMessage: error
                });
            });
        }
    }

    render() {
        let {formData, coolDownSeconds, alertMessage, show, showPrivacy, aspectRatio} = this.state;
        return (
            <FullScreenPage style={{background: '#fff'}}>
                <TransitionGroup>
                    {show &&
                    <Fade>
                        <div className="AccountLogin">
                            <div className="image-welcome" style={{backgroundImage: 'url(' + imageLogo + ')'}} alt=""/>
                            <div className="form-input" style={{backgroundImage: 'url(' + imagePhone + ')'}}>
                                <div className="splitter"/>
                                <input type="tel" className="phone-number" placeholder="请输入手机号" ref={input => this.txtPhoneNumber = input} value={formData && formData.phoneNumber ? formData.phoneNumber : ''} onChange={e => this.setFormData('phoneNumber', e.target.value)}/>
                            </div>
                            <div className="form-input" style={{backgroundImage: 'url(' + imagePassword + ')'}}>
                                <div className="splitter"/>
                                <input type="number" className="verification-code" placeholder="请输入验证码" ref={input => this.txtVerificationCode = input} value={formData && formData.verificationCode ? formData.verificationCode : ''} onChange={e => this.setFormData('verificationCode', e.target.value)}/>
                                <a className="get-code" onClick={this.getVerificationCode}>{coolDownSeconds <= 0 ? '获取验证码' : (coolDownSeconds + ' 秒')}</a>
                            </div>
                            <a className="button-login" onClick={this.login}>登录</a>
                            {aspectRatio > 1.2 &&
                            <FixedBottom>
                                <div className="private-policy">
                                    登录即代表您已同意
                                    <a className="button-policy" onClick={() => this.setState({showPrivacy: true})}>咿呀咿呀隐私政策</a>
                                </div>
                            </FixedBottom>
                            }
                            <TransitionGroup>
                                {alertMessage &&
                                <Fade>
                                    <Alert message={alertMessage} onClose={() => {
                                        this.setState({alertMessage: undefined});
                                        if (INVALID_PHONE_NUMBER === alertMessage) {
                                            this.txtPhoneNumber.focus();
                                        } else if (EMPTY_VERIFICATION_CODE === alertMessage) {
                                            this.txtVerificationCode.focus();
                                        } else if (INVALID_VERIFICATION_CODE === alertMessage) {
                                            this.setState({verificationCode: undefined});
                                        }
                                    }}/>
                                </Fade>
                                }
                                {showPrivacy &&
                                <Fade>
                                    <Mask/>
                                </Fade>
                                }
                                {showPrivacy &&
                                <SlideBottom>
                                    <FullScreenPage style={{background: '#fff'}}>
                                        <div className="privacy">
                                            <FixedTop>
                                                <a className="close" style={{backgroundImage: 'url(' + imageClose + ')'}} onClick={() => this.setState({showPrivacy: undefined})}> </a>
                                            </FixedTop>
                                            <h5>会员协议</h5>
                                            <p>欢迎您访问咿呀咿呀网站 ！</p>
                                            <p>本隐私声明是我们对访问者隐私保护的许诺。网站访问者（以下也称“用户”或“您”）的信息对我们非常重要，并且我们非常重视对您的隐私信息的保护,因此我们特对隐私信息的收集、使用和许可等作如下声明：</p>
                                            <h6>一、用户信息的收集范围</h6>
                                            <p>
                                                我们获取信息的主要目的在于向用户提供一个顺畅、高效的购物流程，并致力于不断完善和提升购物体验。我们可能会收集和使用的信息包括您主动提供给我们、我们主动向您收集以及第三方向我们提供的信息，具体包括：<br/>
                                                （1）浏览信息：包括您的网页浏览记录、搜索记录等信息；<br/>
                                                （2）注册信息：包括您在注册时设置的用户名、用户昵称，以及在注册时填写及后期补充的姓名、公司名称、证件号码、地址、邮箱、联系电话、传真等个人或公司信息。<br/>
                                                （3）购物信息：包括购买人和收货人姓名、地址、联系电话等信息，以及在收货凭证上的签名。<br/>
                                                （4）支付信息：包括付款人、付款方式、付款金额、银行账号等信息。<br/>
                                                （5）设备信息：包括您的浏览器和计算机上的信息，如IP地址、浏览器的类型、语言、访问时间、软硬件特征等数据。当您下载或使用我们的客户端软件，或访问移动WAP站点时，我们会读取与您的位置和移动设备相关的信息，如设备型号、设备识别码、操作系统、分辨率、电信运营商等数据。<br/>
                                                （6）其他在客服咨询、投诉或电话回访中获得的信息。
                                            </p>
                                            <h6>二、用户信息的用途 </h6>
                                            <p>
                                                为了向您提供服务，并不断提升我们的服务体验，我们将不可避免地使用您的信息，信息的使用方式和用途主要包括：<br/>
                                                （1）向您提供你需要或可能感兴趣的产品或服务信息；<br/>
                                                （2）就您的要求向您提供咨询服务，或向您做出回应或与您沟通；<br/>
                                                （3）根据您的申请，向您提供会员帐号，并授予您在咿呀咿呀X网站购买商品及参加各种服务的相应会员资格，如促销活动、购买优惠资格；<br/>
                                                （4）收取、处理或退还款项；<br/>
                                                （5）为评估和完善我们的服务，联系您进行调研；<br/>
                                                （6）为评估和完善我们的服务，进行数据分析，如购买行为或趋势分析、市场或顾客调查、财务分析；<br/>
                                                （7）在事先获得您同意的情况下，向您指定的联系方式发送产品和服务信息；<br/>
                                                （8）预防和追究各种违法、犯罪活动或违反我们政策规则的法律责任；<br/>
                                                （9）经您许可的其他用途。
                                            </p>
                                            <h6>三、用户信息的共享、披露与转让</h6>
                                            <p>
                                                1、用户的信息是我们业务的重要组成部分，我们不会出售或以其他方式共享您的个人信息，但如下情况除外：<br/>
                                                （1）与我们的关联公司、入驻商家共享相关信息；<br/>
                                                （2）与为我们提供配送服务、收付款服务或为我们发送信函的合作伙伴共享相关信息；<br/>
                                                （3）根据法律、法规及法律程序的规定；<br/>
                                                （4）根据政府部门（如行政机构、司法机构）的要求；<br/>
                                                （5）事先获得您的许可。<br/>
                                                2、为了给您提供更好、更优、更加个性化的服务，或共同为您提供服务，或为了预防互联网犯罪（如诈骗）的目的，我们的关联方（如易付宝公司）、合作伙伴（如银行）会依据法律的规定或与您的约定或征得您同意的前提下，向我们分享您的个人信息。
                                            </p>
                                            <h6>四、其他网站链接</h6>
                                            <p>
                                                本网站可能会包含至其他网站的链接，此类网站一般不是我们运营。因此，我们建议您在访问链接网站时谨慎浏览和使用；您在使用此类网站服务时造成的任何后果，我们概不负责。
                                            </p>
                                            <h6>五、未成年人的保护</h6>
                                            <p>
                                                我们非常重视对未成年人个人信息的保护。我们不希望未成年人直接使用咿呀咿呀X网站提供的产品或服务，如果您是未成年人，请与您监护人一起或在监护人的监督下使用本网站的产品或服务。
                                            </p>
                                            <h6>六、《隐私声明》的更新</h6>
                                            <p>
                                                我们可能会不时更新本《隐私声明》，并在更新时在本网站上醒目位置发布公告，我们欢迎您随时会来查看本声明。
                                            </p>
                                            <p>
                                                如果您对本隐私声明或咿呀咿呀的隐私保护措施以及您在使用中的问题有任何意见和建议请直接联系在线客服咨询。
                                            </p>
                                            <p>
                                                公司地址：上海市闵行区古北路1699号1107室   电话：021-52237811
                                            </p>
                                        </div>
                                    </FullScreenPage>
                                </SlideBottom>
                                }
                            </TransitionGroup>
                        </div>
                    </Fade>
                    }
                    {!show &&
                    <Fade>
                        <FullScreenLoading/>
                    </Fade>
                    }
                </TransitionGroup>
            </FullScreenPage>
        );
    }
}

const INVALID_PHONE_NUMBER = '请输入11位手机号码';

const EMPTY_VERIFICATION_CODE = '请输入4位验证码';

const NO_VERIFICATION_CODE = '请先获取验证码';

const INVALID_VERIFICATION_CODE = '验证码错误';

export default AccountLogin;