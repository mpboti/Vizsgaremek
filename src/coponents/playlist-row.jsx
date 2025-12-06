import { useState } from 'react'

export default function RowGenerator({phone, kep, cim, eloado, album, megjelenes, mufaj}){
    const [lenyil, setLenyil] = useState(false)
    if(phone){
        return (
            <tr className="zeneSor">
                <td className="albumCover"><img src={kep?kep:undefined} className="zeneAlbumCover" alt="nincs album kép"/></td>
                <td className="cimEloado">
                    <p className="cimClass">{cim}</p>
                    <p className="eloadoClass">{eloado}</p>
                </td>
                <td className="album"><p>{album}</p></td>
                {!lenyil?
                    <td className="gombok">
                        <button onClick={()=>setLenyil(true)} className="zeneGombok"><img src="/dots.png" alt="menu" className="zeneGombokImg"/></button>
                        <button className="zeneGombok" id="play"><img src="/play.png" alt="lejátszás" className="zeneGombokImg"/></button>
                    </td>:<td className="gombok">
                        <button onClick={()=>setLenyil(false)} className="zeneGombok"><img src="/dots.png" alt="menu" className="zeneGombokImg"/></button>
                        <button className="zeneGombok" id="play"><img src="/play.png" alt="lejátszás" className="zeneGombokImg"/></button><br/>
                        <div className="lenyilo">
                            <button className="zeneGombok" id="download" onClick={()=>setLenyil(false)}><img src="/download.png" alt="letöltés" className="zeneGombokImgk"/></button>
                            <button className="zeneGombok" id="report" onClick={()=>setLenyil(false)}><img src="/report.png" alt="jelentés" className="zeneGombokImgk"/></button>
                            <button className="zeneGombok" id="add" onClick={()=>setLenyil(false)}><img src="/add.png" alt="listához adás" className="zeneGombokImgk"/></button>
                            <button className="zeneGombok" id="list" onClick={()=>setLenyil(false)}><img src="/list.png" alt="műsorra fűzés" className="zeneGombokImgk"/></button>
                        </div>
                    </td>
                }
            </tr>
        );
    }
    else{
        return (
            <tr className="zeneSor">
                <td className="albumCover"><img src={kep?kep:undefined} className="zeneAlbumCover" alt="nincs album kép"/></td>
                <td className="cimEloado">
                    <p className="cimClass">{cim}</p>
                    <p className="eloadoClass">{eloado}</p>
                </td>
                <td className="album"><p>{album}</p></td>
                <td className="megjelenes"><p>{megjelenes}</p></td>
                <td className="mufaj"><p>{mufaj}</p></td>
                <td className="gombok">
                    <button className="zeneGombok" id="download"><img src="/download.png" alt="letöltés" className="zeneGombokImg"/></button>
                    <button className="zeneGombok" id="report"><img src="/report.png" alt="jelentés" className="zeneGombokImg"/></button>
                    <button className="zeneGombok" id="add"><img src="/add.png" alt="listához adás" className="zeneGombokImg"/></button>
                    <button className="zeneGombok" id="list"><img src="/list.png" alt="műsorra fűzés" className="zeneGombokImg"/></button>
                    <button className="zeneGombok" id="play"><img src="/play.png" alt="lejátszás" className="zeneGombokImg"/></button>
                </td>
            </tr>
        );
    }
}