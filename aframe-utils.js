/* global THREE arguments */
var aframeUtils = aframeUtils || {}

aframeUtils.tick = fn => {
  setTimeout(() => {
    fn()
  }, 50)  
}
aframeUtils.doubleTick = handler => aframeUtils.tick(() => {
  aframeUtils.tick(() => {
    handler()
  })
})
aframeUtils.afterCreation = aframeUtils.tick

aframeUtils.world = {}
aframeUtils.world.bounds = el => {
  let mesh = el.getObject3D('mesh')
  mesh.updateMatrix(); 
  mesh.geometry.applyMatrix4(mesh.matrix);
  let bbox = new THREE.Box3().setFromObject(mesh);
  return bbox
}
aframeUtils.world.height = el => {
  let bbox = aframeUtils.world.bounds(el)
  return bbox.max.y - bbox.min.y
}
aframeUtils.world.top = el => aframeUtils.world.bounds(el).max.y
aframeUtils.world.bottom = el => aframeUtils.world.bounds(el).min.y

aframeUtils.xyzTriplet = xyz => `${xyz.x} ${xyz.y} ${xyz.z}`


aframeUtils.catching = (fn) => {
  try {
    fn();
  } catch (e) {
    console.log("caught exception in catching", e);
  }
}

aframeUtils.log = () => {
  console.log.apply(this, ...arguments)
}