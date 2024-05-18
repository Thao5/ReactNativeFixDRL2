import { useEffect, useRef, useState } from "react";
import Moment from "moment";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { ActivityIndicator, Button, List, MD2Colors, MD3Colors, Text, TextInput } from "react-native-paper";
import { ScrollView, StyleSheet, View } from "react-native";
import Api, { authApi, endpoints } from "../../ApisService/Api";
import {
    RichEditor,
    RichToolbar,
    actions,
} from "react-native-pell-rich-editor";
import { SafeAreaView } from "react-native-safe-area-context";
import { Dropdown } from "react-native-element-dropdown";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AddActivity = () => {
    const [activity, setActivity] = useState({
        "name": "",
        "mo_ta": "",
        "ngay_du_kien": "",
        "ngay_dien_ra": "",
        "ngay_het": "",
        "diem_cong": "",
        "quy_che": "",
        "tag_ids": "",
        "hoc_ki_id": "",
    })

    const [quyche, setQuyChe] = useState(null);
    const [quycheID, setQuyCheID] = useState(1);

    const [tag, setTag] = useState(null);
    const [tagID, setTagID] = useState(null);

    const [idHK, setIDHK] = useState(null);
    const [hocki, setHocKi] = useState(null);

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const [isFocusQuyChe, setIsFocusQuyChe] = useState(false);

    const [isFocusTag, setIsFocusTag] = useState(false);

    const [isFocusHocKi, setIsFocusHocKi] = useState(false);

    const [loading, setLoading] = useState();

    const richText = useRef();

    const [descHTML, setDescHTML] = useState("");
    const [showDescError, setShowDescError] = useState(false);

    const [NgayDuKien_date, NgayDuKien_setDate] = useState("");
    const [NgayDienRa_date, NgayDienRa_setDate] = useState("");
    const [NgayHet_date, NgayHet_setDate] = useState("");

    const richTextHandle = (descriptionText) => {
        if (descriptionText) {
            setShowDescError(false);
            setDescHTML(descriptionText);
        } else {
            setShowDescError(true);
            setDescHTML("");
        }
    };

    // const submitContentHandle = async () => {
    //     const replaceHTML = descHTML.replace(/<(.|\n)*?>/g, "").trim();
    //     const replaceWhiteSpace = replaceHTML.replace(/&nbsp;/g, "").trim();

    //     if (replaceWhiteSpace.length <= 0) {
    //         setShowDescError(true);
    //     } else {
    //         let form = new FormData();
    //         if (descHTML !== "") {
    //             form.append("content", descHTML);
    //         }
    //         // let token = await AsyncStorage.getItem("token-access");
    //         // const res = await authApi(token).post(
    //         //     endpoints["hoatdong_comment"](hoadtdongID),
    //         //     form,
    //         //     {
    //         //         headers: {
    //         //             "Content-Type": "multipart/form-data",
    //         //         },
    //         //     }
    //         // );
    //         // send data to your server!
    //     }
    // };

    const renderLabel = () => {
        if (isFocusQuyChe) {
            return (
                <Text style={[styles.label, isFocusQuyChe && { color: "dimgray" }]}>
                    Select Quy chế
                </Text>
            );
        }
        return null;
    };

    const renderLabelTag = () => {
        if (isFocusTag) {
            return (
                <Text style={[styles.label, isFocusTag && { color: "dimgray" }]}>
                    Select Tag
                </Text>
            );
        }
        return null;
    };


    const renderLabelHocKi = () => {
        if (isFocusHocKi) {
            return (
                <Text style={[styles.label, isFocusHocKi && { color: "dimgray" }]}>
                    Select Hoc kì
                </Text>
            );
        }
        return null;
    };
    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        // console.warn("A date has been picked: ", date);
        NgayDuKien_setDate(date);
        change("ngay_du_kien", Moment(date).format("YYYY-MM-DD"));
        hideDatePicker();
    };

    const [NgayDienRa_isDatePickerVisible, NgayDienRa_setDatePickerVisibility] =
        useState(false);

    const NgayDienRa_showDatePicker = () => {
        NgayDienRa_setDatePickerVisibility(true);
    };

    const NgayDienRa_hideDatePicker = () => {
        NgayDienRa_setDatePickerVisibility(false);
    };

    const NgayDienRa_handleConfirm = (date) => {
        // console.warn("A date has been picked: ", date);
        NgayDienRa_setDate(date);
        change("ngay_dien_ra", Moment(date).format("YYYY-MM-DD"));
        NgayDienRa_hideDatePicker();
    };

    const [NgayHet_isDatePickerVisible, NgayHet_setDatePickerVisibility] =
        useState(false);

    const NgayHet_showDatePicker = () => {
        NgayHet_setDatePickerVisibility(true);
    };

    const NgayHet_hideDatePicker = () => {
        NgayHet_setDatePickerVisibility(false);
    };

    const NgayHet_handleConfirm = (date) => {
        // console.warn("A date has been picked: ", date);
        NgayHet_setDate(date);
        change("ngay_het", Moment(date).format("YYYY-MM-DD"));
        NgayHet_hideDatePicker();
    };

    useEffect(() => {
        if (NgayDuKien_date === "") {
            NgayDuKien_setDate(new Date());
        }
        if (NgayDienRa_date === "") {
            NgayDienRa_setDate(new Date());
        }
        if (NgayHet_date === "") {
            NgayHet_setDate(new Date());
        }

        const loadQuyChe = async () => {
            const res = await Api.get(endpoints["quyches"])
            setQuyChe(res.data.results)
        }

        const loadTag = async () => {
            const res = await Api.get(endpoints["tags"])
            setTag(res.data.results)
        }

        const loadHocKi = async () => {
            const res = await Api.get(endpoints['hockis'])
            setHocKi(res.data.results)
            // console.warn(hocki)
        }

        loadHocKi();

        loadTag();

        loadQuyChe();
    }, [])


    const addActivity = () => {
        const process = async () => {
            setLoading(true);
            try {
                // const newImageUri =
                //     "file:///" + user["avatar"].uri.split("file:/").join("");
                let form = new FormData();
                for (key in activity) {
                    // if (key === "avatar") {
                    //     form.append(key, {
                    //         uri: newImageUri,
                    //         name: newImageUri.split("/").pop(),
                    //         type: mime.getType(newImageUri),
                    //     });
                    // } else {
                    if (key !== "confirmPass") {
                        form.append(key, activity[key]);
                    }
                    // }
                }
                const replaceHTML = descHTML.replace(/<(.|\n)*?>/g, "").trim();
                const replaceWhiteSpace = replaceHTML.replace(/&nbsp;/g, "").trim();

                if (replaceWhiteSpace.length <= 0) {
                    setShowDescError(true);
                } else {
                    // let form = new FormData();
                    if (descHTML !== "") {
                        form.append("mo_ta", descHTML);
                    }
                }
                console.warn(form);
                let token = await AsyncStorage.getItem("token-access");
                const res = await authApi(token).post(endpoints["hoatdongs"], form, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                console.warn(res.data);

                // navigation.navigate("Login");
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        if (
            NgayHet_date < NgayDienRa_date || activity.name === null ||
            activity.hoc_ki_id === null || activity.diem_cong > 10
        ) {
            console.info("Failed!!");
        } else {
            process();
        }
    };


    const change = (field, value) => {
        setActivity((current) => {
            return { ...current, [field]: value };
        });
    };

    return (
        <ScrollView style={{ marginTop: 20, marginBottom: 20 }}>
            <List.Section>
                <List.Subheader>
                    <TextInput.Icon icon="shield-account" />
                    Thông tin hoạt động
                </List.Subheader>
                {/* <List.Item
              title={() => (
                <TextInput
                  value={user.username}
                  onChangeText={(t) => change("username", t)}
                  label="Username"
                />
              )}
              left={() => <List.Icon icon="shield-account-outline" />}
            /> */}
                <List.Item
                    title={() => (
                        <TextInput
                            value={activity.name}
                            onChangeText={(t) => change("name", t)}
                            label="Tên hoạt động"
                            placeholder="Tên hoạt động"
                        />
                    )}
                    left={() => (
                        <List.Icon
                            color={MD3Colors.tertiary70}
                            icon="form-textbox-password"
                        />
                    )}
                />
                <List.Item
                    title={() => (
                        <SafeAreaView
                            edges={["bottom", "left", "right"]}
                            style={{ flex: 1 }}
                        >
                            <View style={styles.container1}>
                                {/* <Pressable
                                    onPress={() =>
                                      richText.current?.dismissKeyboard()
                                    }
                                  >
                                    <Text style={styles.headerStyle}>
                                      Your awesome Content
                                    </Text>
                                    <View style={styles.htmlBoxStyle}>
                                      <Text>{descHTML}</Text>
                                    </View>
                                  </Pressable> */}
                                <View style={styles.richTextContainer}>
                                    <RichEditor
                                        ref={richText}
                                        onChange={richTextHandle}
                                        placeholder="Write your cool content here :)"
                                        androidHardwareAccelerationDisabled={true}
                                        style={styles.richTextEditorStyle}
                                        initialHeight={250}
                                    />
                                    <RichToolbar
                                        editor={richText}
                                        selectedIconTint="#873c1e"
                                        iconTint="#312921"
                                        actions={[
                                            actions.insertImage,
                                            actions.setBold,
                                            actions.setItalic,
                                            actions.insertBulletsList,
                                            actions.insertOrderedList,
                                            actions.insertLink,
                                            actions.setStrikethrough,
                                            actions.setUnderline,
                                        ]}
                                        style={styles.richTextToolbarStyle}
                                    />
                                </View>
                                {showDescError && (
                                    <Text style={styles.errorTextStyle}>
                                        Your content shouldn't be empty 🤔
                                    </Text>
                                )}

                                {/* <View style={{ flexDirection: "row" }}>
                                    <TouchableOpacity
                                        style={styles.saveButtonStyle}
                                        onPress={() => submitContentHandle(hd.id)}
                                    >
                                        <Text style={styles.textButtonStyle}>
                                            Gửi
                                        </Text>
                                    </TouchableOpacity>

                                </View> */}
                            </View>
                        </SafeAreaView>
                    )}
                    left={() => (
                        <List.Icon
                            color={MD3Colors.tertiary50}
                            icon="ticket-confirmation-outline"
                        />
                    )}
                />
                <List.Item
                    title={() => (
                        <TextInput
                            label="Điểm cộng"
                            placeholder="Điểm cộng(không vượt quá 10)..."
                            value={activity.diem_cong}
                            inputMode="numeric"
                            keyboardType="number-pad"
                            textContentType="num"
                            onChangeText={(t) => change("diem_cong", t)}
                        />
                    )}
                    left={() => (
                        <List.Icon color={MD3Colors.tertiary30} icon="cellphone" />
                    )}
                />
                {quyche === null || tag === null || hocki === null ? (
                    <ActivityIndicator animating={true} color={MD2Colors.red800} />
                ) : (
                    <>
                        <List.Item
                            title={() => (
                                <View style={styles.container}>
                                    {renderLabel()}
                                    <Dropdown
                                        style={[
                                            styles.dropdown,
                                            isFocusQuyChe && { borderColor: "dimgray" },
                                        ]}
                                        placeholderStyle={styles.placeholderStyle}
                                        selectedTextStyle={styles.selectedTextStyle}
                                        inputSearchStyle={styles.inputSearchStyle}
                                        iconStyle={styles.iconStyle}
                                        data={quyche}
                                        search
                                        maxHeight={300}
                                        labelField="name"
                                        valueField="id"
                                        placeholder={!isFocusQuyChe ? "Quy chế" : "..."}
                                        searchPlaceholder="Search..."
                                        value={activity.quy_che}
                                        onFocus={() => setIsFocusQuyChe(true)}
                                        onBlur={() => setIsFocusQuyChe(false)}
                                        onChange={(item) => {
                                            change("quy_che", item.id);
                                            // console.warn(user.khoa_id);
                                            setIsFocusQuyChe(false);
                                        }}
                                    />
                                </View>
                            )}
                            left={() => (
                                <List.Icon
                                    color={MD3Colors.error30}
                                    icon="numeric-1-box-multiple-outline"
                                />
                            )}
                        />
                        <List.Item
                            title={() => (
                                <View style={styles.container}>
                                    {renderLabelTag()}
                                    <Dropdown
                                        style={[
                                            styles.dropdown,
                                            isFocusTag && { borderColor: "dimgray" },
                                        ]}
                                        placeholderStyle={styles.placeholderStyle}
                                        selectedTextStyle={styles.selectedTextStyle}
                                        inputSearchStyle={styles.inputSearchStyle}
                                        iconStyle={styles.iconStyle}
                                        data={tag}
                                        search
                                        maxHeight={300}
                                        labelField="name"
                                        valueField="id"
                                        placeholder={!isFocusTag ? "Tag" : "..."}
                                        searchPlaceholder="Search..."
                                        value={activity.tag_ids}
                                        onFocus={() => setIsFocusTag(true)}
                                        onBlur={() => setIsFocusTag(false)}
                                        onChange={(item) => {
                                            change("tag_ids", item.id);
                                            // console.warn(user.lop_id);
                                            setIsFocusTag(false);
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
                        <List.Item
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
                                        placeholder={!isFocusHocKi ? "Học kì" : "..."}
                                        searchPlaceholder="Search..."
                                        value={activity.hoc_ki_id}
                                        onFocus={() => setIsFocusHocKi(true)}
                                        onBlur={() => setIsFocusHocKi(false)}
                                        onChange={(item) => {
                                            change("hoc_ki_id", item.id);
                                            // console.warn(user.lop_id);
                                            setIsFocusHocKi(false);
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
                    </>
                )}
            </List.Section>

            <List.Section>
                <List.Subheader>
                    <TextInput.Icon icon="calendar-edit" />
                    Ngày - Tháng - Năm
                </List.Subheader>
                <List.Item
                    title={() => (
                        <>
                            <TextInput
                                label="Ngày dự kiến"
                                textColor="black"
                                disabled={true}
                                defaultValue={Moment(new Date()).format("YYYY-MM-DD")}
                                value={Moment(NgayDuKien_date).format("YYYY-MM-DD")}
                            ></TextInput>
                            {/* {date !== "" ? Moment(date).format('MM/DD/YYYY') : Moment(new Date()).format('MM/DD/YYYY')}</Text> */}
                            <DateTimePickerModal
                                isVisible={isDatePickerVisible}
                                mode="date"
                                onConfirm={handleConfirm}
                                onCancel={hideDatePicker}
                            />
                        </>
                    )}
                    right={() => (
                        // <Button icon="calendar-check" mode="text" onPress={showDatePicker} />
                        <Button labelStyle={{ fontSize: 25 }} contentStyle={{ start: 8, top: 4 }} icon="calendar-month-outline" onPress={showDatePicker} buttonColor="white" dark={false} mode="elevated">

                        </Button>
                    )}
                />
                <List.Item
                    title={() => (
                        <>
                            <TextInput
                                label="Ngày diễn ra"
                                textColor="black"
                                disabled={true}
                                defaultValue={Moment(new Date()).format("YYYY-MM-DD")}
                                value={Moment(NgayDienRa_date).format("YYYY-MM-DD")}
                            ></TextInput>
                            {/* {date !== "" ? Moment(date).format('MM/DD/YYYY') : Moment(new Date()).format('MM/DD/YYYY')}</Text> */}
                            <DateTimePickerModal
                                isVisible={NgayDienRa_isDatePickerVisible}
                                mode="date"
                                onConfirm={NgayDienRa_handleConfirm}
                                onCancel={NgayDienRa_hideDatePicker}
                            />
                        </>
                    )}
                    right={() => (
                        // <Button icon="calendar-check" mode="text" onPress={showDatePicker} />
                        <Button labelStyle={{ fontSize: 25 }} contentStyle={{ start: 8, top: 4 }} icon="calendar-start" onPress={NgayDienRa_showDatePicker} buttonColor="white" dark={false} mode="elevated">

                        </Button>
                    )}
                />
                <List.Item
                    title={() => (
                        <>
                            <TextInput
                                label="Ngày hết"
                                textColor="black"
                                disabled={true}
                                defaultValue={Moment(new Date()).format("YYYY-MM-DD")}
                                value={Moment(NgayHet_date).format("YYYY-MM-DD")}
                            ></TextInput>
                            {/* {date !== "" ? Moment(date).format('MM/DD/YYYY') : Moment(new Date()).format('MM/DD/YYYY')}</Text> */}
                            <DateTimePickerModal
                                isVisible={NgayHet_isDatePickerVisible}
                                mode="date"
                                onConfirm={NgayHet_handleConfirm}
                                onCancel={NgayHet_hideDatePicker}
                            />
                        </>
                    )}
                    right={() => (
                        // <Button icon="calendar-check" mode="text" onPress={showDatePicker} />
                        <Button labelStyle={{ fontSize: 25 }} contentStyle={{ start: 8, top: 4 }} icon="calendar-end" onPress={NgayHet_showDatePicker} mode="elevated" buttonColor="white" dark={false}>

                        </Button>
                    )}
                />
            </List.Section>
            {loading === true ? (
                <ActivityIndicator
                    style={{ marginTop: 20 }}
                    animating={true}
                    color={MD2Colors.red800}
                />
            ) : (
                <>
                    <Button
                        icon="plus"
                        mode="contained-tonal"
                        style={{ marginTop: 20 }}
                        onPress={addActivity}
                    >
                        Sign Up
                    </Button>
                </>
            )}
        </ScrollView>
    );
}

export default AddActivity;

const styles = StyleSheet.create({
    textAreaContainer: {
        borderColor: MD2Colors.amber50,
        borderWidth: 1,
        padding: 5,
    },
    textArea: {
        height: 150,
        justifyContent: "flex-start",
    },
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
        backgroundColor: "pink",
        alignItems: "center",
        justifyContent: "center",
    },
    container1: {
        flex: 1,
        height: "100%",
        backgroundColor: "#ccaf9b",
        padding: 20,
        alignItems: "center",
    },

    headerStyle: {
        fontSize: 20,
        fontWeight: "600",
        color: "#312921",
        marginBottom: 10,
    },

    htmlBoxStyle: {
        height: 200,
        width: 330,
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
        marginBottom: 10,
    },

    richTextContainer: {
        display: "flex",
        flexDirection: "column-reverse",
        width: "100%",
        marginBottom: 10,
    },

    richTextEditorStyle: {
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        borderWidth: 1,
        borderColor: "#ccaf9b",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
        fontSize: 20,
    },

    richTextToolbarStyle: {
        backgroundColor: "#c6c3b3",
        borderColor: "#c6c3b3",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderWidth: 1,
    },

    errorTextStyle: {
        color: "#FF0000",
        marginBottom: 10,
    },

    saveButtonStyle: {
        backgroundColor: "#c6c3b3",
        borderWidth: 1,
        borderColor: "#c6c3b3",
        borderRadius: 10,
        padding: 10,
        width: "25%",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
        fontSize: 20,
    },

    textButtonStyle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#312921",
    },
});
