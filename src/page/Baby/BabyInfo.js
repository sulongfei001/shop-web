import "./BabyInfo.css";
import React from 'react';
import Page from "../../ui/Page/Page";
import Screen from "../../utils/Screen";
import UserContext from "../../model/UserContext";
import BabyApi from "../../api/BabyApi";
import DateFormatter from "../../utils/DateFormatter";
import FixedBottom from "../../ui/FixedBottom/FixedBottom";
import Uploader from "../../utils/Uploader";
import BabyList from "./BabyList";
import BabyEdit from "./BabyEdit";
import {Route} from 'react-router-dom';

class BabyInfo extends Page {
    constructor(props) {
        super(props);
        Screen.loading(true);
        this.state = {
            patriarchName:"",
            babyName:"",
            babyBirthday:"",
            permanentResidence:"",
            detailedAddress:"",
            BabyUpdate:"",
            babySex:"",
            isUpdate: true,
        };
        this.initUploader = this.initUploader.bind(this);
        this.destroyUploader = this.destroyUploader.bind(this);
        this.btnCompile = this.btnCompile.bind(this);
    }

    componentDidMount() {
        this.initUploader();
        let id = this.props.match.params.id;
        let userContext = UserContext.get();
        BabyApi.getBabyMessage({
            accessToken: userContext.userToken,
            babyInfoId: id,
        }, data => {
            let babyBirthday = DateFormatter.toYMD(new Date(data.babyBirthday));
            let permanentResidence = data.disctrictList.map(d => d.name).join(' ');
            let babyPhoto = data.picture;
            let babySex = data.gender;
            this.setState({
                patriarchName: data.parentName,
                babyName: data.babyName,
                babyBirthday: babyBirthday,
                permanentResidence: permanentResidence,
                detailedAddress: data.address,
                BabyUpdate: babyPhoto,
                babySex: babySex,
                isUpdate: data.isUpdate,
            }, () => Screen.loading(false));
        });
    }

    initUploader() {
        this.uploader = Uploader.create("submitButton", "avatar", file => {
            let userContext = UserContext.get();
            Screen.loading(true, () => BabyApi.updateBaby({
                accessToken: userContext.userToken,
                babyInfoId: this.props.match.params.id,
                picture: file.relativeUrl,
            }, data => Screen.loading(false, () => {
                if (data.code && data.code === 'error') {
                    Screen.alert(data.message);
                } else {
                    BabyList.instance.reload();
                    this.setState({
                        BabyUpdate: file.url + '?x-oss-process=style/baby_photo',
                    });
                }
            }), error => Screen.loading(false, () => Screen.alert(error))));
        });
    }

    destroyUploader() {
        if (this.uploader) {
            this.uploader.destroy();
            this.uploader = undefined;
        }
    }
    btnCompile(){
        let id = this.props.match.params.id;
        let path = "/baby/list/edit/" + id;
        this.props.history.push(path);
    }
    render() {
        let {match} = this.props;
        let {patriarchName,babyName,babyBirthday,permanentResidence,detailedAddress,BabyUpdate,babySex,isUpdate} = this.state;
        return (
            <div>
                {!this.isChildRoute() && babyName &&
                <div className="BabyInfo">
                    <div className="baby_photo">
                        <div className="photo_title">
                            宝宝照片
                        </div>
                        <div className="photo">
                            <div className="photo_update" style={{backgroundImage: 'url(' + BabyUpdate + ')'}}>
                            </div>
                        </div>
                    </div>
                    <div className="baby_message">
                        <ul>
                            <li>
                                <span>家长姓名</span>
                                <span className="content">{patriarchName}</span>
                            </li>
                            <li>
                                <span>宝宝姓名</span>
                                <span className="content">{babyName}</span>
                            </li>
                            <li>
                                <span>宝宝生日</span>
                                <span className="content">{babyBirthday}</span>
                            </li>
                            <li>
                                <span>性别</span>
                                <span className="content">{babySex === 1? "男": "女"}</span>
                            </li>
                            <li>
                                <span>常住地</span>
                                <span className="content">{permanentResidence}</span>
                            </li>
                            <li>
                                <span>详细地址</span>
                                <span className="content">{detailedAddress}</span>
                            </li>
                        </ul>
                    </div>
                    {!isUpdate &&
                    <FixedBottom>
                        <div className="baby_save_btn" onClick={() => this.btnCompile()}>
                            <span>修改信息</span>
                        </div>
                    </FixedBottom>
                    }
                </div>
                }
                <Route path={match.url + '/edit/:id'} component={BabyEdit}/>
            </div>
        );
    }
}

export default BabyInfo;