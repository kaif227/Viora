
import { Server } from "socket.io";


let connections = {};//how many users are connected with us
let messages = {};
let timeOnline = {};
const connectToSocket = (server) =>{
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],//this is not for production use proper cors settings
            allowedHeaders: ["*"],
            credentials: true
        }
    });

    io.on("connection",(socket)=>{
        console.log("SOMETHING CONNECTED")
        socket.on("join-call",(path)=>{
            if(connections[path] === undefined){//if no one is connected to this path
                connections[path] = [];//create an empty array
            }
            connections[path].push(socket.id);//add the new user to the array
            timeOnline[socket.id] = new Date();//store the time when the first user joined

            for (let a = 0; a < connections[path].length; a++) {
                // emit the new user's id and the current clients array (flat)
                io.to(connections[path][a]).emit("user-joined", socket.id, connections[path]);
            }
            if (messages[path] !== undefined) {
                for (let a = 0; a < messages[path].length; ++a) {
                    const msg = messages[path][a];
                    io.to(socket.id).emit("chat-message", msg.data, msg.sender, msg["socket-id-sender"]);
                }
            }



        });
        socket.on("signal",(told,message)=>{
            io.to(told).emit("signal",socket.id,message);

        })
        socket.on("chat-message",(data,sender)=>{
            const [matchingRoom,found] = Object.entries(connections)
            .reduce(([room,isFound],[roomKey,roomValue])=>{
                if(!isFound && roomValue.includes(socket.id)){
                    return [roomKey,true];
                }
                return [room,isFound];

            },["",false]);

            if(found === true){
                if(messages[matchingRoom] === undefined){
                    messages[matchingRoom] = [];
                }
                messages[matchingRoom].push({'data':data,'sender':sender,"socket-id-sender":socket.id});
                console.log("messages",matchingRoom, ":",sender,data);
                connections[matchingRoom].forEach((elem)=>{
                    io.to(elem).emit("chat-message",data,sender,socket.id);
                })
            }
        });
         socket.on("disconnect",()=>{
            //var
            let diiffTime = Math.abs(timeOnline[socket.id]  - new Date());
            // var
            let key;
            for(const [k,v] of JSON.parse(JSON.stringify(Object.entries(connections)))){
                for(let a= 0;a<v.length;++a){
                    if(v[a] === socket.id){
                        key = k;
                        for(let a = 0;a<connections[key].length;++a){
                            io.to(connections[key][a]).emit("user-left",socket.id);//disconnecting user
                        }
                        //var
                        let index = connections[key].indexOf(socket.id);
                        connections[key].splice(index,1);//removing user from connection list 
                        if(connections[key].length === 0){
                            delete connections[key];
                        }

                    }

                }

          }}
        )

    });//when a user connects to our socket server
    return io;
}
export  {connectToSocket};//this code is used to connect socket io with express server