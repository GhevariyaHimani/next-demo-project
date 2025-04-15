import mongoose from "mongoose";

const CONNECTION_STRING = process.env.CONNECTION_STRING;

const connect = async () => {
    const connectionState = mongoose.connection.readyState;

    if(connectionState === 1){
        console.log('Already connected');
        return;
    }

    if(connectionState === 2){
        console.log('Connecting...');
        return;
    }

    try {
        mongoose.connect(CONNECTION_STRING!,{
            dbName : "nextDemo",
            bufferCommands : true
        });
        console.log('Connected',)
    } catch (error:unknown) {
        console.log('Error', error)
    }
};

export default connect;