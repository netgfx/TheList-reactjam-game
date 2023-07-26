import { useTexture } from '@react-three/drei'
import React, { Suspense, useEffect, useState } from 'react'
import * as THREE from 'three'

export function Floor(props: any) {
  const { menu } = props
  const [texProps, setTexProps] = useState({})
  const floorProps = useTexture(
    //displacementMap: 'https://gwcjylrsyylsuacdrnov.supabase.co/storage/v1/object/public/game/WoodPlanks_height.jpg',
    //specularMap: 'https://gwcjylrsyylsuacdrnov.supabase.co/storage/v1/object/public/game/WoodPlanks_specular.jpg',
    //normalMap: 'https://gwcjylrsyylsuacdrnov.supabase.co/storage/v1/object/public/game/WoodPlanks_normal.jpg',
    //'https://gwcjylrsyylsuacdrnov.supabase.co/storage/v1/object/public/game/Wood_Study_3_by_Devin_Busha.jpg'
    {
      roughnessMap: 'https://gwcjylrsyylsuacdrnov.supabase.co/storage/v1/object/public/game/Material.001_metallicRoughness.png',
      map: 'https://gwcjylrsyylsuacdrnov.supabase.co/storage/v1/object/public/game/Material.001_baseColor.png',
      normalMap: 'https://gwcjylrsyylsuacdrnov.supabase.co/storage/v1/object/public/game/Material.001_normal.png'
    }
  )

  const floorMenuProps = useTexture({
    map: 'https://gwcjylrsyylsuacdrnov.supabase.co/storage/v1/object/public/game/grass_baseColor.png'
  })

  floorMenuProps.map.wrapS = floorMenuProps.map.wrapT = THREE.RepeatWrapping
  floorMenuProps.map.repeat.set(128, 128)
  //console.log(floorMenuProps)

  floorProps.map.wrapS = floorProps.map.wrapT = THREE.RepeatWrapping
  floorProps.map.repeat.set(128, 128)

  floorProps.normalMap.wrapS = floorProps.normalMap.wrapT = THREE.RepeatWrapping
  floorProps.normalMap.repeat.set(128, 128)

  const getTex = () => {
    return menu ? { ...floorMenuProps } : { ...floorProps }
  }

  useEffect(() => {
    if (props.blocks.length > 0) {
      const l = 0.25 + props.blocks[0][0].x * 5
      const r = 0.25 + props.blocks[0][props.blocks[0].length - 1].x * 5
      //console.log(props.blocks, l, r)
    }
  }, [props.blocks])

  return (
    <mesh {...props} rotation={[Math.PI / 2, 0, 0]}>
      <planeGeometry args={[128, 128]} />
      <Suspense>
        <meshStandardMaterial {...getTex()} side={THREE.DoubleSide} />
      </Suspense>
    </mesh>
  )
}
