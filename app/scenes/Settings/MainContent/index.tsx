"use client"
import { useRef, useEffect, useLayoutEffect } from 'react';
import { useGlobalContext } from '@/app/src/contexts/GlobalContextProvider';
import gsap from 'gsap';
import styles from './MainContent.module.css';
import { Loader } from 'react-feather';
import { colors } from '@/app/src/colors';

interface props {
    send: (name: string, password: string) => void;
}

export default function MainContent({send}: props){
    const { connection } = useGlobalContext()!;
    const loaderRef = useRef(null);
    const nameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    useLayoutEffect(() => {
      gsap.to(loaderRef.current, {
        duration: 4,
        rotate: 360,
        repeat: -1,
      });
    }, []);


    ////Listener para remover foco do <input> quando o usuário aperta Enter/////////////////////////

      useEffect(() => {
        document.addEventListener('keydown', detectKeyDown);
        return () => {
          document.removeEventListener('keydown', detectKeyDown);
        };
      }, []);
    
      const detectKeyDown = (e: KeyboardEvent) => {
        if(
          !(document.activeElement === nameRef.current) &&
          !(document.activeElement === passwordRef.current)
        ) return;
        if (e.key === 'Enter') {
          checkInputs();
        }
      };
    
    ////////////////////////////////////////////////////////////////////////////////////////////////
  
    const checkInputs = () => {
      if(!nameRef.current || !passwordRef.current) return;
      const name = nameRef.current.value.trim();
      const password = passwordRef.current.value.trim();
      send(name, password);
    }


    if(connection.server) return (
        <>
            <div className={styles.credentials}>
              <label htmlFor="nome" className={styles.credentialsText}>
                Nome:
              </label>
              <input name="nome" ref={nameRef} className={styles.credentialsInput}/>
            </div>
            <div className={styles.credentials}>
              <label htmlFor="senha" className={styles.credentialsText}>
                Senha:
              </label>
              <input type="password" name="senha" ref={passwordRef} className={styles.credentialsInput}/>
            </div>
            <div className={styles.buttonDiv}>
              <button
                className={styles.bindButton}
                onClick={checkInputs}
              >
                Vincular
              </button>
            </div>
        </>
    )

    return (
      <div className={styles.connectionContainer}>
        <div ref={loaderRef}>
          <Loader width={40} height={40} color={colors.darkWhite}/>
        </div>
        <p className={styles.credentialsText}>
          Conectando ao servidor...
        </p>
      </div>
    )
}