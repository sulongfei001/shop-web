import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ScrollView from "../ScrollView/ScrollView";
import Screen from "../../utils/Screen";
import './Picker.css';
import ValueAnimator from "../../utils/ValueAnimator";

class Picker extends Component {
    constructor(props) {
        super(props);
        this.pickItem = this.pickItem.bind(this);
        this.onScrollEnd = this.onScrollEnd.bind(this);
        this.propsToState = this.propsToState.bind(this);
        this.propsToState(props);
    }

    componentDidMount() {

    }

    componentWillReceiveProps(props) {
        this.propsToState(props);
    }

    propsToState(props) {
        let {selectedIndex, rowCount, rowHeight, textSize, dimensionUnit, items} = props;
        if (selectedIndex === undefined) selectedIndex = 0;
        if (rowCount === undefined) rowCount = 5;
        if (rowCount % 2 === 0) throw new Error("rowCount只能是奇数");
        if (rowHeight === undefined) rowHeight = 0.8;
        if (textSize === undefined) textSize = 0.32;
        if (dimensionUnit === undefined) dimensionUnit = 'rem';
        let state = {
            selectedIndex: selectedIndex,
            rowCount: rowCount,
            rowHeight: dimensionUnit === 'rem' ? rowHeight * Screen.fontSize : rowHeight,
            textSize: dimensionUnit === 'rem' ? textSize * Screen.fontSize : textSize,
            items: items,
        };
        state.scrollTop = selectedIndex * state.rowHeight;
        if (this.state) {
            this.setState(state);
        } else {
            this.state = state;
        }
    }

    pickItem(selectedIndex) {
        let {items, rowHeight, scrollTop} = this.state;
        this.setState({
            selectedIndex: selectedIndex,
        }, () => {
            let {onItemPicked} = this.props;
            if (onItemPicked) onItemPicked(items[selectedIndex].value);
            let animator = new ValueAnimator({
                startValue: scrollTop,
                endValue: selectedIndex * rowHeight,
                duration: 200,
                onUpdate: value => this.setState({
                    scrollTop: value,
                }),
            });
            animator.start();
        });
    }

    onScrollEnd(scrollTop) {
        this.setState({
            scrollTop: scrollTop,
        }, () => {
            let {rowHeight, items} = this.state;
            let selectedIndex = Math.round(scrollTop / rowHeight);
            if (selectedIndex > items.length - 1) selectedIndex = items.length - 1;
            this.pickItem(selectedIndex);
        });
    }

    render() {
        let {items, rowCount, rowHeight, textSize, scrollTop} = this.state;
        let emptyRowCount = (rowCount - 1) / 2;
        let emptyRowNumber = [];
        for (let i = 0; i < emptyRowCount; i++) {
            emptyRowNumber.push(i);
        }
        return (
            <div className="Picker">
                <div className="cursor_top" style={{transform: 'translateY(' + (rowCount - 1) / 2 * rowHeight + 'px)'}}/>
                <div className="cursor_bottom" style={{transform: 'translateY(' + (rowCount + 1) / 2 * rowHeight + 'px)'}}/>
                <ScrollView scrollTop={scrollTop} height={rowCount * rowHeight} dimensionUnit={'px'} onScrollEnd={this.onScrollEnd}>
                    {emptyRowNumber.map(n =>
                    <div key={'f' + n} className="picker-item" style={{height: rowHeight + 'px', lineHeight: rowHeight + 'px'}}/>
                    )}
                    {items.map((item, i) =>
                    <div key={'i' + i} className="picker-item" style={{height: rowHeight + 'px', lineHeight: rowHeight + 'px', fontSize: textSize + 'px'}}>
                        {item.text}
                    </div>
                    )}
                    {emptyRowNumber.map(n =>
                        <div key={'e' + n} className="picker-item" style={{height: rowHeight + 'px', lineHeight: rowHeight + 'px'}}/>
                    )}
                </ScrollView>
            </div>
        );
    }
}

Picker.propTypes = {
    //items: 选择器中的可选项目清单
    items: PropTypes.arrayOf(PropTypes.shape({
        text: PropTypes.string.isRequired, //项目文本
        value: PropTypes.any, //项目值，如不提供，则默认使用项目文本作为值
    })).isRequired,
    selectedIndex: PropTypes.number, //选中的项目序号，从0开始，默认为0
    onItemPicking: PropTypes.func, //选择中回调（第一个参数为选中的项目值）
    onItemPicked: PropTypes.func, //选中回调（第一个参数为选中的项目值）
    rowCount: PropTypes.number, //显示的选择项行数，必须为奇数，默认为5
    rowHeight: PropTypes.number, //行高，默认为0.8
    textSize: PropTypes.number, //选择项的文本尺寸，默认为0.32
    dimensionUnit: PropTypes.oneOf(['rem', 'px']), //尺寸参数的单位，默认为rem
};

export default Picker;