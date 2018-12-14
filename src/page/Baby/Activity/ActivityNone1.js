import "./ActivityNone1.css";
import React from 'react';
import Page from "../../../ui/Page/Page";
import Screen from "../../../utils/Screen";
import FullScreenPage from "../../../ui/FullScreenPage/FullScreenPage";
import TopTitle from '../../../ui/TopTitle/TopTitle';
import { height } from "window-size";
import ApplyTerrace from "../img/ApplyTerrace.png";
import PhotoDog from "../img/PhotoDog.png";
import PhotoBalloon from "../img/PhotoBalloon.png";
import test from "../img/test.png";
// TODO: 习游活动图片标记
import ICON_ACTIVITY from "./xiyou_activity.jpeg";

class ActivityNone1 extends Page {
    constructor(props) {
        super(props);
        this.state = {};
        Screen.loading(true);
    }

    componentDidMount() {
        Screen.loading(false);
    }

    render() {
        let { history } = this.props;
        return (
            <div>
                <TopTitle title="外景模特报名" onClick={() => { history.goBack(); }} />
                <FullScreenPage style={{ background: '#B7F2D5' }}>
                    {
                        false ? <img src={ICON_ACTIVITY} style={{ width: '100%', height: window.screen.height + 'px' }} /> :
                            <div className="ActivityNone1" style={{ backgroundImage: 'url(' + PhotoBalloon + '),url(' + PhotoDog + ')' }}>
                                <div className="ActivityIntroduce">
                                    <div className="IntroduceUp">
                                        活动介绍
                                    </div>
                                    <div className="IntroduceDown">
                                        啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊
                                    </div>
                                </div>
                                <div className="VIPIntroduce">
                                    <div className="IntroduceUp">
                                        会员介绍
                                    </div>
                                    <div className="IntroduceDown">
                                        啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊
                                    </div>
                                </div>
                                <div className="ActivityPoster">
                                    <img src={test} />
                                </div>
                                <div className="ApplyTerrace">
                                    <img src={ApplyTerrace} />
                                </div>
                            </div>
                    }
                </FullScreenPage>
            </div>
        );
    }
}

export default ActivityNone1;