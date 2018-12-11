import './OrderCreateComment.css';
import React from 'react';
import PropTypes from 'prop-types';
import {TransitionGroup} from 'react-transition-group';
import FullScreenPage from "../../ui/FullScreenPage/FullScreenPage";
import Fade from "../../ui/Fade/Fade";
import FullScreenLoading from "../../ui/FullScreenLoading/FullScreenLoading";
import imageStar from './star.png';
import imageStarChecked from './star_checked.png';
import FixedBottom from "../../ui/FixedBottom/FixedBottom";
import Alert from "../../ui/Alert/Alert";
import UserContext from "../../model/UserContext";
import CommentsApi from "../../api/CommentsApi";
import Page from "../../ui/Page/Page";

class OrderCommentDetails extends Page {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            commentsId: props.match.params.commentsId,
            logo: decodeURIComponent(props.match.params.logo)
        };
    }

    componentDidMount() {
        if (!UserContext.isLoggedIn(this.props.history, this.props.match)) {
            return;
        }
        let userContext = UserContext.get();
        let {commentsId} = this.state;
        CommentsApi.get({
            accessToken: userContext.userToken,
            commentsId: commentsId
        }, data => {
            this.setState({
                loading: false,
                content: data.content,
                rate: data.score,
                pics: data.pictureList
            });
        }, error => {
            this.setState({
                loading: false,
                alertMessage: error
            });
        })
    }

    render() {
        let {loading, alertMessage, logo, rate, content, pics} = this.state;
        let rateStars = [];
        for (let i = 0; i < 5; i++) {
            rateStars.push(
                <a key={i} style={{backgroundImage: 'url(' + (rate && rate >= (i + 1) ? imageStarChecked : imageStar) + ')'}}> </a>
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
                    <textarea placeholder="快来写写您的使用心得吧，分享给小伙伴们" value={content ? content : ''} readOnly="readOnly"/>
                    {pics && pics.map(pic =>
                        <a key={pic} className="comment-pic" style={{backgroundImage: 'url(' + pic + ')'}}> </a>
                    )}
                    <FixedBottom>
                        <a className="button-submit" onClick={() => this.props.history.goBack()}>返回</a>
                    </FixedBottom>
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
                    </TransitionGroup>
                </div>
            </FullScreenPage>
        );
    }
}

OrderCommentDetails.propTypes = {
    parent: PropTypes.object
};

export default OrderCommentDetails;