const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math')

const settings = {
  dimensions: [ 2048, 2048 ]
};

const sketch = () => {
  // Number of points along width
  const nPoints = 40;
  const pointWidth = 5;

  const resolution = 100;

  // Position along width
  const vPositions = [...Array(resolution)]
    .map((d, i) => i/resolution)
    .map(v => lerp(-.5, .5, v))


  const domain = [...Array(nPoints)]
    .map((_, i) => i/nPoints)
    .map(v => lerp(0, 2*Math.PI, v));


  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);


    context.translate(0, height/2);

    vPositions.forEach(v => {
      context.fillStyle = `rgb(255, ${(.5-v)*255}, ${(.5-Math.abs(v))*255})`;

      domain
        .map(d => ({
          x: (d*width/(2*Math.PI)),
          y: Math.sin(d+v)*200
        }))
        .map(({x, y}) => {
          context.beginPath()
          context.arc(x, y, pointWidth, 0, 2*Math.PI)
          context.closePath();
          context.fill();
        })


    });
  };
};

canvasSketch(sketch, settings);
