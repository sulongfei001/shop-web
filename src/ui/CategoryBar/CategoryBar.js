import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './CategoryBar.css';

class CategoryBar extends Component {
    render() {
        let {categories} = this.props;
        return (
            <div className="CategoryBar">
                <ul>
                    {categories.map((c, i) =>
                        <li key={'category' + i}  onClick={e => {
                            this.props.history.push('/category/' + c.id);
                            window.MtaH5.clickStat('click_home_category',{'name':c.pic});
                        }}>
                            <img src={c.pic} alt={c.name}/>
                            <span>{c.name}</span>
                        </li>
                    )}
                </ul>
            </div>
        );
    }
}

CategoryBar.propTypes = {
    categories: PropTypes.array.isRequired
};

export default CategoryBar;