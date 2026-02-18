import { RouterProvider } from "react-router-dom";
import './App.css';
import TopContent from "./components/top-content";
import MainPage from "./components/MainPage";
import Playlist from "./components/playlist";
import Kereses from "./components/kereses";
import ErrorNotFound from "./components/ErrorNotFound";
import { createBrowserRouter } from "react-router-dom";
import LoginOrSignin, { LoginAction } from "./components/loginOrSignin";
import CreatePlaylist, { CreateAction } from "./components/createPlaylist";
import Setting, { SettingAction } from "./components/setting";

function App() {

  const router = createBrowserRouter([
    {path: "/", element: <TopContent />, errorElement:<ErrorNotFound/>,
    children:[
      {path: "/", element: <MainPage />},
      {path: "/playlist/:id", element: <Playlist />},
      {path: "/search", element: <Kereses />},
      {path: "/auth", element: <LoginOrSignin />, action: LoginAction},
      {path: "/addplaylist", element: <CreatePlaylist />, action: CreateAction },
      {path: "/setting", element: <Setting />, action: SettingAction},
    ]}
  ]);

  return (
    <RouterProvider router={router} />
  )
}

export default App