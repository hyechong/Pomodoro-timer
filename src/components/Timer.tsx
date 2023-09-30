import React, { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { roundsState, timerState, goalsState } from '../atoms'
import styled from 'styled-components';
import {
  motion
} from 'framer-motion';

const TimerBox = styled(motion.div)``

const Timer = () => {
  const [timer, setTimer] = useRecoilState(timerState)
  const [round, setRound] = useRecoilState(roundsState);
  const [goal, setGoal] = useRecoilState(goalsState);

  let timerInterval: NodeJS.Timeout|null=null;

  const minutes = Math.floor(timer.time/60);
  const seconds = timer.time%60;

  const toggleTimer =()=>{
    setTimer((prev)=>({
      ...prev,
      isActive:!prev.isActive,
    }))
  }

  const resetTimer = () => {
    setTimer({
      time: 1500,
      isActive: false,
    });
  };

  useEffect(() => {
    if (timer.isActive) {
      timerInterval = setInterval(() => {
        setTimer((prevTimer) => ({
          ...prevTimer,
          time: prevTimer.time - 1,
        }));
      }, 1000);
    } else {
      clearInterval(timerInterval!);
    }

    if (timer.time === 0) {
      toggleTimer();
      setRound((prevRound)=>prevRound+1)
      if(round===3){
        setGoal((prevGoal)=>{
          if(prevGoal<12){
            return prevGoal+1
          }else{
            return prevGoal
          }
        })
        setRound(0)
      }
      resetTimer()
    }

    return () => clearInterval(timerInterval!); 
  }, [timer.isActive, timer.time,round,goal]);

  return (
    <>
      <h1>Pomodoro</h1>
      <div>
        {minutes<10?`0${minutes}`:minutes}:{seconds < 10 ? `0${seconds}` : seconds}
      </div>
      <button onClick={toggleTimer}>{timer.isActive ? '⏸' : '▶️'}</button>
      <div>
        <p>{round}/4</p>
        <span>ROUND</span>
      </div>
      <div>
        <p>{goal}/12</p>
        <span>GOAL</span>
      </div>
    </>
  )
}

export default Timer