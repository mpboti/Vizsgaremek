import { Link } from "react-router-dom";
import { getUserData } from "../data";
import '../styles/mainPage.css';
import add from '../assets/add.png';
import play from '../assets/play.png';
import download from '../assets/download.png';
import random from '../assets/randomizer_empty.png';
import list from '../assets/list.png';
import { useEffect, useState } from "react";

export default function MainPage() {
    const userData = getUserData();
    const [playlists, setPlaylists] = useState([]);
    useEffect(()=>{
        async function getPlaylists(){
            if(userData.id == -1)
                return;
            const response = await fetch("http://localhost:3000/playlists/byuserid/"+userData.id, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': localStorage.getItem("token")
                }
            });
            const resData = await response.json();
            console.log(resData.message);
            if(resData.message == "No playlists found for this user.") {
                setPlaylists([]);
            }else{
                setPlaylists(resData);
            }
        }
        getPlaylists();
    }, [userData.id])
    return(
        <div className="mainPage">
            {userData.id == -1 && <Link to="/auth?mode=login" className="pleaseLogin">Jelentkezz be</Link>}
            {userData.id > -1 && playlists.length > 0 && playlists.map((elem, index)=>(
                <div className="row" key={index}>
                    <Link to={`/playlist/${elem.id}`} className="row-link" >
                        <div className="listaInfo">
                            <span className="mainKepSpan"><img src={elem.listaPic} alt="album kép" className="mainKep"/></span>
                            <span className="mainCimSpan"><p className="mainCim">{elem.listaCim}</p><p className="creator">{elem.name}</p></span>
                        </div>
                    </Link>
                    <div className="listaButtons">
                        <button className="mainListButtons"><img src={download} alt="Letöltés" className="listaButtonImg"/></button>
                        <button className="mainListButtons"><img src={random} alt="Random" className="listaButtonImg"/></button>
                        <button className="mainListButtons"><img src={list} alt="List" className="listaButtonImg"/></button>
                        <button className="mainListButtons"><img src={play} alt="Lejátszás" className="listaButtonImg"/></button>
                    </div>
                </div>
            ))}
            {userData.id > -1 && 
            <Link to="/addplaylist" className="botRow-link">
                <div className="botRow">
                    <span className="listAdd"><img src={add} alt="Hozzáadás" className="listAddImg"/></span>
                </div>
            </Link>
            }
        </div>
    )
}