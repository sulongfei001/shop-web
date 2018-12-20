import "./ActivityNone1.css";
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

class ActivityNone1 extends Page {
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
                    <TopTitle title="外景模特报名" style={{ backgroundColor: "" }} onClickBack={() => { history.goBack(); }} />}
                <TransitionGroup>
                    {showTitle && <Fade>
                        <TopTitle title="外景模特报名" style={{ backgroundColor: "#333333" }} onClickBack={() => { history.goBack(); }} />
                    </Fade>}
                </TransitionGroup>
                <FullScreenPage style={{ background: '#B7F2D5', zIndex: -1 }} />
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
                    <div className="PassAnnotation">本次活动最终解释权归“咿呀咿呀”所有</div>
                </div>
            </div>
        );
    }
}

export default ActivityNone1;