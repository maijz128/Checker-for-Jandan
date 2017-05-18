/**
 * Auther: MaiJZ
 * Date: 2017/5/12
 * Github: https://github.com/maijz128
 */


var g = {};

window.onload = function () {
    HotListItem_Component();

    g.dataSaver = new DataSaver();

    g.tabHot = new TabHot();
    g.hotList = new HotList();
    g.simplePostList = new SimplePostList();

    g.header = new Header();
    g.sidebar = new Sidebar();

};

function HotListItem_Component() {

    var HotListItemImg = Vue.extend({
        template: '' +
        '<div class="img" >' +
        '   <p><a class="view_img_link" :href="imgLarge" target="_blank">[查看原图]</a></p>' +
        '   <img  @click="toggleShowMoreFunc()" @load="imgOnLoaded" :src="getImgSrc()" >' +
        '   <div class="gif-mask" v-show="haventLoadedGIF()" @click="loadGIF($event)">{{getHint()}}</div>' +
        '</div>',
        computed: {
            isGif: function () {
                return stringEndWith(this.imgLarge, 'gif');
            }
        },
        methods: {
            imgOnLoaded: function () {
                if (this.isGif) {
                    if (this.gifState.current === this.gifState.LIST.loading) {
                        this.gifState.current = this.gifState.LIST.loaded;
                        console.log('loaded gif : ' + this.imgLarge);
                    }
                }
            },
            haventLoadedGIF: function () {
                if (this.isGif) {
                    return this.gifState.current !== this.gifState.LIST.loaded;
                }
                return false;
            },
            loadGIF: function (event) {
                if (this.isGif) {
                    if (this.gifState.current === this.gifState.LIST.haventLoad) {
                        this.gifState.current = this.gifState.LIST.loading;
                        this.toggleShowMoreFunc();
                    }
                }
            },
            getHint: function () {
                if (this.isGif) {
                    switch (this.gifState.current) {
                        case this.gifState.LIST.haventLoad:
                            return 'PLAY';
                        case this.gifState.LIST.loading:
                            return 'LOADING';
                        case this.gifState.LIST.loaded:
                            return 'PLAYING';
                        default :
                            return 'PLAY';
                    }
                } else {
                    return 'PLAY';
                }
            },
            getImgSrc: function () {
                if (this.isGif) {
                    if (this.gifState.current === this.gifState.LIST.haventLoad) {
                        return this.imgThumb;
                    } else {
                        return this.imgLarge;
                    }
                } else {
                    return this.imgThumb;
                }
            }
        },
        data: function () {
            return {
                gifState: {
                    current: 'haventLoad',
                    LIST: {haventLoad: 'haventLoad', loading: 'loading', loaded: 'loaded'}
                }
            }
        },
        props: ['imgThumb', 'imgLarge', 'toggleShowMoreFunc'],

    });

    Vue.component('hot-list-item', {
        props: ['item'],
        components: {
            'hot-list-item-img': HotListItemImg,
        },
        template: '' +
        '<div class="hot-list-item"  :id="item.id" >' +
        '   <div class="title"> {{item.author}} @' +
        '       <a class="targetName" :href="item.targetURL" target="_blank">{{item.targetName}}</a>' +
        '   </div>' +
        '   <div class="content" :class="getContentDIVClass()">' +
        '       <div class="desc">{{item.description}}</div>' +

        '       <hot-list-item-img v-for="imgItem in item.imgList"' +
        '               :img-thumb="imgItem.imgThumb"' +
        '               :img-large="imgItem.imgLarge"' +
        '               :toggle-show-more-func="toggleShowMore">' +
        '       </hot-list-item-img>' +
        '   </div>' +
        '   <div class="bottom">' +
        '       <div class="show_more" @click="toggleShowMore()">{{getShowMore_btn_Name()}}</div>' +
        '       <a class="ooxx oo" href="javascript:;" title="圈圈/支持">OO</a>' +
        '       <span class="ooxx-count">[{{item.ooCount}}]</span>' +
        '       <a class="ooxx xx" href="javascript:;" title="叉叉/反对">XX</a>' +
        '       <span class="ooxx-count">[{{item.xxCount}}]</span>' +
        '   </div>' +
        '</div>',
        data: function () {
            return {isShowMore: false}
        },
        methods: {
            getShowMore_btn_Name: function () {
                if (this.isShowMore) {
                    return "↥ 收起"
                } else {
                    return "↧ 展开"
                }
            },
            getContentDIVClass: function () {
                if (this.isShowMore) {
                    return 'full-size'
                } else {
                    return '';
                }
            },
            toggleShowMore: function () {
                if (this.isShowMore) {
                    this.isShowMore = false;
                    this.scrollTo();
                } else {
                    this.isShowMore = true;
                }
            },
            scrollTo: function () {
                $('#content').animate({
                    scrollTop: $("#" + this.item.id)[0].offsetTop
                }, 1000);
            }
        }

    })
}

