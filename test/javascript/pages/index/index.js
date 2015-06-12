define([
    'notify!',
    '$pixel>1!./index.retina',
    '6<=$ie<9!./index.ie',
    'widget!frame/topbar'
], function (notify, retina, ie, topbar) {
    console.log(notify.notify);
    new topbar({'option': 'I am option'}).t3();
});
