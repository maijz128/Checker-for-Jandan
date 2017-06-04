/**
 * Auther: MaiJZ
 * Date: 2017/5/12
 * Github: https://github.com/maijz128
 */

const CURRENT_VERSION = '0.3.2';
const DEFAULT_REFRESH_INTERVAL_MS = 10 * 60 * 1000; // 默认刷新频率：十分钟
const MAX_HomeSimplePostList_Len = 24;
const background = new Background();
const verChecker = new VerChecker(CURRENT_VERSION);
const timer = new Timer();

//  init
setTimeout(function () {

    //  初始化计时器
    {
        timer.setFunc(function () {
            background.refresh();
        });
        var refreshInterval_ms = background.dataSaver.read(DataSaverKeys.background.timer_refreshInterval_ms);
        refreshInterval_ms = refreshInterval_ms || DEFAULT_REFRESH_INTERVAL_MS;
        timer.setInterval(refreshInterval_ms);
        timer.enabled(true);
    }

    background.refresh();

    verChecker.safeCheck();

}, 1000);


function Background() {
    const self = this;
    self.backend = new Backend();
    self.user = new User();
    self.badge = new Badge();
    self.BADGE_KEYS = {
        homeHasNewSimplePostCount: 'homeHasNewSimplePostCount',
        hotList: function (id) {
            return 'HotList-' + id
        },
    };
    self.dataSaver = new DataSaver();
    self.data = {
        homeSimplePostList: null,
        tabHotData: null,
        tabPicData: null,
        hotList: {}
    };
    self.latelyRefreshTime = 0;

    Message.on(MessageName.get.simplePostList, function (data, sendResponse) {
        if (self.data.homeSimplePostList) {
            sendResponse(self.data.homeSimplePostList);
        } else {
            self.updateHomePageSimplePostList(function (simplePostList) {
                sendResponse(simplePostList);
            });
        }
    });

    Message.on(MessageName.get.tabHot, function (data, sendResponse) {
        if (self.data.tabHotData) {
            sendResponse(self.data.tabHotData);
        } else {
            self.updateTabHot(function (tabHotData) {
                sendResponse(tabHotData);
            });
        }
    });


    Message.on(MessageName.get.userName, function (data, sendResponse) {
        self.user.refreshCookies();
        self.user.getName(function (userName) {
            sendResponse(userName);
        });
    });

    Message.on(MessageName.browse.homeSimplePostList, function (data, sendResponse) {
        if (self.data.homeSimplePostList) {
            const latelyReadHomeSimplePostID = self.data.homeSimplePostList[0].id;
            self.dataSaver.save(DataSaverKeys.background.latelyReadHomeSimplePostID, latelyReadHomeSimplePostID);

            self.badge.setValue(self.BADGE_KEYS.homeHasNewSimplePostCount, 0);

            // 延迟一段时间后才更新提示
            setTimeout(function () {
                self.updateNewCount_simplePostList();
            }, 5000);
        }
    });

    Message.on(MessageName.refresh, function (data, sendResponse) {
        self.refresh();
    });

    Message.on(MessageName.get.newCount.simplePostList, function (data, sendResponse) {
        sendResponse(self.updateNewCount_simplePostList());
    });

    // HotList On Message
    {
        for (var key in Backend.HOTLIST_ID) {
            const id = Backend.HOTLIST_ID[key];
            const msgName = MessageName.get.hotList._head + id;

            Message.on(msgName, function (data, sendResponse) {
                if (self.data.hotList[id]) {
                    sendResponse(self.data.hotList[id]);
                } else {
                    self.updateHotList(id, function (hotListItemList) {
                        sendResponse(hotListItemList);
                    });
                }
            });
        }
    }
}

Background.prototype.updateTabHot = function (callback) {
    const self = this;
    const notDone = 'notDone';
    const tabHotData = {
        hotposts: notDone, hotlike: notDone, hotcomments: notDone
    };

    const checkDone = function () {
        if (tabHotData.hotposts !== notDone &&
            tabHotData.hotlike !== notDone &&
            tabHotData.hotcomments !== notDone) {

            self.setTabHotData(tabHotData);
            if (callback) callback(tabHotData);
        }
    };

    self.backend.getHotTab_Comments_SimplePostList(function (simplePostList) {
        tabHotData.hotcomments = simplePostList;
        checkDone();
    });
    self.backend.getHotTab_Like_SimplePostList(function (simplePostList) {
        tabHotData.hotlike = simplePostList;
        checkDone();
    });
    self.backend.getHotTab_Posts_SimplePostList(function (simplePostList) {
        tabHotData.hotposts = simplePostList;
        checkDone();
    });
};
Background.prototype.setTabHotData = function (tabHotData) {
    const self = this;
    self.data.tabHotData = tabHotData;
    Message.send(MessageName.update.tabHot, self.data.tabHotData);
};