function HotList() {
    const self = this;

    self.app = {};
    self.appData = {
        hot: {
            hotListItemList: null,
        },
        pic: {
            hotListItemList: null,  //getHotListItemList(10, true, true),
        },
        girl: {
            hotListItemList: null,  //getHotListItemList(10, true, true),
        },
        duan: {
            hotListItemList: null,
        },
        comment: {
            hotListItemList: null,
        }
    };
    for (var key in self.appData) {
        const name = key.toString();
        self.app[name] = new Vue({
            el: '#tab-hotlist-' + name,
            data: self.appData[name],
        });

        const u_msgName = MessageName.update.hotList[name];
        Message.on(u_msgName, function (data, sendResponse) {
            self.appData[name].hotListItemList = data;
        });
        const g_msgName = MessageName.get.hotList[name];
        Message.send(g_msgName, null, function (response) {
            self.appData[name].hotListItemList = response;
        });

    }
}

function TabHot() {
    const self = this;
    self.appTabHotData = {
        hotposts: null, //BackendMock.getHotTab_Posts_SimplePostList(),
        hotlike: null, // BackendMock.getHotTab_Like_SimplePostList(),
        hotcomments: null, //BackendMock.getHotTab_Comments_SimplePostList()
    };
    self.appTabHot = new Vue({
        el: '#tab-hot',
        data: self.appTabHotData,
        methods: {}
    });
    Message.on(MessageName.update.tabHot, function (data, sendResponse) {
        self.appTabHotData.hotposts = data.hotposts;
        self.appTabHotData.hotlike = data.hotlike;
        self.appTabHotData.hotcomments = data.hotcomments;
    });
    Message.send(MessageName.get.tabHot, null, function (response) {
        self.appTabHotData.hotposts = response.hotposts;
        self.appTabHotData.hotlike = response.hotlike;
        self.appTabHotData.hotcomments = response.hotcomments;
    });
}

function SimplePostList() {
    const self = this;
    self.appPopupData = {
        simplePostList: [],
    };
    self.appPopup = new Vue({
        el: "#simple-post-list",
        data: self.appPopupData,
        methods: {
            formatURL: formatURL
        }
    });
    Message.on(MessageName.update.simplePostList, function (data, sendResponse) {
        self.appPopupData.simplePostList = data;
    });
    Message.send(MessageName.get.simplePostList, null, function (response) {
        self.appPopupData.simplePostList = response;
    });
}

function Header() {
    const self = this;
    self.appHeaderData = {
        userName: '',
        onRefresh: false,
        hasNewVer: false,
        updateURL: ''
    };
    self.appHeader = new Vue({
        el: '#header',
        data: self.appHeaderData,
        methods: {
            refresh: function () {
                Message.send(MessageName.refresh);
                self.appHeaderData.onRefresh = true;
                setTimeout(function () {
                    self.appHeaderData.onRefresh = false;

                }, 2000);
            },
            openOptionsHtml: function () {
                window.open('options.html');
            },
            closePopup: function () {
                window.close();
            }
        }
    });
    Message.on(MessageName.get.userName, function (data, sendResponse) {
        self.appHeaderData.userName = data;
    });
    Message.send(MessageName.get.userName, null, function (response) {
        self.appHeaderData.userName = response;
    });
    Message.send(MessageName.hasNewVer, null, function (response) {
        const msgData = response;
        self.appHeaderData.hasNewVer = msgData.hasNewVer;
        self.appHeaderData.updateURL = msgData.updateURL;
    });
}

