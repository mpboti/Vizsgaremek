import { Link } from "react-router-dom";
import { getPlaylistsData, getUserData} from "../data";
import '../styles/mainPage.css';
import add from '../assets/add.png';
import play from '../assets/play.png';
import pencil from '../assets/pencil.png';
import random from '../assets/randomizer_empty.png';
import list from '../assets/list.png';

export default function MainPage() {
    const userData = getUserData();
    const playlists = getPlaylistsData();

    return(
        <div className="mainPage">
            {userData.id == -1 && <Link to="/auth?mode=login" className="pleaseLogin">Jelentkezz be</Link>}
            {userData.id > -1 && playlists.length > 0 && playlists.map((elem, index)=>(
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
            {userData.id > -1 && 
            <Link to="/editplaylist" className="botRow-link">
                <div className="botRow">
                    <span className="listAdd"><img src={add} alt="Hozzáadás" className="listAddImg"/></span>
                </div>
            </Link>
            }
        </div>
    )
}