/**
 * 值过渡
 */
class ValueAnimator {
    /**
     * 初始化值过渡
     * @param startValue 起始值
     * @param endValue 结束值
     * @param duration 动画时长（毫秒）
     * @param onUpdate 值更新侦听（第一个参数为当前值）
     * @param onEnd 动画完成侦听（无参数方法）
     */
    constructor({startValue, endValue, duration, onUpdate, onEnd}) {
        this.option = {
            startValue: startValue,
            currentValue: startValue,
            endValue: endValue,
            duration: duration,
            onUpdate: onUpdate,
            onEnd: onEnd,
        };
    }

    /**
     * 播放动画
     */
    start() {
        this.startDate = Date.now();
        this.endDate = this.startDate + this.option.duration;
        let go = (timer) => {
            clearTimeout(timer);
            let now = Date.now();
            let isEnd = now >= this.endDate;
            if (isEnd) {
                now = this.endDate;
            }
            this.option.currentValue = this.option.startValue + (this.option.endValue - this.option.startValue) * (now - this.startDate) / (this.endDate - this.startDate);
            if (this.option.onUpdate) {
                this.option.onUpdate(this.option.currentValue);
            }
            if (isEnd) {
                if (this.option.onEnd) {
                    this.option.onEnd();
                }
            } else {
                timer = setTimeout(() => go(timer), 10);
            }
        };
        let animateTimer = setTimeout(() => go(animateTimer), 10);
    }
}

export default ValueAnimator;