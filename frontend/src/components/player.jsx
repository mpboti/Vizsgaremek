import { useEffect, useState } from "react";
//import { } from "../data";
import "../styles/player.css";
import volumeIcon0 from "../assets/volume 0.png";
import volumeIcon1 from "../assets/volume 1.png";
import volumeIcon2 from "../assets/volume 2.png";
import volumeIcon3 from "../assets/volume 3.png";
import previous from "../assets/previos.png";
import play from "../assets/play.png";
import pause from "../assets/pause.png";
import next from "../assets/next.png";
import repeat from "../assets/repeat.png";
import repeatFill from "../assets/repeat fill.png";
import repeatOneFill from "../assets/repeat_fill_one.png";
import random from "../assets/randomizer_empty.png";
import randomFill from "../assets/randomizer fill.png";
import download from "../assets/download.png";
import add from "../assets/add.png";
import defaultMusicPic from "../assets/defaultMusicPic.png"
import { changeEvents, firstLoad, isLoopList, isOneLoop, isPlaying, isRandomized, isSetValue, isUploadPlay, loadSettings, musicVolume, nextMusic, notLoggedInVolume, pauseById, playById, playerChange, playingData, playingMusic, prevMusic, randomize, selectingPlaylistId, setIsLoad, setIsLoopList, setIsOneLoop, setIsSetValue, setMusicVolume, setNotLoggedInVolume, setSelectingPlaylistId, settingData, sliderPause, sliderPlay, updateVolume, uploadPause, uploadPlay } from "../playerLogic";
import { isFading } from "../playerLogic";  // Importáld az új flag-et
import { checkedPlaylistOptions, doDownload, getUserData, ip, loadCheckedPlaylists, loadMusicsByPlaylistId, loadPlaylistOptions, logedIn, logout, playlistOptions } from "../data";
import { getAuthToken } from "../auth";
import { useSearchParams } from "react-router-dom";

