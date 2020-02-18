import { promoted } from '../module/student-promoted';
import { logInfoDetails } from '../../helper/logger';

let channel;
const setChannel = (val) => {
    channel = val;
};

const process = async (msg) => {

    if(msg && msg.content){
        logInfoDetails({ message: `Message received from student promoted queue has content: ${msg.content.toString()}`});
        promoted(JSON.parse(msg.content).body);
    } else {
        logInfoDetails({ message: `Message received from student promoted queue has no pay load`});
    }

    channel.ack(msg, false);
};

module.exports = { process, setChannel };
