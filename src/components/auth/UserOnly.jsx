import { useRouter } from "expo-router"
import { useUser } from "../../hooks/useUser"
import { useEffect } from "react"



const UserOnly = ({ children }) => {
    const {user, authChecked } = useUser()
    const router = useRouter()


useEffect(() => {
if(authChecked && user === null) {
    router.replace('/login')
}
}, [user, authChecked])

if(!authChecked || !user) {
    return (
       
    )
}


return children
}

export default UserOnly 