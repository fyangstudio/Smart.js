define([
    'notify!',
    '6<=$ie<9!./index.IE',
    '^6<=$ie<9!./index.notIE',
    '$pixel>1!./index.retina',
    'widget!frame/topbar'
], function (notify, IE, notIE, retina, topbar) {
    console.log(notify.notify);
    console.log(IE);
    console.log(notIE);
    console.log(retina);
    new topbar({'option': 'I am option'}).t3();
});
