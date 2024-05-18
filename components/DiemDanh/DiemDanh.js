import { useEffect, useState } from "react";
import { Dimensions, ScrollView, View } from "react-native";
import { ActivityIndicator, Avatar, Button, Card, Chip, Dialog, MD2Colors, Menu, Modal, Portal, Text, TextInput } from "react-native-paper";
import RenderHTML from "react-native-render-html";
import Api, { authApi, endpoints } from "../../ApisService/Api";
import AsyncStorage from "@react-native-async-storage/async-storage";


const LeftContent = props => <Avatar.Icon {...props} icon="folder" />
const { height } = Dimensions.get("window");

const DiemDanh = () => {
    const [hoatdong, setHoatDong] = useState(null);
    const [idHD, setIDHD] = useState(null);
    const [idHDDialog, setIDHDDialog] = useState(null);
    const [page, setPage] = useState(1);
    const [visible, setVisible] = useState(false);
    const [mssv, setMSSV] = useState(null);
    const [status, setStatus] = useState(null);

    const [visibleDialog, setVisibleDialog] = useState(false);

    const hideDialog = () => setVisibleDialog(false);

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    const containerStyle = { backgroundColor: 'white', padding: 20 };




    useEffect(() => {

        const loadHoatDong = async () => {
            let e = endpoints['hoatdongs']
            const res = await Api.get(`${e}?page=${page}`);
            setHoatDong(res.data);
        }

        setPage(page)

        loadHoatDong();
    }, [page])

    const startDiemDanh = async (hoatdongID) => {
        let token = await AsyncStorage.getItem("token-access");
        const res = await authApi(token).post(endpoints["hoatdong_diemdanh"](hoatdongID), {
            "mssv": mssv
        })
        setStatus(res.status)
        // console.warn(res.status)
        // if (res.status === 200) {
        //     // const resCSV = await authApi(token).post(endpoints["hoatdong_diemdanhcsv"](hoatdongID))
        //     // console.warn(resCSV.status)
        //     // if (resCSV.status === 200) {
        //     //     const resTongKet = await authApi(token).post(endpoints["hoatdong_diemdanhtongket"](hoatdongID))
        //     //     // console.warn(resTongKet.data)
        //     // }
        // }
        
    }

    return (
        <ScrollView>
            {hoatdong === null ? <ActivityIndicator animating={true} color={MD2Colors.red800} /> : <>
                <View style={{ flexDirection: "row", marginTop: 10, alignSelf: "center" }}>
                    <Button disabled={page === 1} icon="arrow-left" mode="outlined" onPress={() => setPage(page - 1)}>

                    </Button>
                    <Text style={{ marginLeft: 20, marginRight: 20 }} variant="headlineLarge">{page}</Text>
                    <Button disabled={page === Math.ceil(hoatdong.count / 3)} contentStyle={{ flexDirection: "row-reverse" }} icon="arrow-right" mode="outlined" onPress={() => setPage(page + 1)}>

                    </Button>
                </View>
                {hoatdong.results.map((hd) => (
                    <><Card style={{ marginTop: 10 }} onPress={() => {
                        setIDHD(hd.id);
                        showModal();
                    }}>
                        <Card.Title title={hd.name} subtitle={"Quy chế: " + hd.quy_che + ", " + "Tag: " + hd.tags.map((tag) => tag.name + " ")}
                            left={LeftContent} />

                        <Card.Content>
                            <Text variant="titleLarge">{hd.ngay_du_kien}</Text>
                            <ScrollView style={{ height: 0.1 * height }}>
                                <RenderHTML contentWidth={100} source={{ html: hd.mo_ta }}></RenderHTML>
                            </ScrollView>
                        </Card.Content>

                        <Card.Actions>
                            <Chip onPress={() => { }}>{hd.ngay_dien_ra}</Chip>

                            <Chip onPress={() => { }}>{hd.ngay_het}</Chip>
                            <Button onPress={() => {
                                setIDHD(hd.id)
                                showModal();
                            }} buttonColor="green" dark={true} mode="elevated">Bắt đầu điểm danh</Button>
                        </Card.Actions>
                    </Card><Portal>
                            <Modal visible={visible && idHD === hd.id} onDismiss={hideModal} contentContainerStyle={containerStyle}>
                                <Card style={{ marginTop: 10 }}>
                                    <Card.Title title={hd.name} subtitle={"Quy chế: " + hd.quy_che + ", " + "Tag: " + hd.tags.map((tag) => tag.name + " ")}
                                        left={LeftContent} />

                                    <Card.Content>
                                        <Text variant="titleLarge">{hd.ngay_du_kien}</Text>
                                        <ScrollView style={{ height: 0.1 * height }}>
                                            <RenderHTML contentWidth={100} source={{ html: hd.mo_ta }}></RenderHTML>
                                        </ScrollView>
                                    </Card.Content>

                                    <Card.Actions>
                                        <Chip onPress={() => { }}>{hd.ngay_dien_ra}</Chip>
                                        <Chip>-</Chip>
                                        <Chip onPress={() => { }}>{hd.ngay_het}</Chip>

                                    </Card.Actions>
                                </Card>

                                <TextInput style={{ marginTop: 20 }}
                                    placeholder="MSSV..."
                                    mode="outlined"
                                    label="MSSV"
                                    value={mssv}
                                    onChangeText={(t) => setMSSV(t)}
                                    left={<TextInput.Icon icon="account" />}
                                />
                                <Button style={{marginTop: 20}} icon="check-all" mode="elevated" dark={true} buttonColor="green" onPress={() => {
                                    setIDHDDialog(hd.id)
                                    setVisibleDialog(true)
                                    startDiemDanh(hd.id)
                                }}>
                                    Điểm danh
                                </Button>
                                <Portal>
                                    <Dialog visible={visibleDialog && idHDDialog === hd.id} onDismiss={hideDialog}>
                                        <Dialog.Content>
                                            {status === 200 ? <Text variant="bodyMedium">Đã cập nhật điểm danh MSSV: {mssv}</Text> : <Text variant="bodyMedium">Có lỗi xảy ra</Text>}
                                            
                                        </Dialog.Content>
                                    </Dialog>
                                </Portal>
                                {/* {minhchung === null ? <ActivityIndicator animating={true} color={MD2Colors.red800} /> : <>
                                    <ScrollView>
                                        {minhchung.map((mc) => (
                                            <ScrollView>
                                                {mc.hoat_dong === hd.id ?
                                                    <ScrollView>
                                                        <Card>
                                                            <Card.Title title="Card Title" subtitle={"Trạng thái: " + mc.trang_thai} left={LeftContent} />
                                                            <Card.Content>
                                                                <Text variant="titleLarge">Card title</Text>
                                                                <Text variant="bodyMedium">Card content</Text>
                                                            </Card.Content>
                                                            <Card.Cover source={{ uri: mc.minh_chung }} />
                                                            <Card.Actions>
                                                                <Button>Từ chối</Button>
                                                                <Button>Xác nhận</Button>
                                                            </Card.Actions>
                                                        </Card>
                                                    </ScrollView>
                                                    : <>

                                                    </>}
                                            </ScrollView>
                                        ))}
                                    </ScrollView>
                                </>} */}
                            </Modal>
                        </Portal></>
                ))}
                <>

                    <View style={{ flexDirection: "row", marginTop: 10, alignSelf: "center" }}>
                        <Button disabled={page === 1} icon="arrow-left" mode="outlined" onPress={() => setPage(page - 1)}>

                        </Button>
                        <Text style={{ marginLeft: 20, marginRight: 20 }} variant="headlineLarge">{page}</Text>
                        <Button disabled={page === Math.ceil(hoatdong.count / 3)} contentStyle={{ flexDirection: "row-reverse" }} icon="arrow-right" mode="outlined" onPress={() => setPage(page + 1)}>

                        </Button>
                    </View>
                </>

            </>}
        </ScrollView>

    )
}

export default DiemDanh;