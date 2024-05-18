import { useEffect, useState } from "react";
import { Dimensions, ScrollView, View } from "react-native";
import { ActivityIndicator, Avatar, Button, Card, Chip, Dialog, MD2Colors, Menu, Modal, Portal, Searchbar, Text, TextInput } from "react-native-paper";
import RenderHTML from "react-native-render-html";
import Api, { endpoints } from "../../ApisService/Api";


// const LeftContent = () => <Avatar.Image size={24} source={{}} />
const { height } = Dimensions.get("window");

const FindSV = ({ navigation }) => {
    const [search, setSearch] = useState("");
    const [sv, setSV] = useState(null)
    const [page, setPage] = useState(1);

    useEffect(() => {
        const loadSV = async () => {
            let e = endpoints["usersvs"]
            const res = await Api.get(`${e}?page=${page}`)
            setSV(res.data)
        }

        loadSV()
    }, [page])

    return (
        <ScrollView>
            {sv === null ? <ActivityIndicator animating={true} color={MD2Colors.red800} /> : <>
                <Searchbar style={{ marginTop: 20, marginBottom: 10 }}
                    placeholder="Search(First Name, Last Name, Khoa, Lop, MSSV, Email)..."
                    onChangeText={(t) => setSearch(t)}
                    value={search}
                />
                <View style={{ flexDirection: "row", marginTop: 10, alignSelf: "center" }}>
                    <Button disabled={page === 1} icon="arrow-left" mode="outlined" onPress={() => setPage(page - 1)}>

                    </Button>
                    <Text style={{ marginLeft: 20, marginRight: 20 }} variant="headlineLarge">{page}</Text>
                    <Button disabled={page === Math.ceil(sv.count / 3)} contentStyle={{ flexDirection: "row-reverse" }} icon="arrow-right" mode="outlined" onPress={() => setPage(page + 1)}>

                    </Button>
                </View>
                {sv.results.map((sv) => (
                    <>
                        {search === '' ?
                            <Card style={{ marginTop: 10 }} onPress={() =>
                                navigation.navigate("UserSV Detail", { nguoidungID: sv.id })
                            }>
                                <Card.Title title={sv.last_name + " " + sv.first_name} subtitle={"Email: " + sv.email}
                                    left={() => (
                                        <Avatar.Image size={50} source={{ uri: sv.avatar_path }} />
                                    )} />

                                <Card.Content>
                                    <Text variant="titleLarge">Khoa: {sv.khoa.name}</Text>
                                    <Text variant="titleLarge" style={{ marginTop: 5 }}>Lớp: {sv.lop.name}</Text>
                                    <Text variant="titleLarge" style={{ marginTop: 10 }}>
                                        <Button textColor="#808080" icon="chevron-double-right" mode="text" onPress={() =>
                                            navigation.navigate("UserSV Detail", { nguoidungID: sv.id })
                                        }>
                                            Xem chi tiết
                                        </Button>
                                    </Text>
                                </Card.Content>
                            </Card> :
                            sv.first_name.includes(search) || sv.last_name.includes(search) || sv.khoa.name.includes(search) || sv.lop.name.includes(search) || sv.mssv.includes(search) || sv.email.includes(search) ?
                                <>
                                    <Card style={{ marginTop: 10 }} onPress={() =>
                                        navigation.navigate("UserSV Detail", { nguoidungID: sv.id })
                                    }>
                                    <Card.Title title={sv.last_name + " " + sv.first_name} subtitle={"Email: " + sv.email}
                                        left={() => (
                                            <Avatar.Image size={50} source={{ uri: sv.avatar_path }} />
                                        )} />

                                    <Card.Content>
                                        <Text variant="titleLarge">Khoa: {sv.khoa.name}</Text>
                                        <Text variant="titleLarge" style={{ marginTop: 5 }}>Lớp: {sv.lop.name}</Text>
                                        <Text variant="titleLarge" style={{ marginTop: 10 }}>
                                            <Button textColor="#808080" icon="chevron-double-right" mode="text" onPress={() =>
                                                navigation.navigate("UserSV Detail", { nguoidungID: sv.id })
                                            }>
                                                Xem chi tiết
                                            </Button>
                                        </Text>
                                    </Card.Content>
                                </Card>
                    </>
                            :
                <></>
                        }

            </>
                ))}
            <>

                <View style={{ flexDirection: "row", marginTop: 10, alignSelf: "center" }}>
                    <Button disabled={page === 1} icon="arrow-left" mode="outlined" onPress={() => setPage(page - 1)}>

                    </Button>
                    <Text style={{ marginLeft: 20, marginRight: 20 }} variant="headlineLarge">{page}</Text>
                    <Button disabled={page === Math.ceil(sv.count / 3)} contentStyle={{ flexDirection: "row-reverse" }} icon="arrow-right" mode="outlined" onPress={() => setPage(page + 1)}>

                    </Button>
                </View>
            </>

        </>}
        </ScrollView >
    )
}

export default FindSV;