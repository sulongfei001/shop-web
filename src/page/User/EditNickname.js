import './EditNickname.css';
import React from 'react';
import PropTypes from 'prop-types';
import Page from "../../ui/Page/Page";
import FixedBottom from "../../ui/FixedBottom/FixedBottom";
import UserContext from "../../model/UserContext";
import AccountApi from "../../api/AccountApi";
import Screen from "../../utils/Screen";

class EditNickname extends Page {
    constructor(props) {
        super(props);
        this.saveNickname = this.saveNickname.bind(this);
        this.state = {
            nickname: decodeURIComponent(props.match.params.nickname)
        };
    }

    saveNickname() {
        let {history, userInfoPage} = this.props;
        let {nickname} = this.state;
        let userContext = UserContext.get();
        Screen.loading(true, () => AccountApi.modify({
            accessToken: userContext.userToken,
            nickname: nickname
        },() => {
            if (userInfoPage) {
                let {userInfo} = userInfoPage.state;
                userInfo.nickname = nickname;
                userInfoPage.setState({
                    userInfo: userInfo
                });
            }
            Screen.loading(false, () => history.goBack())
        }, error => Screen.loading(false, () => Screen.alert(error))));
    }

    render() {
        let {nickname} = this.state;
        return (
            <div>
                {!this.isChildRoute() &&
                <div className="EditNickname">
                    <div className="line">
                        <div className="line-label">昵称</div>
                        <div className="line-content">
                            <input type="text" value={nickname} onChange={e => this.setState({nickname: e.target.value})}/>
                        </div>
                    </div>
                    <FixedBottom>
                        <a className="submit" onClick={this.saveNickname}>保存</a>
                    </FixedBottom>
                </div>
                }
            </div>
        );
    }
}

EditNickname.propTypes = {
    userInfoPage: PropTypes.object
};

export default EditNickname;