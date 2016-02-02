###
# A* computing engine
#
# Algorithm:
#   1. Create a open list that contains the nodes that can be reached, initially only start node;
#   2. Expand the list by adding neighbours of the node whose "f" is smallest;
#   3. The neighbours must not in open list, closed list and not be obstacle;
#   4. Move this node to the closed list;
#   5. Calculate the "g", "h", "f" of the new added nodes;
#   6. Resort the open list by "f";
#   7. Loop from step 2 to 6 until the expanded nodes contains the end node or the open list is empty.
#
# Means of "g", "h", "f":
#   1. g: distance that has gone
#   2. h: shortest distance to the destination
#   3. f: g + h
###

AStar.Engine = (net) ->
	Bu.Event.apply this

	self = this
	_net = net

	finished = false

	FPS = 10

	listOpen = []
	listClose = []

	nodeId = 0 # Add an id to every node for comparing when their "f" is equal: recent node is prior.
	stepCount = 0


	@noSolution = false
	@result = {} # compute result contains: consumed time and step etc. TODO not added the time and step

	init = ->
		listOpen = []
		listClose = []

		_net.startNode.g = 0
		_net.startNode.h = parseInt(_net.calcShortestDistance(_net.startNode, _net.endNode))
		self.trigger 'nodeChanged', _net.startNode.position

		listOpen.push _net.startNode

	# run the engine by one step
	@step = ->
		if !finished
			_step()
		else
			console.log 'It has been finished.'
		return

	# run the engine all the way to finish
	@run = (fps) ->
		FPS = fps or FPS
		if fps
			autoStep()
		else
			while !finished
				_step()
		return

	autoStep = ->
		if !finished
			_step()
			setTimeout autoStep, 1000 / FPS
		return

	_step = ->
		return if self.noSolution # TODO remove this line

		init() if listOpen.length == 0

		currentNode = listOpen.shift()

		if currentNode == undefined
			self.noSolution = true
			finished = true
			self.trigger 'finish', self.result
			self.trigger 'noSolution', self.result
			return

		if currentNode.state != AStar.NODE_STATE_START
			currentNode.state = AStar.NODE_STATE_DETECTED
			self.trigger 'nodeChanged', currentNode.position

		listClose.push currentNode

		recalculateLastNode currentNode

		neighbours = _net.getNeighboursOf(currentNode)

		for own i of neighbours
			neighbour = neighbours[i]

			if listClose.indexOf(neighbour) > -1
			else if listOpen.indexOf(neighbour) > -1
			else
				neighbour.prevNode = currentNode
				neighbour.id = nodeId++

				if neighbour.state != AStar.NODE_STATE_END
					neighbour.state = AStar.NODE_STATE_REACHABLE

				neighbour.g = currentNode.g + neighbour.calcShortestDistanceTo(currentNode)
				neighbour.h = neighbour.calcShortestDistanceTo(_net.endNode)
				self.trigger 'nodeChanged', neighbour.position

				recalculateLastNode neighbour
				listOpen.push neighbour

		listOpen.sort compareNodes

		# detect end
		if listOpen[0] == _net.endNode
			_net.endNode.state = AStar.NODE_STATE_END
			self.trigger 'nodeChanged', _net.endNode.position

			traceShortestPath()

			finished = true

			self.trigger 'finish', self.result
			self.trigger 'reachEnd', stepCount
		stepCount++
		return

	compareNodes = (node1, node2) ->
		delta = node1.f() - node2.f()
		# without this step it will shows some random which seems stupid
		delta = node2.id - (node1.id) if delta == 0
		return delta

	recalculateLastNode = (node) ->
		neighbours = _net.getNeighboursOf(node)

		# detect from its neighbours to see whether there is a nearer node to be its parent node
		for own i of neighbours
			neighbour = neighbours[i]
			# reached nodes: start node, being reaching, has reached
			if neighbour.state > AStar.NODE_STATE_DEFAULT and neighbour.state < AStar.NODE_STATE_OBSTACLE and neighbour.state != AStar.NODE_STATE_END

				g0 = node.g
				g1 = neighbour.g + node.calcShortestDistanceTo(neighbour)
				if g0 > g1
					node.prevNode = neighbour
					node.g = g1
					self.trigger 'nodeChanged', node.position
		return

	# trace the shortest path and change the state from DETECTED to SHORTEST
	traceShortestPath = ->
		middleNode = _net.endNode.prevNode
		count = 0

		while middleNode != _net.startNode and count < 100
			middleNode.state = AStar.NODE_STATE_SHORTEST

			self.trigger 'nodeChanged', middleNode.position
			middleNode = middleNode.prevNode

			count++
		return

	return
