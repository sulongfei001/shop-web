import "./ActivityList1.css";
import React from 'react';
import { TransitionGroup } from 'react-transition-group';
import Page from "../../../ui/Page/Page";
import Screen from "../../../utils/Screen";
import UserContext from "../../../model/UserContext";
import OrganizationContext from "../../../model/OrganizationContext";
import ApplySessionTitle from "../img/ApplySessionTitle1.png";
import ActivityPrompt from "../img/ActivityPrompt.png";
import ActivityHelp from "../img/ActivityHelp.png";
import Test from "../img/test1.png";
import PhotoDog from "../img/PhotoDog.png";
import PhotoBalloon from "../img/PhotoBalloon.png";
import ActivityApi from "../../../api/BabyActivityApi";
import { Route } from 'react-router-dom';
import ApplyChangeBaby from "./ApplyChangeBaby";
import ApplySuccess from "./ApplySuccess";
import BabyEdit from "../BabyEdit";
import BabyList from "../BabyList";
import TopTitle from '../../../ui/TopTitle/TopTitle';
import FixedBottom from "../../../ui/FixedBottom/FixedBottom";
import Fade from "../../../ui/Fade/Fade";
import Confirm from "../../../ui/Confirm/Confirm";
import DateFormatterBeijing from "../../../utils/DateFormatterBeijing";
import FullScreenPage from "../../../ui/FullScreenPage/FullScreenPage";

class ActivityList1 extends Page {
    constructor(props) {
        super(props);
        this.state = {
            showTitle: false,
            btn: {
                style: {
                    backgroundColor: "#FF8C8C",
                }
            }
        };
        this.sessionBtn = this.sessionBtn.bind(this);
        this.addTransition = this.addTransition.bind(this);
        this.topTitleScroll = this.topTitleScroll.bind(this);
        Screen.loading(true);
    }
    componentDidMount() {
        window.addEventListener("scroll", this.topTitleScroll);
        let { history, match } = this.props;
        if (!UserContext.isLoggedIn(history, match)) {
            return;
        }
        let userContext = UserContext.get();
        let organizationContext = OrganizationContext.get();
        let activityCategoryId = organizationContext.activityCategoryId ? organizationContext.activityCategoryId : 1;
        ActivityApi.SessionList({
            accessToken: userContext.userToken,
            mechanismCategoryId: organizationContext.organizationId,
            activityCategoryId: activityCategoryId
        }, data => {
            let dataMsg = data.auditionList;
            if (dataMsg.length === 0) {
                this.props.history.replace("/baby/activity/none_type" + activityCategoryId + "/" + activityCategoryId);
            } else {
                this.setState({
                    total: data.total,
                    bannerUrl: data.bannerUrl,
                    flag: data.flag,
                    auditionList: data.auditionList
                }, Screen.loading(false));
            }
        });
        this.addTransition();
    }
    componentWillUnmount() {
        window.removeEventListener("scroll", this.topTitleScroll);
    }

    changeAudition(auditionItemId, e) {
        let userContext = UserContext.get();
        this.setState({
            changeId: auditionItemId
        });
        ActivityApi.beforeSign({
            accessToken: userContext.userToken,
            auditionItemId: auditionItemId
        }, data => {
            let tipMessage = "";
            if (data.type == 1) {
                tipMessage = "需要成为会员并且达到" + data.signLevelName + "可报名";
            } else if (data.type == 2) {
                tipMessage = "需要达到" + data.signLevelName + "才可报名,你还需要" + (data.signGrowRate - data.memberGrowRate) + "成长值可达到" + data.signLevelName;
            } else if (data.type == 3) {
                tipMessage = "还未激活会员请激活";
            } else if (data.type == 4) {
                if (data.nextEnrollDate) {
                    tipMessage = "等待期至" + data.nextEnrollDate;
                }
            } else if (data.type == 99) {
                tipMessage == "你已符合要求，可报名"
            }
            this.setState({
                tipMessage: tipMessage,
                signData: data
            });
        });
    }

