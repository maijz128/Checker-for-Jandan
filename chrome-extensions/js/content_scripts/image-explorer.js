/**
 * Auther: MaiJZ
 * Date: 2017/5/17
 * Github: https://github.com/maijz128
 */

console.log('Hello Jandan, from image explorer');


function ImgExplorer() {
    const self = this;
    self.data = {
        isShow: false,
        imgSrc: null,
    };
    self.isOnHideSetImgToNull = true;

    // 组件名字
    const COMPONENT_NAME = 'com-img-explorer';


    //  添加App容器
    const ImgExplorerID = 'image-explorer-123';
    const el_ImgExplorer = document.createElement('div');
    el_ImgExplorer.setAttribute('id', ImgExplorerID);
    document.body.appendChild(el_ImgExplorer);

    // 添加组件
    const el_Com_ImgExplorer = document.createElement(COMPONENT_NAME);
    el_ImgExplorer.appendChild(el_Com_ImgExplorer);

    // 添加事件：按Esc退出
    document.addEventListener('keydown', function (e) {
        if (e.which === 27) {
            self.hide();
        }
    }, false);


    // 初始化App
    self.app = new Vue({
        el: '#' + ImgExplorerID,
        data: self.data,
        methods: {},
        components: {
            'com-img-explorer': Vue.extend({
                template: '' +
                '<div class="image-explorer" v-show="isShow()">' +
                '   <div class="body-wrapper">' +
                '       <div class="header">' +
                '           <div class="content">' +
                '               <div class="header-btn "><a :href="getImgSrc()" download>Save</a></div>' +
                '               <div class="header-btn close" @click="close()">Close</div></div>' +
                '       </div>' +
                '       <div class="body-content">' +
                '           <div class="image">' +
                '               <img class="img" :class="getCursorClass()" :src="getImgSrc()" ' +
                '                    :height="getImgHeight()" @click="onClickImg()" @load="onLoaded()">' +
                '           </div>' +
                // '           <div class="loading" v-show="noLoaded">Loading</div>' +
                '       </div>' +
                '   </div>' +
                '</div>',
                methods: {
                    close: function () {
                        self.hide();
                    },
                    getImgSrc: function () {
                        return self.data.imgSrc;
                    },
                    isShow: function () {
                        const imgSrc = this.getImgSrc();
                        if (this.prevImgSrc !== imgSrc) {
                            this.isZoom = false;
                            this.notLoaded = true;
                            this.prevImgSrc = imgSrc;
                        }
                        return self.data.isShow;
                    },
                    getImg: function () {
                        const imgList = this.$el.getElementsByClassName('img');
                        return imgList[0];
                    },
                    getImgHeight: function () {
                        if (this.isZoom) {
                            const imgHeight = this.getImg().naturalHeight;
                            const viewPortHeight = ImgExplorer.getViewPortSize().height;
                            var height = viewPortHeight - 5;

                            if (imgHeight > 0) {
                                if (height > imgHeight) {
                                    height = imgHeight;
                                }
                                return height + 'px'
                            }
                        }
                        return '100%';
                    },
                    getCursorClass: function () {
                        if (this.isZoom) {
                            return 'zoom-in';
                        } else {
                            return 'zoom-out';
                        }
                    },
                    onClickImg: function () {
                        this.isZoom = !this.isZoom;
                    },
                    onLoaded: function () {
                        this.notLoaded = false;
                    }
                },
                data: function () {
                    return {
                        isZoom: false,
                        notLoaded: true,
                        prevImgSrc: '',
                    }
                }
            }),
        }
    });

}
ImgExplorer.prototype.show = function () {
    this.data.isShow = true;
    // hide Body Scroll();
    document.body.style.overflow = 'hidden';
};
ImgExplorer.prototype.hide = function () {
    const self = this;
    if (self.data.isShow) {
        self.data.isShow = false;
        if (self.isOnHideSetImgToNull) {
            self.setImg(null);
        }
        // show Body Scroll
        document.body.style.overflow = '';
    }
};
ImgExplorer.prototype.setImg = function (src) {
    this.data.imgSrc = src;
};

ImgExplorer.getViewPortSize = function () {
    var pageWidth = window.innerWidth, pageHeight = window.innerHeight;

    if (typeof pageWidth !== "number") {
        if (document.compatMode === "CSS1Compat") {
            pageWidth = document.documentElement.clientWidth;
            pageHeight = document.documentElement.clientHeight;
        } else {
            pageWidth = document.body.clientWidth;
            pageHeight = document.body.clientHeight;
        }
    }

    return {
        width: pageWidth,
        height: pageHeight
    }
};


function ImgExplorerController() {
    const self = this;
    self.imgExplorer = new ImgExplorer();
    self.IMG_HREF = 'img-href';


    self.onClick_view_img_link = function (event) {
        const el_a = event.target;
        const img_href = el_a.getAttribute(self.IMG_HREF);

        self.imgExplorer.setImg(img_href);
        self.imgExplorer.show();
    };

    // 修改view_img_link的href属性，和添加侦听Click事件
    self._addClickListener();

}
ImgExplorerController.prototype._addClickListener = function () {
    const self = this;
    var view_img_link_list = document.getElementsByClassName('view_img_link');

    for (var i = 0; i < view_img_link_list.length; i++) {
        const el_view_img_link = view_img_link_list[i];

        const href = el_view_img_link.getAttribute('href');
        if (href && href !== 'javascript:;') {

            el_view_img_link.setAttribute('href', 'javascript:;');
            el_view_img_link.setAttribute(self.IMG_HREF, href);


            el_view_img_link.addEventListener('click', self.onClick_view_img_link);
        }
    }
};


const imgExplorerController = new ImgExplorerController();
