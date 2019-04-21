# bu.js

A HTML5 Canvas graphics library

[![Bu.js Logo](logo.png)](http://jarvisniu.com/bu.js/)

[Demos](http://jarvisniu.com/bu.js/) -
[Guides](https://github.com/jarvisniu/bu.js/wiki/Guides) -
[API](https://github.com/jarvisniu/bu.js/wiki/API) -
[ChangeLog](CHANGELOG.md) -
[Download](https://cdn.rawgit.com/jarvisniu/bu.js/v0.4.0/build/bu.min.js)

## Hello World

``` html
<!DOCTYPE html>
<html>
<body>
  <script src="https://cdn.rawgit.com/jarvisniu/bu.js/v0.4.0/build/bu.min.js"></script>
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
      update: function () {
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
