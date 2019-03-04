import "./ApplyChangeBaby.css";
import React from 'react';
import imageEmpty from "../defaultAvatar.png";
import Page from "../../../ui/Page/Page";
import {Link, Route} from 'react-router-dom';
import AddBaby from "../BabyEdit";
import UserContext from "../../../model/UserContext";
import OrganizationContext from "../../../model/OrganizationContext";
import Screen from "../../../utils/Screen";
import ActivityApi from "../../../api/BabyActivityApi";
import FullScreenPage from "../../../ui/FullScreenPage/FullScreenPage";
import FixedBottom from "../../../ui/FixedBottom/FixedBottom";
import BabySelect from "./BabySelect.png";
import BabySelected from "./BabySelected.png";


class ApplyChangeBaby extends Page {
    constructor(props) {
        super(props);
        this.state = {
            id: "",
            selectedData: [],
            changeId: "",
            babyInfoId: "",
            changeResult: false,
            uuid: "",
            CountDownNum: 10,
            BacktrackMessage: false,
            BacktrackContent: "",
            BabyState: "",
        };
        Screen.loading(true);
        this.formatDate = this.formatDate.bind(this);
        this.addBaby = this.addBaby.bind(this);
        this.changeBaby = this.changeBaby.bind(this);
        this.countDown = this.countDown.bind(this);
        this.ResultActivity = this.ResultActivity.bind(this);
    }

    componentDidMount() {
        let changeId = this.props.match.params.changeId;
        this.setState({
            changeId: changeId,
        });
        let userContext = UserContext.get();
        ActivityApi.BabyConform({
            accessToken: userContext.userToken,
            auditionItemId: changeId,
        }, data => {
            if (data.code && data.code === "error") {
                let {history} = this.props;
                Screen.alert(data.message, () => {
                    Screen.loading(false);
                    history.goBack();
                });
                Screen.loading(false);
            } else {
                let selectedData = [];
                data.babyInfos.forEach(() => {
                    selectedData.push(true);
                });
                this.setState({
                    babyList: data.babyInfos,
                    selectedData
                });
            }
            Screen.loading(false)
        });
        document.body.style.backgroundColor = '#fff';
    }

    componentWillUnmount() {
        document.body.style.backgroundColor = '#eee';
    }

    formatDate(inputTime) {
        let date = new Date(inputTime);
        let y = date.getFullYear();
        let m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        let d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        return y + '-' + m + '-' + d;
    }

    countDown() {
        let {uuid} = this.state;
        let userContext = UserContext.get();
        let organizationContext = OrganizationContext.get();
        let activityCategoryId = organizationContext.activityCategoryId ? organizationContext.activityCategoryId : 1;
        let interval = 1000;
        let run = () => {
            let timer = setTimeout(() => {
                clearTimeout(timer);
                Screen.loading(true);
                ActivityApi.BabyResult({
                    accessToken: userContext.userToken,
                    uuid: uuid,
                }, data => Screen.loading(false, () => {
                    if (data.state === 500) {
                        Screen.alert("报名失败，请重试！")
                    } else if (data.state === 200) {
                        let {history} = this.props;
                        history.push("/baby/activity/applySuccess_type" + activityCategoryId);
                    } else {
                        if (interval <= 3000) {
                            interval += 1000;
                        }
                        run();
                    }
                }), error => Screen.loading(false, () => Screen.alert(error)));
            }, interval);
        };
        if(uuid && uuid.length !== ""){
            run();
        }
    }

    btnClick(index, id) {
        let selectedData = this.state.selectedData;
        selectedData.forEach((v, k) => {
            if (k === index) {
                selectedData[k] = !selectedData[k];
            } else {
                selectedData[k] = true;
            }
        });
        this.setState({
            ...this.state,
            selectedData,
            babyInfoId: id,
        });
    }

    changeBaby() {
        let userContext = UserContext.get();
        let {changeId, babyInfoId} = this.state;
        ActivityApi.changeBaby({
            accessToken: userContext.userToken,
            babyInfoId: babyInfoId,
            auditionItemId: changeId,
        }, data => {
            this.setState({
                changeResult: true,
                uuid: data.uuid,
            });
            this.countDown();
        });
    }

    addBaby(baby) {
        let {babyList} = this.state;
        babyList.unshift(baby);
        this.setState({
            babyList: babyList,
        });
    }

    ResultActivity(state) {
        let {history} = this.props;
        let organizationContext = OrganizationContext.get();
        let activityCategoryId = organizationContext.activityCategoryId ? organizationContext.activityCategoryId : 1;
        if (state === 200) {
            history.push("/baby/activity/applySuccess_type" + activityCategoryId);
        } else if (state === 500) {
            history.push("/baby/activity/list_type" + activityCategoryId);
        }
    }

    render() {
        let {match} = this.props;
        let {babyList, selectedData} = this.state;
        return (
            <div>
                {!this.isChildRoute() &&
                <div className="ApplyChangeBaby">
                    {babyList && babyList.length === 0 &&
                    <FullScreenPage style={{background: "#fff"}}>
                        <div className="information_img" style={{backgroundImage: 'url(' + imageEmpty + ')'}}>

                        </div>
                        <div className="information_message">
                            您暂时还没有添加宝宝的信息咯~~
                        </div>
                        <div className="addBtn">
                            <Link to={'/babyInformation/addBaby'} style={{color: '#fff'}}>
                                添加宝宝信息
                            </Link>
                        </div>
                    </FullScreenPage>
                    }
                    {babyList && babyList.length > 0 &&
                    <div className="hasBaby">
                        <div className="Baby_list">
                            <div className="listHint">
                                <p>选择需要报名的宝宝信息</p>
                            </div>
                            {babyList && babyList.length > 0 && babyList.map((baby, key) => {
                                let babyPicture = baby.picture;
                                let babySex = baby.gender === 1 ? "男宝宝" : "女宝宝";
                                let babyBirthday = this.formatDate(baby.babyBirthday);
                                return (
                                    <div key={baby.babyInfoId}>
                                        <a>
                                            <div className="information_change">
                                                {selectedData[key] &&
                                                <div className="changeBtn" style={{backgroundImage: 'url(' + BabySelect + ')'}}
                                                      onClick={this.btnClick.bind(this, key, baby.babyInfoId)}>
                                                </div>}
                                                {!selectedData[key] &&
                                                <div className="changeBtnNext" style={{backgroundImage: 'url(' + BabySelected + ')'}}
                                                      onClick={this.btnClick.bind(this, key, baby.babyInfoId)}>
                                                </div>}
                                            </div>
                                            <div className="information_baby" key={baby.babyInfoId}>
                                                <div className="baby_img"
                                                     style={{backgroundImage: 'url(' + babyPicture + ')'}}>
                                                </div>
                                                <div className="baby_message">
                                                    <span>{baby.babyName}</span>
                                                    <span>{babySex}</span>
                                                    <span>{babyBirthday}</span>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                );
                            })}
                            <div className="babyEmpty">

                            </div>
                        </div>
                        <FixedBottom>
                        <div className="baby_button_next" onClick={this.changeBaby}>
                            确定
                        </div>
                        </FixedBottom>
                    </div>
                    }

                </div>
                }
                <Route path={match.url + '/addBaby'} component={AddBaby}/>
            </div>
        );
    }
}

export default ApplyChangeBaby;