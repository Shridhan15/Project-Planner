import { useContext, useState } from "react";


export const AdminContext=useContext()

const AdminContextProvider=(props)=>{

    const [projects,setProjects]=useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const getAllProjects= async()=>{
        
    }

}