import { useEffect, useState } from "react";
import "../styles/kereses.css"
import { getMusicsData, getPlaylistsData, searchITunes, searchMusics, searchPlaylists,} from "../data";
import { useSearchParams } from "react-router-dom";
import RowGenerator from "./playlist-row";
import PlaylistShow from "./playlist-show";

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
          onClick={async () => {setIsUser(false); setIsMusic(true); setSelected(0); await readMusicByName();}}>
            Zenék
          </button>
          <button className={selected === 1 ? "selected" : "keresesMenuButtons"} 
          onClick={async () => {setIsUser(false); setIsMusic(false); setSelected(1); await readPlaylistsByName();}}>
            Lejátszási Listák
          </button>
          <button className={selected === 2 ? "selected" : "keresesMenuButtons"} 
          onClick={async () => {setIsUser(false); setIsMusic(true); setSelected(2); await readMusicByArtist();}}>
            Előadók
          </button>
          <button className={selected === 3 ? "selected" : "keresesMenuButtons"} 
          onClick={async () => {setIsUser(false); setIsMusic(true); setSelected(3); await readMusicByAlbum();}}>
            Albumok
          </button>
          <button className={selected === 4 ? "selected" : "keresesMenuButtons"} 
          onClick={async () => {setIsUser(true); setIsMusic(true); setSelected(4); await readMusicByUsername();}}>
            Felhasználók
          </button>
          <button className={selected === 5 ? "selected" : "keresesMenuButtons"} 
          onClick={async () => {setIsUser(false); setIsMusic(true); setSelected(5); await readITunes();}}>
            Hozzáadás
          </button>
        </div>
        {isUser?
          <div className="musicOrPlaylistFlex">
            <button className={isMusic ? "microSelected" : "musicOrPlaylistButton"} 
            onClick={async ()=>{ setIsMusic(true); await readMusicByUsername();}}>
              Zenék
            </button>
            <button className={!isMusic ? "microSelected" : "musicOrPlaylistButton"} 
            onClick={async ()=>{ setIsMusic(false); await readPlaylistsByUsername();}}>
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
          {playlistsData.length > 0 && playlistsData.map((elem)=>(
            <PlaylistShow key={elem.id}
            id={elem.id} 
            listaPic={elem.listaPic} 
            name={elem.name} 
            userName={elem.userName} 
            ownerId={elem.ownerId}
            />
          ))}
        </div>
      }
    </div>
  );
}