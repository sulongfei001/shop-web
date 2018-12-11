import DateFormatter from "./DateFormatter";

class DateFormatterBeijing {
    static toYMD(date) {
        date = toBeijing(date);
        return date.getFullYear() + '-' + padNumber(date.getMonth() + 1) + '-' + padNumber(date.getDate());
    }

    static toYMDHMS(date) {
        date = toBeijing(date);
        return DateFormatter.toYMD(date) + ' ' + padNumber(date.getHours()) + ':' + padNumber(date.getMinutes()) + ':' + padNumber(date.getSeconds());
    }

    static toMDZhcn(date) {
        date = toBeijing(date);
        return (date.getMonth() + 1) + '月' + date.getDate() + '日';
    }

    static toHM(date) {
        date = toBeijing(date);
        return padNumber(date.getMonth() + 1) + ':' + padNumber(date.getDate());
    }

    static toMDHMZhcn(date) {
        date = toBeijing(date);
        return (date.getMonth() + 1) + '月' + date.getDate() + '日  ' + padNumber(date.getHours()) + ':' + padNumber(date.getMinutes());
    }


}

const padNumber = (number) => {
    return (number < 10 ? '0' : '') + number;
};

function toBeijing(date) {
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000 + 28800000);
}

export default DateFormatterBeijing;