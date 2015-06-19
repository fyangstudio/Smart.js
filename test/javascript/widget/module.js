define(function () {
    return $m.$module.$extend({
        v: 1,
        $init: function () {
            console.log('Base class init');
            this.t1();
        },
        t1: function () {
            console.log('Base: do something');
        }
    })
});