import * as React from "react";
import { FAB, Portal, PaperProvider } from "react-native-paper";
import userContext from "../../Context/userContext/userContext";
import { useNavigation } from "@react-navigation/native";


export default MyFAB = ({children}) => {
  const [state, setState] = React.useState({ open: false });

  const [role, setRole] = React.useState(null)

  const onStateChange = ({ open }) => setState({ open });

  const { open } = state;

  const [user, dispatch] = React.useContext(userContext);

  const navigation = useNavigation();

  // React.useEffect(() => {
  //   user.userdata.groups.map((role) => {
  //     console.warn(role.name)
  //   })
  // }, [])

  const logout = () => {
    console.info("Log Out");
    dispatch({
      type: "logout",
    });
  };

  const gotouserDetail = () => {
    navigation.navigate("userDetail")
  }

  return (
    <Portal.Host>
      {children}
      {user.userdata.groups.map((role) => (
        role.name === "SV" ? <FAB.Group
          open={open}
          visible
          icon={open ? "settings-helper" : "account-settings"}
          actions={[
            // user.userdata.groups.name === "SV" ? [
            { icon: "logout", label: 'Log Out', onPress: () => logout() },
            { icon: "book-open-page-variant-outline", label: 'Các hoạt động đã tham gia', onPress: () => navigation.navigate('Activity Attended') },
            { icon: "check-decagram", label: 'Minh Chứng Hoạt Động', onPress: () => navigation.navigate('MinhChung HoatDong') },
            // {
            //   icon: 'account',
            //   label: user.userdata.first_name + " " + user.userdata.last_name,
            //   onPress: () => navigation.navigate('UserDetail'),
            // },
            // ] : 
            // [
            // { icon: "logout", label: 'Log Out', onPress: () => logout() },

            // { icon: "call-missed", label: "Danh sách hoạt động cần minh chứng", onPress: () => navigation.navigate("Activity Missing") },
            // { icon: "book-check-outline", label: "Điểm danh hoạt động", onPress: () => navigation.navigate("Diem Danh") },
            // { icon: "home-search-outline", label: "Tìm kiếm Sinh Viên", onPress: () => navigation.navigate("Find SV") },
            // { icon: "table-plus", label: "Thêm Hoạt Động", onPress: () => navigation.navigate("Activity Adding") },
            // { icon: "poll", label: "Thống Kê", onPress: () => navigation.navigate("Thong Ke") },
            // { icon: "account-plus", label: "Thêm TLSV", onPress: () => navigation.navigate("Add TLSV") },
            {
              icon: 'account',
              label: user.userdata.first_name + " " + user.userdata.last_name,
              onPress: () => navigation.navigate('UserDetail'),
            },
            // ]
          ]}
          onStateChange={onStateChange}
          onPress={() => {
            if (open) {
              // do something if the speed dial is open
            }
          }}
        /> : role.name === "CTSV" ? <FAB.Group
          open={open}
          visible
          icon={open ? "settings-helper" : "account-settings"}
          actions={[
            // user.userdata.groups.name === "SV" ? [
            { icon: "logout", label: 'Log Out', onPress: () => logout() },
            // { icon: "book-open-page-variant-outline", label: 'Các hoạt động đã tham gia', onPress: () => navigation.navigate('Activity Attended') },
            // { icon: "check-decagram", label: 'Minh Chứng Hoạt Động', onPress: () => navigation.navigate('MinhChung HoatDong') },
            // {
            //   icon: 'account',
            //   label: user.userdata.first_name + " " + user.userdata.last_name,
            //   onPress: () => navigation.navigate('UserDetail'),
            // },
            // ] : 
            // [
            // { icon: "logout", label: 'Log Out', onPress: () => logout() },

            { icon: "call-missed", label: "Danh sách hoạt động cần minh chứng", onPress: () => navigation.navigate("Activity Missing") },
            { icon: "book-check-outline", label: "Điểm danh hoạt động", onPress: () => navigation.navigate("Diem Danh") },
            { icon: "home-search-outline", label: "Tìm kiếm Sinh Viên", onPress: () => navigation.navigate("Find SV") },
            { icon: "table-plus", label: "Thêm Hoạt Động", onPress: () => navigation.navigate("Activity Adding") },
            { icon: "poll", label: "Thống Kê", onPress: () => navigation.navigate("Thong Ke") },
            { icon: "account-plus", label: "Thêm TLSV", onPress: () => navigation.navigate("Add TLSV") },
            {
              icon: 'account',
              label: user.userdata.first_name + " " + user.userdata.last_name,
              onPress: () => navigation.navigate('UserDetail'),
            },
            // ]
          ]}
          onStateChange={onStateChange}
          onPress={() => {
            if (open) {
              // do something if the speed dial is open
            }
          }}
        /> : <FAB.Group
          open={open}
          visible
          icon={open ? "settings-helper" : "account-settings"}
          actions={[
            // user.userdata.groups.name === "SV" ? [
            { icon: "logout", label: 'Log Out', onPress: () => logout() },
            // { icon: "book-open-page-variant-outline", label: 'Các hoạt động đã tham gia', onPress: () => navigation.navigate('Activity Attended') },
            // { icon: "check-decagram", label: 'Minh Chứng Hoạt Động', onPress: () => navigation.navigate('MinhChung HoatDong') },
            // {
            //   icon: 'account',
            //   label: user.userdata.first_name + " " + user.userdata.last_name,
            //   onPress: () => navigation.navigate('UserDetail'),
            // },
            // ] : 
            // [
            // { icon: "logout", label: 'Log Out', onPress: () => logout() },

            { icon: "call-missed", label: "Danh sách hoạt động cần minh chứng", onPress: () => navigation.navigate("Activity Missing") },
            { icon: "book-check-outline", label: "Điểm danh hoạt động", onPress: () => navigation.navigate("Diem Danh") },
            { icon: "home-search-outline", label: "Tìm kiếm Sinh Viên", onPress: () => navigation.navigate("Find SV") },
            { icon: "table-plus", label: "Thêm Hoạt Động", onPress: () => navigation.navigate("Activity Adding") },
            { icon: "poll", label: "Thống Kê", onPress: () => navigation.navigate("Thong Ke") },
            // { icon: "account-plus", label: "Thêm TLSV", onPress: () => navigation.navigate("Add TLSV") },
            {
              icon: 'account',
              label: user.userdata.first_name + " " + user.userdata.last_name,
              onPress: () => navigation.navigate('UserDetail'),
            },
            // ]
          ]}
          onStateChange={onStateChange}
          onPress={() => {
            if (open) {
              // do something if the speed dial is open
            }
          }}
        />
      ))}

    </Portal.Host>
  );
};
