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
    var t1 = $m.$parseHTML('<div></div>');
    var t2 = $m.$parseHTML('<p>2222</p>');
    var f = $m.$fragment();
    t1.appendChild(t2);
    f.appendChild(t1);
    t1.onclick = function () {
        t1.removeChild(t2);
        t2 = $m.$parseHTML('<p>3333</p>');
        t1.appendChild(t2);
    };
    $m.$get('#test1')[0].appendChild(f);

});
