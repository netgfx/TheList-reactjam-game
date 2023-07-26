import { Suspense, useEffect, useRef, useState } from 'react'
import { Floor } from './Floor'
import { useControls } from 'leva'
import { MenuHouse } from './units/MenuHouse'
import { Skybox } from './Skybox'
import { CameraControls, Html, useTexture, Text } from '@react-three/drei'
import React from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
//
export function MenuScene(props: any) {
  const { setMenu } = props
  const controls = useRef()
  const note = useTexture('https://gwcjylrsyylsuacdrnov.supabase.co/storage/v1/object/public/game/note.png')
  const [start, setStart] = useState(false)
  const noteRef = useRef()
  const fontProps = {
    font: 'https://gwcjylrsyylsuacdrnov.supabase.co/storage/v1/object/public/game/YA9dr0Wd4kDdMthROCc.woff',
    fontSize: 0.12,
    letterSpacing: -0.05,
    lineHeight: 1.2,
    color: 'black',
    textAlign: 'center',
    'material-toneMapped': false
  }
  const [hovered, setHovered] = useState(false)
  const menu = useControls({
    menu: {
      options: [false, true]
    }
  })

  useEffect(() => {
    console.log('menu:', menu)
    setMenu(menu.menu)
  }, [menu])

  useEffect(() => {
    controls.current.mouseButtons.right = 0
    controls.current.mouseButtons.left = 0
    controls.current.mouseButtons.wheel = 0
    controls.current.mouseButtons.middle = 0
    // controls.current.moveTo(0.5, 1.8, 0, true)
    // controls.current.rotateTo(Math.PI * 1, Math.PI / 2, true)
    controls.current.moveTo(-5, 10, -50, true)
    controls.current.rotateTo(Math.PI * 1.1, Math.PI / 3, true)
  }, [])

  useEffect(() => {
    if (start) {
      controls.current.moveTo(0.5, 1.8, 0, true)
      controls.current.rotateTo(Math.PI * 1, Math.PI / 2, true)
    }
  }, [start])

  // Subscribe this component to the render-loop
  useFrame((state, delta) => {
    // Linearly interpolate the scale of the mesh towards the target value
    const targetScale = hovered ? 1.25 : 0.55
    noteRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 5)
  })

  const zoomNote = () => {
    setHovered(true)
  }

  const zoomOutNote = () => {
    setHovered(false)
  }

  return (
    <>
      <color attach="background" args={[0x1e1e1e]} />
      <ambientLight intensity={0.25} />
      {/* <hemisphereLight intensity={0.14} color={'#fec72c'} /> */}
      {/* <pointLight position={[0, 10, 10]} intensity={1} /> */}
      <directionalLight position={[0, 10, 10]} color="#fec72c" />
      <Suspense>
        <Floor position={[0, -3, 0]} blocks={[]} menu={true} />
      </Suspense>
      <MenuHouse scale={[0.002, 0.002, 0.002]} position={[0, -1.25, 0]} />

      {/* NOTE */}
      <group ref={noteRef} scale={0.55} onPointerOver={zoomNote} onPointerOut={zoomOutNote} position={[0.75, 1.8, -3.2]}>
        <Text
          {...fontProps}
          rotation={[0, -Math.PI, 0]}
          position={[
            0,
            0,
            -0.1
          ]}>{`Hey pumpkin!\n\nThe party will\nstart soon in the garden\nbut the catering made a mess\nplease try to locate the things\nfrom my List.\n\nMom xoxo!`}</Text>
        <mesh>
          <planeGeometry args={[1.6, 2.1]} />
          <meshBasicMaterial map={note} transparent={true} side={THREE.DoubleSide} />
        </mesh>

        {start && (
          <Html center position={[0, -2.0, 0.1]}>
            <a
              href="#"
              className="original-button"
              onClick={(e) => {
                e.preventDefault()
                setMenu(true)
              }}>
              Go to garden
            </a>
          </Html>
        )}
      </group>
      <Skybox
        src={'https://gwcjylrsyylsuacdrnov.supabase.co/storage/v1/object/public/game/sky_urban_summer_sky_mid_of_day_green_fields.jpg'}
        depth={
          'https://gwcjylrsyylsuacdrnov.supabase.co/storage/v1/object/public/game/sky_urban_summer_sky_mid_of_day_green_fields_dep.jpg'
        }
      />
      {!start && (
        <Html center>
          <div className="panel">
            <div className="titleWrapper">
              <h1>The List</h1>
            </div>
            <a
              href="#"
              className="original-button"
              onClick={(e) => {
                e.preventDefault()
                setStart(true)
              }}>
              START
            </a>
          </div>
        </Html>
      )}
      <CameraControls ref={controls} makeDefault />
    </>
  )
}
