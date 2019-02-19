import './CouponGetList.css';
import React, { Component } from 'react';
import Common from '../../../utils/Common';
import CouponsApi from '../../../api/CouponsApi';
import UserContext from '../../../model/UserContext';
import { Link } from 'react-router-dom';
import FullScreenLoading from '../../../ui/FullScreenLoading/FullScreenLoading';
import Fade from '../../../ui/Fade/Fade';
import Alert from '../../../ui/Alert/Alert';
import { TransitionGroup } from 'react-transition-group';

class GetCoupons extends Component {
	constructor(porps) {
		super(porps);
		this.getCoupons = this.getCoupons.bind(this);
		this.state = {
			getSuccessCouponID: [],
			loading: true,
		};
	}

	componentDidMount() {
		this.init();
	}

	// 获取商品相关的优惠券
	init() {
		let userContext = UserContext.get();
		let body = {
			accessToken: userContext.userToken, //访问令牌（非必须）
			goodsIds: this.props.couponIdList, //商品id (必填)
		};
		CouponsApi.goodsCouponList(
			body,
			data => {
				console.log('data', data);
				this.setState({
					couponList: data,
					loading: false
				});
			},
			error => {
				this.setState({
					alertMessage: error,
					loading: false,
				});
			},
		);
	}

	// 领取优惠券
	getCoupons(item) {
		let userContext = UserContext.get();
		let body = {
			accessToken: userContext.userToken, //访问令牌（必须）
			couponId: item.couponId, //优惠券id (必填)
			source: 3, //来源(2：全场赠劵，3：商品详情领取)(必填)
		};
		CouponsApi.couponReceive(
			body,
			data => {
				let { couponList, getSuccessCouponID } = this.state
				getSuccessCouponID.push(item.couponId);
				let unReceivedCouponList = couponList.unReceivedCouponList
				unReceivedCouponList.forEach(item => {
					getSuccessCouponID.forEach(i => {
						if (item.couponId === i) {
							item.state = 1
						}
					})
				});
				this.setState({
					loading: false,
					getSuccessCouponID,
					couponList
				});
			},
			error => {
				this.setState({
					loading: false,
					alertMessage: error
				});
			},
		);
	}

	render() {
		const { couponList, loading, alertMessage } = this.state;
		const unReceivedCouponList = couponList && couponList.unReceivedCouponList;
		const receivedCouponList = couponList && couponList.receivedCouponList;
		const getSuccessCouponID = this.state.getSuccessCouponID;
		const List = ({ item, isGet }) => {
			return (
				<div>
					<div className="coupons-info clearfix mb30">
						<div className="item-left fl">
							<div className="item-middle">
								<p>
									<span className="item-price-id">&yen;</span>
									<span className="item-price">{item.price}</span>
								</p>
								<p className="item-rule f24">{item.ruleInfo}</p>
							</div>
						</div>
						<div className="item-center fl">
							<p className="item-type mb20">
								<span className="ticket-type f24 color-fff">
									{Common.couponRoleType(item.couponRoleType)}
								</span>
								<span className="one-txt ticket-title f24">
									{item.couponName}
								</span>
							</p>
							<p className="item-time f24 color-999">
								{Common.timestampToTime(item.activeTimeStart)}-{Common.timestampToTime(
									item.activeTimeEnd,
								)}
							</p>
						</div>
						<div className="item-right fr">
							<div className="item-middle">
								{isGet && getSuccessCouponID.indexOf(item.couponId) === -1 ?
									<div
										className="item-btn color-fff bac-get"
										onClick={() =>
											this.setState({
												loading: true,
											}, () => this.getCoupons(item)
											)
										}
									>
										领取
                  </div> :
									(item.state === 2 ?
										// state  已使用 : 2   未使用 : 1
										<div className='btn bac-grey color-fff txt-center'>已使用</div>
										:
										<Link
											to={'/coupongoodslist/' + item.couponId}
											className="item-btn color-fff bac-use"
										>
											去使用
                  </Link>)
								}
							</div>
						</div>
					</div>
				</div>
			);
		};

		return (
			<div className="padding-40 get-coupons-root">
				<div>
					{unReceivedCouponList &&
						unReceivedCouponList.length > 0 && (
							<div>
								<h1 className="can-coupons">可领取优惠券</h1>
								<div>
									{unReceivedCouponList.map(item => {
										return (
											<List item={item} isGet={true} key={item.couponId} />
										);
									})}
								</div>
							</div>
						)}
					{receivedCouponList &&
						receivedCouponList.length > 0 && (
							<div>
								<h1 className="yet-coupons mb30">
									已领取优惠券（以下是您账户中可用的优惠券）
                </h1>
								<div>
									{receivedCouponList.map(item => {
										return <List item={item} key={item.couponId} />;
									})}
								</div>
							</div>
						)}
					{loading && <FullScreenLoading style={{ position: 'absolute' }} />}
				</div>
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
export default GetCoupons;
