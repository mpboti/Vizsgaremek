import { getAuthToken } from "./auth";
import defaultProfilePic from "./assets/defaultUserPic.png";
import defaultPlaylistPic from "./assets/defaultPlaylistPic.png";
import defaultMusicPic from "./assets/defaultMusicPic.png";

export let isItunes = false;
export let isNew = true;
export let logedIn = false;
export const ip = "localhost:3000"

export function setIsNew(boo){
    isNew=boo;
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
  playlistsData=[];
  window.location.href = "/";
  //navigate("/");
}

//playlists betöltés és egyéb dolgai
export let currentPlaylistPicSetting = defaultPlaylistPic;
export function setCurrentPlaylistPicSetting(pic){
    currentPlaylistPicSetting = pic;
}

let playlistsData=[];
export async function loadPlaylists(userId){
    currentPlaylistPicSetting=defaultPlaylistPic;
    playlistsData = [];
    if(userId == -1) {
        playlistsData = [];
        return;
    }

    const response = await fetch(`http://${ip}/playlists/byuserid/${userId}`, {
        method: 'GET',
        headers: {
            'x-access-token': getAuthToken()
        }
    });
    const resData = await response.json();
    if (response.status != 300) {
        playlistsData = resData.map(elem => ({
            id: elem.id,
            name: elem.name,
            userName: elem.username,
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

let loadedPlaylistData={
    id: null,
    name:"",
    userName: "",
    listaPicId: null,
    listaPic: defaultPlaylistPic,
    musics: [],
    mufajok: ""
}

export async function loadPlaylist(playlistId){
    const res = await fetch(`http://${ip}/playlists/${playlistId}`);
    const resData = await res.json();
    loadedPlaylistData={
        id: playlistId,
        ownerId:resData.ownerId,
        name: resData.name,
        userName: resData.username,
        listaPicId: resData.playlistPicId,
        listaPic: resData?.url?`http://${ip}` + resData.url:defaultPlaylistPic,
        musics: resData.musics.sort((a, b) => a.position - b.position),
        mufajok: ""
    }
}

export function getPlaylistData(){
    return loadedPlaylistData
}

//atribútomok mentése
export let currentAlbumPicUrl = null;
export function setCurrentAlbumPicUrl(url){
    currentAlbumPicUrl = url;
}
export let currentAlbumPicSetting = defaultMusicPic;
export function setCurrentAlbumPicSetting(pic){
    currentAlbumPicSetting = pic;
}
export let uploadedMusicFile = null;
export function setUploadedMusicFile(file){
    uploadedMusicFile = file;
}

//legödülő menük betöltése
export let artistOptions = {ids: [], artists:[]};
export async function loadArtistOptions(){
    artistOptions = {ids: [], artists:[]};
    try{
        const res = await fetch(`http://${ip}/artists`);
        const resData = await res.json();
        for(const elem of resData){
            if(!artistOptions.ids.includes(elem.id)){
                artistOptions.artists.push(elem.name)
                artistOptions.ids.push(elem.id);
            }
        } 
    }catch(err){
        console.log(err)
    }
}

export let albumOptions = {ids: [], albums:[]};
export async function loadAlbumOptions(){
    albumOptions = {ids: [], albums:[]};
    try{
        const res = await fetch(`http://${ip}/albums`);
        const resData = await res.json();
        for(const elem of resData){
            if(!albumOptions.ids.includes(elem.id)){
                albumOptions.albums.push(elem.name)
                albumOptions.ids.push(elem.id);
            }
        } 
    }catch(err){
        console.log(err)
    }
}

export let mufajOptions = [];
export async function loadMufajOptions(){
    mufajOptions = [];
    try{
        const res = await fetch(`http://${ip}/musics`);
        const resData = await res.json();
        for(const elem of resData){
            if(!mufajOptions.includes(elem.mufaj))
                mufajOptions.push(elem.mufaj);
        }
    }catch(err){
        console.log(err)
    }
}

export let playlistOptions = {ids: [], playlists:[]};
export async function loadPlaylistOptions(){
    playlistOptions = {ids: [], playlists:[]};
    try{
        const res = await fetch(`http://${ip}/playlists/byuserid/${userData.id}`,{
            method: "GET",
            headers: {
            'x-access-token': getAuthToken()
            }
        });
        const resData = await res.json();
        for(const elem of resData){
            if(!playlistOptions.ids.includes(elem.id)){
                playlistOptions.playlists.push(elem.name);
                playlistOptions.ids.push(elem.id);
            }
        } 
    }catch(err){
        console.log(err)
    }
}

export let checkedPlaylistOptions = {ids: [], playlists:[]};
export async function loadCheckedPlaylists(userId, musicId){
    checkedPlaylistOptions = {ids: [], playlists:[]};
    try{
        const playlists = await fetch(`http://${ip}/playlists/getPlaylistsByIds`,{
            method:"POST",
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': getAuthToken()
            },
            body: JSON.stringify({userId: userId, musicId: musicId})
        })
        const resData = await playlists.json();
        for(const elem of resData.playlists){
            if(!checkedPlaylistOptions.ids.includes(elem.id)){
                checkedPlaylistOptions.playlists.push(elem.name);
                checkedPlaylistOptions.ids.push(elem.id);
            }
        }
    }catch(err){
        console.log(err)
    }
}

//a zenék betöltése
export let musicsData = [];
export function getMusicsData(){
    return musicsData;
}

export let currentMusicData = {};
export async function loadCurrentMusicData(id){
    const res = await fetch(`http://${ip}/musics/${id}`)
    const resData = await res.json();
    currentMusicData = resData;
}
export async function loadCurrentITunesMusicData(text, id){
    await searchITunes(text);
    currentMusicData=musicsData.find((e)=>e.id==id);
    currentAlbumPicUrl=currentMusicData.imageUrl;
}

export async function loadMusicsByPlaylistId(playlistId){
    musicsData=[];
    try{
        const res = await fetch(`http://${ip}/musics/byplaylistid/${playlistId}`);
        const resData = await res.json(res);
        for(const elem of resData){
            if(!musicsData.includes(elem.musicId)){
                elem.musicUrl=`http://${ip}`+elem.musicUrl;
                musicsData.push(elem);
            }
        }
        isItunes=false;
    }catch(err){
        console.log(err);
    }
    const lattukMar = new Set();
    musicsData = musicsData.filter(obj => {
      const dupla = lattukMar.has(obj.id);
      lattukMar.add(obj.id);
      return !dupla;
    });
    isNew=true;
}

export async function loadMusicsByUserId(userId){
    if(userId==-1)
        return;
    musicsData=[];
    try{
        const res = await fetch(`http://${ip}/musics/byuserid/${userId}`);
        const resData = await res.json(res);
        let i=0
        for(const elem of resData){
            if(!musicsData.includes(elem.musicId)){
                i++
                elem.musicUrl=`http://${ip}`+elem.musicUrl;
                musicsData.push({...elem, position: i});
            }
        }
        isItunes=false;
    }catch(err){
        console.log(err);
    }
    const lattukMar = new Set();
    musicsData = musicsData.filter(obj => {
      const dupla = lattukMar.has(obj.id);
      lattukMar.add(obj.id);
      return !dupla;
    });
    isNew=true;
}

//keresés metódusok
export async function searchITunes(text){
  try {
    const response = await fetch(`https://itunes.apple.com/search?term=${text}&media=music&limit=50`);
    const resData = await response.json();
    musicsData=[];
    console.log(resData)
    let i = -resData.results.length;
    for(const element of resData.results){
      musicsData.push({
        id: i++,
        position: i+resData.results.length,
        uploaderId: userData.id,
        imageUrl: element.artworkUrl100,
        name: element.trackName,
        artistName: element.artistName,
        albumName: element.collectionName?element.collectionName:"-",
        releaseDate: element.releaseDate?element.releaseDate.split("-")[0]:"-",
        mufaj: element.primaryGenreName,
        musicUrl: element.previewUrl
      })
    };
    isItunes=true;
  }catch(e){
    console.log(e.message);
  }
  console.log(musicsData)
  isNew=true;
}

export async function searchMusics(text, endpoint) {
    musicsData=[];
    try{
        const response = await fetch(`http://${ip}/search/${endpoint}?name=${text}`);
        const resData = await response.json();
        let i=0
        for(const elem of resData){
            if(!musicsData.includes(elem.musicId)){
                i++
                elem.musicUrl=`http://${ip}`+elem.musicUrl;
                musicsData.push({...elem, position: i});
            }
        };
        isItunes=false;
    }catch(err){
        console.log(err);
        musicsData=[];
    }
    const lattukMar = new Set();
    musicsData = musicsData.filter(obj => {
      const dupla = lattukMar.has(obj.id);
      lattukMar.add(obj.id);
      return !dupla;
    });
    isNew=true;
}

export async function searchPlaylists(text, endpoint){
    playlistsData = [];
    try{
        const response = await fetch(`http://${ip}/search/${endpoint}?name=${text}`);
        const resData = await response.json();
        playlistsData = resData.map(elem => ({
            id: elem.id,
            name: elem.name,
            userName: elem.username,
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
        isItunes=false;
    }catch(err){
        playlistsData = [];
        console.log(err);
    }
    const lattukMar = new Set();
    playlistsData = playlistsData.filter(obj => {
      const dupla = lattukMar.has(obj.id);
      lattukMar.add(obj.id);
      return !dupla;
    });
}


await loadData();
await loadPlaylists(userData.id);