import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from "react-native";
import Api, { apiLogin, authApi, endpoints } from "../../ApisService/Api";
import { useContext, useState } from "react";
import Styles from "./Styles";
import MyStyle from "../../styles/MyStyle";
import { getDatabase, ref, child, get } from "firebase/database";

const Login = ({ navigation }) => {
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [user, dispatch] = useContext(MyContext);
    const [loading, setLoading] = useState();

    const login = async () => {
        setLoading(true);
        try {
            let formdata = new FormData();
            formdata.append("client_id", "AsZctVfQHD7HcVIy01Uxb5wCtcLiGdBxPLOuQ25Q");
            formdata.append("client_secret", "Fqc1YXopos00eIgDHyoYmC7yzCE44dhYbNI2VTn90fSRk0flffHRo3o5qtgsoIgleMfk7VXOf4NY4cu3fr1FHt7KO5RJiUmGiXSGgJ6NVjPTt2H0orXuDvL8dYY8nKzP");
            formdata.append("username", username);
            formdata.append("password", password);
            formdata.append("grant_type", "password");
            // console.info(formdata)

            let res = await apiLogin().post(endpoints['login'], formdata)


            // console.info(res.data)
            await AsyncStorage.setItem('token-access', res.data.access_token)
            let user = await authApi(res.data.access_token).get(endpoints['user_current']);

            if (user.data !== null) {
                // console.info(user.data)
                // const dbRef1 = ref(getDatabase());
                // get(child(dbRef1, `user/`)).then((snapshot) => {

                //     console.info(snapshot.val());
                //     snapshot.val().map((uid) => {
                //         console.warn(uid)
                //         if(uid.id === user.data.id) {
                //             console.warn("User Exists")
                //         }
                //     })

                // }).catch((error) => {
                //     console.error(error);
                // });
                // const dbRef = ref(getDatabase());
                // get(child(dbRef, `user/0/${user.data.id}`)).then((snapshot) => {
                //     if (snapshot.exists()) {
                //         // console.info(snapshot.val());
                //     } else {
                //         console.warn("No data available");
                //     }
                // }).catch((error) => {
                //     console.error(error);
                // });

            }
            // console.warn(user.data)
            dispatch({
                'type': 'login',
                'payload': {
                    'userdata': user.data
                }
            })
            navigation.navigate('Home');
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
        // if(username==="admin"&&password==="123"){
        //     dispatch({
        //         'type': 'login',
        //         'payload': {
        //             'username': 'admin'
        //         }
        //     })
        // }else
        //     alert("Đăng nhập không thanh công!");
    }

    return <View style={MyStyle.container}>
        <Text style={MyStyle.subject}>ĐĂNG NHẬP</Text>
        <TextInput value={username} onChangeText={t => setUsername(t)} placeholder="Enter username..." style={Styles.input}></TextInput>
        <TextInput secureTextEntry={true} value={password} onChangeText={t => setPassword(t)} placeholder="Enter password..." style={Styles.input}></TextInput>
        {loading === true ? <ActivityIndicator /> : <>
            <TouchableOpacity onPress={login}>
                <Text style={Styles.button}>Login</Text>
            </TouchableOpacity>
        </>}
    </View>
}

export default Login;