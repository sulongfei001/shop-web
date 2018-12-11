import "./ApplySuccess.css";
import React from 'react';
import Screen from "../../../utils/Screen";
import Page from "../../../ui/Page/Page";
import UserContext from "../../../model/UserContext";
import OrganizationContext from "../../../model/OrganizationContext";
import ActivityApi from "../../../api/BabyActivityApi";
import ApplySuccessTitle from "./ApplySuccessTitle.png";
import ActivityNotice from "./ActivityNotice.png";
import ActivityCap from "./ActivityCap.png";
import ActivityCancel from "./ActivityCancel.png";
import DateFormatterBeijing from "../../../utils/DateFormatterBeijing";
import FullScreenPage from "../../../ui/FullScreenPage/FullScreenPage";

class ApplySuccess extends Page {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        let userContext = UserContext.get();
        let organizationContext = OrganizationContext.get();
        this.setState({
            organizationId:organizationContext.organizationId
        });
        ActivityApi.SuccessMessage({
            accessToken: userContext.userToken,
        }, data => {
            let gender = data.babyInfo.gender === 1 ? "男宝宝" : "女宝宝";
            let babyBirthday = DateFormatterBeijing.toYMD(new Date(data.babyInfo.babyBirthday));
            let auditionDate = DateFormatterBeijing.toYMD(new Date(data.audition.auditionDate));
            let arr = ["第一场", "第二场", "第三场", "第四场", "第五场", "第六场", "第七场", "第八场", "第九场", "第十场", "第十一场", "第十二场", "第十三场", "第十四场", "第十五场", "第十六场", "第十七场", "第十八场", "第十九场", "第二十场", "第二十一场", "第二十二场", "第二十三场", "第二十四场", "第二十五场", "第二十六场"];
            let auditionNo = arr[data.audition.auditionNo - 1];
            let successDate = data.audition.districtNames;
            let auditionsAddress = successDate.length === 1 ? successDate[0] + data.audition.activityAddress : successDate[0] + successDate[1] + data.audition.activityAddress;
            let activityDate = data.audition.activityDate;
            let subtitle = data.audition.auditionPerform.promptMessage;
            let title = data.audition.auditionPerform.name;
            let picture = data.audition.auditionPerform.picture;
            let viewLink = data.audition.auditionPerform.viewLink;
            let promptMessage = data.audition.auditionPerform.matter;
            this.setState({
                babyBirthday: babyBirthday,
                babyName: data.babyInfo.babyName,
                competitionNo: data.babyInfo.competitionNo,
                gender: gender,
                activityDate: activityDate,
                babyPicture: data.babyInfo.picture,
                activityAddress: data.audition.activityAddress,
                auditionDate: auditionDate,
                auditionNo: auditionNo,
                districtNames: auditionsAddress,
                subtitle: subtitle,
                title: title,
                picture: picture,
                viewLink: viewLink,
                promptMessage: promptMessage,
            }, () => Screen.loading(false));
        }, error => Screen.loading(false, () => Screen.alert(error)));
    }

    render() {
        let {babyBirthday,promptMessage, babyName, competitionNo, gender, babyPicture, auditionDate, auditionNo, districtNames, activityDate, subtitle, title, picture,viewLink,organizationId} = this.state;
        return (
            <div className="ApplySuccess">
                <FullScreenPage style={{background: '#D4F2FF', zIndex: -1}}/>
                <div className="SuccessTitle">
                    <div className="TitleImg" style={{backgroundImage: 'url(' + ApplySuccessTitle + ')'}}>

                    </div>
                </div>
                <div className="SuccessMessage">
                    <div className="MessageBaby">
                        {(organizationId === undefined || organizationId === 0) &&
                        <div className="TitleCap" style={{backgroundImage: 'url(' + ActivityCap + ')'}}>

                        </div>
                        }
                        <div className="BabyPhoto" style={{backgroundImage: 'url(' + babyPicture + ')'}}/>
                        <div className="BabyNumber">
                            <p>报名编号：{competitionNo}</p>
                        </div>
                        <div className="BabyMessage">
                            <p>宝宝姓名：{babyName}</p>
                            <p>宝宝性别：{gender}</p>
                            <p>出生日期：{babyBirthday}</p>
                        </div>
                    </div>
                    <div className="MessageContent">
                        <div className="ContentTitle">
                            <label><p>日期：</p><p>{auditionDate}</p></label>
                            <label><p>场次：</p><p>{auditionNo + " " + activityDate}</p></label>
                            <label><p>地址：</p><p>{districtNames}</p></label>
                        </div>
                        <div className="ContentHint">
                            <div className="ContentNotice">
                                <div className="noticeImg" style={{backgroundImage: 'url(' + ActivityCancel + ')'}}>

                                </div>
                                <div className="noticeMessage">
                                    <span>取消报名需在海选活动开始前24小时提交，取消方式详见公众号菜单-咿呀乐园-海选须知。</span>
                                </div>
                            </div>
                            <div className="ContentNotice noticeChange">
                                <div className="noticeImg" style={{backgroundImage: 'url(' + ActivityNotice + ')'}}>

                                </div>
                                <div className="noticeMessage">
                                    <span>若未提前取消且未到场，1个月后方可再次报名。</span>
                                </div>
                            </div>

                        </div>
                        <div className="ContentPrompt">
                            <span>{subtitle}</span>
                        </div>
                        <div className="ContentProgram">
                            <div className="Program">
                                <label className="ProgramTitle">
                                    <span>表演节目《</span><span>{title}</span><span>》</span>
                                </label>
                            </div>
                        </div>
                        <div className="ContentImg">
                            {viewLink && viewLink.indexOf('https://v.qq.com/iframe/player.html') === 0 &&
                            <iframe frameBorder={0} style={{width:'100%',height:'3.43rem'}} src={viewLink} allowFullScreen={true} title={'video'}/>
                            }
                            {picture && viewLink.indexOf('https://v.qq.com/iframe/player.html') !== 0 &&
                            <a className="Img" style={{backgroundImage: 'url(' + picture + ')'}} href={viewLink}> </a>
                            }
                        </div>
                    </div>
                    <div className="MessageAddress">
                        <p>注意：</p>
                        <p>{promptMessage}</p>
                    </div>
                </div>
                <div className="footer">本次活动最终解释权归“咿呀咿呀”所有</div>
            </div>
        )
    }
}

export default ApplySuccess;