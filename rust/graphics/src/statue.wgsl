struct Uniforms { view: vec4<f32> };
@group(0) @binding(0) var<uniform> uniforms: Uniforms;
struct Output {
    @builtin(position) position: vec4<f32>,
    @location(0) normal: vec3<f32>,
    @location(1) point: vec3<f32>,
};
fn rotate(p: vec3<f32>) -> vec3<f32> {
    let a = uniforms.view.x;
    let b = uniforms.view.y;
    let q = vec3<f32>(p.x*cos(a)+p.z*sin(a), p.y, -p.x*sin(a)+p.z*cos(a));
    return vec3<f32>(q.x, q.y*cos(b)-q.z*sin(b), q.y*sin(b)+q.z*cos(b));
}
@vertex
fn vs_main(@location(0) point: vec3<f32>, @location(1) normal: vec3<f32>) -> Output {
    let p = rotate(point);
    let distance = 5.5-p.z;
    var out: Output;
    out.position = vec4<f32>(p.x*3.5/uniforms.view.z, (p.y-0.05)*3.5, distance * (20.0 / 19.9) - (2.0 / 19.9), distance);
    out.normal = rotate(normal);
    out.point = point;
    return out;
}
@fragment
fn fs_main(in: Output) -> @location(0) vec4<f32> {
    let n = normalize(in.normal);
    let key = max(dot(n, normalize(vec3<f32>(-0.8,1.2,1.7))), 0.0);
    let cyan = max(dot(n, normalize(vec3<f32>(1.0,0.4,0.3))),0.0);
    let pink = max(dot(n, normalize(vec3<f32>(-1.0,0.2,-0.4))),0.0);
    let vein = pow(0.5+0.5*sin(in.point.y*24.0+sin(in.point.x*15.0+in.point.z*8.0)*2.0), 18.0);
    let marble = vec3<f32>(0.77,0.75,0.82) * (1.0-vein*0.10);
    let lighting = vec3<f32>(0.14,0.08,0.22) + vec3<f32>(0.88,0.65,0.75)*key
        + vec3<f32>(0.05,0.65,0.85)*cyan*0.65 + vec3<f32>(0.9,0.05,0.5)*pink*0.7;
    let rim = pow(1.0-abs(n.z),3.0)*0.14;
    return vec4<f32>(marble*lighting + vec3<f32>(0.25,0.65,0.85)*rim, 1.0);
}
