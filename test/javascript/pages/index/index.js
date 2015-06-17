define([
    'notify!',
    '$chrome!./index.chrome',
    '6<=$ie<9!./index.IE',
    '^6<=$ie<9!./index.notIE',
    '$pixel>1!./index.retina',
    'widget!frame/topbar'
], function (notify, chrome, IE, notIE, retina, topbar) {
    //console.log(notify.notify);
    //console.log(chrome);
    //console.log(IE);
    //console.log(notIE);
    //console.log(retina);
    //var t1 = new topbar({'option': 'I am option'});
    //t1.$emit('ok');
    //t1.$emit('ok');
    //var resizeFn = $m.$throttle(function (x) {
    //    console.log(x);
    //}, 100);
    //$m.$addEvent(window, 'resize', function () {
    //    resizeFn(100);
    //});
});
