// Entry of bu.js

// main
import Bu from './base/Bu.js'
import './presets.js'

// math
import Bounds from './math/Bounds.js'
import Color from './math/Color.js'
import Size from './math/Size.js'
import Vector from './math/Vector.js'

// base
import Event from './base/Event.js'
import Object2D from './base/Object2D.js'
import Styled from './base/Styled.js'

// core
import Audio from './core/Audio.js'
import Camera from './core/Camera.js'
import Renderer from './core/Renderer.js'
import Scene from './core/Scene.js'

// shapes
import Bow from './shapes/Bow.js'
import Circle from './shapes/Circle.js'
import Ellipse from './shapes/Ellipse.js'
import Fan from './shapes/Fan.js'
import Line from './shapes/Line.js'
import Point from './shapes/Point.js'
import Polygon from './shapes/Polygon.js'
import Polyline from './shapes/Polyline.js'
import Rectangle from './shapes/Rectangle.js'
import Spline from './shapes/Spline.js'
import Triangle from './shapes/Triangle.js'

// drawable
import Image from './drawable/Image.js'
import PointText from './drawable/PointText.js'

// animation
import Animation from './anim/Animation.js'
import AnimationRunner from './anim/AnimationRunner.js'
import AnimationTask from './anim/AnimationTask.js'
import DashFlowManager from './anim/DashFlowManager.js'
import SpriteSheet from './anim/SpriteSheet.js'

// input
import InputManager from './input/InputManager.js'
import MouseControl from './input/MouseControl.js'

// extra
import geometryAlgorithm from './extra/geometryAlgorithm.js'
import ShapeRandomizer from './extra/ShapeRandomizer.js'

// properties -----------------------------------------------------------------

import utils from './utils.js'
import config from './config.js'

import { version } from '../package.json'

Bu.Bounds = Bounds
Bu.Color = Color
Bu.Size = Size
Bu.Vector = Vector

Bu.Event = Event
Bu.Object2D = Object2D
Bu.Styled = Styled

Bu.Audio = Audio
Bu.Camera = Camera
Bu.Renderer = Renderer
Bu.Scene = Scene

Bu.Bow = Bow
Bu.Circle = Circle
Bu.Ellipse = Ellipse
Bu.Fan = Fan
Bu.Line = Line
Bu.Point = Point
Bu.Polygon = Polygon
Bu.Polyline = Polyline
Bu.Rectangle = Rectangle
Bu.Spline = Spline
Bu.Triangle = Triangle

Bu.Image = Image
Bu.PointText = PointText

Bu.Animation = Animation
Bu.AnimationRunner = AnimationRunner
Bu.AnimationTask = AnimationTask
Bu.DashFlowManager = DashFlowManager
Bu.SpriteSheet = SpriteSheet

Bu.InputManager = InputManager
Bu.MouseControl = MouseControl

Bu.geometryAlgorithm = geometryAlgorithm
Bu.ShapeRandomizer = ShapeRandomizer

Bu.config = config // Global config
Bu.version = version // Version info

// utils in examples
for (let name of ['d2r', 'rand', 'MOUSE', 'POINT_RENDER_SIZE']) {
  Bu[name] = utils[name]
}

// Output version info to the console, at most one time in a minute.
let currentTime = Date.now()
let lastTime = utils.data('version.timestamp')
if (!lastTime || currentTime - lastTime > 60 * 1000) {
  if (typeof console.info === 'function') {
    console.info(`bu.js v${Bu.version} - [https://github.com/jarvisniu/bu.js]`)
  }
  utils.data('version.timestamp', currentTime)
}

export default Bu
