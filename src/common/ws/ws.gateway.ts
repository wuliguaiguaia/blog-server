// import {
//   ConnectedSocket,
//   MessageBody,
//   SubscribeMessage,
//   WebSocketGateway,
//   WebSocketServer,
// } from '@nestjs/websockets';

// // import * as WebSocket from 'ws';
// // import { Server } from 'ws';
// import { Server } from 'socket.io';

// @WebSocketGateway(3002)
// export class WsStartGateway {
//   //供其它模块调用
//   @WebSocketServer()
//   server: Server;

//   @SubscribeMessage('hello')
//   hello(@MessageBody() data: any): any {
//     return {
//       event: 'hello',

//       data: data,

//       msg: 'rustfisher.com',
//     };
//   }

//   @SubscribeMessage('newComment')
//   newComment(@MessageBody() data: any, @ConnectedSocket() client: any): any {
//     // const { whois, id, type } = data;
//     console.log('data', data);
//     client.send('hhhh');
//     client.broadcast.emit('events', data);

//     return { event: 'hello2', data: data };
//   }
// }

import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway(3002)
export class WsStartGateway {
  //供其它模块调用
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('createD')
  create(@MessageBody() createDDto) {
    return 'ok';
  }
}
