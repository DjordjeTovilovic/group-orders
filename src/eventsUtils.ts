import { Room } from '@prisma/client';
import { Request, Response } from 'express';

type Client = {
  id: number;
  roomId: number;
  response: Response;
};

let clients: Client[] = [];

export function eventsHandler(request: Request, response: Response) {
  const headers = {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache',
  };
  response.writeHead(200, headers);

  const clientId = Date.now();

  const newClient = {
    id: clientId,
    roomId: +request.params.roomId,
    response,
  };

  clients.push(newClient);

  request.on('close', () => {
    console.log(`${clientId} Connection closed`);
    clients = clients.filter((client) => client.id !== clientId);
  });
}

export function sendEventToRoomMembers(roomId: Room['id'], event: any) {
  console.log({ event });

  clients.forEach((client) => {
    if (client.roomId === roomId) {
      client.response.write(`data: ${JSON.stringify(event)}\n\n`);
    }
  });
}
