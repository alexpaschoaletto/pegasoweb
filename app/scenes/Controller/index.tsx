import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { colors } from '@/app/src/colors';
import styles from './Controller.module.css';
import { useGlobalContext } from '@/app/src/contexts/GlobalContextProvider';
import SocketConnection from '@/app/src/lib/socket';
import { getDummyMotorCommand, getLedCommand } from '@/app/src/lib/commands';

type auxiliaryText = {
    color: string,
    msg: string[],
}

type ledMsg = {
    type: 'LED',
    content: 'ON' | 'OFF',
}

type motorMsg = {
    type: 'MOTOR',
    content: '+' | '-',
}

type commandType = ledMsg | motorMsg;

const getToggleState = (ofWhat: ledMsg['content']) => {
    if(ofWhat === 'ON') return 'OFF';
    return 'ON';
}

export default function Controller(){
    const navigate = useNavigate();
    const [led, setLed] = useState<ledMsg['content']>(() => 'OFF');
    const [angle, setAngle] = useState<string>(() => '0°');
    const [moving, setMoving] = useState<boolean>(() => false);
    const { connection, msgReceived } = useGlobalContext()!;
    const [ auxText, setAuxText ] = useState<auxiliaryText>(() => ({
        color: colors.darkWhite,
        msg: [],
    }));

    const socket = SocketConnection.getInstance();

    useEffect(() => {
        if(!connection.server || !connection.robot){
            navigate("/");
        }
    }, [connection]);

    useEffect(() => {
        if(msgReceived){
            const robotReply = msgReceived.content[0].split('|');
            if((msgReceived.type === 'robot') && (typeof robotReply[0] === 'string')) {
                if(!justAnUpdate(robotReply)){
                    manageMotor(robotReply);
                    setAuxText({color: colors.darkWhite, msg: robotReply});
                }
            }
        }
    }, [msgReceived]);

    const sendMessage = (fromWho: commandType) => {
        const msg = (fromWho.type === 'LED')
        ? getLedCommand(fromWho.content)
        : getDummyMotorCommand(fromWho.content, 90);
        socket.sendMessageToRobot(msg);
        return;
    }

    const justAnUpdate = (status: string[]) => {
        console.log(status);
        if(status[0].includes('update')){
            if(status[1].includes('LED')){
                if(status[2] === 'ON' || status[2] === 'OFF'){
                    setLed(status[2]);
                }
                return true;
            }
            setAngle(status[2]);
            return true;
        }
        return false;
    }

    const manageMotor = (status: string[]) => {
        if(!status[0].includes('motor')) return;
        setMoving((status[0].includes('Movendo')));
    }

    return (
        <main>
            <div className={styles.background} style={{height:'100vh'}}>
                <div className={styles.inputContainer}>
                    <div className={styles.section}>
                        <div className={styles.status}>
                            <div
                                className={styles.statusIndicator}
                                style={{backgroundColor: (led === 'ON')? colors.limeGreen : colors.red}}
                            />
                            <p className={styles.statusText}>LED</p>
                        </div>
                        <button
                            className={styles.ledButton}
                            onClick={() => sendMessage({
                                type: 'LED',
                                content: getToggleState(led),
                            })}
                        >
                            LED
                        </button>
                    </div>
                    <div className={styles.section}>
                        <div className={styles.motorButtonsContainer}>
                            <div className={styles.motorStatus}>
                                <div className={styles.status}>
                                    <div
                                        className={styles.statusIndicator}
                                        style={{background: (moving)? colors.red : colors.limeGreen}}
                                    />
                                    <p className={styles.statusText}>Motor</p>
                                </div>
                                <p className={styles.motorAngle}>{angle}</p>
                            </div>
                            <div className={styles.motorButtons}>   
                                <button
                                    disabled={moving}
                                    className={styles.motorButton}
                                    onClick={() => sendMessage({
                                        type: 'MOTOR',
                                        content: '-',
                                    })}
                                >
                                    -
                                </button>
                                <button
                                    disabled={moving}
                                    className={styles.motorButton}
                                    onClick={() => sendMessage({
                                        type: 'MOTOR',
                                        content: '+',
                                    })}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.statusContainer}>
                    {auxText.msg.map((text, index) => (
                        <p key={index} className={styles.statusText} style={{color: auxText.color}}>
                            {text}
                        </p>
                    ))}
                </div>
            </div>
        </main>
    )
}