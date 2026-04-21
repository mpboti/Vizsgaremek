import { useEffect, useState } from "react";
import play from '../assets/play.png';
import pause from '../assets/pause.png';
import pencil from '../assets/pencil.png';
import list from "../assets/list.png";
import listFill from "../assets/list fill.png";
import { data, isPlaying, loadDataByPlaylistId, pauseById, playButtonChange, playById, playingData, playingPlaylistId, preferPlaylists, removePlaylistPreferId, setIsLoad, setPlaylistPreferId } from "../playerLogic";
import { getUserData, logedIn } from "../data";
import { Link } from "react-router-dom";

export default function PlaylistShow({id, listaPic, name, userName, ownerId}){
    const userData = getUserData();
    const [preferPic, setPreferPic]= useState(list);
    const [playPic, setPlayPic]= useState(play);
    useEffect(() => {
      if(preferPlaylists.some((e)=>e==id)){
          setPreferPic(listFill);
      }else{
          setPreferPic(list);
      }
      if(id==playingPlaylistId && isPlaying){
          setPlayPic(pause);
      }else{
          setPlayPic(play);
      }
      const changeBack = playButtonChange(() => {
        if(preferPlaylists.some((e)=>e==id)){
            setPreferPic(listFill);
        }else{
            setPreferPic(list);
        }
        if(id==playingPlaylistId && isPlaying){
            setPlayPic(pause);
        }else{
            setPlayPic(play);
        }
      });
      return changeBack;
    }, [id]);

    async function playOrPauseList(){
      if(playingPlaylistId!=id){
        await loadDataByPlaylistId(id);
        playById(data[0].id);
      }else{
        if(isPlaying){
          pauseById();
          setIsLoad(false);
        }else{
          playById(playingData.id);
        }
      }
    }

    async function preferFunc(){
      if(!preferPlaylists.some((e)=>e==id)){
        await setPlaylistPreferId(id);
      }else{
        await removePlaylistPreferId(id);
      }
    }

    return (
        <div className="row">
            <Link to={`/playlist?id=${id}`} className="row-link" >
                <div className="listaInfo">
                    <span className="mainKepSpan"><img src={listaPic} alt="album kép" className="mainKep"/></span>
                    <span className="mainCimSpan"><p className="mainCim">{name}</p><p className="creator">{userName}</p></span>
                </div>
            </Link>
            <div className="listaButtons">
                {userData.isAdmin?<Link to={`/adminPlaylistEdit?mode=playlist&userId=${ownerId}&playlistId=${id}`}><button className="mainListButtons"><img src={pencil} alt="Letöltés" className="listaButtonImg"/></button></Link>:
                logedIn && ownerId == userData.id && <Link to={`/editPlaylist?id=${id}`}><button className="mainListButtons"><img src={pencil} alt="Letöltés" className="listaButtonImg"/></button></Link>}
                <button className="mainListButtons" onClick={()=>preferFunc()}><img src={preferPic} alt="List" className="listaButtonImg"/></button>
                <button className="mainListButtons" onClick={()=>playOrPauseList()}><img src={playPic} alt="Lejátszás" className="listaButtonImg"/></button>
            </div>
        </div>
    )
}
    