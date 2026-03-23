import "../styles/report.css";
import del from "../assets/bin.png"
import defaultMusicPic from "../assets/defaultMusicPic.png";
import defaultProfilePic from "../assets/defaultUserPic.png";
import { ip, loadReportsByMusicId, loadReportsByUserId, searchReports } from "../data";
import { getAuthToken } from "../auth";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function ReportRow({id, userId, musicId, message, update}){
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    async function deleteReport(){
        await fetch(`http://${ip}/users/delreport/${id}`,{
            method:"DELETE",
            headers:{
              'x-access-token': getAuthToken()
            }
        });
        if(searchParams.get("text")){
            await searchReports(searchParams.get("text"));
            update();
        }else if(searchParams.get("mode")==="report" && searchParams.get("userId")){
            await loadReportsByUserId(searchParams.get("userId"));
            update();
        }else if(searchParams.get("mode")==="report" && searchParams.get("musicId")){
            await loadReportsByMusicId(searchParams.get("musicId"));
            update();
        }
    }
    return(
        <div className="reportRow">
            <p>{message}</p>
            <div className="reportGombTarto">
                {musicId && <button className="reportButton" onClick={()=>navigate(`/adminMusicEdit?mode=music&musicId=${musicId}`)}><img src={defaultMusicPic} className="reportButtonImg"/></button>}
                {userId && <button className="reportButton" onClick={()=>navigate(`/adminPlaylistEdit?mode=user&userId=${userId}`)}><img src={defaultProfilePic} className="reportButtonImg" style={{borderRadius:200}}/></button>}
                <button className="reportButton" onClick={deleteReport}><img src={del} className="reportButtonImg"/></button>
            </div>
        </div>
    )
}