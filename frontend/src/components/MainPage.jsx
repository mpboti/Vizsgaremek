import { Link } from "react-router-dom";
import { userDataListaz } from "../data";
import '../styles/mainPage.css';
import add from '../assets/add.png';
import play from '../assets/play.png';
import download from '../assets/download.png';
import random from '../assets/randomizer_empty.png';
import list from '../assets/list.png';

export default function MainPage() {
    const data = userDataListaz();
    return(
        <div className="mainPage">
            {data.map((elem, index)=>(
                <div className="row" key={index}>
                    <Link to={`/playlist/${elem.id}`} className="row-link" >
                        <div className="listaInfo">
                            <span className="mainKepSpan"><img src={elem.listaPic} alt="album kép" className="mainKep"/></span>
                            <span className="mainCimSpan"><p className="mainCim">{elem.listaCim}</p><p className="creator">{elem.name}</p></span>
                        </div>
                    </Link>
                    <div className="listaButtons">
                        <button className="mainListButtons"><img src={download} alt="Letöltés" className="listaButtonImg"/></button>
                        <button className="mainListButtons"><img src={random} alt="Random" className="listaButtonImg"/></button>
                        <button className="mainListButtons"><img src={list} alt="List" className="listaButtonImg"/></button>
                        <button className="mainListButtons"><img src={play} alt="Lejátszás" className="listaButtonImg"/></button>
                    </div>
                </div>
            ))}
            <Link to="/" className="botRow-link">
                <div className="botRow">
                    <span className="listAdd"><img src={add} alt="Hozzáadás" className="listAddImg"/></span>
                </div>
            </Link>
        </div>
    )
}