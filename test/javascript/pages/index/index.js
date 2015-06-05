define.$config({
    sites: {pro: "javascript/pages/", wid: "javascript/widget/", com: "javascript/components/"},
    paths: {notify: "com!notify/notify"},
    charset: "gbk"
})
console.log($m.$parseURI(["wid!module", "com!notify/notify"]))
define([
    '../../widget/module'
], function (m) {
    console.log(m);
});
