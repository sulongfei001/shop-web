import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './DatePicker.css';
import Picker from "../Picker/Picker";

class DatePicker extends Component {
    constructor(props) {
        super(props);
        this.propsToState = this.propsToState.bind(this);
        this.selectYear = this.selectYear.bind(this);
        this.selectMonth = this.selectMonth.bind(this);
        this.selectDay = this.selectDay.bind(this);
        this.propsToState(props);
    }

    componentWillReceiveProps(props) {
        this.propsToState(props);
    }

    propsToState(props) {
        let state;
        if (this.state) {
            state = this.state;
        } else {
            let now = new Date();
            let years = [];
            for (let i = 1900; i <= now.getFullYear(); i++) {
                years.push({
                    text: i + '年',
                    value: i,
                });
            }
            let months = [];
            for (let i = 1; i <= 12; i++) {
                months.push({
                    text: i + '月',
                    value: i,
                });
            }
            let days = [];
            for (let i = 1; i <= 31; i++) {
                days.push({
                    text: i + '日',
                    value: i,
                });
            }
            state = {
                years: years,
                months: months,
                days: days,
            };
        }
        state.year = props.date ? props.date.getFullYear() : state.years[state.years.length - 19].value;
        state.month = props.date ? (props.date.getMonth() + 1) : state.months[0].value;
        state.day = props.date ? props.date.getDate() : state.days[0].value;
        if (this.state) {
            this.setState(state);
        } else {
            this.state = state;
        }
    }

    selectYear(year) {
        let { month, day } = this.state;
        if (month === 2) {
            if (year % 4 === 0) {
                if (day > 29) {
                    day = 29;
                }
            } else if (day > 28) {
                day = 28;
            }
        }
        this.setState({
            year: year,
            day: day
        });
        if (this.props.onDatePicking) this.props.onDatePicking(new Date(year, month - 1, day));
    }

    selectMonth(month) {
        let { year, day } = this.state;
        if (month === 2) {
            if (year % 4 === 0) {
                if (day > 29) {
                    day = 29;
                }
            } else if (day > 28) {
                day = 28;
            }
        } else if ([4, 6, 9, 11].indexOf(month) >= 0 && day > 30) {
            day = 30;
        }
        this.setState({
            month: month,
            day: day,
        });
        if (this.props.onDatePicking) this.props.onDatePicking(new Date(year, month - 1, day));
    }

    selectDay(day) {
        let { year, month } = this.state;
        this.setState({
            day: day,
        });
        if (this.props.onDatePicking) this.props.onDatePicking(new Date(year, month - 1, day));
    }

    render() {
        let { years, months, days, year, month, day } = this.state;
        let filteredDays = days.filter(day =>
            (2 === month && (year % 4 === 0 ? day.value <= 29 : day.value <= 28))
            || ([1, 3, 5, 7, 8, 10, 12].indexOf(month) >= 0 && day.value <= 31)
            || ([4, 6, 9, 11]).indexOf(month) >= 0 && day.value <= 30);
        return (
            <div className="DatePicker" style={this.props.style}>
                <div className="menu">
                    <a className="cancel" onClick={() => {
                        if (this.props.onCancel) this.props.onCancel();
                    }}>取消</a>
                    <a className="confirm" onClick={() => {
                        if (this.props.onDatePicked) this.props.onDatePicked(new Date(year, month - 1, day));
                    }}>确定</a>
                </div>
                <div className="content">
                    <div className="years">
                        <Picker items={years} selectedIndex={year - years[0].value} onItemPicked={this.selectYear} />
                    </div>
                    <div className="months">
                        <Picker items={months} selectedIndex={month - months[0].value} onItemPicked={this.selectMonth} />
                    </div>
                    <div className="days">
                        <Picker items={filteredDays} selectedIndex={day - days[0].value} onItemPicked={this.selectDay} />
                    </div>
                </div>
            </div>
        );
    }
}

DatePicker.propTypes = {
    date: PropTypes.instanceOf(Date), //初始日期，Date类型
    onDatePicked: PropTypes.func, //点击确认按钮侦听（第一个参数为选中的日期，Date类型）
    onCancel: PropTypes.func, //点击取消按钮侦听（无参数）
    onDatePicking: PropTypes.func, //选择日期侦听（第一个参数为选中的日期，Date类型）
};

export default DatePicker;