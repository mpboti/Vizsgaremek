import { getAuthToken } from "./auth";
import defaultProfilePic from "./assets/defaultUserPic.png";
import defaultPlaylistPic from "./assets/defaultPlaylistPic.png";


export let logedIn = false;
export const ip = "localhost:3000"
/*
{
    kep:"https://i.scdn.co/image/ab67616d00001e02bf01be99811cc56b3ef90fb7",
    cim:"asszonygyilkosság",
    eloado:"csaknekedkislány",
    album:"na ná babám",
    megjelenes:2015,
    mufaj:"Rock"
},
*/

export let currentPlaylistPicSetting = defaultPlaylistPic;
export function setCurrentPlaylistPicSetting(pic){
    currentPlaylistPicSetting = pic;
}

let playlistsData=[];
export async function loadPlaylists(){
    currentPlaylistPicSetting=defaultPlaylistPic;
    if(userData.id == -1) {
        playlistsData = [];
        return;
    }

    const response = await fetch(`http://${ip}/playlists/byuserid/${userData.id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': localStorage.getItem("token")
        }
    });

    if (!response.ok) {
        console.error("failed to fetch playlists", response.status, response.statusText);
        playlistsData = [];
        return;
    }

    const resData = await response.json();
    

    if (response.status != 300) {
        playlistsData = resData.map(elem => ({
            id: elem.id,
            name: elem.name,
            userName: userData.name,
            listaPicId: elem.playlistPicId,
            listaPic: elem.url
        }));

        for (const elem of playlistsData) {
            if (elem.listaPic != null) {
                elem.listaPic = `http://${ip}` + elem.listaPic;
            }else{
                elem.listaPic = defaultPlaylistPic;
            }
        }
    } else {
        console.log(resData.message);
        playlistsData = [];
    }
}

export function getPlaylistsData(){
    return playlistsData;
}


let musicsData = [];

export function getMusics(){
    return musicsData;
}

//user data kezelés betöltés és setting
export let currentProfilePicSetting = defaultProfilePic;
export function setCurrentProfilePicSetting(pic){
    currentProfilePicSetting = pic;
}

let userData = {
    id: -1,
    name: "",
    email: "",
    userPicId: null,
    userPic: defaultProfilePic
};
export function getUserData(){
    return userData 
}
export async function loadData(){
    const token = getAuthToken();
    if(token == null || token == "EXPIRED"){
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("expiration");
        return;
    }
    const res = await fetch(`http://${ip}/users/getuser/${localStorage.getItem("userId")}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': token
        }
    });
    const resData = await res.json();
    let userPic = defaultProfilePic;
    if(resData.url!=null){
      userPic = `http://${ip}`+resData.url;
    }
    if(resData.username && resData.email && resData.id){
        setUserData(parseInt(resData.id), resData.username, resData.email, resData.imageFileId, userPic);
    }
}
export function setUserData(id, name, email, userPicId, userPic){
    userData = {
        id: id,
        name: name,
        email: email,
        userPicId: userPicId,
        userPic: userPic
    };
    logedIn = true;
}

export function clearUserData(){
    userData = {
        id: -1,
        name: "",
        email: "",
        userPicId: null,
        userPic: defaultProfilePic
    };
    logedIn = false;
}

export function logout(){
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("expiration");
  clearUserData();
  window.location.href = "/";
}

await loadData();
await loadPlaylists();