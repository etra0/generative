const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [ 1080, 1350 ]
};
random.setSeed(1234)

const sketch = () => {
  const createGrid = () => {
    const n = 30;
    const data = [];

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const u = i/(n-1);
        const v = j/(n-1);
        data.push({u, v});
        
      }
    }

    return data;
  }

  const calculateFunction = (sx, sy, ex, ey) => {
    const m = (ey - sy)/(ex - sx)
    const b = ey - m*ex;
    return (x) => m*x + b;
  }

  const grid = createGrid();
  
  return ({ context, width, height }) => {
    const margin = 200;
    const smargin = margin*.25
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    context.fillStyle = 'black'
    context.fillRect(smargin, smargin, width - smargin*2, height - smargin*2);
    const nLines = random.rangeFloor(3, 10);
    const sw = ({u, v}) => ({u: lerp(margin, width - margin, u), v});
    const sh = ({u, v}) => ({v: lerp(margin, height - margin, v), u});
    const scale = (obj) => sw(sh(obj));


    // Create lines and generate it linear function.
    const functions = [];
    for (let i = 0; i < nLines; i++) {
      context.strokeStyle = 'white'
      context.lineWidth = 2
      let {u: sx, v: sy} = scale(random.pick(grid));
      let {u: ex, v: ey} = scale(random.pick(grid));
      context.beginPath();
      context.moveTo(sx, sy);
      context.lineTo(ex, ey);
      context.closePath();
      context.stroke();
      functions.push({
        f: calculateFunction(sx, sy, ex, ey),
        sx, sy, ex, ey
      });
    }

    // Select two lines and draw lines between them
    const nUnions = random.rangeFloor(3, 10);
    [...Array(nUnions)].map(_ => {
      const resolution = random.rangeFloor(10, 100);
      let sl, el;
      do {
        sl = random.pick(functions);
        el = random.pick(functions);
      } while (sl.sx == el.sx && sl.ex == el.ey)
      [...Array(resolution)]
        .map((_, i) => i/(resolution - 1))
        .forEach(v => {
          const slx = lerp(sl.sx, sl.ex, v);
          const elx = lerp(el.sx, el.ex, v);
          context.beginPath();
          context.moveTo(slx, sl.f(slx))
          context.lineTo(elx, el.f(elx))
          context.closePath();
          context.stroke();
        })
    })
  };
};

canvasSketch(sketch, settings);
