import { useRef, useState } from "react"
import { Form } from "react-router-dom";
import defaultPlaylistPic from "../assets/defaultPlaylistPic.png"

export default function CreatePlaylist(){
    const fileOpener = useRef();
    const [img, setImg] = useState(defaultPlaylistPic);
    function openPic(isFinal, e){
        if(!isFinal){
            fileOpener.current.click();
        }else{
            setImg(URL.createObjectURL(e.target.files[0]));
        }
    }
    
    return(
        <Form method="post" className="authForm">
            <h1>Lejátszási lista létrehozása</h1>
            <p>
              <input type="text" name="playlistCim" placeholder="Lejátszási lista címe" required />
            </p>
            <p>
                <input ref={fileOpener} type="file" onChange={(e)=>openPic(true, e)} accept="image/*" style={{ display: "none" }}/>
                <img src={img} className="uploadAlbumCover" onClick={(e)=>openPic(false, e)}/>
            </p>
            <div>     
              <button className="loginFormButton">Létrehoz</button>
            </div>
        </Form>
    )
}

export function CreateAction(){

}