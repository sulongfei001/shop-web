import "./BabyList.css";
import React from 'react';
import imageEmpty from "./defaultAvatar.png";
import Page from "../../ui/Page/Page";
import {Link, Route} from 'react-router-dom';
import BabyEdit from "./BabyEdit";
import UserContext from "../../model/UserContext";
import BabyInfo from "./BabyInfo";
import Screen from "../../utils/Screen";
import BabyApi from "../../api/BabyApi";
import FixedBottom from "../../ui/FixedBottom/FixedBottom";
import DateFormatter from "../../utils/DateFormatter";
import FullScreenPage from "../../ui/FullScreenPage/FullScreenPage";

class BabyList extends Page {
    constructor(props) {
        super(props);
        this.state = {
            id: "",
        };
        Screen.loading(true);
        this.addBaby = this.addBaby.bind(this);
        this.reload = this.reload.bind(this);
    }

    componentDidMount() {
        BabyList.instance = this;
        if (!UserContext.isLoggedIn(this.props.history, this.props.match)) {
            return;
        }
        this.reload();
    }

    componentWillUnmount() {
        BabyList.instance = undefined;
        document.body.style.backgroundColor = '#eee';
    }

    reload() {
        Screen.loading(true, () => {
            let userContext = UserContext.get();
            BabyApi.getBabyList({
                accessToken: userContext.userToken
            }, data => {
                this.setState({
                    babyList: data.babyInfoList,
                }, () => Screen.loading(false));
            }, error => Screen.loading(false, Screen.alert(error)));
        });
    }

    addBaby(baby) {
        let {babyList} = this.state;
        babyList.unshift(baby);
        this.setState({
            babyList: babyList,
        });
    }

    render() {
        let {match} = this.props;
        let {babyList} = this.state;
        return (
            <div>
                <FullScreenPage style={{background: '#fff', zIndex: -1}}/>
                {!this.isChildRoute() &&
                <div className="BabyList">
                    {babyList && babyList.length === 0 &&
                    <div>
                        <div className="information_img" style={{backgroundImage: 'url(' + imageEmpty + ')'}}>

                        </div>
                        <div className="information_message">
                            您暂时还没有添加宝宝的信息咯~~
                        </div>
                        <div className="addBtn">
                            <Link to={match.url + '/edit'} style={{color: '#fff'}}>
                                添加宝宝信息
                            </Link>
                        </div>
                    </div>
                    }
                    {babyList && babyList.length > 0 &&
                    <div className="hasBaby">
                        <div className="Baby_list">
                            {babyList && babyList.length > 0 && babyList.map(baby => {
                                let babyPicture = baby.picture;
                                let id = JSON.stringify(baby.babyInfoId);
                                let babySex = baby.gender === 1 ? "男宝宝" : "女宝宝";
                                let babyBirthday = DateFormatter.toYMD(new Date(baby.babyBirthday));
                                let path = match.url + ('/info/') + id;
                                return (
                                    <div key={baby.babyInfoId}>
                                        <Link to={path}>
                                            <div className="information_baby" key={baby.babyInfoId}>
                                                <div className="baby_img"
                                                     style={{backgroundImage: 'url(' + babyPicture + ')'}}>
                                                </div>
                                                <div className="baby_message">
                                                    <span className="messageName">{baby.babyName}</span>
                                                    <span>{babySex}</span>
                                                    <span>{babyBirthday}</span>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                );
                            })}

                        </div>
                        <div className="BabyReminder">
                            <p>系统暂时只支持添加一个宝宝</p>
                        </div>
                        <FixedBottom>
                        {babyList && babyList.length === maxBaby &&
                        <Link to={'/activity'} className="baby_button">去参加活动</Link>
                        }
                        </FixedBottom>
                    </div>
                    }

                </div>
                }
                <Route path={match.url + '/add'} component={BabyEdit}/>
                <Route path={match.url + '/edit/:id'} component={BabyEdit}/>
                <Route path={match.url + '/info/:id'} component={BabyInfo}/>
                <Route path={match.url + '/edit'} component={BabyEdit}/>
            </div>
        );
    }
}

const maxBaby = 1;

export default BabyList;