import { useRef } from 'react'
import { Text, Html, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import React from 'react'
import { useFrame, useThree } from '@react-three/fiber'

import { useGame } from './utils/useGame'

export function Instructions(props: any) {
  const { setShowInstructions, type } = props
  const noteRef = useRef()

  const note = useTexture('https://gwcjylrsyylsuacdrnov.supabase.co/storage/v1/object/public/game/note.png')
  const fontProps = {
    font: 'https://gwcjylrsyylsuacdrnov.supabase.co/storage/v1/object/public/game/YA9dr0Wd4kDdMthROCc.woff',
    fontSize: 0.07,
    letterSpacing: -0.05,
    lineHeight: 1.4,
    color: 'black',
    textAlign: type === 'gameover' ? 'center' : 'left',
    'material-toneMapped': false
  }

  const instructions = {
    victory: 'Congradulations!\n\nAll items have been found\nand the party is ready to begin!\n\n\nPress anywhere to restart...',
    gameover: 'Game Over!\n\nBetter luck next time!\n\n\nPress anywhere to restart...',
    instructions: `How to Play!\n\n- Use W, S, D, A to move around\n- Move over items to pick them up\n- You can only carry one item\n- Press E when at the party area table\nto deposit the item\n- Find all the items from The List\nbefore the party begins\n\nGood Luck!`
  }

  const { camera } = useThree()

  const closeNote = () => {
    if (type === 'instructions') {
      setShowInstructions(false)
    } else if (type === 'victory') {
      window.location.reload()
    } else if (type === 'gameover') {
      window.location.reload()
    }
  }

  useFrame(() => {
    //console.log(playerBodyRef.current?.translation())
    if (noteRef.current) {
      var rotation = new THREE.Vector3()

      noteRef.current.position.copy(camera.position)
      noteRef.current.position.set(noteRef.current.position.x - 1.5, noteRef.current.position.y, noteRef.current.position.z)
      noteRef.current.rotation.copy(camera.rotation)
      noteRef.current.position.copy(camera.position).add(camera.getWorldDirection(rotation).multiplyScalar(1))
    }
  })

  return (
    <group ref={noteRef} scale={0.6} onClick={closeNote}>
      <Text {...fontProps} rotation={[0, 0, 0]} position={[0, 0, 0.4]}>
        {instructions[type]}
      </Text>
      <mesh>
        <planeGeometry args={[1.6, 2.1]} />
        <meshBasicMaterial map={note} transparent={true} side={THREE.DoubleSide} />
      </mesh>

      <Html center position={[0, -2.0, 0.1]}>
        <a
          href="#"
          className="original-button"
          onClick={(e) => {
            e.preventDefault()
            setMenu(true)
          }}>
          Start!
        </a>
      </Html>
    </group>
  )
}
