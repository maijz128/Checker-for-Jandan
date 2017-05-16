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

    for (var i = 0; i < acv_authorList.length; i++) {
        const item = new HotListItem();
        self._acv_authorInHotListItem(acv_authorList[i], item);
        self._acv_commentInHotListItem(acv_commentList[i], item);

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

    const vote_list = acv_comment.getElementsByClassName('vote');
    if (vote_list.length > 0) {
        const vote_id = vote_list[0].getAttribute('id');
        hotListItem.id = vote_id.replace('vote-', '');


        // ooxx
        const cos_support_id = 'cos_support-' + hotListItem.id;
        const cos_unsupport_id = 'cos_unsupport-' + hotListItem.id;
        for (var i = 0; i < vote_list[0].childNodes.length; i++) {
            const node = vote_list[0].childNodes[i];
            if (node.nodeType === 1) {
                const nodeID = node.getAttribute('id');
                if (nodeID === cos_support_id) {
                    hotListItem.ooCount = node.innerText;

                } else if (nodeID === cos_unsupport_id) {
                    hotListItem.xxCount = node.innerText;

                }
            }

        }
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