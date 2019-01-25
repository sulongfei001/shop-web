import "./ActivityNone2.css";
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

class ActivityNone2 extends Page {
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
                    <TopTitle title="电视模特报名" style={{ backgroundColor: "", opacity: 0.9 }} onClickBack={() => { history.goBack(); }} />}
                <TransitionGroup>
                    {showTitle && <Fade>
                        <TopTitle title="电视模特报名" style={{ backgroundColor: "#333333", opacity: 0.9 }} onClickBack={() => { history.goBack(); }} />
                    </Fade>}
                </TransitionGroup>
                <FullScreenPage style={{ background: '#DCDFFC', zIndex: -1 }} />
                <div className="ActivityNone2" style={{ backgroundImage: 'url(' + PhotoBalloon + '),url(' + PhotoDog + ')' }}>
                    <div className="ActivityIntroduce">
                        <div className="IntroduceUp">活动规则</div>
                        <div className="IntroduceDown">
                            <p>一、报名条件：</p>
                            <div className="content">
                                <span>会员有效期内，满足以下报名条件的用户即可参与报名电视模特海选活动。<br /></span>
                                <p>年龄要求：</p>
                                <span>适用于1-4.5岁的会员宝宝。<br /></span>
                                <p>会员等级：</p>
                                <span>适用于咿呀咿呀V4及以上级别会员。<br /></span>
                            </div>
                            <br />
                            <p>二、取消规则：</p>
                            <div className="content">
                                <span>如有特殊原因需取消已报名的电视模特海选活动，需在电视模特海选活动开始前24小时以上，发送【取消报名】至公众号咿呀咿呀，收到取消成功的明确回复后，视为取消成功。<br /></span>
                                <span>未能及时取消或无故缺席的用户视为本次机会已使用，将自缺席之日起1周内无法报名电视模特海选活动。<br /></span>
                            </div>
                            <br />
                            <p>三、海选结果：</p>
                            <div className="content">
                                <span>每次海选结果将于5个工作日内发布，可通过咿呀咿呀公众号查询。<br /></span>
                                <br />
                                <p>特别说明：</p>
                                <span>电视模特海选入选后，敬请等待拍摄通知，入选后1个月内等待期无法报名电视模特海选。<br /></span>
                                <span>本次活动最终解释权归咿呀咿呀官方所有。<br /></span>
                            </div>
                        </div>
                    </div>
                    <div className="VIPIntroduce">
                        <div className="IntroduceUp">会员介绍</div>
                        <div className="IntroduceDown">
                            <p>成为咿呀咿呀星愿卡 V4 会员，</p>
                            <p>可参与宝宝电视模特海选报名，</p>
                            <p>报名成功后可参与电视广告模特海选活动，</p>
                            <p>成功入选的宝贝</p>
                            <p>可获得咿呀咿呀品牌电视广告拍摄的机会哦！</p>
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

export default ActivityNone2;