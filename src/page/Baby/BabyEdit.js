import "./BabyEdit.css";
import React from 'react';
import Page from "../../ui/Page/Page";
import imgArrows from './arrowsImg.png';
import BabyUpdate from "./addBabyUpdate.png";
import Uploader from "../../utils/Uploader";
import UserContext from "../../model/UserContext";
import OrganizationContext from "../../model/OrganizationContext";
import Screen from "../../utils/Screen";
import BabyApi from "../../api/BabyApi";
import FixedBottom from "../../ui/FixedBottom/FixedBottom";
import BabyList from "./BabyList";
import DateFormatter from "../../utils/DateFormatter";

class BabyEdit extends Page {
    constructor(props) {
        super(props);
        this.state = {
            id: props.match.params.id,
            BabyPicture: BabyUpdate,
            patriarchName: "",
            babyName: "",
            BabyPhoto: "",
            babyBirthday: undefined,
            permanentResidence: "",
            detailedAddress: "",
            aspectRatio: "",
            date: "",
            isUpdate: true,
            babySex:"",
        };
        this.initUploader = this.initUploader.bind(this);
        this.destroyUploader = this.destroyUploader.bind(this);
        this.districtSelected = this.districtSelected.bind(this);
        this.submit = this.submit.bind(this);
        this.resize = this.resize.bind(this);
        this.cancel = this.cancel.bind(this);
        Screen.loading(true);
    }

    componentDidMount() {
        let {history, match} = this.props;
        if (!UserContext.isLoggedIn(history, match)) {
            return;
        }
        this.initUploader();
        window.addEventListener('resize', this.resize);
        this.resize();
        if (this.state.id) {
            let userContext = UserContext.get();
            BabyApi.getBabyMessage({
                accessToken: userContext.userToken,
                babyInfoId: this.state.id,
            }, data => {
                if(data.parentName === "" || data.babyName === ""){
                    this.setState({
                        compile: true
                    });
                }
                this.setState({
                    detailedAddress: data.address,
                    patriarchName: data.parentName,
                    babyName: data.babyName,
                    babyBirthday: new Date(data.babyBirthday),
                    districtId: data.districtId,
                    BabyPicture: data.picture,
                    babyGender: data.gender,
                    BabyPhoto: data.originalPicture,
                    isUpdate: data.isUpdate,
                    permanentResidence: data.disctrictList.map(d => d.name).join(' ')
                }, () => Screen.loading(false));
            }, error => Screen.loading(false, () => Screen.alert(error)));
        } else {
            Screen.loading(false);
        }
    }

    componentWillUnmount() {
        this.destroyUploader();
        window.removeEventListener('resize', this.resize);
    }

    resize() {
        this.setState({
            aspectRatio: Screen.clientHeight() / Screen.clientWidth()
        });
    }

    initUploader() {
        this.uploader = Uploader.create("babyUpdate", "avatar", file => {
            this.setState({
                BabyPhoto: file.relativeUrl,
                BabyPicture: file.url
            });
        });
    }

    destroyUploader() {
        if (this.uploader) {
            this.uploader.destroy();
            this.uploader = undefined;
        }
    }

