Bu.js
=====

a javascript 2D library


## Content

- shape representation
- graphic rendering
- geometry computation
- draw shapes by mouse
- morph


## Code Layout

- `shapes/` shape representation and geometry computation algorithm
- `drawable` other thing like Image, Text etc. that can be drew on the screen except shapes
- `renderer/` render the shapes to the screen
- `morph/` shape morph algorithm
- `reactor/` deal with the logic of mouse/keyboard input


## Prerequisites

1. [Node](https://nodejs.org/)
2. CoffeeScript: `npm install -g coffee-script`
3. Jade: `npm install -g jade`
4. UglifyJS: `npm install -g uglify-js`


## License

MIT
