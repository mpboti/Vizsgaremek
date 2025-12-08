import { useState } from 'react'
import RowGenerator from './playlist-row.jsx'
import '../styles/playlistSizeChanger.css'
import "../styles/playlistStyle.css"


export default function Playlist({data, userData}) {
  const [phone, setPhone] = useState(false)
  sizer()
  function sizer(){
    if(!phone && 800>=window.innerWidth)
      setPhone(true)
    else if(phone && 800<window.innerWidth)
      setPhone(false)
  }
  window.addEventListener("resize", sizer)
  return (
    <>
      <table>
        <tbody>
          <tr>
            <td className="mainAlbumCover">
              <img src={userData.listaPic} alt="album kép" className="albumCover"/>
            </td>
            <td className="listaDataTd">
              <p className="listaCim">{userData.listaCim}</p>
              <p className="letrehozo">Létrehozó: {userData.name}</p>
              <p className="mufajok">mufajok: <span className="lowerMufajok">{userData.mufajok}</span></p>
              {phone?undefined:<p className="listaGombtartó">
                <button className="listaGombok"><img src="../../public/pencil.png" alt="szerkeszt" className="listaGombokImg"/></button>
                <button className="listaGombok"><img src="../../public/repeat.png" alt="ismétlés" className="listaGombokImg"/></button>
                <button className="listaGombok" id="play"><img src="../../public/randomizer empty.png" alt="random" className="listaGombokImg"/></button>
                <button className="listaGombok" id="play"><img src="../../public/play.png" alt="lejátszás" className="listaGombokImg"/></button>
              </p>}
            </td>
          </tr>
          {phone?<tr>
            <td colSpan={2}>
              <p className="listaGombtartó">
                <button className="listaGombok"><img src="../../public/pencil.png" alt="szerkeszt" className="listaGombokImg"/></button>
                <button className="listaGombok"><img src="../../public/repeat.png" alt="ismétlés" className="listaGombokImg"/></button>
                <button className="listaGombok" id="play"><img src="../../public/randomizer empty.png" alt="random" className="listaGombokImg"/></button>
                <button className="listaGombok" id="play"><img src="../../public/play.png" alt="lejátszás" className="listaGombokImg"/></button>
              </p>
            </td>
          </tr>:undefined}
        </tbody>
      </table>
      <table>
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
          {data.map((item, index) => 
            <RowGenerator 
            phone={phone}
            key={index} 
            kep={item.kep} 
            cim={item.cim} 
            eloado={item.eloado} 
            album={item.album} 
            megjelenes={item.megjelenes} 
            mufaj={item.mufaj}/>
          )}
        </tbody>
      </table>
    </>
  );
}