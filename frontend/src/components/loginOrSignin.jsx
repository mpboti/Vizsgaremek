import { useState } from "react";
import { Form, Link } from "react-router-dom";
import "../styles/login.css";

export default function LoginOrSignin(){
    const [isLogin, setIsLogin] = useState(true);
    return(
        <Form method="post" className="authForm">
            <h1>{isLogin ? 'Log in' : 'Create a new user'}</h1>
            <p>
              <input id="email" type="email" name="email" placeholder="Email" required />
            </p>
            <p>
              <input id="password" type="password" name="password" placeholder="Password" required />
            </p>
            <div className="">
              <Link to={`?mode=${isLogin ? 'signup' : 'login'}`}>
                <button className="loginFormButton">
                  {isLogin ? 'Create new user' : 'Login'}
                </button>
              </Link>          
              <button className="loginFormButton">Save</button>
            </div>
        </Form>
    )
}

export function LoginAction(){

}