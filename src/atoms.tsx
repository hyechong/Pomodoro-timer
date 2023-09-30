import { atom, selector } from 'recoil';

export interface ITimer{
  time:number,
  isActive:boolean
}

export const timerState = atom<ITimer>({
  key:'timerState',
  default: {time:1500,isActive:false,}
})

export const roundsState=atom({
  key:'roundsState',
  default:0
})

export const goalsState = atom({
  key:'goalState',
  default:0,
})