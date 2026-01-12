import { Link } from "react-router-dom";
import { userDataListaz } from "../data";
import '../styles/mainPage.css';

export default function MainPage() {
    const data = userDataListaz();
    return(
        <>
            {data.map((elem, index)=>(
                <Link to={`/playlist/${elem.id}`} className="row-link" key={index}>
                    <div className="row">
                        <span className="mainKepSpan"><img src={elem.listaPic} alt="album kép" className="mainKep"/></span>
                        <span className="mainCimSpan"><p className="mainCim">{elem.listaCim}</p><p className="creator">{elem.name}</p></span>
                    </div>
                </Link>
            ))}
        </>
    )
}