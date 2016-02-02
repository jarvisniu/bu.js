# concat-tool - https://github.com/jarvisniu/concat-tool

fs = require 'fs'
path = require 'path'

configFile = 'concat-tool.json'

concatVersion = (verName) ->
	filename = verName + config.ext
	console.log 'Processing: ' + filename + ' ...'

	text = commentMark + ' ' + filename + '\n'
	text += commentMark + ' Generated: ' + new Date().toLocaleString() + '\n\n'
	for fname in config.versions[verName]
		fname = fname.trim()
		if fname.length > 0
			text += commentMark + ' File: ' + fname + config.ext + '\n\n'
			text += fs.readFileSync (path.join config.src, fname + config.ext), "utf-8"
			text += '\n'
	fs.writeFileSync (path.join config.des, filename), text, {flag: "w"}

configFile = path.join __dirname, configFile
if not fs.existsSync configFile
	console.log "Error: config file not found: " + configFile
	return

config = JSON.parse (fs.readFileSync configFile, 'utf-8')

commentMark = switch config.ext.toLowerCase()
	when '.coffee', '.py', '.rb' # CoffeeScript, Python, Ruby
		'#'
	when '.lua' # Lua
		'--'
	else # JavaScript
		'//'

if not fs.existsSync config.src
	console.log "Error: source dir not exists: " + path.join __dirname, config.src
else
	verNames = Object.keys config.versions
	console.log 'Contating started. \n' +
			"There are #{verNames.length} versions: #{ verNames }"

	fs.mkdirSync config.des unless fs.existsSync config.des
	for verName in verNames
		concatVersion verName
	console.log 'Contating completed.'
