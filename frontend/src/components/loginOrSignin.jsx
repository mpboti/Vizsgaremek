import { Form, Link, useSearchParams, redirect} from "react-router-dom";
import "../styles/forms.css";
import { setUserData } from "../data";

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

    const response = await fetch("http://localhost:3000/users/"+mode, {
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
      const res = await fetch("http://localhost:3000/users/login", {
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
    
    const res = await fetch("http://localhost:3000/users/getuser/"+resData.id, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem("token")
      }
    });
    const resData2 = await res.json();
    console.log(resData2);
    if(resData.imageFileId!=null){
      const res2 = await fetch("http://localhost:3000/files/image/", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': localStorage.getItem("token")
        }
      });
      const resData3 = await res2.json();
      const userPic = URL.createObjectURL(resData3[resData.imageFileId]);
      setUserData(resData2.username, resData2.email, userPic, resData2.id);
    }else{
      setUserData(resData2.username, resData2.email, "", resData2.id);
    }
    
    return redirect('/');
  } catch (error) {
    console.error("Error during authentication:", error);
  }
}