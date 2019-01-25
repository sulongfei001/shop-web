import "./ActivityNone5.css";
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

class ActivityNone5 extends Page {
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
                    <TopTitle title="直播棚录报名" style={{ backgroundColor: "", opacity: 0.9 }} onClickBack={() => { history.goBack(); }} />}
                <TransitionGroup>
                    {showTitle && <Fade>
                        <TopTitle title="直播棚录报名" style={{ backgroundColor: "#333333", opacity: 0.9 }} onClickBack={() => { history.goBack(); }} />
                    </Fade>}
                </TransitionGroup>
                <FullScreenPage style={{ background: '#DCFCEF', zIndex: -1 }} />
                <div className="ActivityNone5" style={{ backgroundImage: 'url(' + PhotoBalloon + '),url(' + PhotoDog + ')' }}>
                    <div className="ActivityIntroduce">
                        <div className="IntroduceUp">活动规则</div>
                        <div className="IntroduceDown">
                            <p>一、报名条件：</p>
                            <div className="content">
                                <span>会员有效期内，满足以下条件的用户即可获得棚录培训报名资格，通过培训的宝宝可以直接获得棚录拍摄机会，每年享有至少1次录影机会。<br /></span>
                                <p>年龄要求：</p>
                                <span>适用于1-4.5岁的会员宝宝，1-3岁宝宝入选后可在节目中播放录制内容，3-4.5岁宝宝入选后会在节目以外的推广时段播放录制内容。<br /></span>
                                <p>会员等级：</p>
                                <span>适用于咿呀咿呀V4及以上级别会员。<br /></span>
                            </div>
                            <br />
                            <p>二、取消规则：</p>
                            <div className="content">
                                <span>如有特殊原因需取消已报名的棚录培训，需在培训开始前24小时以上，发送【取消报名】至公众号咿呀咿呀，收到取消成功的明确回复后，视为取消成功。<br /></span>
                                <span>未能及时取消或无故缺席的用户视为本次机会已使用，将自缺席之日起1周内无法报名棚录培训。<br /></span>
                            </div>
                            <br />
                            <p>三、棚录培训结果：</p>
                            <div className="content">
                                <span>棚录培训结果将5个工作日内发布，可通过咿呀咿呀公众号查询。<br /></span>
                                <br />
                                <p>特别说明：</p>
                                <span>本次活动最终解释权归咿呀咿呀官方所有。<br /></span>
                            </div>
                        </div>
                    </div>
                    <div className="VIPIntroduce">
                        <div className="IntroduceUp">会员介绍</div>
                        <div className="IntroduceDown">
                            <p>成为咿呀咿呀星愿卡 V4 会员，</p>
                            <p>可参与宝宝直通棚录培训报名，</p>
                            <p>报名成功后可参与棚录特别培训活动，</p>
                            <p>通过培训的宝宝可以参与节目录制，</p>
                            <p>快来获得特别培训，一起跳《哇哦》体操吧!</p>
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

export default ActivityNone5;