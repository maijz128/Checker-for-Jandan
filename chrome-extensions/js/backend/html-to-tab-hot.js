/**
 * Auther: MaiJZ
 * Date: 2017/5/14
 * Github: https://github.com/maijz128
 */


function HtmlToTabHot() {

}
HtmlToTabHot.sidebarHtml = function (html) {
    var resultHtml = null;
    const pattern = /<!-- BEGIN sidebar -->([\S\s]*)<!-- END sidebar -->/;

    const regExp = new RegExp(pattern);
    const reResult = regExp.exec(html);
    if (reResult.length > 1) {
        resultHtml = reResult[1];
    }

    // remove script node
    //const pScript = /<script>[\s\S]*?<\/script>/;
    //resultHtml = resultHtml.replace(pScript, '');

    return resultHtml;
};

HtmlToTabHot.tabHotHtml = function (html) {
    var resultHtml = null;
    const pattern = /<!-- 热文 -->([\S\s]*)<!-- 热榜 -->/;

    const regExp = new RegExp(pattern);
    const reResult = regExp.exec(html);
    if (reResult.length > 1) {
        resultHtml = reResult[1];
    }

    return resultHtml;
};

//日点击排行
HtmlToTabHot.hotposts_Html = function (tabHotHtml) {
    var hotpostsHtml = null;

    const pattern = /list-hotposts[\S\s]*?decodeURIComponent\('([\S\s]*?)'\)\)/;
    const regExp = new RegExp(pattern);
    const reResult = regExp.exec(tabHotHtml);
    if (reResult.length > 1) {
        hotpostsHtml = reResult[1];

    }
    return decodeURIComponent(hotpostsHtml);
};
HtmlToTabHot.hotpostsHtmlToSimplePostList = function (hotpostsHtml) {
    const simplePostList = [];

    const hotpostsElement = document.createElement('div');
    hotpostsElement.innerHTML = hotpostsHtml;

    const aList = hotpostsElement.getElementsByTagName('a');
    for (var i = 0; i < aList.length; i++) {
        const itemA = aList[i];
        const itemSP = new SimplePost();
        itemSP.title = itemA.innerText;
        itemSP.url = itemA.getAttribute('href');
        itemSP.PVCount = itemA.getAttribute('title');
        itemSP.PVCount = itemSP.PVCount.replace('次浏览', '');

        simplePostList.push(itemSP);
    }

    return simplePostList;
};

//日最赞排行
HtmlToTabHot.hotlike_Html = function (tabHotHtml) {
    var html = null;

    const pattern = /list-hotlike[\S\s]*?decodeURIComponent\('([\S\s]*?)'\)\)/;
    const regExp = new RegExp(pattern);
    const reResult = regExp.exec(tabHotHtml);
    if (reResult.length > 1) {
        html = reResult[1];

    }
    return decodeURIComponent(html);
};
HtmlToTabHot.hotlikeHtmlToSimplePostList = function (hotlikeHtml) {
    const simplePostList = [];

    const hotlikeElement = document.createElement('div');
    hotlikeElement.innerHTML = hotlikeHtml;

    const liList = hotlikeElement.getElementsByTagName('li');
    const aList = hotlikeElement.getElementsByTagName('a');
    for (var i = 0; i < aList.length; i++) {
        const itemA = aList[i];
        const itemLi = liList[i];
        const itemSP = new SimplePost();
        itemSP.title = itemA.innerText;
        itemSP.url = itemA.getAttribute('href');
        itemSP.likeCount = itemLi.innerText;
        itemSP.likeCount = itemSP.likeCount.replace('赞', '');
        itemSP.likeCount = itemSP.likeCount.replace(itemSP.title, '');
        itemSP.likeCount = parseInt(itemSP.likeCount);


        simplePostList.push(itemSP);
    }

    return simplePostList;
};

//周评论排行
HtmlToTabHot.hotcomments_Html = function (tabHotHtml) {
    var html = null;

    const pattern = /list-hotcomments[\S\s]*?decodeURIComponent\('([\S\s]*?)'\)\)/;
    const regExp = new RegExp(pattern);
    const reResult = regExp.exec(tabHotHtml);
    if (reResult.length > 1) {
        html = reResult[1];

    }
    return decodeURIComponent(html);
};
HtmlToTabHot.hotcommentsHtmlToSimplePostList = function (hotcommentsHtml) {
    const simplePostList = [];

    const hotcommentsElement = document.createElement('div');
    hotcommentsElement.innerHTML = hotcommentsHtml;

    const liList = hotcommentsElement.getElementsByTagName('li');
    const aList = hotcommentsElement.getElementsByTagName('a');
    for (var i = 0; i < aList.length; i++) {
        const itemA = aList[i];
        const itemLi = liList[i];
        const itemSP = new SimplePost();
        itemSP.title = itemA.innerText;
        itemSP.url = itemA.getAttribute('href');
        itemSP.commentCount = itemLi.innerText;
        itemSP.commentCount = itemSP.commentCount.replace('评论', '');
        itemSP.commentCount = itemSP.commentCount.replace(itemSP.title, '');
        itemSP.commentCount = parseInt(itemSP.commentCount);


        simplePostList.push(itemSP);
    }

    return simplePostList;
};