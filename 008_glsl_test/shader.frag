uniform vec2 u_resolution;
uniform float u_time;

void make_rectangle(in vec4 corners, out vec3 col) {
}

void main(void)
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = (gl_FragCoord.xy/u_resolution.xy - 0.5) * 2. * 5.;
    float factor = u_resolution.x / u_resolution.y;

    uv.x *= factor;
    float xx = uv.x*uv.x;
    float yy = uv.y*uv.y;

    float fraction = ((cos(u_time) + 1.1)/2. + 1.)/100.;

    float v = sin((xx + yy)/fraction + u_time*9.)/.9;
    vec3 col = vec3(v + sin(u_time), .2, v + cos(u_time));

    factor = (sin(u_time) + 1.)/2. + .2;
    vec3 col2 = vec3(step(factor/3.-.06, 1.), .1, factor);
    col += col2;


    // Output to screen
    gl_FragColor = vec4(col,1.0);
}
