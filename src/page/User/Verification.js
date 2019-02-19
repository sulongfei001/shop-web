import React, { Component } from 'react';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import Fade from "../../ui/Fade/Fade";
import Mask from "../../ui/Mask/Mask";
import FullScreenLoading from "../../ui/FullScreenLoading/FullScreenLoading";
import Screen from '../../utils/Screen'
import VerificationApi from '../../api/VerificationApi'
import UserContext from '../../model/UserContext'
import Common from '../../utils/Common'
import './Verification.css'
import ICON_QR from './Group Copy@2x.png'
import ICON_BAC from './yiyayiya_hexiao.png'
import Alert from '../../ui/Alert/Alert'
const PAGE_SIZE = 10
class Verification extends Component {
    constructor(props) {
        super(props)
        this.isRequesting = false
        this.state = {
            selIndex: 0,
            isRule: false,
            isQRCode: false,
            loading: true,
            list: null,
            pageNo: 1,
            pageNoTotal: null,
            rule: null,
            nav: [
                {
                    title: '未核销',
                    type: 1
                },
                {
                    title: '已核销',
                    type: 2
                },
                {
                    title: '已过期',
                    type: 5
                }
            ]
        }
        this.sel = this.sel.bind(this)
        this.showRule = this.showRule.bind(this)
        this.scroll = this.scroll.bind(this)
        this.showQRCode = this.showQRCode.bind(this)
    }

    componentDidMount() {
        window.addEventListener('scroll', this.scroll)
        this.init()
    }


    componentWillUnmount() {
        window.removeEventListener('scroll', this.scroll);
    }

    scroll() {
        if (Screen.scrollHeight() - Screen.availHeight() - Screen.scrollTop() < 200) {
            this.init()
        }
    }

    init() {
        let { selIndex, nav, pageNo, pageNoTotal, list } = this.state
        if (pageNoTotal && list && list.length >= pageNoTotal) return console.warn('所有数据请求完成')

        if (this.isRequesting) return console.warn('正在请求中')
        this.isRequesting = true

        let userContext = UserContext.get()
        // 1: 未核销  2: 已核销  3: 退货中   4: 已退款   5: 已过期
        let body = {
            accessToken: userContext.userToken,
            isUsed: nav[selIndex].type,
            pageSize: PAGE_SIZE,
            pageNo
        }
        VerificationApi.main(body, res => {
            let data = res.cardBags 
            data = data ? data : []
            this.isRequesting = false
            this.setState({
                pageNo: pageNo + 1,
                list: list ? [...list, ...data] : data,
                pageNoTotal: res.total,
                loading: false
            })
        }, err => {
            this.isRequesting = false
            this.setState({
                loading: false,
                alertMessage: err
            })
        })
    }

    sel(item, index) {
        this.setState({
            loading: true,
            selIndex: index,
            isRule: false,
            pageNo: 1,
            pageNoTotal: null,
            list: null
        }, () => this.init())
    }

    showRule(rule) {
        let { isRule } = this.state
        this.setState({
            isRule: !isRule,
            rule
        })
    }

    showQRCode = (qrurl) => {
        console.log(qrurl)
        let { isQRCode } = this.state
        this.setState({
            isRule: false,
            isQRCode: !isQRCode,
            qrurl: 'data:image/png;base64,' + qrurl
        })
    }

    render() {

        const isUse = {
            0: '未使用',
            1: '已核销',
            2: '已过期'
        }
        const { selIndex, isQRCode, isRule, loading, nav, list, qrurl, rule, alertMessage } = this.state

        return <div className="verification_root">
            {/* head */}
            <div className="verification_head">
                {
                    nav.map((item, index) => {
                        return <div
                            className={`head_item ${index === selIndex && 'active'}`}
                            key={index}
                            onClick={() => this.sel(item, index)}
                        >
                            {item.title}
                        </div>
                    })
                }
            </div>

            {/* content */}

            {
                (Array.isArray(list) && list.length === 0) &&
                    <div className="verification_con" style={{ textAlign: 'center', fontSize: '.35rem' }}>
                        无数据
                    </div>
            }
            {
                (Array.isArray(list) && list.length > 0) &&
                    <ul className="verification_con">
                        {
                            list.map((item, index) => {
                                return <li className="con_item" key={index}>
                                    <p className="con_item_head clearfix">
                                        <span className="fl">{item.virtualName}</span>
                                        <span className="fr">{isUse[selIndex]}</span>
                                    </p>

                                    <div className="con_item_main ">
                                        <img src={ICON_BAC} alt="" />
                                        <p className={`main_text ${item.isUsed === 2 && 'red_line'}`}>{item.virtualCode}</p>
                                        {
                                            selIndex === 0 && <img src={ICON_QR} alt="" className="img_qr_code" onClick={() => this.showQRCode(item.qrUrlPath)} />
                                        }
                                    </div>


                                    <div className="con_item_foot clearfix">
                                        <span className="fl rule" onClick={() => this.showRule(item.virtualCommon)}>详细规则</span>
                                        <span className="fr time">核销时间: {Common.timestampToTime(item.virtualStartDate)}-{Common.timestampToTime(item.virtualEndDate)}</span>
                                    </div>
                                </li>
                            })
                        }
                    </ul>
            }

            {/* pageroot */}
            <div className="page_bac"></div>

            <TransitionGroup>
                {(isQRCode) &&
                    <Fade >
                        <Mask
                            style={{ zIndex: 2 }}
                        />
                    </Fade>
                }
                {
                    isRule && <Fade>
                        <div className="verification_rule">
                            <div className="rule_close" onClick={this.showRule}>X</div>
                            <p className="title">使用说明</p>
                            <p className='content'>{rule} </p>
                            <div className="rule_btn" onClick={this.showRule}>确定</div>
                        </div>
                    </Fade>
                }
                {
                    isQRCode &&
                    <Fade>
                        <div className="verification_QR_img">
                            <img src={qrurl} alt="" />
                            <div onClick={this.showQRCode}>关闭</div>
                        </div>
                    </Fade>
                }
                {loading &&
                    <Fade>
                        <FullScreenLoading />
                    </Fade>
                }
                {
                    alertMessage && <Fade>
                        <Alert message={alertMessage} onClose={() => this.setState({ alertMessage: null })} />
                    </Fade>
                }
            </TransitionGroup>
        </div>
    }
}



export default Verification