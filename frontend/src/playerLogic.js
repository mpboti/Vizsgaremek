import { musicsData } from "./data";

let zenek = [];
let data = [];
export let playingData = {};
export let isPlaying = false;

function loadAudio(audio){
    return new Promise(resolve => {
        audio.addEventListener("canplaythrough", resolve, { once: true });
    });
};

export async function loadData(zeneData, id){ 
    isPlaying = false; 
    zenek = [];
    data = [];
    for(const element of zeneData){ 
        data.push(element);
        zenek.push(new Audio(element.musicUrl))
    };
    await loadAudio(zenek[data.findIndex((e)=>e.id==id)]);
}

let asd = new Audio()
asd.pause()

export async function playById(id){
    for(let i = 0; i<zenek.length;i++){
        zenek[i].pause();
        zenek[i].load();
    }
    if(data!=musicsData){
        await loadData(musicsData, id);
    }
    playingData=data[data.findIndex((e)=>e.id==id)];
    
        
    zenek[data.findIndex((e)=>e.id==id)].play();
    isPlaying=true;
}

export async function pauseById(id){
    zenek[data.findIndex((e)=>e.id==id)].pause();
    isPlaying=false;
}