import { useEffect, useRef, useState } from "react";
import { Form, redirect, useNavigate, useSearchParams } from "react-router-dom";
import defaultPlaylistPic from "../assets/defaultPlaylistPic.png"
import defaultProfilePic from "../assets/defaultUserPic.png";
import "../styles/adminForms.css";
import "../styles/forms.css";
import { currentPlaylistPicSetting, currentExternalLink, currentProfilePicSetting, getReports, getUserData, ip, loadData, loadPlaylists, loadReportsByUserId, logout, setCurrentPlaylistPicSetting, setCurrentExternalLink, setCurrentProfilePicSetting } from "../data";
import { getAuthToken } from "../auth";
import ReportRow from "./report-row";

export default function AdminPlaylistEdit(){
    const [searchParams] = useSearchParams();
    const userData = getUserData();
    const [playlistData, setPlaylistData] = useState(false);
    const [editingUserData, setEditingUserData] = useState(false);
    const [reportsData, setReportsData] = useState(getReports());
    const navigate = useNavigate();

    const fileOpener = useRef();
    const [img, setImg] = useState(defaultPlaylistPic);
    const [userImg, setUserImg] = useState(defaultProfilePic);
    const [urlInput, setUrlInput] = useState("");

    useEffect(()=>{
      async function loading(){
        if(searchParams.get("userId")){
          const res = await fetch(`http://${ip}/users/getuser/${searchParams.get("userId")}`,{
            headers: {
              'x-access-token': getAuthToken()
            }
          });
          const resData = await res.json();
          setEditingUserData(resData);
          if(resData.url)
            setUserImg(`http://${ip}`+resData.url);
          await loadReportsByUserId(resData.id);
          setReportsData(getReports());
        }
        if(searchParams.get("playlistId")){
          const res = await fetch(`http://${ip}/playlists/${searchParams.get("playlistId")}`,{
            headers: {
              'x-access-token': getAuthToken()
            }
          });
          const resData = await res.json();
          setPlaylistData(resData);
          if(!(resData.url.startsWith("http://") || resData.url.startsWith("https://"))){
            setImg(`http://${ip}` + resData.url);
          }else{
            setUrlInput(resData.url)
            setImg(resData.url)
            setCurrentExternalLink(resData.url);
          }
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
    if(playlistData?.listaPicId != null && playlistData.id){
      console.log(playlistData.listaPicId)
      await fetch(`http://${ip}/files/image/${playlistData.listaPicId}`, {
        method:"DELETE",
        headers:{
          'x-access-token': getAuthToken()
        }
      })
    }
    await fetch(`http://${ip}/playlists/${playlistData.id}`, {
      method:"DELETE",
      headers:{
        'Content-Type': 'application/json',
        'x-access-token': getAuthToken()
      },
      body: JSON.stringify({userId: localStorage.getItem("userId")})
    });
    loadPlaylists(userData.id);
    window.location.href = "/";
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

  function updatePage(){
    console.log(getReports());
    setReportsData(getReports());
  }

  return(
    <div className="adminFormContaner">
      <div className="musicOrPlaylistFlex keresesMenu">
        {playlistData && <button className={searchParams.get("mode")==="playlist" ? "microSelected" : "musicOrPlaylistButton"} 
        onClick={async ()=>{ navigate(`/adminPlaylistEdit?mode=playlist${editingUserData?"&userId=":""}${editingUserData?editingUserData.id:""}${playlistData?"&playlistId=":""}${playlistData?playlistData.id:""}`);}}>
          Playlist
        </button>}
        <button className={searchParams.get("mode")==="user" ? "microSelected" : "musicOrPlaylistButton"} 
        onClick={async ()=>{ navigate(`/adminPlaylistEdit?mode=user${editingUserData?"&userId=":""}${editingUserData?editingUserData.id:""}${playlistData?"&playlistId=":""}${playlistData?playlistData.id:""}`);}}>
          User
        </button>
        <button className={searchParams.get("mode")==="report" ? "microSelected" : "musicOrPlaylistButton"} 
        onClick={async ()=>{ navigate(`/adminPlaylistEdit?mode=report${editingUserData?"&userId=":""}${editingUserData?editingUserData.id:""}${playlistData?"&playlistId=":""}${playlistData?playlistData.id:""}`);}}>
          Report
        </button>
      </div>
      {playlistData && searchParams.get("mode")==="playlist" &&
      <Form method="post" className="adminForm">
        <h1>Lejátszási lista szerkesztése</h1>
          <p>
            <input type="text" name="playlistCim" placeholder="Lejátszási lista címe" defaultValue={playlistData.name} required/>
          </p>
          <p>
            <input type="text" name="playlistPic" placeholder="Lejátszási lista kép url" value={urlInput} onChange={(e)=>{openPic(true, e);setUrlInput(e.target.value);}} autoComplete="off" autoCorrect="off" spellCheck="false"/>
          </p>
          <p>
            <input ref={fileOpener} type="file" onChange={(e)=>openPic(true, e)} accept="image/*" style={{ display: "none" }}/>
            <img src={img} className="uploadAlbumCover" onClick={(e)=>openPic(false, e)}/>
          </p>
          <div>
            <button className="loginFormButton" type="submit">{"Módosítás"}</button>
            <button className="loginFormButton logoutButton" onClick={deletePlaylist} type="button">Törlés</button>
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
      {editingUserData && searchParams.get("mode")==="report" && 
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

export async function AdminPlaylistAction({request}){
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

    if(url.searchParams.get("mode")==="playlist"){

      const playlistId = url.searchParams.get("playlistId");
      const res = await fetch(`http://${ip}/playlists/${playlistId}`,{
        headers: {
          'x-access-token': getAuthToken()
        }
      });
      const playlistData = await res.json();
      console.log(playlistData);
      let playlistPicId=null;
      let externalLink=null;
      try{
          
          if(currentExternalLink && currentPlaylistPicSetting == defaultPlaylistPic){
            if(playlistData?.listaPicId != null && playlistId){
              await fetch(`http://${ip}/files/image/${playlistData.listaPicId}`, {
                method:"DELETE",
                headers:{
                  'x-access-token': getAuthToken()
                }
              });
            }
            externalLink=data.get("playlistPic")
          }else if(currentPlaylistPicSetting == defaultPlaylistPic){
            playlistPicId = playlistData.playlistPicId;
            console.log(playlistPicId)
          }else if(!currentExternalLink && currentPlaylistPicSetting != defaultPlaylistPic){
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