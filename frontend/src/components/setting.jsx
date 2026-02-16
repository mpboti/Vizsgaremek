import { Form } from "react-router-dom";
import { getAuthToken } from "../auth";
import { getUserData } from "../data";
import { useState, useRef } from "react";
import defaultProfilePic from "../assets/defaultUserPic.png";
import "../styles/forms.css";


export default function Setting() {
  const userData = getUserData();
  const [fadeValue, setFadeValue] = useState(localStorage.getItem("fadeValue") || 0);
  const fileOpener = useRef();
  const [img, setImg] = useState(defaultProfilePic);
  function openPic(isFinal, e){
    if(!isFinal){
        fileOpener.current.click();
    }else{
        setImg(URL.createObjectURL(e.target.files[0]));
    }
  }
  
  function FadeChange(event) {
        const value = event.target.value;
        localStorage.setItem("fadeValue", value);
        setFadeValue(value);
  }
  return(
    <div className="settingPage">
      <Form method="post" className="settingForm">
        <h1>Beállítások</h1>
            <p>
              <input id="username" type="text" name="username" placeholder="Felhasználó név" defaultValue={userData.name} required/>
            </p>
            <p>
              <span className="rangeSpan">00:{fadeValue<10?"0"+fadeValue:fadeValue || 0}</span>
              <input id="fadeValue" type="range" min="0" max="15" defaultValue={fadeValue} className="range" onChange={FadeChange}/>
              <span className="rangeValue">00:15</span>
            </p>
            <p>
              <input id="password" type="password" name="password" placeholder="password" required/>
            </p>
            <p>
              <input id="newpassword" type="password" name="newpassword" placeholder="New password"/>
            </p>
            <div className="justFlex">
              <p>
                  <input ref={fileOpener} type="file" onChange={(e)=>openPic(true, e)} accept="image/*" style={{ display: "none" }}/>
                  <img src={img} className="uploadImageCover" onClick={(e)=>openPic(false, e)}/>
              </p>
              <div className="buttonAlign">
                <button className="loginFormButton">Mentés</button>
                <button className="loginFormButton logoutButton">Kijelentkezés</button>
              </div>
            </div>
            
      </Form>
      
    </div>
  )
}
export async function SettingLoader(){
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
    const password = data.get("password");
    const newpassword = data.get("newpassword");
    if(newpassword && newpassword.length < 6)
      throw new Response.json({message: "Az új jelszónak legalább 6 karakter hosszúnak kell lennie!"}, {status: 422});

    const response = await fetch("http://localhost:3000/files/image", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'      
      },
      body: JSON.stringify({
        email: userData.email,
        pwd: password
      })
    });
    const responseData = await response.json();
    
    let bodyData = {
      username: username,
      pwd: password,

    }
    if(!newpassword || newpassword== ""){
      
    }else{
      bodyData = {
        username: username,
        email: userData.email,
        pwd: newpassword,
        imageFileId: 
      }
    }
    
    
  }catch(err){
      console.log(err);
  }
}