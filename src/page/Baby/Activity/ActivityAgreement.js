import "./ActivityAgreement.css"
import React from 'react';
import Page from "../../../ui/Page/Page";
import Screen from "../../../utils/Screen";
import UserContext from "../../../model/UserContext";
import ApplyAgreementBtn from "./ApplyAgreementBtn.png";
import FullScreenPage from "../../../ui/FullScreenPage/FullScreenPage";
import OrganizationContext from "../../../model/OrganizationContext";

class ActivityAgreement extends Page {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
        };
        this.AgreeProtocol = this.AgreeProtocol.bind(this);
        this.AgreementAgree = this.AgreementAgree.bind(this);
        Screen.loading(true);
    }

    componentDidMount() {
        Screen.loading(false);
    }

    AgreeProtocol() {
        this.setState({
            show: !this.state.show
        });
    }

    AgreementAgree() {
        let { history } = this.props;
        let userContext = UserContext.get();
        userContext.agreement = "a";
        UserContext.set(userContext);
        let organizationContext = OrganizationContext.get();
        let organizationId = organizationContext.organizationId ? organizationContext.organizationId : 0;
        let typeId = organizationContext.typeId ? organizationContext.typeId : "type1";
        history.push("/baby/activity/partner/" + organizationId + "/" + typeId);
    }

    render() {
        let { show } = this.state;
        return (
            <div>
                <FullScreenPage style={{ background: '#B7F2D5', zIndex: -1 }} />
                <div className="RegistrationNotice">
                    <div className="NoticeClause">
                        <div className="ClauseTitle">
                            <span>报名须知</span>
                        </div>
                        <div className="ClauseContent">
                            <p>1. 释义</p>
                            <p>本服务条款系由海选报名用户与《咿呀咿呀》就报名系统所订立的相关权利义务规范。因此，请在报名前，确实详细阅读本服务条款的所有内容，当您点选同意键或使用《咿呀咿呀》报名服务，即视为同意并接受本服务条款的所有规范并愿受其约束。</p>
                            <p>用户系指通过报名系统参加《咿呀咿呀》海选的未成年人及其法定代理人或监护人，由未成年人的法定代理人或监护人按照要求填写用户的相关信息。</p>
                            <br />

                            <p>2. 用户的基本义务</p>
                            <p>2.1 用户同意于投稿时提供完整、详尽、真实的个人资料。由于信息有误导致的一系列后果（如无法完成报名、无法查询海选进展等），均由用户自行承担。</p>
                            <p>2.2 用户在接受本服务条款的同时，亦表示其同时接受本协议条款的其他附属条款，《咿呀咿呀》有权在不另对用户进行个别通知的情况下，添加本协议的其他附属条款。</p>
                            <br />
                            <p>3. 个人资料、肖像权</p>
                            <p>3.1 对于用户所留存的个人资料，除下列情形外，《咿呀咿呀》同意在未得到用户同意前，不公开对外披露：</p>
                            <p>3.1.1 基于法律规定；</p>
                            <p>3.1.2 基于司法机关或其它有权机关基于法定程序的要求；</p>
                            <p>3.1.3 为保障《咿呀咿呀》的权益。</p>
                            <br />
                            <p>3.2  用户授权《咿呀咿呀》出品方享有用户在海选期间提供的个人影像资料以及在海选活动中拍摄到的用户肖像权的使用权，包括但不限于：为《咿呀咿呀》节目的摄制、播出、出版、发行之目的，将用户的个人影像资料和在海选活动中拍摄到的个人肖像用于海选活动中的评委和观众的审查和观赏、为本海选活动及《咿呀咿呀》节目的宣传推广而制作的各种宣传资料（宣传视频、宣传单、海报、画册等）。对于 《咿呀咿呀》出品方在上述授权范围内的使用，用户同意不会加以限制，并不获得报酬。</p>
                            <br />
                            <p> 4 报名费用及收费取消说明</p>
                            <p>4.1 用户可以在活动开始前取消报名，全部报名费用可以退还。在海选活动开始前24小时以上取消的，用户可以再次报名参加本次或后期海选活动；在海选活动开始前24小时以内取消的，用户不得再次报名参加本次海选活动，在规定期限后，用户可以在后期海选活动中报名。</p>
                            <p>4.2 用户报名后缺席的，即：在报名系统中选择报名并支付报名费用后、海选活动开始前未在系统中点击取消报名，且活动当天也没有到场扫描记录的，报名费用不予退还，但用户可以马上再次报名后期海选活动。</p>
                            <p>4.3 具体退费规定详见参加报名海选系统内《取消报名须知》</p>
                            <br />
                            <p>5. 本活动最终解释权归《咿呀咿呀》出品方所有。</p>
                            <p>《咿呀咿呀》感谢您的配合。</p>

                            <p>上海习游文化传播有限公司</p>
                        </div>
                    </div>
                    <div className="NoticeAgreement" onClick={this.AgreeProtocol}>
                        {!show &&
                            <div className="AgreementBtn" onClick={this.AgreeProtocol}>

                            </div>
                        }
                        {show &&
                            <div className="AgreementBtn" onClick={this.AgreeProtocol}
                                style={{ backgroundImage: 'url(' + ApplyAgreementBtn + ')' }}>
                            </div>
                        }
                        <div className="AgreementTitle">
                            我已阅读以上信息并同意
                        </div>
                    </div>
                    {!show &&
                        <div className="NoticeButton">
                            <span>我已阅读并同意</span>
                        </div>
                    }
                    {show &&
                        <div className="NoticeButtonSelected" onClick={this.AgreementAgree}>
                        </div>
                    }
                </div>
            </div>
        )
    }
}

export default ActivityAgreement;