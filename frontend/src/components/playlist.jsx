import { useState } from 'react'
import RowGenerator from './playlist-row.jsx'
import '../styles/playlistSizeChanger.css'
import "../styles/playlistStyle.css"
import { getMusicsData, getPlaylistData, getUserData, loadPlaylist, logedIn, loadMusicsByPlaylistId } from '../data'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import pencil from "../assets/pencil.png"
import repeat from "../assets/repeat.png"
import randomizer from "../assets/randomizer_empty.png"
import play from "../assets/play.png"
import add from "../assets/add.png"

export default function Playlist() {
  const [searchParams] = useSearchParams();
  const playlistId = searchParams.get("id");
  const userData = getUserData();
  const playlistData = getPlaylistData();
  const musicsData = getMusicsData();
  const [isEdit, setIsEdit] = useState(false);
  const navigate = useNavigate();
  if(playlistId!=playlistData.id)
    navigate("/");

  const [phone, setPhone] = useState(false);
  function sizer(){
    if(!phone && 800>=window.innerWidth)
      setPhone(true)
    else if(phone && 800<window.innerWidth)
      setPhone(false)
  }
  sizer()
  window.addEventListener("resize", sizer)
  return (
    <div className="playlistContainer">
      <div>
        <div className="playlistHeader">
          <div className="mainAlbumCover">
            <img src={playlistData.listaPic} alt="album kép" className="albumCoverImg"/>
          </div>
          <div className="listaDataDiv">
            <p className="listaCim">Cím: {playlistData.name}</p>
            <p className="letrehozo">Létrehozó: {playlistData.userName}</p>
            <p className="mufajok">műfajok: <span className="lowerMufajok">{playlistData.mufajok}</span></p>
            <p className="listaGombtarto">
              {logedIn && userData.id==playlistData.ownerId?<button className={isEdit?"listaGombok editing":"listaGombok"} onClick={()=>isEdit?setIsEdit(false):setIsEdit(true)}><img src={pencil} alt="szerkeszt" className="listaGombokImg"/></button>:undefined}
              <button className="listaGombok"><img src={play} alt="lejátszás" className="listaGombokImg"/></button>
            </p>
          </div>
        </div>
      </div>
      <table className="zeneTabla">
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
        <tbody className="playlistBody">
          {playlistData.musics.length==0?undefined:
          musicsData.map((item, index) => 
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
            mufaj={item.mufaj}/>
          )}
          {(isEdit || playlistData.musics.length==0)&&logedIn?<tr className="zeneSor addContaner" onClick={()=>{navigate(`/addMusic?mode=create&playlisId=${playlistData.id}`)}}><td className="addRow" colSpan={phone?4:6}><img className="addRowImg" src={add} alt="Hozzáadás" /></td></tr>:undefined}
        </tbody>
      </table>
    </div>
  );
}

export async function PlaylistLoader({request}){
  const playlistId = new URL(request.url).searchParams.get("id")
  await loadPlaylist(playlistId);
  await loadMusicsByPlaylistId(playlistId);
}