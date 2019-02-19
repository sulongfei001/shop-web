import './UserInfo.css';
import React from 'react';
import {Link, Route} from 'react-router-dom';
import {TransitionGroup} from 'react-transition-group';
import Screen from "../../utils/Screen";
import UserContext from "../../model/UserContext";
import AccountApi from "../../api/AccountApi";
import imagePath from './path.png';
import Page from "../../ui/Page/Page";
import Genders from "../../model/Genders";
import Uploader from "../../utils/Uploader";
import EditNickname from "./EditNickname";
import SlideBottom from "../../ui/SlideBottom/SlideBottom";
import MessageBottom from "../../ui/MessageBottom/MessageBottom";
import Fade from "../../ui/Fade/Fade";
import Mask from "../../ui/Mask/Mask";

class UserInfo extends Page {
    constructor(props) {
        super(props);
        this.initUploader = this.initUploader.bind(this);
        this.destroyUploader = this.destroyUploader.bind(this);
        this.state = {};
        Screen.loading(true);
    }

    componentDidMount() {
        if (this.checkUserLoggedIn()) {
            let userContext = UserContext.get();
            AccountApi.validate({
                accessToken: userContext.userToken
            }, data => {
                this.setState({
                    userInfo: data
                }, () => Screen.loading(false));
            }, error => {
                Screen.loading(false, () => Screen.alert(error));
            });
        }
    }

    componentWillUnmount() {
        this.destroyUploader();
    }

    componentDidUpdate() {
        this.initUploader();
    }

    initUploader() {
        let {userInfo} = this.state;
        if (!this.isChildRoute() && userInfo && !this.uploader) {
            let userContext = UserContext.get();
            this.uploader = Uploader.create('lnkUploadAvatar', 'avatar', up => AccountApi.modify({
                accessToken: userContext.userToken,
                avatar: up.relativeUrl
            }, () => {
                let {userInfo} = this.state;
                userInfo.avatar = up.url + '?x-oss-process=style/avatar';
                this.setState({userInfo: userInfo});
            }, error => Screen.alert(error)), error => Screen.alert(error));
        }
    }

    destroyUploader() {
        if (this.uploader) {
            this.uploader.destroy();
            this.uploader = undefined;
        }
    }

    render() {
        let {match} = this.props;
        let {userInfo, showGenders} = this.state;
        let genders = Genders.getKeyValues();
        return (
            <div>
                {!this.isChildRoute() && userInfo &&
                <div className="UserInfo">
                    <a id="lnkUploadAvatar" className="line" style={{backgroundImage: 'url(' + imagePath + ')'}}>
                        <div className="avatar" style={{backgroundImage: 'url(' + userInfo.avatar + ')'}}/>
                        <div className="nickname">{userInfo.nickname}</div>
                    </a>
                    <Link to={match.url + '/editNickname/' + encodeURIComponent(userInfo.nickname)} className="line" style={{backgroundImage: 'url(' + imagePath + ')'}}>
                        <div className="line-label">昵称</div>
                        <div className="line-content">{userInfo.nickname}</div>
                    </Link>
                    <a className="line" style={{backgroundImage: 'url(' + imagePath + ')'}} onClick={() => this.setState({showGenders: true})}>
                        <div className="line-label">性别</div>
                        <div className="line-content">{Genders.get(userInfo.gender)}</div>
                    </a>
                    <Link to="/about" className="line margin" style={{backgroundImage: 'url(' + imagePath + ')'}}>
                        <div className="line-label">关于版本</div>
                        <div className="line-content">V1.0</div>
                    </Link>
                    <TransitionGroup>
                        {showGenders &&
                        <Fade>
                            <Mask onClick={() => this.setState({showGenders: undefined})}/>
                        </Fade>
                        }
                        {showGenders &&
                        <SlideBottom>
                            <MessageBottom title={'性别'} onClose={() => this.setState({showGenders: undefined})} onConfirm={() => this.setState({showGenders: undefined})}>
                                <div className="genders">
                                    {genders.filter(g => g.key > 0).map(g =>
                                        <a key={g.key} onClick={() => Screen.loading(true, () => {
                                            let userContext = UserContext.get();
                                            AccountApi.modify({
                                                accessToken: userContext.userToken,
                                                gender: g.key
                                            }, () => {
                                                userInfo.gender = g.key;
                                                this.setState({
                                                    userInfo: userInfo,
                                                    showGenders: false
                                                }, () => Screen.loading(false));
                                            }, error => Screen.loading(false, () => Screen.alert(error)));
                                        })}>{g.value}</a>
                                    )}
                                </div>
                            </MessageBottom>
                        </SlideBottom>
                        }
                    </TransitionGroup>
                </div>
                }
                <Route path={match.url + '/editNickname/:nickname'} render={props => {
                    this.destroyUploader();
                    return (
                        <EditNickname {...props} userInfoPage={this}/>
                    );
                }}/>
            </div>
        );
    }
}

export default UserInfo;