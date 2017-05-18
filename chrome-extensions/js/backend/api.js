/**
 * Auther: MaiJZ
 * Date: 2017/5/11
 * Github: https://github.com/maijz128
 */





function Backend() {
    const self = this;
    self.urlList = {
        homeHtml: 'http://jandan.net/',
    };
    self.cache = {
        homeHtml: null,
    };
    self.updateInterval = {
        homeHtml: 5 * 60 * 1000,
    };
    self.latelyUpdateTime = {
        homeHtml: 0,
    };

    self.parser = new HtmlToHotListItemList();
    // self.HOTLIST_ID = HtmlToHotListItemList.ID_LIST;
}
Backend.HOTLIST_ID = HtmlToHotListItemList.ID_LIST;
Backend.prototype._fetchHtml = function (htmlName, callback) {
    const self = this;
    const overTime = (Date.now() - self.latelyUpdateTime[htmlName]) >= self.updateInterval[htmlName];
    if (self.cache[htmlName] === null || overTime) {
        const url = self.urlList[htmlName];
        fetchHtml_Simple(url).then(function (html) {
            self.cache[htmlName] = html;
            callback(html);
        });
    } else {
        callback(self.cache[htmlName]);
    }
};

Backend.prototype.fetchHomeHtml = function (callback) {
    this._fetchHtml('homeHtml', callback);
};

Backend.prototype.getHomePageSimplePostList = function (callback) {
    this.fetchHomeHtml(function (html) {
        const elPosts = HtmlToSimplePostList._Posts_Element(html);
        const simplePostList = [];
        for (var i = 0; i < elPosts.length; i++) {
            const el = elPosts[i];
            simplePostList.push(HtmlToSimplePostList._PostElementToSimplePost(el));

        }
        callback(simplePostList);
    });
};

Backend.prototype.getHotTab_Like_SimplePostList = function (callback) {
    this.fetchHomeHtml(function (html) {
        const tabHotHtml = HtmlToTabHot.tabHotHtml(html);
        const hotlike_Html = HtmlToTabHot.hotlike_Html(tabHotHtml);
        const simplePostList = HtmlToTabHot.hotlikeHtmlToSimplePostList(hotlike_Html);


        callback(simplePostList);
    });
};
Backend.prototype.getHotTab_Comments_SimplePostList = function (callback) {
    this.fetchHomeHtml(function (html) {
        const tabHotHtml = HtmlToTabHot.tabHotHtml(html);
        const hotcomments_Html = HtmlToTabHot.hotcomments_Html(tabHotHtml);
        const simplePostList = HtmlToTabHot.hotcommentsHtmlToSimplePostList(hotcomments_Html);

        callback(simplePostList);
    });
};
Backend.prototype.getHotTab_Posts_SimplePostList = function (callback) {
    this.fetchHomeHtml(function (html) {
        const tabHotHtml = HtmlToTabHot.tabHotHtml(html);
        const hotposts_Html = HtmlToTabHot.hotposts_Html(tabHotHtml);
        const simplePostList = HtmlToTabHot.hotpostsHtmlToSimplePostList(hotposts_Html);

        callback(simplePostList);
    });
};


// Backend.prototype.HotListPic_HotListItemList = function (callback) {
//     const self = this;
//     self.fetchHomeHtml(function (html) {
//         // const _html = HtmlToTabPic.tabPicHtml(html);
//         // const list = HtmlToTabPic.tabPicHtmlToHotListItemList(_html);
//         const list = self.parser.hot_list_pic.parse(html);
//         callback(list);
//     });
// };
Backend.prototype.HotList_HotListItemList = function (id, callback) {
    const self = this;
    self.fetchHomeHtml(function (html) {
        self.parser.id = id;
        const list = self.parser.parse(html);
        callback(list);
    });
};

