import { useRef, useState } from "react"
import { Form, redirect, useSearchParams } from "react-router-dom";
import defaultPlaylistPic from "../assets/defaultPlaylistPic.png"
import { currentPlaylistPicSetting, getUserData, logout, setCurrentPlaylistPicSetting, ip, getPlaylistsData, loadPlaylists, currentExternalLink, setCurrentExternalLink } from "../data";
import { getAuthToken } from "../auth";
import "../styles/forms.css";

export default function CreateOrEditPlaylist(){
  const [searchParams] = useSearchParams();
  const playlistId = searchParams.get("id");
  const playlistData = getPlaylistsData().find(elem=>elem.id==playlistId);

  const fileOpener = useRef();
  const [img, setImg] = useState(playlistId?getPlaylistsData().find(elem=>elem.id==playlistId).listaPic:defaultPlaylistPic);
  const [urlInput, setUrlInput] = useState(playlistId && !getPlaylistsData().find(elem=>elem.id==playlistId)?.listaPic?.includes(ip) ? getPlaylistsData().find(elem=>elem.id==playlistId).listaPic : "");


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
        setCurrentExternalLink(e.target.value);
        setCurrentPlaylistPicSetting(defaultPlaylistPic);
      }else {
        if(currentPlaylistPicSetting == defaultPlaylistPic)
          setImg(currentPlaylistPicSetting);
        else
          setImg(URL.createObjectURL(currentExternalLink));
        setCurrentExternalLink(null);
      }
    }else{
      setImg(URL.createObjectURL(e.target.files[0]));
      setCurrentPlaylistPicSetting(e.target.files[0]);
      setCurrentExternalLink(null);
    }
  }

  async function deletePlaylist() {
    if(playlistData?.listaPicId != null && playlistId){
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
  }
  return(
    <Form method="post" className="authForm">
      <h1>{!playlistId?"Lejátszási lista létrehozása":"Lejátszási lista szerkesztése"}</h1>
      <p>
        <input type="text" name="playlistCim" placeholder="Lejátszási lista címe" defaultValue={playlistId?getPlaylistsData().find(elem=>elem.id==playlistId).name:""} required/>
      </p>
      <p>
        <input type="text" name="playlistPic" placeholder="Lejátszási lista kép url" value={urlInput} onChange={(e)=>{openPic(true, e);setUrlInput(e.target.value);}} autoComplete="off" autoCorrect="off" spellCheck="false"/>
      </p>
      <p>
        <input ref={fileOpener} type="file" onChange={(e)=>openPic(true, e)} accept="image/*" style={{ display: "none" }}/>
        <img src={img} className="uploadAlbumCover" onClick={(e)=>openPic(false, e)}/>
      </p>
      <div>
        <button className="loginFormButton" type="submit">{playlistId?"Módosítás":"Létrehoz"}</button>
        {playlistId?<button className="loginFormButton logoutButton" onClick={deletePlaylist} type="button">Törlés</button>:undefined}
      </div>
    </Form>
  )
}

export async function PlaylistAction({request}){
  try{
    const url = new URL(request.url);
    const playlistId = url.searchParams.get("id");
    const data = await request.formData();
    const playlistData = getPlaylistsData().find(elem=>elem.id==playlistId);
    const token = getAuthToken();
    if(!token || token == "EXPIRED"){
      logout();
    }
    
    const userData = getUserData();
    if(userData.id == -1){
      throw new Response.json({message: "Nem vagy bejelentkezve!"}, {status: 401});
    }

    let playlistPicId=null;
    let externalLink=null;
    
      try{
        if(currentExternalLink && currentPlaylistPicSetting == defaultPlaylistPic){
          externalLink=data.get("playlistPic")
        }else if(!currentExternalLink && currentPlaylistPicSetting != defaultPlaylistPic){
          if(playlistData?.listaPicId != null && playlistId){
            await fetch(`http://${ip}/files/image/${playlistData.listaPicId}`, {
              method:"DELETE",
              headers:{
                'x-access-token': getAuthToken()
              }
            })
          }
          const formData = new FormData();
          formData.append("file", currentPlaylistPicSetting);
          formData.append("userId", userData.id);
          const picUpload = await fetch(`http://${ip}/files/image`, {
            method: 'POST',
            body: formData
          });
          const uploadData = await picUpload.json();
          playlistPicId = uploadData.id;
        }
    }catch(err){
      console.log(err);
    }
    

    let playlistUpdateData={
      name: data.get("playlistCim"),
      creatorId: localStorage.getItem("userId"),
    }
    if(playlistPicId!=null){
      playlistUpdateData={...playlistUpdateData, playlistPicId: playlistPicId}
    }else if(externalLink!=null){
      playlistUpdateData={...playlistUpdateData, externalLink: externalLink}
      if(playlistData?.listaPicId != null && playlistId){
        await fetch(`http://${ip}/files/image/${playlistData.listaPicId}`, {
          method:"DELETE",
          headers:{
            'x-access-token': getAuthToken()
          }
        })
      }
    }else if(playlistData.listaPicId == null){
      playlistUpdateData={...playlistUpdateData, externalLink: playlistData.listaPic}
    }else{
      playlistUpdateData={...playlistUpdateData, playlistPicId: playlistData.listaPicId}
    }
    

    if(!playlistId){
      await fetch(`http://${ip}/playlists/`, {
        method:"POST",
        headers:{
          'Content-Type': 'application/json',
          'x-access-token': getAuthToken()
        },
        body: JSON.stringify(playlistUpdateData)
      });
    }else{
      await fetch(`http://${ip}/playlists/${playlistId}`, {
        method:"PUT",
        headers:{
          'Content-Type': 'application/json',
          'x-access-token': getAuthToken()
        },
        body: JSON.stringify(playlistUpdateData)
      });
    }

    await loadPlaylists(userData.id);
    return redirect("/");
  }catch(err){
    console.log(err);
  }
}
export function loadPlaylistCreate(){
  setCurrentExternalLink(null);
}