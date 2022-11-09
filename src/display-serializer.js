/* global AFRAME */
var tiltviz = tiltviz || {}

tiltviz.DisplaySerializer = function() {
  const api = {}


  function forEachEdgeComponent(entity, edgeHandler) {
    let edgeCount = 0
    Object.entries(entity.components).forEach(entry => {
      let [name, component] = entry
      const otherEdgesPrefix = 'edge__'
      console.log('component name, component: ', name, component)
      if (name === 'edge' || name.startsWith(otherEdgesPrefix)) {
        edgeHandler(component, edgeCount++)
      }
    })
  }

  api.toGraph = rootEl => {
    const nodes = []
    const edges = []

    let mainEntityFilter = el => el.components.geometry !== undefined;
    Array.from(rootEl.children).filter(mainEntityFilter).forEach(entity => {
      let position = entity.getAttribute('position');
      let id = entity.getAttribute('id');
      nodes.push({
        id: id,
        position: au.xyzTriplet(position)
      })
      forEachEdgeComponent(entity, (component, index) => {
        console.log('got edge component, index: ' + index)
        edges.push({
          from: id,
          to: component.data.to.getAttribute('id')
        })
      })
    })

    return {
      nodes: nodes,
      edges: edges
    }
  }

  return api
}