define([
    'notify!',
    '6<=$ie<9!./index.ie',
    'widget!frame/topbar'
], function (notify, ie, topbar) {
    console.log(notify.notify);
    new topbar({'option': 'I am option'}).t3();
});
