import React from 'react';
import HouseCart from '../components/houses/HouseCart.jsx';
import BusinessCard from '../components/businesses/BusinessCard.jsx';
import MesHouse from '../components/houses/MesHouse.jsx';
import Error from '../components/bank/Error.jsx';
import Succsess from '../components/bank/Succsess.jsx'
import BankMain from '../components/bank/BankMain.jsx';
import Phone from '../components/phone/Phone.jsx';

const initialState = [
  // <Phone />
]
  
export default function formList(state = initialState, action) {

  switch(action.type){
    case 'ADD_FORM':
        return [
          ...state,
          action.payload
        ];
    case 'SET_FORM':
        return [
          action.payload
        ];
    case 'CLOSE_FORM':
        const newState = [...state]
        newState.splice(state.length - 1, 1);
        return newState;

    case 'CHECK_HOUSE':
        let mesHouse;
        state.splice(state.length - 2, 2)
        if(action.payload.ans == 0) {
          mesHouse = 'У Вас недостаточно средств для покупки'
          return [...state, <HouseCart house={action.payload.house} isBuy={false}/>, <MesHouse mes={mesHouse} />]
        } else {
          mesHouse = 'Покупка успешно совершена'
          return [...state, <HouseCart house={action.payload.house} isBuy={true}/>, <MesHouse mes={mesHouse} />]
        }
    case 'CHECK_ENTER':
        let mesEnter;
        state.splice(state.length - 1, 1)
        if(action.payload == 0) {
          mesEnter = 'Дверь заперта'
          return [...state, <MesHouse mes={mesEnter} />]
        } else {
          state.splice(state.length - 1, 1)
          return [...state]
        }
    case 'CHECK_GARAGE':
        let mesGar;
        state.splice(state.length - 1, 1)
        if(action.payload == 0) {
          mesGar = 'Гараж заперт'
          return [...state, <MesHouse mes={mesGar} />]
        } else {
          state.splice(state.length - 1, 1)
          return [...state]
        }
    case 'CHECK_BIZ':
        let mesBiz;
        state.splice(state.length - 2, 2)
        if(action.payload.ans == 0) {
          mesBiz = 'У Вас недостаточно средств для покупки'
          return [...state, <BusinessCard biz={action.payload.biz} isBuy={false}/>, <MesHouse mes={mesBiz} />]
        } else {
          mesBiz = 'Покупка успешно совершена'
          return [...state, <BusinessCard biz={action.payload.biz} isBuy={true}/>, <MesHouse mes={mesBiz} />]
        }

    case 'ANS_BANK':
        state.splice(state.length - 1, 1)
        if(action.payload.ans == 1) {
          return [...state, <Succsess type={action.payload.type}/>]
        } else {
          return [...state, <Error text=''/>]
        }

    case 'ANS_ASK_BANK':
        state.splice(state.length - 1, 1)
        if(action.payload == '') {
          return [...state, <Error text='Данный номер счета не найден' />]
        }
        return state;

    case 'TEST':
          return [ <Error text=''/> ]
  }

    return state;
}