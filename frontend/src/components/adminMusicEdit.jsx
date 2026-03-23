import { Form, redirect, useNavigate, useSearchParams } from "react-router-dom";
import { albumOptions, artistOptions, currentAlbumPicSetting, currentAlbumPicUrl, currentMusicData, currentProfilePicSetting, getReports, getUserData, ip, loadAlbumOptions, loadArtistOptions, loadData, loadMufajOptions, loadPlaylists, loadReportsByMusicId, logout, mufajOptions, setCurrentAlbumPicSetting, setCurrentAlbumPicUrl, setCurrentProfilePicSetting, setUploadedMusicFile, uploadedMusicFile } from "../data";
import { useEffect, useRef, useState } from "react";
import "../styles/adminForms.css";
import "../styles/forms.css";
import defaultMusicPic from "../assets/defaultMusicPic.png"
import defaultProfilePic from "../assets/defaultUserPic.png";
import upload from "../assets/upload.png"
import play from "../assets/play.png"
import pause from "../assets/pause.png"
import del from "../assets/bin.png"
import { getAuthToken } from "../auth";
import { uploadPause, uploadPlay } from "../playerLogic";
import ReportRow from "./report-row";

export default function AdminMusicEdit(){
    const [searchParams] = useSearchParams();
    const userData = getUserData();
    const [musicData, setMusicData] = useState(false);
    const [editingUserData, setEditingUserData] = useState(false);
    const [reportsData, setReportsData] = useState(getReports());
    const navigate = useNavigate();

    const fileOpener = useRef();
    const [img, setImg] = useState(defaultMusicPic);
    const [userImg, setUserImg] = useState(defaultProfilePic);
    const [playPic, setPlayPic] = useState(upload);
    const [artistInput, setArtistInput] = useState("");
    const [albumInput, setAlbumInput] = useState("");
    const [mufajInput, setMufajInput] = useState("");
    const [releaseInput, setReleaseInput] = useState("");
    const [urlInput, setUrlInput] = useState("");
    const [albums, setAlbums] = useState(albumOptions);
    const [openArtist, setOpenArtist] = useState(false);
    const [openAlbum, setOpenAlbum] = useState(false);
    const [openMufaj, setOpenMufaj] = useState(false);
    const [mus, setMus] = useState(null);
    const picOpener = useRef();

    useEffect(()=>{
      async function loading(){
        if(searchParams.get("musicId")){
          const res = await fetch(`http://${ip}/musics/${searchParams.get("musicId")}`,{
            headers: {
              'x-access-token': getAuthToken()
            }
          });
          const resData = await res.json();
          setMusicData(resData);
          setArtistInput(resData?.artistName?resData.artistName:"");
          setAlbumInput(resData?.albumName?resData.albumName:"");
          setMufajInput(resData?.mufaj?resData.mufaj:"");
          setReleaseInput(resData?.releaseDate?resData.releaseDate:"");
          if(!(resData?.imageUrl.startsWith("http://") || resData?.imageUrl.startsWith("https://")))
            setImg(`http://${ip}` + resData?.imageUrl)
          else{
            setUrlInput(resData.imageUrl)
            setImg(resData.imageUrl)
          }
          await loadReportsByMusicId(resData.id);
          setReportsData(getReports());
          const res2 = await fetch(`http://${ip}/users/getuser/${resData.uploaderId}`,{
            headers: {
              'x-access-token': getAuthToken()
            }
          });
          const resData2 = await res2.json();
          setEditingUserData(resData2);
          if(resData2.url)
            setUserImg(`http://${ip}`+resData2.url);
        }
      }
      loading();
    },[searchParams])

    async function openUserPic(isFinal, e){
      if(!isFinal){
        fileOpener.current.click();
      }else{
        setUserImg(URL.createObjectURL(e.target.files[0]));
        setCurrentProfilePicSetting(e.target.files[0]);
      }
    }
    
    async function openPic(isFinal, e){
      if(!isFinal){
        fileOpener.current.click();
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
            setImg(URL.createObjectURL(currentAlbumPicUrl));
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

    async function deleteMusic() {
      const confirmed = window.confirm("Biztos törölni akarod a zenét?");
      if (!confirmed)
        return;
      await fetch(`http://${ip}/musics/${musicData.id}`, {
        method:"DELETE",
        headers:{
          'x-access-token': getAuthToken()
        },
      });
      loadPlaylists(userData.id);
      window.location.href = "/";
    }

    async function deleteAlbum() {
      const confirmed = window.confirm("Biztos törölni akarod a zenét?");
      if (!confirmed)
        return;
      await fetch(`http://${ip}/albums/${musicData.albumId}`, {
        method:"DELETE",
        headers:{
          'x-access-token': getAuthToken()
        },
      });
      navigate(`/adminMusicEdit?mode=music${musicData?"&musicId=":""}${musicData?musicData.id:""}`);
    }

    async function deleteArtist() {
      const confirmed = window.confirm("Biztos törölni akarod a zenét?");
      if (!confirmed)
        return;
      await fetch(`http://${ip}/artists/${musicData.artistId}`, {
        method:"DELETE",
        headers:{
          'x-access-token': getAuthToken()
        },
      });
      navigate(`/adminMusicEdit?mode=music${musicData?"&musicId=":""}${musicData?musicData.id:""}`);
    }

    async function deleteUser(){
      const confirmed = window.confirm("Biztos törölni akarod a felhasználódat?");
      if (!confirmed)
        return;
      
      await fetch(`http://${ip}/users/${editingUserData.id}`, {
        method:"DELETE",
        headers:{
          'x-access-token': getAuthToken()
        }
      });
      logout();
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

    function updatePage(){
      console.log(getReports());
      setReportsData(getReports());
    }

    return(
    <div className="adminFormContaner">
      <div className="musicOrPlaylistFlex keresesMenu">
        <button className={searchParams.get("mode")==="music" ? "microSelected" : "musicOrPlaylistButton"} 
        onClick={async ()=>{ navigate(`/adminMusicEdit?mode=music${musicData?"&musicId=":""}${musicData?musicData.id:""}`);}}>
          Music
        </button>
        <button className={searchParams.get("mode")==="album" ? "microSelected" : "musicOrPlaylistButton"} 
        onClick={async ()=>{ navigate(`/adminMusicEdit?mode=album${musicData?"&musicId=":""}${musicData?musicData.id:""}`);}}>
          Album
        </button>
        <button className={searchParams.get("mode")==="artist" ? "microSelected" : "musicOrPlaylistButton"} 
        onClick={async ()=>{ navigate(`/adminMusicEdit?mode=artist${musicData?"&musicId=":""}${musicData?musicData.id:""}`);}}>
          Artist
        </button>
        <button className={searchParams.get("mode")==="user" ? "microSelected" : "musicOrPlaylistButton"} 
        onClick={async ()=>{ navigate(`/adminMusicEdit?mode=user${musicData?"&musicId=":""}${musicData?musicData.id:""}`);}}>
          User
        </button>
        <button className={searchParams.get("mode")==="report" ? "microSelected" : "musicOrPlaylistButton"} 
        onClick={async ()=>{ navigate(`/adminMusicEdit?mode=report${musicData?"&musicId=":""}${musicData?musicData.id:""}`);}}>
          Report
        </button>
      </div>

      {musicData && searchParams.get("mode")==="music" &&
      <Form method="post" className="adminForm">
        <h1>Zene módosítása</h1>
        <p>
          <input type="text" name="cim" placeholder="Zene címe" defaultValue={musicData.name?musicData.name:""} required/>
        </p>
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
        </p>
        <div className="justFlex">
          <div className="kepAlign">
            <input ref={fileOpener} type="file" name="file" id="file" onChange={(e)=>openFile(true, e)} accept="audio/*" style={{ display: "none" }} />
            <img src={playPic} className="uploads" onClick={(e)=>fileChecker(e)}/>
          </div>
        </div>
        <p/>
        <div>
          <button className="loginFormButton logoutButton" onClick={deleteMusic} type="button">Végleges törlés</button>
          <button className="loginFormButton" type="submit">Módosítása</button>
        </div>
      </Form>
      }

      {musicData && searchParams.get("mode")==="album" && 
        <Form method="post" className="adminForm">
          <h1>Album módosítása</h1>
          <p/>
            <div className="downFlex">
              <input type="text" name="album" placeholder="Album neve" value={albumInput} onChange={(e) => {setAlbumInput(e.target.value); setOpenAlbum(true)}} onFocus={() => setOpenAlbum(true)} onBlur={() => setTimeout(() => setOpenAlbum(false), 100)} autoComplete="off" autoCorrect="off" spellCheck="false"/>
              <div className="selection" style={!openAlbum ? {display: "none"} : {}}>
                {albums.albums.filter((elem) => elem.toLowerCase().includes(albumInput.toLowerCase())).map((album) => (
                  <div key={album} className="labelElem" onMouseDown={() => { setAlbumInput(album); setOpenAlbum(false); getAlbum(albumOptions.ids[albumOptions.albums.indexOf(album)])}}>
                    {album}
                  </div>
                ))}
              </div>
            </div>
          <p/>
          <p>
            <input type="number" name="releaseDate" placeholder="Album megjelenési éve" value={releaseInput} onChange={(e)=>setReleaseInput(e.target.value)} autoComplete="off" autoCorrect="off" spellCheck="false"/>
          </p>
          <p>
            <input type="text" name="albumPic" placeholder="Album kép url" value={urlInput} onChange={(e)=>{openPic(true, e);setUrlInput(e.target.value);}} autoComplete="off" autoCorrect="off" spellCheck="false"/>
          </p>
          <div className="justFlex">
            <div className="kepAlign">
              <input ref={picOpener} type="file" onChange={(e)=>openPic(true, e)} accept="image/*" style={{ display: "none" }}/>
              <img src={img} className="uploads" onClick={(e)=>openPic(false, e)}/>
            </div>
          </div>
          <p/>
          <div>
            <button className="loginFormButton logoutButton" onClick={deleteAlbum} type="button">Végleges törlés</button>
            <button className="loginFormButton" type="submit">Módosítása</button>
          </div>
        </Form>
      }

      {musicData && searchParams.get("mode")==="artist" && 
        <Form method="post" className="adminForm">
          <h1>Előadó módosítása</h1>
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
          <div>
            <button className="loginFormButton logoutButton" onClick={deleteArtist} type="button">Végleges törlés</button>
            <button className="loginFormButton" type="submit">Módosítása</button>
          </div>
        </Form>
      }

      {editingUserData && searchParams.get("mode")==="user" &&
      <Form method="post" className="adminForm">
        <h1>Felhasználó szerkesztése</h1>
          <p>
            <input id="username" type="text" name="username" placeholder="Felhasználó név" defaultValue={editingUserData.username} required autoComplete="off" autoCorrect="off" spellCheck="false"/>
          </p>
          <p>
            <input id="email" type="email" name="email" placeholder="Email" defaultValue={editingUserData.email} required autoComplete="off" autoCorrect="off" spellCheck="false"/>
          </p>
          <p>
              <input ref={fileOpener} type="file" name="file" id="file" onChange={(e)=>openUserPic(true, e)} accept="image/*" style={{ display: "none" }}/>
              <img src={userImg} className="uploadImageCover" onClick={(e)=>openUserPic(false, e)}/>
          </p>
          <div>
            <button className="loginFormButton" type="submit">{"Módosítás"}</button>
            <button className="loginFormButton logoutButton" onClick={deleteUser} type="button">Felhasználó törlése</button>
          </div>
      </Form>
      }

      {musicData && searchParams.get("mode")==="report" && 
      <div className="reportContainer">
        {reportsData.length > 0 && reportsData.map((elem)=>(
          <ReportRow key={elem.id}
          id={elem.id}
          userId={elem.userId}
          musicId={elem.musicId}
          message={elem.message}
          update={updatePage}
          />
        ))}
      </div>
      }
    </div>
  )
}

export async function AdminMusicAction({request}){
  try{
    const token = getAuthToken();
    if(!token || token == "EXPIRED"){
      logout();
    }
    const userData = getUserData();
    if(userData.id == -1){
      throw new Response.json({message: "Nem vagy bejelentkezve!"}, {status: 401});
    }
    const data = await request.formData();
    
    const url = new URL(request.url);

    if(url.searchParams.get("mode")==="music"){
      const cim = data.get("cim");
      const mufaj = data.get("mufaj");
      if(uploadedMusicFile!=null){
        await fetch(`http://${ip}/files/music/${currentMusicData.musicFileId}`, {
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

        await fetch(`http://${ip}/musics/${url.searchParams.get("musicId")}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': getAuthToken()
          },
          body: JSON.stringify({name: cim, mufaj: mufaj, musicFileId: uploadMusicData.id})
        });
      }else{
        await fetch(`http://${ip}/musics/${url.searchParams.get("musicId")}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': getAuthToken()
          },
          body: JSON.stringify({name: cim, mufaj: mufaj})
        });
      }
    }else if(url.searchParams.get("mode")==="album"){
      const album = data.get("album");
      const releaseDate = data.get("releaseDate");
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
        const res = await fetch(`http://${ip}/albums/${albumOptions.ids[albumOptions.albums.findIndex((e)=>e==album)]}`,{
          headers:{
            'x-access-token': getAuthToken()
          }
        })
        const resData = await res.json()
        albumBody={...albumBody, artistId: resData.id}

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
      await fetch(`http://${ip}/musics/${url.searchParams.get("musicId")}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': getAuthToken()
        },
        body: JSON.stringify({albumId: albumId})
      });
    }else if(url.searchParams.get("mode")==="artist"){
      const eloado = data.get("eloado");
      let artistId=null;
      if(eloado!="" && !artistOptions.artists.includes(eloado)){
        const createArtist = await fetch(`http://${ip}/artists`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': getAuthToken()
          },
          body: JSON.stringify({name: eloado})
        });
        const createArtistData = await createArtist.json();
        artistId=createArtistData.id;
      }else{
        artistId=artistOptions.ids[artistOptions.artists.findIndex((e)=>e==eloado)];
      }
      await fetch(`http://${ip}/musics/${url.searchParams.get("musicId")}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': getAuthToken()
        },
        body: JSON.stringify({artistId: artistId})
      });
    }else if(url.searchParams.get("mode")==="user"){
      const res = await fetch(`http://${ip}/users/getuser/${url.searchParams.get("userId")}`,{
        headers: {
          'x-access-token': getAuthToken()
        }
      });
      const editingUserData = await res.json();
      const username = data.get("username");
      const email = data.get("email");
  
      let bodyData = {};
      if(email != editingUserData.email && email.includes("@") && email != ""){
        bodyData = {...bodyData, email: email}
      }
      if(username != editingUserData.username)
        bodyData = {...bodyData, username: username}
      if(currentProfilePicSetting != defaultProfilePic){
        if(editingUserData.imageFileId != null){
          await fetch(`http://${ip}/files/image/${editingUserData.imageFileId}`, {
            method:"DELETE",
            headers:{
              'x-access-token': getAuthToken()
            }
          })
        }
        const formData = new FormData();
        formData.append("file", currentProfilePicSetting);
        formData.append("userId", editingUserData.id);
  
        const response = await fetch(`http://${ip}/files/image`, {
          method: 'POST',
          body: formData
        });
        const responseData = await response.json();
        bodyData = {...bodyData, imageFileId: responseData.id}
      }
      console.log(bodyData);
      if(Object.keys(bodyData).length > 0){
        const res = await fetch(`http://${ip}/users/${editingUserData.id}`, {
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
    }
    await loadPlaylists(userData.id);
    return redirect("/");
  }catch(err){
    console.log(err);
  }
}

export async function AdminMusicLoader() {
  await loadArtistOptions();
  await loadAlbumOptions();
  await loadMufajOptions();
}