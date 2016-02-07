###
# MicroJQuery - A micro version of jQuery
#
# Supported features:
#   $. - static methods
#     .ready(cb) - call the callback function after the page is loaded
#     .ajax([url,] options) - perform an ajax request
#   $(selector) - select element(s)
#     .on(type, callback) - add an event listener
#     .off(type, callback) - remove an event listener
#     .append(tagName) - append a tag
#     .text(text) - set the inner text
#     .html(htmlText) - set the inner HTML
#     .style(name, value) - set style (a css attribute)
#     #.css(object) - set styles (multiple css attribute)
#     .hasClass(className) - detect whether a class exists
#     .addClass(className) - add a class
#     .removeClass(className) - remove a class
#     .toggleClass(className) - toggle a class
#     .attr(name, value) - set an attribute
#     .hasAttr(name) - detect whether an attribute exists
#     .removeAttr(name) - remove an attribute
#   Notes:
#        # is planned but not implemented
###

((global) ->

	# selector
	global.$ = (selector) ->
		selections = []
		if typeof selector == 'string'
			selections = [].slice.call document.querySelectorAll selector
		jQuery.apply selections
		selections

	jQuery = ->

		# event

		@on = (type, callback) =>
			@each (dom) ->
				dom.addEventListener type, callback
			@

		@off = (type, callback) =>
			@each (dom) ->
				dom.removeEventListener type, callback
			@

		# DOM Manipulation

		SVG_TAGS = 'svg line rect circle ellipse polyline polygon path text'

		@append = (tag) =>
			@each (dom, i) =>
				tagIndex = SVG_TAGS.indexOf tag.toLowerCase()
				if tagIndex > -1
					newDom = document.createElementNS 'http://www.w3.org/2000/svg', tag
				else
					newDom = document.createElement tag
				@[i] = dom.appendChild newDom
			@

		@text = (str) =>
			@each (dom) ->
				dom.textContent = str
			@

		@html = (str) =>
			@each (dom) ->
				dom.innerHTML = str
			@

		@style = (name, value) =>
			@each (dom) ->
				styleText = dom.getAttribute 'style'
				styles = {}
				if styleText
					styleText.split(';').each (n) ->
						nv = n.split ':'
						styles[nv[0]] = nv[1]
				styles[name] = value
				# concat
				styleText = ''
				for i of styles
					styleText += i + ': ' + styles[i] + '; '
				dom.setAttribute 'style', styleText
			@

		@hasClass = (name) =>
			if @length == 0
				return false
			# if multiple, every DOM should have the class
			i = 0
			while i < @length
				classText = @[i].getAttribute 'class' or ''
				# not use ' ' to avoid multiple spaces like 'a   b'
				classes = classText.split RegExp ' +'
				if !classes.contains name
					return false
				i++
			@

		@addClass = (name) =>
			@each (dom) ->
				classText = dom.getAttribute 'class' or ''
				classes = classText.split RegExp ' +'
				if not classes.contains name
					classes.push name
					dom.setAttribute 'class', classes.join ' '
			@

		@removeClass = (name) =>
			@each (dom) ->
				classText = dom.getAttribute('class') or ''
				classes = classText.split RegExp ' +'
				if classes.contains name
					classes.remove name
					if classes.length > 0
						dom.setAttribute 'class', classes.join ' '
					else
						dom.removeAttribute 'class'
			@

		@toggleClass = (name) =>
			@each (dom) ->
				classText = dom.getAttribute 'class'  or ''
				classes = classText.split RegExp ' +'
				if classes.contains name
					classes.remove name
				else
					classes.push name
				if classes.length > 0
					dom.setAttribute 'class', classes.join ' '
				else
					dom.removeAttribute 'class'
			@

		# Not giving the attribute value means just add the attribute name
		# or clear the existing attribute value.
		# No, jQuery is to GET the value

		@attr = (name, value) =>
			value or= ''
			@each (dom) ->
				dom.setAttribute name, value
			@

		@hasAttr = (name) =>
			if @length == 0
				return false
			i = 0
			while i < @length
				if not @[i].hasAttribute name
					return false
				i++
			@

		@removeAttr = (name) =>
			@each (dom) ->
				dom.removeAttribute name
			@

	# $.ready()
	global.$.ready = (onLoad) ->
		document.addEventListener 'DOMContentLoaded', onLoad

	### $.ajax()
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
	###
	global.$.ajax = (url, ops) ->
		if !ops
			if typeof url == 'object'
				ops = url
				url = ops.url
			else
				ops = {}
		ops.method or= 'GET'
		ops.async = true unless ops.async?

		xhr = new XMLHttpRequest
		xhr.onreadystatechange = ->
			if xhr.readyState == 4
				if xhr.status == 200
					ops.success xhr.responseText, xhr.status, xhr if ops.success?
				else
					ops.error xhr, xhr.status if ops.error?
					ops.complete xhr, xhr.status if ops.complete?

		xhr.open ops.method, url, ops.async, ops.username, ops.password
		xhr.send null

) window or this
