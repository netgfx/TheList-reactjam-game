import React, { useState, useRef, useEffect, useMemo } from 'react'
import moment from 'moment'
import { useFrame, useThree } from '@react-three/fiber'
import _ from 'lodash'
import { useGame } from './useGame'

export function Progress(props: any) {
  const { start, groupRef } = props
  const { camera } = useThree

  function InnerClock() {
    const [countdown, setCountdown] = useState(3 * 60)
    const [formattedCountdown, setFormattedCountdown] = useState('0')
    const textRef = useRef(0)
    const setGameOver = useGame((state: any) => state.setGameOver)

    useEffect(() => {
      let interval = null
      //console.log(start, countdown)

      if (start && countdown === 0) {
        setGameOver(true)
      }

      if (start && countdown > 0) {
        interval = setInterval(() => {
          var _countdown = _.cloneDeep(countdown)
          _countdown -= 1
          //console.log(_countdown)
          setCountdown(_countdown)
        }, 1000)
      } else if (!start && countdown !== 0) {
        clearInterval(interval)
      }
      return () => clearInterval(interval)
    }, [countdown])

    useEffect(() => {
      if (start) {
        //startCountdown()
      }
    }, [start])

    const startCountdown = () => {
      setCountdown(3 * 60)
    }

    useEffect(() => {
      const minutes = Math.floor(countdown / 60)
      const seconds = countdown % 60
      const _formattedCountdown = countdown >= 60 ? `${minutes} minutes ${seconds} seconds` : `${seconds} seconds`
      setFormattedCountdown(_formattedCountdown)
      //console.log(formattedCountdown, countdown)
    }, [countdown])

    //textRef.current.html = formattedCountdown

    return (
      <div className="container">
        <div ref={textRef} className="party-text">{`Party Starts in ${formattedCountdown}`}</div>
        <div className={`progress2 ${start === true ? 'progress-moved' : ''}`}>
          <div className="progress-bar2"></div>
        </div>
      </div>
    )
  }

  const clock = useMemo(() => <InnerClock />, [start])

  return <>{clock}</>
}
