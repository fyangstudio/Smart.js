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
    var t1 = $m.$parseHTML('<div class="title" style="color:red;"></div>');
    var t2 = $m.$parseHTML('<p>2222</p>');
    var t3 = $m.$parseHTML('<input type="text" id="three" />');
    var t4 = $m.$parseHTML('<label for="three">xxx</label>');
    var f = $m.$fragment();
    t1.appendChild(t2);
    t1.appendChild(t3);
    t1.appendChild(t4);
    f.appendChild(t1);
    t1.onclick = function () {
        $m.$replace($m.$parseHTML('<p>3333</p>'), t2);
    };
    console.log($m.$attr(t4, 'for'));
    $m.$get('#test1')[0].appendChild(f);

});
