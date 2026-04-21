import { getAuthToken } from "./auth";
import { getUserData, ip, isNew, logedIn, musicsData, setIsNew } from "./data";

//all load things
export let firstLoad = true;
export let data = [];
let firstData = [];
let noRepeatList = [];
export let preferData = [];
let isLoad = true
export let playingData = {};
export let playingMusic = new Audio();
export let isPlaying = false;
export let isSetValue = false;
export let isUploadPlay = false;
export let settingData = {};
export let isOneLoop = localStorage.getItem("isOneLoop")==="true" || false;
export let isLoopList = localStorage.getItem("isLoopList")==="true" || false;
export let isRandomized = localStorage.getItem("isRandomized")==="true" || false;
export let firstPlay = true;
export let playingPlaylistId = null;
export let preferPlaylists = [];
export let musicVolume = 50;
export let selectingPlaylistId = null;
export let selectingMusicId = null;
export let reportingId = null;
export let notLoggedInVolume=50;
export function setNotLoggedInVolume(vol){
    notLoggedInVolume=vol;
}
playingMusic.addEventListener("pause", ()=>{
    if(playingMusic.currentTime < playingMusic.duration-settingData.fadeValue){
        isPlaying=false;
        changeEvent(chage => chage());
        changeEvents.forEach(change => change());
    }
});
playingMusic.addEventListener("play", ()=>{isPlaying=true;changeEvent(chage => chage());changeEvents.forEach(change => change());});
export async function loadPlayingMusic(){
    playingMusic.pause();
    playingMusic.currentTime=0;
}

export async function setMusicVolume(boo){
    musicVolume=boo;
}

export function setIsOneLoop(boo){
    isOneLoop = boo;
    localStorage.setItem("isOneLoop", boo);
}

export function setIsSetValue(boo){
    isSetValue = boo;
}

export function setIsLoopList(boo){
    isLoopList = boo;
    localStorage.setItem("isLoopList", boo);
}

export function setIsLoad(boo){
    isLoad = boo;
}

export async function setFirstPlay(boo){
    firstPlay = boo;
}

export async function setSelectingPlaylistId(num){
    selectingPlaylistId = num;
}

export async function setSelectingMusicId(num){
    selectingMusicId = num;
}

export async function setReportingId(num){
    reportingId = num;
}

export const changeEvents = [];
export function playButtonChange(chage) {
    changeEvents.push(chage);
    return () => {
        const index = changeEvents.indexOf(chage);
        if (index > -1) changeEvents.splice(index, 1);
    };
}

export let changeEvent = undefined;
export function playerChange(chage) {
    changeEvent=chage;
    return () => {
        changeEvent = undefined;
    }
}

async function savePlaylistIdToSettings(playlistId){
    if(playlistId==null){
        await fetch(`http://${ip}/settings/removePlaylist/${getUserData().id}`,{
            method:"PUT",
            headers:{
                'x-access-token': getAuthToken()
            }
        });
    }else{
        await fetch(`http://${ip}/settings/${getUserData().id}`,{
            method:"PUT",
            headers:{
                'Content-Type': 'application/json',
                'x-access-token': getAuthToken()
            },
            body: JSON.stringify({lastPlaylistId: playlistId})
        });
    }
    
}

function loadAudio(audio){
    return new Promise(resolve => {
        audio.addEventListener("canplaythrough", resolve, { once: true });
        if(!audio.currentTime)
            audio.currentTime=0;
    });
    
};