    districtSelected(district, parentDistricts) {
        parentDistricts.push(district);
        this.setState({
            districtId: district.id,
            permanentResidence: parentDistricts ? parentDistricts.map(d => d.name).reduce((a, b) => a + ' ' + b) : '',
            showDistrict: undefined,
        })
    }
    cancel(){
        this.props.history.goBack();
    }
    submit() {
        let {id, babyGender, patriarchName, babyName, babyBirthday, detailedAddress, BabyPhoto, districtId} = this.state;
        let userContext = UserContext.get();
        if(BabyPhoto === ""){
            Screen.alert("请上传宝宝头像！");
        }else {
            if (id) {
                Screen.confirm("","宝宝信息修改之后不能再做变更，请谨慎提交",() =>{
                    BabyApi.updateBaby({
                        accessToken: userContext.userToken,
                        babyInfoId: id,
                        picture: BabyPhoto,
                        gender: babyGender,
                        parentName: patriarchName,
                        babyName: babyName,
                        babyBirthday: babyBirthday,
                        districtId: districtId,
                        address: detailedAddress,
                    }, () => {
                        this.props.history.push("/baby/list");
                        BabyList.instance.reload();
                    }, error => {
                        Screen.alert(error);
                    });
                })
            } else {
                Screen.confirm("","请确认宝宝信息填写无误",()=>{
                    BabyApi.creatBaby({
                        accessToken: userContext.userToken,
                        picture: BabyPhoto,
                        gender: babyGender,
                        parentName: patriarchName,
                        babyName: babyName,
                        babyBirthday: babyBirthday,
                        districtId: districtId,
                        address: detailedAddress,
                    }, data => {
                        //设置父级的state
                        let organizationContext =  OrganizationContext.get();
                        if(organizationContext.organizationId && organizationContext.organizationId> 0){
                            this.props.history.push("/activity");
                        }else{
                            this.props.history.push("/baby/list");
                        }
                        if (BabyList.instance) {
                            //调用父级的函数
                            BabyList.instance.reload();
                        }
                    }, error => {
                        Screen.alert(error);
                    });
                })
            }
        }
    }
    render() {
        let {babyGender, BabyPicture, patriarchName, aspectRatio, babyName, babyBirthday, permanentResidence, detailedAddress,babySex} = this.state;
        let canSubmit = (babyGender !== 1 || babyGender !== 2) && BabyPicture !== "" && patriarchName !== "" && babyName !== "" && permanentResidence !== "" && detailedAddress !== "";
        return (
            <div>
                {!this.isChildRoute() &&
                <div className="BabyEdit">
                    <div className="baby_photo_update">
                        <div className="photo_title">
                            宝宝照片
                        </div>
                        <div className="photo">
                            <div className="photo_update" id="babyUpdate"
                                 style={{backgroundImage: 'url(' + BabyPicture + ')'}}>
                            </div>
                            <div className="arrows" style={{backgroundImage: 'url(' + imgArrows + ')'}}>
                                <span> </span>
                            </div>
                        </div>
                    </div>
                    <div className="baby_message">
                        <ul>
                            <li>
                                <span>家长姓名</span>
                                <input type="text" placeholder="" value={patriarchName}
                                       onChange={event => this.setState({patriarchName: event.target.value})} maxLength="10"/>
                                <div className="arrows" style={{backgroundImage: 'url(' + imgArrows + ')'}}>
                                    <span> </span>
                                </div>
                            </li>
                            <li>
                                <span>宝宝姓名{babySex}</span>

                                    <input type="text" placeholder="" value={babyName}
                                           onChange={event => this.setState({babyName: event.target.value})} maxLength="10"/>
                                    <div className="arrows" style={{backgroundImage: 'url(' + imgArrows + ')'}}>
                                        <span> </span>
                                    </div>
                            </li>
                            <li onClick={() => Screen.pickDate(pickedDate => {
                                this.setState({babyBirthday: pickedDate});
                            }, {date: babyBirthday})}>
                                <span>宝宝生日</span>
                                <label className={babyBirthday ? "babyLabel" : "babyLabelSelected"}>
                                    {babyBirthday ? DateFormatter.toYMD(babyBirthday) : ""}
                                </label>
                                <div className="arrows" style={{backgroundImage: 'url(' + imgArrows + ')'}}>
                                    <span> </span>
                                </div>
                            </li>
                            <li>
                                <span>性别</span>
                                <label className="changeSex">
                                    <select onChange={event => this.setState({babyGender: event.target.value})}>
                                        <option value=""> </option>
                                        <option value="1" selected={babyGender === 1 ? "selected" : ""}>男</option>
                                        <option value="2" selected={babyGender === 2 ? "selected" : ""}>女</option>
                                    </select>
                                </label>
                                <div className="arrows" style={{backgroundImage: 'url(' + imgArrows + ')'}}>
                                    <span> </span>
                                </div>
                            </li>
                            <li onClick={() => Screen.selectDistrict(this.districtSelected)}>
                                <span>常住地</span>
                                <label className={permanentResidence ? "babyLabel" : "babyLabelSelected"}>
                                    {permanentResidence ? permanentResidence : ""}
                                </label>
                                <div className="arrows" style={{backgroundImage: 'url(' + imgArrows + ')'}}>
                                    <span> </span>
                                </div>
                            </li>
                            <li>
                                <span>详细地址</span>
                                <input type="text" placeholder="" value={detailedAddress}
                                       onChange={event => this.setState({detailedAddress: event.target.value})} className="detailedAddress"/>
                                <div className="arrows" style={{backgroundImage: 'url(' + imgArrows + ')'}}>
                                    <span> </span>
                                </div>
                            </li>
                        </ul>
                    </div>
                    {aspectRatio > 1 &&
                    <FixedBottom>
                        {canSubmit &&
                        <div className="baby_save_btn_next" >
                            <span onClick={() => this.cancel()}>取消</span>
                            <span onClick={() => this.submit()}>保存</span>
                        </div>
                        }
                        {!canSubmit &&
                        <div className="baby_save_btn" >
                            <span onClick={() => this.cancel()}>取消</span>
                            <span>保存</span>
                        </div>
                        }
                    </FixedBottom>
                    }
                </div>
                }
            </div>
        );
    }
}

export default BabyEdit;