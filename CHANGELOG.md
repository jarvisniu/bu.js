Change Log
==========

## 0.3.6 / WIP

- Added `Camera` class, allowed us to move the field of vision
- Added `Renderer.originAtCenter` property, allowed to change
    the origin point from left-top corner to the screen center
- Added `Object2D.translate()` and `.rotate()` to transform an object
- Added `DashFlowManager` to move the `.dashOffset += 1` logic inside


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


## Change Type

- **Added**: New features were added
- **Updated**: Enhance current class
- **Improved**: Use new technics to improve the porformance, UI etc
- **Fixed**: Bugs were fixed
- **Removed**: Outdated or deprecated feature were removed
- **Changed**: Breaking changes were made
