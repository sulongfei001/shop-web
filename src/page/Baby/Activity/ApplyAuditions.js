import "./ApplyAuditions.css";
import React from 'react';
import Page from "../../../ui/Page/Page";
import UserContext from "../../../model/UserContext";
import ActivityApi from "../../../api/BabyActivityApi";
import ApplyAuditionTitle from "./ApplyAuditionsTitle.png";
import ApplyAuditionPhoto from "./ApplyAuditionsPhoto.png";
import ApplySession from "./ActivityList";
import {Route} from 'react-router-dom';
import Screen from "../../../utils/Screen";
import FullScreenPage from "../../../ui/FullScreenPage/FullScreenPage";

class ApplyAuditions extends Page {
    constructor(props) {
        super(props);
        this.state = {
            babyAuditionId:"",
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
            },Screen.loading(false));
        });
    }
    AuditionsBtn(){
        let {history} = this.props;
        let userContext = UserContext.get();
        let {babyAuditionId} = this.state;
        ActivityApi.BabySuccessfulConfirm({
            accessToken: userContext.userToken,
            babyAuditionId: babyAuditionId,
        }, () => {
            history.push("/activity");
        });
    }
    render() {
        let {match} = this.props;
        return (
            <div>
                <FullScreenPage style={{background: '#D4F2FF', zIndex: -1}}/>
                <div className="ApplyAuditions">
                    <div className="AuditionsTitle">
                        <div className="TitleImg" style={{backgroundImage: 'url(' + ApplyAuditionTitle + ')'}}>

                        </div>
                    </div>
                    <div className="AuditionsPhoto">
                        <div className="PhotoImg" style={{backgroundImage: 'url(' + ApplyAuditionPhoto + ')'}}>

                        </div>
                    </div>
                    <div className="AuditionsContent">
                        <p>请继续关注“咿呀咿呀”</p>
                        <p className="contentMessage">欢迎再次报名！</p>
                    </div>
                    <div className="AuditionsButton">
                        <span className="button" onClick={this.AuditionsBtn}>
                            确定
                        </span>
                    </div>
                </div>
                <Route path={match.url + '/applySession'} component={ApplySession}/>
            </div>

        )
    }
}

export default ApplyAuditions;