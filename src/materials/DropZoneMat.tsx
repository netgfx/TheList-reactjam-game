import React, { useMemo } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
//
export function RingMat(props: any) {
  const { outerCamera } = props
  function InnerRing() {
    const ref = useRef()
    const vertexShader = `
  varying vec2 vUv;
  uniform float uTime;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

    const fragmentShader = `
  uniform float thickness;
  uniform float radius;
  uniform vec3 color;
  uniform float uTime;
  varying vec2 vUv;
  uniform vec3 resolution;

  float drawCircle(float r, float polarRadius, float thickness)
    {
      return 	smoothstep(r, r + thickness, polarRadius) - 
              smoothstep(r + thickness, r + 2.0 * thickness, polarRadius);
    }

    float sin01(float v)
    {
      return 0.5 + 0.5 * sin(v);
    }

  void main() {
    vec2 uv = vUv.xy;
    float dist = distance(vUv, vec2(0.5));
    float alpha = smoothstep(radius - thickness, radius, dist) - smoothstep(radius, radius + thickness, dist);
    // Center the coordinates and apply the aspect ratio
    vec2 p = uv - vec2(0.5) + vec2(0.05, 0.05);
    p.x *= resolution.x / resolution.y;

    // Calculate polar coordinates
    float pr = length(p);
    float pa = atan(p.y, p.x); // * 3.0 / 3.14;
    // Draw the circles
      float o = 0.0;
      float inc = 0.0;

      for( float i = 1.0 ; i < 8.0 ; i += 1.0 )
      {
        float baseradius = 0.2;// * ( 0.3 + sin01(uTime * 0.2) ); 
        float radius = baseradius + inc;

        radius += 0.01 * ( sin01(pa * i + uTime * (i - 1.0) ) );

        o += drawCircle(radius, pr, 0.008 * (1.0 + 0.02 * (i - 1.0)));

        inc += 0.005;
      }

      //vec3 bcol = vec3(1.0, 0.22, 0.5 - 0.4*p.y) * (1.0 - 0.6 * pr * color.x);
      // vec3 bcol = vec3(1.0, 1.0, 1.0);
      // vec3 col = mix(bcol, vec3(1.0,1.0,0.7), o);
    
    gl_FragColor = vec4(vec3(1.0,1.0,0.), o);
  }
`

    const { viewport, size } = useThree()

    useFrame((state, delta) => {
      if (ref.current) {
        ref.current.uniforms.uTime.value += delta
        //console.log(ref.current.uniforms.uTime.value)
      }
    })

    return (
      <shaderMaterial
        transparent={true}
        //alphaTest={0.1}
        ref={ref}
        uniforms={{
          uTime: { value: 0 },
          // thickness: { value: 0.05 },
          // radius: { value: 0.4 },
          // color: { value: new THREE.Color('yellow') },
          resolution: { value: new THREE.Vector3(10, 10, 0) }
        }}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    )
  }

  const Ring = useMemo(() => <InnerRing />, [outerCamera])

  return <>{Ring}</>
}
