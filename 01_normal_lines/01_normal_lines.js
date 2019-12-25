const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const { lerp } = require('canvas-sketch-util/math');

const settings = {
  dimensions: [ 2048, 2048 ]
};

const sketch = () => {

  const nLines = 8;
  const nPoints = 10;

  // TODO: randomize this
  const amp = 20;
  const k = 5
  const displacement = amp + random.rangeFloor(amp, amp + 50);

  // number of points along width;

  const noisify = v => v + random.gaussian()/20;

  const sineIndex = [...Array(nLines + 1)]
    .map((_, i) => i/nLines)
    .map(i => lerp(k, 2*k*Math.PI));

  
  return ({ context, width, height }) => {
    const wPoints = Math.floor(parseInt(width*.8)/nPoints);
    const mainValues = [...Array(wPoints)]
      .map(_ => nPoints);

    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    for (let i = 1; i < nLines; i++) {
      let index = parseInt(Math.cos(sineIndex[i]))*amp + displacement;


    }


  };
};

canvasSketch(sketch, settings);
