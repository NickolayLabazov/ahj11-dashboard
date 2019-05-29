//import Gallery from './dashboard.js/index.js';

export default class Instance {
  constructor(parent, server, ws) {
    this.parent = parent;
    this.server = server;
    this.instance = null;
    this.table = null;
    this.ring = null;
    this.status = null;
    this.startStop = null;
    this.del = null;
    this.ws = ws
  }

  create() {
    this.instance = document.createElement('div');
    this.table = document.createElement('table');
    let name = document.createElement('p');
    let trTop = document.createElement('tr');
    let trBottom = document.createElement('tr');
    let trStatus = document.createElement('td');    
    let ring = document.createElement('td');
    this.ring = document.createElement('div');
    this.status = document.createElement('td');
    let trAction = document.createElement('td');
    this.startStop = document.createElement('td');
    this.del = document.createElement('td');
    
    
    trStatus.innerHTML = 'Status:';
    trAction.innerHTML = 'Action:';
    //this.startStop.innerHTML = '&#9208';
    this.startStop.innerHTML = '&#9205';
    this.del.innerHTML = '&#10060';
    name.innerHTML = this.server.id;

    if(this.server.state === 'stopped'){
      this.status.innerHTML = 'Stopped';
      this.startStop.innerHTML = '&#9205';
      this.ring.style.backgroundColor = 'black';
    } else{
      this.status.innerHTML = 'Running';
      this.startStop.innerHTML = '&#9208';
      this.ring.style.backgroundColor = 'green';
    }
    

    this.instance.setAttribute('class', 'instance');
    this.instance.setAttribute('data-id', `a${this.server.id}`);
    this.ring.setAttribute('class', 'ring');
    this.status.setAttribute('class', 'status');
    this.startStop.setAttribute('class', 'startStop');
   // this.logBoard.setAttribute('class', 'logBoard');
   // this.newInstance.setAttribute('class', 'newInstance');
   // this.insyanceDiv.setAttribute('class', 'instanceDiv');

    this.parent.appendChild(this.instance);
    this.instance.appendChild(name);
    this.instance.appendChild(this.table);
    this.table.appendChild(trTop);
    this.table.appendChild(trBottom);
    trTop.appendChild(trStatus);
    trTop.appendChild(ring);
    ring.appendChild(this.ring);

    trTop.appendChild(this.status);
    trBottom.appendChild(trAction);
    trBottom.appendChild(this.startStop);
    trBottom.appendChild(this.del);



    this.addListener();
    
  }

  addListener() {
    this.startStop.style.cursor = 'pointer';
    this.del.style.cursor = 'pointer';
    
    this.startStop.addEventListener('click', () => {
      this.ws.send(JSON.stringify({type: 'startstop', id: this.server.id}));
    });

    this.del.addEventListener('click', () => {
      this.ws.send(JSON.stringify({type: 'delete', id: this.server.id}));
    });
  }

 
}
