import { Link, useNavigate } from "react-router-dom";
import { getPlaylistsData, getUserData, loadMusicsByUserId, logedIn, musicsData} from "../data";
import '../styles/mainPage.css';
import add from '../assets/add.png';
import play from '../assets/play.png';
import pencil from '../assets/pencil.png';
import random from '../assets/randomizer_empty.png';
import list from '../assets/list.png';
import { useState } from "react";
import RowGenerator from "./playlist-row";

export default function MainPage() {
    const userData = getUserData();
    const playlists = getPlaylistsData();
    const [isPlaylists, setIsPlaylist] = useState(true);
    const navigate = useNavigate();

    const [phone, setPhone] = useState(false);
    function sizer(){
      if(!phone && 800>=window.innerWidth)
        setPhone(true)
      else if(phone && 800<window.innerWidth)
        setPhone(false)
    }
    sizer()
    window.addEventListener("resize", sizer)
    return(
        <div className="mainPage">
            
            {userData.id == -1 && <Link to="/auth?mode=login" className="pleaseLogin">Jelentkezz be</Link>}
            {userData.id > -1 &&
            <div className="musicOrPlaylistFlex">
                <button className={!isPlaylists ? "microSelected" : "musicOrPlaylistButton"} 
                onClick={()=>{ setIsPlaylist(false)}}>
                  Zenék
                </button>
                <button className={isPlaylists ? "microSelected" : "musicOrPlaylistButton"} 
                onClick={()=>{setIsPlaylist(true);}}>
                  Lejátszási listák
                </button>
            </div>
            }
            {userData.id > -1 && musicsData.length > 0 && !isPlaylists &&
            <table style={{paddingTop:"40px"}}>
              <thead>
                  <tr className="tableHeader">
                    <th></th>
                    <th>Cím:</th>
                    <th>Album:</th>
                    {phone?undefined:<th>Megjelenés:</th>}
                    {phone?undefined:<th>Műfaj:</th>}
                    <th></th>
                  </tr>
              </thead>
              <tbody>
                {musicsData.map((item, index) => 
                  <RowGenerator 
                    key={index}
                    id={item.id}
                    userId={item.uploaderId}
                    phone={phone}
                    kep={item.imageUrl} 
                    cim={item.name} 
                    eloado={item.artistName} 
                    album={item.albumName} 
                    megjelenes={item.releaseDate} 
                    mufaj={item.mufaj}
                  />
                )}
                {logedIn?<tr className="zeneSor addContaner" onClick={()=>{navigate(`/addMusic?mode=create`)}}><td className="addRow" colSpan={phone?4:6}><img className="addRowImg" src={add} alt="Hozzáadás" /></td></tr>:undefined}
              </tbody>
            </table>
            }
            {userData.id > -1 && playlists.length > 0 && isPlaylists &&playlists.map((elem, index)=>(
                <div className="row" key={index}>
                    <Link to={`/playlist?id=${elem.id}`} className="row-link" >
                        <div className="listaInfo">
                            <span className="mainKepSpan"><img src={elem.listaPic} alt="album kép" className="mainKep"/></span>
                            <span className="mainCimSpan"><p className="mainCim">{elem.name}</p><p className="creator">{elem.userName}</p></span>
                        </div>
                    </Link>
                    <div className="listaButtons">
                        <Link to={`/editPlaylist?id=${elem.id}`}><button className="mainListButtons"><img src={pencil} alt="Letöltés" className="listaButtonImg"/></button></Link>
                        <button className="mainListButtons"><img src={random} alt="Random" className="listaButtonImg"/></button>
                        <button className="mainListButtons"><img src={list} alt="List" className="listaButtonImg"/></button>
                        <button className="mainListButtons"><img src={play} alt="Lejátszás" className="listaButtonImg"/></button>
                    </div>
                </div>
            ))}
            {userData.id > -1 && isPlaylists &&
            <Link to="/editplaylist" className="botRow-link">
                <div className="botRow">
                    <span className="listAdd"><img src={add} alt="Hozzáadás" className="listAddImg"/></span>
                </div>
            </Link>
            }
        </div>
    )
}

export async function mainPageLoader(){
    await loadMusicsByUserId(getUserData().id);
}