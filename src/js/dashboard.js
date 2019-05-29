import Instance from "./instance.js";
import { isLogicalExpression } from "@babel/types";

//import Image from './imageclass.js';

export default class Dashboard {
  constructor(parent) {
    this.parent = parent;
    this.instanceBoard = null;
    this.logBoard = null;
    this.dashBoard = null;
    this.newInstance = null;
    this.insyanceDiv =  null;
    this.ws = null;
  }

  create() {
    this.dashBoard = document.createElement('div');
    this.instanceBoard = document.createElement('div');
    this.logBoard = document.createElement('div');
    this.newInstance = document.createElement('p');
    this.insyanceDiv = document.createElement('div');
    const instText = document.createElement('p');
    const logText = document.createElement('p');

    instText.innerHTML = 'Your micro instances';
    logText.innerHTML = 'Work log';
    this.newInstance.innerHTML = 'Create new instance';

    this.dashBoard.setAttribute('class', 'dashBoard');
    this.instanceBoard.setAttribute('class', 'instanceBoard');
    this.logBoard.setAttribute('class', 'logBoard');
    this.newInstance.setAttribute('class', 'newInstance');
    this.insyanceDiv.setAttribute('class', 'instanceDiv');

    this.parent.appendChild(this.dashBoard);
    this.dashBoard.appendChild(this.instanceBoard);
    this.dashBoard.appendChild(this.logBoard);
    this.logBoard.appendChild(logText);
    this.instanceBoard.appendChild(instText);
    this.instanceBoard.appendChild(this.insyanceDiv);
    this.instanceBoard.appendChild(this.newInstance);

    this.wsCreate();
    this.addListener();   
  }

  addListener(){
    this.newInstance.addEventListener('click', () => {
      this.ws.send(JSON.stringify({'type': 'create'}));
    })
  }

  wsCreate(){
    this.ws = new WebSocket('ws://localhost:7070/ws');
    this.ws.binaryType = 'blob'; // arraybuffer
    this.ws.addEventListener('open', () => {
      console.log('connected');     
      this.ws.send(JSON.stringify({'type': 'servers'}));
      //this.ws.send(JSON.stringify({name: this.name}));
    // this.ws.send('hello');

    });
    this.ws.addEventListener('message', (evt) => {
     let message = JSON.parse(evt.data);
     if(message.type === 'servers'){
       for(let server of message.data){
         let instance = new Instance(this.insyanceDiv, server, this.ws)
         instance.create();
       }       
     } else if(message.type === 'create'){
          let instance = new Instance(this.insyanceDiv, message.data, this.ws)
         instance.create();
         let log = document.createElement('div');   
 log.innerHTML = `<div><p>${message.time}</p><p>Server: ${message.data.id}</p><p>INFO: Created</p></div>`;
 this.logBoard.appendChild(log);
     }else if(message.type === 'startstop'){
      let inst = document.querySelector(`[data-id=a${message.data.id}]`);
      let status = inst.querySelector('.status');
      let startStop = inst.querySelector('.startStop');
      let ring = inst.querySelector('.ring');
      console.log(inst)
      if(message.data.state === 'running'){
        status.innerHTML = 'Running';
        startStop.innerHTML = '&#9208';
        ring.style.backgroundColor = 'green';
        let log = document.createElement('div');   
 log.innerHTML = `<div><p>${message.time}</p><p>Server: ${message.data.id}</p><p>INFO: Start</p></div>`;
 this.logBoard.appendChild(log);
      } else if(message.data.state === 'stopped'){
        status.innerHTML = 'Stopped';
      startStop.innerHTML = '&#9205';
      ring.style.backgroundColor = 'black';
      let log = document.createElement('div');   
 log.innerHTML = `<div><p>${message.time}</p><p>Server: ${message.data.id}</p><p>INFO: Stop</p></div>`;
 this.logBoard.appendChild(log);
      }     
 }else if(message.type === 'delete'){
  let inst = document.querySelector(`[data-id=a${message.data}]`);
 inst.parentNode.removeChild(inst);
 let log = document.createElement('div');   
 log.innerHTML = `<div><p>${message.time}</p><p>Server: ${message.data}</p><p>INFO: Remove</p></div>`;
 this.logBoard.appendChild(log);
}else if(message.type === 'reseived'){
  let log = document.createElement('div');   
  log.innerHTML = `<div><p>${message.time}</p><p>INFO: Reseived</p></div>`;
  this.logBoard.appendChild(log);
}

     
     //let message = evt.data; 
      
      console.log(message);
    });
    this.ws.addEventListener('close', (evt) => {
      console.log('connection closed', evt);
      
    });
    this.ws.addEventListener('error', () => {
      console.log('error');
    });
    
  }




}
