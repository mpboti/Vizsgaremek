import { useState } from "react";
import "../styles/kereses.css"
import { dataListaz, userDataListaz } from "../data";
import { Link } from "react-router-dom";
import RowGenerator from "./playlist-row";
import play from '../assets/play.png';
import download from '../assets/download.png';
import random from '../assets/randomizer_empty.png';
import list from '../assets/list.png';

export default function Kereses(){
  const data = dataListaz();
  const userData = userDataListaz();
  const [selected, setSelected] = useState(0);
  const [microSelected, setMicroSelected] = useState(0);
  const [isUser, setIsUser] = useState(false);
  const [isMusic, setIsMusic] = useState(true);
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
    <div className="keresesContent">
      <div className="keresesMenu">
        <div className="keresesMenuFlex">
          <button className={selected === 0 ? "selected" : "keresesMenuButtons"} onClick={() => {setSelected(0); setIsUser(false); setIsMusic(true);}}>
            Zenék
          </button>
          <button className={selected === 1 ? "selected" : "keresesMenuButtons"} onClick={() => {setSelected(1); setIsUser(false); setIsMusic(false);}}>
            Lejátszási Listák
          </button>
          <button className={selected === 2 ? "selected" : "keresesMenuButtons"} onClick={() => {setSelected(2); setMicroSelected(0); setIsUser(true); setIsMusic(true);}}>
            Előadók
          </button>
          <button className={selected === 3 ? "selected" : "keresesMenuButtons"} onClick={() => {setSelected(3); setMicroSelected(0); setIsUser(true); setIsMusic(true);}}>
            Albumok
          </button>
          <button className={selected === 4 ? "selected" : "keresesMenuButtons"} onClick={() => {setSelected(4); setMicroSelected(0); setIsUser(true); setIsMusic(true);}}>
            Felhasználók
          </button>
          <button className={selected === 5 ? "selected" : "keresesMenuButtons"} onClick={() => {setSelected(5); setIsUser(false); setIsMusic(true);}}>
            Hozzáadás
          </button>
        </div>
        {isUser?
          <div className="musicOrPlaylistFlex">
            <button className={microSelected === 0 ? "microSelected" : "musicOrPlaylistButton"}  onClick={()=>{setMicroSelected(0); setIsMusic(true);}}>Zenék</button>
            <button className={microSelected === 1 ? "microSelected" : "musicOrPlaylistButton"} onClick={()=>{setMicroSelected(1); setIsMusic(false);}}>Lejátszási listák</button>
          </div>
        :undefined}
      </div>
      {isMusic? 
        <table>
          <thead >
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
      :
        <div>
          {userData.map((elem, index)=>(
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
        </div>
      }
    </div>
  );
}