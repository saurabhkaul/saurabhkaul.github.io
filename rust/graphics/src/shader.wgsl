struct Uniforms { view: vec4<f32> };
@group(0) @binding(0) var<uniform> uniforms: Uniforms;
struct Output { @builtin(position) position: vec4<f32>, @location(0) uv: vec2<f32> };
@vertex
fn vs_main(@builtin(vertex_index) index: u32) -> Output {
    var corners = array<vec2<f32>,3>(vec2<f32>(-1.0,-1.0),vec2<f32>(3.0,-1.0),vec2<f32>(-1.0,3.0));
    var out: Output;
    out.position = vec4<f32>(corners[index],0.999,1.0);
    out.uv = corners[index];
    return out;
}
fn hash(p: vec2<f32>) -> f32 { return fract(sin(dot(p,vec2<f32>(127.1,311.7)))*43758.5453); }
@fragment
fn fs_main(in: Output) -> @location(0) vec4<f32> {
    let uv = in.uv*vec2<f32>(uniforms.view.z,1.0);
    let time = uniforms.view.w;
    let pixel = max(fwidth(uv.x),fwidth(uv.y));
    let horizon = -0.24;
    let sky = clamp((uv.y-horizon)/1.4,0.0,1.0);
    var color = mix(vec3<f32>(0.65,0.10,0.40),vec3<f32>(0.055,0.025,0.19),pow(sky,0.55));
    // Sunset disk and classic horizontal cuts, off to one side of the bust.
    let sun_uv = uv-vec2<f32>(0.65,0.23);
    let disk = 1.0-smoothstep(0.47-pixel,0.47+pixel,length(sun_uv));
    let stripe = smoothstep(0.12,0.16,abs(fract((sun_uv.y+0.5)*10.0)-0.5));
    let cut = select(stripe,1.0,sun_uv.y>0.05);
    let sun = mix(vec3<f32>(1.0,0.1,0.55),vec3<f32>(1.0,0.66,0.3),clamp(sun_uv.y+0.5,0.0,1.0));
    color = mix(color,sun,disk*cut);
    let cell = floor(uv*32.0);
    let star = 1.0-smoothstep(0.015,0.06,length(fract(uv*32.0)-vec2<f32>(hash(cell),hash(cell+7.0))));
    color += vec3<f32>(0.4,0.6,0.8)*star*step(0.97,hash(cell+3.0))*smoothstep(0.1,0.8,uv.y);
    // Perspective floor. Clamp the horizon singularity before derivatives.
    let depth = 1.0/max(horizon-uv.y,0.012);
    let grid_uv = vec2<f32>(uv.x*depth*1.6,depth*0.75-time*0.18);
    let grid = abs(fract(grid_uv+0.5)-0.5);
    let aa = max(fwidth(grid_uv),vec2<f32>(0.001));
    let lines = 1.0-smoothstep(vec2<f32>(0.0),aa*1.2,grid);
    if (uv.y<horizon) {
        let fade = smoothstep(0.0,0.35,horizon-uv.y);
        color = vec3<f32>(0.045,0.025,0.14)+vec3<f32>(0.25,0.025,0.4)*fade;
        color += mix(vec3<f32>(0.65,0.08,0.65),vec3<f32>(0.06,0.65,0.8),clamp(-uv.y,0.0,1.0))*max(lines.x,lines.y)*fade*0.65;
        // Soft grounding shadow under the statue.
        color *= 1.0-0.6*exp(-pow(uv.x/0.55,2.0)-pow((uv.y+0.78)/0.13,2.0));
    }
    let vignette = 1.0-0.22*smoothstep(0.4,1.7,length(uv));
    return vec4<f32>(color*vignette,1.0);
}
