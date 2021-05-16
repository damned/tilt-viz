/* global AFRAME boxes aframeUtils */
var chai = chai || {}
var expect = chai.expect
let au = aframeUtils

describe('aframe utils', () => {
  const aframeContainer = document.getElementById('aframe-container')

  let getScene = () => aframeContainer.querySelector('a-scene')
  let scene
  let inScene = (handler) => scene.addEventListener('renderstart', () => {
    handler(scene)
  })
  
  let addToScene = html => scene.insertAdjacentHTML('afterbegin', html)
  let select = selector => document.querySelector(selector)
  
  beforeEach(() => {
    aframeContainer.innerHTML = '<a-scene embedded style="height: 300px; width: 600px;"></a-scene>'
    scene = getScene()
  })

  describe('world-space utils', () => {

    describe('top()', () => {
      it('should get the world y position of the top of a unit box at origin', (done) => {
        inScene(scene => {
          addToScene('<a-box>')
          au.tick(() => {
            expect(au.world.top(select('a-box'))).to.equal(0.5)
            done()
          })
        })
      })
    
      it('should get the top of a unit box at some height', (done) => {
        inScene(scene => {
          addToScene('<a-box position="0 2 0">')
          au.tick(() => {
            expect(au.world.top(select('a-box'))).to.equal(2.5)
            done()
          })
        })
      })

      it('should get the top of a unit box at origin within an entity at some height', (done) => {
        inScene(scene => {
          addToScene('<a-entity position="0 3 -3"><a-box></a-entity>')
          au.tick(() => {
            expect(au.world.top(select('a-box'))).to.equal(3.5)
            done()
          })
        })
      })

      it('should get the top of a half height box at origin within an entity at some height', (done) => {
        inScene(scene => {
          addToScene('<a-entity position="0 3 -3"><a-box height="0.5"></a-entity>')
          au.tick(() => {
            expect(au.world.top(select('a-box'))).to.equal(3.25)
            done()
          })
        })
      })

      it('should get the top of a unit box at origin within a scaled entity at some height', (done) => {
        inScene(scene => {
          addToScene('<a-entity position="0 3 -3" scale="2 2 2"><a-box></a-entity>')
          au.tick(() => {
            expect(au.world.top(select('a-box'))).to.equal(4)
            done()
          })
        })
      })

      it('should get the top of a unit box at a non-zero height within an entity at some height', (done) => {
        inScene(scene => {
          addToScene('<a-entity position="0 3 -3"><a-box position="2 2 2"></a-entity>')
          au.tick(() => {
            expect(au.world.top(select('a-box'))).to.equal(5.5)
            done()
          })
        })
      })
    })
    
    describe('bottom()', () => {
      it('should get the world y position of the bottom of a unit box at origin', (done) => {
        inScene(scene => {
          addToScene('<a-box>')
          au.tick(() => {
            expect(au.world.bottom(select('a-box'))).to.equal(-0.5)
            done()
          })
        })
      })
    
      it('should get the bottom of a unit box at some height', (done) => {
        inScene(scene => {
          addToScene('<a-box position="0 2 0">')
          au.tick(() => {
            expect(au.world.bottom(select('a-box'))).to.equal(1.5)
            done()
          })
        })
      })

      it('should get the bottom of a unit box at origin within an entity at some height', (done) => {
        inScene(scene => {
          addToScene('<a-entity position="0 3 -3"><a-box></a-entity>')
          au.tick(() => {
            expect(au.world.bottom(select('a-box'))).to.equal(2.5)
            done()
          })
        })
      })

      it('should get the bottom of a half height box at origin within an entity at some height', (done) => {
        inScene(scene => {
          addToScene('<a-entity position="0 3 -3"><a-box height="0.5"></a-entity>')
          au.tick(() => {
            expect(au.world.bottom(select('a-box'))).to.equal(2.75)
            done()
          })
        })
      })

      it('should get the bottom of a unit box at origin within a scaled entity at some height', (done) => {
        inScene(scene => {
          addToScene('<a-entity position="0 3 -3" scale="2 2 2"><a-box></a-entity>')
          au.tick(() => {
            expect(au.world.bottom(select('a-box'))).to.equal(2)
            done()
          })
        })
      })

      it('should get the bottom of a unit box at a non-zero height within an entity at some height', (done) => {
        inScene(scene => {
          addToScene('<a-entity position="0 3 -3"><a-box position="2 2 2"></a-entity>')
          au.tick(() => {
            expect(au.world.bottom(select('a-box'))).to.equal(4.5)
            done()
          })
        })
      })
    })

  })
})