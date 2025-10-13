
import { io, Socket } from "socket.io-client";

const socket: Socket = io(`import.meta.env.VITE_REACT_APP_SOCKET_URL`, { withCredentials: true });

export default socket;
