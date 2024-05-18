import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useContext, useEffect, useState } from "react";
import Api, { authApi, endpoints } from "../../ApisService/Api";
import userContext from "../../Context/userContext/userContext";
import { ActivityIndicator, Avatar, Button, Card, Chip, MD2Colors, SegmentedButtons, Text } from "react-native-paper";
import { Dimensions, ScrollView, View } from "react-native";
import RenderHTML from "react-native-render-html";
import ReadMore from "@fawazahmed/react-native-read-more";
import clip from "text-clipper";
import ViewMoreText from "react-native-view-more-text";

const LeftContent = props => <Avatar.Icon {...props} icon="folder" />
const { height } = Dimensions.get("window");
const ActivityAttended = () => {
    const [activity, setActivity] = useState(null);
    const [hocki, setHocKi] = useState(null);
    const [idHK, setIDHK] = useState(null);
    const [user,] = useContext(userContext);

    const [value, setValue] = useState('');

    useEffect(() => {
        const loadActivity = async () => {
            let token = await AsyncStorage.getItem("token-access");
            const res = await authApi(token).get(endpoints['usersvs_detail_hoatdong'](user.userdata.id))
            // console.warn(res.data)
            setActivity(res.data)
        }

        const loadHocKi = async () => {
            const res = await Api.get(endpoints['hockis'])
            setHocKi(res.data.results)
            // console.warn(hocki)
        }

        loadHocKi()
        loadActivity()
    }, [])

    useFocusEffect(
        useCallback(() => {
            const loadActivity = async () => {
                let token = await AsyncStorage.getItem("token-access");
                const res = await authApi(token).get(endpoints['usersvs_detail_hoatdong'](user.userdata.id))
                // console.warn(res.data)
                setActivity(res.data)
            }
            loadActivity()
        }, [])
    )

    return (
        <>
            <View>
                {activity === null ? (
                    <ActivityIndicator animating={true} color={MD2Colors.red800} />
                ) : (
                    <>
                        <View style={{ flexDirection: "row", justifyContent: "center" }}>{hocki.map((hk) => (
                            <Button mode="outlined" onPress={() => {
                                setIDHK(hk.id)
                            }}>
                                {hk.name}
                            </Button>
                        ))}</View>

                        <ScrollView>
                            {activity.map((hd) => (
                                <View>
                                    {hd.hoc_ki.id === idHK ? <><Card>
                                        <Card.Title title={hd.name} subtitle={"Quy Chế: " + hd.quy_che + ", " + hd.tags.map((tag) => tag.name)} left={LeftContent} right={() => <Text>+{hd.diem_cong} điểm</Text>} />
                                        <Card.Content>
                                            <Text variant="titleLarge">{hd.ngay_du_kien}</Text>
                                            <ScrollView style={{ height: 0.1 * height }}>
                                                <RenderHTML contentWidth={100} source={{ html: hd.mo_ta }}></RenderHTML>
                                            </ScrollView>
                                        </Card.Content>
                                        {/* <Card.Cover source={{ uri: 'https://picsum.photos/700' }} /> */}
                                        <Card.Actions>
                                            <Chip onPress={() => { }}>{hd.ngay_dien_ra}</Chip>
                                            <Chip onPress={() => { }}>-</Chip>
                                            <Chip onPress={() => { }}>{hd.ngay_het}</Chip>

                                        </Card.Actions>
                                    </Card></> : ''}
                                </View>
                            ))}


                        </ScrollView></>

                )}
            </View >
        </>
    );
}

export default ActivityAttended;