((global) ->

	jQuery = ->
		doms = this

		@text = (str) ->
			doms.each (dom) ->
				dom.textContent = str
				return
			this

		@html = (str) ->
			doms.each (dom) ->
				dom.innerHTML = str
				return
			this

		# == DOM ==
		# this.style
		# this.css( { name: value } )
		# this.hasClass
		# this.addClass
		# this.toggleClass
		# this.removeClass
		# this.attr
		# this.hasAttr
		# this.removeAttr
		# this.append

		@style = (name, value) ->
			doms.each (dom) ->
				styleText = dom.getAttribute('style')
				styles = {}
				if styleText
					styleText.split(';').each (n) ->
						nv = n.split(':')
						styles[nv[0]] = nv[1]
						return
				styles[name] = value
				# concat
				styleText = ''
				for i of styles
					styleText += i + ': ' + styles[i] + '; '
				dom.setAttribute 'style', styleText
				return
			this

		@hasClass = (name) ->
			if doms.length == 0
				return false
			# if multiple, every DOM should have the class
			i = 0
			while i < doms.length
				classText = doms[i].getAttribute('class') or ''
				# not use ' ' to avoid multiple spaces like 'a   b'
				classes = classText.split(RegExp(' +'))
				if !classes.contains(name)
					return false
				i++
			true

		@toggleClass = (name) ->
			doms.each (dom) ->
				classText = dom.getAttribute('class') or ''
				classes = classText.split(RegExp(' +'))
				if classes.contains(name)
					classes.remove name
				else
					classes.push name
				if classes.length > 0
					dom.setAttribute 'class', classes.join(' ')
				else
					dom.removeAttribute 'class'
				return
			this

		@addClass = (name) ->
			doms.each (dom) ->
				classText = dom.getAttribute('class') or ''
				classes = classText.split(RegExp(' +'))
				if !classes.contains(name)
					classes.push name
					dom.setAttribute 'class', classes.join(' ')
				return
			this

		@removeClass = (name) ->
			doms.each (dom) ->
				classText = dom.getAttribute('class') or ''
				classes = classText.split(RegExp(' +'))
				if classes.contains(name)
					classes.remove name
					if classes.length > 0
						dom.setAttribute 'class', classes.join(' ')
					else
						dom.removeAttribute 'class'
				return
			this

		# Not giving the attribute value means just add the attribute name
		# or clear the existing attribute value.
		# No, jQuery is to GET the value

		@attr = (name, value) ->
			value = value or ''
			doms.each (dom) ->
				dom.setAttribute name, value
				return
			this

		@hasAttr = (name) ->
			if doms.length == 0
				return false
			i = 0
			while i < doms.length
				if !doms[i].hasAttribute(name)
					return false
				i++
			true

		@removeAttr = (name) ->
			doms.each (dom) ->
				dom.removeAttribute name
				return
			this

		# append
		SVG_TAGS = 'svg line rect circle ellipse polyline polygon path text'

		@append = (tag) ->
			doms.each (dom, i) ->
				newDom = undefined
				if SVG_TAGS.indexOf(tag.toLowerCase()) > -1
					newDom = document.createElementNS('http://www.w3.org/2000/svg', tag)
				else
					newDom = document.createElement(tag)
				doms[i] = dom.appendChild(newDom)
				return
			this

		# event

		@on = (type, callback) ->
			doms.each (dom) ->
				dom.addEventListener type, callback
				return
			this

		@off = (type, callback) ->
			doms.each (dom) ->
				dom.removeEventListener type, callback
				return
			this

		return

	global.$ = (selector) ->
		selections = []
		if typeof selector == 'string'
			selections = [].slice.call(document.querySelectorAll(selector))
		jQuery.apply selections
		selections

	# $.ready()

	global.$.ready = (onLoad) ->
		document.addEventListener 'DOMContentLoaded', onLoad
		return

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
		ops.method = ops.method or 'GET'
		if ops.async == undefined
			ops.async = true
		xhr = new XMLHttpRequest

		xhr.onreadystatechange = ->
			if xhr.readyState == 4
				if xhr.status == 200
					if ! !ops.success
						ops.success xhr.responseText, xhr.status, xhr
				else
					if ! !ops.error
						ops.error xhr, xhr.status
				if ! !ops.complete
					ops.complete xhr, xhr.status
			return

		xhr.open ops.method, url, ops.async, ops.username, ops.password
		xhr.send null
		return

	return
) window or this