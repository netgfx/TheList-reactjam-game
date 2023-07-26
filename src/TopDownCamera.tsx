import React, { useRef, useState, useEffect, useMemo } from 'react'
import { OrthographicCamera, useKeyboardControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { Raycaster } from 'three'

export enum CameraType {
  Orthographic = 'Orthographic',
  Perspective = 'Perspective'
}

export const TopDownCamera: React.FC = (props: any) => {
  const { type, player, blocks } = props
  const playerState = useState(player)
  const [cameraType, setCameraType] = useState(type)
  const cameraRef = useRef<THREE.OrthographicCamera>(null)
  const perspCameraRef = useRef<THREE.PerspectiveCamera>(null)
  const [persCam, setPersCam] = useState()
  const rotationRef = useRef<any>(false)
  const currentPosition = new THREE.Vector3()
  const [, get] = useKeyboardControls()
  const { camera } = useThree()
  const [firstPerson, setFirstPerson] = useState(true)
  const deg2rad = (degrees: number) => degrees * (Math.PI / 180)

  const useForwardRaycast = (obj: any) => {
    const raycaster = useMemo(() => new Raycaster(), [])
    const pos = useMemo(() => new THREE.Vector3(), [])
    const dir = useMemo(() => new THREE.Vector3(), [])
    const scene = useThree((state) => state.scene)

    return () => {
      if (!obj.current) return []
      raycaster.set(obj.current.getWorldPosition(pos), obj.current.getWorldDirection(dir))
      return raycaster.intersectObjects(scene.children)
    }
  }

  function MapToggle(props: any) {
    const [, get] = useKeyboardControls()
    const mapPressed = useKeyboardControls((state) => state.map)

    useEffect(() => {
      // console.log(map, drop, mapPressed)
      if (mapPressed !== null && mapPressed !== undefined) {
        setFirstPerson(!mapPressed)
        setCameraType(mapPressed === false ? CameraType.Perspective : CameraType.Orthographic)
      }
    }, [mapPressed])

    return null
  }

  useEffect(() => {
    if (firstPerson === true) {
      setCameraType(CameraType.Perspective)
    } else {
      setCameraType(CameraType.Orthographic)
    }

    //console.log(rotationRef.current, firstPerson)
    if (firstPerson === true && rotationRef.current === false) {
      window.setTimeout(() => {
        rotationRef.current = true
        if (blocks[0][0].bottom === false) {
          camera.rotation.set(0, deg2rad(180), 0)
        } else if (blocks[0][0].right === false) {
          camera.rotation.set(0, deg2rad(-90), 0)
        }
      }, 100)
    }
    //console.log(firstPerson, cameraType)
  }, [firstPerson])

  const calculateIdealOffset = () => {
    const idealOffset = new THREE.Vector3(-2, 1.0, 0)
    idealOffset.applyQuaternion(player.source.current.quaternion)
    idealOffset.add(player.source.current.position)
    return idealOffset
  }

  const calculateIdealLookat = () => {
    const idealLookat = new THREE.Vector3(5.0, -2, 0.0)
    idealLookat.applyQuaternion(player.source.current.quaternion)
    idealLookat.add(player.source.current.position)
    return idealLookat
  }

  const updateCameraPosition = (delta: any) => {
    const idealOffset = calculateIdealOffset()
    //const idealLookat = calculateIdealLookat()
    const t = 1.0 - Math.pow(0.01, delta)

    currentPosition.lerp(idealOffset, t)
    //currentLookAt.lerp(idealLookat, t)

    perspCameraRef.current.position.copy(currentPosition)
    //console.log(firstPerson)
    const idealLookat = calculateIdealLookat()
    perspCameraRef.current.lookAt(idealLookat)
    //controlsRef.current?.update(state.clock.getDelta())
    perspCameraRef.current.updateProjectionMatrix()
  }

  useFrame((state, delta) => {
    if (cameraType === null) return
    if (cameraType === CameraType.Perspective && player.body.current) {
      const SPEED = 5
      const direction = new THREE.Vector3()
      const frontVector = new THREE.Vector3()
      const sideVector = new THREE.Vector3()
      const rotation = new THREE.Vector3()
      const velocity = player.body.current.linvel()

      const { forward, backward, left, right, map } = get()

      const vec = new THREE.Vector3()
      const target = new THREE.Vector3(0, 0, 0)

      //target.lerp(player.body.current.getWorldPosition(vec), 0.02)

      var translation = player.body.current.translation()

      //console.log(translation)

      state.camera.position.copy(translation)
      //state.camera.updateProjectionMatrix()

      frontVector.set(0, 0, backward - forward)
      sideVector.set(left - right, 0, 0)
      //console.log(backward, forward, left, right)
      direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(SPEED).applyEuler(state.camera.rotation)
      player.body.current.setLinvel({ x: direction.x, y: velocity.y, z: direction.z }, true)

      //modifyPlayerState(delta)
    } else if (firstPerson === false) {
      // Set the camera rotation to look directly down (top-down view)
      cameraRef.current.rotation.set(-Math.PI / 2, 0, 0)
      //state.camera.zoom = -30

      var pos = new THREE.Vector3()
      var translation = player.body.current.translation()
      pos.copy(translation) //.getWorldPosition(pos)

      //state.camera.position.set([pos.x, -10, pos.z])
      //cameraRef.current.lookAt(player.source.current)
      //console.log(pos)
      cameraRef.current.position.x = pos.x
      cameraRef.current.position.z = pos.z
      cameraRef.current.updateProjectionMatrix()
    }
  })

  return (
    <group>
      <MapToggle />
      {cameraType === CameraType.Orthographic && (
        <OrthographicCamera
          makeDefault={cameraType === CameraType.Orthographic}
          {...props}
          ref={cameraRef}
          rotation={[-Math.PI / 2, 0, 0]}
          zoom={30}
        />
      )}

      {/* <PerspectiveCamera
        {...props}
        makeDefault={cameraType === CameraType.Perspective}
        ref={perspCameraRef}
        //position={[0, 1, 1]}
      /> */}

      {/* <CameraControls ref={controlsRef} camera={perspCameraRef.current} /> */}
    </group>
  )
}
