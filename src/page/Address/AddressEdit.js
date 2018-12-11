import './AddressEdit.css';
import React from 'react';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import PropTypes from 'prop-types';
import FixedBottom from "../../ui/FixedBottom/FixedBottom";
import imagePath from './path.png';
import imageChecked from './checked.png';
import imageUnchecked from './unchecked.png';
import Fade from "../../ui/Fade/Fade";
import FullScreenPage from "../../ui/FullScreenPage/FullScreenPage";
import Alert from "../../ui/Alert/Alert";
import UserContext from "../../model/UserContext";
import DeliveryAddressApi from "../../api/DeliveryAddressApi";
import FullScreenLoading from "../../ui/FullScreenLoading/FullScreenLoading";
import Screen from "../../utils/Screen";
import Page from "../../ui/Page/Page";
import Common from "../../utils/Common"
class AddressEdit extends Page {
    constructor(props) {
        super(props);
        this.setAddress = this.setAddress.bind(this);
        this.districtSelected = this.districtSelected.bind(this);
        this.saveAddress = this.saveAddress.bind(this);
        this.resize = this.resize.bind(this);
        this.state = {
            loading: true
        }
    }

    componentDidMount() {

        let { history, match } = this.props;
        if (!UserContext.isLoggedIn(history, match)) {
            return;
        }
        this.resize();
        window.addEventListener('resize', this.resize);
        if (match.params.id) {
            let userContext = UserContext.get();
            DeliveryAddressApi.get({
                accessToken: userContext.userToken,
                deliveryAddressId: match.params.id
            }, data => {
                let districts = data.districtList.map(d => {
                    return {
                        id: d.districtId,
                        name: d.name
                    };
                })
                this.setState({
                    loading: false,
                    AdsWhetherFull: Common.checkAddress(districts),
                    address: {
                        id: data.deliveryAddressId,
                        name: data.consignee,
                        phoneNumber: data.phoneNumber,
                        isDefault: data.isDefault,
                        content: data.address,
                        post: data.postCode,
                        districts
                    }
                });
            }, error => {
                this.setState({
                    loading: false,
                    alertMessage: error
                });
            });
        } else {
            this.setState({
                loading: false
            });
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resize);
    }

    resize() {
        this.setState({
            aspectRatio: Screen.clientHeight() / Screen.clientWidth()
        });
    }

    setAddress(name, value) {
        // // 电话号码 去除空格，位数限制，包含固话
        // if (name === 'phoneNumber') {
        //     value = value.replace(/\s+/g, "");
        //     value = value.length > 11 ? value.substring(0, 11) : value
        // }
        let { address } = this.state;
        if (!address) address = {};
        address[name] = value;
        this.setState({
            address: address
        });
    }

    districtSelected(district, parentDistricts, addressInfo) {
        let { address } = this.state;
        if (!address) address = {};
        address.districts = [];
        parentDistricts && parentDistricts.forEach(p => address.districts.push(p));
        address.districts.push(district);
        addressInfo && (address.addressInfo = addressInfo)
        this.setState({
            address: address,
            showDistrict: undefined,
            AdsWhetherFull: Common.checkAddress(address.addressInfo)
        })
    }

