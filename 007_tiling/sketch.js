const canvasSketch = require('canvas-sketch');
const { lerp } = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");

const settings = {
  dimensions: [ 2048, 2048 ]
};

const sketch = () => {
  const margin = 200;
  const nTiles = 20;
  const scaleValue = 1/nTiles;

  const createGrid = () => {
    const n = 2;
    const points = [];
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const u = i / (n - 1);
        const v = j / (n - 1);
        points.push({u, v});
      }
    }
    return points;
  }

  const grid = createGrid();

  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    context.translate(margin, margin);
    context.scale(scaleValue, scaleValue);
    const draw = () => {
      do {
        let p1 = random.pick(grid);
        const [x1, y1] = [
          lerp(margin, width - margin, p1.u),
          lerp(margin, height - margin, p1.v)
        ]
        let p2 = random.pick(grid);
        const [x2, y2] = [
          lerp(margin, width - margin, p2.u),
          lerp(margin, height - margin, p2.v)
        ]

        context.moveTo(x1, y1)
        context.lineTo(x2, y2)
        context.strokeStyle = 'white'
        context.lineWidth = 50;
        context.stroke();
      } while (random.value() > .8);
      grid.forEach(({u, v}) => {
        const x = lerp(margin, width - margin, u);
        const y = lerp(margin, height - margin, v)
        context.beginPath();
        context.arc(x, y, 10, 0, Math.PI*2) 
        context.closePath();
        context.fillStyle = "white"
        context.fill()
      });
    };

    for(let i = 0; i < nTiles; i++) {
      for (let j = 0; j < nTiles; j++) {
        draw()
        context.translate(width - margin*2, 0);
      }
      context.translate(-nTiles*(width - margin*2), height - margin*2)
    }
  };
};

canvasSketch(sketch, settings);
