import io from 'socket.io-client';
import { HOST_SK } from '../config';

const socket = io(HOST_SK);

export default socket;
