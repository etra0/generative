const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');

const scale = 1
const settings = {
  //dimensions: [ 1080, 1350 ]
	//dimensions: [ 1920*scale, 1080*scale ]
	dimensions: [ 1080, 1080 ]
};

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
  const nLines = random.rangeFloor(3, 10);
  const nUnions = random.rangeFloor(3, 10);

  const [width, height] = settings.dimensions;
  const margin = 200;
  const smargin = margin*.25
  const sw = ({u, v}) => ({u: lerp(margin, width - margin, u), v});
  const sh = ({u, v}) => ({v: lerp(margin, height - margin, v), u});
  const scale = (obj) => sw(sh(obj));
  
  const functions = [];
  for (let i = 0; i < nLines; i++) {
    let {u: sx, v: sy} = scale(random.pick(grid));
    let {u: ex, v: ey} = scale(random.pick(grid));
    functions.push({
      f: calculateFunction(sx, sy, ex, ey),
      sx, sy, ex, ey
    });
  }

  const unions = [...Array(nUnions)].map(_ => {
    const resolution = random.rangeFloor(10, 100);
    let sl, el;
    do {
      sl = random.pick(functions);
      el = random.pick(functions);
    } while (sl.sx == el.sx && sl.ex == el.ey)
    return {sl, el, resolution};

  })

  console.log(unions)
	let drawLines = true;
	const randomColorPosition = random.rangeFloor(0, 360)

  return ({ context, width, height }) => {
		const wrapper = () => {

			context.fillStyle = 'black';
			context.fillRect(0, 0, width, height);

			context.fillStyle = 'black'
			context.fillRect(smargin, smargin, width - smargin*2, height - smargin*2);

			if (drawLines)
			functions.forEach(({sx, sy, ex, ey}) => {
			  context.strokeStyle = 'rgba(255, 255, 255, .5)';
			  context.lineWidth = 2;
			  context.beginPath();
			  context.moveTo(sx, sy);
			  context.lineTo(ex, ey);
			  context.closePath();
			  context.stroke();
			});

			// Create lines and generate it linear function.

			// Select two lines and draw lines between them
			unions.forEach(({sl, el, resolution}) => {
				[...Array(resolution)]
				.map((_, i) => i/(resolution - 1))
				.forEach(v => {
					context.strokeStyle = `hsla(${v*50 + randomColorPosition}, 60%, 50%, ${1.1 - v})`
					const slx = lerp(sl.sx, sl.ex, v);
					const elx = lerp(el.sx, el.ex, v);
					context.beginPath();
					context.moveTo(slx, sl.f(slx))
					context.lineTo(elx, el.f(elx))
					context.closePath();
					context.stroke();
				})
			})
			
			console.log(nUnions, nLines, random.getSeed())
		};
	wrapper();
	document.addEventListener('keypress', () => { drawLines = !drawLines; wrapper() });
	}
};

canvasSketch(sketch, settings);
