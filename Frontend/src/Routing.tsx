import { Route, BrowserRouter, Routes } from "react-router-dom"
import Login from "./components/Login"
import App from "./App"
import Register from "./components/Register"
import ProfilePage from "./components/ProfilePage"

const Routing: React.FC = () => {
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<App />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </BrowserRouter>
        
    )
}   

export default Routing;