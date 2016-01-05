;(function() {
    var libs = [

        "Za.jQuery",
        "Za_polyfill",
        "Za.EventListenerPattern",

    ];

    for (var i in libs)
        if (libs.hasOwnProperty(i))
            document.write('<script src="../../lib/' + libs[i] + '.js"></script>');

})();
