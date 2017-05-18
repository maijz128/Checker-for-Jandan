/**
 * Auther: MaiJZ
 * Date: 2017/5/13
 * Github: https://github.com/maijz128
 */


function fetchHtml_Simple(url) {
//            var myHeaders = new Headers();
//            myHeaders.append('Content-Type', 'text/html');
//            const opt = {
//                mode: 'no-cors',
//                method: 'get',
//                headers: myHeaders
//            };
    return fetch(url).then(function (response) {
        return response.text()
    }).then(function (text) {
        return text;
    }).catch(function (err) {
        console.error(err)
    });
}