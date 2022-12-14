/* global aframeTestScene DisplayBuilder */
var chai = chai || {}
var expect = chai.expect

describe('display builder', () => {

  let scene, root

  before(function() {
    scene = aframeTestScene({ context: this })
    scene.setActionDelay(50)
  })

  beforeEach(function() {
    scene.reset()
    root = scene.addRoot()
  })

  afterEach(() => root.makeViewable())

  let display, displayBuilder, graphJson
  const jsonLoader = () => graphJson

  beforeEach(() => {
    display = root.addHtml('<a-entity></a-entity>')
    displayBuilder = tiltviz.DisplayBuilder(jsonLoader)
  })

  it('persists the graph id used for persistence to the graph-id data attribute of the display root', function (done) {
    root.testing(this)

    graphJson = {
      id: 'bob',
      nodes: []
    }

    displayBuilder.build(display)

    scene.actions(() => {
      expect(display.dataset.graphId).to.eql('bob')
      done()
    })
  })

  it('loads a domain node from json marking it as such', function (done) {
    root.testing(this)

    graphJson = {
      nodes: [{id: 'abox'}]
    }

    displayBuilder.build(display)

    scene.actions(() => {
      let addedBox = root.select('#abox')
      expect(getLabel(addedBox)).to.eql('abox')
      expect(Array.from(addedBox.classList)).to.include('node')
      done()
    })
  })

  describe('loading domain types', () => {
    it('loads look of node entity based on type', function (done) {
      root.testing(this)

      graphJson = {
        nodes: [{id: 'cheesy', type: 'db'}]
      }

      scene.actions(() => displayBuilder.build(display),
        () => {
          const loadedNode = root.select('#cheesy');
          expect(loadedNode.getAttribute('geometry').primitive).to.eql('cylinder')
          done()
        })
    })

    it('persists node type onto entity as data attribute', function (done) {
      root.testing(this)

      graphJson = {
        nodes: [{id: 'wotsit', type: 'db'}]
      }

      scene.actions(() => displayBuilder.build(display),
        () => {
          const loadedNode = root.select('#wotsit');
          expect(loadedNode.dataset.nodeType).to.eql('db')
          done()
        })
    })

    it('loads an edge with type from json', function (done) {
      root.testing(this)

      graphJson = {
        nodes: [{id: 'queue-from'}, {id: 'queue-to'}],
        edges: [{
          type: 'queue',
          from: 'queue-from',
          to: 'gueue-to'
        }]
      }

      scene.actions(() => displayBuilder.build(display),
        () => {
          let queueStartNode = root.select('#queue-from')
          expect(queueStartNode.getAttribute('edge').type).to.eql('queue')
        }, done)
    })
  })

  it('loads two entities from json', function (done) {
    root.testing(this)

    graphJson = {
      nodes: [{id: 'bbox'}, {id: 'cbox'}]
    }

    displayBuilder.build(display)

    scene.actions(() => {
      let box1 = root.select('#bbox')
      let box2 = root.select('#cbox')
      expect(getLabel(box1)).to.eql('bbox')
      expect(getLabel(box2)).to.eql('cbox')
      done()
    })
  })

  it('loads an entity with defined position at that location', function (done) {
    root.testing(this)

    graphJson = {
      nodes: [{
        id: 'obox'
      }, {
        id: 'pbox',
        position: '1 1 1'
      }]
    }

    displayBuilder.build(display)

    scene.actions(() => {
      let positionedBox = root.select('#pbox')
      expect(au.xyzTriplet(positionedBox.getAttribute('position'))).to.eql('1 1 1');
      done()
    })
  })

  it('loads multiple edges from an entity from json', function (done) {
    root.testing(this)

    graphJson = {
      nodes: [{id: 'source-node'}, {id: 'to1'}, {id: 'to2'}],
      edges: [{
        from: 'source-node',
        to: 'to1',
        id: 'id1'
      }, {
        from: 'source-node',
        to: 'to2'
      }]
    }

    displayBuilder.build(display)

    scene.actions(() => {
      let sourceNode = root.select('#source-node')
      let to1 = root.select('#to1')
      let to2 = root.select('#to2')
      expect(sourceNode.getAttribute('edge').to).to.eql(to1)
      expect(sourceNode.components.edge.data.label).to.eql('id1')
      expect(sourceNode.getAttribute('edge__1').to).to.eql(to2)
    }, done)
  })

})

function getLabel(addedBox) {
  return addedBox.getAttribute('balloon-label').label;
}
