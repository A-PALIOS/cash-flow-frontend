import React,{useState,useEffect} from 'react'
import { useDispatch,useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {LoginUser,reset} from "../features/authSlice"
import logo from "../logocmt.png";
import '../login.css';
import edsna from "../logo2.svg";
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
        

const Login = () => {
    const [email,setEmail]=useState("");
    const [password,setPassword] =useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {user,isError,isSuccess,isLoading,message} = useSelector((state)=>state.auth);
    const Auth =(e)=>{
        e.preventDefault();
        dispatch(LoginUser({email,password}));
    }

    useEffect(()=>{
        if(user && isSuccess){
            navigate("/dashboard");
        }
        dispatch(reset());
    },[user,isSuccess,dispatch,navigate]);

  return (
    <section className="is-success is-fullheight is-fullwidth">

<div class="d-flex flex-column justify-content-center w-100 h-100">

<div class="d-flex flex-column justify-content-center align-items-center">
  <h1 class="fw-light text-white m-0"></h1>


  <div className="column is-4">

  <form onSubmit={Auth} className="card">
                    <div className="flex flex-wrap align-items-center mb-3 gap-2">
                  <img 
                    src={logo}
                    width="320" 
                    height="80"
                    alt="logo"
                  />
                </div>
                  <div style={{display:'grid',justifyItems:'center'}}>
                    <h1 style={{color: "black",fontWeight:"bold",textAlign:"center"}}>Cash Flow</h1>
                    <div className="field">
                        <div><label  className="label">Email</label></div>
                        <div className="control">
                            <InputText type="text" className="input" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder='email'/>
                        </div>
                    </div>
                    <div className="field">
                        <label  className="label">Kωδικός πρόσβασης</label>
                        <div className="control">
                            <Password type="password" className="input" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="*********" feedback={false} tabIndex={1} />
                        </div>
                    </div>
                    <div className="field mt-5">
                        <Button type="submit" className="button is-success is-fullwidth">{isLoading ?"Loading..." : "Είσοδος"}</Button>
                    </div>
                    {isError && <p className='has-text-centered alert alert-danger'>{message}</p>}
                    </div>
                </form>
                </div>
                
  <div class="btn-group my-5">
    <a href="https://paratiritirio-edsna.gr/" class="btn btn-outline-light" aria-current="page"><i class="fas fa-file-download me-2"></i>Επιστροφή στο Site</a>
  </div>
 
</div>
</div>

    </section>
  );
};

export default Login;