function Sidebar() {
    const self = this;
    self.TAB_LIST = {
        1: {id: '1', name: '文章', targetID: '#simple-post-list'},
        2: {id: '2', name: '无聊图', targetID: '#tab-hotlist-pic'},
        3: {id: '3', name: '动态', targetID: '#tab-hotlist-hot'},
        4: {id: '4', name: '排行', targetID: '#tab-hot'},
        5: {id: '5', name: '妹子图', targetID: '#tab-hotlist-girl'},
        6: {id: '6', name: '段子', targetID: '#tab-hotlist-duan'},
        7: {id: '7', name: '优评', targetID: '#tab-hotlist-comment'},
    };
    self.DEFAULT_ORDER_LIST = [1, 2, 5, 3, 4, 6, 7];

    self.data = {
        tabButtonList: self.buildTabButtonList(self.DEFAULT_ORDER_LIST),
        activeTabID: '1',
        newCount: {
            1: 0
        },
    };
    self.appSidebar = new Vue({
        el: '#sidebar',
        data: self.data,
        methods: {
            getNewCount: function (tabID) {
                tabID = parseInt(tabID);
                var count = self.data.newCount[tabID];
                if (count > 0) {
                    return count;
                }
            }
        }
    });

    Message.on(MessageName.update.newCount.simplePostList, function (data, sendResponse) {
        self.data.newCount[1] = parseInt(data) || 0;
    });
    Message.send(MessageName.get.newCount.simplePostList);


    // on change tab
    {

        $('#sidebar .nav-tabs a').click(function (e) {
            const tabID = e.target.getAttribute('tabID');
            const targetID = self.TAB_LIST[tabID].targetID;
            g.dataSaver.save(DataSaverKeys.popup.sidebar.currentShowTabID, tabID);
            switch (targetID) {
                case '#simple-post-list':
                    Message.send(MessageName.browse.homeSimplePostList, targetID);
                    break;
                case '#tab-hot':

                    break;
            }
        });

        var currentShowTabID = g.dataSaver.read(DataSaverKeys.popup.sidebar.currentShowTabID);
        currentShowTabID = currentShowTabID || '1';
        const targetID = self.TAB_LIST[currentShowTabID].targetID;

        const select = '#sidebar .nav-tabs a' + '[href="' + targetID + '"]';
        $(select).click();

    }

}
Sidebar.prototype.buildTabButtonList = function (orderList) {
    const tabButtonList = [];
    for (var i = 0; i < orderList.length; i++) {
        const tabID = orderList[i];
        tabButtonList.push(this.TAB_LIST[tabID]);
    }

    return tabButtonList;
};


function findIndex(obj, objList) {
    for (var i = 0; i < objList.length; i++) {
        if (objList[i] === obj) {
            return i;
        }
    }
    return -1;
}

function formatURL(url) {
    if (url) {
        const head = url.substr(0, 4);
        if (head.toLowerCase() !== 'http') {
            return 'http:' + url;
        } else {
            return url;
        }
    }
    return 'not has url';
}


function stringStartWith(string, strHead) {
    var reg = new RegExp("^" + strHead);
    return reg.test(string);
}

function stringEndWith(string, strEnd) {
    var reg = new RegExp(strEnd + "$");
    return reg.test(string);
}

function whatTimeAgo(time) {
    const SECS = ' second ago';
    const MINS = ' minute ago';
    const HOUR = ' hour ago';
    const DAY = ' day ago';
    const MONTH = ' month ago';
    const YEAR = ' year ago';

    const date = new Date();
    date.setTime(parseInt(time));

    const now = new Date();
    const year = now.getFullYear() - date.getFullYear();
    const month = now.getMonth() - date.getMonth();
    const day = now.getDate() - date.getDate();
    const hour = now.getHours() - date.getHours();
    const minute = now.getMinutes() - date.getMinutes();
    const second = now.getSeconds() - date.getSeconds();

    if (year > 0) {
        return year + YEAR;
    } else if (month > 0) {
        return month + MONTH;
    } else if (day > 0) {
        return day + DAY;
    } else if (hour > 0) {
        return hour + HOUR;
    } else if (minute > 0) {
        return minute + MINS;
    } else if (second > 0) {
        return second + SECS;
    } else {
        return 1 + SECS;
    }
}
