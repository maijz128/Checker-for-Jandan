/**
 * Auther: MaiJZ
 * Date: 2017/5/12
 * Github: https://github.com/maijz128
 */




function Notifications() {
}
Notifications.AUTO_CLOSE_TIME = 5000;
Notifications.create = function (imgURL, title, content, autoCloseTime) {
    var notification = webkitNotifications.createNotification(
        imgURL,
        title,
        content
    );

    notification.show();

    autoCloseTime = autoCloseTime || Notifications.AUTO_CLOSE_TIME || 5000;
    setTimeout(function () {
        notification.cancel();
    }, autoCloseTime);
};