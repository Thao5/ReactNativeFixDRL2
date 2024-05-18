import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Avatar,
  Button,
  Card,
  MD2Colors,
  Text,
} from "react-native-paper";
import userContext from "../../Context/userContext/userContext";
import { ScrollView, StyleSheet, View } from "react-native";
import Api, { authApi, endpoints } from "../../ApisService/Api";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import AsyncStorage from "@react-native-async-storage/async-storage";



// const StackNavigate = createNativeStackNavigator();

export default NguoiDungDetail = () => {
  const [user] = useContext(userContext);
  const [diem, setDiem] = useState(null)
  const [idHK, setIDHK] = useState(null);
  const [hocki, setHocKi] = useState(null);

  useEffect(() => {
    const load = async () => {
      let token = await AsyncStorage.getItem("token-access");
      const res = await authApi(token).get(endpoints['usersvs_detail_thanhtichs'](user.userdata.id))
      setDiem(res.data)
      // console.warn(diem)
    };

    const loadHocKi = async () => {
      const res = await Api.get(endpoints['hockis'])
      setHocKi(res.data.results)
      // console.warn(hocki)
    }

    loadHocKi()
    load();
  }, []);

  return (
    <>
      <View>
        {user === null ? (
          <ActivityIndicator animating={true} color={MD2Colors.red800} />
        ) : (
          <>
            <ScrollView>
              <Avatar.Image
                style={{ alignSelf: "center", marginTop: 10 }}
                size={150}
                source={{ uri: user.userdata.avatar_path }}
              />
              <Card style={{ marginTop: 10 }}>
                <Card.Content>
                  <Text style={{ alignSelf: "center" }} variant="titleLarge">
                    {user.userdata.mssv}
                  </Text>
                  <View style={style.row}>
                    <Text variant="titleMedium">Họ và Tên: </Text>
                    <Text style={style.end} variant="titleMedium">
                      {" "}
                      {user.userdata.last_name} {user.userdata.first_name}
                    </Text>
                  </View>
                  <View style={style.row}>
                    <Text variant="titleMedium">Email: </Text>
                    <Text style={style.end} variant="titleMedium">
                      {user.userdata.email}
                    </Text>
                  </View>
                  <View style={style.row}>
                    <Text variant="titleMedium">Phone: </Text>
                    <Text style={style.end} variant="titleMedium">
                      {user.userdata.phone}
                    </Text>
                  </View>
                  <View style={style.row}>
                    <Text variant="titleMedium">username: </Text>
                    <Text style={style.end} variant="titleMedium">
                      {user.userdata.username}
                    </Text>
                  </View>
                  <View style={style.row}>
                    <Text variant="titleMedium">Ngày Sinh: </Text>
                    <Text style={style.end} variant="titleMedium">
                      {user.userdata.ngay_sinh}
                    </Text>
                  </View>
                  <View style={style.row}>
                    <Text variant="titleMedium">Ngày Nhập Học: </Text>
                    <Text style={style.end} variant="titleMedium">
                      {user.userdata.ngay_nhap_hoc}
                    </Text>
                  </View>
                  <View style={style.row}>
                    <Text variant="titleMedium">Khoa: </Text>
                    <Text style={style.end} variant="titleMedium">
                      {user.userdata.khoa.name}
                    </Text>
                  </View>
                  <View style={style.row}>
                    <Text variant="titleMedium">Lớp: </Text>
                    <Text style={style.end} variant="titleMedium">
                      {user.userdata.lop.name}
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
            </ScrollView>
          </>
        )}
      </View>

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
