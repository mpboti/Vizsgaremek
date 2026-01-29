import { Link } from "react-router-dom";

export default function ErrorNotFound(){

    return(
        <div style={{backgroundColor:"red"}}>
            <h1 style={{color:"black"}}>404 not found page</h1>
            <h2><Link to="/" style={{color:"blue"}}>go to the home page</Link></h2>
        </div>
    );
}