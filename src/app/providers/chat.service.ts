import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';
// tslint:disable-next-line:import-blacklist
import 'rxjs/Rx';

import { Mensaje } from '../interface/mensaje.interface';
import { _switch } from 'rxjs-compat/operator/switch';

@Injectable()
export class ChatService {

  private itemsCollection: AngularFirestoreCollection<Mensaje>;

  public chats: Mensaje[] = [];
  public usuario: any = {};

  constructor( private afs: AngularFirestore,
    public afAuth: AngularFireAuth ) {

  // Este metod constructor, debe de regresar una promesa - observable
    this.afAuth.authState.subscribe( user => {
      console.log('Estado del usuario: ', user);

      if (!user) {
        return;
      }
      this.usuario.nombre = user.displayName;
      this.usuario.uid = user.uid;

    });
  }
  login() {

    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  logout() {
    this.afAuth.auth.signOut();
  }
  // tslint:disable-next-line:max-line-length
  cargarMensajes(){ this.itemsCollection = this.afs.collection<Mensaje>('chats',ref =>ref.orderBy('fecha', 'desc')  //ref: le paso la query para ordenar los chats en firebase
                                                                            .limit(5))

       return this.itemsCollection.valueChanges() //esto es un observable, retorno el objeto de chats
                                  .map( (mensajes: Mensaje[]) =>{ // devuelvo un arreglo de mensajes
                                  console.log(mensajes);

                                  this.chats = [];

                                  for (let mensaje of mensajes){
                                    this.chats.unshift(mensaje); // inserto siempre en la posicion primera
                                  }
                                  return this.chats;
                                })   // .map() trabaja con la respuesta de un observable, la transforma y devuelve una subcripcion
  }

  //Logica para hacer la insercion de mensajes a Firebase
  agregarMensaje( texto: string){

  //creo la estructura completa del mensaje
  //TODO falta el UID del usuario
  let mensaje: Mensaje = {
  nombre: 'Demo',
  mensaje: texto,
  fecha: new Date().getTime()
  

}

return this.itemsCollection.add(mensaje);// Devuelve una promesa (then o catch)

 }
}
