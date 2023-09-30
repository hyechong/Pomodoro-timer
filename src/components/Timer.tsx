import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import { roundsState, timerState, goalsState } from "../atoms";
import styled from "styled-components";
import { motion } from "framer-motion";

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  padding: 20px;
  max-width: 480px;
  margin: 0 auto;
`;
const Title = styled.h1`
  color:#fff;
  font-size:30px;
  font-weight:300;
  text-align-center;
`;

const TimerWrapper = styled.div`
  display: flex;
  align-items: center;
  span {
    font-size: 35px;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.7);
    margin: 5px;
  }
`;

const TimerBox = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgb(235, 64, 52);
  border-radius: 18px;
  font-size: 35px;
  font-weight: 500;
  width: 100px;
  height: 150px;
  background-color: #fff;
`;

const Btn = styled(motion.div)`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(1, 1, 1, 0.3);
  color: #fff;
  font-size: 20px;
  text-align: center;
`;

const TextWrapper = styled.div`
  display: flex;
  gap: 5rem;
  color: #fff;
  font-size: 20px;
`;

const timerBoxVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, type: "spring" },
  },
  exit: { opacity: 0, scale: 0.5 },
};

const btnVariants = {
  hover: { scale: 1.3 },
  click: { scale: 1 },
};

const Timer = () => {
  const [timer, setTimer] = useRecoilState(timerState);
  const [round, setRound] = useRecoilState(roundsState);
  const [goal, setGoal] = useRecoilState(goalsState);

  let timerInterval: NodeJS.Timeout | null = null;

  const minutes = Math.floor(timer.time / 60);
  const seconds = timer.time % 60;

  const toggleTimer = () => {
    setTimer((prev) => ({
      ...prev,
      isActive: !prev.isActive,
    }));
  };

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
      setRound((prevRound) => prevRound + 1);
      if (round === 3) {
        setGoal((prevGoal) => {
          if (prevGoal < 12) {
            return prevGoal + 1;
          } else {
            return prevGoal;
          }
        });
        setRound(0);
      }
      resetTimer();
    }

    return () => clearInterval(timerInterval!);
  }, [timer.isActive, timer.time, round, goal]);

  return (
    <>
      <Container>
        <Title>Pomodoro</Title>
        <TimerWrapper>
          <TimerBox
            key={`minutes-${minutes}`}
            variants={timerBoxVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {minutes < 10 ? `0${minutes}` : minutes}
          </TimerBox>
          <span>:</span>
          <TimerBox
            key={`seconds-${seconds}`}
            variants={timerBoxVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {seconds < 10 ? `0${seconds}` : seconds}
          </TimerBox>
        </TimerWrapper>
        <Btn
          variants={btnVariants}
          whileHover="hover"
          whileTap="click"
          onClick={toggleTimer}
        >
          {timer.isActive ? "⏸" : "▶️"}
        </Btn>
        <TextWrapper>
          <div>
            <p>{round}/4</p>
            <span>ROUND</span>
          </div>
          <div>
            <p>{goal}/12</p>
            <span>GOAL</span>
          </div>
        </TextWrapper>
      </Container>
    </>
  );
};

export default Timer;
