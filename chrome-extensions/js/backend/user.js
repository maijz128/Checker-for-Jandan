/**
 * Auther: MaiJZ
 * Date: 2017/5/13
 * Github: https://github.com/maijz128
 */


function Cookies() {
}
Cookies.get = function (domain, key, callback) {
    chrome.cookies.get({
        url: domain,
        name: key
    }, function (cookie) {
        callback(cookie.value);
    });
};
Cookies.getAll = function (callback) {
    chrome.cookies.getAll({}, function (cookies) {
        const result = {};
        cookies.forEach(function (e) {
            result[e.name] = {
                domain: e.domain,
                name: e.name,
                value: e.value
            }
        });
        callback(result);
    });
};

/*
 chrome.cookies.set({
 'url':'http://github.com/test_cookie',
 'name':'TEST',
 'value':'foo',
 'secure':false,
 'httpOnly':false
 }, function(cookie){
 console.log(cookie);
 });
 */

function User() {
}
User.COOKIE_DOMAIN = 'jandan.net';
User.COOKIE_DOMAIN_CHILDREN = '.andan.net';
User.COOKIE_KEY_JDNA = 'jdna';
User.COOKIE_KEY_USER_NAME = 'comment_author_';
User.COOKIE_KEY_USER_EMAIL = 'comment_author_email_';

User.prototype.cookies = null;
User.prototype.refreshCookies = function (callback) {
    const self = this;
    Cookies.getAll(function (cookies) {
        self.cookies = cookies;
        if (callback) callback(cookies);
    });
};
User.prototype.getCookies = function (callback) {
    const self = this;
    if (self.cookies) {
        callback(self.cookies);
    } else {
        self.refreshCookies(callback);
    }
};
User.prototype.getName_old = function (callback) {
    const self = this;
    self.getCookies(function (cookies) {
        var name = '';
        const jdna = cookies[User.COOKIE_KEY_JDNA];
        if (jdna) {
            var userID = jdna.value;
            const index = userID.indexOf('#');
            if (index > -1) {
                userID = userID.replace(/#.*/, '');
            }

            name = cookies[User.COOKIE_KEY_USER_NAME + userID].value;
        }
        callback(name);
    });
};
User.prototype.getJDNA = function (callback) {
    const self = this;
    self.getCookies(function (cookies) {
        var jdna = '';
        const jdnaObj = cookies[User.COOKIE_KEY_JDNA];
        if (jdnaObj) {
            jdna = jdnaObj.value;
        }
        callback(jdna);
    });
};
User.prototype.getID = function (callback) {
    const self = this;
    self.getCookies(function (cookies) {
        var id = '';
        const jdnaObj = cookies[User.COOKIE_KEY_JDNA];
        if (jdnaObj) {
            var jdna = jdnaObj.value;
            id = jdna.replace(/#.*/, '');
        }
        callback(id);
    });
};
User.prototype.getName = function (callback) {
    const self = this;
    self.getCookies(function (cookies) {
        var name = '';
        for (const key in cookies) {
            const e = cookies[key];
            const hasAuthor = e.name.indexOf(User.COOKIE_KEY_USER_NAME) > -1;
            const notEmail = e.name.indexOf(User.COOKIE_KEY_USER_EMAIL) === -1;
            if (hasAuthor && notEmail) {
                name = e.value;
            }
        }
        callback(name);
    });
};
User.prototype.getEmail = function (callback) {
    const self = this;
    self.getCookies(function (cookies) {
        var email = '';
        for (const key in cookies) {
            const e = cookies[key];
            const hasEmail = e.name.indexOf(User.COOKIE_KEY_USER_EMAIL) > -1;
            if (hasEmail) {
                email = decodeURIComponent(e.value);
            }
        }
        callback(email);
    });

};


