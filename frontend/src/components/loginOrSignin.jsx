import { Form, Link, useSearchParams, redirect} from "react-router-dom";
import "../styles/forms.css";
import { setUserData, ip, loadData, loadPlaylists } from "../data";
import { getAuthToken } from "../auth";

export default function LoginOrSignin(){
    const [searchParams] = useSearchParams();
    const isLogin = searchParams.get("mode") == "login";
    return(
        <Form method="post" className="authForm">
            <h1>{isLogin ? 'Bejelentkezés' : 'Regisztráció'}</h1>
            {!isLogin &&
            <p>
              <input id="username" type="text" name="username" placeholder="Felhasználó név" required />
            </p>}
            <p>
              <input id="email" type="email" name="email" placeholder="Email" required />
            </p>
            <p>
              <input id="password" type="password" name="password" placeholder="Password" required />
            </p>
            <div>
              <Link to={`?mode=${isLogin ? 'signup' : 'login'}`} className="loginFormButton">
                  {isLogin ? 'Váltás regisztrációra' : 'Váltás bejelentkezésre'}
              </Link>
              <button className="loginFormButton">{!isLogin ? 'Regisztráció' : 'Bejelentkezés'}</button>
            </div>
        </Form>
    )
}

export async function LoginAction({request}){
  try {
    const searchparams = new URL(request.url).searchParams;
    const mode = searchparams.get('mode') || 'login';

    if(mode != 'login' && mode != 'signup'){
      throw Response.json({message: "Unsupported mode."}, {status: 422});
    }

    const data = await request.formData();
    let authData;
    if(mode=="signup"){
      authData = {
        username: data.get("username"),
        email: data.get("email"),
        pwd: data.get("password")
      };
    }else{
      authData = {
        email: data.get("email"),
        pwd: data.get("password")
      };
    }

    const response = await fetch(`http://${ip}/users/${mode}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(authData)
    });

    const resData = await response.json();
    if(resData.token && mode == "login"){
      localStorage.setItem("token", resData.token);
    }else if(mode == "signup"){
      authData = {
        email: data.get("email"),
        pwd: data.get("password")
      };
      const res = await fetch(`http://${ip}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(authData)
      });
      const resData2 = await res.json();
      if(resData2.token)
        localStorage.setItem("token", resData2.token);
    }
    localStorage.setItem("userId", resData.id);
    if(response.status == 400 || response.status == 500){
      throw Response.json({message: 'Could not authenticate user.'}, {status: 500});
    }

    if(!response.ok)
      throw Response.json({message: 'Could not authenticate user.'}, {status: 500});

    const expiration = new Date();
    expiration.setHours(expiration.getHours() + 2 );
    localStorage.setItem("expiration", expiration.toISOString());
    
    await loadData();
    await loadPlaylists();
    return redirect('/');
  } catch (error) {
    console.error("Error during authentication:", error);
  }
}