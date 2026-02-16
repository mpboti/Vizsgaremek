import { useState } from 'react'
import RowGenerator from './playlist-row.jsx'
import '../styles/playlistSizeChanger.css'
import "../styles/playlistStyle.css"
import { getUserData, dataListaz } from '../data.js'
import pencil from "../assets/pencil.png"
import repeat from "../assets/repeat.png"
import randomizer from "../assets/randomizer_empty.png"
import play from "../assets/play.png"

export default function Playlist() {
  const data = dataListaz();
  const userData = getUserData()[0];
  const [phone, setPhone] = useState(false)
  
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
            <img src={userData.listaPic} alt="album kép" className="albumCoverImg"/>
          </div>
          <div className="listaDataDiv">
            <p className="listaCim">{userData.listaCim}</p>
            <p className="letrehozo">Létrehozó: {userData.name}</p>
            <p className="mufajok">műfajok: <span className="lowerMufajok">{userData.mufajok}</span></p>
            <p className="listaGombtarto">
              <button className="listaGombok"><img src={pencil} alt="szerkeszt" className="listaGombokImg"/></button>
              <button className="listaGombok"><img src={repeat} alt="ismétlés" className="listaGombokImg"/></button>
              <button className="listaGombok"><img src={randomizer} alt="random" className="listaGombokImg"/></button>
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
          {data.map((item, index) => 
            <RowGenerator 
            key={index}
            phone={phone}
            kep={item.kep} 
            cim={item.cim} 
            eloado={item.eloado} 
            album={item.album} 
            megjelenes={item.megjelenes} 
            mufaj={item.mufaj}/>
          )}
        </tbody>
      </table>
    </div>
  );
}