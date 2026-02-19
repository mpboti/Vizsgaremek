import { useState } from "react";
import "../styles/kereses.css"
import { getUserData, ip } from "../data";
import { Link, useParams } from "react-router-dom";
import RowGenerator from "./playlist-row";
import play from '../assets/play.png';
import download from '../assets/download.png';
import random from '../assets/randomizer_empty.png';
import list from '../assets/list.png';
import { loadData } from "../playerLogic";

export default function Kereses(){
  const [data, setData] = useState();
  const userData = getUserData();
  const [selected, setSelected] = useState(0);
  const [microSelected, setMicroSelected] = useState(0);
  const [isUser, setIsUser] = useState(false);
  const [isMusic, setIsMusic] = useState(true);
  const [isItunes, setIsItunes] = useState(false);
  const [isDifferent, setIsDifferent] = useState(true);
  const { text } = useParams();

  async function firstPlay(id){
    if(isDifferent){
      await loadData(data, id);
      setIsDifferent(false)
    }
  }

  const [phone, setPhone] = useState(false)
  sizer()
  function sizer(){
    if(!phone && 800>=window.innerWidth)
      setPhone(true)
    else if(phone && 800<window.innerWidth)
      setPhone(false)
  }
  window.addEventListener("resize", sizer)

  async function readITunes(){
    try {
      const response = await fetch(`https://itunes.apple.com/search?term=${text}&media=music&limit=100`);
      const resData = await response.json();
      console.log(resData);
      let perData = new Array();
      let i = 0;
      resData.results.forEach(element => {
        perData.push({
          id: i++,
          kep: element.artworkUrl100,
          cim: element.trackName,
          eloado: element.artistName,
          album: element.collectionName?element.collectionName:"-",
          megjelenes: element.releaseDate?element.releaseDate.split("-")[0]:"-",
          mufaj: element.primaryGenreName,
          zene: element.previewUrl
        })
      });
      setData(perData);
      setIsItunes(true);
    }catch(e){
      console.log(e.message);
    }
  }

  async function readMusicByName(){
    try {
      const response = await fetch(`http://${ip}/search/musicsByName/${text}`);
      const resData = await response.json();
      console.log(resData);
      let perData = new Array();
      let i = 0;
      resData.results.forEach(element => {
        perData.push({
          id: i++,
          kep: element.artworkUrl100,
          cim: element.trackName,
          eloado: element.artistName,
          album: element.collectionName?element.collectionName:"-",
          megjelenes: element.releaseDate?element.releaseDate.split("-")[0]:"-",
          mufaj: element.primaryGenreName,
          zene: element.previewUrl
        })
      });
      setData(perData);
      setIsItunes(true);
    }catch(e){
      console.log(e.message);
    }
  }

  return (
    <div className="keresesContent">
      <div className="keresesMenu">
        <div className="keresesMenuFlex">
          <button className={selected === 0 ? "selected" : "keresesMenuButtons"} 
          onClick={() => {setIsUser(false); setIsMusic(true); setIsItunes(false); setIsDifferent(true);
          setSelected(0); readMusicByName();}}>
            Zenék
          </button>
          <button className={selected === 1 ? "selected" : "keresesMenuButtons"} 
          onClick={() => {setIsUser(false); setIsMusic(false); setIsItunes(false); setIsDifferent(true); 
          setSelected(1);}}>
            Lejátszási Listák
          </button>
          <button className={selected === 2 ? "selected" : "keresesMenuButtons"} 
          onClick={() => {setIsUser(true); setIsMusic(true); setIsItunes(false); setIsDifferent(true);
          setSelected(2); setMicroSelected(0);}}>
            Előadók
          </button>
          <button className={selected === 3 ? "selected" : "keresesMenuButtons"} 
          onClick={() => {setIsUser(true); setIsMusic(true); setIsItunes(false); setIsDifferent(true);
          setSelected(3); setMicroSelected(0);}}>
            Albumok
          </button>
          <button className={selected === 4 ? "selected" : "keresesMenuButtons"} 
          onClick={() => {setIsUser(true); setIsMusic(true); setIsItunes(false); setIsDifferent(true);
          setSelected(4); setMicroSelected(0);}}>
            Felhasználók
          </button>
          <button className={selected === 5 ? "selected" : "keresesMenuButtons"} 
          onClick={() => {setIsUser(false); setIsMusic(true); setIsDifferent(true);
          setSelected(5); readITunes();}}>
            Hozzáadás
          </button>
        </div>
        {isUser?
          <div className="musicOrPlaylistFlex">
            <button className={microSelected === 0 ? "microSelected" : "musicOrPlaylistButton"} 
            onClick={()=>{setMicroSelected(0); setIsMusic(true); setIsDifferent(true);}}>
              Zenék
            </button>
            <button className={microSelected === 1 ? "microSelected" : "musicOrPlaylistButton"} 
            onClick={()=>{setMicroSelected(1); setIsMusic(false); setIsDifferent(true);}}>
              Lejátszási listák
            </button>
          </div>
        :undefined}
      </div>
      {isMusic? 
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
              key={index}
              phone={phone}
              kep={item.kep} 
              cim={item.cim} 
              eloado={item.eloado} 
              album={item.album} 
              megjelenes={item.megjelenes} 
              mufaj={item.mufaj}
              isItunes={isItunes}
              id={item.id}
              firstPlay={firstPlay}/>
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