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
            this.$on('inject', this.test1);
        },
        test1: function () {
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

    //var _fragment_ = $m._f;
    //var cnt = $m.$get('#test1')[0];
    //var test = new _fragment_();
    //var d1 = $m.$create('p');
    //var d2 = $m.$create('ul');
    //var d3 = $m.$create('li');
    //var d4 = $m.$create('ol');
    //test.$add([d1, d2, d3, d4]);
    //cnt.appendChild(test.$get());
    //test.$remove(d3);
    //test.$add(d3);
    //console.log(test)

    var t = new base({data: {t: 1, s: 2, x: {t: 1}}}).$inject('#test1');
    t.data.t = 2;
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