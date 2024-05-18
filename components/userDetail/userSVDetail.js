import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Avatar,
  Button,
  Card,
  MD2Colors,
  Text,
} from "react-native-paper";
// import userContext from "../../Context/userContext/userContext";
import { ScrollView, StyleSheet, View } from "react-native";
import Api, { endpoints } from "../../ApisService/Api";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";

// const StackNavigate = createNativeStackNavigator();

export default NguoiDungSVDetail = ({ route }) => {
  const [usersv, setUsersv] = useState(null);
  const [diem, setDiem] = useState(null)
  const [idHK, setIDHK] = useState(1);
  const [hocki, setHocKi] = useState(null);

  const { nguoidungID } = route.params;

  useEffect(() => {
    const load = async () => {
      const res = await Api.get(endpoints['usersvs_detail'](JSON.stringify(nguoidungID)))
      setUsersv(res.data)
      // console.warn(res.data)
    };

    const loadDiem = async () => {
      // let token = await AsyncStorage.getItem("token-access");
      const res = await Api.get(endpoints['usersvs_detail_thanhtichs'](JSON.stringify(nguoidungID)))
      setDiem(res.data)
      // console.warn(diem)
    };

    const loadHocKi = async () => {
      const res = await Api.get(endpoints['hockis'])
      setHocKi(res.data.results)
      // console.warn(hocki)
    }

    loadDiem();
    loadHocKi();
    load();
  }, []);

  return (
    <>
      <ScrollView>
        {usersv === null ? (
          <ActivityIndicator animating={true} color={MD2Colors.red800} />
        ) : (
          <>
            <Avatar.Image
              style={{ alignSelf: "center" }}
              size={150}
              source={{ uri: usersv.avatar_path }}
            />
            <Card>
              <Card.Content>
                <Text style={{ alignSelf: "center" }} variant="titleLarge">
                  {usersv.mssv}
                </Text>
                <View style={style.row}>
                  <Text variant="titleMedium">Họ và Tên: </Text>
                  <Text style={style.end} variant="titleMedium">
                    {" "}
                    {usersv.last_name} {usersv.first_name}
                  </Text>
                </View>
                <View style={style.row}>
                  <Text variant="titleMedium">Email: </Text>
                  <Text style={style.end} variant="titleMedium">
                    {usersv.email}
                  </Text>
                </View>
                <View style={style.row}>
                  <Text variant="titleMedium">Phone: </Text>
                  <Text style={style.end} variant="titleMedium">
                    {usersv.phone}
                  </Text>
                </View>
                <View style={style.row}>
                  <Text variant="titleMedium">username: </Text>
                  <Text style={style.end} variant="titleMedium">
                    {usersv.username}
                  </Text>
                </View>
                <View style={style.row}>
                  <Text variant="titleMedium">Ngày Sinh: </Text>
                  <Text style={style.end} variant="titleMedium">
                    {usersv.ngay_sinh}
                  </Text>
                </View>
                <View style={style.row}>
                  <Text variant="titleMedium">Ngày Nhập Học: </Text>
                  <Text style={style.end} variant="titleMedium">
                    {usersv.ngay_nhap_hoc}
                  </Text>
                </View>
              </Card.Content>
            </Card>
            {diem === null ? <ActivityIndicator animating={true} color={MD2Colors.red800} /> : <>
              <View style={{ alignSelf: "center", marginTop: 20, justifyContent: "center", alignContent: "center", alignItems: "center" }}>
                {hocki == null ? <ActivityIndicator animating={true} color={MD2Colors.red800} /> : <>
                  <View style={{ flexDirection: "row", justifyContent: "center" }}>{hocki.map((hk) => (
                    <Button style={{ marginLeft: 5 }} mode="outlined" onPress={() => {
                      setIDHK(hk.id)
                    }}>
                      {hk.name}
                    </Button>
                  ))}</View>
                </>}

                {diem.map((mark) => (
                  <>
                    {mark.hoc_ki.id === idHK ? <><Text variant="displayMedium">{mark.hoc_ki.name}</Text>
                      <AnimatedCircularProgress style={{ marginTop: 20 }}
                        size={120}
                        width={15}
                        fill={mark.diem}
                        tintColor={mark.diem >= 80 ? "#00e0ff" : mark.diem >= 50 && mark.diem < 80 ? "#DAA520" : "#B22222"}
                        onAnimationComplete={() => console.log('onAnimationComplete')}
                        lineCap="round"
                        arcSweepAngle={180}
                        rotation={-90}
                        duration={1000}
                        tintTransparency={true}
                        backgroundColor="#3d5875">
                        {(fill) => (
                          <Text>
                            {mark.diem} / 100
                          </Text>
                        )}
                      </AnimatedCircularProgress>

                      <View style={{ flexDirection: "row" }}>
                        <Text style={{ alignSelf: "flex-start", textAlign: "left", alignContent: "flex-start" }} variant="titleLarge">Xếp loại: </Text>
                        <Text style={{ color: mark.diem >= 80 ? "#008000" : mark.diem >= 50 && mark.diem < 80 ? "#DAA520" : "#B22222" }} variant="titleLarge">{mark.thanh_tich}</Text>
                      </View></> : <></>}
                  </>
                ))}
              </View>
            </>}
          </>
        )}
      </ScrollView>
    </>
  );
};

const style = StyleSheet.create({
  row: {
    flexDirection: "row",
  },
  end: {
    textAlign: "right",
    right: 0,
    position: "absolute",
  },
});
