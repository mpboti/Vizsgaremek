import { Form, redirect } from "react-router-dom";
import { getAuthToken } from "../auth";
import { clearUserData, currentProfilePicSetting, getUserData, setCurrentProfilePicSetting } from "../data";
import { useState, useRef } from "react";
import defaultProfilePic from "../assets/defaultUserPic.png";
import "../styles/forms.css";



export default function Setting() {
  const userData = getUserData();
  const [fadeValue, setFadeValue] = useState(localStorage.getItem("fadeValue") || 0);
  const fileOpener = useRef();
  const [img, setImg] = useState(userData.userPic);
  function openPic(isFinal, e){
    if(!isFinal){
        fileOpener.current.click();
    }else{
        setImg(URL.createObjectURL(e.target.files[0]));
        setCurrentProfilePicSetting(e.target.files[0]);
    }
  }
  
  function FadeChange(event) {
        const value = event.target.value;
        localStorage.setItem("fadeValue", value);
        setFadeValue(value);
  }

  function logout(){
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("expiration");
    clearUserData();
    window.location.href = "/";
  }

  return(
    <div className="settingPage">
      <Form method="post" className="settingForm">
        <h1>Beállítások</h1>
            <p>
              <input id="username" type="text" name="username" placeholder="Felhasználó név" defaultValue={userData.name} required/>
            </p>
            <div className="rangeFlex">
              <p className="rangeCim">Zenék közti átfedés:</p>
              <p className="rangeP">
                <span className="rangeSpan">00:{fadeValue<10?"0"+fadeValue:fadeValue || 0}</span>
                <input id="fadeValue" type="range" min="0" max="15" defaultValue={fadeValue} className="range" onChange={FadeChange}/>
                <span className="rangeValue">00:15</span>
              </p>
            </div>
            <p>
              <input id="email" type="email" name="email" placeholder="Email" defaultValue={userData.email} required/>
            </p>
            <p>
              <input id="password" type="password" name="password" placeholder="password"/>
            </p>
            <p>
              <input id="newpassword" type="password" name="newpassword" placeholder="New password"/>
            </p>
            <div className="justFlex">
              <div className="kepAlign">
                  <input ref={fileOpener} type="file" name="file" id="file" onChange={(e)=>openPic(true, e)} accept="image/*" style={{ display: "none" }}/>
                  <img src={img} className="uploadImageCover" onClick={(e)=>openPic(false, e)}/>
              </div>
              <div className="buttonAlign">
                <button className="loginFormButton">Mentés</button>
                <button className="loginFormButton logoutButton" onClick={logout}>Kijelentkezés</button>
              </div>
            </div>
      </Form>
    </div>
  )
}

export async function SettingAction({request}){
  
  try{
    const token = getAuthToken();
    if(!token || token == "EXPIRED"){
      throw new Response.json({message: "Nem vagy bejelentkezve!"}, {status: 401});
    }
    const userData = getUserData();
    if(userData.id == -1){
      throw new Response.json({message: "Nem vagy bejelentkezve!"}, {status: 401});
    }
    const data = await request.formData();
    const username = data.get("username");
    const email = data.get("email");
    const password = data.get("password");
    const newpassword = data.get("newpassword");

    let bodyData = {};
    if(newpassword && newpassword!=password){
      
      const validateRes = await fetch("http://localhost:3000/users/passcheck", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': getAuthToken()
        },
        body: JSON.stringify({userid: userData.id, pwd: password})
      });
      const validateData = await validateRes.json();
      if(!validateData.samePass){
        throw new Response.json({message: "Hibás jelszó!"}, {status: 422});
      }
      bodyData = {...bodyData, pwd: newpassword}
    }
    if(username != userData.name)
      bodyData = {...bodyData, username: username}
    if(email != userData.email)
      bodyData = {...bodyData, email: email}
    if(currentProfilePicSetting != defaultProfilePic){
      console.log(currentProfilePicSetting);
      console.log(currentProfilePicSetting instanceof File);
      const formData = new FormData();
      formData.append("file", currentProfilePicSetting);
      formData.append("userId", userData.id);

      const response = await fetch("http://localhost:3000/files/image", {
        method: 'POST',
        body: formData
      });
      const responseData = await response.json();
      bodyData = {...bodyData, imageFileId: responseData.id}
    }
    if(Object.keys(bodyData).length > 0){
      const res = await fetch("http://localhost:3000/users/"+userData.id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': getAuthToken()
        },
        body: JSON.stringify(bodyData)
      });
      if(res.status == 200){
        window.location.href = "/";
      }else{
        const err = await res.json();
        throw new Response.json(err, {status: res.status});
      }
    }
    return redirect("/");
  }catch(err){
      console.log(err.message);
  }
}