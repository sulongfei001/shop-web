import "./ActivityNone.css";
import React from 'react';
import Page from "../../../ui/Page/Page";
import ApplyLogo from "./ApplyLogo.png";
import ApplyTitle from "./ApplyTitle.png";
import ApplyContent from "./ApplyContent.jpg";
import Screen from "../../../utils/Screen";
import ApplyTerraceMessage from "./ApplyTerraceMessage.png";
import ApplyTerraceCode from "./ApplyTerraceCode.jpg";
import FullScreenPage from "../../../ui/FullScreenPage/FullScreenPage";
import { height } from "window-size";
// TODO: 习游活动图片标记
import ICON_ACTIVITY from './xiyou_activity.jpeg'
class ActivityApply extends Page {
    constructor(props) {
        super(props);
        this.state = {};
        Screen.loading(true);
    }

    componentDidMount() {
        Screen.loading(false);
    }

    render() {
        return (
            <div>

                <FullScreenPage style={{ background: '#D4F2FF' }}>
                    {
                        true ? <img src={ICON_ACTIVITY}  style={{width: '100%', height: window.screen.height + 'px'}}/> :
                            <div className="ActivityNone">
                                <div className="ApplyLogo">
                                    <div className="LogoImg" style={{ backgroundImage: 'url(' + ApplyLogo + ')' }}>

                                    </div>
                                </div>
                                <div className="ApplyTitle">
                                    <div className="TitleImg" style={{ backgroundImage: 'url(' + ApplyTitle + ')' }}>

                                    </div>
                                </div>
                                <div className="ApplyStart">
                                    即将开始报名
                </div>
                                <div className="ApplyContent">
                                    <div className="ContentImg" style={{ backgroundImage: 'url(' + ApplyContent + ')' }}>

                                    </div>
                                </div>
                                <div className="ApplyTerrace">
                                    <div className="TerraceMessage">
                                        <div className="MessageImg" style={{ backgroundImage: 'url(' + ApplyTerraceMessage + ')' }}>

                                        </div>
                                    </div>
                                    <div className="TerraceCode">
                                        <div className="CodeImg" style={{ backgroundImage: 'url(' + ApplyTerraceCode + ')' }}>

                                        </div>
                                        <div className="CodeMessage">
                                            <p>请密切关注微信公众号</p>
                                            <p>第一时间获取海选信息</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                    }


                </FullScreenPage>
            </div>
        );
    }
}

export default ActivityApply;