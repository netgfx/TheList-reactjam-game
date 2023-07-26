import { useLayoutEffect } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useLoader } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'

export function Skybox({ src, depth }) {
  const gl = useThree((state) => state.gl)
  const scene = useThree((state) => state.scene)
  const texture = useTexture(src)
  useLayoutEffect(() => {
    const oldBg = scene.background

    texture.colorSpace = gl.outputColorSpace
    const rt = new THREE.WebGLCubeRenderTarget(texture.image.height)
    rt.fromEquirectangularTexture(gl, texture)
    rt.texture.minFilter = THREE.NearestFilter
    rt.texture.magFilter = THREE.LinearFilter
    rt.texture.format = THREE.RGBAFormat
    rt.texture.generateMipmaps = false

    if (depth) {
      depth.minFilter = THREE.NearestFilter
      depth.magFilter = THREE.LinearFilter
      depth.format = THREE.RGBAFormat
      depth.generateMipmaps = false
      rt.depthTexture = depth
    }

    scene.background = rt.texture
    return () => (scene.background = oldBg)
  }, [texture])
}
