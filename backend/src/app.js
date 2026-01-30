import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import {createServer} from "node:http";//we have to create server for socket io because it connect socket server with express server
// import {Server} from "socket.io";
import cors from 'cors';
import {connectToSocket} from "./controllers/socketManager.js"
import userRoutes from "./routes/usersRoutes.js"; 



const app = express();
const PORT = 8000;

const server = createServer(app);
const io = connectToSocket(server);
// const io = new Server(server)



const db_url = process.env.MONGODB_URL
main()
.then(() =>{
  console.log('MongoDB connected!')
} 
).catch(err => console.log(err));

async function main() {
  await mongoose.connect(db_url);

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
};

app.set('port',PORT|| 8000);
app.use(cors());
app.use(express.json({limit:"50kb"}));
app.use(express.urlencoded({ extended: true , limit:"50kb"}));

app.get('/',(req,res)=>{
    console.log("Hello World");
    return res.json({message:"Hello World"});
    //
});



app.use("/users", userRoutes);
const start = async()=>{
  server.listen(app.get("port"),()=>{
      console.log(`Server is running on port ${PORT}`);
  })

}
start();