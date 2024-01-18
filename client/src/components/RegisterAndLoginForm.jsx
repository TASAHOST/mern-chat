import { useState, useContext } from "react"
import axios from "axios"
import { UserContext } from "../context/UserContext"

const RegisterAndLoginForm = () => {
    const [ username, setUsername] = useState("");
    const [ password, setPassword] = useState("");
    const [ isLoginOrRegister, setIsLoginOrRegister] = useState("login");
    //setUsername:setLoggedInUername set หลัง : คือจะเปลี่ยนชื่อที่มาจากกองกลาง เเล้วมันจะซ้ำเลยต้องเปลี่ยนชื่อ เพราะ import มาเลยเปลี่ยนโดยตรงไม่ได้ เพราะชื่อมันซ้ำกันไม่ได้
    const {setUsername:setLoggedInUername, setId} = useContext(UserContext)
    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = isLoginOrRegister === 'register' ? "register" : "login"
        const {data} = await axios.post(url, {username, password});
        setLoggedInUername(username);
        setId(data.id);
    }

  return (
    <div className="bg-blue-50 h-screen flex item-center">
        <form onSubmit={handleSubmit} className="w-64 mx-auto mb-12">
            <input type="text" value={username} className="block w-full rounded-sm p-2 mb-2 border" placeholder="Username" onChange={e=>setUsername(e.target.value)} />

            <input type="password" value={password} className="block w-full rounded-sm p-2 mb-2 border" placeholder="Password" onChange={e=>setPassword(e.target.value)} />

            <button className="bg-blue-500 text-white block w-full round-sm p-2">
                {isLoginOrRegister === 'register' ? "Register":"Login"}
            </button>
            <div className="text-center mt-2">
                {isLoginOrRegister === 'register' &&(
                    <div>
                        already a member ? {" "} 
                        <button className="ml-1" 
                        onClick={() => {
                            setIsLoginOrRegister("login")
                        }}>
                            login
                        </button>
                    </div>
                )}
                {isLoginOrRegister === 'login' &&(
                    <div>
                       Don't have an account ?{" "} <button className="ml-1" onClick={() => {
                            setIsLoginOrRegister("register")
                        }}>
                            register
                        </button>
                    </div>
                )}
            </div>
        </form>
    </div>
  )
}

export default RegisterAndLoginForm