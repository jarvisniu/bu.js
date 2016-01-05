
(function(global) {
    function jQuery() {
        var doms = this;

        this.text = function (str) {
            doms.each(function(dom) {
                dom.textContent = str;
            });
            return this;
        };

        this.html = function (str) {
            doms.each(function(dom) {
                dom.innerHTML = str;
            });
            return this;
        };

        // == DOM ==
        // this.style

        // this.hasClass
        // this.addClass
        // this.toggleClass
        // this.removeClass

        // this.attr
        // this.hasAttr
        // this.removeAttr

        // this.append

        this.style = function (name, value) {
            doms.each(function(dom) {
                var styleText = dom.getAttribute('style');
                var styles = {};
                if (styleText) {
                    styleText.split(';').each(function(n) {
                        var nv = n.split(':');
                        styles[nv[0]] = nv[1];
                    });
                }
                styles[name] = value;
                // concat
                styleText = '';
                for (var i in styles) {
                    styleText += i + ': ' + styles[i] + '; ';
                }
                dom.setAttribute('style', styleText);
            });
            return this;
        };

        this.hasClass = function (name) {
            if (doms.length == 0) return false;

            // if multiple, every DOM should have the class
            for (var i = 0; i < doms.length; i++) {
                var classText = doms[i].getAttribute('class') || '';
                // not use ' ' to avoid multiple spaces like 'a   b'
                var classes = classText.split(/ +/);
                if (!classes.contains(name)) {
                    return false;
                }
            };
            return true;
        };

        this.toggleClass = function (name) {
            doms.each(function(dom) {
                var classText = dom.getAttribute('class') || '';
                var classes = classText.split(/ +/);
                if (classes.contains(name)) {
                    classes.remove(name);
                } else {
                    classes.push(name);
                }
                if (classes.length > 0)
                    dom.setAttribute('class', classes.join(' '));
                else
                    dom.removeAttribute('class');
            });
            return this;
        };

        this.addClass = function (name) {
            doms.each(function(dom) {
                var classText = dom.getAttribute('class') || '';
                var classes = classText.split(/ +/);
                if (!classes.contains(name)) {
                    classes.push(name);
                    dom.setAttribute('class', classes.join(' '));
                }
            });
            return this;
        };

        this.removeClass = function (name) {
            doms.each(function(dom) {
                var classText = dom.getAttribute('class') || '';
                var classes = classText.split(/ +/);
                if (classes.contains(name)) {
                    classes.remove(name);
                    if (classes.length > 0)
                        dom.setAttribute('class', classes.join(' '));
                    else
                        dom.removeAttribute('class');
                }
            });
            return this;
        };

        // Not giving the attribute value means just add the attribute name
        // or clear the existing attribute value.
        // No, jQuery is to GET the value
        this.attr = function (name, value) {
            value = value || "";
            doms.each(function(dom) {
                dom.setAttribute(name, value);
            });
            return this;
        };

        this.hasAttr = function (name) {
            if (doms.length == 0) return false;

            for (var i = 0; i < doms.length; i++) {
                if (!doms[i].hasAttribute(name))
                    return false;
            }
            return true;
        };

        this.removeAttr = function (name) {
            doms.each(function(dom) {
                dom.removeAttribute(name);
            });
            return this;
        };

        // append
        var SVG_TAGS = "svg line rect circle ellipse polyline polygon path text";
        this.append = function (tag) {
            doms.each(function(dom, i) {
                var newDom;
                if (SVG_TAGS.indexOf(tag.toLowerCase()) > -1)
                    newDom = document.createElementNS('http://www.w3.org/2000/svg', tag);
                else
                    newDom = document.createElement(tag);
                doms[i] = dom.appendChild(newDom);
            });
            return this;
        };

        // == Events ==
        // on("click", function(e) {  });

        this.on = function (type, callback) {
            doms.each(function(dom) {
                dom.addEventListener(type, callback);
            });
            return this;
        };
        this.off = function (type, callback) {
            doms.each(function(dom) {
                dom.removeEventListener(type, callback);
            });
            return this;
        }
    };

    global.$ = function(selector) {
        var selections = [];

        if (typeof(selector) === 'string') {
            selections = [].slice.call(document.querySelectorAll(selector));
        }

        jQuery.apply(selections);

        return selections;
    };
    
    // $.ready()
    global.$.ready = function(onLoad) {
        document.addEventListener("DOMContentLoaded", onLoad);
    };

    /* $.ajax()
        options:
            url: string
            ====
            async = true: bool
            ## data: object - query parameters TODO: implement this
            method = GET: POST, PUT, DELETE, HEAD
            username: string
            password: string
            success: function
            error: function
            complete: function
    */
    global.$.ajax = function(url, ops) {
        if (!ops) {
            if (typeof(url) == "object") {
                ops = url;
                url = ops.url;
            } else {
                ops = {};
            }
        }
        
        ops.method = ops.method || "GET";
        if (ops.async === undefined) ops.async = true;

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    if (!!ops.success) ops.success(xhr.responseText, xhr.status, xhr);
                } else {
                    if (!!ops.error) ops.error(xhr, xhr.status);
                }
                if (!!ops.complete) ops.complete(xhr, xhr.status);
            }
        };
        xhr.open(ops.method, url, ops.async, ops.username, ops.password);
        xhr.send(null);
    };
})(window || this);
