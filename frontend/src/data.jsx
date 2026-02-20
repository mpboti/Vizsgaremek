import { getAuthToken } from "./auth";
import defaultProfilePic from "./assets/defaultUserPic.png";
import defaultPlaylistPic from "./assets/defaultPlaylistPic.png";

const token = getAuthToken();
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
    if(userData.id == -1) {
        // nothing to load if we don't know who the user is
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

    // check status first, avoid relying on a magic string
    if (!response.ok) {
        console.error("failed to fetch playlists", response.status, response.statusText);
        playlistsData = [];
        return;
    }

    const resData = await response.json();

    if (resData.message != "No playlists found for this user.") {
        playlistsData = resData.map(elem => ({
            id: elem.id,
            name: elem.name,
            userName: userData.name,
            listaPic: elem.playlistPicId,
        }));

        for (let i = 0; i < playlistsData.length; i++) {
            let playlistPic = defaultPlaylistPic;
            if (playlistsData[i].listaPic != null) {
                const res2 = await fetch(`http://${ip}/files/image/${playlistsData[i].listaPic}`, {
                    method: 'GET',
                    headers: {
                      'Content-Type': 'application/json',
                      'x-access-token': token
                    }
                });
                const resData2 = await res2.json();
                playlistPic = `http://${ip}` + resData2.url;
            }
            playlistsData[i].listaPic = playlistPic;
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
    name: "",
    email: "",
    userPic: defaultProfilePic,
    id: -1
};
export function getUserData(){
    return userData 
}
export async function loadData(){
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
    if(resData.imageFileId!=null){
      const res2 = await fetch(`http://${ip}/files/image/${resData.imageFileId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
        }
      });
      const resData2 = await res2.json();
      userPic = `http://${ip}`+resData2.url;
    }
    
    if(resData.username && resData.email && resData.id){
        setUserData(resData.username, resData.email, userPic, parseInt(resData.id));
    }
    
}
export function setUserData(name, email, userPic, id){
    if(userPic == "")
        userPic = defaultProfilePic;
    userData = {
        name: name,
        email: email,
        userPic: userPic,
        id: id
    };
    logedIn = true;
}

export function clearUserData(){
    userData = {
        name: "",
        email: "",
        userPic: defaultProfilePic,
        id: -1
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