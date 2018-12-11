import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './ScrollView.css';
import Screen from "../../utils/Screen";
import ValueAnimator from "../../utils/ValueAnimator";

class ScrollView extends Component {
    constructor(props) {
        super(props);
        this.touchStart = this.touchStart.bind(this);
        this.touchMove = this.touchMove.bind(this);
        this.touchEnd = this.touchEnd.bind(this);
        this.scrollTo = this.scrollTo.bind(this);
        this.getDimensionInPx = this.getDimensionInPx.bind(this);
        this.propsToState = this.propsToState.bind(this);
        this.propsToState(props);
    }

    componentDidMount() {
        this.setState({
            scrollHeight: this.scrollWrapper.clientHeight,
        });
    }

    componentWillReceiveProps(props) {
        this.propsToState(props);
    }

    propsToState(props) {
        let {height, scrollTop} = props;
        if (!scrollTop) scrollTop = 0;
        let state = {
            height: this.getDimensionInPx(height),
            scrollTop: this.getDimensionInPx(scrollTop),
        };
        if (this.state) {
            state.scrollHeight = this.scrollWrapper.clientHeight;
            this.setState(state);
        } else {
            this.state = state;
        }
    }

    scrollTo(updatedScrollTop) {
        let {scrollTop} = this.state;
        if (scrollTop !== updatedScrollTop) {
            let animator = new ValueAnimator({
                startValue: scrollTop,
                endValue: updatedScrollTop,
                duration: 200,
                onUpdate: value => this.setState({
                    scrollTop: value,
                }),
                onEnd: () => {
                    if (this.props.onScrollEnd) {
                        this.props.onScrollEnd(updatedScrollTop);
                    }
                },
            });
            animator.start();
        }
    }

    touchStart(event) {
        let {scrollTop} = this.state;
        this.touchStartY = event.touches[0].clientY;
        this.touchStartScrollTop = scrollTop;
        this.touchStartDate = Date.now();
    }


    touchMove(event) {
        if (event.cancelable && !event.defaultPrevented) {
            event.preventDefault();
        }
        let {height} = this.props;
        let {scrollHeight} = this.state;
        let scrollY = this.touchStartScrollTop + this.touchStartY - event.changedTouches[0].clientY;
        if (scrollY < 0) {
            scrollY = 0;
        } else if (scrollY > scrollHeight - height) {
            scrollY = scrollHeight - height;
        }
        this.setState({
            scrollTop: scrollY,
        }, () => {
            if (this.props.onScrolling) this.props.onScrolling(scrollY);
        });
    }


    touchEnd(event) {
        let changedY = this.touchStartY - event.changedTouches[0].clientY;
        let changedTime = Date.now() - this.touchStartDate;
        let ratio = changedY / changedTime;
        if (Math.abs(ratio) > 0.5 && changedTime < 200) {
            let {scrollHeight, scrollTop} = this.state;
            let {height} = this.props;
            let scrollY = scrollTop + ratio * 300;
            if (scrollY < 0) {
                scrollY = 0;
            } else if (scrollY > scrollHeight - height) {
                scrollY = scrollHeight - height;
            }
            this.scrollTo(scrollY);
        } else {
            if (this.props.onScrollEnd) this.props.onScrollEnd(this.state.scrollTop);
        }
    }

    getDimensionInPx(dimension) {
        let {dimensionUnit} = this.props;
        if (!dimensionUnit) dimensionUnit = 'rem';
        return dimensionUnit === 'rem' ? dimension * Screen.fontSize : dimension;
    }

    render() {
        let {height, scrollTop} = this.state;
        return (
            <div className="ScrollView" style={{height: height + 'px'}} onTouchStart={this.touchStart} onTouchMove={this.touchMove} onTouchEnd={this.touchEnd}>
                <div className="scroll-wrapper" style={{marginTop: (0 - scrollTop) + 'px'}} ref={scrollWrapper => this.scrollWrapper = scrollWrapper}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

ScrollView.propTypes = {
    height: PropTypes.number.isRequired, //滚动区域的高度
    scrollTop: PropTypes.number, //滚动区域的初始滚动距离
    dimensionUnit: PropTypes.oneOf(['px', 'rem']), //尺寸参数的单位
    onScrolling: PropTypes.func, //滚动中侦听（第一个参数为当前的scrollTop）
    onScrollEnd: PropTypes.func, //滚动结束侦听（第一个参数为当前的scrollTop）
};

export default ScrollView;