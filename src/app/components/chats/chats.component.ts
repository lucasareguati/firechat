
import { Component, OnInit } from '@angular/core';
//injecto el servicio de chat.service
import { ChatService } from '../../providers/chat.service';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styles: []
})
export class ChatsComponent  implements OnInit {

  mensaje:string = "";
  elemento: any;

  constructor( public _cs: ChatService) {
 //recibimos el observable del obejeto chat
    this._cs.cargarMensajes()
          .subscribe(()=>{

            setTimeout(()=>{
              this.elemento.scrollTop = this.elemento.scrollHeight;
            },20);
          }); // cuando recibo los mensaje muevo el foco al final
  }

  ngOnInit() {
    // hago la referencia del elemento del html
    this.elemento = document.getElementById('app-mensajes');
  }

enviarMensaje() {
  console.log(this.mensaje);

  if (this.mensaje.length === 0) {
      return;
  }
  this._cs.agregarMensaje(this.mensaje)
          // .then( ()=>console.log('Mensaje enviado') )
          .then(()=>this.mensaje="")
          .catch( (err)=>console.log('Error al enviar', err));


}

}
