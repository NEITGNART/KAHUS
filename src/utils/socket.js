import io from 'socket.io-client';
import { HOST_API } from '../config';

const socket = io(HOST_API);

export default socket;
