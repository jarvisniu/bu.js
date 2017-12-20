import Bu from './Bu'

# math
import Bounds from './math/Bounds'
import Color from './math/Color'
import Size from './math/Size'
import Vector from './math/Vector'

Bu.Bounds = Bounds
Bu.Color = Color
Bu.Size = Size
Bu.Vector = Vector

# base
import './base/MicroJQuery'
import Event from './base/Event'
import Object2D from './base/Object2D'
import Styled from './base/Styled'

Bu.Event = Event
Bu.Object2D = Object2D
Bu.Styled = Styled

# core
import App from './core/App'
import Audio from './core/Audio'
import Camera from './core/Camera'
import Renderer from './core/Renderer'
import Scene from './core/Scene'

Bu.App = App
Bu.Audio = Audio
Bu.Camera = Camera
Bu.Renderer = Renderer
Bu.Scene = Scene

# shapes
import Bow from './shapes/Bow'
import Circle from './shapes/Circle'
import Ellipse from './shapes/Ellipse'
import Fan from './shapes/Fan'
import Line from './shapes/Line'
import Point from './shapes/Point'
import Polygon from './shapes/Polygon'
import Polyline from './shapes/Polyline'
import Rectangle from './shapes/Rectangle'
import Spline from './shapes/Spline'
import Triangle from './shapes/Triangle'

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

# drawable
import Image from './drawable/Image'
import PointText from './drawable/PointText'

Bu.Image = Image
Bu.PointText = PointText

# anim
import Animation from './anim/Animation'
import AnimationRunner from './anim/AnimationRunner'
import AnimationTask from './anim/AnimationTask'
import DashFlowManager from './anim/DashFlowManager'
import SpriteSheet from './anim/SpriteSheet'

Bu.Animation = Animation
Bu.AnimationRunner = AnimationRunner
Bu.AnimationTask = AnimationTask
Bu.DashFlowManager = DashFlowManager
Bu.SpriteSheet = SpriteSheet

# input
import InputManager from './input/InputManager'
import MouseControl from './input/MouseControl'

Bu.InputManager = InputManager
Bu.MouseControl = MouseControl

# extra
import geometryAlgorithm from './extra/geometryAlgorithm'
import ShapeRandomizer from './extra/ShapeRandomizer'

Bu.geometryAlgorithm = geometryAlgorithm
Bu.ShapeRandomizer = ShapeRandomizer

export default Bu
