/*
 * A* Node
 */

class Node {
  constructor(net) {
    this.net = net
    this.state = AStar.NODE_STATE_DEFAULT // node state flag
    this.g = -1 // distance has gone
    this.h = -1 // shortest distance to the end
    this.id = -1 // indicate the appearance order
    this.position = {} // node position such as (x, y) or (x, y, z) it's used by Net
    this.neighbours = null // reachable neighbour nodes, provide by the Net
    this.prevNode = null // The last node in the start node direction
  }

  f() {
    return this.g + this.h
  }

  getNeighbours() {
    return this.net.getNeighboursOf(this)
  }

  calcShortestDistanceTo(node) {
    return this.net.calcShortestDistance(this, node)
  }
}

AStar.Node = Node
