import { RouterProvider } from "react-router-dom";
import './App.css';
import TopContent from "./components/top-content";
import MainPage, { mainPageLoader } from "./components/MainPage";
import Playlist, { PlaylistLoader } from "./components/playlist";
import Kereses from "./components/kereses";
import ErrorNotFound from "./basics/ErrorNotFound";
import { createBrowserRouter } from "react-router-dom";
import LoginOrSignin, { LoginAction } from "./components/loginOrSignin";
import CreateOrEditPlaylist, { PlaylistAction } from "./components/createOrEditPlaylist";
import Setting, { SettingAction } from "./components/setting";
import CreateOrEditMusic, { MusicAction, MusicAddLoader } from "./components/createOrEditMusic";
import { useEffect } from "react";
import { logout } from "./data";
import { getAuthToken } from "./auth";

function App() {
  useEffect(()=>{
    function loading(){
      if(getAuthToken() == "EXPIRED"){
        logout();
      }
    }
    loading();
  },[])
  const router = createBrowserRouter([
    {path: "/", element: <TopContent />, errorElement: <ErrorNotFound/>,
    children: [
      {path: "/", element: <MainPage />, loader: mainPageLoader},
      {path: "/playlist", element: <Playlist />, loader: PlaylistLoader},
      {path: "/search", element: <Kereses />},
      {path: "/auth", element: <LoginOrSignin />, action: LoginAction},
      {path: "/editplaylist", element: <CreateOrEditPlaylist />, action: PlaylistAction },
      {path: "/setting", element: <Setting />, action: SettingAction},
      {path: "/addMusic", element: <CreateOrEditMusic/>, action: MusicAction, loader: MusicAddLoader}
    ]}
  ])
  
  
  return <RouterProvider router={router} />
}

export default App