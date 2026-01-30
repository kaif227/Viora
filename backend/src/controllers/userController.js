import httpStatus from "http-status";
import bcrypt, {hash} from "bcrypt";
import crypto from "crypto";
import { Meeting } from "../models/meetingModel.js";
import {User} from "../models/userModel.js";




const register = async(req,res)=>{
    const {name,username,password} = req.body;
    try {
        const existingUser = await User.findOne({username: username});
        if(existingUser){
            // return res.status(400).json({message:"User already exists"});
            return res.status(httpStatus.FOUND).json({message:"User already exists"});
        }
        const hashedPassword = await bcrypt.hash(password,10);
        const newUser = new User({
            name,
            username,
            password: hashedPassword
        });
        await newUser.save();
        return res.status(httpStatus.CREATED).json({message:"User registered successfully"
        })
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message:`Something went wrong : ${error}`});
        
    }
}
const login = async(req,res)=>{
    const {username,password} = req.body;
    if(!username || !password){
        return res.status(400).json({message:"Please provide all required fields"});
    }
    try {
        const user = await User.findOne({
            username,
            
        })
        if(!user){
            return res.status(httpStatus.NOT_FOUND).json({message:"Username or password is incorrect"});
        }
        if(bcrypt.compare(password,user.password)){
            let token = crypto.randomBytes(20).toString('hex');
            user.token = token;
            
            await user.save();
            return res.status(httpStatus.OK).json({message:"Login successful",token:token});
        }
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:error})
    }
}



const getUserHistory = async (req, res) => {
    const { token } = req.query;

    try {
        const user = await User.findOne({ token: token });
        const meetings = await Meeting.find({ user_id: user.username })
        res.json(meetings)
    } catch (e) {
        res.json({ message: `Something went wrong ${e}` })
    }
}



const addToHistory = async (req, res) => {
    const { token, meeting_code } = req.body;

    try {
        const user = await User.findOne({ token: token });

        const newMeeting = new Meeting({
            user_id: user.username,
            meetingCode: meeting_code
        })

        await newMeeting.save();

        res.status(httpStatus.CREATED).json({ message: "Added code to history" })
    } catch (e) {
        res.json({ message: `Something went wrong ${e}` })
    }
}
export {login,register,getUserHistory,addToHistory}