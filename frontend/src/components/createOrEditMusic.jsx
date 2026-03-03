import { useEffect, useRef, useState } from "react"
import { Form, redirect, useSearchParams } from "react-router-dom";
import defaultMusicPic from "../assets/defaultMusicPic.png"
import upload from "../assets/upload.png"
import play from "../assets/play.png"
import pause from "../assets/pause.png"
import del from "../assets/bin.png"
import up from "../assets/up.png"
import down from "../assets/down.png"
import { getUserData, logout, ip, setCurrentAlbumPicSetting, setUploadedMusicFile, uploadedMusicFile, currentAlbumPicSetting, setCurrentAlbumPicUrl, loadArtistOptions, loadAlbumOptions, loadMufajOptions, loadCurrentMusicData, currentAlbumPicUrl, artistOptions, loadPlaylist, loadPlaylistOptions, playlistOptions, loadPlaylists, albumOptions, mufajOptions, currentMusicData, checkedPlaylistOptions, loadCheckedPlaylists, loadCurrentITunesMusicData, musicsData } from "../data";
import { getAuthToken } from "../auth";
import { uploadPause, uploadPlay } from "../playerLogic";

export default function CreateOrEditMusic(){
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");
  const musicId = searchParams.get("id");
  const playlistId = searchParams.get("playlisId") || -1;
  const musicData = currentMusicData;
  const [mus, setMus] = useState(null);
  const [playPic, setPlayPic] = useState(upload);
  const [openArtist, setOpenArtist] = useState(false);
  const [openAlbum, setOpenAlbum] = useState(false);
  const [openPlaylist, setOpenPlaylist] = useState(false);
  const [openMufaj, setOpenMufaj] = useState(false);
  const [artistInput, setArtistInput] = useState((mode=="itunes" || mode=="edit") && musicData.artistName?musicData.artistName:"");
  const [albumInput, setAlbumInput] = useState((mode=="itunes" || mode=="edit") && musicData.albumName?musicData.albumName:"");
  const [mufajInput, setMufajInput] = useState((mode=="itunes" || mode=="edit") && musicData.mufaj?musicData.mufaj:"");
  const [releaseInput, setReleaseInput] = useState((mode=="itunes" || mode=="edit") && musicData.releaseDate?musicData.releaseDate:"");
  const [urlInput, setUrlInput] = useState((mode=="itunes" || mode=="edit") && musicData.imageUrl?musicData.imageUrl:"");
  const [albums, setAlbums] = useState(albumOptions);
  const picOpener = useRef();
  const fileOpener = useRef();
  const [img, setImg] = useState(musicId && musicData.imageUrl?musicData.imageUrl:defaultMusicPic);

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
        uploadPlay(mus);
        mus.addEventListener("ended",() =>{mus.load(); setPlayPic(play);} )
        setPlayPic(pause)
    } else if(playPic==pause){ 
        uploadPause();
        setPlayPic(del);
    }else{
        setMus(null);
        setUploadedMusicFile(null);
        setPlayPic(upload);
    }
  }
  async function albumFiltering(artistId) {
    try{
      let tempAlbums = {ids: [], albums:[]};
      const res = await fetch(`http://${ip}/albums`);
      const resData = await res.json();
      for(const elem of resData){
        if(!tempAlbums.ids.includes(elem.id) && elem.artistId==artistId){
          tempAlbums.albums.push(elem.name);
          tempAlbums.ids.push(elem.id);
        }
      }
      setAlbums(tempAlbums);
    }catch(err){
      console.log(err)
    }
    setAlbumInput("");
    if(urlInput!="");
      setImg(defaultMusicPic);
    setUrlInput("");
  }

  function clearAlbum(){
    setReleaseInput("");
    if(urlInput!="");
      setImg(defaultMusicPic);
    setUrlInput("");
  }

  async function getAlbum(albumId){
    const res = await fetch(`http://${ip}/albums/${albumId}`);
    const resData = await res.json();
    if(resData.releaseDate!=null)
      setReleaseInput(resData.releaseDate);
    if(resData.imageFilePath!=null){
      setUrlInput(resData.imageFilePath);
      setImg(resData.imageFilePath)
    }else if(resData.imageFileId!=null){
      const response = await fetch(`http://${ip}/files/image/${resData.imageFileId}`)
      setImg(`http://${ip}${(await response.json()).url}`);
    }
    if(resData.artistId!=null){
      const artist = await fetch(`http://${ip}/artists/${resData.artistId}`);
      const artistData = await artist.json();
      setArtistInput(artistData.name);
    }
  }

  async function deleteMusic() {
    const confirmed = window.confirm("Biztos törölni akarod a zenét?");
    if (!confirmed)
      return;
    await fetch(`http://${ip}/files/music/${musicId}`, {
      method:"DELETE",
      headers:{
        'x-access-token': getAuthToken()
      }
    });
    await fetch(`http://${ip}/musics/${playlistId}`, {
      method:"DELETE",
      headers:{
        'Content-Type': 'application/json',
        'x-access-token': getAuthToken()
      },
      body: JSON.stringify({userId: localStorage.getItem("userId")})
    });
    window.location.href = parseInt(playlistId)==-1?"/":`/playlist?id=${playlistId}`;
  }
  return(
    <div className="settingPage">
      <Form method="post" className="settingForm">
        <h1>{mode=="create" || mode=="itunes"?"Zene létrehozása":"Zene módosítása"}</h1>
        <p>
          <input type="text" name="cim" placeholder="Zene címe" defaultValue={(mode=="itunes" || mode=="edit") && musicData.name?musicData.name:""} required/>
        </p>
        <div className="downFlex">
          <input type="text" name="eloado" placeholder="Előadó neve" value={artistInput} onChange={(e) => {setArtistInput(e.target.value); setOpenArtist(true); setAlbums(albumOptions);}} onFocus={() => setOpenArtist(true)} onBlur={() => setTimeout(() => setOpenArtist(false), 100)} autoComplete="off" autoCorrect="off" spellCheck="false"/>
          <div className="selection" style={!openArtist ? {display: "none"} : {}}>
            {artistOptions.artists.filter((elem) => elem.toLowerCase().includes(artistInput.toLowerCase())).map((artist) => (
              <div key={artist} className="labelElem" onMouseDown={() => { setArtistInput(artist); setOpenArtist(false); albumFiltering(artistOptions.ids[artistOptions.artists.indexOf(artist)])}}>
                {artist}
              </div>
            ))}
          </div>
        </div>
        <p/>
        <div className="downFlex">
          <input type="text" name="album" placeholder="Album neve" value={albumInput} onChange={(e) => {setAlbumInput(e.target.value); setOpenAlbum(true); clearAlbum()}} onFocus={() => setOpenAlbum(true)} onBlur={() => setTimeout(() => setOpenAlbum(false), 100)} autoComplete="off" autoCorrect="off" spellCheck="false"/>
          <div className="selection" style={!openAlbum ? {display: "none"} : {}}>
            {albums.albums.filter((elem) => elem.toLowerCase().includes(albumInput.toLowerCase())).map((album) => (
              <div key={album} className="labelElem" onMouseDown={() => { setAlbumInput(album); setOpenAlbum(false); getAlbum(albumOptions.ids[albumOptions.albums.indexOf(album)]);}}>
                {album}
              </div>
            ))}
          </div>
        </div>
        <p/>
        <div className="justFlex2">
          <div className="numInputs">
            <input type="number" name="releaseDate" placeholder="Album megjelenési éve" value={releaseInput} onChange={(e)=>setReleaseInput(e.target.value)} autoComplete="off" autoCorrect="off" spellCheck="false"/>
          </div>
          <div className="numInputs">
            <button type="button" onClick={() => setOpenPlaylist(!openPlaylist)} className="lenyiloGomb" >Lejátszási listák  <img src={openPlaylist?up:down} alt="Lejátszási listák ⬇" className="upDownImg"/></button>
            <div className="selection" style={!openPlaylist ? {display: "none"} : {}}>
              {playlistOptions.ids.map((option, index) => (
                <label key={option} className="labelElem">
                  <input type="checkbox" name="playlists" value={option} defaultChecked={mode=="edit"?checkedPlaylistOptions.ids[checkedPlaylistOptions.ids.indexOf(option)]==option:option==playlistId}/>
                  {playlistOptions.playlists[index]}
                </label>
              ))}
            </div>
          </div>
        </div>
        <p/>
        <div className="downFlex">
          <input type="text" name="mufaj" placeholder="Zene műfaja" value={mufajInput} onChange={(e) => {setMufajInput(e.target.value); setOpenMufaj(true);}} onFocus={() => setOpenMufaj(true)} onBlur={() => setTimeout(() => setOpenMufaj(false), 100)} autoComplete="off" autoCorrect="off" spellCheck="false"/>
          <div className="selection" style={!openMufaj ? {display: "none"} : {}}>
            {mufajOptions.filter((elem) => elem.toLowerCase().includes(mufajInput.toLowerCase())).map((mufaj) => (
              <div key={mufaj} className="labelElem" onMouseDown={() => { setMufajInput(mufaj); setOpenMufaj(false);  }}>
                {mufaj}
              </div>
            ))}
          </div>
        </div>
        <p>
          <input type="text" name="albumPic" placeholder="Album kép url" value={urlInput} onChange={(e)=>{openPic(true, e);setUrlInput(e.target.value);}} autoComplete="off" autoCorrect="off" spellCheck="false"/>
        </p>
        <div className="justFlex">
          <div className="kepAlign">
            <input ref={picOpener} type="file" onChange={(e)=>openPic(true, e)} accept="image/*" style={{ display: "none" }}/>
            <img src={img} className="uploads" onClick={(e)=>openPic(false, e)}/>
          </div>
          <div className="kepAlign">
            {mode=="edit"?<input ref={fileOpener} type="file" name="file" id="file" onChange={(e)=>openFile(true, e)} accept="audio/*" style={{ display: "none" }} />:
            <input ref={fileOpener} type="file" name="file" id="file" onChange={(e)=>openFile(true, e)} accept="audio/*" style={{ display: "none" }} required/>}
            <img src={playPic} className="uploads" onClick={(e)=>fileChecker(e)}/>
          </div>
        </div>
        <p>
        </p>
        <div>
          {mode=="edit"?<button className="loginFormButton logoutButton" onClick={deleteMusic} type="button">Végleges törlés</button>:undefined}
          <button className="loginFormButton" type="submit">{mode=="edit"?"Módosítása":"Létrehoz"}</button>
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
      const selectedPlaylists = data.getAll("playlists").map((e)=>e=parseInt(e));
      if(album!="" && eloado== ""){
        throw new Response.json({message: "Előadó nélkül ne hozz létre albumot."}, {status: 401});
      }


      let artistId=null;
      if(eloado!="" && !artistOptions.artists.includes(eloado)){
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
      }else{
        artistId=artistOptions.ids[artistOptions.artists.findIndex((e)=>e==eloado)];
      }

      let albumId = null
      if(album != "" && !albumOptions.albums.includes(album)){
        let albumBody = {};
        if(releaseDate!=""){
          albumBody = {
            name: album,
            releaseDate: parseInt(releaseDate)
          }
        }else{
          albumBody = {
            name: album
          }
        }
        if(currentAlbumPicUrl && currentAlbumPicSetting == defaultMusicPic){
          albumBody = {...albumBody, imageFilePath: currentAlbumPicUrl};
        }else if(!currentAlbumPicUrl && currentAlbumPicSetting != defaultMusicPic){
          const formData = new FormData();
          formData.append("file", currentAlbumPicSetting);
          formData.append("userId", userData.id);
    
          const uploadPic = await fetch(`http://${ip}/files/image`, {
            method: 'POST',
            body: formData
          });
          const uploadPicData = await uploadPic.json();
          albumBody = {...albumBody, imageFileId: uploadPicData.id};
        }
        const createAlbum = await fetch(`http://${ip}/albums/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': getAuthToken()
          },
          body: JSON.stringify({...albumBody, artistId: artistId})
        });
        if(!createAlbum.ok){
          throw new Response.json({message: "Nem sikerült az album létrehozása"}, {status: 422});
        }
        const createAlbumData = await createAlbum.json();
        albumId=createAlbumData.id;
      }else if(album != "" && albumOptions.albums.includes(album)){
        albumId = albumOptions.ids[albumOptions.albums.findIndex((e)=>e==album)];
        let isDifferent = false;
        let albumBody = {};
        const albumRes = await fetch(`http://${ip}/albums/${albumId}`)
        const albumData = await albumRes.json();

        if(releaseDate!="" && albumData.releaseDate == null){
          albumBody = {
            releaseDate: parseInt(releaseDate)
          }
          isDifferent=true;
        }
        if(currentAlbumPicUrl && currentAlbumPicSetting == defaultMusicPic && albumData.imageFilePath == null){
          albumBody = {...albumBody, imageFilePath: currentAlbumPicUrl};
          isDifferent=true;
        }else if(!currentAlbumPicUrl && currentAlbumPicSetting != defaultMusicPic && albumData.imageFileId == null){
          const formData = new FormData();
          formData.append("file", currentAlbumPicSetting);
          formData.append("userId", userData.id);
        
          const uploadPic = await fetch(`http://${ip}/files/image`, {
            method: 'POST',
            body: formData
          });
          const uploadPicData = await uploadPic.json();
          albumBody = {...albumBody, imageFileId: uploadPicData.id};
          isDifferent = true;
        }
        if(isDifferent){
          const editAlbum = await fetch(`http://${ip}/albums/${albumId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'x-access-token': getAuthToken()
            },
            body: JSON.stringify(albumBody)
          });
          if(!editAlbum.ok){
            throw new Response.json({message: "Nem sikerült az album módosítása"}, {status: 422});
          }
        }
      }else{
        albumId = albumOptions.ids[albumOptions.albums.findIndex((e)=>e==album)];
      }

      if(mode!="edit"){
        if(!uploadedMusicFile)
          throw new Response.json({message: "Tölts fel filet!"}, {status: 401})
        let musicBody={name: cim, uploaderId: userData.id}
        if(mufaj!=""){
          musicBody={...musicBody, mufaj: mufaj}
        }
        if(artistId!=null){
          musicBody={...musicBody, artistId: artistId}
        }
        if(albumId!=null){
          musicBody={...musicBody, albumId: albumId}
        }
        const formData = new FormData();
        formData.append("file", uploadedMusicFile);
        formData.append("userId", userData.id);

        const uploadMusic = await fetch(`http://${ip}/files/music`, {
          method: 'POST',
          headers: {
            'x-access-token': getAuthToken()
          },
          body: formData
        });
        const uploadMusicData = await uploadMusic.json();
        musicBody = {...musicBody, musicFileId: uploadMusicData.id};

        const createMusic = await fetch(`http://${ip}/musics`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': getAuthToken()
          },
          body: JSON.stringify(musicBody)
        });
        const createMusicData = await createMusic.json();
        for(const selectedId of selectedPlaylists){
          await fetch(`http://${ip}/playlists/addMusic`,{
            method: "POST",
            headers: {
            'Content-Type': 'application/json',
            'x-access-token': getAuthToken()
            },
            body: JSON.stringify({playlistId: selectedId, musicId: createMusicData.id})
          })
        }
      }else{
        const searchParams = new URL(request.url).searchParams
        let updateBody={name: cim, uploaderId: userData.id};
        const playlists = await fetch(`http://${ip}/playlists/getPlaylistsByIds`,{
          method:"POST",
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': getAuthToken()
          },
          body: JSON.stringify({userId: searchParams.get("userId"), musicId: searchParams.get("id")})
        })
        const resData1 = await playlists.json();
        const tomb = resData1.playlists.map((elem)=>elem.id)
        if(resData1.isThere){
          for(const selectedId of playlistOptions.ids){
            if(selectedPlaylists.includes(selectedId) && !tomb.includes(selectedId)){
              await fetch(`http://${ip}/playlists/addMusic`,{
                method: "POST",
                headers: {
                'Content-Type': 'application/json',
                'x-access-token': getAuthToken()
                },
                body: JSON.stringify({playlistId: selectedId, musicId: searchParams.get("id")})
              })
            }else if(!selectedPlaylists.includes(selectedId) && tomb.includes(selectedId)){
              await fetch(`http://${ip}/playlists/removeMusic`,{
                method: "DELETE",
                headers: {
                'Content-Type': 'application/json',
                'x-access-token': getAuthToken()
                },
                body: JSON.stringify({playlistId: selectedId, musicId: searchParams.get("id")})
              })
            }
          }
        }else{
          for(const selectedId of selectedPlaylists){
            await fetch(`http://${ip}/playlists/addMusic`,{
              method: "POST",
              headers: {
              'Content-Type': 'application/json',
              'x-access-token': getAuthToken()
              },
              body: JSON.stringify({playlistId: selectedId, musicId: searchParams.get("id")})
            })
          }
        }
        if(uploadedMusicFile!=null){
          await fetch(`http://${ip}/files/music/${searchParams.get("id")}`, {
            method:"DELETE",
            headers:{
              'x-access-token': getAuthToken()
            }
          });

          const formData = new FormData();
          formData.append("file", uploadedMusicFile);
          formData.append("userId", userData.id);

          const uploadMusic = await fetch(`http://${ip}/files/music`, {
            method: 'POST',
            headers: {
              'x-access-token': getAuthToken()
            },
            body: formData
          });
          const uploadMusicData = await uploadMusic.json();
          updateBody = {...updateBody, musicFileId: uploadMusicData.id};
        }
        
        if(mufaj!=""){
          updateBody={...updateBody, mufaj: mufaj}
        }
        if(artistId!=null){
          updateBody={...updateBody, artistId: artistId}
        }
        if(albumId!=null){
          updateBody={...updateBody, albumId: albumId}
        }
        if(Object.keys(updateBody).length > 0){
          const res = await fetch(`http://${ip}/musics/${searchParams.get("id")}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'x-access-token': getAuthToken()
            },
            body: JSON.stringify(updateBody)
          });
        }
      }
      if(selectedPlaylists[0]){
        await loadPlaylist(selectedPlaylists[0]);
        return redirect(`/playlist?id=${selectedPlaylists[0]}`);
      }else{
        await loadPlaylists(userData.id);
        return redirect("/");
      }
    }catch(err){
        console.log(err.message);
    }
}

export async function MusicAddLoader({request}){
  const userData = getUserData()
  const token = getAuthToken();
  if(!token || token == "EXPIRED"){
    logout();
  }
  const searchParams = new URL(request.url).searchParams
  if(searchParams.get("userId")!=undefined && searchParams.get("userId")!=userData.id){
    window.location.href = "/";
  }
  const mode = searchParams.get("mode")
  if(mode=="itunes"){
    
    const id = parseInt(searchParams.get("id"));
    const foundMusic = musicsData.find(e => e.id === id);
    if (foundMusic)
      localStorage.setItem("ItunesData", JSON.stringify(foundMusic));
    await loadCurrentITunesMusicData(JSON.parse(localStorage.getItem("ItunesData")));
  }else if(mode=="edit"){
    if(searchParams.get("userId")==undefined)
      window.location.href = "/";
    await loadCurrentMusicData(searchParams.get("id"))
    await loadCheckedPlaylists(searchParams.get("userId"), searchParams.get("id"))
  }
  await loadArtistOptions();
  await loadAlbumOptions();
  await loadMufajOptions();
  await loadPlaylistOptions();
}