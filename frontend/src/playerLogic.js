import { getAuthToken } from "./auth";
import { getUserData, ip, isNew, musicsData, setIsNew } from "./data";

//all load things
let zenek = [];
let data = [];
let firstZenek = [];
let firstData = [];
let noRepeatList = [];
let noRepeatMusic = [];
export let preferZenek = [];
export let preferData = [];
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
export let isLoaded = false;

export function setIsOneLoop(boo){
    isOneLoop = boo;
}

export function setIsSetValue(boo){
    isSetValue = boo;
}

export function setIsLoopList(boo){
    isLoopList = boo;
}

export function setIsLoad(boo){
    isLoad = boo;
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
    firstZenek = [];
    firstData = [];

    for(const element of zeneData){ 
        data.push(element);
        const audio = new Audio(element.musicUrl);
        audio.addEventListener("pause", ()=>{
            if(audio.currentTime < audio.duration-settingData.fadeValue){
                isPlaying=false;
                changeEvent(chage => chage());
                changeEvents.forEach(change => change({ isPlaying, playingData }));
            }
        });
        audio.addEventListener("play", ()=>{isPlaying=true;changeEvent(chage => chage());changeEvents.forEach(change => change({ isPlaying, playingData }));});
        zenek.push(audio)
        firstZenek.push(audio);
        firstData.push(element);
    };
    await loadAudio(zenek[data.findIndex((e)=>e.id==id)]);
    isLoad=true;
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

async function loadVolume(){
    for(let i = 0; i<zenek.length;i++){
        zenek[i].volume = settingData.volume/100
    }
}

export function updateVolume(volume){
    settingData.volume=volume;
    loadVolume();
}

export async function setPreferById(id){
    if(preferData.some(e => e.id == id)) return;
    let element = musicsData.find(e => e.id == id) || firstData.find(e => e.id == id) || data.find(e => e.id == id);
    if(!element) return;
    const audio = new Audio(element.musicUrl);
    audio.addEventListener("pause", ()=>{
        if(audio.currentTime < audio.duration-settingData.fadeValue){
            isPlaying=false;
            changeEvent(chage => chage());
            changeEvents.forEach(change => change({ isPlaying, playingData }));
        }
    });
    audio.addEventListener("play", ()=>{isPlaying=true; changeEvent(chage => chage()); changeEvents.forEach(change => change({ isPlaying, playingData }));});
    audio.volume = settingData.volume/100
    preferZenek.push(audio);
    preferData.push(element);
    await loadAudio(preferZenek[preferData.findIndex((e)=>e.id==id)]);
    changeEvents.forEach(change => change({ isPlaying, playingData }));
    changeEvent(chage => chage());
}

export async function removePreferById(id){
    const idx = preferData.findIndex(e => e.id == id);
    if(idx > -1){
        preferData.splice(idx, 1);
        preferZenek.splice(idx, 1);
        changeEvents.forEach(change => change({ isPlaying, playingData }));
        if (changeEvent) changeEvent(chage => chage());
    }
    changeEvents.forEach(change => change({ isPlaying, playingData }));
    changeEvent(chage => chage());
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
        if(data[i].id!=playingData.id && data[data.findIndex((e)=>e.id==playingData.id)]?.id!=id || isNew){
            zenek[i].pause();
            zenek[i].load();
        }
    }
    if(isNew && isLoad){
        if(new Object(zenek) != {}){
            for(let i = 0; i<zenek.length;i++){
                zenek[i].pause();
                zenek[i].load();
            }
        }
        console.log("asd")
        await loadData(musicsData, id);
        setIsNew(false);
    }else if(isLoad){
        noRepeatList=[]
        noRepeatMusic=[]
        for(let i = 0; i < firstData.length; i++){
            zenek[i]=firstZenek[i];
            data[i]=firstData[i];
        }
    }
    await loadVolume();
    if(!(playingMusic.currentTime >= playingMusic.duration-settingData.fadeValue) && playingData?.id != data[data.findIndex((e)=>e.id==id)].id){
        playingMusic.load();
    }
    playingData=data[data.findIndex((e)=>e.id==id)];
    playingMusic=zenek[data.findIndex((e)=>e.id==id)];
    playingMusic.play();
    isPlaying=true;
    changeEvents.forEach(change => change({ isPlaying, playingData }));
    changeEvent(chage => chage());
    isLoad=true;
    //console.log(preferData, playingData, firstData, data)
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
    if(!(playingMusic.currentTime >= playingMusic.duration-settingData.fadeValue)){
        playingMusic.load();
    }else{
        playingMusic.volume=settingData.volume/100/2;
    }
    if(isOneLoop){
        playingMusic.play();
    }else if(preferData.length!=0){
        if(noRepeatList.some((e)=>e.id==playingData.id)){
            noRepeatMusic = [...noRepeatMusic.slice(0, noRepeatList.findIndex((e)=>e.id==playingData.id)), ...noRepeatMusic.slice(noRepeatList.findIndex((e)=>e.id==playingData.id) + 1)];
            noRepeatList = noRepeatList.filter((e)=>e.id!=playingData.id);
        }
        noRepeatList.push(playingData);
        noRepeatMusic.push(playingMusic);
        preferZenek[0].volume=settingData.volume/100;
        data.reverse();
        zenek.reverse();
        data.pop();
        zenek.pop();
        data.push(preferData[0]); 
        zenek.push(preferZenek[0]);
        data.reverse();
        zenek.reverse();
        playById(preferData[0].id);
        preferData.reverse();
        preferZenek.reverse();
        preferData.pop();
        preferZenek.pop();
        preferData.reverse();
        preferZenek.reverse();
    }else{
        if(playingData.id == data[data.length-1].id){
            if(isLoopList){
                isLoad=true;
                playById(firstData[0].id);
            }else{
                isPlaying=false;
            }
        }else{
            if(noRepeatList.some((e)=>e.id==playingData.id)){
                noRepeatMusic = [...noRepeatMusic.slice(0, noRepeatList.findIndex((e)=>e.id==playingData.id)), ...noRepeatMusic.slice(noRepeatList.findIndex((e)=>e.id==playingData.id) + 1)];
                noRepeatList = noRepeatList.filter((e)=>e.id!=playingData.id);
            }
            noRepeatList.push(playingData);
            noRepeatMusic.push(playingMusic);
            data.reverse();
            zenek.reverse();
            data.pop();
            zenek.pop();
            data.reverse();
            zenek.reverse();
            playById(data[data.findIndex((e)=>e.id==playingData.id)+1].id);
        }
    }
    changeEvents.forEach(change => change({ isPlaying, playingData }));
    changeEvent(chage => chage());
}

export function prevMusic(){
    isLoad=false;
    if(noRepeatList.length != 0){
        console.log(data)
        playingMusic.load();
        data.reverse();
        zenek.reverse();
        data.push(noRepeatList[noRepeatList.length-1]);
        zenek.push(noRepeatMusic[noRepeatList.length-1]);
        data.reverse();
        zenek.reverse();
        noRepeatList.pop();
        noRepeatMusic.pop();
        playById(data[data.findIndex((e)=>e.id==playingData.id)-1].id);
    }else{
        playingMusic.load();
        playingMusic.play();
    }
}


export function randomize(){
    if(!isRandomized){
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
        for(let i = 0; i < perData.length; i++){
            data[i]=perData[i];
            zenek[i]=perMusic[i];
        }
        isRandomized=true;
        console.log(data);
    }else{
        data=[];
        zenek=[];
        for(let i = 0; i<firstZenek.length;i++){
            if(!noRepeatList.includes(firstData[i])){
                data.push(firstData[i]);
                zenek.push(firstZenek[i]);
            }
        }
        console.log(data);
        isRandomized=false;
    }
}