/* global THREE aframeUtils */
const propertyValueForClass = (styles, classname, propertyname) => {
  let match = styles.find(style => style.selector.class == classname)
  if (match !== undefined) {
    let value = match.declaration[propertyname]
    au.log('property value', value)
    return value
  }
  return null
}

var au = aframeUtils

var Panel = function(name, base) {
  let self = {}  
  
  self.render = (base, styles) => {
    let height = propertyValueForClass(styles, 'panel', 'height') || 0.1
    let halfHeight = height / 2
    au.log('half height', halfHeight)
    let el = document.createElement('a-box')
    el.setAttribute('id', name)
    el.setAttribute('class', 'panel')
    el.setAttribute('color', 'pink')
    el.setAttribute('height', height)
    el.setAttribute('placement', `on: #${base.id()}`)
    self.el = el
    base.el.parentNode.appendChild(el)
    return el
  }
  
  return self
}

var Board = function(name, type) {
  const self = {}

  let children = []
  
  self.panel = (panelName) => {
    let panel = Panel(panelName, self)
    children.push(panel)
    return panel
  }
  
  const renderSelf = (parent, styles) => {
    let height = propertyValueForClass(styles, type, 'height') || 0.1
    let halfHeight = height / 2
    self.halfHeight = halfHeight

    let el = document.createElement('a-box')
    el.setAttribute('id', name)
    el.setAttribute('class', type)
    el.setAttribute('color', 'blue')
    el.setAttribute('height', '' + height)
    el.setAttribute('placement', `on: #${parent.id}`)
    return el
  }
  
  self.render = (base, styles) => {
    self.el = renderSelf(base, styles)
    base.sceneEl.appendChild(self.el)
    
    children.forEach(child => {
      child.render(self, styles)
    })
    return self.el
  }
  
  self.id = () => self.el.id
  
  return self
}

var Model = function() {
  let self = {}
  
  let board
  
  self.board = (name) => {
    board = Board(name, 'board')
    return board
  }
  
  self.render = (baseEl, styles) => {
    board.render(baseEl, styles)
  }
  
  return self
}