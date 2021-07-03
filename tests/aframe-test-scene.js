/* global au THREE */

var aframeTestScene = function(options = {recreateOnReset: false}) {
  const aframeContainer = document.getElementById('aframe-container')
  let sceneEl = aframeContainer.querySelector('a-scene')
  let select = selector => document.querySelector(selector)
  let roots = {}

  const scene = {
    reset: () => {
      if (options.recreateOnReset || aframeContainer.querySelector('a-scene') === null) {
        aframeContainer.innerHTML = '<a-scene embedded style="height: 300px; width: 600px;"></a-scene>'
        roots = {}
      }
      sceneEl = select('a-scene')
    },
    within: (handler) => {
      if (sceneEl.renderStarted) {
        handler(sceneEl)
      }
      else {
        sceneEl.addEventListener('renderstart', () => {
          handler(sceneEl)
        })
      }
    },
    addHtmlTo: (parent, html, selector) => {
      parent.insertAdjacentHTML('afterbegin', html)
      if (selector) {
        return select(selector)
      }
      return undefined
    },
    addHtml: (html, selector) => scene.addHtmlTo(sceneEl, html, selector)
  }
  scene.inScene = scene.within
  
  function Root(prefix, index) {
    let testContext = undefined
    let test = undefined
    const setTextContext = (ctx) => {
      test = ctx.test
      testContext = ctx
    }
    let splitIntoLines = (text, lineSize) => {
      let lines = ''
      let line = ''
      text.split(' ').forEach(word => {
        let separator = ''
        if (lines.length > 0) {
          separator = '\n'
        }
        lines += separator + word
      })
      return lines
    }
    let testName = () => {
      if (test) {
        console.log('test', test)
        return splitIntoLines(test.title, 20)
      }
      return 'test-' + index
    }
    let rootEl = au.entity(sceneEl, 'a-entity', { id: `${prefix}-test-root`})
    const root = {
      addHtml: (html, selector) => scene.addHtmlTo(rootEl, html, selector),
      addHtmlTo: (parent, html, selector) => scene.addHtmlTo(parent, html, selector),
      el: rootEl,
      makeViewable: () => {
        let x = -1 + index * 0.5
        let scale = 0.15        
        
        const box = new THREE.BoxHelper( rootEl.object3D, 0xffff00 );
        rootEl.object3D.add( box );
        
        rootEl.setAttribute('balloon-label', `label: ${testName()}; y-offset: 0.2; scale: 0.1`)
        rootEl.setAttribute('position', `${x} 1 -0.5`)
        rootEl.setAttribute('scale', `${scale} ${scale} ${scale}`)
      },
      prefix: prefix,
      select: selector => rootEl.querySelector(selector),
      testing: testContext => setTextContext(testContext),
      withMark: (vector3, color = 'red') => {
        let markPos = au.xyzTriplet(vector3)
        console.log('mark pos', markPos)
        au.entity(rootEl, 'a-sphere', { radius: 0.02, color: color, position: markPos})
        return vector3
      }
    }
    
    let testBoxHtml = (id, name, pos, color, options, extraAttributes) => {
      let attributes = Object.assign({
        id: id,
        depth: options.boxSize,
        width: options.boxSize,
        height: options.boxSize,
        'balloon-label': {
          label: name, 
          'y-offset': options.boxSize - 0.5
        },
        material: {
          color: color, 
          transparent: true, 
          opacity: 0.3
        },
        position: pos
      }, extraAttributes)
      
      return au.entityHtml('a-box', attributes)
    }
    
    root.id = name => {
      return `${prefix}-${name}`
    }

    root.addTestBoxTo = (parent, name, pos, color, options, extraAttributes) => {
      let testBoxId = root.id(name)

      let html = testBoxHtml(testBoxId, name, pos, color, options, extraAttributes)      
      
      return root.addHtmlTo(parent, html, '#' + testBoxId)
    }
    
    root.addTestBox = (name, pos, color, options, extraAttributes) => {
      return root.addTestBoxTo(rootEl, name, pos, color, options, extraAttributes)
    }
        
    root.testBoxIn = (parent, name, attributes = {}) => {
      let defaults = {
        'balloon-label': {
          label: name,
          'y-offset': 1.2
        },
        material: {
          color: attributes.color | 'mauve',
          transparent: true, 
          opacity: 0.3
        },
      }
      let merged = Object.assign(defaults, { id: root.id(name) }, attributes)
      return au.entity(parent, 'a-box', merged)
    }

    root.testBox = (name, attributes = {}) => {
      return root.testBoxIn(rootEl, name, attributes)
    }
    
    let _markRootEl
    const markRoot = () => {
      if (_markRootEl === undefined) {
        _markRootEl = au.entity(rootEl, 'a-entity', { id: `${prefix}-test-mark-root`})
      }
      return _markRootEl
    }

    root.markBox = attributes => {
      let defaults = {
        material: {
          wireframe: true
        },
      }
      let merged = Object.assign(defaults, { id: root.id(name) }, attributes)
      return au.entity(markRoot(), 'a-box', merged)
    }
    
    root.entity = (entity, attributes) => {
      return au.entity(rootEl, entity, attributes)
    }
    
    return root
  }
  
  scene.addRoot = (prefix) => {
    const randomId = () => 'root' + Math.random().toString(36).substring(7)
    if (!prefix) {
      prefix = randomId()
    }
    
    if (!roots[prefix]) {
      let index = Object.keys(roots).length
      roots[prefix] = Root(prefix, index)
    }
    return roots[prefix]
  }


  scene.reset()

  return scene
}