const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 2048, 2048 ]
};

const sketch = () => {
  const points_amount = 40;
	const points_width = 5;

    
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
		context.strokeStyle = 'white';

		const rectangle = () => {
			context.rect(0, 0, 1, 1)
			context.lineWidth = 0.001;
			context.stroke();
		}

		const drawLoop = (direction) => {
			rectangle();
			const nAngles = 200;
			const angles = [...Array(nAngles)].map((_, i) => ((i+1)/nAngles)*2*Math.PI*direction)

			angles.forEach((v, i) => {
				context.translate(.05, .05);
				context.scale(.9, .9);
				context.translate(.5, .5)
				context.rotate(v);
				context.translate(-.5, -.5)
				rectangle();
			});
		}

		context.translate(width*.1, height*.1);
		context.scale(width*.8, height*.8);

		let v = 1;
		for (let i = 0; i < 5; i++) {
			for (let j = 0; j < 5; j++) {
				context.save()
				context.translate(0.2*i, 0.2*j);
				context.scale(0.2, 0.2);
				drawLoop(v);
				v *= -1;
				context.restore();
			}
		}

  };
};

canvasSketch(sketch, settings);
