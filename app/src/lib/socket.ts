import { io, Socket } from 'socket.io-client';
import { credentials } from '../contexts/types';

class SocketConnection {
  private static instance: SocketConnection;
  private app: credentials | undefined;
  private robot: credentials | undefined;
  socket: Socket | undefined;

  static getInstance() {
    if (!SocketConnection.instance) {
      SocketConnection.instance = new SocketConnection();
    }
    return SocketConnection.instance;
  }

  getNameOf(what: 'app' | 'robot'){
    if(what === 'app') return (this.app)? this.app.name : undefined;
    return (this.robot)? this.robot.name : undefined;
  }

  setNameOf(what: 'app' | 'robot', newName: string | undefined){
    if(!this.app) return;
    if(what === 'app'){
      if(this.app){ this.app.name = newName; }
      return;
    }
    if(this.robot){ this.robot.name = newName; }
  }

  setPasswordOf(newPassword: string){
    if(this.robot) {
      this.robot.password = newPassword;
    }
  }

  set(what: 'app' | 'robot', newCredentials: credentials | undefined){
    if (what === 'robot'){
      this.robot = newCredentials;
      return;
    }
    this.app = newCredentials;
  }

  get(what: 'app' | 'robot'){
    return (what === 'app')? this.app : this.robot; 
  }

  connect(serverUrl: string, connectionCallback?: (e: boolean) => void) {
    if (!this.socket) {
      this.socket = io(serverUrl);
      this.socket.on('connect', () => {
        connectionCallback && connectionCallback(true);
      })
      this.socket.on('disconnect', () => {
        connectionCallback && connectionCallback(false);
      });
      this.socket.io.on('reconnect', () => {
        console.log('Reconectado.')
      });
    }
  }

  sendAppInfo(app?: credentials){
    app && this.set('app', app);
    if(!this.app) return;
    this.socket && this.socket.emit('app-info', JSON.stringify(this.app));
  }

  bindRobot(robot?: credentials){
    robot && this.set('robot', robot);
    if(!this.robot) return;
    this.socket && this.socket.emit('bind-robot', JSON.stringify(this.robot));
  }

  unbindRobot(){
    this.robot && this.set('robot', undefined);
    this.socket && this.socket.emit('unbind-robot', 'please');
  }

  disconnect() {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.close();
      this.socket = undefined;
    }
  }

  emit(title: string, content: string | JSON){
    this.socket && this.socket.emit(title, content);
  }

  sendMessageToRobot(text: string){
    this.emit('msg-from-app', text);
  }

  addEventListener(event: string, callback: (event: any) => void) {
    if (!this.socket) {
      throw new Error('O socket ainda não foi definido.');
    }
    this.socket.on(event, callback);
  }

  removeAllListeners() {
    this.socket && this.socket.removeAllListeners();
  }
}

export default SocketConnection;
