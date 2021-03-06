import "./ApplyAuditionsPass4.css";
import { TransitionGroup } from 'react-transition-group';
import React from 'react';
import UserContext from "../../../model/UserContext";
import ActivityApi from "../../../api/BabyActivityApi";
import Page from "../../../ui/Page/Page";
import Fade from "../../../ui/Fade/Fade";
import ApplyPass from "../img/ApplyPass4.png";
import PhotoDog from "../img/PhotoDog3.png";
import PhotoBalloon from "../img/PhotoBalloon3.png";
import Screen from "../../../utils/Screen";
import FullScreenPage from "../../../ui/FullScreenPage/FullScreenPage";
import DateFormatter from "../../../utils/DateFormatter";
import TopTitle from '../../../ui/TopTitle/TopTitle';


class ApplyAuditionsPass4 extends Page {
    constructor(props) {
        super(props);
        this.state = {
            showTitle: false
        };
        this.topTitleScroll = this.topTitleScroll.bind(this);
        Screen.loading(true);
    }

    componentDidMount() {
        window.addEventListener("scroll", this.topTitleScroll);
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

    componentWillUnmount() {
        window.removeEventListener("scroll", this.topTitleScroll);
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

    render() {
        let { babyBirthday, babyName, gender, babyPicture, transcribeAddress, subtitle, title, viewLink, weixinNo, remark, picture, showTitle } = this.state;
        let { history } = this.props;
        return (
            <div className="ApplyAuditionsPass4" style={{ backgroundImage: 'url(' + PhotoDog + '),url(' + PhotoBalloon + ')' }}>
                {!showTitle &&
                    <TopTitle title="粉丝会预约报名" style={{ backgroundColor: "", opacity: 0.9 }} onClickBack={() => { history.goBack(); }} />}
                <TransitionGroup>
                    {showTitle && <Fade>
                        <TopTitle title="粉丝会预约报名" style={{ backgroundColor: "#333333", opacity: 0.9 }} onClickBack={() => { history.goBack(); }} />
                    </Fade>}
                </TransitionGroup>
                <FullScreenPage style={{ background: '#F5E5FF', zIndex: -1 }} />
                <div className="PassEmpty">
                </div>
                <div className="PassTitle" style={{ backgroundImage: 'url(' + ApplyPass + ')' }}>
                </div>
                <div className="PassMessage">
                    <div className="MessageBaby">
                        <div className="BabyPhoto" style={{ backgroundImage: 'url(' + babyPicture + ')' }}>

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
                            <label><p>请添加咿呀咿呀公众微信号：</p><p>{weixinNo}</p></label>
                            <label><p>并请务必备注：</p><p>{remark}</p></label>
                            <label><p>如有疑问，欢迎致电：</p><p>(021) 5223-7811</p></label>
                            <label style={{ marginTop: "0.3rem" }}>方便我们的工作人员及时告知您节目录制的相关安排。</label>
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
                                <iframe frameBorder={0} style={{ width: '100%', height: '3.43rem' }} src={viewLink} allowFullScreen={true} title={'video'} />
                            }
                            {picture && viewLink.indexOf('https://v.qq.com/iframe/player.html') !== 0 &&
                                <a className="Img" style={{ backgroundImage: 'url(' + picture + ')' }} href={viewLink}> </a>
                            }
                        </div>
                        <hr />
                        <div className="MessageAddress">
                            <p>入围后节目正式录制地点：上海</p>
                            <p>详细地址：{transcribeAddress}</p>
                        </div>
                    </div>
                </div>
                <div className="PassAnnotation">本次活动最终解释权归“咿呀咿呀”所有</div>
            </div>
        )
    }
}

export default ApplyAuditionsPass4;