async function loadData(zeneData, id){ 
    isPlaying = false; 
    data = [];
    firstData = [];

    for(const element of zeneData){
        data.push(element);
        if(element.id==id){
            playingMusic.src=element.musicUrl;
            playingData=element;
        }
        if(element.playlistId){
            playingPlaylistId=element.playlistId;
            if(logedIn){
                await savePlaylistIdToSettings(element.playlistId);
                await loadSettings();
            }
        }else{
            playingPlaylistId=null;
            await savePlaylistIdToSettings(null);
            await loadSettings();
        }
        firstData.push(element);
    };
    if(!data.some((e)=>e.id==id)){
        const res = await fetch(`http://${ip}/musics/${id}`)
        const resData = await res.json();
        data = [resData];
    }
    isLoad=true;
    if(isRandomized){
        isRandomized=false;
        randomize();
    }
}
let switching2 = false;
export async function loadDataByPlaylistId(id){
    if (switching2) return;
    switching2 = true;
    try {
        playingMusic.pause();
        playingMusic.currentTime = 0;
        isPlaying = false;
        data = [];
        firstData = [];

        let zeneData = [];
        try{
            const res = await fetch(`http://${ip}/musics/byplaylistid/${id}`);
            const resData = await res.json(res);
            for(const elem of resData){
                if(!zeneData.includes(elem.musicId)){
                    elem.musicUrl=`http://${ip}`+elem.musicUrl;
                    zeneData.push(elem);
                }
            }
        }catch(err){
            console.log(err);
        }
        const lattukMar = new Set();
        zeneData = zeneData.filter(obj => {
            const dupla = lattukMar.has(obj.id);
            lattukMar.add(obj.id);
            return !dupla;
        });
        for(const element of zeneData){ 
            data.push(element);
            firstData.push(element);
        };
        await loadVolume();
        playingPlaylistId = id;
        if(logedIn)
            savePlaylistIdToSettings(id);
        else{
            settingData.lastPlaylistId=id;
            settingData.fadeValue=0;
        }
        isLoad=false;
    }finally {
        if(isRandomized){
            isRandomized=false;
            randomize();
        }
        switching2 = false;
        changeEvent(chage => chage());
    }
}

export async function loadSettings(){
    try{
        const res = await fetch(`http://${ip}/settings/${getUserData().id}`,{
            headers:{
                'x-access-token': getAuthToken()
            }
        })
        const resData = await res.json();
        if(resData.lastPlaylistId != null){
            playingPlaylistId = resData.lastPlaylistId;
        }else{
            playingPlaylistId = null;
        }
        settingData = resData;
        if(!resData.fadeValue)
            settingData.fadeValue=0;
        if(!resData.volume && resData.volume!=0){
            settingData.volume=50;
        }
        musicVolume=settingData.volume;
    }catch(err){
        console.log(err);
    }
}
if(logedIn)
    await loadSettings();
export async function loadLastMusic(){
    if(settingData.lastPlaylistId){
        playingPlaylistId = settingData.lastPlaylistId;
    }
    if(settingData.lastMusicId){
        const res = await fetch(`http://${ip}/musics/${settingData.lastMusicId}`)
        const resData = await res.json();
        if(resData.imageUrl!=null){
            if(!(resData.imageUrl.startsWith("http://") || resData.imageUrl.startsWith("https://"))){
                resData.imageUrl = `http://${ip}${resData.imageUrl}`;
            }
        }
        resData.musicUrl = `http://${ip}${resData.musicUrl}`;
        const audio = new Audio(resData.musicUrl);
        playingData = resData;
        playingMusic = audio;
        await loadVolume();
        if(changeEvent)
            changeEvent(chage => chage());
        isUploadPlay=false;
    }
}
await loadLastMusic();


async function loadVolume(){
    playingMusic.volume = musicVolume/100;
}

export async function updateVolume(volume){
    settingData.volume=volume;
    musicVolume=volume;
    loadVolume();
}

export async function setPreferById(id){
    if(preferData.some(e => e.id == id)) return;
    let element = musicsData.find(e => e.id == id) || firstData.find(e => e.id == id) || data.find(e => e.id == id);
    if(!element) return;
    const audio = new Audio(element.musicUrl);
    audio.volume = musicVolume/100
    preferData.push(element);
    await loadAudio(audio);
    changeEvents.forEach(change => change());
    changeEvent(chage => chage());
}

export async function removePreferById(id){
    const idx = preferData.findIndex(e => e.id == id);
    if(idx > -1){
        preferData.splice(idx, 1);
        changeEvents.forEach(change => change());
        if (changeEvent) changeEvent(chage => chage());
    }
    changeEvents.forEach(change => change());
    changeEvent(chage => chage());
}

export async function setPlaylistPreferId(id){
    if(preferPlaylists.includes(id)) return;
    preferPlaylists.push(id);
    changeEvents.forEach(change => change());
    changeEvent(chage => chage());
}

