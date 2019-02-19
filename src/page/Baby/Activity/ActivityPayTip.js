import "./ActivityPayTip.css";
import React from 'react';
import Page from "../../../ui/Page/Page";
import ApplyLogo from "./ApplyLogo.png";
import ApplyTitle from "./ApplyTitle.png";
import ApplyContent from "./ApplyContent.jpg";
import Screen from "../../../utils/Screen";
import ApplyTerraceMessage from "./ApplyTerraceMessage.png";
import ApplyTerraceCode from "./ApplyTerraceCode.jpg";
import FullScreenPage from "../../../ui/FullScreenPage/FullScreenPage";

import ICON_LOGO from '../img/yunduozi.png'
import ICON_APPLY from '../img/baominliuchen.png'
import ICON_AGREE from '../img/agree.png'
import ICON_CONFIRM from '../img/queding_big.png'
import ICON_CONTENT from '../img/liuchen123.png'
class ActivityPayTip extends Page {
    constructor(props) {
        super(props)
        this.state = {
            confirm: false
        }
    }

    agree = () => {
        let { confirm } = this.state
        this.setState({
            confirm: !confirm
        })
    }

    confirm = () => {

    }

    cancel = () => {
        this.props.history.goBack()
    }

    render() {
        let { confirm } = this.state
        return <div className="activity_pay_root">
            <img src={ICON_LOGO} className="pay_logo" alt="" />
            <img src={ICON_APPLY} className='pay_sub_logo' alt="" />
            <img src={ICON_CONTENT} className="pay_content" />
            <img src={ICON_AGREE} className="pay_agree" alt="" onClick={this.agree} />
            {
                confirm ?
                    <img src={ICON_CONFIRM} alt="" className="pay_confirm" onClick={this.confirm} />
                    :
                    <span className="pay_cancel" onClick={this.cancel}>取消</span>
            }



        </div>
    }
}

export default ActivityPayTip