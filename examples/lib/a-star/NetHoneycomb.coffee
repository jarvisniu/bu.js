###*
# NetHoneycomb - a net consists of hexagons like a honeycomb.
# @param w - Width of the honeycomb net.
# @param h - Height of the honeycomb net.
# @constructor
###

AStar.NetHoneycomb = (w, h) ->
	@engine = null
	@nodes = []

	@width = 15 or w
	@height = 10 or h

	@startNode = null
	@endNode = null

	@setStart = (x, y) ->
		node = @getNode(x, y)
		@startNode = node

		node.state = AStar.NODE_STATE_START
		@engine.trigger 'nodeChanged', node.position
		return

	@setEnd = (x, y) ->
		node = @getNode(x, y)
		@endNode = node

		node.state = AStar.NODE_STATE_END
		@engine.trigger 'nodeChanged', node.position
		return

	@getNode = (x, y) ->
		@nodes[x] or= []
		if not @nodes[x][y]?
			@nodes[x][y] = new AStar.Node this
			@nodes[x][y].position.x = x
			@nodes[x][y].position.y = y
		@nodes[x][y]

	@getNeighboursOf = (node) ->
		return node.neighbours if node.neighbours?

		x = node.position.x
		y = node.position.y

		xFrom = x - 1
		xTo = x + 1
		yFrom = y - 1
		yTo = y + 1

		xFrom = 0 if xFrom < 0
		xFrom = @width - 1 if xFrom > @width - 1
		xTo = 0 if xTo < 0
		xTo = @width - 1 if xTo > @width - 1

		yFrom = 0 if yFrom < 0
		yFrom = @height - 1 if yFrom > @height - 1
		yTo = 0 if yTo < 0
		yTo = @height - 1 if yTo > @height - 1

		node.neighbours = []

		for i in [xFrom..xTo]
			for j in [yFrom..yTo]
				neighbour = @getNode(i, j)
				# not itself
				continue if i == x and j == y
				# not obstacle
				continue if neighbour.state == AStar.NODE_STATE_OBSTACLE
				continue if (i - x) * (j - y) > 0
				node.neighbours.push neighbour
		node.neighbours

	@calcShortestDistance = (node1, node2) ->
		dx = node1.position.x - (node2.position.x)
		dy = node1.position.y - (node2.position.y)
		if dx * dy < 0
			return Math.abs Math.abs(dx + dy) + Math.min(Math.abs(dx), Math.abs(dy))
		else
			return Math.abs dx + dy

	return this
