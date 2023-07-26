/* eslint-disable */
import { CameraControls, Loader } from '@react-three/drei'
import React, { useEffect, useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Suspense, useState } from 'react'
import * as THREE from 'three'
import { generateMaze } from './utils/utils'
import { useGame } from './utils/useGame'
import { MainScene } from './MainScene'
import { MenuScene } from './MenuScene'

const count = 1000

const random = (min: number, max: number) => Math.random() * (max - min) + min

const step = () => {}

function Dots() {
  return null
}

var options = {
  gridSize: [140, 140],
  cellSize: 1.0,
  cellThickness: 1.0,
  cellColor: '#f1f1f1',
  sectionSize: 5.0,
  sectionThickness: 1.5,
  sectionColor: 'orange', //'#00ffd9',
  fadeDistance: 150,
  fadeStrength: 1,
  followCamera: true,
  infiniteGrid: true
}

export function App() {
  const [maze, setMaze] = useState([])
  const setBlocks = useGame((state: any) => state.setBlocks)
  const blocks = useGame((state: any) => state.blocks)
  const [menu, setMenu] = useState(false)

  const activeAnimation: {
    forward: boolean
    backward: boolean
    left: boolean
    right: boolean
    idle: boolean
  } = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    idle: true
  }

  // add mechanic here
  useEffect(() => {
    var maze = generateMaze(8, 8, Math.random() * 100000)
    // var test = [
    //   [{ x: 0, y: 0, top: true, left: true, bottom: true, right: false }],
    //   [
    //     {
    //       x: 1,
    //       y: 0,
    //       top: true,
    //       left: false,
    //       bottom: false,
    //       right: true
    //     }
    //   ]
    // ]
    console.log(maze)
    setMaze(maze)
    setBlocks(maze)
  }, [])

  useEffect(() => {
    console.log('blocks: ', blocks)
    // add table
  }, [blocks])

  useEffect(() => {
    console.log('menu is finally: ', menu)
  }, [menu])

  return (
    <>
      <Canvas camera={{ fov: 80, aspect: window.innerWidth / window.innerHeight, far: 2000, close: 1 }}>
        {menu && <MainScene blocks={blocks} />}
        {!menu && (
          <>
            <Suspense fallback={null}>
              <MenuScene setMenu={setMenu} />
            </Suspense>
          </>
        )}
      </Canvas>
      <Loader />
    </>
  )
}
