import { useEffect, useRef, useState } from "react"
import "../styles/top.css";
import { Link, Outlet } from "react-router-dom";
import { getUserData, logedIn, logout } from '../data';
import { useNavigate } from "react-router-dom";
import { getAuthToken } from "../auth";
import back from '../assets/back.png';
import home from '../assets/home.png';
import search from '../assets/search.png';
import Player from "./player";
import enter from '../assets/enter.png';

export default function TopContent() {
    const szoveg = useRef();
    const userData = getUserData();

    useEffect(()=>{
      const token = getAuthToken();
      if((!token || token == "EXPIRED") && logedIn){
        logout();
      }
    },[])
    
    function GetText() {
        if (0 < szoveg.current.value.length) {
            return szoveg.current.value;
        }
    }

    const navigate = useNavigate();
    function handleBack() {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate("/");
        }
    };

    function keyDown(e){
        if(e.key==="Enter"){
            navigate("/search");
        }
    }

    const [phone, setPhone] = useState(false);
    function sizer(){
        if(!phone && 650>=window.innerWidth)
            setPhone(true)
        else if(phone && 650<window.innerWidth)
            setPhone(false)
    }
    sizer()
    window.addEventListener("resize", sizer);


    return (
        <>
            <div className="topBar">
                <div className="backDiv">
                    <button onClick={handleBack} className="topGombok"><img src={back} alt="vissza" className="topGombokImg"/></button>
                </div>
                <div className="midleDiv">
                    <div className="home">
                        <Link to="/" className="topGombok"><img src={home} alt="home" className="topGombokImg"/></Link>
                    </div>
                    <div className="keresomezo">
                        <div className="keresokeret">
                            <Link to="/search" className="keresGomb"><img src={search} alt="kereses" className="topGombokImg" /></Link>
                            <input ref={szoveg} type="text" className="searchText" onKeyDown={keyDown}></input>
                        </div>
                    </div>
                </div>
                <div className="userNameDiv">
                    <p className="toltelek"></p>{phone?undefined:<p className="userName">{userData.name.length<19?userData.name:userData.name.substring(0,18)}</p>}
                </div>
                <div className="userPicDiv">
                    {logedIn && 
                    <Link to="/setting" className="topGombok">
                    <img className="userPic" src={userData.userPic}/>
                    </Link>}
                    {!logedIn &&
                    <Link to="/auth?mode=login" className="topGombok">
                        <img className="userPic" src={enter}/>
                    </Link>}
                </div>
            </div>
            <Outlet />
            {/*<Player />*/}
        </>
        
    );
}