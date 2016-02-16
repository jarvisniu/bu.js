###
# a static web server on node.js
###

# modules
http = require 'http'
fs = require 'fs'
path = require 'path'

# server config
address = '127.0.0.1'
port = 8080
indexPageName = 'index.html'

# shortcuts
cwd = require('process').cwd()

responsers =
    'entry': (req, res) ->
        console.log 'request: ' + path.join cwd, req.url
        responsers['detectFolder'] req, res

    'detectFolder': (req, res) ->        
        if req.url.charAt(req.url.length - 1) == '/'
            responsers['folder'] req, res
        else
            responsers['detectExists'] req, res

    'folder': (req, res) ->
        req.url += indexPageName
        responsers['detectExists'] req, res

    'detectExists': (req, res) ->
        pathname = path.join cwd, req.url
        fs.exists pathname, (exists) ->
            if exists
                responsers['exists'] req, res, pathname
            else
                responsers['notFound'] req, res

    'exists': (req, res, pathname) ->
        if fs.statSync(pathname).isFile()
            responsers['page'] req, res, pathname
        else
            responsers['folderRedirect'] req, res

    'page': (req, res, pathname) ->
        res.writeHead 200,
            'Content-Type': mime pathname
        fs.readFile pathname, (err, data) ->
            res.end data

    'folderRedirect': (req, res) ->
        res.writeHead 302,
            'location': req.url + '/'
        res.end ''

    'notFound': (req, res) ->
        res.writeHead 404,
            'Content-Type': 'text/html'
        res.end '<h1>404 Page Not Found</h1>'

mime = (pathname) ->
    ext = path.extname pathname
    return switch ext
        # web
        when '.html', '.htm' then 'text/html'
        when '.js' then 'text/javascript'
        when '.css' then 'text/css'
        # data
        when '.json' then 'application/json'
        # image
        when '.jpg', 'jpeg' then 'image/jpeg'
        when '.png' then 'image/png'
        when '.gif' then 'image/gif'
        when '.ico' then 'image/x-icon'
        # audio
        when '.midi' then 'audio/midi'
        when '.png' then 'image/png'
        when '.gif' then 'image/gif'
        # doc
        when '.txt', '.md' then 'text/plain'
        when '.pdf' then 'application/pdf'
        # code
        when '.coffee', '.java', '.lua', '.py', '.ruby' then 'text/plain'
        # binary
        else 'application/octet-stream'

server = http.createServer responsers['entry']
server.listen port, address
console.log 'Server started on ' + address + ':' + port
