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
#
# API:
#   finished: bool - Whether the algorithm is finished
#   isRunning: bool - Whether the algorithm is running
#   fps: bool - AutoStep speed
#   result: Object - The result of resolving
#     success: bool - Whether reach the end
#     time: number - Elapsed time used to solve the process
#     step: int - Steps used in the
#   init() - Init the variables
#   step() - Next step of solving
#   run(fps) - Run the algorithm. If the parameter fps is given, the process will be animated.
#
#
# Events:
#   nodeChanged: a node state is changed, dedicated to refresh the UI
#   finished: the algorithm is finished, no matter if success
###

class AStar.Engine

	constructor: (net) ->
		Bu.Event.apply this

		_net = net

		@finished = false
		@isRunning = false

		@fps = 10

		listOpen = []
		listClose = []

		nodeId = 0 # Add an id to every node for comparing when their "f" is equal: recent node is prior.

		startTime = 0
		stepCount = 0

		@result = {}

		@init = =>
			listOpen = []
			listClose = []

			stepCount = 0

			_net.startNode.g = 0
			_net.startNode.h = parseInt(_net.calcShortestDistance(_net.startNode, _net.endNode))
			@trigger 'nodeChanged', _net.startNode.position

			listOpen.push _net.startNode

		# run the engine by one step
		@step = =>
			if !@finished
				_step()
			else
				console.log 'It has been finished.'

		# run the engine all the way to finish
		@run = (fps) =>
			@fps = fps if fps?
			if not @isRunning
				@init()
				@isRunning = true
				startTime = Date.now()
				if fps
					autoStep()
				else
					while not @finished
						_step()

		autoStep = =>
			if not @finished
				_step()
				setTimeout autoStep, 1000 / @fps

		_step = =>
			currentNode = listOpen.shift()
			if not currentNode?
				_end false
				return

			if currentNode.state != AStar.NODE_STATE_START
				currentNode.state = AStar.NODE_STATE_DETECTED
				@trigger 'nodeChanged', currentNode.position

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
					@trigger 'nodeChanged', neighbour.position

					recalculateLastNode neighbour
					listOpen.push neighbour

			listOpen.sort compareNodes

			# detect end
			if listOpen[0] == _net.endNode
				_net.endNode.state = AStar.NODE_STATE_END
				@trigger 'nodeChanged', _net.endNode.position

				traceShortestPath()
				_end true

			stepCount++

		_end = (success) =>
			@finished = true
			@isRunning = false

			@result.success = success
			@result.time = Math.round(Date.now() - startTime) + 'ms'
			@result.step = stepCount

			@trigger 'finished', @result


		compareNodes = (node1, node2) ->
			delta = node1.f() - node2.f()
			# without this step it will shows some random which seems stupid
			delta = node2.id - (node1.id) if delta == 0
			return delta

		recalculateLastNode = (node) =>
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
						@trigger 'nodeChanged', node.position

		# trace the shortest path and change the state from DETECTED to SHORTEST
		traceShortestPath = =>
			middleNode = _net.endNode.prevNode

			while middleNode != _net.startNode
				middleNode.state = AStar.NODE_STATE_SHORTEST

				@trigger 'nodeChanged', middleNode.position
				middleNode = middleNode.prevNode
