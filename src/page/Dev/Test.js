import React from 'react';
import Page from "../../ui/Page/Page";
import Screen from "../../utils/Screen";
import DateFormatter from "../../utils/DateFormatter";

class Test extends Page {
    constructor(props) {
        super(props);
        this.state = {
            scrollTop: 0,
        };
        Screen.loading(true);
    }

    componentDidMount() {
        Screen.loading(false);
    }

    render() {
        let {date} = this.state;
        return (
            <div>
                {!this.isChildRoute() &&
                <div className="Test">
                    <div>{date ? DateFormatter.toYMD(date) : '请选择日期'}</div>
                    <button type="button" onClick={() => Screen.pickDate(date => this.setState({
                        date: date,
                    }), { date: date })}>选择日期</button>
                </div>
                }
            </div>
        );
    }
}

export default Test;