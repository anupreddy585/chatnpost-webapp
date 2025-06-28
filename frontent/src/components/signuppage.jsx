import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { addUsers } from '../redux/loginSlice';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
const Signuppage = () => {
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const [searchparams,setsearchparams]=useSearchParams();
    const  userId=searchparams.get("userId");
    const [username,setUsername]=useState('');
    const [password1,setPassword1]=useState('');
    const [password2,setPassword2]=useState('');
function handleText(e){
     setUsername(e.target.value);
}
function handlePassword1(e){
    setPassword1(e.target.value);
}
function handlePassword2(e){
    setPassword2(e.target.value);
}

function handleBtn(){
    if(username!=''){
    if(password1!=''||password2!=''){
    if(password1==password2){
        const data={
            username:username,
            password:password1,
            user_id:userId||Date.now().toString(35),
            createdAt:new Date().toISOString()
        }
        dispatch(addUsers(data));
        setUsername('');
        setPassword1('');
        setPassword2('');
      }
    }
    }
}

  return (
    
      <div className='container'>
        <h1 className='heading' >Signup</h1>
        <div className='inside'>
            <input className='username'  type='text' value={username} onChange={handleText} placeholder='type username' />
            <input className='password' type='password' value={password1} onChange={handlePassword1} placeholder='type password' />
            <input className='password'  type='password' value={password2} onChange={handlePassword2} placeholder='re-enter password'/>
        </div>
        <button className='button' onClick={handleBtn} >Signup</button>
        <p className='desc' >after sign up;go to loginpage and <a className='link' href='/'>login</a> </p>
        
      </div>
    
  )
}

export default Signuppage
