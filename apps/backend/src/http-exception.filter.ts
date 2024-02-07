import { Socket } from "socket.io";
import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const client = host.switchToWs().getClient() as Socket;
    const wsException = new WsException(exception.message);
    client.emit("exception", wsException);
  }
}
