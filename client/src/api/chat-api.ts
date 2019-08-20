import io from "socket.io-client";
import { Observable } from 'rxjs';

class ChatApi {
    private io: any;
    private currentUser: { name: string } = { name: '' };
    private _isAuth: boolean = false;

    public constructor() {
        this.io = io('http://localhost:3000');
    }

    public join(user: { name: string }): void {
        this.io.emit('user_join', user);
        this.currentUser = user;
        this._isAuth = true;
    }

    public isAuth(): boolean {
        return this._isAuth;
    }

    public sendMessage(message: string): void {
        this.io.emit('chat_message', { message });
    }

    public onUserJoin(): Observable<{ name: string }> {
        return Observable.create(observer => {
            this.io.on('user_join', function (user: { name: string }) {
                observer.next(user);
            });
        });
    }

    public onUserDisconnect(): Observable<{ name: string }> {
        return Observable.create(observer => {
            this.io.on('user_disconnect', function (user: { name: string }) {
                observer.next(user);
            });
        });
    }

    public onMessageReceive(): Observable<{ sender: string, message: string, timestamp: string }> {
        return Observable.create(observer => {
            this.io.on('chat_message', function (message: { sender: string, message: string, timestamp: string }) {
                observer.next(message);
            });
        });
    }
}

export default new ChatApi();