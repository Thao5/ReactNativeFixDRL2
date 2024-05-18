import { useEffect, useState } from "react";
import Api, { authApi, endpoints } from "../../ApisService/Api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, Button, Card, List, MD2Colors, MD3Colors, Modal, Portal, Text } from "react-native-paper";
import { Alert, Linking, StyleSheet, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { Dropdown } from "react-native-element-dropdown";
// import Pdf from "react-native-pdf";
// import Pdf from "react-native-pdf";

const ThongKe = () => {
    const [thongke, setThongKe] = useState(null);
    const [tkData, setTKData] = useState(null);
    const [visible, setVisible] = useState(false);
    const [mssv, setMSSV] = useState(null);

    const [hocki_name, setHocKiName] = useState('');
    const [hocki, setHocKi] = useState(null);
    const [lop_name, setLopName] = useState('');
    const [lop, setLop] = useState(null)
    const [thanhtich, setThanhTich] = useState('');

    const [isFocusThanhTich, setIsFocusThanhTich] = useState(false);

    const [isFocusHocKi, setIsFocusHocKi] = useState(false);

    const [isFocusLop, setIsFocusLop] = useState(false);

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    const containerStyle = { backgroundColor: 'white', padding: 20 };

    const thanhtichData = [
        { label: "Xuất sắc", value: "Xuất sắc" },
        { label: "Giỏi", value: "Giỏi" },
        { label: "Khá", value: "Khá" },
        { label: "Trung bình", value: "Trung bình" },
        { label: "Yếu", value: "Yếu" },
        { label: "Kém", value: "Kém" },
    ]

    const renderLabelThanhTich = () => {
        if (isFocusThanhTich) {
            return (
                <Text style={[styles.label, isFocusThanhTich && { color: "dimgray" }]}>
                    Select Thành Tích
                </Text>
            );
        }
        return null;
    };

    const renderLabelHocKi = () => {
        if (isFocusHocKi) {
            return (
                <Text style={[styles.label, isFocusHocKi && { color: "dimgray" }]}>
                    Select Học Kì
                </Text>
            );
        }
        return null;
    };


    const renderLabelLop = () => {
        if (isFocusLop) {
            return (
                <Text style={[styles.label, isFocusLop && { color: "dimgray" }]}>
                    Select Lop
                </Text>
            );
        }
        return null;
    };

    useEffect(() => {
        const loadThongKe = async () => {
            let token = await AsyncStorage.getItem("token-access");
            let e = endpoints['thanhtichs_thongketlsv'];
            if (hocki_name === '' && lop_name === '' && thanhtich === '') {
                const res = await authApi(token).get(e)
                setThongKe(res.data)
                let array = [];
                res.data.map((tk) => {
                    array.push({
                        value: tk.diem,
                        label: tk.mssv
                    })
                })
                setTKData(array)
            }

            if (hocki_name !== '' || lop_name !== '' || thanhtich !== '') {
                const res = await authApi(token).get(`${e}?hk=${hocki_name}&lop=${lop_name}&thanhtich=${thanhtich}`)
                setThongKe(res.data)
                let array = [];
                res.data.map((tk) => {
                    array.push({
                        value: tk.diem,
                        label: tk.mssv
                    })
                })
                setTKData(array)
            }


            // console.warn(res.data)

            // console.warn(array)
        }

        const loadLop = async () => {
            const res = await Api.get(endpoints["lops"]);
            setLop(res.data.results);
            console.info(lop);
        };

        const loadHocKi = async () => {
            const res = await Api.get(endpoints['hockis'])
            setHocKi(res.data.results)
            // console.warn(hocki)
        }

        loadHocKi();

        loadLop();

        loadThongKe();
    }, [thanhtich, hocki_name, lop_name])

    const thongkePDF = async () => {
        // let token = await AsyncStorage.getItem("token-access");
        // const res = await authApi(token).get(endpoints['thanhtichs_statpdftlsv'])
        // console.warn(res.data)

        const supported = await Linking.canOpenURL("https://2051050459thao.pythonanywhere.com/thanhtichs/statspdftlsv/");

        if (supported) {
            // Opening the link with some app, if the URL scheme is "http" the web link should be opened
            // by some browser in the mobile
            await Linking.openURL("https://2051050459thao.pythonanywhere.com/thanhtichs/statspdftlsv/");
        } else {
            Alert.alert(`Don't know how to open this URL`);
        }
    }

    const thongkeCSV = async () => {
        // let token = await AsyncStorage.getItem("token-access");
        // const res = await authApi(token).get(endpoints['thanhtichs_statcsvtlsv'])
        // console.warn(res.data)

        const supported = await Linking.canOpenURL("https://2051050459thao.pythonanywhere.com/thanhtichs/statscsvtlsv/");

        if (supported) {
            // Opening the link with some app, if the URL scheme is "http" the web link should be opened
            // by some browser in the mobile
            await Linking.openURL("https://2051050459thao.pythonanywhere.com/thanhtichs/statscsvtlsv/");
        } else {
            Alert.alert(`Don't know how to open this URL`);
        }
    }

    return (

        <View style={{ alignItems: "center", alignSelf: "center", justifyContent: "center", alignContent: "center" }}>
            <List.Section>
                <List.Subheader>Thống kê theo</List.Subheader>
                {hocki === null || lop === null ? <ActivityIndicator animating={true} color={MD2Colors.red800} /> : <><List.Item
                    title={() => (
                        <View style={styles.container}>
                            {renderLabelHocKi()}
                            <Dropdown
                                style={[
                                    styles.dropdown,
                                    isFocusHocKi && { borderColor: "dimgray" },
                                ]}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                iconStyle={styles.iconStyle}
                                data={hocki}
                                search
                                maxHeight={300}
                                labelField="name"
                                valueField="id"
                                placeholder={!isFocusHocKi ? "Học Kì" : "..."}
                                searchPlaceholder="Search..."
                                value={hocki_name}
                                onFocus={() => setIsFocusHocKi(true)}
                                onBlur={() => setIsFocusHocKi(false)}
                                onChange={(item) => {
                                    setHocKiName(item.id);
                                    // console.warn(user.lop_id);
                                    setIsFocusHocKi(false);
                                }} />
                        </View>
                    )}
                    left={() => (
                        <List.Icon
                            color={MD3Colors.neutral40}
                            icon="lightbulb-on-outline" />
                    )} /><List.Item
                        title={() => (
                            <View style={styles.container}>
                                {renderLabelLop()}
                                <Dropdown
                                    style={[
                                        styles.dropdown,
                                        isFocusLop && { borderColor: "dimgray" },
                                    ]}
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    inputSearchStyle={styles.inputSearchStyle}
                                    iconStyle={styles.iconStyle}
                                    data={lop}
                                    search
                                    maxHeight={300}
                                    labelField="name"
                                    valueField="name"
                                    placeholder={!isFocusLop ? "Lop" : "..."}
                                    searchPlaceholder="Search..."
                                    value={lop_name}
                                    onFocus={() => setIsFocusLop(true)}
                                    onBlur={() => setIsFocusLop(false)}
                                    onChange={(item) => {
                                        setLopName(item.name);
                                        // console.warn(user.lop_id);
                                        setIsFocusLop(false);
                                    }} />
                            </View>
                        )}
                        left={() => (
                            <List.Icon
                                color={MD3Colors.neutral40}
                                icon="lightbulb-on-outline" />
                        )} /></>}
                <List.Item
                    title={() => (
                        <View style={styles.container}>
                            {renderLabelThanhTich()}
                            <Dropdown
                                style={[
                                    styles.dropdown,
                                    isFocusLop && { borderColor: "dimgray" },
                                ]}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                iconStyle={styles.iconStyle}
                                data={thanhtichData}
                                search
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder={!isFocusThanhTich ? "Thành Tích" : "..."}
                                searchPlaceholder="Search..."
                                value={thanhtich}
                                onFocus={() => setIsFocusThanhTich(true)}
                                onBlur={() => setIsFocusThanhTich(false)}
                                onChange={(item) => {
                                    setThanhTich(item.value)
                                    // console.warn(user.lop_id);
                                    setIsFocusThanhTich(false);
                                }}
                            />
                        </View>
                    )}
                    left={() => (
                        <List.Icon
                            color={MD3Colors.neutral40}
                            icon="lightbulb-on-outline"
                        />
                    )}
                />
            </List.Section>
            {thongke === null ? <ActivityIndicator animating={true} color={MD2Colors.red800} /> :
                <><View>
                    <BarChart

                        barWidth={22}
                        barBorderRadius={4}
                        frontColor="#177AD5"
                        data={tkData}
                        yAxisThickness={0}
                        xAxisThickness={0}
                        onPress={(item, index) => {
                            showModal();
                            setMSSV(item.label);
                        }} />
                    {thongke.map((tk) => (
                        <Portal>
                            <Modal visible={visible && mssv === tk.mssv} onDismiss={hideModal} contentContainerStyle={containerStyle}>
                                {mssv === tk.mssv ? <Card>
                                    <Card.Title title={"Họ và Tên: " + tk.last_name + " " + tk.first_name} subtitle={"MSSV: " + tk.mssv} />
                                    <Card.Content>
                                        <Text variant="bodyMedium"> <Text variant="titleSmall">Điểm: </Text> {tk.diem}</Text>

                                    </Card.Content>
                                    {/* <Card.Cover source={{ uri: 'https://picsum.photos/700' }} /> */}
                                    {/* <Card.Actions>
                    <Button>Cancel</Button>
                    <Button>Ok</Button>
                </Card.Actions> */}
                                </Card> : <></>}

                            </Modal>
                        </Portal>
                    ))}
                    <Button buttonColor="red" dark={true} style={{ marginTop: 10 }} icon="file-pdf-box" mode="contained" onPress={() => thongkePDF()}>
                        In PDF
                    </Button>
                    <Button buttonColor="green" dark={true} style={{ marginTop: 10 }} icon="file-excel" mode="elevated" onPress={() => thongkeCSV()}>
                        In CSV
                    </Button>

                    {/* <Pdf style={styles.pdf} source={{uri: "http://127.0.0.1:8000/thanhtichs/statspdftlsv/"}}/> */}
                </View>
                </>
            }

        </View>
    )
}

export default ThongKe;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FFF8FA",
        width: 300
    },
    dropdown: {
        height: 50,
        borderColor: "gray",
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    icon: {
        marginRight: 5,
    },
    label: {
        position: "absolute",
        backgroundColor: "#FFF8FA",
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
});

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'flex-start',
//         alignItems: 'center',
//         marginTop: 25,
//     },
//     pdf: {
//         flex: 1,
//         width: Dimensions.get('window').width,
//         height: Dimensions.get('window').height,
//     }
// });