/**
 * Auther: MaiJZ
 * Date: 2017/5/16
 * Github: https://github.com/maijz128
 */


// id : list-girl, list-comment , list-duan ,
//      list-pic  , list-hot
function HtmlToHotListItemList(id) {
    this.id = id;
}
HtmlToHotListItemList.ID_LIST = {
    list_hot: 'list-hot',           //  动态
    list_pic: 'list-pic',           //  无聊图
    list_girl: 'list-girl',         //  妹子图
    list_duan: 'list-duan',         //  段子
    list_comment: 'list-comment',   //  优评
};

HtmlToHotListItemList.prototype.parse = function (html) {
    const self = this;
    const contentHtml = self._contentHtml(html);
    if (contentHtml) {
        const list = self._contentHtmlToHotListItemList(contentHtml);
        if (list.length === 0) {
            console.error('解析不到' + self.id + '的数据!');
        }
        return list;
    } else {
        console.error('解析不到' + self.id + '的Html内容!');
        return [];
    }
};

HtmlToHotListItemList.prototype._contentHtml = function (html) {
    const self = this;
    var result = '';
    const pattern = 'id="' + self.id + '"[\\S\\s]*?<ul[\\S\\s]*?>([\\S\\s]*?)<\/ul>';
    const regExp = new RegExp(pattern);

    const reResult = regExp.exec(html);
    if (reResult.length > 1) {
        result = reResult[1];
    }
    return result;
};
HtmlToHotListItemList.prototype._contentHtmlToHotListItemList = function (contentHtml) {
    const self = this;
    var result = [];
    const div = document.createElement('div');
    div.innerHTML = contentHtml;

    const acv_authorList = div.getElementsByClassName('acv_author');
    const acv_commentList = div.getElementsByClassName('acv_comment');
    const jandan_voteList = div.getElementsByClassName('jandan-vote');

    for (var i = 0; i < acv_authorList.length; i++) {
        const item = new HotListItem();
        self._acv_authorInHotListItem(acv_authorList[i], item);
        self._acv_commentInHotListItem(acv_commentList[i], item);
        self._jandan_vote(jandan_voteList[i], item);

        result.push(item);
    }

    return result;
};

HtmlToHotListItemList.prototype._acv_authorInHotListItem = function (acv_author, hotListItem) {
    const self = this;
    const aList = acv_author.getElementsByTagName('a');
    if (aList.length > 0) {
        hotListItem.targetName = aList[0].innerText;
        hotListItem.targetURL = self.formatURL(aList[0].getAttribute('href'));

        hotListItem.author = acv_author.innerText.replace(hotListItem.targetName, '');
        hotListItem.author = hotListItem.author.replace('@', '');
    }
    return hotListItem;
};
HtmlToHotListItemList.prototype._acv_commentInHotListItem = function (acv_comment, hotListItem) {
    const self = this;

    const view_img_link_list = acv_comment.getElementsByClassName('view_img_link');
    const img_list = acv_comment.getElementsByTagName('img');

    if (view_img_link_list.length > 0) {
        for (var i = 0; i < view_img_link_list.length; i++) {
            const imgLarge = view_img_link_list[i].getAttribute('href');
            const imgThumb = img_list[i].getAttribute('src');

            hotListItem.imgList.push({
                imgLarge: self.formatURL(imgLarge),
                imgThumb: self.formatURL(imgThumb)
            });

            view_img_link_list[i].innerText = '';
        }
    } else {
        for (var i = 0; i < img_list.length; i++) {
            const imgThumb = img_list[i].getAttribute('src');
            hotListItem.imgList.push({
                imgLarge: null,
                imgThumb: self.formatURL(imgThumb)
            });
        }
    }

    const p_list = acv_comment.getElementsByTagName('p');
    for (var i = 0; i < p_list.length; i++) {
        hotListItem.description += p_list[i].innerText;
    }


    return hotListItem;
};

HtmlToHotListItemList.prototype._jandan_vote = function (jandan_voteList, hotListItem) {

    if (jandan_voteList.childNodes.length > 0) {
        const listNodes = jandan_voteList.getElementsByClassName('comment-like');
        const vote_id = listNodes[0].getAttribute('data-id');
        hotListItem.id = vote_id.trim();
    }

    // ooxx
    const spans = jandan_voteList.getElementsByTagName('span');
    if (spans.length > 0) {
        hotListItem.ooCount = spans[0].innerText.trim();
        hotListItem.xxCount = spans[1].innerText.trim();
    }

    return hotListItem;
};


HtmlToHotListItemList.prototype.formatURL = function (url) {
    if (url) {
        const head = url.substr(0, 4);
        if (head.toLowerCase() !== 'http') {
            return 'http:' + url;
        } else {
            return url;
        }
    }
    return 'not has url';
};