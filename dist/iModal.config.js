if (define && define.samd && define.$config) {
    define.$config({
        sites: {/* lib: "javascript/lib/" */},
        paths: {/* config: "lib!iModal.config" */},
        charset: "utf-8",
        // exp: http://xxx.com/#!/search?q=iModalJs
        hashPath: "!/",
        delay: 500
    });
}