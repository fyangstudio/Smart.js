define.$config({
    "sites": {"pro": "javascript/pages/", "wid": "javascript/widget/"},
    "charset": "gbk"
})
console.log($m.$parseURI("wid!module"))
define([
    '../../widget/module'
], function (m) {
    console.log(m);
});
