import "./ApplyAuditions1.css";
import React from 'react';
import Page from "../../../ui/Page/Page";
import UserContext from "../../../model/UserContext";
import ActivityApi from "../../../api/BabyActivityApi";
import ApplyAuditionTitle from "../img/ApplyAuditionsTitle1.png";
import ApplyAuditionTitleImg from "../img/ApplyAuditionsTitleImg.png";
import ApplyAuditionPhoto from "./ApplyAuditionsPhoto.png";
import ApplySession from "./ActivityList";
import TopTitle from '../../../ui/TopTitle/TopTitle';
import { Route } from 'react-router-dom';
import Screen from "../../../utils/Screen";
import FullScreenPage from "../../../ui/FullScreenPage/FullScreenPage";

class ApplyAuditions1 extends Page {
    constructor(props) {
        super(props);
        this.state = {
            babyAuditionId: "",
        };
        this.AuditionsBtn = this.AuditionsBtn.bind(this);
        Screen.loading(true);
    }

    componentDidMount() {
        let userContext = UserContext.get();
        ActivityApi.AuditionsMessage({
            accessToken: userContext.userToken,
        }, data => {
            this.setState({
                babyAuditionId: data.babyAuditionId
            }, Screen.loading(false));
        });
    }
    AuditionsBtn() {
        let { history } = this.props;
        let userContext = UserContext.get();
        let { babyAuditionId } = this.state;
        ActivityApi.BabySuccessfulConfirm({
            accessToken: userContext.userToken,
            babyAuditionId: babyAuditionId,
        }, () => {
            history.push("/activity");
        });
    }
    render() {
        let { match, history } = this.props;
        return (
            <div>
                <TopTitle title="外景模特报名" onClickBack={() => { history.goBack(); }} />
                <FullScreenPage style={{background: '#FFE5E5', zIndex: -1}}/>
                <div className="ApplyAuditions1">
                    <div className="AuditionsTitle">
                        <div className="TitleImg" style={{ backgroundImage: 'url(' + ApplyAuditionTitleImg + ')' }}>

                        </div>
                        <div className="Title" style={{ backgroundImage: 'url(' + ApplyAuditionTitle + ')' }}>

                        </div>
                    </div>
                    <div className="AuditionsPhoto">
                        <div className="PhotoImg" style={{ backgroundImage: 'url(' + ApplyAuditionPhoto + ')' }}>

                        </div>
                    </div>
                    <div className="AuditionsContent">
                        <p>很遗憾！此次海选您的宝宝没有入围。</p>
                        <p>请继续关注“咿呀咿呀”，欢迎再次报名！</p>
                    </div>
                    <div className="AuditionsButton">
                        <span className="button" onClick={this.AuditionsBtn}>
                            确定
                        </span>
                    </div>
                    <div className="footer">本次活动最终解释权归“咿呀咿呀”所有</div>
                </div>
                <Route path={match.url + '/applySession'} component={ApplySession} />
            </div>

        )
    }
}

export default ApplyAuditions1;