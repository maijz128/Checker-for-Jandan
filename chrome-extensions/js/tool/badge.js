/**
 * Auther: MaiJZ
 * Date: 2017/5/14
 * Github: https://github.com/maijz128
 */



function Badge() {
    const self = this;
    self._Map = {};
    self.count = 0;
    self._enabled = true;
}
Badge.prototype.updateUI = function () {
    if (!this._enabled) return;

    const self = this;
    self.count = 0;
    for (var key in self._Map) {
        const item = self._Map[key];
        if (item.enabled) {
            self.count += item.value;
        }
    }

    // chrome.browserAction.setBadgeBackgroundColor({color: '#0000FF'});
    // chrome.browserAction.setBadgeBackgroundColor({color: [255, 255, 255, 1]});
    if (self.count > 0) {
        if (self.count > 999) {
            chrome.browserAction.setBadgeText({text: '999'});
        } else {
            chrome.browserAction.setBadgeText({text: self.count.toString()});
        }
    } else {
        chrome.browserAction.setBadgeText({text: ''});
    }
};
Badge.prototype.addKey = function (keyName, value) {
    value = parseInt(value);
    value = value || 0;

    this._Map[keyName] = {
        keyName: keyName,
        value: value,
        enabled: true
    };
    this.updateUI();
};
Badge.prototype.setValue = function (keyName, value) {
    const item = this._Map[keyName];
    if (item) {
        item.value = parseInt(value) || 0;
        this.updateUI();
    } else {
        this.addKey(keyName, value);
    }
};
Badge.prototype.getValue = function (keyName) {
    const item = this._Map[keyName];
    if (item) {
        return parseInt(item.value) || 0;
    } else {
        return 0;
    }
};
Badge.prototype.setKeyEnabled = function (keyName, enabled) {
    const item = this._Map[keyName];
    if (item) {
        item.enabled = enabled;
        this.updateUI();
    }
};
Badge.prototype.toggleKeyEnabled = function (keyName) {
    const item = this._Map[keyName];
    if (item) {
        item.enabled = !item.enabled;
        this.updateUI();
    }
};
Badge.prototype.enabled = function (enabled) {
    this._enabled = enabled;
    this.updateUI();
};
Badge.prototype.toData = function () {
    const jsonStr = JSON.stringify(this._Map);
    return JSON.parse(jsonStr);
};
Badge.prototype.parseData = function (data) {
    if (data.constructor === 'string') {
        this._Map = JSON.parse(data);
    } else {
        this._Map = data;
    }
};