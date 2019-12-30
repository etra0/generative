#!/bin/bash
arg=""
if [ ! -f "$1/sketch.js" ]; then
    echo "no existe $1/sketch.js, creando..."
    arg="--new"
fi
exec canvas-sketch $1/sketch.js $arg --output="$1/output/"
