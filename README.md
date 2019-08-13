# bu.js

A HTML5 Canvas graphics library

[![bu.js logo](logo.png)](http://jarvisniu.com/bu.js/)

[Examples](https://unpkg.com/bu.js/index.html) -
<!-- [Guides](https://github.com/jarvisniu/bu.js/wiki/Guides) - -->
[API](https://github.com/jarvisniu/bu.js/wiki/API) -
[ChangeLog](CHANGELOG.md) -
[Download](https://unpkg.com/bu.js/build/bu.js)

## Hello World

``` html
<!DOCTYPE html>
<html>
<body>
  <script src="https://unpkg.com/bu.js/build/bu.js"></script>
  <script type="text/javascript">
    var bu = new Bu({
      objects: {
        sun: new Bu.Circle(40).fill("#F40").stroke("#820"),
        earth: new Bu.Circle(20).fill("#06F").stroke("#038"),
        moon: new Bu.Circle(10).fill("#FF0").stroke("#880"),
      },
      scene: {
        sun: {
          earth: {
            moon: {}
          }
        }
      },
      update() {
        this.sun.rotation += 0.02
        this.earth.rotation += 0.1
      },
    })
  </script>
</body>
</html>
```

## License

MIT
