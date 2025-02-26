import Utils from './utils.js'

import fragment from '../../asset/shader/fragment.glsl'
import vertex from '../../asset/shader/vertex.glsl'

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'lil-gui'

import { gsap } from 'gsap'

export default class Sketch {
  constructor(selector) {
    this.scene = new THREE.Scene()

    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(this.width, this.height)
    this.renderer.setClearColor(0xd2d2d2, 1)

    this.container = document.getElementById('container')
    this.width = this.container.offsetWidth
    this.height = this.container.offsetHeight
    this.container.appendChild(this.renderer.domElement)

    this.camera = new THREE.PerspectiveCamera(
      70,
      this.width / this.height,
      0.001,
      1000
    )

    // var frustumSize = 10
    // var aspect = window.innerWidth / window.innerHeight
    // this.camera = new THREE.OrthographicCamera(
    //   (frustumSize * aspect) / -2,
    //   frustumSize
    // )
    this.camera.position.set(0, 0, 4)
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.time = 0

    this.paused = false

    this.setupResized()

    this.addObject()
    this.resize()
    this.render()
    this.settings()
  }

  settings() {
    let that = this
    this.settings = {
      time: 0,
    }
    this.gui = new GUI()

    this.gui.add(this.settings, 'time', 0, 100, 0.01)
  }

  setupResized() {
    window.addEventListener('resize', this.resize.bind(this))
  }
  resize() {
    this.width = this.container.offsetWidth
    this.height = this.container.offsetHeight
    this.renderer.setSize(this.width, this.height)
    this.camera.aspect = this.width / this.height

    // //optional - set camera and canvas fit window
    // this.imageAspect = 1080 / 1920
    // let a1, a2
    // if (this.height / this.width > this.imageAspect) {
    //   a1 = (this.width / this.height) * this.imageAspect
    //   a2 = 1
    // } else {
    //   a1 = 1
    //   a2 = this.height / this.width / this.imageAspect
    // }

    // this.material.uniforms.resolution.value.x = this.width
    // this.material.uniforms.resolution.value.y = this.height
    // this.material.uniforms.resolution.value.z = a1
    // this.material.uniforms.resolution.value.w = a2

    // //optional - cover with quadrant
    // const dist = this.camera.position.z
    // const height = 0.8
    // this.camera.fov = 2 * (180 / Math.PI) * Math.atan(height / (2 * dist))

    // if (this.width / this.height > 1) {
    //   this.plane.scale.x = this.camera.aspect
    // } else {
    //   this.plane.scale.y = 1 / this.camera.aspect
    // }

    this.camera.updateProjectionMatrix()
  }
  addObject() {
    let that = this
    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: '#extension GL_OES_standard_derivatives : enable',
      },
      side: THREE.DoubleSide,
      uniforms: {
        time: { type: 'f', value: 0 },
        resolution: { type: 'v4', value: new THREE.Vector4() },
        uvRate1: {
          value: new THREE.Vector2(1, 1),
        },
      },
      // wireframe: true,
      // transparent: true,
      vertexShader: vertex,
      fragmentShader: fragment,
    })

    this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1)

    this.plane = new THREE.Mesh(this.geometry, this.material)
    this.scene.add(this.plane)
  }

  stop() {
    this.paused = true
  }

  play() {
    this.paused = false
    this.render()
  }

  render() {
    if (this.paused) return
    this.time += 0.05
    this.material.uniforms.time.value = this.time
    requestAnimationFrame(this.render.bind(this))
    this.renderer.render(this.scene, this.camera)
  }
}
const tl = gsap.timeline()
