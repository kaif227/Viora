import { createContext, useContext, useState } from "react";
import axios from "axios";
import HttpStatus from "http-status";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext({});
const client = axios.create({
    baseURL: "http://localhost:8000/users",
});


export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);
    const [userData, setUserData] = useState(authContext);
    const handleRegister = async (name,username,password) => {
        try {
            let request = await client.post("/register", {
                name:name,
                username:username,
                password:password 
             } );
             if(request.status === HttpStatus.CREATED){
                return request?.data?.message || "User registered successfully";

             }
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error?.message || "Registration failed";
            throw new Error(errorMessage);
            
        }
    }
    const handleLogin = async (username,password) => {
        try {
            let request = await client.post("/login", {
                username:username,
                password:password
            });
            if(request.status === HttpStatus.OK){
                localStorage.setItem("token",request.data.token);
                navigate("/home");
            }
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error?.message || "Login failed";
            throw new Error(errorMessage);  
            
        }
    }
    const getHistoryOfUser = async () => {
        try {
            let request = await client.get("/get_all_activity", {
                params: {
                    token: localStorage.getItem("token")
                }
            });
            return request.data
        } catch
         (err) {
            throw err;
        }
    }
    const addToUserHistory = async (meetingCode) => {
        try {
            let request = await client.post("/add_to_activity", {
                token: localStorage.getItem("token"),
                meeting_code: meetingCode
            });
            return request
        } catch (e) {
            throw e;
        }
    }
      const data = {
        userData, setUserData, addToUserHistory, getHistoryOfUser, handleRegister, handleLogin
    }
    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    )
}