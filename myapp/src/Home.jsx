import { useNavigate } from "react-router-dom"

function Home() {
  const navigate = useNavigate()
  
    return (
        <div>
        <button onClick={()=> {navigate("/callpage")}}>Connect</button>
        </div>
    )
}


export default Home