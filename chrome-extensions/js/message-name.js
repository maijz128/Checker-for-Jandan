/**
 * Auther: MaiJZ
 * Date: 2017/5/13
 * Github: https://github.com/maijz128
 */


const MessageName = {
    update: {
        userName: 'update-UserName',
        simplePostList: 'update-simplePostList',
        tabHot: 'update-tabHot',
        hotList: {
            _head: 'u-hl-',
            hot: 'u-hl-list-hot',
            pic: 'u-hl-list-pic',
            girl: 'u-hl-list-girl',
            duan: 'u-hl-list-duan',
            comment: 'u-hl-list-comment',
        },
        newList: 'u-newList'
    },
    get: {
        userName: 'get-UserName',
        simplePostList: 'get-simplePostList',
        tabHot: 'get-tabHot',
        hotList: {
            _head: 'g-hl-',
            hot: 'g-hl-list-hot',
            pic: 'g-hl-list-pic',
            girl: 'g-hl-list-girl',
            duan: 'g-hl-list-duan',
            comment: 'g-hl-list-comment',
        },
        newList: 'g-newList'
    },
    browse: {
        homeSimplePostList: 'browse-homeSimplePostList'
    },
    refresh: 'refresh',
    hasNewVer: 'hasNewVer'
};

const MessageData = {
    hasNewVer: function () {
        return {
            hasNewVer: false,
            updateURL: ''
        }
    },
};