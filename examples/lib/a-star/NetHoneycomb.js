/**
 * NetHoneycomb - a net consists of hexagons like a honeycomb.
 */

class NetHoneycomb {
  constructor(w, h) {
    this.engine = null
    this.nodes = []

    this.width = w || 15
    this.height = h || 10

    this.startNode = null
    this.endNode = null
  }

  setStart(x, y) {
    const node = this.getNode(x, y)
    if (node.state !== AStar.NODE_STATE_DEFAULT) {
      return
    }
    if (this.startNode != null) {
      if (this.startNode.position.x === x && this.startNode.position.y === y) {
        return
      }
      this.startNode.state = AStar.NODE_STATE_DEFAULT
      this.engine.trigger('nodeChanged', this.startNode.position)
    }

    this.startNode = node

    node.state = AStar.NODE_STATE_START
    this.engine.trigger('nodeChanged', node.position)
  }

  setEnd(x, y) {
    const node = this.getNode(x, y)
    if (node.state !== AStar.NODE_STATE_DEFAULT) {
      return
    }
    if (this.endNode != null) {
      if (this.endNode.position.x === x && this.endNode.position.y === y) {
        return
      }
      this.endNode.state = AStar.NODE_STATE_DEFAULT
      this.engine.trigger('nodeChanged', this.endNode.position)
    }

    this.endNode = node

    node.state = AStar.NODE_STATE_END
    this.engine.trigger('nodeChanged', node.position)
  }

  getNode(x, y) {
    if (!this.nodes[x]) {
      this.nodes[x] = []
    }
    if (this.nodes[x][y] == null) {
      this.nodes[x][y] = new AStar.Node(this)
      this.nodes[x][y].position.x = x
      this.nodes[x][y].position.y = y
    }
    return this.nodes[x][y]
  }

  getNeighboursOf(node) {
    if (node.neighbours != null) {
      return node.neighbours
    }

    const { x } = node.position
    const { y } = node.position

    let xFrom = x - 1
    let xTo = x + 1
    let yFrom = y - 1
    let yTo = y + 1

    // todo use clamp
    if (xFrom < 0) {
      xFrom = 0
    }
    if (xFrom > this.width - 1) {
      xFrom = this.width - 1
    }
    if (xTo < 0) {
      xTo = 0
    }
    if (xTo > this.width - 1) {
      xTo = this.width - 1
    }

    if (yFrom < 0) {
      yFrom = 0
    }
    if (yFrom > this.height - 1) {
      yFrom = this.height - 1
    }
    if (yTo < 0) {
      yTo = 0
    }
    if (yTo > this.height - 1) {
      yTo = this.height - 1
    }

    node.neighbours = []

    for (
      let i = xFrom, end = xTo, asc = xFrom <= end;
      asc ? i <= end : i >= end;
      asc ? i++ : i--
    ) {
      for (
        let j = yFrom, end1 = yTo, asc1 = yFrom <= end1;
        asc1 ? j <= end1 : j >= end1;
        asc1 ? j++ : j--
      ) {
        const neighbour = this.getNode(i, j)
        // not itself
        if (i === x && j === y) {
          continue
        }
        // not obstacle
        if (neighbour.state === AStar.NODE_STATE_OBSTACLE) {
          continue
        }
        if ((i - x) * (j - y) > 0) {
          continue
        }
        node.neighbours.push(neighbour)
      }
    }
    return node.neighbours
  }

  calcShortestDistance(node1, node2) {
    const dx = node1.position.x - node2.position.x
    const dy = node1.position.y - node2.position.y
    if (dx * dy < 0) {
      return Math.abs(Math.abs(dx + dy) + Math.min(Math.abs(dx), Math.abs(dy)))
    } else {
      return Math.abs(dx + dy)
    }
  }
}

AStar.NetHoneycomb = NetHoneycomb
