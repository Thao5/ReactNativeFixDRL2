import {  useEffect, useState } from "react";
import {
  ActivityIndicator,
  Avatar,
  Button,
  Card,
  Chip,
  IconButton,
  MD2Colors,
  Text,
  TextInput,
} from "react-native-paper";
import Api, { endpoints } from "../../ApisService/Api";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
import RenderHTML from "react-native-render-html";
const { height } = Dimensions.get("window");
const HoatDongDetail = ({ route }) => {
  const [hdDetail, sethdDetail] = useState(null);

  const { hoatdongID } = route.params;


  useEffect(() => {
    const loadhdDetail = async () => {
      //   console.warn(JSON.stringify(hoatdongID));
      const res = await Api.get(
        endpoints["hoatdong_detail"](JSON.stringify(hoatdongID))
      );
      sethdDetail(res.data);
      // console.info(res.data);
    };
    loadhdDetail();
  }, []);

  return (
    <ScrollView>
      {hdDetail === null ? (
        <ActivityIndicator animating={true} color={MD2Colors.red800} />
      ) : (
        <>
          <Card>
            <Card.Title
              title={hdDetail.name}
              subtitle={hdDetail.ngay_dien_ra + " đến " + hdDetail.ngay_het}
              left={(props) => <Avatar.Icon {...props} icon="lighthouse-on" />}
              right={() => (
                <>
                  <Text style={{ marginEnd: 10 }}>
                    Quy Chế: {hdDetail.quy_che}
                  </Text>
                  <Text style={{ marginEnd: 10 }}>
                    +{hdDetail.diem_cong} điểm
                  </Text>
                </>
              )}
            />
            <Card.Content>
              <Text variant="titleLarge">
                Ngày dự kiến: {hdDetail.ngay_du_kien}
              </Text>
              <ScrollView style={{ height: 0.6 * height }}>
                <RenderHTML contentWidth={100} source={{ html: hdDetail.mo_ta }}></RenderHTML>
              </ScrollView>
            </Card.Content>
            <Card.Actions>
              {hdDetail.tags.map((tag) => (
                <Chip icon="information" onPress={() => console.log("Pressed")}>
                  {tag.name}
                </Chip>
              ))}
              <Button buttonColor="red" textColor="white">
                Bỏ Qua
              </Button>
              <Button buttonColor="green">Tham Gia</Button>
            </Card.Actions>
          </Card>
          <ScrollView style={{ height: 0.6 * height }}>
            {hdDetail.comment === null ? (
              <>
                <Card>
                  <Card.Content>
                    <Text variant="titleLarge">
                      Chưa có bình luận bạn hãy là người đầu tiên
                    </Text>
                  </Card.Content>
                </Card>
                <View style={styles.textAreaContainer}>
                  <TextInput
                    style={styles.textArea}
                    underlineColorAndroid="transparent"
                    placeholder="Type something"
                    placeholderTextColor="grey"
                    numberOfLines={10}
                    multiline={true}
                  />
                </View>
              </>
            ) : (
              <>
                <Card>
                  <Card.Content>
                    <Text variant="titleLarge">Card title</Text>
                    <Text variant="bodyMedium">Card content</Text>
                  </Card.Content>
                </Card>
                <View style={styles.textAreaContainer}>
                  <TextInput
                    style={styles.textArea}
                    underlineColorAndroid="transparent"
                    placeholder="Type something"
                    placeholderTextColor="grey"
                    numberOfLines={10}
                    multiline={true}
                  />
                </View>
              </>
            )}
          </ScrollView>
        </>
      )}
    </ScrollView>
  );
};

export default HoatDongDetail;

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
});
