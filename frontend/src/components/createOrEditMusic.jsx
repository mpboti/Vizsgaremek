import { useRef, useState } from "react"
import { Form, redirect, useSearchParams } from "react-router-dom";
import defaultMusicPic from "../assets/defaultMusicPic.png"
import upload from "../assets/upload.png"
import play from "../assets/play.png"
import pause from "../assets/pause.png"
import del from "../assets/bin.png"
import { getUserData, logout, setCurrentPlaylistPicSetting, ip, getPlaylistsData, loadPlaylists, setCurrentAlbumPicSetting, getMusicsData, setUploadedMusicFile, uploadedMusicFile, currentAlbumPicSetting, setCurrentAlbumPicUrl, loadArtistOptions, loadAlbumOptions, loadMufajOptions } from "../data";
import { getAuthToken } from "../auth";

export default function CreateOrEditMusic(){
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");
  const musicId = searchParams.get("id")
  const musicData = getMusicsData().find(elem=>elem.id==musicId);
  const [mus, setMus] = useState(null);
  const [playPic, setPlayPic] = useState(upload);
  const picOpener = useRef();
  const fileOpener = useRef();
  const [img, setImg] = useState(musicId?musicData.albumPic:defaultMusicPic);

  async function openUrl(url){
    const checked = await new Promise((resolve) => {
      const image = new Image();

      image.onload = () => resolve(true);
      image.onerror = () => resolve(false);

      image.src = url;
    });
    if(checked){
      setImg(url)
    }else{
      setImg(URL.createObjectURL(currentAlbumPicSetting))
    }
  }

  async function openPic(isFinal, e){
    if(!isFinal){
      picOpener.current.click();
    }else if(e.target.type=="text"){
      const checked = await new Promise((resolve) => {
        const image = new Image();
        
        image.onload = () => resolve(true);
        image.onerror = () => resolve(false);
        
        image.src = e.target.value;
      });
      if(checked){
        setImg(e.target.value);
        setCurrentAlbumPicUrl(e.target.value);
      }else {
        if(currentAlbumPicSetting == defaultMusicPic)
          setImg(currentAlbumPicSetting);
        else
          setImg(URL.createObjectURL(currentAlbumPicSetting));
        setCurrentAlbumPicUrl(null);
      }
    }else{
      setImg(URL.createObjectURL(e.target.files[0]));
      setCurrentAlbumPicSetting(e.target.files[0]);
    }
  }

  function openFile(isFinal, e){
    if(!isFinal){
      fileOpener.current.click();
    }else{
      setPlayPic(play);
      setMus(new Audio(URL.createObjectURL(e.target.files[0])))
      setUploadedMusicFile(e.target.files[0]);
    }
  }

  function fileChecker(e){
    if(playPic==upload)
        openFile(false, e);
    else if(playPic==play){ 
        mus.play();
        mus.addEventListener("ended",() =>{mus.load(); setPlayPic(play);} )
        setPlayPic(pause)
    } else if(playPic==pause){ 
        mus.pause();
        setPlayPic(del);
    }else{
        setMus(null);
        setUploadedMusicFile(null);
        setPlayPic(upload);
    }
  }

  async function deleteMusic() {
    const confirmed = window.confirm("Biztos törölni akarod a zenét?");
    if (!confirmed)
      return;
    /*
    if(playlistData?.listaPicId != null && playlistId){
      console.log(playlistData.listaPicId)
      await fetch(`http://${ip}/files/image/${playlistData.listaPicId}`, {
        method:"DELETE",
        headers:{
          'x-access-token': getAuthToken()
        }
      })
    }
    await fetch(`http://${ip}/playlists/${playlistId}`, {
      method:"DELETE",
      headers:{
        'Content-Type': 'application/json',
        'x-access-token': getAuthToken()
      },
      body: JSON.stringify({userId: localStorage.getItem("userId")})
    });
    loadPlaylists(getUserData().id);
    window.location.href = "/";
    */
  }
  return(
    <div className="settingPage">
      <Form method="post" className="settingForm">
        <h1>{mode=="create" || mode=="itunes"?"Zene létrehozása":"Zene módosítása"}</h1>
        <p>
          <input type="text" name="cim" placeholder="Zene címe" defaultValue={mode=="itunes"?asd:""} required />
        </p>
        <p>
          <input type="text" name="eloado" placeholder="Előadó neve" defaultValue={mode=="itunes"?asd:""}/>
        </p>
        <p>
          <input type="text" name="album" placeholder="Album neve" defaultValue={mode=="itunes"?asd:""}/>
        </p>
        <p>
          <input type="number" name="releaseDate" placeholder="Album megjelenési éve" defaultValue={mode=="itunes"?asd:""}/>
        </p>
        <p>
          <input type="text" name="mufaj" placeholder="Zene műfaja" defaultValue={mode=="itunes"?asd:""}/>
        </p>
        <p>
          <input type="text" name="albumPic" placeholder="Album kép url" defaultValue={mode=="itunes"?asd:""} onChange={(e)=>openPic(true, e)}/>
        </p>
        <div className="justFlex">
          <div className="kepAlign">
            <input ref={picOpener} type="file" onChange={(e)=>openPic(true, e)} accept="image/*" style={{ display: "none" }}/>
            <img src={img} className="uploads" onClick={(e)=>openPic(false, e)}/>
          </div>
          <div className="kepAlign">
            <input ref={fileOpener} type="file" name="file" id="file" onChange={(e)=>openFile(true, e)} accept="audio/*" style={{ display: "none" }}/>
            <img src={playPic} className="uploads" onClick={(e)=>fileChecker(e)}/>
          </div>
        </div>
        <p>
        </p>
        <div>
          <button className="loginFormButton" type="submit">{mode=="edit"?"Módosítása":"Létrehoz"}</button>
          {mode=="edit"?<button className="loginFormButton logoutButton" onClick={deleteMusic} type="button">Végleges törlés</button>:undefined}
        </div>
      </Form>
    </div>
  )
}

export async function MusicAction(){

}

export async function MusicAddLoader(){
  await loadArtistOptions();
  await loadAlbumOptions();
  await loadMufajOptions();
}