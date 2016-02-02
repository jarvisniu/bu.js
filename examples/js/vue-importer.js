/**
 * A tool for importing(loading) the .vue components in the browser.
 *
 * This is an alternative to vue-loader which is a loader(plugin) for webpack.
 * Here are some reasons I don't want to use vue-loader:
 *   1. Not friendly to novice(like me): need install and config webpack;
 *   2. The npm dependencies are too large: over 10k files;
 *   3. Not static, must be pre-compiled on the server.
 *
 * And here are the lack compare to vue-loader:
 *   1. Not support dialects like Jade, CoffeeScript, Stylus etc.
 *   2. Not support other tag attributes like `scoped`
 *
 * TODOs
 *   1. If <template> tag is not exist, regard it in the script and skip the insert operation.
 *
 * @author Jarvis Niu - https://github.com/jarvisniu
 * @param { Array } components - The filename of .vue components without .vue extension
 * @param { Function } callback - The callback function when all the components loaded.
 * @param { Object } options - Optional arguments
 * @option { String } path - Where the .vue components located, default by './vue/'
 */

var VueImporter = {};

VueImporter.load = function (components, callback, options) {

    var self = this;
    this.count = 0;
    this.onLoad = callback;
    options = options || {};
    var componentPath = './vue/' || options.path;
    var globalName = '_VueImporterTemp_';  //

    init();

    function init() {
        for (var i = 0; i < components.length; i++) {
            loadComp(components[i])
        }
    }

    function ajax(url, onLoad, onError) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    onLoad.call(null, xhr.responseText)
                } else {
                    onError.call(null, xhr.status)
                }
            }
        };
        xhr.open("GET", url, true);
        xhr.send(null)
    }

    function loadComp(name) {
        ajax(componentPath + name + '.vue', function(text) {
            Vue.component(name, parseComponent(text));
            self.count ++;
            if (self.count == components.length) {
                self.onLoad.call();
            }
        }, function(status) {
            console.error('Vue-importer load error, status code: ' + status);
        })
    }

    // parse a vue component
    function parseComponent(text) {
        var styleText = getContent(text, '<style>', '</style>');
        var templateText = getContent(text, '<template>', '</template>');
        var scriptText = getContent(text, '<script>', '</script>');
        scriptText = globalName + '= {' + getContent(scriptText, '{', '}') + '}';
        var script = eval(scriptText);
        script.template = templateText;
        // insert style
        var style = document.createElement('style');
        style.innerText = styleText;
        document.head.appendChild(style);
        return script;
    }

    function getContent(text, start, end) {
        var indexStart = text.indexOf(start);
        var indexEnd = text.lastIndexOf(end);
        if (indexStart < indexEnd) {
            return text.substring(indexStart + start.length, indexEnd)
        } else {
            return ''
        }
    }

};
