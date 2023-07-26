import { useGame } from './utils/useGame'
import { useRef, useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useKeyboardControls } from '@react-three/drei'
import { isInsideBox } from './utils/utils'
import * as THREE from 'three'
import _ from 'lodash'
// items
import { BirthdayCake } from './units/BirthdayCake'
//
export function Player(props: any) {
  const { pickUpItem, blocks, playerBody } = props
  const playerItem = useGame((state: any) => state.playerItem)
  const setPlayerItem = useGame((state: any) => state.setPlayerItem)
  const setTableItems = useGame((state: any) => state.setTableItems)
  const listItems = useGame((state: any) => state.listItems)
  const setListItems = useGame((state: any) => state.setListItems)
  const ref = useRef()
  const { camera } = useThree()

  const getLastItem = () => {
    if (blocks) {
      let lastItem = blocks[blocks.length - 1][blocks[blocks.length - 1].length - 1]

      return new THREE.Vector3(2.5 + lastItem.x * 5.0, -1.65, -3.2 + lastItem.y * 5)
    } else {
      return new THREE.Vector3(0, 0, 0)
    }
  }

  const removeFromList = (listItem: any) => {
    console.log('remove from list', listItem, list)
    var list = _.cloneDeep(listItems)
    const index = _.findIndex(list, (item: any) => item.replace('- ', '') === listItem)
    _.pullAt(list, index)
    console.log(list, index)
    if (index !== -1) {
      setListItems(list)
    }
  }

  function DropToggle(props: any) {
    const [, get] = useKeyboardControls()
    const { drop } = get()
    const dropPressed = useKeyboardControls((state) => state.drop)

    useEffect(() => {
      if (dropPressed !== null && dropPressed !== undefined) {
        if (dropPressed === true) {
          const result = isInsideBox(camera.position, getLastItem(), 5, 1, 5)
          let lastItem = blocks[blocks.length - 1][blocks[blocks.length - 1].length - 1]

          // can only drop item when near the table
          if (result) {
            setPlayerItem(null)
            setTableItems(pickUpItem)
            removeFromList(pickUpItem)
          }
          console.log('is near table: ', result)
        }
      }
    }, [drop, dropPressed])

    return null
  }

  useFrame((state) => {
    if (ref.current) {
      const rotation = new THREE.Vector3()
      //const cameraRotation = new THREE.Vector3()
      //cameraRotation.copy(camera.rotation)
      //const fix = new THREE.Euler(0.5, 0, 0)
      const direction = new THREE.Vector3()
      camera.getWorldDirection(direction)
      //direction.applyEuler(fix)
      //cameraRotation.y = 0
      //console.log(camera.getWorldDirection(rotation))
      const velocityVec = new THREE.Vector3()

      if (playerBody && ref.current.children.length > 0) {
        const velocity = playerBody.linvel()
        ref.current.children[0].rotation.x = THREE.MathUtils.lerp(
          ref.current.children[0].rotation.x,
          Math.sin((velocityVec.copy(velocity).length() > 1) * state.clock.elapsedTime * 10) / 6,
          0.1
        )
      }

      ref.current.position.copy(camera.position)
      //ref.current.position.set(ref.current.position.x - 1.5, ref.current.position.y + 0.5, ref.current.position.z - 0.5)
      ref.current.rotation.copy(camera.rotation)
      ref.current.position.copy(camera.position).add(direction.multiplyScalar(0.65))
      //wwwwwref.current.rotation.y += -0.5
      //ref.current.position.y += -0.25
      //ref.current.position.x += -0.25
    }
  })

  const getItem = () => {
    if (pickUpItem === 'cake') {
      return <BirthdayCake rotation={[Math.PI / 10, 0, 0]} objPosition={[0, -0.5, 0]} />
    }
    return null
  }
  return (
    <group ref={ref}>
      <DropToggle />
      {getItem()}
    </group>
  )
}
