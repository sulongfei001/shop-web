import './CustomerService.css';
import React from 'react';
import Page from "../../ui/Page/Page";
import imageQr from './dyh-qr.png';
import imageLogo from './logo.png';
import FullScreenPage from "../../ui/FullScreenPage/FullScreenPage";

class CustomerService extends Page {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div>
                <div className="CustomerService">
                    <FullScreenPage style={{backgroundColor: '#fff'}}>
                        <div className="info" style={{backgroundImage: 'url(' + imageLogo + ')'}}>
                            您好，如果您对商品有任何咨询或疑问，可通过下方二维码关注 咿呀咿呀 公众号 <span className="strong">在对话框中输入“<span className="tag">人工客服+问题描述+联系方式</span>” 客服将于一个工作日内联系您。</span>
                        </div>
                        <div className="qr">
                            <img src={imageQr} alt=""/><br/>
                            您也可以拨打我们的客服热线进行电话咨询<br/>
                            客服热线：021-52237811<br/>
                            工作时间：周一至周五 10:00-18:00
                        </div>
                    </FullScreenPage>
                </div>
            </div>
        );
    }
}

export default CustomerService;