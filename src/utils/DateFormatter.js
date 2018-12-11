class DateFormatter {
    static toYMD(date) {
        return date.getFullYear() + '-' + padNumber(date.getMonth() + 1) + '-' + padNumber(date.getDate());
    }

    static toYMDHMS(date) {
        return DateFormatter.toYMD(date) + ' ' + padNumber(date.getHours()) + ':' + padNumber(date.getMinutes()) + ':' + padNumber(date.getSeconds());
    }

    static toMDZhcn(date) {
        return (date.getMonth() + 1) + '月' + date.getDate() + '日';
    }

    static toHM(date) {
        return padNumber(date.getMonth() + 1) + ':' + padNumber(date.getDate());
    }

    static toMDHMZhcn(date) {
        return (date.getMonth() + 1) + '月' + date.getDate() + '日  ' + padNumber(date.getHours()) + ':' + padNumber(date.getMinutes());
    }


}

const padNumber = (number) => {
    return (number < 10 ? '0' : '') + number;
};

export default DateFormatter;