import './OrderCreateComment.css';
import React from 'react';
import PropTypes from 'prop-types';
import {TransitionGroup} from 'react-transition-group';
import FullScreenPage from "../../ui/FullScreenPage/FullScreenPage";
import Fade from "../../ui/Fade/Fade";
import FullScreenLoading from "../../ui/FullScreenLoading/FullScreenLoading";
import imageStar from './star.png';
import imageStarChecked from './star_checked.png';
import imageCamera from './camera.png';
import FixedBottom from "../../ui/FixedBottom/FixedBottom";
import Uploader from "../../utils/Uploader";
import Alert from "../../ui/Alert/Alert";
import Confirm from "../../ui/Confirm/Confirm";
import UserContext from "../../model/UserContext";
import CommentsApi from "../../api/CommentsApi";
import Screen from "../../utils/Screen";
import Page from "../../ui/Page/Page";

class OrderCreateComment extends Page {
    constructor(props) {
        super(props);
        this.rate = this.rate.bind(this);
        this.submit = this.submit.bind(this);
        this.confirmDeletePic = this.confirmDeletePic.bind(this);
        this.resize = this.resize.bind(this);
        this.state = {
            loading: true,
            rate: 5,
            expressId: parseInt(props.match.params.expressId, 10),
            skuId: parseInt(props.match.params.skuId, 10),
            logo: decodeURIComponent(props.match.params.logo)
        };
    }

    componentDidMount() {
        if (!UserContext.isLoggedIn(this.props.history, this.props.match)) {
            return;
        }
        this.uploader = Uploader.create('lnkUploadCommentPic', 'order/comment', up => {
            let {pics} = this.state;
            if (!pics) pics = [];
            pics.push(up);
            this.setState({pics: pics});
        }, error => this.setState({alertMessage: error}));
        this.setState({
            loading: false,
            aspectRatio: Screen.clientHeight() / Screen.clientWidth()
        });
        window.addEventListener('resize', this.resize);
    }

    componentWillUnmount() {
        if (this.uploader) {
            try {this.uploader.destroy();} catch(e) {}
        }
        window.removeEventListener('resize', this.resize);
    }

    resize() {
        this.setState({
            aspectRatio: Screen.clientHeight() / Screen.clientWidth()
        });
    }

    rate(number) {
        this.setState({
            rate: number
        });
    }

    submit() {
        let {rate, content, pics, expressId, skuId} = this.state;
        if (!content || content.trim().length < 5) {
            this.setState({alertMessage: '至少5个字才能提交哦～'});
            return;
        }
        this.setState({
            loading: true
        }, () => {
            let userContext = UserContext.get();
            CommentsApi.create({
                accessToken: userContext.userToken,
                goodsSkuId: skuId,
                orderExpressId: expressId,
                content: content,
                score: rate,
                pictureList: pics ? pics.map(p => p.relativeUrl) : []
            }, data => {
                let {parent, history} = this.props;
                if (parent) {
                    let {goodsList} = parent.state;
                    for (let i = 0; i < goodsList.length; i++) {
                        let g = goodsList[i];
                        if (g.skuId === skuId && g.expressId === expressId) {
                            g.commented = true;
                            break;
                        }
                    }
                    parent.setState({
                        goodsList: goodsList
                    });
                }
                history.goBack();
            }, error => {
                this.setState({
                    loading: false,
                    alertMessage: error
                });
            });
        });
    }

    confirmDeletePic(pic) {
        this.setState({
            confirm: {
                message: '要删除这张照片吗？',
                onConfirm: () => this.setState({
                    pics: this.state.pics.filter(p => p.url !== pic.url),
                    confirm: undefined
                }),
                onCancel: () => this.setState({confirm: undefined})
            }
        });
    }

    render() {
        let {loading, alertMessage, confirm, logo, rate, content, pics, aspectRatio} = this.state;
        let rateStars = [];
        for (let i = 0; i < 5; i++) {
            rateStars.push(
                <a key={i} style={{backgroundImage: 'url(' + (rate && rate >= (i + 1) ? imageStarChecked : imageStar) + ')'}} onClick={() => this.rate(i + 1)}> </a>
            );
        }
        return (
            <FullScreenPage style={{backgroundColor: '#f9f9f9'}}>
                <div className="OrderCreateComment">
                    <img src={logo} alt="" className="logo"/>
                    <label className="label-rate">评分：</label>
                    <div className="rate">
                        {rateStars}
                    </div>
                    <textarea placeholder="快来写写您的使用心得吧，分享给小伙伴们" value={content ? content : ''} onChange={e => this.setState({content: e.target.value})}/>
                    {(!content || content.length < 5) &&
                    <span className="content-hint">至少5个字才能提交哦～</span>
                    }
                    <a id="lnkUploadCommentPic" className="button-upload" style={{backgroundImage: 'url(' + imageCamera + ')', display: loading ? 'none' : ''}}>最多8张</a>
                    {pics && pics.map(pic =>
                        <a key={pic.relativeUrl} className="comment-pic" style={{backgroundImage: 'url(' + pic.url + '?x-oss-process=style/order_comment)'}} onClick={() => this.confirmDeletePic(pic)}> </a>
                    )}
                    {aspectRatio > 1.2 &&
                    <FixedBottom>
                        <a className="button-submit" onClick={this.submit}>提交</a>
                    </FixedBottom>
                    }
                    <TransitionGroup>
                        {loading &&
                        <Fade>
                            <FullScreenLoading/>
                        </Fade>
                        }
                        {alertMessage &&
                        <Fade>
                            <Alert message={alertMessage} onClose={() => this.setState({alertMessage: undefined})}/>
                        </Fade>
                        }
                        {confirm &&
                        <Fade>
                            <Confirm message={confirm.message} onConfirm={confirm.onConfirm} onCancel={confirm.onCancel}/>
                        </Fade>
                        }
                    </TransitionGroup>
                </div>
            </FullScreenPage>
        );
    }
}

OrderCreateComment.propTypes = {
    parent: PropTypes.object
};

export default OrderCreateComment;