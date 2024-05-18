
import * as React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
    ActivityIndicator,
    Avatar,
    Button,
    Divider,
    List,
    MD2Colors,
    MD3Colors,
    Text,
    TextInput,
} from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import Api, { apiLogin, authApi, endpoints } from "../../ApisService/Api";
import mime from "mime";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AddTLSV = ({navigation}) => {

    // if (khoa === null || lop === null) {
    //   return <ActivityIndicator animating={true} color={MD2Colors.red800} />;
    // }

    const validRegexEmail =
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@ou.edu.vn/;
    const validRegexPhone = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;

    const [user, setUser] = React.useState({
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        password: "",
        confirmPass: "",
        avatar: "",
    });

    const [loading, setLoading] = React.useState();

    const [showPass, setShow] = React.useState(false);

    const [showPassConfirm, setShowConfirm] = React.useState(false);


    const showPassword = () => {
        setShow(!showPass);
    };

    const showPasswordConfirm = () => {
        setShowConfirm(!showPassConfirm);
    };

    const register = async () => {
        const process = async () => {
            setLoading(true);
            try {
                const newImageUri =
                    "file:///" + user["avatar"].uri.split("file:/").join("");
                let form = new FormData();
                for (key in user) {
                    if (key === "avatar") {
                        form.append(key, {
                            uri: newImageUri,
                            name: newImageUri.split("/").pop(),
                            type: mime.getType(newImageUri),
                        });
                    } else {
                        if (key !== "confirmPass") {
                            form.append(key, user[key]);
                        }
                    }
                }
                console.warn(form)
                let token = await AsyncStorage.getItem("token-access");;
                const res = await authApi(token).post(endpoints["user_tlsv"], form, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                // console.info(res.data);

                navigation.navigate("Home");
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        if (
            user.password !== user.confirmPass ||
            !user.email.match(validRegexEmail) ||
            !user.phone.match(validRegexPhone)
        ) {
            console.info("Failed!!");
        } else {
            process();
        }
    };

    const change = (field, value) => {
        setUser((current) => {
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
                change("avatar", res.assets[0]);
            }
        }
    };

    return (
        <ScrollView style={{ marginTop: 20, marginBottom: 20 }}>
            <List.Section>
                <List.Subheader>
                    <TextInput.Icon icon="shield-account" />
                    Security Account
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
                            value={user.username}
                            onChangeText={(t) => change("username", t)}
                            inputMode="text"
                            label="Username..."
                        />
                    )}
                    left={() => (
                        <List.Icon color={MD3Colors.primary40} icon="page-first" />
                    )}
                />
                <List.Item
                    title={() => (
                        <TextInput
                            placeholder="*******"
                            value={user.password}
                            onChangeText={(t) => change("password", t)}
                            label="Password"
                            secureTextEntry={!showPass}
                            right={
                                <TextInput.Icon
                                    onPressIn={showPassword}
                                    onPressOut={showPassword}
                                    icon="eye"
                                />
                            }
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
                        <TextInput
                            placeholder="*******"
                            value={user.confirmPass}
                            onChangeText={(t) => change("confirmPass", t)}
                            label="Confirm Password"
                            secureTextEntry={!showPassConfirm}
                            right={
                                <TextInput.Icon
                                    onPressIn={showPasswordConfirm}
                                    onPressOut={showPasswordConfirm}
                                    icon="eye"
                                />
                            }
                        />
                    )}
                    left={() => (
                        <List.Icon
                            color={MD3Colors.tertiary50}
                            icon="ticket-confirmation-outline"
                        />
                    )}
                />
            </List.Section>

            <List.Section>
                <List.Subheader>
                    <TextInput.Icon icon="account-circle" />
                    Personal Information
                </List.Subheader>
                <List.Item
                    title={() => (
                        <TextInput
                            placeholder="First Name..."
                            value={user.first_name}
                            onChangeText={(t) => change("first_name", t)}
                            inputMode="text"
                            label="First Name"
                            autoComplete="given-name"
                        />
                    )}
                    left={() => (
                        <List.Icon color={MD3Colors.primary40} icon="page-first" />
                    )}
                />
                <List.Item
                    title={() => (
                        <TextInput
                            placeholder="Last Name..."
                            value={user.last_name}
                            onChangeText={(t) => change("last_name", t)}
                            label="Last Name"
                            inputMode="text"
                            autoComplete="family-name"
                        />
                    )}
                    left={() => (
                        <List.Icon color={MD3Colors.tertiary50} icon="page-last" />
                    )}
                />
                <List.Item
                    title={() => (
                        <TextInput
                            placeholder="Phone Number..."
                            label="Phone"
                            value={user.phone}
                            inputMode="tel"
                            keyboardType="phone-pad"
                            autoComplete="tel"
                            textContentType="telephoneNumber"
                            onChangeText={(t) => change("phone", t)}
                        />
                    )}
                    left={() => (
                        <List.Icon color={MD3Colors.tertiary30} icon="cellphone" />
                    )}
                />
                <List.Item
                    title={() => (
                        <TextInput
                            placeholder="Email@ou.edu.vn"
                            label="Email"
                            value={user.email}
                            keyboardType="email-address"
                            inputMode="email"
                            autoComplete="email"
                            onChangeText={(t) => change("email", t)}
                        />
                    )}
                    left={() => (
                        <List.Icon color={MD3Colors.error20} icon="email-outline" />
                    )}
                />

                <List.Item
                    title={() => (
                        <Button icon="camera" mode="outlined" onPress={picker}>
                            Avatar
                        </Button>
                    )}
                />
                {/* <List.Item
          title={() => {
            user.avatar !== "" ? (
              <Image
                source={{ uri: user.avatar.uri }}
                style={{ width: 100, height: 100, margin: 10 }}
              ></Image>
            ) : (
              ""
            );
          }}
        /> */}
            </List.Section>
            <Divider />
            {user.avatar !== "" ? (
                <Avatar.Image
                    size={260}
                    source={{ uri: user.avatar.uri }}
                    style={{ alignSelf: "center" }}
                />
            ) : (
                ""
            )}
            <Divider />
            {loading === true ? (
                <ActivityIndicator
                    style={{ marginTop: 20 }}
                    animating={true}
                    color={MD2Colors.red800}
                />
            ) : (
                <>
                    <Button
                        icon="account-plus-outline"
                        mode="contained-tonal"
                        style={{ marginTop: 20 }}
                        onPress={register}
                    >
                        Thêm TLSV
                    </Button>
                </>
            )}
        </ScrollView>
    );
}

export default AddTLSV;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FFF8FA",
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