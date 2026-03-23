import { useEffect, useState } from 'react'
import dots from "../assets/dots.png"
import download from "../assets/download.png"
import report from "../assets/report.png"
import add from "../assets/add.png"
import list from "../assets/list.png"
import listFill from "../assets/list fill.png"
import play from "../assets/play.png"
import defaultMusicPic from "../assets/defaultMusicPic.PNG"
import pencil from "../assets/pencil.png"
import playing from "../assets/playing.png"
import send from "../assets/send.png"
import { useNavigate } from 'react-router-dom'
import { checkedPlaylistOptions, doDownload, getUserData, ip, isItunes, loadCheckedPlaylists, loadPlaylistOptions, logedIn, playlistOptions } from '../data'
import { isPlaying, pauseById, playById, playingData, playButtonChange, setIsLoad, setPreferById, preferData, removePreferById, data, setFirstPlay, changeEvents, selectingPlaylistId, selectingMusicId, setSelectingMusicId, changeEvent, setSelectingPlaylistId } from '../playerLogic'
import { getAuthToken } from '../auth'

export default function RowGenerator({ id, userId, phone, kep, cim, eloado, album, megjelenes, mufaj}){
    const navigate = useNavigate();
    const onlyAdd = isItunes;
    const isAdmin = getUserData().isAdmin;
    const userData = getUserData()
    const [playPic, setPlayPic] = useState(play);
    const [preferPic, setPreferPic] = useState(list);
    const [lenyil, setLenyil] = useState(false)
    const [currentPlayingId, setCurrentPlayingId] = useState(null);
    const [currentIsPlaying, setCurrentIsPlaying] = useState(false);
    const [openPlaylist, setOpenPlaylist] = useState(false);
    const [openReport, setOpenReport] = useState(false);
    const [reportText, setReportText] = useState("");
    
    useEffect(() => {
        if (currentIsPlaying && currentPlayingId === id || playingData.id==id && isPlaying) {
            setPlayPic(playing);
        } else {
            setPlayPic(play);
        }
        if(preferData.length!=0 && preferData.some((e)=>e.id==id)){
            setPreferPic(listFill);
        }else{
            setPreferPic(list);
        }
        const changeBack = playButtonChange(() => {
            setCurrentIsPlaying(isPlaying);
            setCurrentPlayingId(playingData?.id);
            if(selectingPlaylistId!==id)
                setOpenPlaylist(false);
            if(selectingMusicId!==id)
                setLenyil(false);
            if(preferData.length!=0 && preferData.some((e)=>e.id==id)){
                setPreferPic(listFill);
            }else{
                setPreferPic(list);
            }
        });
        return changeBack;
    }, [currentIsPlaying, currentPlayingId, id]);

    function sizeClose(){
        setLenyil(false)
    }
    window.addEventListener("resize", sizeClose)

    async function playOrPause(){
        setIsLoad(true);
        if(!isPlaying || isPlaying && playingData.id!=id){
            if(!data.includes((e)=>e.id=id))
                await setFirstPlay(false);
            await playById(id);
            setPlayPic(playing); 
        }else{
            await pauseById(id);
            setPlayPic(play); 
        }
    }

    async function preferFunc(){
        if(!preferData.some((e)=>e.id==id)){
            await setPreferById(id);
            setPreferPic(listFill);
        }
        else{
            await removePreferById(id);
            setPreferPic(list);
        }
    }

    async function playlistsSelection(){
        await loadCheckedPlaylists(id);
        await loadPlaylistOptions();
        setOpenReport(false);
        if(openPlaylist){
            setOpenPlaylist(false);
        }else{
            setSelectingPlaylistId(id)
            setOpenPlaylist(true);
        }
        changeEvent(chage => chage());
        changeEvents.forEach(change => change());
    }

    async function playlistChanger(playlistId){
        await loadCheckedPlaylists(id);
        await loadPlaylistOptions();
        if(!checkedPlaylistOptions.ids.includes(playlistId)){
            await fetch(`http://${ip}/playlists/addMusic`,{
              method: "POST",
              headers: {
              'Content-Type': 'application/json',
              'x-access-token': getAuthToken()
              },
              body: JSON.stringify({playlistId: playlistId, musicId: id})
            })
        }else{
           await fetch(`http://${ip}/playlists/removeMusic`,{
              method: "DELETE",
              headers: {
              'Content-Type': 'application/json',
              'x-access-token': getAuthToken()
              },
              body: JSON.stringify({playlistId: playlistId, musicId: id})
            }) 
        }
        setOpenPlaylist(false);
    }

    async function reportMessage(){
        setOpenPlaylist(false);
        if(openReport){
            setOpenReport(false);
        }else{
            setOpenReport(true);
        }
        changeEvents.forEach(change => change());
        changeEvent(chage => chage());
    }

    async function sendReport(){
        await fetch(`http://${ip}/users/report`,{
          method: "POST",
          headers: {
          'Content-Type': 'application/json',
          'x-access-token': getAuthToken()
          },
          body: JSON.stringify({userid: userData.id, message: reportText, musicid: id})
        })
        setOpenReport(false);
        setReportText("");
    }

    if(phone){
        return (
            <tr className="zeneSor">
                <td className="albumCover"><img src={kep?kep:defaultMusicPic} className="zeneAlbumCover"/></td>
                <td className="cimEloado">
                    <p className="cimClass">{cim}</p>
                    <p className="eloadoClass">{eloado}</p>
                </td>
                <td className="album"><p>{album}</p></td>
                {!lenyil?
                    <td className="gombok">
                        <button onClick={()=>{setLenyil(true);setSelectingMusicId(id);changeEvents.forEach(change => change());}} className="zeneGombok"><img src={dots} alt="menu" className="zeneGombokImg"/></button>
                        <button className="zeneGombok" onClick={playOrPause}><img src={playPic} alt="lejátszás" className="zeneGombokImg"/></button>
                        {logedIn && <div className="selection" style={!openPlaylist ? {display: "none"} : {}}>
                          {playlistOptions.ids.map((option, index) => (
                            <label key={option} className="labelElem">
                              <input type="checkbox" name="playlists" value={option} defaultChecked={checkedPlaylistOptions.ids[checkedPlaylistOptions.ids.indexOf(option)]==option} onInput={()=>playlistChanger(option)}/>
                              {playlistOptions.playlists[index]}
                            </label>
                          ))}
                        </div>
                        }
                        {logedIn && openReport && <div className="selection">
                            <textarea rows={5} value={reportText} onChange={(e)=>setReportText(e.target.value)} className="reportText" placeholder="Ide írd hogy mi miatt reportolsz"></textarea>
                            <button className="sendButton" onClick={sendReport}><img src={send} className="sendImg"/></button>
                        </div>
                        }
                    </td>:
                    
                    <td className="gombok">
                        <button onClick={()=>setLenyil(false)} className="zeneGombok"><img src={dots} alt="menu" className="zeneGombokImg"/></button>
                        <button className="zeneGombok" onClick={playOrPause}><img src={playPic} alt="lejátszás" className="zeneGombokImg"/></button><br/>
                        {onlyAdd?
                        <div className="lenyilo">
                            {logedIn && <button className="zeneGombok" onClick={()=>{setLenyil(false); navigate(`/addMusic?mode=itunes&id=${id}&userId=${userId}`)}}><img src={add} alt="listához adás" className="zeneGombokImg"/></button>}
                            <button className="zeneGombok" onClick={()=>{setLenyil(false)}}><img src={list} alt="műsorra fűzés" className="zeneGombokImg"/></button>
                        </div>:
                        <div className="lenyilo">
                            {isAdmin && <button className="zeneGombok" onClick={()=>{setLenyil(false); navigate(`/adminMusicEdit?mode=music&musicId=${id}`)}}><img src={pencil} alt="szerkesztés" className="zeneGombokImg"/></button>}
                            {!isAdmin && userData.id == userId && <button className="zeneGombok" onClick={()=>{setLenyil(false); navigate(`/addMusic?mode=edit&id=${id}&userId=${userId}`)}}><img src={pencil} alt="szerkesztés" className="zeneGombokImg"/></button>}
                            {logedIn && <button className="zeneGombok" onClick={()=>{setLenyil(false);doDownload(id)}}><img src={download} alt="letöltés" className="zeneGombokImg"/></button>}
                            {logedIn && <button className="zeneGombok" onClick={()=>{setLenyil(false); reportMessage();}}><img src={report} alt="jelentés" className="zeneGombokImg"/></button>}
                            {logedIn && <button className="zeneGombok" onClick={async ()=>{await playlistsSelection(); setLenyil(false);}}><img src={add} alt="listához adás" className="zeneGombokImg"/></button>}
                            <button className="zeneGombok" onClick={()=>{setLenyil(false); preferFunc()}}><img src={preferPic} alt="műsorra fűzés" className="zeneGombokImg"/></button>
                        </div>
                        }
                        {logedIn && openPlaylist && <div className="selection" >
                          {playlistOptions.ids.map((option, index) => (
                            <label key={option} className="labelElem">
                              <input type="checkbox" name="playlists" value={option} defaultChecked={checkedPlaylistOptions.ids[checkedPlaylistOptions.ids.indexOf(option)]==option} onInput={()=>playlistChanger(option)}/>
                              {playlistOptions.playlists[index]}
                            </label>
                          ))}
                        </div>
                        }
                        {logedIn && openReport && <div className="selection">
                            <textarea rows={5} value={reportText} onChange={(e)=>setReportText(e.target.value)} className="reportText" placeholder="Ide írd hogy mi miatt reportolsz"></textarea>
                            <button className="sendButton" onClick={sendReport}><img src={send} className="sendImg"/></button>
                        </div>
                        }
                    </td>
                    
                }
            </tr>
        );
    }
    else{
        return (
            <tr className="zeneSor">
                <td className="albumCover"><img src={kep?kep:defaultMusicPic} className="zeneAlbumCover"/></td>
                <td className="cimEloado">
                    <p className="cimClass">{cim}</p>
                    <p className="eloadoClass">{eloado}</p>
                </td>
                <td className="album"><p>{album}</p></td>
                <td className="megjelenes"><p>{megjelenes}</p></td>
                <td className="mufaj"><p>{mufaj}</p></td>
                {onlyAdd?
                <td className="gombok">
                    {logedIn && <button className="zeneGombok" onClick={()=>navigate(`/addMusic?mode=itunes&id=${id}&userId=${userId}`)} ><img src={add} alt="listához adás" className="zeneGombokImg"/></button>}
                    <button className="zeneGombok" onClick={playOrPause}><img src={playPic} alt="lejátszás" className="zeneGombokImg"/></button>
                </td>:
                <td className="gombok">
                    {isAdmin && <button className="zeneGombok" onClick={()=>navigate(`/adminMusicEdit?mode=music&musicId=${id}`)}><img src={pencil} alt="szerkesztés" className="zeneGombokImg"/></button>}
                    {!isAdmin && userData.id == userId && <button className="zeneGombok" onClick={()=>navigate(`/addMusic?mode=edit&id=${id}&userId=${userId}`)}><img src={pencil} alt="szerkesztés" className="zeneGombokImg"/></button>}
                    {logedIn && <button className="zeneGombok" onClick={()=>doDownload(id)} ><img src={download} alt="letöltés" className="zeneGombokImg"/></button>}
                    {logedIn && <button className="zeneGombok" onClick={reportMessage}><img src={report} alt="jelentés" className="zeneGombokImg"/></button>}
                    {logedIn && <button className="zeneGombok" onClick={playlistsSelection}><img src={add}  alt="listához adás" className="zeneGombokImg"/></button>}
                    <button className="zeneGombok" onClick={preferFunc}><img src={preferPic} alt="műsorra fűzés" className="zeneGombokImg"/></button>
                    <button className="zeneGombok" onClick={playOrPause}><img src={playPic} alt="lejátszás" className="zeneGombokImg"/></button>
                    {logedIn && openPlaylist && <div className="selection" >
                      {playlistOptions.ids.map((option, index) => (
                        <label key={option} className="labelElem">
                          <input type="checkbox" value={option} defaultChecked={checkedPlaylistOptions.ids[checkedPlaylistOptions.ids.indexOf(option)]==option} onChange={()=>playlistChanger(option)}/>
                          {playlistOptions.playlists[index]}
                        </label>
                      ))}
                    </div>
                    }
                    {logedIn && openReport && <div className="selection">
                        <textarea rows={5} value={reportText} onChange={(e)=>setReportText(e.target.value)} className="reportText" placeholder="Ide írd hogy mi miatt reportolsz"></textarea>
                        <button className="sendButton" onClick={sendReport}><img src={send} className="sendImg"/></button>
                    </div>
                    }
                </td>}
            </tr>
        );
    }
}