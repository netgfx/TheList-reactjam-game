import { Box, useTexture } from '@react-three/drei'
import React from 'react'
import { useEffect, useState } from 'react'
import { getLine } from './utils/utils'
import { CuboidCollider, Physics, RigidBody } from '@react-three/rapier'
import * as THREE from 'three'
//
export function Cell(props: { maze: any }) {
  const { maze } = props
  const tex = useTexture({
    map: 'https://gwcjylrsyylsuacdrnov.supabase.co/storage/v1/object/public/game/Material.004_baseColor.png',
    //normalMap: 'https://gwcjylrsyylsuacdrnov.supabase.co/storage/v1/object/public/game/Material.004_normal.png',
    roughnessMap: 'https://gwcjylrsyylsuacdrnov.supabase.co/storage/v1/object/public/game/Material.004_metallicRoughness.png'
  })

  const copiedTexture = tex.map.clone()
  copiedTexture.wrapS = copiedTexture.wrapT = THREE.RepeatWrapping
  copiedTexture.repeat.set(0.5, 5)
  //tex.wrapT = tex.wrapS = THREE.RepeatWrapping
  //tex.repeat.set(1, 1)
  const makeLine = (line: any, index: number) => {
    //console.log(line)
    return (
      <RigidBody colliders="cuboid" type={'fixed'} key={`line-${index}`} {...line}>
        <Box args={[0.5, 5, 5]}>
          {/* <meshPhongMaterial {...tex}></meshPhongMaterial> */}
          <meshStandardMaterial attach="material-0" {...tex} />
          <meshStandardMaterial attach="material-1" {...tex} />
          <meshStandardMaterial attach="material-2" {...tex} />
          <meshStandardMaterial attach="material-3" {...tex} />
          <meshStandardMaterial attach="material-4" map={copiedTexture} roughnessMap={tex.roughnessMap} />
          <meshStandardMaterial attach="material-5" {...tex} map={copiedTexture} roughnessMap={tex.roughnessMap} />
        </Box>
        {/* <Wall scale={[5, 1, 5]} rotation={[0, Math.PI / 2, 0]} /> */}
      </RigidBody>
    )
  }

  return (
    <group>
      {maze.map((row: any, index: number) => {
        return row.map((cell: any, rowIndex: number) => (
          <group key={`cell-${rowIndex}`}>{getLine(cell, index).map((line, rowIndex) => makeLine(line, rowIndex))}</group>
        ))
      })}
    </group>
  )
}
