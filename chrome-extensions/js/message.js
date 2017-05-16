/**
 * Auther: MaiJZ
 * Date: 2017/5/13
 * Github: https://github.com/maijz128
 */


function Message() {
}
Message._onMessage = null;
Message._Observers = {};
Message._addListener = function () {
    if (Message._onMessage === null) {
        chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {

            if (message.hasOwnProperty('messageName')) {
                const messageName = message.messageName;
                const data = message.data;

                const observer = Message._Observers[messageName];
                if (observer) {
                    observer(data, sendResponse)
                }
            }
        });
    }
};
/**
 * @param messageName ''
 * @param callback function(data, sendResponse)
 */
Message.on = function (messageName, callback) {
    Message._addListener();
    Message._Observers[messageName] = callback;
};
/**
 * @param messageName ''
 * @param data send data
 * @param callback function(response)
 */
Message.send = function (messageName, data, callback) {
    const message = {
        messageName: messageName,
        data: data
    };
    chrome.runtime.sendMessage(message, function (response) {
        if (callback) callback(response);
    });
};