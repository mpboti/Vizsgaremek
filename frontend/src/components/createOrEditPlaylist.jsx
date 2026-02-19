import { useRef, useState } from "react"
import { Form, redirect, useSearchParams } from "react-router-dom";
import defaultPlaylistPic from "../assets/defaultPlaylistPic.png"
import { currentPlaylistPicSetting, getUserData, logout, setCurrentPlaylistPicSetting, ip, getPlaylistsData } from "../data";
import { getAuthToken } from "../auth";
let pId;
export default function CreateOrEditPlaylist(){
  const [searchParams] = useSearchParams();
  const playlistId = searchParams.get("id");
  pId=playlistId;
  
  const fileOpener = useRef();
  const [img, setImg] = useState(playlistId?getPlaylistsData().find(elem=>elem.id==playlistId).listaPic:defaultPlaylistPic);

  function openPic(isFinal, e){
    if(!isFinal){
      fileOpener.current.click();
    }else{
      setImg(URL.createObjectURL(e.target.files[0]));
      setCurrentPlaylistPicSetting(e.target.files[0]);
    }
  }
  return(
    <Form method="post" className="authForm">
      <h1>{!playlistId?"Lejátszási lista létrehozása":"Lejátszási lista szerkesztése"}</h1>
      <p>
        <input type="text" name="playlistCim" placeholder="Lejátszási lista címe" defaultValue={playlistId?getPlaylistsData().find(elem=>elem.id==playlistId).name:""} required />
      </p>
      <p>
        <input ref={fileOpener} type="file" onChange={(e)=>openPic(true, e)} accept="image/*" style={{ display: "none" }}/>
        <img src={img} className="uploadAlbumCover" onClick={(e)=>openPic(false, e)}/>
      </p>
      <div>
        <button className="loginFormButton">{playlistId?"Módosítás":"Létrehoz"}</button>
      </div>
    </Form>
  )
}

export async function PlaylistAction({request}){
  try{
    const data = await request.formData();
    const token = getAuthToken();
    if(!token || token == "EXPIRED"){
      logout();
    }
    const userData = getUserData();
    if(userData.id == -1){
      throw new Response.json({message: "Nem vagy bejelentkezve!"}, {status: 401});
    }
    let playlistPicId=null;
    if((pId && currentPlaylistPicSetting != defaultPlaylistPic) || (!pId && currentPlaylistPicSetting != getPlaylistsData().find(elem=>elem.id==pId)?.listaPic)){
      
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
    const playlistData={
      name: data.get("playlistCim"),
      creatorId: localStorage.getItem("userId"),
      playlistPicId: playlistPicId
    }
    if(!pId){
      const res = await fetch(`http://${ip}/playlists/`, {
        method:"POST",
        headers:{
          'Content-Type': 'application/json',
          'x-access-token': getAuthToken()
        },
        body: JSON.stringify(playlistData)
      });
      const resData = await res.json();
      console.log(resData.id);
    }else{
      const res = await fetch(`http://${ip}/playlists/${pId}`, {
        method:"PUT",
        headers:{
          'Content-Type': 'application/json',
          'x-access-token': getAuthToken()
        },
        body: JSON.stringify(playlistData)
      });
      const resData = await res.json();
      console.log(resData.id);
    }
    window.location.href = "/";
    return redirect("/");
  }catch(err){
    console.log(err);
  }
}