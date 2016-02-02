###
# A* Node
###

AStar.Node = (@net) ->
	@state = AStar.NODE_STATE_DEFAULT # node state flag
	@g = -1 # distance has gone
	@h = -1 # shortest distance to the end
	@id = -1 # indicate the appearance order
	@position = {} # node position such as (x, y) or (x, y, z) it's used by Net
	@neighbours = null # reachable neighbour nodes, provide by the Net
	@prevNode = null # The last node in the start node direction

AStar.Node.prototype =
	f: ->
		@g + @h
	getNeighbours: ->
		@net.getNeighboursOf this
	calcShortestDistanceTo: (node) ->
		@net.calcShortestDistance this, node