export async function removePlaylistPreferId(id){
    const idx = preferPlaylists.findIndex(e => e == id);
    if(idx > -1){
        preferPlaylists.splice(idx, 1);
        changeEvents.forEach(change => change());
        if (changeEvent) changeEvent(chage => chage());
    }
    changeEvents.forEach(change => change());
    changeEvent(chage => chage());
}

//the functions of the player
export function uploadPlay(mus){
    playingMusic.pause();
    playingMusic.currentTime = 0;
    if(mus!=null){
        playingMusic.src=mus.src;
        playingData={
            id: -1,
            name: "unknown",
            artistName: "unknown",
            musicUrl: mus.src,
        };
    }
    playingMusic.volume=musicVolume/100
    playingMusic.play();
    isPlaying=true;
    isUploadPlay=true;
    changeEvent(chage => chage());
}

export function uploadPause(){
    playingMusic.pause();
    isPlaying=false;
    isUploadPlay=true;
    changeEvent(chage => chage());
}

let isPlayingSlider = false;
export function sliderPause(){
    playingMusic.pause();
    if(isPlaying)
        isPlayingSlider=true;
    else
        isPlayingSlider=false;
    changeEvents.forEach(change => change());
    changeEvent(chage => chage());
}

export function sliderPlay(){
    if(isPlayingSlider && playingMusic.currentTime != playingMusic.duration)
        playingMusic.play();
    changeEvents.forEach(change => change());
    changeEvent(chage => chage());
}

export async function playById(id){
    if(logedIn && !isUploadPlay){
        firstLoad=false;
        await fetch(`http://${ip}/settings/${getUserData().id}`,{
            method:"PUT",
            headers:{
                'Content-Type': 'application/json',
                'x-access-token': getAuthToken()
            },
            body: JSON.stringify({lastMusicId: id})
        });
        if(musicVolume==0){
            await loadSettings();
            settingData.volume=0;
            musicVolume=0;
        }else{
            await loadSettings();
        }
    }
    isUploadPlay=false;
    if(firstPlay){
        if(settingData.lastPlaylistId){
            await loadDataByPlaylistId(settingData.lastPlaylistId);
            await loadVolume();
        }else{
            await loadData(musicsData, id);
            await loadVolume();
        }
        firstPlay=false;
    }else if(isNew && isLoad){
        console.log("asd");
        await loadData(musicsData, id);
        await loadVolume();
        await loadAudio(playingMusic);
        
        setIsNew(false);
    }else if(isLoad){
        noRepeatList=[]
        for(let i = 0; i < firstData.length; i++){
            data[i]=firstData[i];
        }
    }
    if(!logedIn && !isUploadPlay){
        settingData.lastMusicId=true;
    }
    if(!(playingMusic.currentTime >= playingMusic.duration-settingData.fadeValue) && playingData?.id != data[data.findIndex((e)=>e.id==id)].id){
        playingMusic.pause();
        playingMusic.currentTime = 0;
    }
    if(playingMusic.src !== new Audio(data[data.findIndex((e)=>e.id==id)].musicUrl).src){
        playingData=await data[data.findIndex((e)=>e.id==id)];
        playingMusic.src=await data[data.findIndex((e)=>e.id==id)].musicUrl;
    }
    playingMusic.play();
    isPlaying=true;
    
    changeEvents.forEach(change => change());
    changeEvent(chage => chage());
    isLoad=true;
}

