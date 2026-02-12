import { Form, Link, useSearchParams, redirect } from "react-router-dom";
import "../styles/forms.css";

export default function LoginOrSignin(){
    const [searchParams] = useSearchParams();
    const isLogin = searchParams.get("mode") == "login";
    return(
        <Form method="post" className="authForm">
            <h1>{isLogin ? 'Log in' : 'Create a new user'}</h1>
            {!isLogin &&
            <p>
              <input id="username" type="username" name="username" placeholder="Felhasználó név" required />
            </p>}
            <p>
              <input id="email" type="email" name="email" placeholder="Email" required />
            </p>
            
            <p>
              <input id="password" type="password" name="password" placeholder="Password" required />
            </p>
            <div>
              <Link to={`?mode=${isLogin ? 'signup' : 'login'}`}className="loginFormButton">
                  {isLogin ? 'Create new user' : 'Login'}
              </Link>          
              <button className="loginFormButton">Save</button>
            </div>
        </Form>
    )
}

export async function LoginAction({request}){
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

  if(response.status == 400 || response.status == 500){
    return response;
  }

  if(!response.ok)
    throw Response.json({message: 'Could not authenticate user.'}, {status: 500});

  // Token kezelés
  const resData = await response.json();
  console.log(resData.message);

  return redirect('/');
}