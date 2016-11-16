Change Log
==========

## WIP

- Added API property `Renderer.background`


## 0.4.0 / 2016/11/15

- Changed name `Bu.Colorful` to `Bu.Styled`
- Added `Camera` class, allowed us to move the field of vision
- Added `Renderer.originAtCenter` property, allowed to change
    the origin point from left-top corner to the screen center
- Added `Object2D.translate()` and `.rotate()` to transform an object
- Added `DashFlowManager` to move the `.dashOffset += 1` logic inside
- Added `Object2D.hitTest()` to interact with mouse
- Added keyboard control API `Bu.InputManager`
- Added shape ellipse
- Added `Bu.Audio` to support sounds


## 0.3.5 / 2016-11-09

- Changed `RandomShapeGenerator` to `ShapeRandomizer`
- Changed `Renderer.shapes` to `Renderer.scene`
- Changed `Renderer.add/remove()` to `Object2D.add/removeChild()`
- Updated `shapes` to respond `changed` event
- Added `Renderer.drawBounds` to show the bounding boxes
- Added `Bu.ready()` to execute callback when ready
- Added `imageSmoothing` option for renderer
- Added type checking functions `Bu.isNumber` and `Bu.isString`


## 0.3.4 / 2016-11-07

- Added class `Bu.Color`
- Updated `Bu.Animation` to support color transform animation
- Added function `Bu.clamp()`
- Added class `Bu.App`, the declarative app framework


## 0.3.2 / 2016-02-24

- Added shape `Bu.Spline`
- Added hierarchy management
- Updated animation to support easing functions
- Changed shapes, computational algorithms were extracted out
    and will be injected in their prototypes as need.


## Change Type

- **Changed**: Breaking changes were made
- **Removed**: Outdated or deprecated feature were removed
- **Fixed**: Bugs were fixed
- **Added**: New features were added
- **Updated**: Enhance current class
- **Improved**: Use new techniques or algorithms to improve the performance, UI etc
