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
    //new topbar({'option': 'I am option'}).t3();
    var test = {}
    $m.$bindEvent(test);
    test.e = function () {
        console.log(111);
    };
    test.t = function () {
        this.$on('update', this.e);
    };
    test.t();
    test.$emit('update');
});
