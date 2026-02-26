import { useState } from 'react'
import dots from "../assets/dots.png"
import download from "../assets/download.png"
import report from "../assets/report.png"
import add from "../assets/add.png"
import list from "../assets/list.png"
import play from "../assets/play.png"
import pause from "../assets/pause.png"
import defaultMusicPic from "../assets/defaultMusicPic.PNG"
import pencil from "../assets/pencil.png"
import playing from "../assets/playing.png"
import { useNavigate } from 'react-router-dom'
import { getUserData, isItunes, logedIn, musicsData } from '../data'
import { isPlaying, pauseById, playById, playingData } from '../playerLogic'

export default function RowGenerator({ id, userId, phone, kep, cim, eloado, album, megjelenes, mufaj}){
    const navigate = useNavigate();
    const onlyAdd = isItunes;
    const isAdmin = false;
    const userData = getUserData()
    const [playPic, setPlayPic] = useState(play);

    const [lenyil, setLenyil] = useState(false)
    function sizeClose(){
        setLenyil(false)
    }
    window.addEventListener("resize", sizeClose)

    async function playOrPause(){
        if(!isPlaying || isPlaying && playingData.id!=id){
            playById(id);
            setPlayPic(pause);
        }else{
            pauseById(id);
            setPlayPic(play);
        }
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
                        <button onClick={()=>setLenyil(true)} className="zeneGombok"><img src={dots} alt="menu" className="zeneGombokImg"/></button>
                        <button className="zeneGombok" id="play"><img src={play} alt="lejátszás" className="zeneGombokImg"/></button>
                    </td>:
                    
                    <td className="gombok">
                        <button onClick={()=>setLenyil(false)} className="zeneGombok"><img src={dots} alt="menu" className="zeneGombokImg"/></button>
                        <button className="zeneGombok" id="play" onClick={playById}><img src={playPic} alt="lejátszás" className="zeneGombokImg"/></button><br/>
                        {onlyAdd?
                        <div className="lenyilo">
                            {isAdmin || userData.id == userId && <button className="zeneGombok" onClick={()=>{setLenyil(false); navigate(`/addMusic?mode=edit&id=${id}&userId=${userId}`)}}><img src={pencil} alt="szerkesztés" className="zeneGombokImg"/></button>}
                            {logedIn && <button className="zeneGombok" onClick={()=>setLenyil(false)}><img src={download} alt="letöltés" className="zeneGombokImg"/></button>}
                            {logedIn && <button className="zeneGombok" onClick={()=>setLenyil(false)}><img src={report} alt="jelentés" className="zeneGombokImg"/></button>}
                            {logedIn && <button className="zeneGombok" onClick={()=>setLenyil(false)}><img src={add} alt="listához adás" className="zeneGombokImg"/></button>}
                            <button className="zeneGombok" onClick={()=>setLenyil(false)}><img src={list} alt="műsorra fűzés" className="zeneGombokImg"/></button>
                        </div>:
                        <div className="lenyilo">
                            {logedIn && <button className="zeneGombok" onClick={()=>setLenyil(false)}><img src={add} alt="listához adás" className="zeneGombokImg"/></button>}
                            <button className="zeneGombok" onClick={()=>{setLenyil(false); navigate(`/addMusic?mode=itunes&id=${id}&userId=${userId}`)}}><img src={list} alt="műsorra fűzés" className="zeneGombokImg"/></button>
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
                    {isAdmin || userData.id == userId && <button className="zeneGombok" onClick={()=>navigate(`/addMusic?mode=edit&id=${id}&userId=${userId}`)}><img src={pencil} alt="szerkesztés" className="zeneGombokImg"/></button>}
                    {logedIn && <button className="zeneGombok" ><img src={download} alt="letöltés" className="zeneGombokImg"/></button>}
                    {logedIn && <button className="zeneGombok" ><img src={report} alt="jelentés" className="zeneGombokImg"/></button>}
                    {logedIn && <button className="zeneGombok" ><img src={add} alt="listához adás" className="zeneGombokImg"/></button>}
                    <button className="zeneGombok" ><img src={list} alt="műsorra fűzés" className="zeneGombokImg"/></button>
                    <button className="zeneGombok" onClick={playOrPause}><img src={playPic} alt="lejátszás" className="zeneGombokImg"/></button>
                </td>}
            </tr>
        );
    }
}