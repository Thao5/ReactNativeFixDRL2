import { useContext } from "react"
import { Button } from "react-native"
import userContext from "../../Context/userContext/userContext";


export default Logout = ()=>{
    const [user, dispatch] = useContext(userContext);

    const logout = () => {
        // console.info("Log Out")
        dispatch({
            'type': 'logout'
        })
    }

    return <Button title="Logout" onPress={logout}></Button>
}