import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/authConext.jsx";
import withAuth from "../utils/withAuth.jsx";
import "../App.css";
import { IconButton } from "@mui/material";
import RestoreIcon from "@mui/icons-material/Restore";
import { Button } from "@mui/material";
import { TextField } from "@mui/material";
function HomeComponent() {
  const [meetingCode, setMeetingCode] = useState("");
  let navigate = useNavigate();
  const { addToUserHistory } = useContext(AuthContext);
  let handleJoinVideoCall = async () => {
    await addToUserHistory(meetingCode);
    navigate(`/${meetingCode}`);
  };
  let handleCreateNewMeeting = async () => {
    navigate(`/${Math.random().toString(36).substring(2, 7)}`);
  };
  return (
    <>
      <div className="navBar">
        <div style={{ display: "flex", alignItems: "center" }}>
          <h3>Viora Video Call</h3>
        </div>
        {/* <div style={{display:"flex", alignItems:"center"}}>
                <IconButton onClick={()=>{
                    navigate("/history")
                }}>
                    <RestoreIcon />
                </IconButton>
                    <p>History</p>
                <Button onClick={()=>{
                    localStorage.removeItem("token")
                    navigate("/auth")
                }}>
                    LOGOUT
                </Button>

            </div>  */}
        <div className="navActions">
          <IconButton onClick={() => navigate("/history")}>
            <RestoreIcon />
          </IconButton>
          <p>History</p>
          <Button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/auth");
            }}
          >
            LOGOUT
          </Button>
        </div>
      </div>
      <div className="meetContainer">
        <div className="leftPanel">
          <div>
            <h2>Connect with your loved once</h2>
            <p>Start or join a secure video call with just a click</p>
            <div
              role="button"
              style={{ display: "flex", gap: "10px" }}
              className="createNewMeeting"
            >
              <TextField
                onChange={(e) => setMeetingCode(e.target.value)}
                id="outline"
                placeholder="Meeting Code"
              ></TextField>
              <Button onClick={handleJoinVideoCall} variant="contained">
                Join
              </Button>
            </div>
          </div>
        </div>
        <div className="rightPanel">
          <img src="logo3.png" alt="image" />
        </div>
      </div>
    </>
  );
}

export default withAuth(HomeComponent);
