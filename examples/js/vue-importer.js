/*
 * Import vue components without webpack
 * 缺点：不支持大写标签，不支持方言，不支持其他属性
 * TODO 如果没有template标签则忽略，认为已经在script内
 */

function VueInit(components, callback) {

    var self = this;
    this.count = 0;
    this.onLoad = callback;
    var componentPath = './vue/';

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
            // console.log(name);
            Vue.component(name, parseComponent(text));
            self.count ++;
            if (self.count == components.length) {
                self.onLoad.call();
            }
        }, function(status) {
            alert('Vue-importer: load error, status code = ' + status);
        })
    }

    // parse a vue component
    function parseComponent(text) {
        var styleText = getContent(text, '<style>', '</style>');
        var templateText = getContent(text, '<template>', '</template>');
        var scriptText = getContent(text, '<script>', '</script>');
        scriptText = '_tmp_={' + getContent(scriptText, '{', '}') + '}';
        var script = eval(scriptText);
        script.template = templateText;
        // insert style
        var style = document.createElement('style');
        style.innerText = styleText;
        document.head.appendChild(style);
        // console.log(script);
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

}
