// Entry of bu.js

// main
import './bu.js'
import './base/presets.js'
import utils from './base/utils.js'

// math
import Bounds from './math/Bounds.coffee'
import Color from './math/Color.coffee'
import Size from './math/Size.coffee'
import Vector from './math/Vector.coffee'

Bu.Bounds = Bounds
Bu.Color = Color
Bu.Size = Size
Bu.Vector = Vector

// base
import Event from './base/Event.js'
import Object2D from './base/Object2D.js'
import Styled from './base/Styled.js'
import config from './base/config.js'

Bu.Event = Event
Bu.Object2D = Object2D
Bu.Styled = Styled
Bu.config = config

// core
import Bu from './core/Bu.js'
import Audio from './core/Audio.coffee'
import Camera from './core/Camera.coffee'
import Renderer from './core/Renderer.coffee'
import Scene from './core/Scene.coffee'

Bu.Audio = Audio
Bu.Camera = Camera
Bu.Renderer = Renderer
Bu.Scene = Scene

// shapes
import Bow from './shapes/Bow.coffee'
import Circle from './shapes/Circle.coffee'
import Ellipse from './shapes/Ellipse.coffee'
import Fan from './shapes/Fan.coffee'
import Line from './shapes/Line.coffee'
import Point from './shapes/Point.coffee'
import Polygon from './shapes/Polygon.coffee'
import Polyline from './shapes/Polyline.coffee'
import Rectangle from './shapes/Rectangle.coffee'
import Spline from './shapes/Spline.coffee'
import Triangle from './shapes/Triangle.coffee'

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

// drawable
import Image from './drawable/Image.coffee'
import PointText from './drawable/PointText.coffee'

Bu.Image = Image
Bu.PointText = PointText

import Animation from './anim/Animation.coffee'
import AnimationRunner from './anim/AnimationRunner.coffee'
import AnimationTask from './anim/AnimationTask.coffee'
import DashFlowManager from './anim/DashFlowManager.coffee'
import SpriteSheet from './anim/SpriteSheet.coffee'

// animation
Bu.Animation = Animation
Bu.AnimationRunner = AnimationRunner
Bu.AnimationTask = AnimationTask
Bu.DashFlowManager = DashFlowManager
Bu.SpriteSheet = SpriteSheet

// input
import InputManager from './input/InputManager.coffee'
import MouseControl from './input/MouseControl.coffee'

Bu.InputManager = InputManager
Bu.MouseControl = MouseControl

// extra
import geometryAlgorithm from './extra/geometryAlgorithm.coffee'
import ShapeRandomizer from './extra/ShapeRandomizer.coffee'

Bu.geometryAlgorithm = geometryAlgorithm
Bu.ShapeRandomizer = ShapeRandomizer

// properties -----------------------------------------------------------------

// Version info
Bu.version = '0.4.0'

// utils in examples
for (let name of [
	'd2r',
	'rand',
	'MOUSE',
	'POINT_RENDER_SIZE',
]) {
	Bu[name] = utils[name]
}

// Output version info to the console, at most one time in a minute.
let currentTime = Date.now()
let lastTime = utils.data('version.timestamp')
if (!lastTime || currentTime - lastTime > 60 * 1000) {
	if (typeof console.info === "function") {
		console.info('Bu.js v' + Bu.version + ' - [https://github.com/jarvisniu/Bu.js]')
	}
	utils.data('version.timestamp', currentTime)
}

export default Bu
