/**
 * Auther: MaiJZ
 * Date: 2017/5/11
 * Github: https://github.com/maijz128
 */


function SimplePost() {
    const self = this;
    self.id = "";
    self.title = "";
    self.author = "";
    self.authorURL = "";
    self.createTime = "";
    self.tag = "";
    self.tagURL = "";
    self.img = "";
    self.intro = "";
    self.likeCount = "";
    self.commentCount = "";
    self.PVCount = ""; // Page View Count
    self.url = "";

}
SimplePost.sortForID = function (list) {
    return list.sort(function (a, b) {
        if (b.id > a.id) {
            return 1;
        } else if (b.id < a.id) {
            return -1;
        } else {
            return 0;
        }
    });
};
SimplePost.sortForLikeCount = function (list) {
    return list.sort(function (a, b) {
        return b.likeCount - a.likeCount;
    });
};
SimplePost.sortForCommentCount = function (list) {
    return list.sort(function (a, b) {
        return b.commentCount - a.commentCount;
    });
};
SimplePost.sortForPVCount = function (list) {
    return list.sort(function (a, b) {
        return b.PVCount - a.PVCount;
    });
};
SimplePost.compare = function (simplePostA, simplePostB) {
    const idA = simplePostA.id;
    const idB = simplePostB.id;
    if (idA < idB) {
        return -1;
    } else if (idA === idB) {
        return 0;
    } else {
        return 1;
    }
};
SimplePost.prototype.equals = function (simplePost) {
    if (simplePost.constructor === SimplePost) {
        return SimplePost.compare(this, simplePost) === 0;
    } else {
        return false;
    }
};


function newSimplePost() {
    return new SimplePost();
}


function HotListItem() {
    const self = this;
    self.id = '';
    self.author = '';
    self.targetName = '';
    self.targetURL = '';
    self.imgLarge = '';
    self.imgThumb = '';
    self.imgList = []; // 元素为{imgLarge : '', imgThumb : ''}
    self.description = '';
    self.ooCount = '';
    self.xxCount = '';
}
HotListItem.compare = function (hotListItemA, hotListItemB) {
    const idA = hotListItemA.id;
    const idB = hotListItemB.id;
    if (idA < idB) {
        return -1;
    } else if (idA === idB) {
        return 0;
    } else {
        return 1;
    }
};
HotListItem.prototype.equals = function (hotListItem) {
    if (hotListItem.constructor === HotListItem) {
        return HotListItem.compare(this, hotListItem) === 0;
    } else {
        return false;
    }
};
