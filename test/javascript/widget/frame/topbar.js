define([
    'widget!module',
    '$json!mock/test.json',
    '$text!./topbar.html'
], function (m, json, tpl) {

    var side = $m.$tpl.$extend({
        template: tpl,
        responsive: true,
        $init: function (data) {
            console.log(this);
            this.$super();
        },
        test: function () {
            console.log(this.template);
        }
    });

    new side().$inject('#test1');

    //console.log(json);
    //var parent = m.$extend({
    //    v: 2,
    //    $init: function () {
    //        this.$super(this);
    //        console.log(this.$child)
    //        console.log('Parent class init');
    //        console.log(this.v);
    //    },
    //    t2: function () {
    //        console.log('Parent: do something');
    //    }
    //});
    //
    //var child = parent.$extend({
    //    v: 3,
    //    $init: function (_option) {
    //        this.$super();
    //        this.$on('ok', this.t3);
    //        console.log('Child class init');
    //        console.log(this.v);
    //        console.log(_option['option']);
    //        this.t2(_option);
    //    },
    //    t2: function (_option) {
    //        this.$super();
    //        console.log(_option['option']);
    //        console.log('Child: do something');
    //    },
    //    t3: function () {
    //        console.log('OK!');
    //        this.$off('ok');
    //    }
    //});
    //return child;
});