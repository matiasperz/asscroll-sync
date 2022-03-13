import tunnel from 'tunnel-rat'

const webgl = tunnel()

export const WebGLOut = webgl.Out

export const WebGL = webgl.In