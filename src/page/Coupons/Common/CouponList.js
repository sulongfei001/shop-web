import './CouponList.css';
import React, { Component } from 'react';
import Common from '../../../utils/Common';
import CouponsApi from '../../../api/CouponsApi';
import UserContext from '../../../model/UserContext';
import FullScreenLoading from '../../../ui/FullScreenLoading/FullScreenLoading';
import Fade from '../../../ui/Fade/Fade';
import Alert from '../../../ui/Alert/Alert';
import { TransitionGroup } from 'react-transition-group';

class UseCoupons extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selTab: 1, // 同步接口可用不可用状态，1 为可用 ，2 为不可用,与tab栏切换通用
			selCoupon: null,
			loading: true,
		};
		this.selTab = this.selTab.bind(this);
		this.selCoupons = this.selCoupons.bind(this);
		this.closeList = this.closeList.bind(this);
		this.useCoupon = this.useCoupon.bind(this);
	}

	componentDidMount() {
		this.init();
	}

	// 获取优惠券数据
	init() {
		let lastSelCoupon = this.props.lastSelCoupon;
		let userContext = UserContext.get();
		let body = {
			accessToken: userContext.userToken, //访问令牌（必须）
			goodsList: this.props.goodsSkuIds, //商品sku id列表 (必填)
			deliveryAddressId: this.props.deliveryAddressId
		};
		if (lastSelCoupon) body.couponCodeId = lastSelCoupon.couponCodeId;
		CouponsApi.enableCouponList(
			body,
			data => {
				this.setState({
					allCouponList: data,
					selCoupon: this.props.lastSelCoupon,
					loading: false
				});
			},
			error => {
				this.setState({
					loading: false,
					alertMessage: error,
				});
			},
		);
	}

	// 可用 不可用 优惠券切换
	selTab(type) {
		let selTab = this.state.selTab;
		if (type === selTab) return;
		let el = this.refs.couponsContent;
		let obj = this.state.scrollTops || {};
		if (el) {
			obj[selTab] = el.scrollTop;
		}
		this.setState(
			{
				selTab: type,
				scrollTops: obj,
			},
			() => this.resetTop(type),
		);
	}

	// 选择优惠券
	selCoupons(item) {
		if (this.state.selTab === 2) return;
		this.setState({
			selCoupon: item,
		});
	}

	// 使用优惠券
	useCoupon() {
		const selCoupon = this.state.selCoupon;
		const lastSelCoupon = this.props.lastSelCoupon;
		console.log('使用', selCoupon, lastSelCoupon);
		// 未选择 return
		if (!selCoupon) return;
		// 现在选择的和之前选择的一样
		if (lastSelCoupon && lastSelCoupon.couponId === selCoupon.couponId) {
			this.props.onSel();
		} else {
			this.props.onSel(selCoupon);
		}
	}

	// 关闭列表
	closeList() {
		console.log('关闭列表');
		this.props.onClose();
	}

	// ul top重置
	resetTop(tab) {
		let el = this.refs.couponsContent;
		if (!el) return;
		let tops = this.state.scrollTops;
		el.scrollTop = tops[tab] > 0 ? tops[tab] : 0;
	}

	render() {
		const {
			alertMessage,
			selTab,
			loading,
			selCoupon,
			allCouponList,
		} = this.state;
		const couponList = allCouponList ? allCouponList.availableCouponList : null;
		const unCounponList = allCouponList ? allCouponList.unavailableCouponList : null;
		const selCouponCodeId = selCoupon ? selCoupon.couponCodeId : null;
		const enableCouponStyle = {
			basic: { borderRight: '1px dashed #979797' },
			active: { borderRight: '1px dashed #ff4242' },
		};
		const LiContent = ({ item, isSel }) => {
			return (
				<div>
					<div
						className={`item-left ${selTab === 2 && 'bac-grey'}`}
						style={isSel ? enableCouponStyle.active : enableCouponStyle.basic}
					>
						<div className="item-middle">
							<p>
								<span
									className={`item-price-id ${selTab === 2 && 'color-fff'}`}
								>
									&yen;
                </span>
								<span className={`item-price ${selTab === 2 && 'color-fff'}`}>
									{item.price}
								</span>
							</p>
							<p className={`item-rule f24 ${selTab === 2 && 'color-fff'}`}>
								{item.ruleInfo}
							</p>
						</div>
					</div>
					<div className="item-right">
						<div className="item-middle">
							<p className="item-type padding-l-10 mb20">
								<span className="ticket-type inline-block-middle color-fff">
									{Common.couponRoleType(item.couponRoleType)}
								</span>
								<span
									className={`ticket-title inline-block-middle one-txt ${
										selTab === 1 ? 'color-000' : 'color-999'
										}`}
								>
									{item.couponName}
								</span>
							</p>
							<p className="item-date padding-l-10 f24 color-999">
								{Common.timestampToTime(item.activeTimeStart)}-{Common.timestampToTime(
									item.activeTimeEnd,
								)}
							</p>
						</div>
					</div>
				</div>
			);
		};
		const list = selTab === 1 ? couponList : unCounponList;
		const { onClose } = this.props;
		return (
			<div className="user-coupons-root">
				<p className="coupons-title padding-40" onClick={e => onClose()}>
					<span className="title-main">优惠券</span>
					<span className="title-tip">
						&nbsp;(仅计算商品总价，不含税费和运费呦)
          </span>
					<span className="icon-arrow-down" />
				</p>
				<div className="coupons-tab">
					<span
						onClick={() => this.selTab(1)}
						className={selTab === 1 && 'tab-actives'}
					>
						可用优惠券({couponList ? couponList.length : '0'})
          </span>
					<span
						onClick={() => this.selTab(2)}
						className={selTab === 2 && 'tab-actives'}
					>
						不可用优惠券({unCounponList ? unCounponList.length : '0'})
          </span>
				</div>
				<div style={{position: 'relative',height:'6.045rem' }}>
					{loading ? (
						<FullScreenLoading style={{ position: 'absolute' }} />
					) : !list ? (
						<div className="conpons-tip">没有可用优惠券</div>
					) : (
								<ul className="coupons-content" ref="couponsContent">
									{list.map((item, index) => {
										return (
											<li
												className={`coupons-item mb30 ${selTab === 1 &&
													selCouponCodeId === item.couponCodeId &&
													'actives'} ${selTab === 2 && 'hidden'}`}
												key={item.couponCodeId}
												onClick={() => this.selCoupons(item)}
											>
												<LiContent
													item={item}
													isSel={
														selTab === 1 && selCouponCodeId === item.couponCodeId
													}
												/>
											</li>
										);
									})}
								</ul>
							)}
				</div>
				{selTab === 1 && <div
					className={`coupons-btn ${
						(selCoupon) ? 'bac-main' : 'bac-grey'
						}`}
					onClick={this.useCoupon}
				>
					使用
          		</div>}
				<TransitionGroup>
					{alertMessage && (
						<Fade>
							<Alert
								message={alertMessage}
								onClose={() => this.setState({ alertMessage: undefined })}
							/>
						</Fade>
					)}
				</TransitionGroup>

			</div>
		);
	}
}

export default UseCoupons;
