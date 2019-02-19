import React, { Component } from 'react';
import './RedeemCoupons.css';
import CouponsApi from '../../../api/CouponsApi';
import UserContext from '../../../model/UserContext';
import Alert from '../../../ui/Alert/Alert';
import Fade from '../../../ui/Fade/Fade';
import { TransitionGroup } from 'react-transition-group';

class RedeemCoupons extends Component {
	constructor(props) {
		super(props);
		this.redeemCoupons = this.redeemCoupons.bind(this);
		this.checkoutCode = this.checkoutCode.bind(this);
		this.state = {
			alertMessage: null,
			redeemState: false // 是否兑换成功
		};
	}

	// 兑换优惠券
	redeemCoupons() {
		let { keyword } = this.state;
		if (!keyword) {
			this.setState({
				alertMessage: '兑换码不能为空',
			});
			return;
		}
		let userContext = UserContext.get();
		keyword = keyword.toUpperCase();
		let body = {
			accessToken: userContext.userToken, //访问令牌（非必须）
			couponCode: keyword, //优惠券码 (必填)
		};
		console.log('body', body);
		CouponsApi.exchangeCoupons(
			body,
			data => {
				this.setState({
					redeemState: true,
					alertMessage: '兑换成功'
				})
			},
			error => {
				this.setState({
					redeemState: false,
					alertMessage: error
				});
			},
		);
	}

	// 兑换码限制,暂不做限制
	checkoutCode(keyword) {
		this.setState({ keyword });
	}

	// 兑换成功后的操作
	success() {
		let { redeemState } = this.state
		if (redeemState) {
			this.setState({
				redeemState: false,
				keyword: ''
			}, () => this.props.onRefesh())
		}
	}

	render() {
		const { alertMessage, keyword } = this.state;
		return (
			<div className="redeem-coupons padding-30">
				<input
					className="coupons-code"
					value={keyword ? keyword : ''}
					placeholder="请输入优惠券兑换码"
					onChange={e => this.checkoutCode(e.target.value)}
				/>
				<span className="submit ml30" onClick={this.redeemCoupons}>
					兑换
        </span>
				<TransitionGroup>
					{alertMessage && (
						<Fade>
							<Alert
								message={alertMessage}
								onClose={() => {
									this.setState({
										alertMessage: undefined
									}, () => this.success())
								}}
							/>
						</Fade>
					)}
				</TransitionGroup>

			</div>
		);
	}
}

export default RedeemCoupons;
