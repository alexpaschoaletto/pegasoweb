"use client"
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Settings.module.css';
import MainContent from './MainContent';
import SocketConnection from '../../src/lib/socket';
import { useGlobalContext } from '../../src/contexts/GlobalContextProvider';
import { colors } from '../../src/colors';

type auxiliaryText = {
  color: string,
  msg: string[],
}

export default function SettingsPage() {
  const navigate = useNavigate();
  const { msgReceived, connection } = useGlobalContext()!;

  const socket = SocketConnection.getInstance();  
  const [auxText, setAuxText] = useState<auxiliaryText>(() => ({
    color: colors.darkWhite,
    msg: [],
  }));

  const sendCredentials = (name: string, password: string) => {
    if(!socket) return;
    socket.bindRobot({name, password});
    setAuxText({
      color: colors.darkWhite,
      msg: ['enviando...'],
    })
  }
  
  useEffect(() => {
    if(connection.server && connection.robot) {
      navigate('/controller');
    }
  }, [connection]);

  useEffect(() => {
    if((msgReceived) && (msgReceived.type !== 'robot')){
        let textColor = '';
        switch(msgReceived.type){
            case 'unbind-error':
            case 'bind-error': textColor = colors.red; break;
            case 'bind-success': textColor = colors.green; break;
            default: textColor = colors.darkWhite;
        }
        setAuxText({color: textColor, msg: msgReceived.content});
    }
}, [msgReceived]);


  return (
    <main className={styles.main}>
      <div className={styles.background} style={{height: '100vh'}}>
        <div className={styles.mainContainer}>
          <h1 className={styles.title}>
            Vincular um dispositivo
          </h1>
          <div className={styles.inputContainer}>
            <MainContent send={sendCredentials}/>
          </div>
          <div className={styles.statusMsgDiv}>
              {auxText.msg.map((message, index) => (
                <p key={index} className={styles.statusMsg} style={{color: auxText.color}}>
                  {message}
                </p>
              ))}
          </div>
        </div>
      </div>
    </main>
  )
}
