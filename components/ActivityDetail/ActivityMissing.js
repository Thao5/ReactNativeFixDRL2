import { useEffect, useState } from "react";
import Api, { authApi, endpoints } from "../../ApisService/Api";
import { ActivityIndicator, Avatar, Button, Card, Chip, MD2Colors, Menu, Modal, Portal, Text } from "react-native-paper";
import { Dimensions, ScrollView, View } from "react-native";
import RenderHTML from "react-native-render-html";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LeftContent = props => <Avatar.Icon {...props} icon="folder" />
// const LeftContentAva = props => <Avatar.Image size={24} source={{uri: }} />
const { height } = Dimensions.get("window");

const ActivityMissing = () => {
    const [hoatdong, setHoatDong] = useState(null);
    const [minhchung, setMinhChung] = useState(null);
    const [visible, setVisible] = useState(false);
    const [idHD, setIDHD] = useState(null);
    const [idHDMenu, setIDHDMenu] = useState(null);
    const [idPage, setIdPage] = useState(1)
    const [visibleMenu, setVisibleMenu] = useState(false);

    const [page, setPage] = useState(1);
    const [pageModal, setPageModal] = useState(1);
    const [numberOfItemsPerPageList] = useState([3]);
    const [itemsPerPage, onItemsPerPageChange] = useState(
        numberOfItemsPerPageList[0]
    );

    const [reload, setReload] = useState(false);

    // const [items] = useState([
    //     {
    //         key: 1,
    //         name: 'Cupcake',
    //         calories: 356,
    //         fat: 16,
    //     },
    //     {
    //         key: 2,
    //         name: 'Eclair',
    //         calories: 262,
    //         fat: 16,
    //     },
    //     {
    //         key: 3,
    //         name: 'Frozen yogurt',
    //         calories: 159,
    //         fat: 6,
    //     },
    //     {
    //         key: 4,
    //         name: 'Gingerbread',
    //         calories: 305,
    //         fat: 3.7,
    //     },
    // ]);

    // const from = page * itemsPerPage;
    // const to = Math.min((page + 1) * itemsPerPage, items.length);

    const openMenu = () => setVisibleMenu(true);

    const closeMenu = () => setVisibleMenu(false);


    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    const containerStyle = { backgroundColor: 'white', padding: 20 };


    useEffect(() => {
        setReload(false)
        const loadHoatDong = async () => {
            let e = endpoints['hoatdongs']
            const res = await Api.get(`${e}?page=${page}`);
            setHoatDong(res.data);
        }

        setPage(page)

        const loadMinhChung = async () => {
            let e = endpoints["minhchungs"]
            let token = await AsyncStorage.getItem("token-access");
            const res = await authApi(token).get(`${e}?page=${pageModal}`)
            setMinhChung(res.data);
            // console.warn(res.data)
        }

        setPageModal(pageModal)

        loadMinhChung();

        loadHoatDong();
    }, [page, pageModal, reload])

    const submitButton = (type, idMinhChung) => {

        try {
            // console.warn(idMinhChung)
            if (type === true) {
                const process = async () => {
                    let token = await AsyncStorage.getItem("token-access");
                    const res = await authApi(token).patch(endpoints["minhchungs_detail"](idMinhChung), {
                        "trang_thai": "Đã Xử Lý"
                    })
                    // console.warn(res.status)
                }
                process();
            } else {
                const process = async () => {
                    let token = await AsyncStorage.getItem("token-access");
                    const res = await authApi(token).delete(endpoints["minhchungs_detail"](idMinhChung))

                    // console.warn(res.status)
                }
                process();
            }
        } catch {
            console.warn(error)
        } finally {
            setReload(true)
        }



        // let token = await AsyncStorage.getItem("token-access");
        // if (type === true) {
        //     const res = await authApi(token).patch(endpoints["minhchungs_detail"](idMinhChung), {
        //         "trang_thai": "Đã Xử Lý"
        //     })
        //     console.warn(res.status)
        // }
        // if (type === false) {
        //     const res = await authApi(token).delete(endpoints["minhchungs_detail"](idMinhChung))
        //     console.warn(res.status)
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
                            left={LeftContent} right={() => <>
                                <View
                                >
                                    <Menu
                                        visible={visibleMenu && idHDMenu === hd.id}
                                        onDismiss={closeMenu}
                                        anchor={<Button icon="dots-vertical"
                                            onPress={() => {
                                                openMenu();
                                                setIDHDMenu(hd.id);
                                            }}></Button>}
                                    >
                                        <Menu.Item leadingIcon="eye-outline" onPress={() => {
                                            setIDHD(hd.id);
                                            showModal();
                                        }} title="Xem danh sách hoạt động báo thiếu" />
                                    </Menu>

                                </View>
                            </>} />

                        <Card.Content>
                            <Text variant="titleLarge">{hd.ngay_du_kien}</Text>
                            <ScrollView style={{ height: 0.1 * height }}>
                                <RenderHTML contentWidth={100} source={{ html: hd.mo_ta }}></RenderHTML>
                            </ScrollView>
                        </Card.Content>

                        <Card.Actions>
                            <Chip onPress={() => { }}>{hd.ngay_dien_ra}</Chip>
                            <Chip onPress={() => { }}>-</Chip>
                            <Chip onPress={() => { }}>{hd.ngay_het}</Chip>
                        </Card.Actions>
                    </Card><Portal>
                            <Modal visible={visible && idHD === hd.id} onDismiss={() => {
                                hideModal();
                                setPageModal(1);
                            }} contentContainerStyle={containerStyle}>
                                {minhchung === null ? <ActivityIndicator animating={true} color={MD2Colors.red800} /> : <>
                                    <ScrollView>
                                        {minhchung.results.map((mc) => (
                                            <><ScrollView>
                                                {mc.hoat_dong.id === hd.id && mc.trang_thai === "Đang xử lý" ?
                                                    <><ScrollView>
                                                        <Card>
                                                            <Card.Title title="Card Title" subtitle={"Trạng thái: " + mc.trang_thai} left={() => (
                                                                <Avatar.Image size={24} source={{ uri: mc.sinh_vien.avatar_path }} />
                                                            )} />
                                                            <Card.Content>
                                                                <View style={{ flexDirection: "row" }}>
                                                                    {/* <Text>{mc.sinh_vien.id}</Text> */}
                                                                    <Text variant="bodyMedium"><Text variant="titleSmall">Họ và Tên:</Text> {mc.sinh_vien.last_name + " " + mc.sinh_vien.first_name}</Text>
                                                                    <Text style={{
                                                                        textAlign: "right",
                                                                        right: 0,
                                                                        position: "absolute",
                                                                    }} variant="bodyMedium"><Text variant="titleSmall">MSSV:</Text> {mc.sinh_vien.mssv}</Text>
                                                                </View>
                                                                <View style={{ flexDirection: "row" }}>
                                                                    <Text variant="bodyMedium"><Text variant="titleSmall">Lớp:</Text> {mc.sinh_vien.lop.name}</Text>
                                                                    <Text style={{
                                                                        textAlign: "right",
                                                                        left: 210,
                                                                        position: "absolute",
                                                                    }} variant="bodyMedium"><Text variant="titleSmall">Khoa:</Text> {mc.sinh_vien.khoa.name}</Text>
                                                                </View>
                                                                <View style={{ flexDirection: "row" }}>
                                                                    <Text variant="bodyMedium"><Text variant="titleSmall">Email:</Text> {mc.sinh_vien.email}</Text>
                                                                    <Text style={{
                                                                        textAlign: "right",
                                                                        left: 210,
                                                                        position: "absolute",
                                                                    }} variant="bodyMedium"><Text variant="titleSmall">Phone:</Text> {mc.sinh_vien.phone}</Text>
                                                                </View>
                                                            </Card.Content>
                                                            <Card.Cover style={{ marginTop: 10 }} source={{ uri: mc.minh_chung }} />
                                                            <Card.Actions>
                                                                <Button mode="elevated" dark={true} buttonColor="red" onPress={() => {
                                                                    submitButton(false, mc.id);
                                                                }}>Từ chối</Button>
                                                                <Button mode="elevated" dark={true} buttonColor="green" onPress={() => {
                                                                    submitButton(true, mc.id);
                                                                }}>Xác nhận</Button>
                                                            </Card.Actions>
                                                        </Card>

                                                    </ScrollView></>
                                                    : <>

                                                    </>}
                                            </ScrollView></>
                                        ))}
                                    </ScrollView>
                                </>}
                                {minhchung === null ? <ActivityIndicator animating={true} color={MD2Colors.red800} /> : <>
                                    {minhchung.results.length > 0 ? <View style={{ flexDirection: "row", marginTop: 10, alignSelf: "center" }}>
                                        <Button disabled={pageModal === 1} icon="arrow-left" mode="outlined" onPress={() => setPageModal(pageModal - 1)}>

                                        </Button>
                                        <Text style={{ marginLeft: 20, marginRight: 20 }} variant="headlineLarge">{pageModal}</Text>
                                        <Button disabled={pageModal === Math.ceil(minhchung.count / 3)} contentStyle={{ flexDirection: "row-reverse" }} icon="arrow-right" mode="outlined" onPress={() => setPageModal(pageModal + 1)}>

                                        </Button>
                                    </View> : <></>}

                                </>}
                                <Button style={{ marginTop: 10 }} mode="contained-tonal" onPress={() => {
                                    hideModal();
                                    setPageModal(1);
                                }}>Đóng</Button>
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

export default ActivityMissing;