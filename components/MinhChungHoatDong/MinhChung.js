import { useCallback, useEffect, useState } from "react";
import Api, { authApi, endpoints } from "../../ApisService/Api";
import { useFocusEffect } from "@react-navigation/native";
import { ActivityIndicator, Avatar, Button, Card, Chip, MD2Colors, Modal, Portal, Text } from "react-native-paper";
import { Dimensions, ScrollView, View } from "react-native";
import RenderHTML from "react-native-render-html";
import AsyncStorage from "@react-native-async-storage/async-storage";
import mime from "mime";
import * as ImagePicker from "expo-image-picker";

const { height } = Dimensions.get("window");
const LeftContent = props => <Avatar.Icon {...props} icon="folder" />
const MinhChung = () => {
    const [hoatdong, setHoatDong] = useState(null)
    const [idHD, setIDHD] = useState(null)
    const [visible, setVisible] = useState(false);
    const [minhchung, setMinhChung] = useState({
        "minh_chung": "",
        "hoat_dong_id": ""
    })

    const [quyche, setQuyChe] = useState(null);
    const [quycheID, setQuyCheID] = useState(1);

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    const containerStyle = { backgroundColor: 'white', padding: 20 };

    useEffect(() => {
        const loadHoatDongs = async () => {
            const res = await Api.get(endpoints["hoatdongs"]);
            setHoatDong(res.data.results);
        };

        const loadQuyChe = async () => {
            const res = await Api.get(endpoints["quyches"])
            setQuyChe(res.data.results)
        }

        loadQuyChe();
        loadHoatDongs();
    }, [])

    useFocusEffect(
        useCallback(() => {
            const loadHoatDongs = async () => {
                const res = await Api.get(endpoints["hoatdongs"]);
                setHoatDong(res.data.results);
            };

            loadHoatDongs();
        }, [])
    )

    const BaoThieu = async () => {
        try {

            let form = new FormData();

            const newImageUri =
                "file:///" + minhchung["minh_chung"].uri.split("file:/").join("");

            for (key in minhchung) {
                if (key === "minh_chung") {
                    form.append(key, {
                        uri: newImageUri,
                        name: newImageUri.split("/").pop(),
                        type: mime.getType(newImageUri),
                    });
                } else {
                    form.append(key, minhchung[key]);
                }
            }

            // console.warn(form)

            let token = await AsyncStorage.getItem("token-access");
            const res = await authApi(token).post(endpoints['minhchungs'], form, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            // console.warn(res.data);
            hideModal()
        } catch (error) {
            console.error(error);
        } finally {

        }
    }

    const change = (field, value) => {
        setMinhChung((current) => {
            return { ...current, [field]: value };
        });
    };

    const picker = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            alert("Permission denied!");
        } else {
            const res = await ImagePicker.launchImageLibraryAsync();
            if (!res.canceled) {
                change("minh_chung", res.assets[0]);
            }
        }
    };

    return (
        <ScrollView>
            {hoatdong === null ? <ActivityIndicator animating={true} color={MD2Colors.red800} /> : <>
                <View>
                    {quyche === null ? <ActivityIndicator animating={true} color={MD2Colors.red800} /> : <>
                        <View style={{ flexDirection: "row", justifyContent: "center" }}>{quyche.map((qc) => (
                            <Button dark={false} buttonColor="#FFD700" style={{ marginLeft: 5, marginBottom: 10, marginTop: 10 }} mode="elevated" onPress={() => {
                                setQuyCheID(qc.id)
                            }}>
                                {qc.name}
                            </Button>
                        ))}</View>
                    </>}
                </View>
                {hoatdong.map((hd) => (
                    <>
                        {hd.quy_che === quycheID ? <Card>
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
                                {/* <Chip onPress={() => { }}>-</Chip> */}
                                <Chip onPress={() => { }}>{hd.ngay_het}</Chip>
                                <Button icon="table-check" mode="elevated" dark={false} buttonColor="#FFD700" onPress={() => {
                                    change("hoat_dong_id", hd.id);
                                    setIDHD(hd.id);
                                    showModal();
                                }}>Báo Thiếu</Button>
                                <Portal>
                                    <Modal visible={visible && idHD === hd.id} onDismiss={hideModal} contentContainerStyle={containerStyle}>
                                        <Button style={{ marginBottom: 10 }} icon="camera" mode="contained" onPress={picker}>
                                            Ảnh minh chứng
                                        </Button>
                                        {minhchung.minh_chung !== "" ? (
                                            <Avatar.Image
                                                size={260}
                                                source={{ uri: minhchung.minh_chung.uri }}
                                                style={{ alignSelf: "center" }} />
                                        ) : (
                                            ""
                                        )}
                                        <Button icon="table-check" style={{ marginTop: 10 }} mode="elevated" dark={false} onPress={BaoThieu} buttonColor="#FFD700">
                                            Bắt đầu báo thiếu
                                        </Button>
                                    </Modal>
                                </Portal>
                            </Card.Actions>
                        </Card> : <></>}
                    </>
                ))}
            </>}
        </ScrollView >
    )
}

export default MinhChung;