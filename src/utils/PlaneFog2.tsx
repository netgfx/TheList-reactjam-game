import * as THREE from 'three'
import { useRef } from 'react'
import { extend, useFrame, useThree } from '@react-three/fiber'
import { shaderMaterial, useFBO } from '@react-three/drei'

const FogMaterial = shaderMaterial(
  {
    tDiffuse: null,
    depthTexture: null,
    projectionMatrixInverse: new THREE.Matrix4(),
    viewMatrixInverse: new THREE.Matrix4(),
    cameraPos: new THREE.Vector3(),
    depthColor: new THREE.Color('black'),
    fogNormal: new THREE.Vector3(0, 1, 0),
    transitionLength: 1.0,
    fogOffset: 0,
    uMin: 0.025,
    uMax: 0.1
  },
  ` varying vec2 vUv;
    varying vec2 vTexCoords;
    varying vec4 vWorldCoords;
    void main() {
      vUv = uv;      
      vec4 modelPosition = modelMatrix * vec4(position, 1);
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectionPosition = projectionMatrix * viewPosition;
      vTexCoords = uv;
      vWorldCoords = modelPosition;
      gl_Position = vec4(2.0 * uv - 1.0, 0.0, 1.0);
    }`,
  ` uniform highp sampler2D tDiffuse;
    uniform highp sampler2D depthTexture;
    uniform mat4 projectionMatrixInverse;
    uniform mat4 viewMatrixInverse;
    uniform vec3 cameraPos;
    uniform vec3 depthColor;
    uniform vec3 fogNormal;
    uniform float fogOffset;
    uniform float transitionLength;
    uniform float uMin;
    uniform float uMax;
    varying vec2 vUv;
    varying vec2 vTexCoords;
    varying vec4 vWorldCoords;    
    vec3 worldCoordinatesFromDepth(float depth, vec2 vUv) {
      float z = depth * 2.0 - 1.0;
      vec4 clipSpaceCoordinate = vec4(vUv * 2.0 - 1.0, z, 1.0);
      vec4 viewSpaceCoordinate = projectionMatrixInverse * clipSpaceCoordinate;
      viewSpaceCoordinate /= viewSpaceCoordinate.w;
      vec4 worldSpaceCoordinates = viewMatrixInverse * viewSpaceCoordinate;
      return worldSpaceCoordinates.xyz;
    }
    #include <common>
    #include <dithering_pars_fragment>
    void main() {
      vec2 uv = vTexCoords;

      vec4 diffuse = texture2D(tDiffuse, uv);
      float depth = texture2D(depthTexture, uv).x;
      vec3 worldPos = worldCoordinatesFromDepth(depth, uv);
      vec3 rayDir = normalize(worldPos - cameraPos);
      if (depth == 1.0) {
        worldPos = cameraPos + rayDir * 1e6;
      }
      worldPos += fogNormal * -fogOffset;
      vec3 offsetCameraPos = cameraPos + fogNormal * -fogOffset;
      float a = uMin;
      float b = uMax;
      float camStartAlongPlane = dot(offsetCameraPos, fogNormal);
      float rayAlongPlane = dot(rayDir, fogNormal);
      float fogAmount =  (a/b) * max(abs(exp(-camStartAlongPlane*b)), 1e-20) * (1.0-exp( -distance(cameraPos, worldPos)*rayAlongPlane*b ))/rayAlongPlane;
      diffuse.rgb = mix(diffuse.rgb, depthColor, 1.0 - exp(-fogAmount));

      gl_FragColor = vec4(diffuse.rgb, 1.0);
      #include <dithering_fragment>
    }`
)

export default function PlaneFog({
  samples = 8,
  args = [1, 1],
  scale = 10,
  speed = 10,
  color = 'black',
  min = 0.025,
  max = 0.1,
  animate = false,
  ...meshProps
}) {
  extend({ FogMaterial })
  const meshRef = useRef()
  const camera = useThree((state) => state.camera)
  const target = useFBO({ depth: true, samples })

  const camPos = new THREE.Vector3()
  const meshPos = new THREE.Vector3()
  const meshDir = new THREE.Vector3()
  const meshOffset = new THREE.Vector3()

  useFrame((state) => {
    meshRef.current.visible = false
    state.gl.setRenderTarget(target)
    state.gl.render(state.scene, state.camera)
    meshRef.current.visible = true

    meshRef.current.getWorldPosition(meshPos)
    meshRef.current.material.cameraPos = camera.getWorldPosition(camPos)
    meshRef.current.material.fogNormal = meshDir.copy(meshPos).normalize()
    meshRef.current.material.fogOffset = meshOffset.copy(meshPos).length()

    state.gl.setRenderTarget(null)
  })
  return (
    <mesh ref={meshRef} rotation-x={-Math.PI / 2} scale={scale} {...meshProps}>
      <planeGeometry args={args} />
      <fogMaterial
        transparent
        depthColor={color}
        uMin={min}
        uMax={max}
        tDiffuse={target.texture}
        depthTexture={target.depthTexture}
        projectionMatrixInverse={camera.projectionMatrixInverse}
        viewMatrixInverse={camera.matrixWorld}
        cameraPos={camera.position}
        defines={{ WAVES: animate }}
      />
    </mesh>
  )
}
