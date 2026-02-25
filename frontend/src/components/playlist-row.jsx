import { useState } from 'react'
import dots from "../assets/dots.png"
import download from "../assets/download.png"
import report from "../assets/report.png"
import add from "../assets/add.png"
import list from "../assets/list.png"
import play from "../assets/play.png"
import defaultMusicPic from "../assets/defaultMusicPic.PNG"
import pencil from "../assets/pencil.png"
import { useNavigate } from 'react-router-dom'

export default function RowGenerator({ id, userId, phone, kep, cim, eloado, album, megjelenes, mufaj}){
    const navigate = useNavigate();

    const [lenyil, setLenyil] = useState(false)
    function sizeClose(){
        setLenyil(false)
    }
    window.addEventListener("resize", sizeClose)
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
                    </td>:<td className="gombok">
                        <button onClick={()=>setLenyil(false)} className="zeneGombok"><img src={dots} alt="menu" className="zeneGombokImg"/></button>
                        <button className="zeneGombok" id="play"><img src={play} alt="lejátszás" className="zeneGombokImg"/></button><br/>
                        <div className="lenyilo">
                            <button className="zeneGombok" onClick={()=>{setLenyil(false); navigate(`/addMusic?mode=edit&id=${id}&userId=${userId}`)}}><img src={pencil} alt="szerkesztés" className="zeneGombokImg"/></button>
                            <button className="zeneGombok" onClick={()=>setLenyil(false)}><img src={download} alt="letöltés" className="zeneGombokImg"/></button>
                            <button className="zeneGombok" onClick={()=>setLenyil(false)}><img src={report} alt="jelentés" className="zeneGombokImg"/></button>
                            <button className="zeneGombok" onClick={()=>setLenyil(false)}><img src={add} alt="listához adás" className="zeneGombokImg"/></button>
                            <button className="zeneGombok" onClick={()=>setLenyil(false)}><img src={list} alt="műsorra fűzés" className="zeneGombokImg"/></button>
                        </div>
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
                <td className="mufaj"><p>{mufaj.substring(0,15)}</p></td>
                <td className="gombok">
                    <button className="zeneGombok" onClick={()=>navigate(`/addMusic?mode=edit&id=${id}&userId=${userId}`)}><img src={pencil} alt="szerkesztés" className="zeneGombokImg"/></button>
                    <button className="zeneGombok" ><img src={download} alt="letöltés" className="zeneGombokImg"/></button>
                    <button className="zeneGombok" ><img src={report} alt="jelentés" className="zeneGombokImg"/></button>
                    <button className="zeneGombok" ><img src={add} alt="listához adás" className="zeneGombokImg"/></button>
                    <button className="zeneGombok" ><img src={list} alt="műsorra fűzés" className="zeneGombokImg"/></button>
                    <button className="zeneGombok" ><img src={play} alt="lejátszás" className="zeneGombokImg"/></button>
                </td>
            </tr>
        );
    }
}