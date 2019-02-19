import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './SearchBar.css';
import icon from './icon.png';

class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.submitSearch = this.submitSearch.bind(this);
        this.state = {
            keyword: props.keyword
        };
    }

    submitSearch(event) {
        event.preventDefault();
        let {keyword} = this.state;
        this.props.onSubmit(keyword);
    }

    render() {
        let {keyword} = this.state;
        return (
            <form action="#" className="SearchBar" onSubmit={this.submitSearch}>
                <div className="icon">
                    <img src={icon} alt=""/>
                </div>
                <input type="search" placeholder={this.props.placeholder} value={keyword ? keyword : ''} onChange={e => this.setState({keyword: e.target.value})}/>
                <button type="submit" style={{display: 'none'}}>提交</button>
            </form>
        )
    }
}

SearchBar.propTypes = {
    placeholder: PropTypes.string,
    keyword: PropTypes.string,
    onSubmit: PropTypes.func.isRequired
};

SearchBar.defaultProps = {
    placeholder: "请输入要查找的内容",
    name: "keyword",
    keyword: ''
};

export default SearchBar;