export async function pauseById(){
    isUploadPlay=false;
    playingMusic.pause();
    isPlaying=false;
    changeEvents.forEach(change => change());
    changeEvent(chage => chage());
}
export let isFading = false;
let switching = false;
let audioContext = new (window.AudioContext || window.webkitAudioContext)();
let currentSource = null;
let gainNode = null;
let fadingTime = 0;
let fadingMusicUrl = null;
export async function nextMusic(){
    if (switching) return;
    switching = true;
    try {
        isLoad=false;
        if(!(playingMusic.currentTime >= playingMusic.duration-settingData.fadeValue)){
            playingMusic.pause();
            playingMusic.currentTime = 0;
        }else{
            fadingTime = playingMusic.currentTime;
            fadingMusicUrl = playingData.musicUrl;
            playingMusic.pause();
            playingMusic.currentTime = 0;
            playingMusic.volume=musicVolume/100;
        }
        if(isOneLoop){
            playingMusic.play();
            changeEvents.forEach(change => change());
            changeEvent(chage => chage());
        }else if(playingPlaylistId==null && preferPlaylists.length != 0){
            await loadDataByPlaylistId(preferPlaylists[0]);
            await playById(data[0].id);
            preferPlaylists.shift();
        }else if(preferData.length!=0){
            if(noRepeatList.some((e)=>e.id==playingData.id)){
                noRepeatList = noRepeatList.filter((e)=>e.id!=playingData.id);
            }
            noRepeatList.push(playingData);
            data.shift();
            data.unshift(preferData[0]); 
            await playById(preferData[0].id);
            preferData.shift();
        }else{
            if(playingData.id == data[data.length-1].id){
                if(preferPlaylists.length != 0){
                    await loadDataByPlaylistId(preferPlaylists[0]);
                    await playById(data[0].id);
                    preferPlaylists.shift();
                }else if(isLoopList){
                    isLoad=true;
                    await playById(firstData[0].id);
                    noRepeatList=[];
                    if(isRandomized){
                        isRandomized=false
                        randomize();
                    }
                }else{
                    isPlaying=false;
                    playingMusic.addEventListener("ended", ()=> {playingMusic.pause(); playingMusic.currentTime = 0; isPlaying=false });
                    changeEvents.forEach(change => change());
                    changeEvent(chage => chage());
                }
                
            }else{
                if(noRepeatList.some((e)=>e.id==playingData.id)){
                    noRepeatList = noRepeatList.filter((e)=>e.id!=playingData.id);
                }else{
                    noRepeatList.push(playingData);
                    data.shift();
                    await playById(data[data.findIndex((e)=>e.id==playingData.id)+1].id);
                }
            }
        }
        if(settingData.fadeValue > 0 && fadingMusicUrl != null){
            isFading = true;
            if (currentSource != null) {
                currentSource.stop();
            }
            currentSource = audioContext.createBufferSource();
            gainNode = audioContext.createGain();
            currentSource.connect(gainNode);
            gainNode.connect(audioContext.destination);
            // Betöltés és lejátszás Web Audio-val
            const response = await fetch(fadingMusicUrl);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            currentSource.buffer = audioBuffer;
            gainNode.gain.value = musicVolume/100/3;
            currentSource.start(0, fadingTime);
            
            currentSource.onended = () => {
                currentSource.stop();
                isFading = false;
                changeEvent(chage => chage());
            };
            fadingMusicUrl = null;
        }
    } finally {
        switching = false;
        changeEvent(chage => chage());
    }
}

export function prevMusic(){
    isLoad=false;
    if(noRepeatList.length != 0){
        playingMusic.pause();
        playingMusic.currentTime = 0;
        data.unshift(noRepeatList[noRepeatList.length-1]);
        noRepeatList.pop();
        playById(data[data.findIndex((e)=>e.id==playingData.id)-1].id);
    }else{
        playingMusic.pause();
        playingMusic.currentTime = 0;
        isPlaying=true;
        playingMusic.play();
        changeEvents.forEach(change => change());
        changeEvent(chage => chage());
    }
}


export function randomize(){
    if(!isRandomized){
        const perData = [data[0]];
        for (let i = 1; i < data.length; i++) {
            let rnd = Math.floor(Math.random() * (data.length));
            while(perData.includes(data[rnd])){
                rnd = Math.floor(Math.random() * (data.length));
            }
            perData.push(data[rnd]);
        }
        for(let i = 0; i < perData.length; i++){
            data[i]=perData[i];
        }
        isRandomized=true;
    }else{
        data=[];
        for(let i = 0; i<firstData.length;i++){
            if(!noRepeatList.includes(firstData[i])){
                data.push(firstData[i]);
            }
        }
        isRandomized=false;
    }
    localStorage.setItem("isRandomized", isRandomized);
}