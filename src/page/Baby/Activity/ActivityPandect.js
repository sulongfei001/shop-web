import './ActivityPandect.css';
import React from 'react';
import { Link } from 'react-router-dom';
import Page from '../../../ui/Page/Page';
import Screen from "../../../utils/Screen";
import TopTitle from '../../../ui/TopTitle/TopTitle';
import OrganizationContext from "../../../model/OrganizationContext";
import UserContext from "../../../model/UserContext";
import ActivityApi from "../../../api/BabyActivityApi";

class ActivityPandect extends Page {
    constructor(props) {
        super(props);
        this.state = {
            activityInfoList: ""
        };
        Screen.loading(true);
    }

    componentDidMount() {
        let { history, match } = this.props;
        if (!UserContext.isLoggedIn(history, match)) {
            return;
        }
        let userContext = UserContext.get();
        ActivityApi.queryActivityCategory({
            accessToken: userContext.userToken
        }, data => {
            console.log(data)
            this.setState({
                activityInfoList: data.activityInfoList
            }, Screen.loading(false));
        });
    }

    render() {
        let { history } = this.props;
        let { activityInfoList } = this.state;
        let organizationContext = OrganizationContext.get();
        let organizationId = (organizationContext.organizationId ? organizationContext.organizationId : 0);
        return (
            <div>
                <TopTitle title="活动总览" style={{ backgroundColor: "#333333", opacity: 0.9 }} onClickBack={() => { history.goBack(); }} />
                <div className="ActivityPandect">
                    {activityInfoList && activityInfoList.length > 0 && activityInfoList.map(activityInfo => {
                        let { activityCategoryId, activityCategoryName, activityComUrl, bannerUrl, pictureUrl, status } = activityInfo;
                        let statusName = '';
                        let styleName = '';
                        if (activityCategoryId == 1) {
                            styleName = {
                                backgroundColor: '#D38CFF'
                            };
                        } else if (activityCategoryId == 2) {
                            styleName = {
                                backgroundColor: '#8CFFCF'
                            };
                        } else if (activityCategoryId == 3) {
                            styleName = {
                                backgroundColor: '#8C9AFF'
                            };
                        } else if (activityCategoryId == 4) {
                            styleName = {
                                backgroundColor: '#8DC6FF'
                            };
                        } else if (activityCategoryId == 5) {
                            styleName = {
                                backgroundColor: '#FF8C8C'
                            };
                        } else if (activityCategoryId == 6) {
                            styleName = {
                                backgroundColor: '#FFB48C'
                            };
                        }
                        if (status == 1) {
                            statusName = <span>即将开始</span>;
                        } else if (status == 2) {
                            statusName = <span style={{ border: "1px solid #FFFFFF" }}>立即报名</span>;
                        } else if (status == 3) {
                            statusName = <span style={{ border: "1px solid #FFFFFF" }}>完成报名</span>;
                        } else if (status == 4) {
                            statusName = <span style={{ border: "1px solid #FFFFFF" }}>查询结果</span>;
                        }
                        return (
                            <Link key={activityCategoryId} to={'/baby/activity/partner/' + organizationId + '/' + activityCategoryId} style={{ backgroundImage: 'url(' + pictureUrl + ')' }}>
                                <div className="ActivityState" style={styleName}>
                                    <div className="TextLeft">{activityCategoryName}</div>
                                    <div className="TextRight">
                                        {statusName}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}



                    {/* <Link to={'/baby/activity/partner/' + organizationId + '/type1'} style={{ backgroundImage: 'url(' + test1 + ')' }}>
                        <div className="ActivityState" style={{ backgroundColor: "#FF8C8C" }}>
                            <div className="TextLeft">外景模特报名</div>
                            <div className="TextRight">
                                <span style={{ border: "1px solid #FFFFFF" }}>立即报名</span>
                            </div>
                        </div>
                    </Link>
                    <Link to={'/baby/activity/partner/' + organizationId + '/type2'} style={{ backgroundImage: 'url(' + test2 + ')', opacity: 0.5 }}>
                        <div className="ActivityState" style={{ backgroundColor: "#8C9AFF" }}>
                            <div className="TextLeft">电视模特报名</div>
                            <div className="TextRight">
                                <span>即将开始</span>
                            </div>
                        </div>
                    </Link>
                    <Link to={'/baby/activity/partner/' + organizationId + '/type3'} style={{ backgroundImage: 'url(' + test3 + ')', opacity: 0.5 }}>
                        <div className="ActivityState" style={{ backgroundColor: "#FFB48C" }}>
                            <div className="TextLeft">平面模特报名</div>
                            <div className="TextRight">
                                <span style={{ border: "1px solid #FFFFFF" }}>完成报名</span>
                            </div>
                        </div>
                    </Link>
                    <Link to={'/baby/activity/partner/' + organizationId + '/type4'} style={{ backgroundImage: 'url(' + test4 + ')' }}>
                        <div className="ActivityState" style={{ backgroundColor: "#D38CFF" }}>
                            <div className="TextLeft">粉丝会预约报名</div>
                            <div className="TextRight">
                                <span style={{ border: "1px solid #FFFFFF" }}>查询结果</span>
                            </div>
                        </div>
                    </Link>
                    <Link to={'/baby/activity/partner/' + organizationId + '/type5'} style={{ backgroundImage: 'url(' + test5 + ')' }}>
                        <div className="ActivityState" style={{ backgroundColor: "#8CFFCF" }}>
                            <div className="TextLeft">直播棚录报名</div>
                            <div className="TextRight">
                                <span style={{ border: "1px solid #FFFFFF" }}>查询结果</span>
                            </div>
                        </div>
                    </Link> */}
                </div>
            </div>
        );
    };
}

export default ActivityPandect;