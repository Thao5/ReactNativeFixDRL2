import { useEffect, useState } from "react";
import { authApi, endpoints } from "../../ApisService/Api";
import { ScrollView } from "react-native";
import { ActivityIndicator, MD2Colors } from "react-native-paper";

const TLSVMinhChung = () => {
    const [minhchung, setMinhChung] = useState(null)

    useEffect(() => {
        const loadMinhChung = async () => {
            let token = await AsyncStorage.getItem("token-access");
            const res = await authApi(token).get(endpoints['minhchungs'])
            setMinhChung(res.data.results);
        }

        loadMinhChung();
    }, [])

    return (
        <ScrollView>
            {minhchung === null ? <ActivityIndicator animating={true} color={MD2Colors.red800} /> : <></>}
        </ScrollView>
    )
}

export default TLSVMinhChung;