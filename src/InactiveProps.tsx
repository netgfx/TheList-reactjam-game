import { CameraControls, shaderMaterial } from '@react-three/drei'
import { useRapier } from '@react-three/rapier'
import React, { useEffect, useRef } from 'react'
import { useFrame, useThree, extend } from '@react-three/fiber'
import { PartyTable } from './units/party-table'
import * as THREE from 'three'
import { RingMat } from './materials/DropZoneMat'
import { useGame } from './utils/useGame'
import { SimpleBirthdayCake } from './units/SimpleBirthdayCake'

//import { DropZoneMat } from './materials/DropZoneMat'

//
export function InactiveProps(props: any) {
  const { blocks, outerCamera } = props
  const controls = useRef()
  const dropZoneRef = useRef()
  const tableItems = useGame((state: any) => state.tableItems)
  const { width: w, height: h } = useThree((state) => state.viewport)
  const {
    camera,
    size,
    scene,
    gl: { domElement }
  } = useThree()

  useEffect(() => {
    let lastItem = blocks[blocks.length - 1][blocks[blocks.length - 1].length - 1]

    if (controls.current) {
      //console.log(controls.current)
      //controls.current?.moveTo(2.5 + lastItem.x * 5, 0, 2 + lastItem.y * 5, true)
    }
    //console.log(lastItem)
  }, [blocks])

  const getLastItem = () => {
    if (blocks) {
      let lastItem = blocks[blocks.length - 1][blocks[blocks.length - 1].length - 1]

      return [2.5 + lastItem.x * 5.0, -1.65, -3.2 + lastItem.y * 5]
    } else {
      return [0, 0, 0]
    }
  }

  const getItems = () => {
    const renderItems: React.JSX.Element[] = []
    if (tableItems.length > 0) {
      tableItems.forEach((element: string) => {
        if (element === 'cake') {
          renderItems.push(<BirthdayCake position={getLastItem()} />)
        }
      })
    }

    console.log(tableItems, renderItems)
    return <>{renderItems}</>
  }

  return (
    <group>
      <PartyTable position={getLastItem()} scale={[0.0045, 0.0045, 0.0045]} />
      <mesh
        position={[getLastItem()[0] + 0.5, getLastItem()[1], getLastItem()[2]]}
        //scale={[0.95, 0.95, 0.95]}
        rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 10, 10]} />
        {/* <meshBasicMaterial color={'red'} side={THREE.DoubleSide} /> */}
        <RingMat outerCamera={outerCamera} />
      </mesh>

      <mesh
        position={[2.5, 0, 2.5]}
        //scale={[0.95, 0.95, 0.95]}
        rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[5, 5, 5]} />
        {/* <meshBasicMaterial color={'red'} side={THREE.DoubleSide} /> */}
        <RingMat outerCamera={outerCamera} />
      </mesh>

      {tableItems.map((item: string, index: number) => {
        if (item === 'cake') {
          return <SimpleBirthdayCake key={index} position={getLastItem()} scale={1.45} />
        }
      })}

      {/* {outerCamera === null && <CameraControls ref={controls} makeDefault camera={camera} />} */}
    </group>
  )
}
