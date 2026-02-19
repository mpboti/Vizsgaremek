import { getAuthToken } from "./auth";
import defaultProfilePic from "./assets/defaultUserPic.png";

let data=[{
    kep:"https://i.scdn.co/image/ab67616d00001e02bf01be99811cc56b3ef90fb7",
    cim:"asszonygyilkosság",
    eloado:"csaknekedkislány",
    album:"na ná babám",
    megjelenes:2015,
    mufaj:"Rock"
},
{
    kep:"",
    cim:"song2",
    eloado:"blur",
    album:"blur",
    megjelenes:1997,
    mufaj:""
},
{
    kep: "https://i.scdn.co/image/ab67616d00001e02890ce61533a89e00ce593fcb",
    cim: "You're Gonna Go Far, Kid",
    eloado: "the offspring",
    album: "Rise and fall, rage and grace",
    megjelenes: 2008,
    mufaj:"Rock"
}
];
let userData = {
    name: "",
    email: "",
    userPic: defaultProfilePic,
    id: -1
};

const token = getAuthToken();
export let logedIn = false;

export function dataListaz(){
    return data;
}

export let currentProfilePicSetting = defaultProfilePic;
export function setCurrentProfilePicSetting(pic){
    currentProfilePicSetting = pic;
}

export function getUserData(){
    return userData 
}
async function firstLoad(){
    if(token == null || token == "EXPIRED"){
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("expiration");
        return;
    }
    const res = await fetch("http://localhost:3000/users/getuser/"+localStorage.getItem("userId"), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': token
        }
    });
    const resData = await res.json();
    let userPic = defaultProfilePic;
    if(resData.imageFileId!=null){
      const res2 = await fetch("http://localhost:3000/files/image/"+resData.imageFileId, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
        }
      });
      const resData2 = await res2.json();
      userPic = "http://localhost:3000"+resData2.url;
      console.log(userPic);
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
await firstLoad();
export function clearUserData(){
    userData = {
        name: "",
        email: "",
        userPic: defaultProfilePic,
        id: -1
    };
    logedIn = false;
}