export default function Player() {
    function hosszCalculate(){
        let t=Math.round(playingMusic.duration);
        let g=Math.round(playingMusic.duration/60-(0.5/60*59));
        t=t-g*60;
        let h = "";
        if(t<10){h=0};
        return g+":"+h+t
    }
    const [searchParams] = useSearchParams();
    const [hosszValue, setHosszValue] = useState(10);
    const [currentValue, setCurrentValue] = useState(0);
    const hossz = hosszCalculate()!="NaN:NaN"?hosszCalculate():"0:00";
    const [current, setCurrent] = useState("0:00");
    const [muteButt, setMuteButt] = useState(volumeIcon2);
    const [playPic, setPlayPic] = useState(play);
    const [repeatPic, setRepeatPic] = useState(isLoopList?isOneLoop?repeatOneFill:repeatFill:repeat);
    const [randomPic, setRandomPic] = useState(isRandomized?randomFill:random);
    const [cim, setCim] = useState(playingData?.name?playingData.name:"not loaded");
    const [eloado, setEloado] = useState(playingData?.artistName?playingData.artistName:"not loaded");
    const [volume, setVolume] = useState(musicVolume);
    const [openPlaylist, setOpenPlaylist] = useState(false);

   async function volumeSet(currentVolume){
        setVolume(currentVolume);
        if (currentVolume == 0) {
            setMuteButt(volumeIcon0);
        } else if (currentVolume < 33) {
            setMuteButt(volumeIcon1);
        } else if (currentVolume < 66) {
            setMuteButt(volumeIcon2);
        } else {
            setMuteButt(volumeIcon3);
        }
        //console.log("volume: "+currentVolume+"%");
        await setMusicVolume(currentVolume);
        updateVolume(currentVolume);
    }
    
    function playOrPause(){
        if(isUploadPlay){
            if(isPlaying){
                uploadPause();
                setPlayPic(play);
            }else{
                uploadPlay(null);
                setPlayPic(pause);
            }
        }else{
            if(isPlaying){
                pauseById();
                setIsLoad(false);
                setPlayPic(play);
            }else{
                playById(playingData.id);
                setPlayPic(pause);
            }
        }
    }
    async function muteOrUnmute(){
        if(musicVolume==0){
            if(logedIn)
                await loadSettings();
            else
                settingData.volume=notLoggedInVolume;
            if (settingData.volume == 0) {
                setMuteButt(volumeIcon0);
            } else if (settingData.volume < 33) {
                setMuteButt(volumeIcon1);
            } else if (settingData.volume < 66) {
                setMuteButt(volumeIcon2);
            } else {
                setMuteButt(volumeIcon3);
            }
            setVolume(settingData.volume);
            updateVolume(settingData.volume);
            setMusicVolume(settingData.volume);

        }else{
            setNotLoggedInVolume(musicVolume);
            setMuteButt(volumeIcon0);
            setVolume(0);
            updateVolume(0);
            setMusicVolume(0);
        }
    }

    useEffect(()=>{
        setInterval(()=>{
            if(logedIn && getAuthToken()=="EXPIRED")
                logout();
            if(!isSetValue){
                setCurrentValue(Math.round(playingMusic.currentTime));
            }
            let t=Math.round(playingMusic.currentTime);
            let g=Math.round(playingMusic.currentTime/60-(0.5/60*59));
            t=t-g*60;
            let h="";
            if(t<10){h=0};
            setCurrent(g+":"+h+t);
            if(playingMusic.currentTime>=playingMusic.duration-settingData.fadeValue && !isSetValue)
                nextMusic();
            setHosszValue(Math.round(playingMusic.duration).toString());
        },500);
        async function handleKeyUp(e){
            const target = e.target;
            if (target.tagName.toLowerCase() === "input" && target.type === "text") {
                return;
            }
            if(e.key=="ArrowUp" || e.key=="ArrowDown") {
                e.preventDefault();
                if(logedIn){
                    await fetch(`http://${ip}/settings/${getUserData().id}`,{
                        method:"PUT",
                        headers:{
                            'Content-Type': 'application/json',
                            'x-access-token': getAuthToken()
                        },
                        body: JSON.stringify({volume: musicVolume})
                    });
                }
            }
        }
        function handleKeyDown(e){
            const target = e.target;
            if (target.tagName.toLowerCase() === "input" && target.type === "text" || target.tagName.toLowerCase() === "textarea" ) {
                return;
            }
            setVolume(musicVolume);
            switch (e.key) {
                case " ":
                    e.preventDefault();
                    playOrPause();
                    break;
                
                case "ArrowRight":
                    e.preventDefault();
                    if(playingMusic.duration>playingMusic.currentTime)
                        playingMusic.currentTime += 5;
                    break;
                
                case "ArrowLeft":
                    e.preventDefault();
                    if(playingMusic.currentTime>=5)
                        playingMusic.currentTime -= 5;
                    break;

                case "ArrowUp":
                    e.preventDefault();
                    if(musicVolume+1<100)
                        volumeSet(parseInt(musicVolume)+2);
                    else if(musicVolume<100)
                        volumeSet(parseInt(musicVolume)+1);
                    break;

                case "ArrowDown":
                    e.preventDefault();
                    if(musicVolume-1>0)
                        volumeSet(parseInt(musicVolume)-2);
                    else if(musicVolume>0)
                        volumeSet(parseInt(musicVolume)-1);
                    break;
                case "m":
                    e.preventDefault();
                    muteOrUnmute();
                    break;
            }
        }
        if ("mediaSession" in navigator) {
            navigator.mediaSession.setActionHandler("play", () => {
                playOrPause();
            });
        
            navigator.mediaSession.setActionHandler("pause", () => {
                playOrPause();
            });
        
            navigator.mediaSession.setActionHandler("previoustrack", () => {
                prevMusic();
            });
        
            navigator.mediaSession.setActionHandler("nexttrack", () => {
                nextMusic();
            });

            navigator.mediaSession.setActionHandler("seekbackward", () => {
                if(playingMusic.currentTime>=5)
                    playingMusic.currentTime -= 5;
            });
        
            navigator.mediaSession.setActionHandler("seekforward", () => {
                if(playingMusic.duration>playingMusic.currentTime)
                    playingMusic.currentTime += 5;
            });
        }
        function load(){
            setVolume(musicVolume);
            if (musicVolume == 0) {
                setMuteButt(volumeIcon0);
            } else if (musicVolume < 33) {
                setMuteButt(volumeIcon1);
            } else if (musicVolume < 66) {
                setMuteButt(volumeIcon2);
            } else {
                setMuteButt(volumeIcon3);
            }
        }
        load();
        const changeBack = playerChange(() => {
            if(selectingPlaylistId!==-1)
                setOpenPlaylist(false);
            if(isPlaying){
                setPlayPic(pause);
            }else{
                setPlayPic(play);
            }
            setVolume(musicVolume);
            if (musicVolume == 0) {
                setMuteButt(volumeIcon0);
            } else if (musicVolume < 33) {
                setMuteButt(volumeIcon1);
            } else if (musicVolume < 66) {
                setMuteButt(volumeIcon2);
            } else {
                setMuteButt(volumeIcon3);
            }
            setCim(playingData.name);
            setEloado(playingData.artistName);
            window.addEventListener("keydown", handleKeyDown);
            window.addEventListener("keyup", handleKeyUp);
            if ("mediaSession" in navigator && !isFading) {
                try {
                    // Ellenőrizzük és használjunk fallback értékeket az undefined mezőkre
                    navigator.mediaSession.metadata = new MediaMetadata({
                        title: playingData.name || "Unknown Title",
                        artist: playingData.artistName || "Unknown Artist",
                        album: playingData.albumName || "Unknown Album",
                        artwork: playingData.imageUrl ? [
                            {
                                src: playingData.imageUrl,
                                sizes: "512x512",
                                type: "image/*",
                            },
                        ] : []
                    });
                } catch (error) {
                    console.error("MediaSession frissítési hiba:", error);
                }
            }
        });
        return ()=>{changeBack();window.removeEventListener("keydown", handleKeyDown);window.removeEventListener("keyup", handleKeyUp);};
    },[])

    

    async function VolumeChange(event) {
        const currentVolume = event.target.value;
        setVolume(currentVolume);
        if (currentVolume == 0) {
            setMuteButt(volumeIcon0);
        } else if (currentVolume < 33) {
            setMuteButt(volumeIcon1);
        } else if (currentVolume < 66) {
            setMuteButt(volumeIcon2);
        } else {
            setMuteButt(volumeIcon3);
        }
        
        updateVolume(currentVolume);
        setMusicVolume(currentVolume);
    }

    async function setVolumeToSetting(){
        if(logedIn){
            await fetch(`http://${ip}/settings/${getUserData().id}`,{
                method:"PUT",
                headers:{
                    'Content-Type': 'application/json',
                    'x-access-token': getAuthToken()
                },
                body: JSON.stringify({volume: volume})
            });
            await loadSettings();
        }
        //console.log("volume: "+volume+"%");
    }

    function timeChange(){
        let t=Math.round(playingMusic.currentTime);
        let g=Math.round(playingMusic.currentTime/60-(0.5/60*59));
        t=t-g*60;
        let h="";
        if(t<10){h=0};
        setCurrent(g+":"+h+t);
    }

    function repeatFunc(){
        if(!isLoopList){
            setRepeatPic(repeatFill)
            setIsLoopList(true);
        }else if(!isOneLoop){
            setRepeatPic(repeatOneFill);
            setIsOneLoop(true);
        }else{
            setRepeatPic(repeat)
            setIsLoopList(false);
            setIsOneLoop(false);
        };
    }

    async function playlistsSelection(){
        await loadCheckedPlaylists(playingData.id);
        await loadPlaylistOptions();
        if(openPlaylist){
            setOpenPlaylist(false);
        }else{
            setOpenPlaylist(true);
        }
        setSelectingPlaylistId(-1);
        changeEvents.forEach(change => change());
    }

    async function playlistChanger(playlistId){
        await loadCheckedPlaylists(playingData.id);
        await loadPlaylistOptions();
        if(!checkedPlaylistOptions.ids.includes(playlistId)){
            await fetch(`http://${ip}/playlists/addMusic`,{
              method: "POST",
              headers: {
              'Content-Type': 'application/json',
              'x-access-token': getAuthToken()
              },
              body: JSON.stringify({playlistId: playlistId, musicId: playingData.id})
            })
        }else{
           await fetch(`http://${ip}/playlists/removeMusic`,{
              method: "DELETE",
              headers: {
              'Content-Type': 'application/json',
              'x-access-token': getAuthToken()
              },
              body: JSON.stringify({playlistId: playlistId, musicId: playingData.id})
            }) 
        }
        setOpenPlaylist(false);
        setSelectingPlaylistId(-1);
        changeEvents.forEach(change => change());
        if(searchParams.get("id")!=null){
            await loadMusicsByPlaylistId(searchParams.get("id"));
            changeEvents.forEach(change => change());
        }
    }

    return (
        <>
        {(settingData.lastMusicId || firstLoad == false) && (
        <div className="player">
            <div className="playerData">
                <div>
                    <img src={playingData.imageUrl?playingData.imageUrl:defaultMusicPic} alt="album kép" className="playerAlbumPic"/>
                </div>
                <div className="playerCimEloado">
                    <p className="playerSong">{cim}</p>
                    <p className="playerArtist">{eloado}</p>
                </div>
            </div>
            <div className="playerSliders">
                <span className="timeElapsed">{current}</span>
                <input type="range" min="0" max={hosszValue} value={currentValue} onChange={(e)=>{setCurrentValue(e.target.value);timeChange()}} onMouseDown={()=>{setIsSetValue(true); isUploadPlay?playingMusic.pause():sliderPause()}} onMouseUp={()=>{setIsSetValue(false);isUploadPlay?playingMusic.play():sliderPlay()}} onInput={(e)=>{playingMusic.currentTime=e.target.value;}} className="timeSlider"/>
                <span className="timeTotal">{hosszValue!=null ? hossz : "0:00"}</span>
                <button className="muteButton" onClick={muteOrUnmute}><img src={muteButt} alt="Mute" className="muteImg"/></button>
                <input type="range" min="0" max="100" value={volume} className="volumeSlider" onChange={VolumeChange} onMouseUp={setVolumeToSetting}/>
            </div>
            <div className="playerControls">
                {logedIn && <button className="controlButton" onClick={playlistsSelection}><img src={add} alt="Hozzáadás" className="controlImg"/></button>}
                {logedIn && <button className="controlButton" onClick={()=>doDownload(playingData.id)}><img src={download} alt="Letöltés" className="controlImg"/></button>}
                <button className="controlButton" onClick={()=>{randomize();isRandomized?setRandomPic(randomFill):setRandomPic(random)}}><img src={randomPic} alt="Jelentés" className="controlImg"/></button>
                <button className="controlButton" onClick={repeatFunc}><img src={repeatPic} alt="Ismétlés" className="controlImg"/></button>
                <button className="controlButton" onClick={prevMusic}><img src={previous} alt="Előző" className="controlImg"/></button>
                <button className="controlButton" onClick={playOrPause}><img src={playPic} alt="Lejátszás" className="controlImg"/></button>
                <button className="controlButton" onClick={nextMusic}><img src={next} alt="Következő" className="controlImg"/></button>
                {logedIn && openPlaylist && <div className="playerSelection">
                  {playlistOptions.ids.map((option, index) => (
                    <label key={option} className="labelElem">
                      <input type="checkbox" value={option} defaultChecked={checkedPlaylistOptions.ids[checkedPlaylistOptions.ids.indexOf(option)]==option} onChange={()=>playlistChanger(option)}/>
                      {playlistOptions.playlists[index]}
                    </label>
                  ))}
                </div>
                }
            </div>
        </div>
        )}
        </>
    );
}