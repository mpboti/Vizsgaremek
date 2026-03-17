import { Link, useNavigate } from "react-router-dom";
import { getPlaylistsData, getUserData, loadMusicsByUserId, loadPlaylists, logedIn, musicsData} from "../data";
import '../styles/mainPage.css';
import add from '../assets/add.png';
import { useState } from "react";
import RowGenerator from "./playlist-row";
import PlaylistShow from "./playlist-show";

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
            <div className="musicOrPlaylistFlex keresesMenu">
                <button className={!isPlaylists ? "microSelected" : "musicOrPlaylistButton"} 
                onClick={()=>{setIsPlaylist(false);}}>
                  Zenék
                </button>
                <button className={isPlaylists ? "microSelected" : "musicOrPlaylistButton"} 
                onClick={()=>{setIsPlaylist(true);}}>
                  Lejátszási listák
                </button>
            </div>
            }
            {userData.id > -1 && !isPlaylists &&
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
            {userData.id > -1 && playlists.length > 0 && isPlaylists &&playlists.map((elem)=>(
              <PlaylistShow key={elem.id}
              id={elem.id} 
              listaPic={elem.listaPic} 
              name={elem.name} 
              userName={elem.userName} 
              ownerId={elem.ownerId}
              />
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
  await loadPlaylists(getUserData().id);
}