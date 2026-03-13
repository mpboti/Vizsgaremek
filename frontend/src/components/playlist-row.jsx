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
import { useNavigate } from 'react-router-dom'
import { doDownload, getUserData, isItunes, logedIn } from '../data'
import { isPlaying, pauseById, playById, playingData, playButtonChange, setIsLoad, setPreferById, preferData, removePreferById, data, setFirstPlay } from '../playerLogic'

export default function RowGenerator({ id, userId, phone, kep, cim, eloado, album, megjelenes, mufaj}){
    const navigate = useNavigate();
    const onlyAdd = isItunes;
    const isAdmin = false;
    const userData = getUserData()
    const [playPic, setPlayPic] = useState(play);
    const [preferPic, setPreferPic] = useState(list);
    const [lenyil, setLenyil] = useState(false)
    const [currentPlayingId, setCurrentPlayingId] = useState(null);
    const [currentIsPlaying, setCurrentIsPlaying] = useState(false);
    
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
                        <button className="zeneGombok" onClick={playOrPause}><img src={playPic} alt="lejátszás" className="zeneGombokImg"/></button>
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
                            {isAdmin || userData.id == userId && <button className="zeneGombok" onClick={()=>{setLenyil(false); navigate(`/addMusic?mode=edit&id=${id}&userId=${userId}`)}}><img src={pencil} alt="szerkesztés" className="zeneGombokImg"/></button>}
                            {logedIn && <button className="zeneGombok" onClick={()=>{setLenyil(false);doDownload(id)}}><img src={download} alt="letöltés" className="zeneGombokImg"/></button>}
                            {logedIn && <button className="zeneGombok" onClick={()=>setLenyil(false)}><img src={report} alt="jelentés" className="zeneGombokImg"/></button>}
                            {logedIn && <button className="zeneGombok" onClick={()=>setLenyil(false)}><img src={add} alt="listához adás" className="zeneGombokImg"/></button>}
                            <button className="zeneGombok" onClick={()=>{setLenyil(false); preferFunc()}}><img src={preferPic} alt="műsorra fűzés" className="zeneGombokImg"/></button>
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
                    {logedIn && <button className="zeneGombok" onClick={()=>doDownload(id)} ><img src={download} alt="letöltés" className="zeneGombokImg"/></button>}
                    {logedIn && <button className="zeneGombok" ><img src={report} alt="jelentés" className="zeneGombokImg"/></button>}
                    {logedIn && <button className="zeneGombok" ><img src={add} alt="listához adás" className="zeneGombokImg"/></button>}
                    <button className="zeneGombok" onClick={preferFunc}><img src={preferPic} alt="műsorra fűzés" className="zeneGombokImg"/></button>
                    <button className="zeneGombok" onClick={playOrPause}><img src={playPic} alt="lejátszás" className="zeneGombokImg"/></button>
                </td>}
            </tr>
        );
    }
}