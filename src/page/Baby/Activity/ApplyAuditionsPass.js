import "./ApplyAuditionsPase.css";
import React from 'react';
import UserContext from "../../../model/UserContext";
import ActivityApi from "../../../api/BabyActivityApi";
import Page from "../../../ui/Page/Page";
import ApplyPass from "./ApplyPass.png";
import Screen from "../../../utils/Screen";
import FullScreenPage from "../../../ui/FullScreenPage/FullScreenPage";
import DateFormatter from "../../../utils/DateFormatter";


class ApplyAuditionsPass extends Page {
    constructor(props) {
        super(props);
        this.state = {};
        Screen.loading(true);
    }

    componentDidMount() {
        let userContext = UserContext.get();
        ActivityApi.PassMessage({
            accessToken: userContext.userToken,
        }, data => {
            let gender = data.babyInfo.gender === 1 ? "男宝宝" : "女宝宝";
            let babyBirthday = DateFormatter.toYMD(new Date(data.babyInfo.babyBirthday));
            let auditionsAddress = data.audition.programAddress;
            let transcribeAddress = data.audition.auditionPerform.districtNames.join(' ');
            let subtitle = data.audition.auditionPerform.promptMessage;
            let title = data.audition.auditionPerform.name;
            let picture = data.audition.auditionPerform.picture;
            let viewLink = data.audition.auditionPerform.viewLink;
            this.setState({
                babyBirthday: babyBirthday,
                babyName: data.babyInfo.babyName,
                gender: gender,
                babyPicture: data.babyInfo.picture,
                districtNames: auditionsAddress,
                transcribeAddress: transcribeAddress,
                subtitle: subtitle,
                title: title,
                viewLink: viewLink,
                weixinNo: data.audition.auditionPerform.weixinNo,
                remark: data.audition.auditionPerform.remark,
                picture: picture,
            }, () => Screen.loading(false));
        }, error => {
            Screen.loading(false, () => Screen.alert(error))
        });
    }

    render() {
        let {babyBirthday,babyName,gender,babyPicture,transcribeAddress,subtitle,title,viewLink,weixinNo,remark,picture} = this.state;
        return (
            <div className="ApplyAuditionsPass">
                <FullScreenPage style={{background: '#D4F2FF', zIndex: -1}}/>
                <div className="PassEmpty">

                </div>
                <div className="PassTitle">
                    <div className="TitleImg" style={{backgroundImage: 'url(' + ApplyPass + ')'}}>

                    </div>
                </div>
                <div className="PassMessage">
                    <div className="MessageBaby">
                        <div className="BabyPhoto" style={{backgroundImage: 'url(' + babyPicture + ')'}}>

                        </div>
                        <div className="BabyMessage">
                            <p>宝宝姓名：{babyName}</p>
                            <p>宝宝性别：{gender}</p>
                            <p>出生日期：{babyBirthday}</p>
                        </div>
                    </div>
                    <div className="MessageContent">
                        <div className="ContentTitle">
                            <p>哇哦！您的宝宝将要跟</p>
                            <p>汪汪和小亦姐姐一起录制节目啦！</p>
                        </div>
                        <div className="ContentReminder">
                            <p>请您尽快添加咿呀咿呀工作微信号：</p>
                            <p className="next">{weixinNo}</p>
                            <p>并请务必备注：</p>
                            <p className="next">{remark}</p>
                            <p>方便我们的工作人员及时告知您节目录制的相关安排。</p>
                            <p>感谢您对“咿呀咿呀”的支持！</p>
                            <p>如有疑问，欢迎致电：(021) 5223-7811</p>
                        </div>
                        <div className="ContentProgram">
                            <div className="Program">
                                <label className="ProgramTitle">
                                    <span>表演节目《</span><span>{title}</span><span>》</span>
                                </label>
                            </div>
                            <div className="Reminder">
                                <p>({subtitle})</p>
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
                        <label className="address"><p>节目录制地点：{transcribeAddress}</p></label>
                    </div>
                </div>
                <div className="PassAnnotation">本次活动最终解释权归“咿呀咿呀”所有</div>
            </div>
        )
    }
}

export default ApplyAuditionsPass;