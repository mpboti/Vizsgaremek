import { useEffect, useState } from "react";
import "../styles/kereses.css"
import { getMusicsData, getPlaylistsData, searchITunes, searchMusics, searchPlaylists,} from "../data";
import { Link, useSearchParams } from "react-router-dom";
import RowGenerator from "./playlist-row";
import play from '../assets/play.png';
import random from '../assets/randomizer_empty.png';
import list from '../assets/list.png';
import pencil from "../assets/pencil.png"

export default function Kereses(){
  const [searchParams] = useSearchParams();
  const [text, setText] = useState("");
  const [musicsData, setMusicData] = useState(getMusicsData());
  const [playlistsData, setPlaylistsData] = useState(getPlaylistsData());
  const [selected, setSelected] = useState(0);
  const [isUser, setIsUser] = useState(false);
  const [isMusic, setIsMusic] = useState(true);

  useEffect(()=>{
    async function loading() {
      setText(searchParams.get("text"));
      
      
      switch (selected){
      
        case 0: 
        await searchMusics(searchParams.get("text"), "musicsByName"); 
        break;

        case 1: 
        await searchPlaylists(searchParams.get("text"), "playlistsByName");
        break;

        case 2: 
        await searchMusics(searchParams.get("text"), "artistsByName");
        break;

        case 3: 
        await searchMusics(searchParams.get("text"), "albumsByName");
        break;

        case 4: 
        if(isMusic)
          await searchMusics(searchParams.get("text"), "musicsByUsername");
        else
          await searchPlaylists(searchParams.get("text"), "playlistsByUsername");
        break;

        case 5: 
        await searchITunes(searchParams.get("text"));
        localStorage.setItem("searchText", searchParams.get("text"));
        break;
      }
      setMusicData(getMusicsData());
      setPlaylistsData(getPlaylistsData());
    }
    loading()
  },[searchParams, text, selected, isMusic])

  const [phone, setPhone] = useState(false)
  sizer()
  function sizer(){
    if(!phone && 800>=window.innerWidth)
      setPhone(true)
    else if(phone && 800<window.innerWidth)
      setPhone(false)
  }
  window.addEventListener("resize", sizer)

  async function readMusicByName(){
    await searchMusics(text, "musicsByName");
    setMusicData(getMusicsData());
    setPlaylistsData(getPlaylistsData());
  }

  async function readPlaylistsByName() {
    await searchPlaylists(text, "playlistsByName");
    setMusicData(getMusicsData());
    setPlaylistsData(getPlaylistsData());
  }

  async function readMusicByArtist(){
    await searchMusics(text, "artistsByName");
    setMusicData(getMusicsData());
    setPlaylistsData(getPlaylistsData());
  }

  async function readMusicByAlbum(){
    await searchMusics(text, "albumsByName");
    setMusicData(getMusicsData());
    setPlaylistsData(getPlaylistsData());
  }
  
  async function readMusicByUsername(){
    await searchMusics(text, "musicsByUsername");
    setMusicData(getMusicsData());
  }

  async function readPlaylistsByUsername(){
    await searchPlaylists(text, "playlistsByUsername");
    setMusicData(getMusicsData());
    setPlaylistsData(getPlaylistsData());
  }

  async function readITunes(){
    await searchITunes(text);
    setMusicData(getMusicsData());
    setPlaylistsData(getPlaylistsData());
    localStorage.setItem("searchText", searchParams.get("text"));
  }

  return (
    <div className="keresesContent">
      <div className="keresesMenu">
        <div className="keresesMenuFlex">
          <button className={selected === 0 ? "selected" : "keresesMenuButtons"} 
          onClick={() => {setIsUser(false); setIsMusic(true); setSelected(0); readMusicByName();}}>
            Zenék
          </button>
          <button className={selected === 1 ? "selected" : "keresesMenuButtons"} 
          onClick={() => {setIsUser(false); setIsMusic(false); setSelected(1); readPlaylistsByName();}}>
            Lejátszási Listák
          </button>
          <button className={selected === 2 ? "selected" : "keresesMenuButtons"} 
          onClick={() => {setIsUser(false); setIsMusic(true); setSelected(2); readMusicByArtist();}}>
            Előadók
          </button>
          <button className={selected === 3 ? "selected" : "keresesMenuButtons"} 
          onClick={() => {setIsUser(false); setIsMusic(true); setSelected(3); readMusicByAlbum();}}>
            Albumok
          </button>
          <button className={selected === 4 ? "selected" : "keresesMenuButtons"} 
          onClick={() => {setIsUser(true); setIsMusic(true); setSelected(4); readMusicByUsername();}}>
            Felhasználók
          </button>
          <button className={selected === 5 ? "selected" : "keresesMenuButtons"} 
          onClick={() => {setIsUser(false); setIsMusic(true); setSelected(5); readITunes();}}>
            Hozzáadás
          </button>
        </div>
        {isUser?
          <div className="musicOrPlaylistFlex">
            <button className={isMusic ? "microSelected" : "musicOrPlaylistButton"} 
            onClick={()=>{ setIsMusic(true); readMusicByUsername();}}>
              Zenék
            </button>
            <button className={!isMusic ? "microSelected" : "musicOrPlaylistButton"} 
            onClick={()=>{ setIsMusic(false); readPlaylistsByUsername();}}>
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
              mufaj={item.mufaj}/>
            )}
          </tbody>
        </table>
      :
        <div>
          {playlistsData.map((elem, index)=>(
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
        </div>
      }
    </div>
  );
}