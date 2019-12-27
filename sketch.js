const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const { lerp } = require('canvas-sketch-util/math');
const palettes = require('nice-color-palettes');

const settings = {
  dimensions: [ 2048, 2048 ]
};

const sketch = () => {

  const palette = random.pick(palettes)

  const vectorField = (x, y) => ([-y, x]);
  // const vectorField = (x, y) => ([Math.sin(y), Math.sin(x)]);
  const normalize = ([x, y]) => {
    const norm = Math.sqrt(x*x + y*y);
    return [x/norm, y/norm];
  }

  const R = 1;
  
  
  const createGrid = () => {
    const points = [];
    const count = 120;

    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const u = lerp(-R, R, x / (count - 1))
        const v = lerp(-R, R, y / (count - 1))
        points.push({x: u, y: v});
      }
    }

    return points;
  }

  const grid = createGrid();
  
  return ({ context, width, height }) => {
    context.fillStyle = 'hsl(0, 0%, 98%)';
    context.fillRect(0, 0, width, height);

    const margin = 0.2;
    context.scale(width, height);
    context.translate(margin / 2, margin / 2);
    context.scale(1 - margin, 1 - margin);

    context.translate(.5, .5)
    context.scale(.5/R, .5/R)
    

    grid.forEach(({x, y}) => {
      const color = random.pick(palette);
      
      context.beginPath();
      context.moveTo(x, y);
      
      const [u, v] = (vectorField(x, y))
      context.lineTo(u, v)
      
      context.lineWidth = 0.001;
      context.strokeStyle = color;
      context.stroke();
      context.closePath()

      context.arc(u, v, 0.001, 0, 2*Math.PI);
      context.fillStyle = color;
      context.fill()
  })

  

    
  };
};

canvasSketch(sketch, settings);
