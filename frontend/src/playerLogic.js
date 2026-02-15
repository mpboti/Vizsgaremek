let zenek = [];

function loadAudio(audio){
    return new Promise(resolve => {
        audio.addEventListener("canplaythrough", resolve, { once: true });
    });
};

export async function loadData(zeneData, id){ 
    paused = true; resetAll(); 
    zenek = []; data = []; 
    zeneData.forEach(element => { 
        data.push(element); 
        zenek.push(new Audio(element.zene)) 
    });
    await loadAudio(zenek[id]);
}
