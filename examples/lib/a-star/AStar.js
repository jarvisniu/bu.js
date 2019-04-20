// A* path finding algorithm

window.AStar = {
  NODE_STATE_DEFAULT: 0,
  NODE_STATE_START: 1,
  NODE_STATE_END: 2,
  NODE_STATE_DETECTED: 11,
  NODE_STATE_REACHABLE: 21,
  NODE_STATE_SHORTEST: 22,
  NODE_STATE_OBSTACLE: 99,
}

// get preset color for each node state
AStar.getStateColor = function(state) {
  switch (state) {
    case AStar.NODE_STATE_DEFAULT:
      return '#AAA' // gray
    case AStar.NODE_STATE_START:
      return '#F88' // red
    case AStar.NODE_STATE_END:
      return '#4B4' // green
    case AStar.NODE_STATE_REACHABLE:
      return '#FC9' // orange
    case AStar.NODE_STATE_DETECTED:
      return '#FF8' // yellow
    case AStar.NODE_STATE_SHORTEST:
      return '#8BF' // blue
    case AStar.NODE_STATE_OBSTACLE:
      return '#222' // black
    default:
      return '#FFF' // white
  }
}
