define([
    'notify!',
    'wid!frame/topbar'
], function (notify, topbar) {
    console.log(notify.notify);
    new topbar({'option': 'I am option'}).t3();
});
