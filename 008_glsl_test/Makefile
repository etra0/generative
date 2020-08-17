out.mp4: images
	ffmpeg.exe -i %05d.png -c:v h264_nvenc -b:v 1M -vf fps=60 out.mp4

images: shader.frag
	glslViewer.exe $^ -E sequence,0,10 --headless -w 1080 -h 1920

.PHONY: images
