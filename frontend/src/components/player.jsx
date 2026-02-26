import { useState } from "react";
//import { } from "../data";
import "../styles/player.css";
import volumeIcon0 from "../assets/volume 0.png";
import volumeIcon1 from "../assets/volume 1.png";
import volumeIcon2 from "../assets/volume 2.png";
import volumeIcon3 from "../assets/volume 3.png";
import previous from "../assets/previos.png";
import play from "../assets/play.png";
import next from "../assets/next.png";
import repeat from "../assets/repeat.png";
import report from "../assets/report.png";
import download from "../assets/download.png";
import add from "../assets/add.png";
import defaultMusicPic from "../assets/defaultMusicPic.png"
import { playingData } from "../playerLogic";

export default function Player() {
    const hosszValue = "0:00";
    const hossz = "0:00";
    const current = "0:00";
    const isPrev = true;
    const [muteButt, setMuteButt] = useState(volumeIcon2);
    function VolumeChange(event) {
        const volume = event.target.value;
        if (volume == 0) {
            setMuteButt(volumeIcon0);
        } else if (volume < 33) {
            setMuteButt(volumeIcon1);
        } else if (volume < 66) {
            setMuteButt(volumeIcon2);
        } else {
            setMuteButt(volumeIcon3);
        }
    }
    return (
        <>
        {isPrev && (
        <div className="player">
            <div className="playerData">
                <div>
                    <img src={playingData.imageUrl?playingData.imageUrl:defaultMusicPic} alt="album kép" className="playerAlbumPic"/>
                </div>
                <div className="playerCimEloado">
                    <p className="playerSong">{playingData.cim}</p>
                    <p className="playerArtist">{playingData.eloado}</p>
                </div>
            </div>
            <div className="playerSliders">
                <span className="timeElapsed">{current}</span>
                <input type="range" min="0" max={hosszValue} defaultValue="0" className="timeSlider"/>
                <span className="timeTotal">{hosszValue!=null ? hossz : "0:00"}</span>
                <button className="muteButton"><img src={muteButt} alt="Mute" className="muteImg"/></button>
                <input type="range" min="0" max="100" defaultValue="50" className="volumeSlider" onChange={VolumeChange}/>
            </div>
            <div className="playerControls">
                <button className="controlButton"><img src={add} alt="Hozzáadás" className="controlImg"/></button>
                <button className="controlButton"><img src={download} alt="Letöltés" className="controlImg"/></button>
                <button className="controlButton"><img src={report} alt="Jelentés" className="controlImg"/></button>
                <button className="controlButton"><img src={repeat} alt="Ismétlés" className="controlImg"/></button>
                <button className="controlButton"><img src={previous} alt="Előző" className="controlImg"/></button>
                <button className="controlButton"><img src={play} alt="Lejátszás" className="controlImg"/></button>
                <button className="controlButton"><img src={next} alt="Következő" className="controlImg"/></button>
            </div>
        </div>
        )}
        </>
    );
}