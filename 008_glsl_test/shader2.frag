uniform vec2 u_resolution;
uniform float u_time;

float rand(float n){return fract(sin(n) * 43758.5453123);}

// Source: https://www.shadertoy.com/view/XljGzV
vec3 hsl2rgb( in vec3 c ) {
    vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );

    return c.z + c.y * (rgb-0.5)*(1.0-abs(2.0*c.z-1.0));
}

float lambda(float x) {
	return exp(x);
}

void main(void)
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 o_uv = (gl_FragCoord.xy / u_resolution.xy);
    vec2 uv = (o_uv - 0.5) * 2. * 5.;
    float factor = u_resolution.x / u_resolution.y;
    uv.x *= factor;

    vec3 col = vec3(0.);

    float theta = atan(uv.y, uv.x);
    vec2 point = vec2(cos(theta + u_time), sin(theta - u_time));
    float _distance = distance(point, uv);
    
    float intensity = 1. - clamp(_distance/.9, 0., 1.);
    float state = uv.x + uv.y * u_resolution.y;

	col = hsl2rgb(vec3(o_uv.y * .4 + .8, .5, intensity/1.1));

    // Output to screen
    gl_FragColor = vec4(col, 1.0);
}
