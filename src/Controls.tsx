import { Box, KeyboardControlsEntry, OrbitControls, Plane, PointerLockControls, useKeyboardControls } from '@react-three/drei'
import { useEffect, useRef, useState } from 'react'
import { KControls } from './MainScene'
//
export function Controls(props) {
  const controlsRef = useRef()
  const [sub, get] = useKeyboardControls<KControls>()
  const pointerLockRef = useRef()
  const [isLocked, setIsLocked] = useState(true)

  useEffect(() => {
    if (pointerLockRef.current) {
      if (props.enableLock === false) {
        pointerLockRef.current.unlock()
        window.setTimeout(() => setIsLocked(false), 100)
      }
    }

    if (props.enableLock === true) {
      window.setTimeout(() => setIsLocked(true), 100)
    }
  }, [props.enableLock])

  return (
    <>
      {isLocked === false && (
        <OrbitControls
          {...props}
          ref={controlsRef}
          enablePan={true}
          enableRotate={false}
          maxDistance={200}
          minDistance={10}
          maxZoom={100}
          minZoom={7.5}
        />
      )}
      {isLocked && <PointerLockControls ref={pointerLockRef} enabled={props.enableLock} />}
    </>
  )
}
