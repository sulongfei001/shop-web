import React, { Component } from 'react';
import GoodsList from './GoodsList'

class GoodsListPage extends Component {

	render() {
		let { keyword, categoryId, transportRuleIds, history, match, location } = this.props.match.params;
		return (
			<GoodsList history={history} match={match} location={location} keyword={keyword} categoryId={categoryId} transportRuleIds={transportRuleIds} />
		);
	}
}

export default GoodsListPage