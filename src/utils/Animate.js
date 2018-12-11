class Animate {
    start(obj, properties, duration, finish) {
        this.dispose();
        if (duration === undefined) duration = 100;
        let tick = 30;
        let oldProp = {};
        let propTick = {};
        let totalTicks = duration / tick;
        for (let key in properties) {
            oldProp[key] = obj[key];
            propTick[key] = (properties[key] - oldProp[key]) / totalTicks;
        }
        let component = this;
        component.timer = setTimeout(() => doAnimate(component, obj, properties, finish, propTick, totalTicks, tick), tick);
    }

    dispose() {
        if (this.timer) clearTimeout(this.timer);
    }
}

const doAnimate = (component, obj, properties, finish, propTick, totalTicks, tick) => {
    clearTimeout(component.timer);
    let stop = false;
    for (let key in properties) {
        if (Math.abs(obj[key] - properties[key]) < Math.abs(propTick[key])) {
            stop = true;
            break;
        }
        obj[key] = obj[key] + propTick[key];
    }
    totalTicks--;
    if (stop) {
        for (let key in properties) {
            obj[key] = properties[key];
        }
        if (finish) finish();
    } else {
        component.timer = setTimeout(() => doAnimate(component, obj, properties, finish, propTick, totalTicks, tick), tick);
    }
};

export default Animate;