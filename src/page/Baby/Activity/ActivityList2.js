import "./ActivityList2.css";
import React from 'react';
import { TransitionGroup } from 'react-transition-group';
import Page from "../../../ui/Page/Page";
import Screen from "../../../utils/Screen";
import UserContext from "../../../model/UserContext";
import OrganizationContext from "../../../model/OrganizationContext";
import ApplySessionTitle from "../img/ApplySessionTitle2.png";
import ActivityPrompt from "../img/ActivityPrompt.png";
import ActivityHelp from "../img/ActivityHelp.png";
import Test from "../img/test2.jpg";
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

class ActivityList2 extends Page {
    constructor(props) {
        super(props);
        this.state = {
            showTitle: false,
            btn: {
                style: {
                    backgroundColor: "#DB5116",
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
        ActivityApi.SessionList({
            accessToken: userContext.userToken,
            mechanismCategoryId: organizationContext.organizationId
        }, data => {
            data = {
                flag: true,
                auditionList: [
                    {
                        auditionId: 58,
                        auditionDetailId: 117,
                        auditionDate: 1546012800000,
                        activityEndDate: 1545148800000,
                        activityDistrictId: 693,
                        activityDistrictList: ["上海", "长宁区"],
                        activityAddress: "长宁路1436号3号楼2楼",
                        babyInfoIds: [18643],
                        ageStartDate: 1104508800000,
                        ageEndDate: 1548950399000,
                        auditionItems: [
                            {
                                auditionItemId: 1,
                                stock: 1,
                                activityDate: "10:30"
                            },
                            {
                                auditionItemId: 2,
                                stock: 1,
                                activityDate: "10:30"
                            },
                            {
                                auditionItemId: 3,
                                stock: 0,
                                activityDate: "10:30"
                            },
                            {
                                auditionItemId: 4,
                                stock: 1,
                                activityDate: "10:30"
                            },
                            {
                                auditionItemId: 5,
                                stock: 0,
                                activityDate: "10:30"
                            },
                            {
                                auditionItemId: 6,
                                stock: 1,
                                activityDate: "10:30"
                            },
                            {
                                auditionItemId: 7,
                                stock: 0,
                                activityDate: "10:30"
                            },
                            {
                                auditionItemId: 8,
                                stock: 1,
                                activityDate: "10:30"
                            },
                            {
                                auditionItemId: 9,
                                stock: 0,
                                activityDate: "10:30"
                            }
                        ]
                    },
                    {
                        auditionId: 59,
                        auditionDetailId: 118,
                        auditionDate: 1546012800001,
                        activityEndDate: 1545148800001,
                        activityDistrictId: 694,
                        activityDistrictList: ["上海", "长宁区"],
                        activityAddress: "长宁路1436号3号楼2楼",
                        babyInfoIds: [18644],
                        ageStartDate: 1104508800001,
                        ageEndDate: 1548950399001,
                        auditionItems: [
                            {
                                auditionItemId: 10,
                                stock: 1,
                                activityDate: "10:30"
                            },
                            {
                                auditionItemId: 11,
                                stock: 1,
                                activityDate: "10:30"
                            },
                            {
                                auditionItemId: 12,
                                stock: 0,
                                activityDate: "10:30"
                            },
                            {
                                auditionItemId: 13,
                                stock: 1,
                                activityDate: "10:30"
                            },
                            {
                                auditionItemId: 14,
                                stock: 0,
                                activityDate: "10:30"
                            },
                            {
                                auditionItemId: 15,
                                stock: 1,
                                activityDate: "10:30"
                            },
                            {
                                auditionItemId: 16,
                                stock: 0,
                                activityDate: "10:30"
                            },
                            {
                                auditionItemId: 17,
                                stock: 1,
                                activityDate: "10:30"
                            },
                            {
                                auditionItemId: 18,
                                stock: 0,
                                activityDate: "10:30"
                            }
                        ]
                    }
                ]
            }
            let showOption = [];
            let dataMsg = data.auditionList;
            if (dataMsg.length === 0) {
                this.props.history.replace("/baby/activity/none");
            } else {
                dataMsg.forEach((v, k) => {
                    let arr = [];
                    v.auditionItems.forEach((val, key) => {
                        arr.push("true");
                    });
                    showOption.push(arr);
                });
                this.setState({
                    total: data.total,
                    flag: data.flag,
                    auditionList: data.auditionList,
                    showOption,
                }, Screen.loading(false));
            }
        });
        this.addTransition();
    }
    componentWillUnmount() {
        window.removeEventListener("scroll", this.topTitleScroll);
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
        btn.style.backgroundColor = "#C24813";
        this.setState({
            btn: btn
        });
    }
    btnMouseUp = () => {
        let { btn } = this.state;
        btn.style.backgroundColor = "#DB5116";
        this.setState({
            btn: btn
        });
    }
    sessionBtn() {
        let { changeId } = this.state;
        if (changeId && changeId !== "") {
            let userContext = UserContext.get();
            Screen.loading(true, () => ActivityApi.BabyConform({
                accessToken: userContext.userToken,
                auditionItemId: changeId,
            }, data => {
                if (data.code && data.code === "error") {
                    Screen.loading(false, () => Screen.alert(data.message));
                } else if (data.babyInfos && data.babyInfos.length === 0) {
                    this.setState({
                        unBabyShow: true,
                        confirm: {
                            title: "您没有符合年龄的宝宝",
                            message: "请前往添加！",
                            onConfirm: () => {
                                let { history } = this.props;
                                history.push("/babyInformation");
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
                                Screen.loading(true);
                                ActivityApi.BabyResult({
                                    accessToken: userContext.userToken,
                                    uuid: uuid,
                                }, data => Screen.loading(false, () => {
                                    if (data.state === 500) {
                                        Screen.alert("报名失败，请重试！")
                                    } else if (data.state === 200) {
                                        let { history } = this.props;
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
                    let { history } = this.props;
                    let { changeId } = this.state;
                    let Path = '/baby/activity/applyChangeBaby/' + changeId;
                    history.push(Path);
                }
            }, error => Screen.loading(false, () => Screen.alert(error))));

        } else {
            Screen.alert("请选择场次！");
        }

    }

    render() {
        let { match, history } = this.props;
        let { auditionList, unBabyShow, changeId, confirm, array, btn, showTitle } = this.state;
        return (
            <div>
                {!showTitle &&
                    <TopTitle title="电视模特报名" style={{ backgroundColor: "", opacity: 0.9 }} onClickBack={() => { history.goBack(); }} />}
                <TransitionGroup>
                    {showTitle && <Fade>
                        <TopTitle title="电视模特报名" style={{ backgroundColor: "#333333", opacity: 0.9 }} onClickBack={() => { history.goBack(); }} />
                    </Fade>}
                </TransitionGroup>
                <FullScreenPage style={{ background: '#F2B8B8', zIndex: -1 }} />
                <div className="ActivityList2">
                    <div className="BDUp" style={{ backgroundImage: 'url(' + Test + ')' }}></div>
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
                                            <span>{audition.activityDistrictList[0]} {DateFormatterBeijing.toMDZhcn(new Date(audition.auditionDate))}<img src={ActivityPrompt} onClick={() => { alert("将要跳转的页面") }} /></span>
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
                                                        <div key={item.auditionItemId} className="Option" onClick={() => this.setState({ changeId: item.auditionItemId })}>
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
                    <div className="SessionReminder">
                        <img src={ActivityHelp} onClick={() => { alert("此处跳转页面") }} />需要会员等级达到4级
                    </div>
                    <div style={{ height: '51px' }} />
                    <div style={{ height: '2.1rem' }} />
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
                </div>
                <Route path={match.url + '/applyChangeBaby/:changeId'} component={ApplyChangeBaby} />
                <Route path={match.url + '/applySuccess'} component={ApplySuccess} />
                <Route path={match.url + '/addBaby'} component={BabyEdit} />
                <Route path={match.url + '/listBaby'} component={BabyList} />
            </div>
        )
    }
}

export default ActivityList2;