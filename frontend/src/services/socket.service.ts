import { io, Socket } from 'socket.io-client';
import Cookies from 'js-cookie';

let socket: Socket | null = null;

export function getSocket(): Socket | null {
    return socket;
}

export function connectSocket(): Socket | null {
    const token = Cookies.get('token');
    if (!token) {
        console.warn('⚠️ No auth token found — skipping socket connection');
        return null;
    }

    if (socket?.connected) {
        return socket;
    }

    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

    if (!socket) {
        socket = io(socketUrl, {
            // Function form: re-read the cookie fresh on every connect/reconnect attempt
            auth: (cb) => {
                const currentToken = Cookies.get('token');
                cb({ token: currentToken });
            },
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: 10,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            timeout: 10000,
        });

        socket.on('connect', () => {
            console.log('🔌 Socket connected:', socket?.id);
        });

        socket.on('disconnect', (reason) => {
            console.log('🔌 Socket disconnected:', reason);
            if (reason === 'io server disconnect' || reason === 'transport close') {
                // Don't blindly reconnect — check we still have a valid-looking token first
                const currentToken = Cookies.get('token');
                if (currentToken) {
                    setTimeout(() => connectSocket(), 1000);
                } else {
                    socket = null;
                }
            }
        });

        socket.on('connect_error', (error) => {
            console.error('❌ Socket connection error:', error.message);

            // Token is dead — stop retrying with it, tear down the socket entirely.
            // Let the normal auth flow (checkAuth/login redirect) handle re-establishing it.
            if (error.message.includes('jwt expired') || error.message.includes('Invalid or expired token')) {
                socket?.disconnect();
                socket = null;
            }
        });
    } else if (!socket.connected) {
        socket.connect();
    }

    return socket;
}

export function disconnectSocket(): void {
    if (socket) {
        socket.removeAllListeners();
        socket.disconnect();
        socket = null;
    }
}