/**
 * Auther: MaiJZ
 * Date: 2017/5/16
 * Github: https://github.com/maijz128
 */


function Timer(func, interval_ms, enable) {
    const self = this;
    self._func = func;
    self._enabled = enable;
    self._interval_ms = interval_ms || 30 * 1000;
    self._clock = -1;

    self._restartClock();
}
Timer.prototype._isFunc = function () {
    return (typeof this._func === 'function');
};
Timer.prototype._stopClock = function () {
    window.clearInterval(this._clock);
};
Timer.prototype._restartClock = function () {
    const self = this;

    self._stopClock();
    if (self._enabled && self._isFunc() && self._interval_ms > 0) {

        self._clock = window.setInterval(function () {
            if (self._enabled && self._isFunc()) {
                self._func();
            }
        }, self._interval_ms);
    }
};
Timer.prototype.setFunc = function (func) {
    if (func) {
        this._func = func;
        this._restartClock();
    }
};
Timer.prototype.setInterval = function (interval_ms) {
    if (interval_ms) {
        this._interval_ms = interval_ms;
        this._restartClock();
    }
};
Timer.prototype.enabled = function (enable) {
    const self = this;
    self._enabled = enable;
    if (enable) {
        self._restartClock();
    } else {
        self._stopClock();
    }
};
Timer.prototype.toggle = function () {
    this.enabled(!this._enabled);
};