    saveAddress() {
        let { address, AdsWhetherFull } = this.state;
        let { onSave } = this.props;
        if (!address) {
            this.setState({ alertMessage: "请填写地址信息" });
            return;
        }
        if (AdsWhetherFull) {
            this.setState({
                alertMessage: "请补充所在地区信息"
            })
            return
        }
        if (!address.name || address.name.length === 0) {
            this.setState({ alertMessage: "请填写收货人姓名" });
            return;
        }
        if (!address.phoneNumber || address.phoneNumber.length !== 11) {
            this.setState({ alertMessage: "请填写有效电话号码" });
            return;
        }
        if (!address.districts || address.districts.length === 0) {
            this.setState({ alertMessage: "请选择所在地区" });
            return;
        }
        if (!address.content || address.content.length === 0) {
            this.setState({ alertMessage: "请填写详细地址" });
            return;
        }
        // if (!address.post || address.post.length === 0) {
        //     this.setState({ alertMessage: "请填写邮政编码" });
        //     return;
        // }
        this.setState({
            loading: true
        });
        let userContext = UserContext.get();
        if (address.id) {
            DeliveryAddressApi.update({
                accessToken: userContext.userToken,
                deliveryAddressId: address.id,
                consignee: address.name,
                postCode: address.post ? address.post : '000000',
                districtId: address.districts[address.districts.length - 1].id,
                phoneNumber: address.phoneNumber,
                address: address.content,
                isDefault: address.isDefault === true
            }, () => {
                if (onSave) {
                    onSave(address);
                }
            }, error => {
                this.setState({
                    loading: false,
                    alertMessage: error
                });
            });
        } else {
            DeliveryAddressApi.create({
                accessToken: userContext.userToken,
                consignee: address.name,
                postCode: address.post ? address.post : '000000',
                districtId: address.districts[address.districts.length - 1].id,
                phoneNumber: address.phoneNumber,
                address: address.content,
                isDefault: address.isDefault === true
            }, () => {
                if (onSave) {
                    onSave(address);
                }
            }, error => {
                this.setState({
                    loading: false,
                    alertMessage: error
                });
            });
        }
    }

    render() {
        let { address, alertMessage, loading, aspectRatio, AdsWhetherFull } = this.state;
        return (
            <FullScreenPage style={{ backgroundColor: '#f9f9f9' }}>
                <div className="AddressEdit">
                    <ul>
                        <li>
                            <label>收货人姓名：</label>
                            <input type="text" value={address && address.name ? address.name : ''} onChange={(e) => this.setAddress('name', e.target.value)} />
                        </li>
                        <li>
                            <label>电话号码：</label>
                            <input type="tel" value={address && address.phoneNumber ? address.phoneNumber : ''} onChange={(e) => this.setAddress('phoneNumber', e.target.value)} />
                        </li>
                        <li>
                            <a className="district one-txt" style={{ backgroundImage: 'url(' + imagePath + ')' }} onClick={() => Screen.selectDistrict(this.districtSelected)}>
                                所在地区：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                {address &&
                                    ((address.addressInfo || address.districts) ? (address.addressInfo || address.districts).map(d => d.name).reduce((a, b) => a + ' ' + b) : '')}
                                {
                                    AdsWhetherFull && <span className='color-main f24'>
                                        &nbsp;&nbsp;&nbsp;信息待补全
                                    </span>
                                }
                            </a>
                        </li>
                        <li>
                            <label>详细地址：</label>
                            <input type="text" placeholder="输入省市区完整地址" value={address && address.content ? address.content : ''} onChange={(e) => this.setAddress('content', e.target.value)} />
                        </li>
                        <li>
                            <label>邮政编码：</label>
                            <input type="number" placeholder='(非必填)' value={address && address.post ? address.post : ''} onChange={(e) => this.setAddress('post', e.target.value.substring(0, 6))} />
                        </li>
                    </ul>
                    <a className="default" style={{ backgroundImage: 'url(' + (address && address.isDefault ? imageChecked : imageUnchecked) + ')' }} onClick={() => this.setAddress('isDefault', !(address && address.isDefault))}>设为默认地址</a>
                    {aspectRatio > 1 &&
                        <FixedBottom>
                            <a className="save" onClick={this.saveAddress}>保存并使用</a>
                        </FixedBottom>
                    }
                    <TransitionGroup>
                        {loading &&
                            <Fade>
                                <FullScreenLoading />
                            </Fade>
                        }
                        {alertMessage &&
                            <Fade>
                                <Alert message={alertMessage} onClose={() => this.setState({ alertMessage: undefined })} />
                            </Fade>
                        }
                    </TransitionGroup>
                </div>
            </FullScreenPage>
        );
    }
}

AddressEdit.propTypes = {
    onSave: PropTypes.func
};

export default AddressEdit;