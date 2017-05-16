/**
 * Auther: MaiJZ
 * Date: 2017/5/14
 * Github: https://github.com/maijz128
 */


const DataSaverKeys = {
    popup: {
        sidebar: {
            currentShowTabID: 'sidebar-currentShowTabID',
        },
    },
    background: {
        latelyReadHomeSimplePostID: 'latelyReadHomeSimplePostID',
        timer_refreshInterval_ms: 'timer_refreshInterval_ms'
    },
};

function DataSaver() {
    const self = this;
    // self.bgPage = chrome.extension.getBackgroundPage();

}
DataSaver.prototype.save = function (key, value) {
    var incognito = false;
    if (incognito) {
        // Persist data ONLY in memory
    } else {
        localStorage[key] = value; // OK to store data
    }
};
DataSaver.prototype.read = function (key) {
    return localStorage[key];
};