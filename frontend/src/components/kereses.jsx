import { useEffect, useState } from "react";
import "../styles/kereses.css"
import { getMusicsData, getPlaylistsData, getReports, getUserData, searchITunes, searchMusics, searchPlaylists, searchReports } from "../data";
import { useNavigate, useSearchParams } from "react-router-dom";
import RowGenerator from "./playlist-row";
import PlaylistShow from "./playlist-show";
import ReportRow from "./report-row";

export default function Kereses(){
  const userData = getUserData()
  const [searchParams] = useSearchParams();
  const [text, setText] = useState("");
  const [musicsData, setMusicData] = useState(getMusicsData());
  const [playlistsData, setPlaylistsData] = useState(getPlaylistsData());
  const [reportsData, setReportsData] = useState(getReports());
  const [selected, setSelected] = useState(0);
  const [isMusic, setIsMusic] = useState(true);
  const navigate = useNavigate();

  useEffect(()=>{
    async function loading() {
      setText(searchParams.get("text"));
      setSelected(searchParams.get("seachPlace")?parseInt(searchParams.get("seachPlace")):0)

      switch (searchParams.get("seachPlace")?parseInt(searchParams.get("seachPlace")):selected){
      
        case 0: 
        await searchMusics(searchParams.get("text"), "musicsByName");
        setIsMusic(true);
        break;

        case 1: 
        await searchPlaylists(searchParams.get("text"), "playlistsByName");
        setIsMusic(false);
        break;

        case 2: 
        await searchMusics(searchParams.get("text"), "artistsByName");
        setIsMusic(true);
        break;

        case 3: 
        await searchMusics(searchParams.get("text"), "albumsByName");
        setIsMusic(true);
        break;

        case 4: 
        //if(isMusic!==true || isMusic!==false)
        //  setIsMusic(true);
        if(isMusic)
          await searchMusics(searchParams.get("text"), "musicsByUsername");
        else
          await searchPlaylists(searchParams.get("text"), "playlistsByUsername");
        break;

        case 5: 
        await searchITunes(searchParams.get("text"));
        setIsMusic(true);
        break;

        case 6: 
        await searchReports(searchParams.get("text"));
        setIsMusic(true);
        setReportsData(getReports());
        break;
      }
      window.scrollTo(0, 0);
      setMusicData(getMusicsData());
      setPlaylistsData(getPlaylistsData());
      setReportsData(getReports());
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
    navigate(`/search?text=${text}&seachPlace=0`);
  }

  async function readPlaylistsByName() {
    await searchPlaylists(text, "playlistsByName");
    setMusicData(getMusicsData());
    setPlaylistsData(getPlaylistsData());
    navigate(`/search?text=${text}&seachPlace=1`);
  }

  async function readMusicByArtist(){
    await searchMusics(text, "artistsByName");
    setMusicData(getMusicsData());
    setPlaylistsData(getPlaylistsData());
    navigate(`/search?text=${text}&seachPlace=2`);
  }

  async function readMusicByAlbum(){
    await searchMusics(text, "albumsByName");
    setMusicData(getMusicsData());
    setPlaylistsData(getPlaylistsData());
    navigate(`/search?text=${text}&seachPlace=3`);
  }
  
  async function readMusicByUsername(){
    await searchMusics(text, "musicsByUsername");
    setMusicData(getMusicsData());
    if(searchParams.get("seachPlace")!=="4")
      navigate(`/search?text=${text}&seachPlace=4`);
  }

  async function readPlaylistsByUsername(){
    await searchPlaylists(text, "playlistsByUsername");
    setMusicData(getMusicsData());
    setPlaylistsData(getPlaylistsData());
    if(searchParams.get("seachPlace")!=="4")
      navigate(`/search?text=${text}&seachPlace=4`);
  }

  async function readITunes(){
    await searchITunes(text);
    setMusicData(getMusicsData());
    setPlaylistsData(getPlaylistsData());
    navigate(`/search?text=${text}&seachPlace=5`);
  }

  async function readReports() {
    await searchReports(text);
    setReportsData(getReports());
    navigate(`/search?text=${text}&seachPlace=6`);
  }

  function updatePage(){
    setReportsData(getReports());
  }

  return (
    <div className="keresesContent">
      <div className="keresesMenu">
        <div className="keresesMenuFlex">
          <button className={selected === 0 ? "selected" : "keresesMenuButtons"} 
          onClick={async () => { await readMusicByName();}}>
            Zenék
          </button>
          <button className={selected === 1 ? "selected" : "keresesMenuButtons"} 
          onClick={async () => { await readPlaylistsByName();}}>
            {userData.isAdmin?"Playlists":"Lejátszási Listák"}
          </button>
          <button className={selected === 2 ? "selected" : "keresesMenuButtons"} 
          onClick={async () => { await readMusicByArtist();}}>
            Előadók
          </button>
          <button className={selected === 3 ? "selected" : "keresesMenuButtons"} 
          onClick={async () => { await readMusicByAlbum();}}>
            Albumok
          </button>
          <button className={selected === 4 ? "selected" : "keresesMenuButtons"} 
          onClick={async () => { await readMusicByUsername();}}>
            {userData.isAdmin?"Users":"Felhasználók"}
          </button>
          <button className={selected === 5 ? "selected" : "keresesMenuButtons"} 
          onClick={async () => { await readITunes();}}>
            Hozzáadás
          </button>
          {userData.isAdmin && <button className={selected === 6 ? "selected" : "keresesMenuButtons"} 
          onClick={async () => { await readReports();}}>
            Reports
          </button>}
        </div>
        {selected === 4?
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
      {isMusic && selected !== 6? 
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
        selected !== 6 && <div>
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
      {userData.isAdmin && selected == 6 &&
        <div>
          {reportsData.length > 0 && reportsData.map((elem)=>(
            <ReportRow key={elem.id}
            id={elem.id}
            userId={elem.userId}
            musicId={elem.musicId}
            message={elem.message}
            update={updatePage}
            />
          ))}
        </div>
      }
    </div>
  );
}