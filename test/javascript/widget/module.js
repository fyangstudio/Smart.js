define(function () {
    return $m.$module.$extend({
        v: 1,
        $init: function (context) {
            console.log('Base class init');
            console.log('!' + this.v);
            console.log('!!' + context.v);
            this.t1();
        },
        t1: function () {
            console.log('Base: do something');
        }
    })
});