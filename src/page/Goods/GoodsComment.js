import './GoodsComment.css'
import React from 'react';
import Screen from "../../utils/Screen";
import GoodsApi from "../../api/GoodsApi";
import Paging from "../../utils/Paging";
import UserContext from "../../model/UserContext";
import Weixin from "../../utils/Weixin";
import imageEmpty from './empty.png';
import Page from "../../ui/Page/Page";

class GoodsComment extends Page {
    constructor(props) {
        super(props);
        this.scroll = this.scroll.bind(this);
        this.loadData = this.loadData.bind(this);
        this.state = {
            goodsId: props.match.params.goodsId
        };
        Screen.loading(true);
    }

    componentDidMount() {
        window.addEventListener("scroll", this.scroll);
        this.loadData();
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.scroll);
    }

    scroll() {
        if (Screen.scrollHeight() - Screen.availHeight() - Screen.scrollTop() < 200) {
            this.loadData();
        }
    }

    loadData() {
        let {loadingComments, finishedLoading, comments, goodsId} = this.state;
        if (loadingComments || finishedLoading) return;
        if (!comments) comments = [];
        this.setState({
            loadingComments: true,
        }, () => {
            let userContext = UserContext.get();
            GoodsApi.commentsList({
                accessToken: userContext.userToken,
                goodsId: goodsId,
                pageSize: pageSize,
                pageNo: Paging.nextPageNo(comments.length, pageSize)
            }, data => {
                this.setState({
                    loadingComments: false,
                });
                Screen.loading(false);
                data.commentsList.forEach(c => {
                    comments.push({
                        id: c.commentsId,
                        avatar: c.avatar,
                        nickname: c.userName,
                        content: c.content,
                        pictures: c.pictureList,
                        originalPictures: c.originalPictureList
                    });
                });
                this.setState({
                    loadingComments: false,
                    comments: comments,
                    finishedLoading: data.commentsList.length === 0
                });
            }, error => {
                this.setState({
                    loadingComments: false,
                });
                Screen.loading(false, () => Screen.alert(error));
            });
        });
    }

    render() {
        let {comments} = this.state;
        return (
            <div className="GoodsComment">
                {comments && comments.length > 0 &&
                <div className="comment-list">
                    {comments.map(comment =>
                        <div key={comment.id} className="comment-item">
                            <img src={comment.avatar} alt="" className="avatar"/>
                            <label>{comment.nickname}</label>
                            <p>{comment.content}</p>
                            {comment.pictures && comment.pictures.length > 0 &&
                            <div className="pics">
                                {comment.pictures.map((pic, i) =>
                                    <img key={i} src={pic} alt="" onClick={() => Weixin.previewImage(comment.originalPictures[i], comment.originalPictures)}/>
                                )}
                            </div>
                            }
                        </div>
                    )}
                </div>
                }
                {comments && comments.length === 0 &&
                <div className="empty" style={{backgroundImage: 'url(' + imageEmpty + ')'}}>
                    该商品目前无评论
                </div>
                }
            </div>
        );
    }
}

const pageSize = 10;

export default GoodsComment;