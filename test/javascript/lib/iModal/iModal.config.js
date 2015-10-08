if (define && define.samd && define.$config) {
    define.$config({
        sites: {pages: "javascript/pages/", widget: "javascript/widget/", components: "javascript/components/"},
        paths: {notify: "components!notify/notify"}
    })
}