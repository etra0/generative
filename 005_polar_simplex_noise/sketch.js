const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const { lerp } = require("canvas-sketch-util/math");

const settings = {
  dimensions: [4096, 4096],
  animate: true,
  duration: 6,
  fps: 30
};

let seed = (random.value() * 10000).toFixed(0);
random.setSeed(seed);

// random.setSeed(5287)
// seed = (random.value() * 10000).toFixed(0);

// random.setSeed(9711);
// random.setSeed(6647);
console.log("current seed", random.getSeed());

const sketch = () => {
  const resolution = 2000;
  const initialRadius = random.range(.5, 1.5)
  const strength = random.range(.1e3, 1e3)

  const values = [...Array(resolution)].map((d, i) => ({
    angle: (i * 2 * Math.PI) / resolution,
    radius: initialRadius
  }));

  const f = (x, r) => [r * Math.cos(x), r * Math.sin(x)];

  
  const rsp = random.value() * 360;
  const scale = 1.8;

  let globalCounter = 0
  let run = true;
  let first = true;
  document.addEventListener('keypress', () => {run = !run})
  return ({ context, width, height, playhead }) => {
    if (!run) return;
    if (first) {
      context.fillStyle = 'rgba(0, 0, 0, 1)';
      context.fillRect(0, 0, width, height);
      first = false;
    }

    globalCounter = (lerp(0, 1e4, playhead)).toFixed(0);
    
    context.save();
    // context.fillStyle = 'rgba(0, 0, 0, .009)';
    // context.fillRect(0, 0, width, height);
    context.scale(
      (scale * width) / (Math.PI * 2),
      (scale * height) / (Math.PI * 2)
    );
    context.translate(Math.PI / scale, Math.PI / scale);

    context.lineWidth = 0.01;
    context.beginPath();
    values.forEach((d, i) => {
      const { angle, radius } = d;

      context.strokeStyle = `hsla(${globalCounter/300 + rsp}, 70%, 50%, .02)`;
      const [x, y] = f(angle, radius);

      context.lineTo(x, y);

      // const rv =  (random.value() > 0.5 ? -1 : 1)*random.value()/100;
      const rv = random.noise2D(x, y, radius) / strength;
      d.radius += rv;
    });
    context.closePath();
    context.stroke();

    if (!(globalCounter % 100)) {
      random.setSeed(globalCounter);
    }

    context.restore();
  };
};

canvasSketch(sketch, settings);
