class Screen {
    static maxWidth() {
        return Math.min(640, this.clientWidth());
    }

    static margin() {
        return this.clientWidth() < 640 ? 0 : (this.clientWidth() - 640) / 2;
    }

    static documentElement() {
        return (document.body.clientWidth + document.body.clientHeight + document.body.scrollWidth + document.body.scrollHeight + document.body.scrollTop > document.documentElement.clientWidth + document.documentElement.clientHeight + document.documentElement.scrollWidth + document.documentElement.scrollHeight + document.documentElement.scrollTop) ? document.body : document.documentElement;
    }

    static rootElement() {
        return document.getElementById('root');
    }

    static availWidth() {
        return window.screen.availWidth;
    }

    static availHeight() {
        return window.screen.availHeight;
    }

    static scrollHeight() {
        return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    }

    static scrollWidth() {
        return Math.max(document.body.scrollWidth, document.documentElement.scrollWidth);
    }

    static scrollTop() {
        return Math.max(document.body.scrollTop, document.documentElement.scrollTop);
    }

    static scrollToTop() {
        window.scrollTo(0, 0);
    }

    static setScrollTop(scrollTop) {
        document.body.scrollTop = scrollTop;
        document.documentElement.scrollTop = scrollTop;
    }

    static clientHeight() {
        return Math.max(document.body.clientHeight, document.documentElement.clientHeight);
    }

    static clientWidth() {
        return Math.max(document.body.clientWidth, document.documentElement.clientWidth);
    }

    static resetFontSize() {
        let size = Screen.maxWidth() / 7.5;
        Screen.fontSize = size;
        document.documentElement.style.fontSize = size + 'px';
        document.body.style.maxWidth = Screen.maxWidth() + 'px';
        // document.body.style.height = window.screen.height+'px'
    }

    static setInstance(app) {
        Screen.app = app;
    }

    static removeInstance() {
        Screen.app = undefined;
    }

    static alert(message, onClose) {
        Screen.app.setState({
            alert: {
                message: message,
                onClose: () => {
                    Screen.app.setState({alert: undefined}, () => {
                        onClose && onClose();
                    })
                }
            }
        });
    }

    static confirm(title, message, onConfirm, onCancel) {
        Screen.app.setState({
            confirm: {
                title: title,
                message: message,
                onConfirm: () => {
                    Screen.app.setState({confirm: undefined}, () => {
                        onConfirm && onConfirm();
                    });
                },
                onCancel: () => {
                    Screen.app.setState({confirm: undefined}, () => {
                        onCancel && onCancel();
                    });
                }
            }
        });
    }

    static loading(enabled, onComplete) {
        Screen.app.setState({loading: enabled}, () => {
            onComplete && onComplete();
        });
    }

    static isHorizontal() {
        return Screen.clientWidth() > Screen.clientHeight();
    }

    /**
     /**
     * 选择所在地
     * @param onSelected 当选中时的回调，包含两个参数，第一个参数表示选择的区域，第二个参数为向上遍历的区域父节点，举例如下：
     *                   { id: 15, name: "杨浦区" }, [ { id: 2, name: "上海市" }, { id: 1, name: "中国" } ]
     * @param onClose    当关闭时的回调，没有参数
     * @param options 选项参数，包含以下可选项
     *                includedIds 数值数组，表示在地区选择列表中可见的地区id集合，举例如下：[ 1, 2, 3, 4, 5 ]
     */
    static selectDistrict(onSelected, onClose, options = { includedIds: undefined }) {
        Screen.app.setState({
            districtSelect: {
                includedIds: options && options.includedIds && options.includedIds.length > 0 ? options.includedIds : undefined,
                onSelected: (district, parentDistricts, addressInfo) => {
                    Screen.app.setState({
                        districtSelect: undefined,
                    });
                    if (onSelected) onSelected(district, parentDistricts,addressInfo);
                },
                onClose: () => {
                    Screen.app.setState({
                        districtSelect: undefined,
                    });
                    if (onClose) onClose();
                },
            }
        });
    }

    /**
     * 选择日期
     * @param onPicked 选中日期侦听（第一个参数为选中的日期，Date类型）
     * @param options 可选参数（date: 默认选中的日期，onClose: 关闭日期选择侦听）
     */
    static pickDate(onPicked, options = { date: undefined, onClose: undefined }) {
        Screen.app.setState({
            datePick: {
                date: options.date,
                onPicked: pickedDate => {
                    Screen.app.setState({
                        datePick: undefined
                    });
                    if (onPicked) onPicked(pickedDate);
                },
                onClose: () => {
                    Screen.app.setState({
                        datePick: undefined
                    });
                    if (options.onClose) options.onClose();
                },
            },
        });
    }
}

export default Screen;