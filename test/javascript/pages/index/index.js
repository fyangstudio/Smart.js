define([
    'notify!',
    '6<=$ie<9!./index.ie',
    '$pixel>1!./index.retina',
    'widget!frame/topbar'
], function (notify, ie, retina, topbar) {
    console.log(notify.notify);
    console.log(ie);
    console.log(retina)
    // new topbar({'option': 'I am option'}).t3();
});
