const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const { lerp } = require('canvas-sketch-util/math');

const settings = {
  dimensions: [ 2048, 2048 ]
};

const sketch = () => {

  // number of lines across y axis
  const nLines = 20;

  // I don't recall this
  const nPoints = 10;

  const histogram = (arr, bins) => {
    const [min, max] = [Math.min(...arr), Math.max(...arr)];
    const acc = [...Array(bins+2)].map(_ => 0);
    const step = (max - min)/bins

    arr.forEach(v => {
      let i = 0;
      let cv = min;
      for (i = 0; v > cv; cv += step, i++);
      acc[i]++;
    });
    return acc;
  }

  const amp = random.rangeFloor(0, 31);
  const k = random.rangeFloor(2, 6)
  const displacement = amp + random.rangeFloor(amp, amp + 50);
  const noisify = v => v + random.gaussian()/20;

  // linspace between k and 2k*pi
  const sineIndex = [...Array(nLines + 1)]
    .map((_, i) => i/nLines)
    .map(i => lerp(k, 2*k*Math.PI, i));

  const [width, height] = settings.dimensions;
  // The size of the x and y array according to the witdh
  const wPoints = Math.floor(parseInt(width*.8)/nPoints);
  const mainValues = [...Array(wPoints)]
    .map(_ => nPoints);
  let X = [...Array(nLines)].map(_ => [...mainValues])
  let Y = [...Array(nLines)].map(_ => [...mainValues].map(_ => noisify(0)*10));
  let ACC = Y.map(y => histogram(y, 20)
        .map((v, i, obj) => (i == 0 ? v : v - obj[i-1])*-1))

  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    for (let i = 1; i < nLines; i++) {
      let initialPosition = {
        x: width*0.1,
        y: ((i+2)*height)/(nLines+4)
      }
      let index = parseInt(Math.sin(sineIndex[i])*amp) + displacement;
      let x = [...X[i]];
      let y = [...Y[i]];
      let acc = [...ACC[i]];
      let startingRange = index;

      y = y.map((v, i) => {
        if (i >= startingRange && i <= startingRange + acc.length - 1) {
          return v + acc[i - startingRange]*3;
        }
        return v;
      });

      //convert relative lines to absolute lines
      x.forEach((v, i, obj) => {
        if (i == 0)
          obj[i] = initialPosition.x;
        else
          obj[i] = v + obj[i - 1];
      })
      y.forEach((v, i, obj) => {
        if (i == 0)
          obj[i] = initialPosition.y;
        else
          obj[i] = v + obj[i - 1];
      })

      let baseMask = startingRange + acc.length;
      console.log(baseMask/y.length)
      let colorStops = [
        [1, 1, 0],
        [1, 0, .5],
        [0, 1, 1]
      ].map(v => v.map(d => d*255).join(","))
      console.log(colorStops)

      let gradient = context.createLinearGradient(0, 0, width, 0);

      [0, baseMask/y.length, 1].map((v, i) =>
        gradient.addColorStop(v, "rgb("+colorStops[i]+")"))

      context.strokeStyle = gradient;
      context.lineWidth = 10;
      context.moveTo(x[0], y[0]);
      x.forEach((v, i) => context.lineTo(v, y[i]));
      context.stroke();
    }


  };
};

canvasSketch(sketch, settings);
