import { login, register, getMe, logout } from "../services/auth.api";
import { useContext } from "react";
import { AuthContext } from "../auth.context";

export const useAuth = () => {
    const context = useContext(AuthContext)
    const {user, setUser, loading, seLoading} = context

    async function handleRegister({username, email, password}){
        setLoading(true)
        const data = await register({username, email, password})
        setUser(data.user)
        setLoading(false)
    }

    async function handleLogin({username, password, email}) {
        setLoading(true)
        const data = await login({username, email, password})
        setUser(data.user)
        setLoading(false)
    }

    async function handleGetMe(){
        setLoading(true)
        const data = await getMe()
        setUser(data.user)
        setLoading(false)
    }

    async function handleLogout(){
        setLoading(true)
        const data = await logout()
        setUser(data.user)
        setLoading(false)

    }

    return ({
        user, loading, handleRegister, handleLogin, handleLogout, handleGetMe
    })
}