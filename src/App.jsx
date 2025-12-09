import { useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import './App.css'
import { dataListaz, userDataListaz } from './data'
import Playlist from './coponents/playlist'


function App() {
  const [data, setData] = useState(dataListaz())
  const [userData, setUserData] = useState(userDataListaz)
  const [content, setContent] = useState(<Playlist data={data} userData={userData}/>)
  return (
    <>
      {content}
    </> 
  )
}

export default App