Background.prototype.updateHomePageSimplePostList = function (callback) {
    const self = this;
    self.backend.getHomePageSimplePostList(function (simplePostList) {

        self.setHomeSimplePostList(simplePostList);

        self._checkHasNewPost(simplePostList);

        if (callback) callback(simplePostList)
    });
};
Background.prototype._checkHasNewPost = function (newSimplePostList) {
    const self = this;
    var updateCount = 0;
    const latelyReadHomeSimplePostID = self.dataSaver.read(DataSaverKeys.background.latelyReadHomeSimplePostID);
    const index = findIndex(latelyReadHomeSimplePostID, newSimplePostList);
    const notFound = index === -1;
    const found = index > 0;

    if (notFound) {
        updateCount = newSimplePostList.length;
    } else if (found) {
        updateCount = index;
    }

    if (updateCount > 0) {
        self.badge.setValue(self.BADGE_KEYS.homeHasNewSimplePostCount, updateCount);
        self.updateNewCount_simplePostList();
    }
};
Background.prototype.setHomeSimplePostList = function (simplePostList) {
    const self = this;
    self.data.homeSimplePostList = simplePostList;
    self.data.homeSimplePostList = self.data.homeSimplePostList.slice(0, MAX_HomeSimplePostList_Len);
    Message.send(MessageName.update.simplePostList, self.data.homeSimplePostList);
};

Background.prototype.updateHotList_All = function () {
    const self = this;
    const idList = [
        Backend.HOTLIST_ID.list_pic,
        Backend.HOTLIST_ID.list_girl,
        Backend.HOTLIST_ID.list_comment,
        Backend.HOTLIST_ID.list_duan,
        Backend.HOTLIST_ID.list_hot
    ];
    for (var i = 0; i < idList.length; i++) {
        const id = idList[i];
        self.updateHotList(id);
    }
};
Background.prototype.updateHotList = function (id, callback) {
    const self = this;
    self.backend.HotList_HotListItemList(id, function (hotListItemList) {

        // self.hotListCheckHasNew(id, self.data.hotList[id], hotListItemList);
        self.setHotListData(id, hotListItemList);

        if (callback) callback(hotListItemList)
    });
};
Background.prototype.setHotListData = function (id, hotListItemList) {
    this.data.hotList[id] = hotListItemList;
    const msgName = MessageName.update.hotList._head + id;
    Message.send(msgName, hotListItemList);
};
Background.prototype.hotListCheckHasNew = function (id, hotListItemList_old, hotListItemList_new) {
    const self = this;
    const notNull = id && hotListItemList_old && hotListItemList_new;
    if (notNull) {
        const diffList = findDiff(hotListItemList_new, hotListItemList_old);
        const count = diffList.length;
        const keyName = self.BADGE_KEYS.hotList(id);
        console.log(count);
        self.badge.setValue(keyName, count);
        return true;
    } else {

    }
};

Background.prototype.updateNewCount_simplePostList = function () {
    const self = this;
    const count = self.badge.getValue(self.BADGE_KEYS.homeHasNewSimplePostCount);
    Message.send(MessageName.update.newCount.simplePostList, count);
    return count;
};

Background.prototype.refresh = function () {
    const self = this;
    var overTime = (Date.now() - self.latelyRefreshTime) >= 10 * 1000;
    if (overTime) {
        self.backend.fetchHomeHtml(function (html) {
            var overTime = (Date.now() - self.latelyRefreshTime) >= 10 * 1000;
            if (overTime) {

                self.latelyRefreshTime = Date.now();
                self.updateHomePageSimplePostList();
                self.updateTabHot();
                self.updateHotList_All();

                console.log('Background refresh on : ' + new Date().toLocaleTimeString());
            }
        });
    }
};


function findIndex(objID, objList) {
    var index = -1;
    if (objList) {
        for (var i = 0; i < objList.length; i++) {
            if (objList[i].id === objID) {
                index = i;
                break;
            }
        }
    }
    return index;
}

function findDiff(targetList, sourceList) {
    const result = []; // [{ index : 0, item: obj}]

    for (var t_i = 0; t_i < targetList.length; t_i++) {
        const targetItem = targetList[t_i];
        var isDiff = true;

        for (var s_i = 0; s_i < sourceList.length; s_i++) {
            const sourceItem = sourceList[s_i];
            if (sourceItem.equals(targetItem)) {
                isDiff = false;
                break;
            }
        }

        if (isDiff) {
            result.push({
                index: t_i,
                item: targetItem
            })
        }
    }

    return result;
}


function VerChecker(currentVersion) {
    const self = this;
    self.userOrOrgName = "maijz128";
    self.repoName = "Checker-for-Jandan";
    self.currentVersion = currentVersion || '0.0.1';
    self.latelyCheckTime = 0;
    self.CHECK_TIME = 1000 * 60 * 60 * 6;
    self.msgData = MessageData.hasNewVer();
    // self.msgData.updateURL = 'https://github.com/maijz128/Checker-for-Jandan/releases';

    Message.on(MessageName.hasNewVer, function (data, sendResponse) {
        sendResponse(self.msgData);
        self.safeCheck();
    });
}
VerChecker.prototype.safeCheck = function () {
    const self = this;
    const overTime = (Date.now() - self.latelyCheckTime ) > self.CHECK_TIME;
    if (overTime) {
        self.latelyCheckTime = Date.now();
        self._check();
    }
};
VerChecker.prototype._check = function (callback) {
    const self = this;
    var checker = UpdateChecker.createNew(self.userOrOrgName, self.repoName, self.currentVersion);
    checker.hasNewVersion(function (result) {
        if (result) {
            console.log('有新版本!');
            self.msgData.hasNewVer = true;
            self.msgData.updateURL = checker.getReleasesURL();
        }
        if (callback) callback(self.msgData);
    });
};
