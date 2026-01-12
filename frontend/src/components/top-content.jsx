import { useRef, useState } from "react"
import "../styles/top.css";
import { Link, Outlet } from "react-router-dom";
import { userDataListaz } from '../data';
import { useNavigate } from "react-router-dom";
import back from '../assets/back.png';
import home from '../assets/home.png';
import search from '../assets/search.png';

export default function TopContent() {
    const szoveg = useRef();
    const userData = userDataListaz()[0];
    
    function GetText() {
        if (0 < szoveg.current.value.length) {
            return szoveg.current.value;
        }
    }

    const navigate = useNavigate();
    function handleBack() {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate("/");
        }
    };

    function keyDown(e){
        if(e.key==="Enter"){
            navigate("/search");
        }
    }

    const [phone, setPhone] = useState(false);
    function sizer(){
        if(!phone && 800>=window.innerWidth)
            setPhone(true)
        else if(phone && 800<window.innerWidth)
            setPhone(false)
    }
    sizer()
    window.addEventListener("resize", sizer);


    return (
        <>
            <table>
                <tbody>
                    <tr>
                        <td className="backTd">
                            <button onClick={handleBack} className="topGombok"><img src={back} alt="vissza" className="topGombokImg"/></button>
                        </td>
                        <td className="home">
                            <Link to="/" className="topGombok"><img src={home} alt="home" className="topGombokImg"/></Link>
                        </td>
                        <td className="keresomezo">
                            <div className="keresokeret">
                                <Link to="/search" className="topGombok"><img src={search} alt="kereses" className="topGombokImg" /></Link>
                                <input ref={szoveg} type="text" className="searchText" onKeyDown={keyDown}></input>
                            </div>
                        </td>
                        <td className="userNameTd">
                            <p className="toltelek"></p>{phone?undefined:<p className="userName">{userData.name.length<19?userData.name:userData.name.substring(0,18)}</p>}
                        </td>
                        <td className="userPicTd">
                            <button className="topGombok">
                                {userData.userPic?<img className="userPic" src={userData.userPic}/>:<img className="userPic" src="https://cdn.rios.hu/dl/upc/2021-04/18/13365_zedohtonsyowl0va_174572780_3798245446891714_3038821565414680863_n.thumb.jpg"/>}
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <Outlet />
        </>
        
    );
}