
var Panel = function(name, parent) {
  let api = {}
  
  let el = document.createElement('a-box')
  el.setAttribute('id', name)
  el.setAttribute('height', 0.1)

  api.el = el
  
  return api
}

var Board = function(name, parent) {
  let api = {}
  
  let el = document.createElement('a-box')
  el.setAttribute('id', name)
  el.setAttribute('height', 0.1)
  
  api.panel = (panelName) => {
    let panel = Panel(panelName)
    parent.appendChild(panel.el)
    return panel
  }
  
  api.el = el

  return api
}

var Model = function(foundationEl) {
  let self = this
  let api = {}
  
  api.board = function(name) {
    let board = Board(name, foundationEl)
    foundationEl.appendChild(board.el)
    return board
  }
  
  return api
}