    addTransition() {
        let newArray = [];
        for (let i = 0; i <= 50; i++) {
            let number = i / 50;
            newArray[i] = number;
        }
        this.setState({
            array: newArray
        });
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
    btnMouseDown = () => {
        let { btn } = this.state;
        btn.style = { backgroundColor: "#e57e7e" };
        this.setState({
            btn: btn
        });
    }
    btnMouseUp = () => {
        let { btn } = this.state;
        btn.style = { backgroundColor: "#FF8C8C" };
        this.setState({
            btn: btn
        });
    }
    sessionBtn() {
        let { changeId } = this.state;
        if (changeId && changeId !== "") {
            let userContext = UserContext.get();
            Screen.loading(true, () => {
                ActivityApi.beforeSign({
                    accessToken: userContext.userToken,
                    auditionItemId: changeId
                }, data => {
                    let { history } = this.props;
                    let { type, nextEnrollDate, signLevelName, signGrowRate, memberGrowRate } = data;
                    let message, confirm, now;
                    //nextEnrollDate = "2019-07-10 10:21:12";
                    now = DateFormatterBeijing.toYMDHMS(new Date());
                    //type = 4;
                    if (type == 1) {
                        message = "需要成为会员并且达到" + signLevelName + "可报名";
                        confirm = () => { window.location.href = "https://shop.yiyayiyawao.com/#/UserVip"; }
                    } else if (type == 2) {
                        message = "需要达到" + signLevelName + "才可报名,你还需要" + (signGrowRate - memberGrowRate) + "成长值可达到" + signLevelName;
                        confirm = () => { this.setState({ unVipShow: false }); }
                    } else if (type == 3) {
                        message = "成为会员即可报名";
                        confirm = () => { window.location.href = "https://shop.yiyayiyawao.com/#/UserVip"; }
                    } else if (type == 4) {
                        if (nextEnrollDate) {
                            let nextDate = new Date(nextEnrollDate.replace("//-/g", "//"));
                            let nowDate = new Date(now.replace("//-/g", "//"));
                            if (nextDate > nowDate) {
                                message = "你在等待期，暂无法报名，等待期至" + nextEnrollDate;
                                confirm = () => {
                                    this.setState({ unVipShow: false });
                                    ActivityApi.queryCommend({
                                        auditionItemId: changeId
                                    }, data => { window.location.href = data.url; }, error => { Screen.loading(false, Screen.alert(error)) });
                                }
                            }
                        } else if (false) {
                            // 报名次数限定
                        }
                    }
                    if (message && confirm) {
                        this.setState({
                            unVipShow: true,
                            confirm: {
                                title: "提示",
                                message: message,
                                onConfirm: confirm,
                                onCancel: () => {
                                    this.setState({
                                        unVipShow: false
                                    });
                                }
                            }
                        }, Screen.loading(false));
                    } else if (type == 99) {
                        ActivityApi.BabyConform({
                            accessToken: userContext.userToken,
                            auditionItemId: changeId,
                        }, data => {
                            if (data.babyInfos && data.babyInfos.length === 0) {
                                this.setState({
                                    unBabyShow: true,
                                    confirm: {
                                        title: "您没有符合年龄的宝宝",
                                        message: "请前往添加！",
                                        onConfirm: () => {
                                            history.push("/baby/list");
                                        },
                                        onCancel: () => {
                                            this.setState({
                                                unBabyShow: false,
                                            });
                                        }
                                    }
                                });
                            } else if (data.babyInfos && data.babyInfos.length === 1) {
                                let babyInfoId = data.babyInfos[0].babyInfoId;
                                ActivityApi.changeBaby({
                                    accessToken: userContext.userToken,
                                    babyInfoId: babyInfoId,
                                    auditionItemId: changeId,
                                }, data => {
                                    let uuid = data.uuid;
                                    let interval = 1000;
                                    let run = () => {
                                        let timer = setTimeout(() => {
                                            clearTimeout(timer);
                                            ActivityApi.BabyResult({
                                                accessToken: userContext.userToken,
                                                uuid: uuid,
                                            }, data => Screen.loading(false, () => {
                                                if (data.state === 500) {
                                                    Screen.alert("报名失败，请重试！")
                                                } else if (data.state === 200) {
                                                    history.push("/baby/activity/applySuccess");
                                                } else {
                                                    if (interval <= 3000) {
                                                        interval += 1000;
                                                    }
                                                    run();
                                                }
                                            }), error => Screen.loading(false, () => Screen.alert(error)));
                                        }, interval);
                                    };
                                    if (data.uuid && data.uuid.length !== "") {
                                        run();
                                    }
                                }, error => Screen.loading(false, () => Screen.alert(error)));
                            } else if (data.babyInfos && data.babyInfos.length > 1) {
                                let { changeId } = this.state;
                                let Path = '/baby/activity/applyChangeBaby/' + changeId;
                                history.push(Path);
                            }
                        }, error => Screen.loading(false, () => Screen.alert(error)));
                    }
                }, error => { Screen.loading(false, () => Screen.alert(error)) });
            });
        } else {
            Screen.alert("请选择场次！");
        }
    }

    render() {
        let { match, history } = this.props;
        let { auditionList, unBabyShow, unVipShow, changeId, confirm, array, btn, showTitle, bannerUrl, tipMessage } = this.state;
        let organizationContext = OrganizationContext.get();
        let activityCategoryId = organizationContext.activityCategoryId ? organizationContext.activityCategoryId : 1;
        return (
            <div>
                {!showTitle &&
                    <TopTitle title="外景模特报名" style={{ backgroundColor: "", opacity: 0.9 }} onClickBack={() => { history.goBack(); }} />}
                {showTitle &&
                    <TransitionGroup>
                        <Fade>
                            <TopTitle title="外景模特报名" style={{ backgroundColor: "#333333", opacity: 0.9 }} onClickBack={() => { history.goBack(); }} />
                        </Fade>
                    </TransitionGroup>
                }
                <FullScreenPage style={{ background: '#FFE5E5', zIndex: -1 }} />
                <div className="ActivityList1">
                    <div className="BDUp" style={{ backgroundImage: 'url(' + bannerUrl + ')' }}></div>
                    <div className="BDMiddle">
                        {array && array.length > 0 && array.map((v, k) => {
                            return (
                                <div key={k} style={{ opacity: v }}>

                                </div>
                            )
                        })
                        }
                    </div>
                    <div className="title" style={{ backgroundImage: 'url(' + ApplySessionTitle + ')' }} />
                    <div className="SessionContent">
                        {auditionList && auditionList.length > 0 && auditionList.map(audition => {
                            let activityDistrictAddress = audition.activityDistrictList.length === 1 ? audition.activityDistrictList[0] + audition.activityAddress : audition.activityDistrictList[0] + audition.activityDistrictList[1] + audition.activityAddress;
                            return (
                                <div key={audition.auditionDetailId}>
                                    <div className="ContentList">
                                        <div className="ListTitle">
                                            <span>{audition.activityDistrictList[0]} {DateFormatterBeijing.toMDZhcn(new Date(audition.auditionDate))}<img src={ActivityPrompt} onClick={() => { history.push("/baby/activity/none_type" + activityCategoryId); }} /></span>
                                            <span>{activityDistrictAddress}</span>
                                        </div>
                                        <div className="ListChange">
                                            <div className="ChangeOption">
                                                {audition.auditionItems && audition.auditionItems.length > 0 && audition.auditionItems.map(item => {
                                                    let clickable = item.stock > 0;
                                                    let stockName = '';
                                                    if (item.stock === 0) {
                                                        stockName = '已满';
                                                    } else {
                                                        stockName = item.stock;
                                                    }
                                                    return (
                                                        <div key={item.auditionItemId} className="Option" onClick={this.changeAudition.bind(this, item.auditionItemId)}>
                                                            {clickable &&
                                                                <span className={changeId === item.auditionItemId ? 'changeOptionNext' : 'changeOption'} />
                                                            }
                                                            {!clickable &&
                                                                <span className={'unclickable'} />
                                                            }
                                                            <span>{item.activityDate}</span>
                                                            <span className="next">({stockName})</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            <div className="splitter" />
                                            <div className="ChangeDate">
                                                <p>报名截止：{DateFormatterBeijing.toMDHMZhcn(new Date(audition.activityEndDate))}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                        )}
                    </div>
                    <div style={{ height: '51px' }} />
                    <div style={{ height: '2.7rem' }} />
                    <FixedBottom>
                        <div className="SessionChange" id="SessionChange">
                            {array && array.length > 0 && array.map((v, k) => {
                                return (
                                    <div key={k} style={{ opacity: v }}>

                                    </div>
                                )
                            })
                            }
                        </div>
                        <div className="ButtonContainer" style={{ backgroundImage: 'url(' + PhotoBalloon + '),url(' + PhotoDog + ')' }}>
                            {tipMessage &&
                                <div className="SessionReminder">
                                    <img src={ActivityHelp} onClick={() => { window.location.href = "https://shop.yiyayiyawao.com/#/UserVip"; }} />
                                    <label>{tipMessage}</label>
                                </div>
                            }
                            <div className="SessionButton">
                                <span className="btn" style={btn.style} onClick={this.sessionBtn} onTouchStart={this.btnMouseDown} onTouchEnd={this.btnMouseUp}>提交</span>
                            </div>
                            <div className="SessionAnnotation">
                                <p>本次活动最终解释权归“咿呀咿呀”所有</p>
                            </div>
                        </div>
                    </FixedBottom>
                    {unBabyShow &&
                        <Fade>
                            <Confirm title={confirm.title} message={confirm.message} onConfirm={confirm.onConfirm} onCancel={confirm.onCancel} />
                        </Fade>
                    }
                    {unVipShow &&
                        <Fade>
                            <Confirm title={confirm.title} message={confirm.message} onConfirm={confirm.onConfirm} onCancel={confirm.onCancel} />
                        </Fade>
                    }
                </div>
                <Route path={match.url + '/applyChangeBaby/:changeId'} component={ApplyChangeBaby} />
                <Route path={match.url + '/applySuccess'} component={ApplySuccess} />
                <Route path={match.url + '/addBaby'} component={BabyEdit} />
                <Route path={match.url + '/listBaby'} component={BabyList} />
            </div>
        )
    }
}

export default ActivityList1;