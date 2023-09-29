import { createContext, ReactNode, useContext, useState, useEffect } from 'react';
import { getDummyStatusCommand } from '../lib/commands';
import { SERVER, PORT } from './constants';
import { colors } from '../colors';
import { connections, msgType } from './types';
import SocketConnection from '../lib/socket';

interface GlobalProviderProps {
    children: ReactNode;
}

interface GlobalValues {
    msgReceived: msgType;
    infoText: string[];
    sequence: string[];
    borderColor: string;
    joint: number,
    direction: string,
    speed: number,
    length: number,
    microstep: number,
    connection: connections,
    setInfoText: React.Dispatch<React.SetStateAction<string[]>>,
    setBorderColor: React.Dispatch<React.SetStateAction<string>>,
    setJoint: React.Dispatch<React.SetStateAction<number>>,
    setDirection: React.Dispatch<React.SetStateAction<string>>,
    setSpeed: React.Dispatch<React.SetStateAction<number>>,
    setLength: React.Dispatch<React.SetStateAction<number>>,
    setMicrostep: React.Dispatch<React.SetStateAction<number>>,
}

const initial: GlobalValues = {
    msgReceived: {type: 'info', content: ['aplicativo inicializado.']},
    infoText: ['Bem Vindo(a) ao projeto Pégaso!', 'acesse as configurações para vincular o robô.'],
    sequence: [],
    borderColor: colors.blue,
    joint: 0,
    direction: 'none',
    speed: 1,
    length: 3,
    microstep: 1,
    connection: {server: false, robot: false},
    setInfoText: () => {},
    setBorderColor: () => {},
    setJoint: () => {},
    setDirection: () => {},
    setSpeed: () => {},
    setLength: () => {},
    setMicrostep: () => {},
};

const GlobalContext = createContext<GlobalValues>(initial);

export function useGlobalContext() {
    const context = useContext(GlobalContext);
    if (typeof context !== 'undefined') {
        return context;
    } else {
        console.log('Global Context cannot be accessed from here.');
    }
}

export default function GlobalProvider(props: GlobalProviderProps) {
    const [msgReceived, setMsgReceived] = useState<msgType>(initial.msgReceived);
    const [infoText, setInfoText] = useState<string[]>(initial.infoText);
    const [sequence, setSequence] = useState<string[]>(initial.sequence);
    const [borderColor, setBorderColor] = useState<string>(initial.borderColor);
    const [joint, setJoint] = useState<GlobalValues['joint']>(initial.joint);
    const [direction, setDirection] = useState<GlobalValues['direction']>(initial.direction);
    const [speed, setSpeed] = useState<GlobalValues['speed']>(initial.speed);
    const [length, setLength] = useState<GlobalValues['length']>(initial.length);
    const [microstep, setMicrostep] = useState<GlobalValues['microstep']>(initial.microstep);

    const [connection, setConnection] = useState<connections>(initial.connection);                  //global (guarda estado de conexão com server e com robô)
    const [connectionWithServer, setConnectionWithServer] = useState<boolean>(() => false);         //local (esse é o trigger do useState acima para o atributo 'server')

    //start-up
    const socket = SocketConnection.getInstance();

    useEffect(() => {
        socket.set('app', {name: 'Pegaso Robot Controller', password: 'some password I have to change later'});
        socket.connect(`${SERVER}:${PORT}`, setConnectionWithServer);
        socket.addEventListener('msg-from-server', (msg: string) => {
            const content: msgType = JSON.parse(msg);
            setMsgReceived(content);
        });
    }, []);


    useEffect(() => {
        if(connectionWithServer){
            socket.sendAppInfo();
            socket.bindRobot();                                                                     
        }
        setConnection((prev) => ({...prev, server: connectionWithServer}));
    }, [connectionWithServer]);
    

    useEffect(() => {
        if(msgReceived){
            const received = msgReceived.content[0];
            const partsOfMessage = received.split('|');
            if(received.includes('sequence-update')){
                partsOfMessage.splice(0, 1);
                console.log('nova sequência enviada pelo robô:', partsOfMessage);
                setSequence(partsOfMessage);
            } else {
                switch(msgReceived.type){
                    case 'bind-success': setConnection(prev => ({...prev, robot: true})); break;
                    case 'unbind-success': setConnection(prev => ({...prev, robot: false})); break;
                    case 'bind-error': setConnection(prev => ({...prev, robot: false})); break;
                    case 'bind-recover': 
                        setConnection(prev => ({...prev, robot: true}));
                        socket.set('robot', {
                            name: msgReceived.content[1],
                            password: msgReceived.content[2],
                        });
                        socket.sendMessageToRobot(getDummyStatusCommand());
                        setInfoText([partsOfMessage[0]]);
                    return;
                }
                setInfoText(partsOfMessage);
            }
        }
    }, [msgReceived]);


    const value: GlobalValues = {
        msgReceived,
        infoText,
        sequence,
        borderColor,
        joint,
        direction,
        speed,
        length,
        microstep,
        connection,
        setInfoText,
        setBorderColor,
        setJoint,
        setDirection,
        setSpeed,
        setLength,
        setMicrostep,
    };

    const { children } = props;

    return (
        <GlobalContext.Provider value={value}>
            {children}
        </GlobalContext.Provider>
    );
}
