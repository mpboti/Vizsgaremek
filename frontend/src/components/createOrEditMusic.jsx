import { useRef, useState } from "react"
import { Form, redirect, useSearchParams } from "react-router-dom";
import defaultMusicPic from "../assets/defaultMusicPic.png"
import upload from "../assets/upload.png"
import play from "../assets/play.png"
import pause from "../assets/pause.png"
import del from "../assets/bin.png"
import { getUserData, logout, ip, setCurrentAlbumPicSetting, getMusicsData, setUploadedMusicFile, uploadedMusicFile, currentAlbumPicSetting, setCurrentAlbumPicUrl, loadArtistOptions, loadAlbumOptions, loadMufajOptions, loadCurrentMusicData, currentAlbumPicUrl, artistOptions, loadPlaylist, loadPlaylistOptions, playlistOptions } from "../data";
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
        setCurrentAlbumPicSetting(defaultMusicPic);
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
      setCurrentAlbumPicUrl(null);
    }
  }

  async function openFile(isFinal, e){
    if(!isFinal){
      fileOpener.current.click();
    }else{
      const checked = await new Promise((resolve) => {
        const audio = new Audio();
        
        audio.oncanplaythrough = () => resolve(true);
        audio.onerror = () => resolve(false);
        
        if(e.target.files[0])
          audio.src = URL.createObjectURL(e.target.files[0]);
      });
      if(checked){
        setPlayPic(play);
        setMus(new Audio(URL.createObjectURL(e.target.files[0])))
        setUploadedMusicFile(e.target.files[0]);
      }else
        console.log("something is not right")
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
        <div className="justFlex2">
          <div className="numInputs">
            <input type="number" name="releaseDate" placeholder="Album megjelenési éve" defaultValue={mode=="itunes"?asd:""}/>
          </div>
          <div className="numInputs">
            {playlistOptions.ids.map((option, index) => (
              <label key={option} style={{ display: "block" }}>
                <input
                  type="checkbox"
                  name="playlists"
                  value={option}
                />
                {playlistOptions.playlists[index]}
              </label>
            ))}
          </div>
        </div>
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
            <input ref={fileOpener} type="file" name="file" id="file" onChange={(e)=>openFile(true, e)} accept="audio/*" style={{ display: "none" }} required/>
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

export async function MusicAction({request}){
  
  try{
      const token = getAuthToken();
      if(!token || token == "EXPIRED"){
        logout();
      }
      const userData = getUserData();
      if(userData.id == -1){
        throw new Response.json({message: "Nem vagy bejelentkezve!"}, {status: 401});
      }
      const params = new URL(request.url).searchParams;
      const mode = params.get("mode");

      const data = await request.formData();
      const cim = data.get("cim");
      const eloado = data.get("eloado");
      const album = data.get("album");
      const releaseDate = data.get("releaseDate");
      const mufaj = data.get("mufaj");

      let artistId=null;
      if(album){
        const createArtist = await fetch(`http://${ip}/artists`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': getAuthToken()
          },
          body: JSON.stringify({name:eloado})
        });
        const createArtistData = await createArtist.json();
        artistId=createArtistData.id;
      }else if(artistOptions.artists.includes(eloado)){
        artistId=artistOptions.ids[artistOptions.artists.findIndex(eloado)];
      }

      let albumId = null
      if(album){
        let albumBody = {};
        if(releaseDate){
          albumBody = {
            name: album,
            releaseDate: releaseDate
          }
        }else{
          albumBody = {
            name: album
          }
        }
        if(currentAlbumPicUrl && currentAlbumPicSetting == defaultMusicPic){
          albumBody = {...albumBody, imageUrl: currentAlbumPicUrl};
        }else if(!currentAlbumPicUrl && currentAlbumPicSetting != defaultMusicPic){
          const formData = new FormData();
          formData.append("file", currentAlbumPicSetting);
          formData.append("userId", userData.id);
    
          const uploadPic = await fetch(`http://${ip}/files/image`, {
            method: 'POST',
            body: formData
          });
          const uploadPicData = await uploadPic.json();
          albumBody = {...albumBody, artistId: uploadPicData.id};
        }
        const createAlbum = await fetch(`http://${ip}/albums/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': getAuthToken()
          },
          body: JSON.stringify(albumBody)
        });
        if(!createAlbum.ok){
          throw new Response.json({message: "Nem sikerült az album létrehozása"}, {status: 422});
        }
        const createAlbumData = await createAlbum.json();
        albumId=createAlbumData.id;
      }else if(artistOptions.artists.includes(album)){
        albumId = artistOptions.ids[artistOptions.artists.findIndex(album)]
      }

      if(mode!="edit"){
        if(!uploadedMusicFile)
          throw new Response.json({message: "Tölts fel filet!"}, {status: 401})
        let musicBody={name: cim, uploaderId: userData.id}
        if(mufaj){
          musicBody={...musicBody, mufaj: mufaj}
        }
        if(artistId){
          musicBody={...musicBody, artistId: artistId}
        }
        if(albumId){
          musicBody={...musicBody, albumId: albumId}
        }
        const formData = new FormData();
        formData.append("file", currentAlbumPicSetting);
        formData.append("userId", userData.id);

        const uploadMusic = await fetch(`http://${ip}/files/music`, {
          method: 'POST',
          body: formData
        });
        const uploadMusicData = await uploadMusic.json();
        musicBody = {...musicBody, musicFileId: uploadMusicData.id};

        const createMusic = await fetch(`http://${ip}/musics/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': getAuthToken()
          },
          body: JSON.stringify(musicBody)
        });
        const createMusicData = await createMusic.json();
        createMusicData.id
      }else{
        /*
        if(Object.keys(bodyData).length > 0){
          const res = await fetch(`http://${ip}/users/${userData.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'x-access-token': getAuthToken()
            },
            body: JSON.stringify(bodyData)
          });
          if(res.status == 200){
            await loadData();
          }else{
            const err = await res.json();
            throw new Response.json(err, {status: res.status});
          }
        }
        */
      }
      await loadPlaylist();
      return redirect("/");
    }catch(err){
        console.log(err.message);
    }
}

export async function MusicAddLoader({request}){
    const token = getAuthToken();
    if(!token || token == "EXPIRED"){
      logout();
    }
    const params = new URL(request.url).searchParams
    const mode = params.get("mode")
    if(mode=="itunes" || mode=="edit"){
      await loadCurrentMusicData(params.get("id"))
    }
    await loadArtistOptions();
    await loadAlbumOptions();
    await loadMufajOptions();
    await loadPlaylistOptions();
}