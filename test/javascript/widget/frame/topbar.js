define([
    'widget!module',
    '$json!mock/test.json',
    '$text!./topbar.html'
], function (m, json, tpl) {

    var base = $m.$tpl.$extend({
        name: 'bar',
        template: tpl,
        watch: ['p'],
        responsive: true,
        watchHash: true,
        init: function () {
            this.$on('ok1', this.test1);
        },
        test1: function () {
            this.$update();
            console.log(1);
        }
    });

    //var side = base.$extend({
    //    init: function () {
    //        this.$super();
    //        this.$on('ok2', this.test1);
    //        this.test2()
    //    },
    //    v: 2,
    //    test2: function () {
    //        this.$emit('ok1');
    //        this.$emit('ok2');
    //        console.log('!!' + this.v);
    //    }
    //});

    var t = new base({data: {t: 1, x: {t: 1}}}).$inject('#test1');
    //console.log(json);
    //var parent = m.$extend({
    //    $init: function () {
    //        this.$super(this);
    //        console.log('Parent class init');
    //        this.t2();
    //    },
    //    t2: function () {
    //        console.log('Parent: do something');
    //    }
    //});
    //
    //var child = parent.$extend({
    //    $init: function (_option) {
    //        this.$super();
    //        this.$on('ok', this.t3);
    //        console.log('Child class init');
    //        console.log(_option['option']);
    //    },
    //    t3: function () {
    //        console.log(this);
    //        console.log('OK!');
    //        this.$off('ok');
    //    }
    //});
    //return child;
});