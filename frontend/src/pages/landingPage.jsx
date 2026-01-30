import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function LandingPage() {
    const router = useNavigate();
    return ( 
        <div className="landingPageContainer">
            <nav>
                <div className="navheader">
                    <h2>Viora video call</h2>
                    </div>
                <div className="navList">
                    <p onClick={()=>{
                        router("/guest")
                    }}>Join as Guest</p>
                    <p onClick={()=>{
                        router("/auth")
                    }}>Register</p>
                    <div role="button">
                        <p onClick={()=>{
                            router("/auth")
                        }}>Login</p>
                    </div>
                </div>
            </nav>
            <div className="landingMainContainer">
                <div>
                    <h2><span style={{color:"#FF9839"}}>Connect</span> with your loved Once</h2>
                    <p>Cover distance by Viora Video call</p>
                    <div role="button">
                        <Link to={"/auth"}  >Get Started</Link>
                    </div>
                </div>
                    <div>
                    <img src="/mobile.png" alt="" />
                    </div>
            </div>

        </div>
     );
}

export default LandingPage;