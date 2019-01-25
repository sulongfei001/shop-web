import "./ActivityNone4.css";
import { TransitionGroup } from 'react-transition-group';
import React from 'react';
import Page from "../../../ui/Page/Page";
import Screen from "../../../utils/Screen";
import FullScreenPage from "../../../ui/FullScreenPage/FullScreenPage";
import TopTitle from '../../../ui/TopTitle/TopTitle';
import Fade from "../../../ui/Fade/Fade";
import ApplyTerrace from "../img/ApplyTerrace.png";
import PhotoDog from "../img/PhotoDog2.png";
import PhotoBalloon from "../img/PhotoBalloon2.png";
import test from "../img/test1.png";

class ActivityNone4 extends Page {
    constructor(props) {
        super(props);
        this.state = {
            showTitle: false
        };
        this.topTitleScroll = this.topTitleScroll.bind(this);
        Screen.loading(true);
    }

    componentDidMount() {
        window.addEventListener("scroll", this.topTitleScroll);
        Screen.loading(false);
    }
    componentWillUnmount() {
        window.removeEventListener("scroll", this.topTitleScroll);
    }

    topTitleScroll() {
        let { showTitle } = this.state;
        if (Screen.scrollTop() > 50) {
            showTitle = true;
        } else {
            showTitle = false;
        }
        this.setState({
            showTitle: showTitle
        });
    }

    render() {
        let { history } = this.props;
        let { showTitle } = this.state;
        return (
            <div>
                {!showTitle &&
                    <TopTitle title="粉丝会预约报名" style={{ backgroundColor: "", opacity: 0.9 }} onClickBack={() => { history.goBack(); }} />}
                <TransitionGroup>
                    {showTitle && <Fade>
                        <TopTitle title="粉丝会预约报名" style={{ backgroundColor: "#333333", opacity: 0.9 }} onClickBack={() => { history.goBack(); }} />
                    </Fade>}
                </TransitionGroup>
                <FullScreenPage style={{ background: '#F0DCFC', zIndex: -1 }} />
                <div className="ActivityNone4" style={{ backgroundImage: 'url(' + PhotoBalloon + '),url(' + PhotoDog + ')' }}>
                    <div className="ActivityIntroduce">
                        <div className="IntroduceUp">活动规则</div>
                        <div className="IntroduceDown">
                            <p>一、报名条件：</p>
                            <div className="content">
                                <span>会员有效期内，满足以下条件的用户即可优先预约粉丝见面会，预约成功后，每年至少有1次参与机会。<br /></span>
                                <p>会员等级：</p>
                                <span>适用于咿呀咿呀星愿卡V3及以上级别会员。<br /></span>
                            </div>
                            <br />
                            <p>二、取消规则：</p>
                            <div className="content">
                                <span>如有特殊原因需取消已预约的粉丝见面会，需在粉丝见面会开始前48小时以上，发送【取消报名】至公众号咿呀咿呀，收到取消成功的明确回复后，视为取消成功。<br /></span>
                                <span>未能及时取消或无故缺席的用户将视为本次机会已使用。<br /></span>
                                <br />
                                <p>特别说明：</p>
                                <span >本次活动最终解释权归咿呀咿呀官方所有。<br /></span>
                            </div>
                        </div>
                    </div>
                    <div className="VIPIntroduce">
                        <div className="IntroduceUp">会员介绍</div>
                        <div className="IntroduceDown">
                            <p>成为咿呀咿呀星愿卡 V3 会员，</p>
                            <p>可获得粉丝会优先预约资格，</p>
                            <p>预约成功后可参与粉丝见面会，</p>
                            <p>快来和汪汪小亦面对面，</p>
                            <p>一起玩吧!</p>
                        </div>
                    </div>
                    <div className="ActivityPoster">
                        <img src={test} />
                    </div>
                    <div className="AuthorityText">
                        <span className="text1">快来</span>
                        <span className="text2">官方商城</span>
                        <span className="text3">看看吧</span>
                    </div>
                    <div className="ApplyTerrace">
                        <img src={ApplyTerrace} />
                    </div>
                    <div className="PassAnnotation">本次活动最终解释权归“咿呀咿呀”所有</div>
                </div>
            </div>
        );
    }
}

export default ActivityNone4;