import { useCallback, useContext, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import userContext from "../../Context/userContext/userContext";
import MyFAB from "../MyFAB/MyFAB";
import Api, { authApi, endpoints } from "../../ApisService/Api";
import {
  ActivityIndicator,
  Avatar,
  Button,
  Card,
  Chip,
  Dialog,
  Divider,
  IconButton,
  MD2Colors,
  MD3Colors,
  Menu,
  Modal,
  Portal,
  TextInput,
} from "react-native-paper";
import RenderHTML from "react-native-render-html";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import {
  RichEditor,
  RichToolbar,
  actions,
} from "react-native-pell-rich-editor";

const LeftContent = (props) => <Avatar.Icon {...props} icon="lighthouse-on" />;
const { height } = Dimensions.get("window");

// const Stack = createNativeStackNavigator();

// function ActivityDetail(params) {
//   return (
//     <Stack.Navigator
//       screenOptions={{
//         headerShown: true,
//       }}
//     >
//       <Stack.Screen
//         name="Activity Detail"
//         component={HoatDongDetail}
//         initialParams={params}
//       />
//     </Stack.Navigator>
//   );
// }

const Home = ({ navigation }) => {
  const [user] = useContext(userContext);
  const [hoatdongs, setHoatDongs] = useState(null);

  const [idHD, setIDHD] = useState(null);

  const [idHDDangKy, setIDHDDangKy] = useState(null);

  const [idHDLike, setIDHDLike] = useState(null);

  const [idHDComment, setIDHDComment] = useState(null);

  const [idHDSV, setIDHDSV] = useState(null);

  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setIDHD(false);

  const [isHover, setHover] = useState(false);

  const [visibleModal, setVisibleModal] = useState(false);

  const showModal = () => setVisibleModal(true);
  const hideModal = () => setVisibleModal(false);
  const containerStyle = { backgroundColor: "white", padding: 20 };

  const [visibleModalSV, setVisibleModalSV] = useState(false);

  const showModalSV = () => setVisibleModalSV(true);
  const hideModalSV = () => setVisibleModalSV(false);
  // const containerStyle = { backgroundColor: "white", padding: 20 };

  const [refreshing, setRefreshing] = useState(false);

  const richText = useRef();

  const [descHTML, setDescHTML] = useState("");
  const [showDescError, setShowDescError] = useState(false);

  const [idSVDetail, setSVDetail] = useState(null)

  const [visibleDetailSV, setVisibleDetailSV] = useState(false);

  const openMenuDetailSV = () => setVisibleDetailSV(true);

  const closeMenuDetailSV = () => setVisibleDetailSV(false);

  const [visibleDialogAlert, setVisibleDialogAlert] = useState(false);

  const hideDialogAlert = () => setVisibleDialogAlert(false);

  const showDialogAlert = () => setVisibleDialogAlert(true);

  const richTextHandle = (descriptionText) => {
    if (descriptionText) {
      setShowDescError(false);
      setDescHTML(descriptionText);
    } else {
      setShowDescError(true);
      setDescHTML("");
    }
  };

  const checkEnter = (hoatdongSV) => {
    var id = user.userdata.id
    const arr = hoatdongSV
    var containsID = arr.find(x => x.id === id);
    if (containsID === undefined) {
      return false;
    } else return true
  }

  const submitContentHandle = async (hoadtdongID) => {
    const replaceHTML = descHTML.replace(/<(.|\n)*?>/g, "").trim();
    const replaceWhiteSpace = replaceHTML.replace(/&nbsp;/g, "").trim();

    if (replaceWhiteSpace.length <= 0) {
      setShowDescError(true);
    } else {
      let form = new FormData();
      if (descHTML !== "") {
        form.append("content", descHTML);
      }
      let token = await AsyncStorage.getItem("token-access");
      const res = await authApi(token).post(
        endpoints["hoatdong_comment"](hoadtdongID),
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // send data to your server!
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    const loadHoatDongs = async () => {
      const res = await Api.get(endpoints["hoatdongs"]);
      setHoatDongs(res.data.results);
      // hoatdongs.map((hd) => console.warn(hd.like_set.length));
    };

    loadHoatDongs();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  // const onRefreshLike = useCallback(() => {
  //   // setRefreshing(true);
  //   const loadHoatDongs = async () => {
  //     const res = await Api.get(endpoints["hoatdongs"]);
  //     setHoatDongs(res.data.results);
  //     hoatdongs.map((hd) => console.warn(hd.like_set.length));
  //   };

  //   loadHoatDongs();
  //   // setTimeout(() => {
  //   //   setRefreshing(false);
  //   // }, 2000);
  // }, []);

  useEffect(() => {
    const loadHoatDongs = async () => {
      const res = await Api.get(endpoints["hoatdongs"]);
      setHoatDongs(res.data.results);
    };

    loadHoatDongs();
  }, []);

  // useFocusEffect(
  //   useCallback(() => {
  //     const loadHoatDongs = async () => {
  //       const res = await Api.get(endpoints["hoatdongs"]);
  //       setHoatDongs(res.data.results);
  //     };
  
  //     loadHoatDongs();
  //   }, [hoatdongs])
  // )


  // useFocusEffect(() => {
  //   const loadHoatDongs = async () => {
  //     const res = await Api.get(endpoints["hoatdongs"]);
  //     setHoatDongs(res.data.results);
  //   };

  //   loadHoatDongs();
  // });

  const likeHD = async (hoatdongID) => {
    let token = await AsyncStorage.getItem("token-access");
    const res = await authApi(token).post(
      endpoints["hoatdong_like"](hoatdongID)
    );
  };

  const dangkyHoatDong = (hoatdongID, hoatdongSV) => {
    if (checkEnter(hoatdongSV)) {
      setIDHDDangKy(hoatdongID)
      setVisibleDialogAlert(true)
    } else {
      const signupAct = async () => {
        let token = await AsyncStorage.getItem("token-access");
        const res = await authApi(token).post(endpoints['hoatdong_dangkyHD'](hoatdongID));
      }
    }
  }

  const gotoDetail = (hoatdongID) => {
    navigation.navigate("Activity Detail", { hoatdongID: hoatdongID });
    // console.warn(hoatdongID)
    closeMenu();
  };

  const gotoSVDetail = (nguoidungID) => {
    navigation.navigate("UserSV Detail", { nguoidungID: nguoidungID });
    closeMenu();
    // console.warn(hoatdongID)
    closeMenuDetailSV();
  };

  return (
    <>
    <MyFAB>
      <View>
        {hoatdongs === null ? (
          <ActivityIndicator animating={true} color={MD2Colors.red800} />
        ) : (
          <>
            <ScrollView
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            >
              {hoatdongs.map((hd) => (
                <Card>
                  <Card.Title
                    title={hd.name}
                    subtitle={hd.ngay_dien_ra + " đến " + hd.ngay_het}
                    left={LeftContent}
                    right={() => (
                      <Text style={{ marginEnd: 10 }}>
                        +{hd.diem_cong} điểm
                      </Text>
                    )}
                  />
                  <Card.Content style={{ flexDirection: "row" }}>
                    <IconButton
                      icon="thumb-up-outline"
                      iconColor={MD3Colors.neutralVariant60}
                      size={20}
                      onPress={() => {
                        setHover(!isHover);
                        setIDHDLike(hd.id);
                        likeHD(hd.id);
                        // onRefreshLike;
                        // console.warn(hd.like_set.length);
                      }}
                    />
                    {/* <Text>{hd.like_set.length}</Text> */}
                    <IconButton
                      icon="comment-outline"
                      iconColor={MD3Colors.neutralVariant60}
                      size={20}
                      onPress={() => {
                        showModal();
                        setIDHDComment(hd.id);
                      }}
                    />
                    {/* <Text>{hd.comment_set.length}</Text> */}
                    <Portal>
                      <Modal
                        visible={visibleModal && idHDComment === hd.id}
                        onDismiss={hideModal}
                        contentContainerStyle={containerStyle}
                      >
                        {hd.comment_set.length === 0 ? (
                          <>
                            <Text>Chưa có comment nào cả</Text>
                            <View>
                              <TextInput
                                placeholder="Type something"
                                placeholderTextColor="grey"
                                numberOfLines={3}
                                multiline={true}
                              />
                            </View>
                          </>
                        ) : (
                          <>
                            <ScrollView>
                              <ScrollView>
                                {hd.comment_set.map((cmt) => (
                                  <>
                                    <Card>
                                      <Card.Title
                                        title={
                                          cmt.user.last_name +
                                          " " +
                                          cmt.user.first_name
                                        }
                                        subtitle={Moment(
                                          cmt.created_date
                                        ).fromNow()}
                                        left={() => {
                                          <Card.Cover
                                            source={{
                                              uri: cmt.user.avatar_path,
                                            }}
                                          />;
                                        }}
                                      />
                                      <Card.Content>
                                        <ScrollView
                                          style={{ height: 0.05 * height }}
                                        >
                                          <RenderHTML contentWidth={100}
                                            source={{ html: cmt.content }}
                                          ></RenderHTML>
                                        </ScrollView>
                                      </Card.Content>
                                    </Card>
                                  </>
                                ))}
                              </ScrollView>
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

                                  <View style={{ flexDirection: "row" }}>
                                    <TouchableOpacity
                                      style={styles.saveButtonStyle}
                                      onPress={() => submitContentHandle(hd.id)}
                                    >
                                      <Text style={styles.textButtonStyle}>
                                        Gửi
                                      </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={[
                                        styles.saveButtonStyle,
                                        { marginLeft: 10 },
                                      ]}
                                      onPress={hideModal}
                                    >
                                      <Text style={styles.textButtonStyle}>
                                        Đóng
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                </View>
                              </SafeAreaView>
                            </ScrollView>
                          </>
                        )}
                      </Modal>
                    </Portal>
                  </Card.Content>
                  <Card.Content>
                    <ScrollView style={{ height: 0.05 * height }}>
                      <RenderHTML contentWidth={100} source={{ html: hd.mo_ta }}></RenderHTML>
                    </ScrollView>
                  </Card.Content>

                  <Card.Actions>
                    {hd.tags.map((tag) => (
                      <Chip
                        style={{ alignContent: "flex-start" }}
                        icon="information"
                        onPress={() => console.log("Pressed")}
                      >
                        {tag.name}
                      </Chip>
                    ))}
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignContent: "center",
                        alignItems: "center",
                        alignSelf: "center",
                      }}
                    >
                      <Menu
                        key={hd.id}
                        visible={idHD === hd.id && visible}
                        onDismiss={closeMenu}
                        anchor={
                          <IconButton
                            icon="backburger"
                            iconColor={MD3Colors.error0}
                            size={30}
                            onPress={() => {
                              setIDHD(hd.id);
                              openMenu();
                              console.info(hd.id);
                            }}
                          ></IconButton>
                        }
                      >
                        <Menu.Item
                          leadingIcon="eye-outline"
                          onPress={() => gotoDetail(hd.id)}
                          title="Xem Chi Tiết"
                        />
                        <Menu.Item
                          leadingIcon="format-list-numbered"
                          onPress={() => {
                            showModalSV();
                            setIDHDSV(hd.id);
                          }}
                          title="Xem Danh Sách Sinh Viên"
                        />
                        <Portal>
                          <Modal
                            visible={visibleModalSV && idHDSV === hd.id}
                            onDismiss={hideModalSV}
                            contentContainerStyle={containerStyle}
                          >
                            {hd.user_svs === null ||
                              hd.user_svs.length === 0 ? (
                              <Text>Chưa có sinh viên nào cả</Text>
                            ) : (
                              <View>
                                {hd.user_svs.map((nguoidung) => (
                                  <><Card.Title
                                    title={nguoidung.last_name +
                                      " " +
                                      nguoidung.first_name}
                                    subtitle={nguoidung.email}
                                    left={() => (
                                      <Avatar.Image
                                        size={24}
                                        source={{ uri: nguoidung.avatar }} />
                                    )}
                                    right={() => (
                                      <><View
                                        style={{
                                          paddingTop: 50,
                                          flexDirection: 'row',
                                          justifyContent: 'center',
                                        }}>
                                        <Menu
                                          visible={visibleDetailSV && idSVDetail === nguoidung.id && idHDSV === hd.id}
                                          onDismiss={closeMenuDetailSV}
                                          anchor={<IconButton

                                            icon="dots-vertical"
                                            onPress={() => {
                                              setSVDetail(nguoidung.id);
                                              openMenuDetailSV();

                                              console.warn(idSVDetail);

                                              console.warn(visibleDetailSV);
                                            }} />}>
                                          <Menu.Item onPress={() => {
                                            gotoSVDetail(nguoidung.id)
                                          }} title="Xem Thông Tin" />
                                          <Menu.Item onPress={() => { }} title="Chat" />
                                          <Divider />
                                        </Menu>
                                      </View></>
                                    )} /></>
                                ))}
                              </View>
                            )}
                          </Modal>
                        </Portal>
                        <Menu.Item
                          leadingIcon="close"
                          onPress={() => {

                          }}
                          title="Bỏ Qua"
                        />
                      </Menu>
                    </View>
                    <Button onPress={() => {

                      dangkyHoatDong(hd.id, hd.user_svs)
                      console.warn(visibleDialogAlert && idHD === hd.id && checkEnter(hd.user_svs))
                    }
                    } icon={checkEnter(hd.user_svs) ? "check-circle" : ""} buttonColor={checkEnter(hd.user_svs) ? "gray" : "green"}>{checkEnter(hd.user_svs) ? "Đã Đăng Ký Tham Gia" : "Tham Gia"}</Button>
                    <Portal>
                      <Dialog visible={visibleDialogAlert && idHDDangKy === hd.id && checkEnter(hd.user_svs)} onDismiss={hideDialogAlert}>
                        <Dialog.Content>
                          <Text variant="bodyMedium">Bạn đã đăng ký rồi</Text>
                        </Dialog.Content>
                      </Dialog>
                    </Portal>
                  </Card.Actions>
                </Card>
              ))}
            </ScrollView>
          </>
        )}
        
      </View>
      </MyFAB>
    </>
  );
};

export default Home;

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
