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
import Api, { apiLogin, endpoints } from "../../ApisService/Api";
import { Dropdown } from "react-native-element-dropdown";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Moment from "moment";
import mime from "mime";

import { getDatabase, ref, set } from "firebase/database";

export default Signup = ({ navigation }) => {
  const [khoa, setKhoa] = React.useState(null);
  const [lop, setLop] = React.useState(null);
  const [date, setDate] = React.useState("");
  const [NgaySinh_date, NgaySinh_setDate] = React.useState("");

  const DateNow = new Date();
  const DateFormatNow = Moment(DateNow).format("YYYY-MM-DD");

  React.useEffect(() => {
    if (date === "") {
      setDate(new Date());
    }
    if (NgaySinh_date === "") {
      NgaySinh_setDate(new Date());
    }
    const loadKhoa = async () => {
      const res = await Api.get(endpoints["khoas"]);
      setKhoa(res.data.results);
      console.info(res.data.results);
      console.info(Moment(new Date()).format("YYYY-MM-DD"));
    };

    const loadLop = async () => {
      const res = await Api.get(endpoints["lops"]);
      setLop(res.data.results);
      console.info(lop);
    };

    loadKhoa();
    loadLop();
  }, []);

  // if (khoa === null || lop === null) {
  //   return <ActivityIndicator animating={true} color={MD2Colors.red800} />;
  // }

  const [isDatePickerVisible, setDatePickerVisibility] = React.useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    // console.warn("A date has been picked: ", date);
    setDate(date);
    change("ngay_nhap_hoc", Moment(date).format("YYYY-MM-DD"));
    hideDatePicker();
  };

  const [NgaySinh_isDatePickerVisible, NgaySinh_setDatePickerVisibility] =
    React.useState(false);

  const NgaySinh_showDatePicker = () => {
    NgaySinh_setDatePickerVisibility(true);
  };

  const NgaySinh_hideDatePicker = () => {
    NgaySinh_setDatePickerVisibility(false);
  };

  const NgaySinh_handleConfirm = (date) => {
    // console.warn("A date has been picked: ", date);
    NgaySinh_setDate(date);
    change("ngay_sinh", Moment(date).format("YYYY-MM-DD"));
    NgaySinh_hideDatePicker();
  };

  const validRegexEmail =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@ou.edu.vn/;
  const validRegexPhone = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;

  const [text, setText] = React.useState("");

  const [user, setUser] = React.useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    khoa_id: "",
    lop_id: "",
    password: "",
    confirmPass: "",
    ngay_sinh: "",
    ngay_nhap_hoc: "",
    avatar: "",
  });

  const [loading, setLoading] = React.useState();

  const [showPass, setShow] = React.useState(false);

  const [value, setValue] = React.useState(null);
  const [isFocus, setIsFocus] = React.useState(false);

  const [isFocusLop, setIsFocusLop] = React.useState(false);

  const renderLabel = () => {
    if (isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: "dimgray" }]}>
          Select Khoa
        </Text>
      );
    }
    return null;
  };

  const getCurrentDate = () => {
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();

    //Alert.alert(date + '-' + month + '-' + year);
    // You can turn it in to your desired format
    return year + "/" + month + "/" + date; //format: d-m-y;
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

  const showPassword = () => {
    setShow(!showPass);
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
        console.warn(form.getAll("avatar"));
        const res = await Api.post(endpoints["usersvs"], form, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        // if (res.status === 201) {
        //   const db = getDatabase();
        //   set(ref(db, 'users/' + userId), {
        //     username: name,
        //     email: email,
        //     profile_picture: imageUrl
        //   });
        // }

        // console.info(res.data);

        navigation.navigate("Login");
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
              value={user.confirmPass}
              onChangeText={(t) => change("confirmPass", t)}
              label="Confirm Password"
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
            <>
              <TextInput
                label="Ngày sinh"
                textColor="black"
                disabled={true}
                defaultValue={Moment(new Date()).format("YYYY-MM-DD")}
                value={Moment(NgaySinh_date).format("YYYY-MM-DD")}
              ></TextInput>
              {/* {date !== "" ? Moment(date).format('MM/DD/YYYY') : Moment(new Date()).format('MM/DD/YYYY')}</Text> */}
              <DateTimePickerModal
                isVisible={NgaySinh_isDatePickerVisible}
                mode="date"
                onConfirm={NgaySinh_handleConfirm}
                onCancel={NgaySinh_hideDatePicker}
              />
            </>
          )}
          right={() => (
            // <Button icon="calendar-check" mode="text" onPress={showDatePicker} />
            <Button onPress={NgaySinh_showDatePicker} mode="contained-tonal">
              <List.Icon icon="calendar-check" />
            </Button>
          )}
        />
        <List.Subheader>
          <TextInput.Icon icon="school" />
          School Information
        </List.Subheader>
        {khoa === null || lop === null ? (
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
                      isFocus && { borderColor: "dimgray" },
                    ]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    data={khoa}
                    search
                    maxHeight={300}
                    labelField="name"
                    valueField="id"
                    placeholder={!isFocus ? "Khoa" : "..."}
                    searchPlaceholder="Search..."
                    value={user.khoa_id}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onChange={(item) => {
                      change("khoa_id", item.id);
                      console.warn(user.khoa_id);
                      setIsFocus(false);
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
                    valueField="id"
                    placeholder={!isFocusLop ? "Lop" : "..."}
                    searchPlaceholder="Search..."
                    value={user.lop_id}
                    onFocus={() => setIsFocusLop(true)}
                    onBlur={() => setIsFocusLop(false)}
                    onChange={(item) => {
                      change("lop_id", item.id);
                      console.warn(user.lop_id);
                      setIsFocusLop(false);
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
        <List.Item
          title={() => (
            <>
              <TextInput
                label="Ngày nhập học"
                textColor="black"
                disabled={true}
                defaultValue={Moment(new Date()).format("YYYY-MM-DD")}
                value={Moment(date).format("YYYY-MM-DD")}
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
            <Button onPress={showDatePicker} mode="contained-tonal">
              <List.Icon icon="calendar-check" />
            </Button>
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
            Sign Up
          </Button>
        </>
      )}
    </ScrollView>
  );
};

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
