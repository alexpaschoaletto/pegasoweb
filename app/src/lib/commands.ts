import { HEADER, INFINITE_LENGTH } from "../contexts/constants";

//tipos de comando:
//REACT_sentido_junta_deslocamento_velocidade_resolução
//ou
//REACT_START_sentido_junta_velocidade_resolução
//ou
//REACT_END
//ou
//REACT_RESET
//ou
//REACT_POSITION

export const getStartMessage = (direction: string, joint: number, length: number, speed: number, microstep: number) => {
    return (length < INFINITE_LENGTH)
    ?`${HEADER}_${direction}_${joint}_${length}_${speed}_${microstep}`
    :`${HEADER}_START_${direction}_${joint}_${speed}_${microstep}`;
}

export const getEndMessage = () => {
    return `${HEADER}_END`;
}

export const getGoHomeMessage = () => {
    return `${HEADER}_GO_HOME`;
}

export const getResetHomeMessage = () => {
    return `${HEADER}_RESET_HOME`;
}

export const getPositionMessage = () => {
    return `${HEADER}_POSITION`;
}

export const getLedCommand = (status: 'ON' | 'OFF') => {
    return `${HEADER}_LED_${status}`;
}

export const getDummyMotorCommand = (direction: '+' | '-', angle: number) => {
    return `${HEADER}_MOTOR_${direction}_${angle}`
}

export const getDummyStatusCommand = () => {
    return `${HEADER}_STATUS`
}