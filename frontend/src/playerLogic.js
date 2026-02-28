import { getAuthToken } from "./auth";
import { getUserData, ip, isNew, musicsData, setIsNew } from "./data";

//all load things
let zenek = [];
let data = [];
let isLoad = true
export let playingData = {};
export let playingMusic = new Audio();
export let isPlaying = false;
export let isSetValue = false;
export let isUploadPlay = false;
export let settingData = {};
export let isOneLoop = false;
export let isLoopList = false;
export let isRandomized = false;

export function setIsOneLoop(boo){
    isOneLoop=boo;
}

export function setIsSetValue(boo){
    isSetValue = boo;
}

export function setIsLoopList(boo){
    isLoopList = boo;
}

const changeEvents = [];
export function playButtonChange(chage) {
    changeEvents.push(chage);
    return () => {
        const index = changeEvents.indexOf(chage);
        if (index > -1) changeEvents.splice(index, 1);
    };
}

let changeEvent = undefined;
export function playerChange(chage) {
    changeEvent=chage;
    return () => {
        changeEvent = undefined;
    }
}

function loadAudio(audio){
    return new Promise(resolve => {
        audio.addEventListener("canplaythrough", resolve, { once: true });
    });
};

async function loadData(zeneData, id){ 
    isPlaying = false; 
    zenek = [];
    data = [];

    for(const element of zeneData){ 
        data.push(element);
        const audio = new Audio(element.musicUrl);
        audio.addEventListener("pause", ()=>{isPlaying=false;changeEvent(chage => chage());changeEvents.forEach(change => change({ isPlaying, playingData }));});
        audio.addEventListener("play", ()=>{isPlaying=true;changeEvent(chage => chage());changeEvents.forEach(change => change({ isPlaying, playingData }));});
        zenek.push(audio)
    };
    await loadAudio(zenek[data.findIndex((e)=>e.id==id)]);
}

export async function loadSettings(){
    const res = await fetch(`http://${ip}/settings/${getUserData().id}`,{
        headers:{
            'x-access-token': getAuthToken()
        }
    })
    const resData = await res.json();
    settingData = resData;
    console.log(resData)
    if(!resData.fadeValue)
        settingData.fadeValue=0;
    if(!resData.volume)
        settingData.volume=50;
}
await loadSettings();

function loadVolume(){
    
    for(let i = 0; i<zenek.length;i++){
        zenek[i].volume = settingData.volume/100
    }
}

export function updateVolume(volume){
    settingData.volume=volume;
    loadVolume();
}

//the functions of the player

export function uploadPlay(mus){
    for(let i = 0; i<zenek.length;i++){
        zenek[i].pause();
        zenek[i].load();
        
    }
    if(mus!=null)
        playingMusic=mus;
    playingMusic.volume=settingData.volume/100
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
    changeEvents.forEach(change => change({ isPlaying, playingData }));
    changeEvent(chage => chage());
}
export function sliderPlay(){
    if(isPlayingSlider)
        playingMusic.play();
    changeEvents.forEach(change => change({ isPlaying, playingData }));
    changeEvent(chage => chage());
}
export async function playById(id){
    if(isUploadPlay){
        playingMusic.pause();
        playingMusic.load();
    }
    isUploadPlay=false;
    for(let i = 0; i<zenek.length;i++){
        if(data[data.findIndex((e)=>e.id==playingData.id)]?.position!=i+1 || isNew){
            zenek[i].pause();
            zenek[i].load();
        }
        
    }
    if(isNew && isLoad){
        console.log("asd")
        await loadData(musicsData, id);
        loadVolume();
    }
    for(let i = 0; i<zenek.length;i++){
        if(data[data.findIndex((e)=>e.id==id)].position!=i+1){
            zenek[i].pause();
            zenek[i].load();
        }
    }
    playingData=data[data.findIndex((e)=>e.id==id)];
    playingMusic=zenek[data.findIndex((e)=>e.id==id)];
    playingMusic.play();
    isPlaying=true;
    setIsNew(false);
    changeEvents.forEach(change => change({ isPlaying, playingData }));
    changeEvent(chage => chage());
    isLoad=true;
}

export async function pauseById(id){
    isUploadPlay=false;
    zenek[data.findIndex((e)=>e.id==id)].pause();
    isPlaying=false;
    changeEvents.forEach(change => change({ isPlaying, playingData }));
    changeEvent(chage => chage());
}

export function nextMusic(){
    isLoad=false;
    if(isOneLoop){
        playingMusic.load();
        playingMusic.play();
    }else{
        if(playingData.id == data[data.length-1].id){
            if(isLoopList){
                playingMusic.load();
                playById(data[0].id);
            }else{
                playingMusic.load();
            }
        }else{
            playById(data[data.findIndex((e)=>e.id==playingData.id)+1].id)
        }
    }
}

export function prevMusic(){
    isLoad=false;
    if(data[0].id != playingData.id){
        playingMusic.load()
        playById(data[data.findIndex((e)=>e.id==playingData.id)-1].id);
    }
}


let beforeRandomData=[];
let beforeRandomMusic=[];
export function randomize(){
    if(!isRandomized){
        beforeRandomData=[];
        beforeRandomMusic=[];
        for(let i = 0; i<zenek.length;i++){
            beforeRandomData.push(data[i]);
            beforeRandomMusic.push(zenek[i]);
        }
        data[0]=playingData;
        zenek[0]=playingMusic;
        const perData = [playingData];
        const perMusic = [playingMusic];
        for (let i = 1; i < data.length; i++) {
            let rnd = Math.floor(Math.random() * (data.length));
            while(perMusic.includes(zenek[rnd])){
                
                rnd = Math.floor(Math.random() * (data.length));
            }
            perData.push(data[rnd]);
            perMusic.push(zenek[rnd]);
        }
        console.log(perData);
        for(let i = 0; i < perData.length; i++){
            data[i]=perData[i];
            zenek[i]=perMusic[i];
        }
        console.log(data)
        isRandomized=true;
    }else{
        data=[];
        zenek=[];
        for(let i = 0; i<beforeRandomMusic.length;i++){
            data.push(beforeRandomData[i]);
            zenek.push(beforeRandomMusic[i]);
        }
        console.log(data)
        isRandomized=false;
    }
}