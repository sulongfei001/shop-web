import './ActivityPandect.css';
import React from 'react';
import { Link } from 'react-router-dom';
import test1 from '../img/test1.png';
import test2 from '../img/test2.jpg';
import test3 from '../img/test3.png';
import test4 from '../img/test4.png';
import test5 from '../img/test5.png';
import Page from '../../../ui/Page/Page';
import Screen from "../../../utils/Screen";
import TopTitle from '../../../ui/TopTitle/TopTitle';
import OrganizationContext from "../../../model/OrganizationContext";


class ActivityPandect extends Page {
    constructor(props) {
        super(props);
        this.state = {};
        Screen.loading(true);
    }

    componentDidMount() {
        Screen.loading(false);
    }

    render() {
        let { history } = this.props;
        let organizationContext = OrganizationContext.get();
        let organizationId = (organizationContext.organizationId ? organizationContext.organizationId : 0);
        return (
            <div>
                <TopTitle title="活动总览" style={{ backgroundColor: "#333333" }} onClickBack={() => { history.goBack(); }} />
                <div className="ActivityPandect">
                    <Link to={'/baby/activity/partner/' + organizationId + '/type1'} style={{ backgroundImage: 'url(' + test1 + ')' }}>
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
                    </Link>
                </div>
            </div>
        );
    };
}

export default ActivityPandect;