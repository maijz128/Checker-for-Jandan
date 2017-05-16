/**
 * Auther: MaiJZ
 * Date: 2017/5/13
 * Github: https://github.com/maijz128
 */




function HtmlToSimplePostList() {

}

HtmlToSimplePostList._ContentHtml = function (html) {
    var contentHtml = null;
    const pContent = /<!-- BEGIN content -->([\S\s]*)<!-- END content -->/;

    const reContent = new RegExp(pContent);
    const reResult = reContent.exec(html);
    if (reResult.length > 1) {
        contentHtml = reResult[1];
    }
    return contentHtml;
};

HtmlToSimplePostList._Posts_Element = function (html) {
    var result = [];
    const contentHtml = HtmlToSimplePostList._ContentHtml(html);

    const div = document.createElement('div');
    div.innerHTML = contentHtml;
    const elContent = div.firstElementChild;

    for (var i = 0; i < elContent.childNodes.length; i++) {
        const el = elContent.childNodes[i];

        if (el.nodeType === 1 && el.nodeName === 'DIV') {
            var isPost = false;
            const classString = el.getAttribute('class');
            if (classString) {
                isPost = classString === 'post f list-post';
            }
            if (isPost) {
                result.push(el);
            }
        }
    }
    return result;
};

HtmlToSimplePostList._PostElementToSimplePost = function (postElement) {
    const simplePost = new SimplePost();

    const tempDivID = 'tempDiv556';
    const tempDiv = document.createElement('div');
    tempDiv.setAttribute('id', tempDivID);
    tempDiv.appendChild(postElement);
    document.body.appendChild(tempDiv);


    if (postElement.childNodes.length > 0) {
        const s_tempDivID = '#' + tempDivID + ' ';

        const thumbs_b_a = document.querySelector(s_tempDivID + '.post .thumbs_b > a');
        const thumbs_b_a_img = document.querySelector(s_tempDivID + '.post .thumbs_b img');
        simplePost.url = thumbs_b_a.getAttribute('href');
        simplePost.img = thumbs_b_a_img.getAttribute('src');
        if (!simplePost.img) {
            simplePost.img = thumbs_b_a_img.getAttribute('data-original');
        }


        const indexs_span = document.querySelector(s_tempDivID + '.post .indexs > span');
        simplePost.createTime = indexs_span.getAttribute('title');
        simplePost.commentCount = indexs_span.innerText;


        const indexs_h2_a = document.querySelector(s_tempDivID + '.post .indexs > h2 > a');
        simplePost.title = indexs_h2_a.innerText;

        const indexs_time_s_a = document.querySelector(s_tempDivID + '.post .indexs > .time_s > a');
        simplePost.author = indexs_time_s_a.innerText;
        simplePost.authorURL = indexs_time_s_a.getAttribute('href');

        const indexs_time_s_strong_a = document.querySelector(s_tempDivID + '.post .indexs > .time_s > strong > a');
        simplePost.tag = indexs_time_s_strong_a.innerText;
        simplePost.tagURL = indexs_time_s_strong_a.getAttribute('href');


        const indexs_jandan_zan = document.querySelector(s_tempDivID + '.post .indexs > .jandan-zan');
        simplePost.id = indexs_jandan_zan.getAttribute('id');

        const indexs_zan_icon = document.querySelector(s_tempDivID + '.post .indexs  .zan-icon');
        simplePost.likeCount = indexs_zan_icon.innerText;
        simplePost.likeCount = simplePost.likeCount.slice(1);  // delete ⊙

        const indexs_time_s = document.querySelector(s_tempDivID + '.post .indexs > .time_s');
        simplePost.intro = indexs_time_s.nextSibling.nodeValue;

    }

    tempDiv.removeChild(postElement);
    document.body.removeChild(tempDiv);
    return simplePost;
};

