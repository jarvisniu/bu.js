/*
 * A* computing engine
 *
 * Algorithm:
 *   1. Create a open list that contains the nodes that can be reached, initially only start node;
 *   2. Expand the list by adding neighbours of the node whose "f" is smallest;
 *   3. The neighbours must not in open list, closed list and not be obstacle;
 *   4. Move this node to the closed list;
 *   5. Calculate the "g", "h", "f" of the new added nodes;
 *   6. Resort the open list by "f";
 *   7. Loop from step 2 to 6 until the expanded nodes contains the end node or the open list is empty.
 *
 * Means of "g", "h", "f":
 *   1. g: distance that has gone
 *   2. h: shortest distance to the destination
 *   3. f: g + h
 *
 * API:
 *   finished: bool - Whether the algorithm is finished
 *   isRunning: bool - Whether the algorithm is running
 *   fps: bool - AutoStep speed
 *   result: Object - The result of resolving
 *     success: bool - Whether reach the end
 *     time: number - Elapsed time used to solve the process
 *     step: int - Steps used in the
 *   init() - Init the variables
 *   step() - Next step of solving
 *   run(fps) - Run the algorithm. If the parameter fps is given, the process will be animated.
 *
 *
 * Events:
 *   nodeChanged: a node state is changed, dedicated to refresh the UI
 *   finished: the algorithm is finished, no matter if success
 */

class Engine {
  constructor(net) {
    Bu.Event.apply(this)

    this._net = net

    this.finished = false
    this.isRunning = false

    this.fps = 10

    this.listOpen = []
    this.listClose = []

    this.nodeId = 0 // Add an id to every node for comparing when their "f" is equal: recent node is prior.

    this.startTime = 0
    this.stepCount = 0

    this.result = {}
  }

  init() {
    for (
      let i = 0, end = this._net.width, asc = 0 <= end;
      asc ? i <= end : i >= end;
      asc ? i++ : i--
    ) {
      for (
        let j = 0, end1 = this._net.height, asc1 = 0 <= end1;
        asc1 ? j <= end1 : j >= end1;
        asc1 ? j++ : j--
      ) {
        const node =
          this._net.nodes[i] != null ? this._net.nodes[i][j] : undefined
        if (node == null) {
          continue
        }
        if (
          node.state > AStar.NODE_STATE_END &&
          node.state < AStar.NODE_STATE_OBSTACLE
        ) {
          node.state = AStar.NODE_STATE_DEFAULT
        }
        node.prevNode = null
        node.neighbours = null
        this.trigger('nodeChanged', node.position)
      }
    }
    this.listOpen = []
    this.listClose = []

    this.stepCount = 0
    this.finished = false

    this._net.startNode.g = 0
    this._net.startNode.h = parseInt(
      this._net.calcShortestDistance(this._net.startNode, this._net.endNode),
    )
    this.trigger('nodeChanged', this._net.startNode.position)

    this.listOpen.push(this._net.startNode)
  }

  // run the engine by one step
  step() {
    if (!this.finished) {
      this._step()
    } else {
      console.log('It has been finished.')
    }
  }

  // run the engine all the way to finish
  run(fps) {
    if (fps != null) {
      this.fps = fps
    }
    if (!this.isRunning) {
      this.init()
      this.isRunning = true
      this.startTime = Date.now()
      if (fps) {
        this.autoStep()
      } else {
        while (!this.finished) {
          this._step()
        }
      }
    }
  }

  autoStep() {
    if (!this.finished) {
      this._step()
      setTimeout(this.autoStep.bind(this), 1000 / this.fps)
    }
  }

  _step() {
    const currentNode = this.listOpen.shift()
    if (currentNode == null) {
      this._end(false)
      return
    }

    if (currentNode.state !== AStar.NODE_STATE_START) {
      currentNode.state = AStar.NODE_STATE_DETECTED
      this.trigger('nodeChanged', currentNode.position)
    }

    this.listClose.push(currentNode)

    this.recalculateLastNode(currentNode)

    const neighbours = this._net.getNeighboursOf(currentNode)

    for (let i of Object.keys(neighbours || {})) {
      const neighbour = neighbours[i]

      if (this.listClose.indexOf(neighbour) > -1) {
      } else if (this.listOpen.indexOf(neighbour) > -1) {
      } else {
        neighbour.prevNode = currentNode
        neighbour.id = this.nodeId++

        if (neighbour.state !== AStar.NODE_STATE_END) {
          neighbour.state = AStar.NODE_STATE_REACHABLE
        }

        neighbour.g =
          currentNode.g + neighbour.calcShortestDistanceTo(currentNode)
        neighbour.h = neighbour.calcShortestDistanceTo(this._net.endNode)
        this.trigger('nodeChanged', neighbour.position)

        this.recalculateLastNode(neighbour)
        this.listOpen.push(neighbour)
      }
    }

    this.listOpen.sort(this.compareNodes)

    // detect end
    if (this.listOpen[0] === this._net.endNode) {
      this._net.endNode.state = AStar.NODE_STATE_END
      this.trigger('nodeChanged', this._net.endNode.position)

      this.traceShortestPath()
      this._end(true)
    }

    this.stepCount++
  }

  _end(success) {
    this.finished = true
    this.isRunning = false

    this.result.success = success
    this.result.time = Math.round(Date.now() - this.startTime) + 'ms'
    this.result.step = this.stepCount

    this.trigger('finished', this.result)
  }

  compareNodes(node1, node2) {
    let delta = node1.f() - node2.f()
    // without this step it will shows some random which seems stupid
    if (delta === 0) {
      delta = node2.id - node1.id
    }
    return delta
  }

  recalculateLastNode(node) {
    const neighbours = this._net.getNeighboursOf(node)

    // detect from its neighbours to see whether there is a nearer node to be its parent node
    for (let i of Object.keys(neighbours || {})) {
      const neighbour = neighbours[i]
      // reached nodes: start node, being reaching, has reached
      if (
        neighbour.state > AStar.NODE_STATE_DEFAULT &&
        neighbour.state < AStar.NODE_STATE_OBSTACLE &&
        neighbour.state !== AStar.NODE_STATE_END
      ) {
        const g0 = node.g
        const g1 = neighbour.g + node.calcShortestDistanceTo(neighbour)
        if (g0 > g1) {
          node.prevNode = neighbour
          node.g = g1
          this.trigger('nodeChanged', node.position)
        }
      }
    }
  }

  // trace the shortest path and change the state from DETECTED to SHORTEST
  traceShortestPath() {
    let middleNode = this._net.endNode.prevNode

    while (middleNode !== this._net.startNode) {
      middleNode.state = AStar.NODE_STATE_SHORTEST

      this.trigger('nodeChanged', middleNode.position)
      middleNode = middleNode.prevNode
    }
  }
}

AStar.Engine = Engine
