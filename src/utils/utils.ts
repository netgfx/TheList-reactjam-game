import generate from 'generate-maze'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'

export function generateMaze(rows: number | undefined, columns: number | undefined, seed: number) {
  var maze = []
  var _seed = seed || Math.random() * 10000
  console.log(rows, columns, _seed)
  maze = generate(rows, columns, true, _seed)

  return maze
}

export function getWalkableAt(x: any, y: any, direction: string, maze: string | any[]) {
  var realX = x
  var realY = y
  //console.log("checking ", x, y, realX, realY)
  var result = undefined
  for (var i = 0; i < maze.length; i++) {
    result = _.find(maze[i], function (o: { x: any; y: any }) {
      return o.x === realX && o.y === realY
    })
    if (result != undefined) {
      break
    }
  }

  //console.log(result, direction)
  if (result) {
    return !result[direction]
  } else {
    return false
  }
}

/**
 * left
 * position={[0.5, 0, -2.5]} rotation={[0, 0, 0]}
 *
 * right
 * position={[4.5, 0, -2.5]} rotation={[0, 0, 0]}
 *
 * bottom
 * position={[2.5, 0, -0.5]} rotation={[0, Math.PI / 2, 0]}
 *
 * top
 * position={[2.5, 0, -4.5]} rotation={[0, Math.PI / 2, 0]}
 */
export function getLine(proxyCell: { x: any; y: any; left: any; right: any; top: any; bottom: any }, index: any) {
  var lines = []

  var cell = {
    x: proxyCell.x,
    y: proxyCell.y,
    left: proxyCell.left,
    right: proxyCell.right,
    top: proxyCell.top,
    bottom: proxyCell.bottom
  }

  if (cell.top) {
    lines.push({ rotation: [0, Math.PI / 2, 0], position: [2.5 + cell.x * 5.0, -0.5, 0.25 + cell.y * 5] })
  }
  if (cell.bottom) {
    lines.push({ rotation: [0, Math.PI / 2, 0], position: [2.5 + cell.x * 5, -0.5, 4.75 + cell.y * 5] })
  }
  if (cell.left) {
    lines.push({ rotation: [0, 0, 0], position: [0.25 + cell.x * 5, -0.5, 2.5 + cell.y * 5] })
  }
  if (cell.right) {
    lines.push({ rotation: [0, 0, 0], position: [4.75 + cell.x * 5, -0.5, 2.5 + cell.y * 5] })
  }

  //console.log(lines, proxyCell)
  return lines
}

export const isInsideBox = (vector: THREE.Vector3, boxPosition: THREE.Vector3, boxWidth: number, boxHeight: number, boxDepth: number) => {
  const minX = boxPosition.x - boxWidth / 2
  const maxX = boxPosition.x + boxWidth / 2
  //const minY = boxPosition.y - boxHeight / 2
  //const maxY = boxPosition.y + boxHeight / 2
  const minZ = boxPosition.z - boxDepth / 2
  const maxZ = boxPosition.z + boxDepth / 2
  console.log(minX, maxX, minZ, maxZ, vector)
  return vector.x >= minX && vector.x <= maxX && vector.z >= minZ && vector.z <= maxZ
}
