import React, { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { roundsState, timerState, goalsState } from '../atoms'
import styled from 'styled-components';
import {
  motion
} from 'framer-motion';

const Container = styled.div`
  height:100vh;
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
  gap:2rem;
  padding: 20px;
  max-width: 480px;
  margin: 0 auto;
`
const Title=styled.h1`
  color:#fff;
  font-size:35px;
  font-weight:500;
  text-align-center;
`

const TimerWrapper = styled.div`
  display:flex;
  align-items:center;
  span{
    font-size:70px;
    font-weight:500;
    color:rgba(255,255,255,0.7);
  }
`

const TimerBox = styled(motion.div)`
  display:flex;
  justify-content:center;
  align-items:center;
  color:rgb(235, 64, 52);
  border-radius:18px;
  font-size:70px;
  font-weight:500;
  width:150px;
  height:230px;
  background-color:#fff;
`
const timerBoxVariants={
  initial: {opacity:0, scale:.5, x:-10}
}

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
      <Container>
        <Title>Pomodoro</Title>
        <TimerWrapper>
          <TimerBox>
            {minutes<10?`0${minutes}`:minutes}
          </TimerBox>
          <span>:</span>
          <TimerBox>{seconds < 10 ? `0${seconds}` : seconds}</TimerBox>
        </TimerWrapper>
        <button onClick={toggleTimer}>{timer.isActive ? '⏸' : '▶️'}</button>
        <div>
          <p>{round}/4</p>
          <span>ROUND</span>
        </div>
        <div>
          <p>{goal}/12</p>
          <span>GOAL</span>
        </div>
      </Container>
    </>
  )
}

export default Timer