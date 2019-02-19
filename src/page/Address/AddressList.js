import './AddressList.css';
import React from 'react';
import { Route, Link } from 'react-router-dom';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import PropTypes from 'prop-types';
import imageChecked from './checked.png';
import imageUnchecked from './unchecked.png';
import imageDel from './del.png';
import imageEdit from './edit.png';
import FixedBottom from "../../ui/FixedBottom/FixedBottom";
import Fade from "../../ui/Fade/Fade";
import Confirm from "../../ui/Confirm/Confirm";
import AddressEdit from "./AddressEdit";
import Alert from "../../ui/Alert/Alert";
import FullScreenLoading from "../../ui/FullScreenLoading/FullScreenLoading";
import UserContext from "../../model/UserContext";
import DeliveryAddressApi from "../../api/DeliveryAddressApi";
import imageEmpty from './empty.png';
import Page from "../../ui/Page/Page";
import Common from '../../utils/Common'
class AddressList extends Page {
    constructor(props) {
        super(props);
        this.switchDefault = this.switchDefault.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);
        this.doDelete = this.doDelete.bind(this);
        this.addressCreated = this.addressCreated.bind(this);
        this.addressUpdated = this.addressUpdated.bind(this);
        this.addressSelected = this.addressSelected.bind(this);
        this.state = {
            url: props.match.url,
            loading: true
        };
    }

    componentDidMount() {
        let {match, history} = this.props;
        if (!UserContext.isLoggedIn(history, match)) return;
        let userContext = UserContext.get();
        let request = {
            accessToken: userContext.userToken,
            pageSize: 100,
            pageNo: 1
        };
        if (match.params.skuIdList) {
            request.goodsSkuIds = match.params.skuIdList.split(',').map(id => parseInt(id, 10));
        }
        DeliveryAddressApi.list(request, data => this.setState({
            loading: false,
            addresses: data.deliveryAddressList.map(a => {
                return {
                    id: a.deliveryAddressId,
                    name: a.consignee,
                    phoneNumber: a.phoneNumber,
                    isDefault: a.isDefault,
                    districts: a.districtList.map(d => {
                        return {
                            id: d.districtId,
                            name: d.name
                        };
                    }),
                    content: a.address,
                    post: a.postCode,
                    supported: a.supported,
                    AdsWhetherFull:  Common.checkAddress( a.districtList.map(d => {
                        return {
                            id: d.districtId,
                            name: d.name
                        };
                    }))
                };
            })
        },()=>{
            console.log(this.state.addresses)
        }), error => this.setState({
            loading: false,
            alertMessage: error
        }));
    }

    switchDefault(address) {
        if (address.isDefault) return;
        this.setState({
            loading: true
        });
        let userContext = UserContext.get();
        DeliveryAddressApi.update({
            accessToken: userContext.userToken,
            deliveryAddressId: address.id,
            consignee: address.name,
            postCode: address.post,
            districtId: address.districts[address.districts.length - 1].id,
            phoneNumber: address.phoneNumber,
            address: address.content,
            isDefault: true
        }, data => {
            let {addresses} = this.state;
            addresses.forEach(a => a.isDefault = false);
            address.isDefault = true;
            this.setState({
                loading: false,
                addresses: addresses
            });
        }, error => {
            this.setState({
                loading: false,
                alertMessage: error
            });
        });

    }

    confirmDelete(address) {
        this.setState({
            confirm: {
                title: "确定要删除该地址吗？",
                onConfirm: () => this.doDelete(address),
                onCancel: () => this.setState({confirm: undefined})
            }
        });
    }

    doDelete(address) {
        this.setState({
            loading: true,
            confirm: undefined
        });
        let userContext = UserContext.get();
        DeliveryAddressApi.delete({
            accessToken: userContext.userToken,
            deliveryAddressIds: [address.id]
        }, () => {
            let {addresses} = this.state;
            addresses = addresses.filter(a => a.id !== address.id);
            this.setState({
                loading: false,
                addresses: addresses
            });
            let {orderConfirmPage} = this.props;
            if (orderConfirmPage) {
                let orderConfirmAddress = orderConfirmPage.state.address;
                if (orderConfirmAddress.id === address.id) {
                    orderConfirmPage.setState({address: undefined});
                }
            }
        }, error => {
            this.setState({
                loading: false,
                alertMessage: error
            });
        });
    }

    addressCreated() {
        this.props.history.goBack();
        this.setState({loading: true});
        this.componentDidMount();
    }

    addressUpdated() {
        this.props.history.goBack();
        this.setState({loading: true});
        this.componentDidMount();
    }

    addressSelected(address) {
        if (address.supported === false) {
            this.setState({alertMessage: '该地区暂不支持配送'});
        } else {
            if (this.props.onSelect) this.props.onSelect(address);
        }
    }

    render() {
        let {match} = this.props;
        let {addresses, confirm, alertMessage, loading} = this.state;
        return (
            <div>
                {!this.isChildRoute() &&
                <div className="AddressList">
                    {addresses && addresses.length > 0 &&
                    <ul>
                        {addresses.map((address, index) =>
                            <li key={address.id} onClick={() => this.addressSelected(address)}>
                                {address.supported === false &&
                                <label className="not-supported">该地区暂不支持配送</label>
                                }
                                <h6 className="clearfix">
                                <h5>{address.name} {address.phoneNumber}</h5>
                                {address.AdsWhetherFull&&<h5 style={{float:'right', lineHeight:'.42rem'}} className="f24 color-main ">地址信息不完整请补全</h5>}
                                </h6>
                                <span>{address.districts.map(d => d.name).reduce((a, b) => a + b) + ' ' + address.content}</span>
                                <div className="buttons">
                                    <a className="del" style={{backgroundImage: 'url(' + imageDel + ')'}} onClick={(e) => {
                                        e.stopPropagation();
                                        this.confirmDelete(address);
                                    }}>删除</a>
                                    <a className="edit" style={{backgroundImage: 'url(' + imageEdit + ')'}} onClick={e => {
                                        e.stopPropagation();
                                        this.props.history.push(match.url + '/edit/' + address.id + (match.params.skuIdList ? ('/' + match.params.skuIdList) : ''));
                                    }}>编辑</a>
                                    <a className="default" style={{backgroundImage: 'url(' + (address.isDefault ? imageChecked : imageUnchecked) + ')'}} onClick={(e) => {
                                        e.stopPropagation();
                                        this.switchDefault(address);
                                    }}>默认地址</a>
                                </div>
                            </li>
                        )}
                    </ul>
                    }
                    {addresses && addresses.length === 0 &&
                    <div className="empty" style={{backgroundImage: 'url(' + imageEmpty + ')'}}>
                        你还没有收货地址哦~添加一个吧！
                    </div>
                    }
                    <FixedBottom>
                        <Link to={match.url + '/new'} className="new">新建地址</Link>
                    </FixedBottom>
                    <TransitionGroup>
                        {loading &&
                        <Fade>
                            <FullScreenLoading/>
                        </Fade>
                        }
                        {confirm &&
                        <Fade>
                            <Confirm title={confirm.title} onConfirm={confirm.onConfirm} onCancel={confirm.onCancel}/>
                        </Fade>
                        }
                        {alertMessage &&
                        <Fade>
                            <Alert message={alertMessage} onClose={() => this.setState({alertMessage: undefined})}/>
                        </Fade>
                        }
                    </TransitionGroup>
                </div>
                }
                <Route path={match.url + '/new'} render={props =>
                    <AddressEdit {...props} onSave={this.addressCreated}/>
                }/>
                <Route path={match.url + '/edit/:id' + (match.params.skuIdList ? '/:skuIdList' : '')} render={props =>
                    <AddressEdit {...props} onSave={this.addressUpdated}/>
                }/>
            </div>
        );
    }
}

AddressList.propTypes = {
    onSelect: PropTypes.func,
    orderConfirmPage: PropTypes.object
};

export default AddressList;