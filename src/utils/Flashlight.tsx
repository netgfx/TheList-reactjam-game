import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export function Flashlight(props) {
  const lightRef = useRef()

  useFrame((state, delta) => {
    if (lightRef.current) {
      //lightRef.current.position.copy(state.camera.position)
      //lightRef.current.target.position.set(0, 0, 1).applyMatrix4(state.camera.matrixWorld)
    }
  })

  return (
    <group {...props}>
      <pointLight ref={lightRef} angle={-Math.PI / 6} color={'#fec72c'} intensity={0.5} />
    </group>
  )
}
