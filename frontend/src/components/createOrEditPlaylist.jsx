import { useRef, useState } from "react"
import { Form, redirect, useSearchParams } from "react-router-dom";
import defaultPlaylistPic from "../assets/defaultPlaylistPic.png"
import { currentPlaylistPicSetting, getUserData, logout, setCurrentPlaylistPicSetting, ip, getPlaylistsData, loadPlaylists } from "../data";
import { getAuthToken } from "../auth";

export default function CreateOrEditPlaylist(){
  const [searchParams] = useSearchParams();
  const playlistId = searchParams.get("id");
  const playlistData = getPlaylistsData().find(elem=>elem.id==playlistId);
  
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

  async function deletePlaylist() {
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
    loadPlaylists();
    window.location.href = "/";
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
        <button className="loginFormButton" type="submit">{playlistId?"Módosítása":"Létrehoz"}</button>
        {playlistId?<button className="loginFormButton logoutButton" onClick={deletePlaylist} type="button">Törlés</button>:undefined}
      </div>
    </Form>
  )
}
// /files/image/:id
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
    if((playlistId && currentPlaylistPicSetting != defaultPlaylistPic) || (!playlistId && currentPlaylistPicSetting != playlistData?.listaPic)){
      if(playlistData?.listaPicId != null && playlistId){
        console.log(playlistData.listaPicId)
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

    const playlistUpdateData={
      name: data.get("playlistCim"),
      creatorId: localStorage.getItem("userId"),
      playlistPicId: playlistPicId
    }

    if(!playlistId){
      const res = await fetch(`http://${ip}/playlists/`, {
        method:"POST",
        headers:{
          'Content-Type': 'application/json',
          'x-access-token': getAuthToken()
        },
        body: JSON.stringify(playlistUpdateData)
      });

      const resData = await res.json();
      console.log(resData.id);
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

    await loadPlaylists();
    return redirect("/");
  }catch(err){
    console.log(err);
  }
}