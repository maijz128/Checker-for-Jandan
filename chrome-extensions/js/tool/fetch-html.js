/**
 * Auther: MaiJZ
 * Date: 2017/5/13
 * Github: https://github.com/maijz128
 */


function fetchHtml(url) {
    return fetch(url).then(function (response) {
        // console.log(response);
        var reader = response.body.getReader();
        var partialCell = '';
        var decoder = new TextDecoder();

        function loadData() {
            return reader.read().then(function (result) {
                partialCell += decoder.decode(result.value || new Uint8Array, {
                    stream: !result.done
                });

                if (result.done) {
                    return partialCell;
                } else {
                    return loadData();
                }
            });
        }

        return loadData();
    }).then(function (html) {
        return html;
    });
}