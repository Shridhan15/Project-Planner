import React, { useState } from 'react'

const Login = () => {

    const [currentState,setCurrentState] = useState("Sign Up")
  return (
    <form className='flex flex-col items-center justify-center gap-4 p-4 w-full max-w-md mx-auto mt-20 bg-gray-100 shadow-lg rounded-lg'>

       <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">{currentState} </p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>
      {
        currentState ==="Login" ? "": 
        <input className='border border-gray-500 w-full px-3 py-2' type="text" placeholder='enter name' required />
      }

      <input className='border border-gray-500 w-full px-3 py-2' type="email" placeholder='enter email' required />

      <input className='border border-gray-500 w-full px-3 py-2' type="password" placeholder='enter password' required />

      <div className='cursor-pointer text-blue-500 hover:underline font-light'>
        {currentState==="Login"? 

        <p onClick={()=>setCurrentState("Sign Up")}>Create an account</p> 
        :
        <p onClick={()=>setCurrentState("Login")}>Already have an account?</p>

    }
      </div>

      <div>
        {currentState==="Login"?
          <button className=' cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg'>Login</button>:
          <button className=' cursor-pointer bg-green-500 text-white px-4 py-2 rounded-lg'>Sign Up</button>
        }
      </div>

    </form>
  )
}

export default Login