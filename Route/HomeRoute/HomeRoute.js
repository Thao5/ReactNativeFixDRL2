import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import Home from "../../components/Home/Home";
import HoatDongDetail from "../../components/ActivityDetail/ActivityDetail";
import userDetail from "../../components/userDetail/userDetail";
import userSVDetail from "../../components/userDetail/userSVDetail";
import ActivityAttended from "../../components/ActivityDetail/ActivityAttended";
import MinhChung from "../../components/MinhChungHoatDong/MinhChung";
import ActivityMissing from "../../components/ActivityDetail/ActivityMissing";
import TLSVMinhChung from "../../components/MinhChungHoatDong/TLSVMinhChung";
import DiemDanh from "../../components/DiemDanh/DiemDanh";
import FindSV from "../../components/userDetail/FindSV";
import AddActivity from "../../components/AddActivity/AddActivity";
import ThongKe from "../../components/ThongKe/ThongKe";
import AddTLSV from "../../components/AddTLSV/AddTLSV";
import SingleChat from "../../components/Chat/SingleChat";
import Home from "../../components/Home/Home";

const Stack = createNativeStackNavigator();

const HomeRoute = () => {

    return (
        <Stack.Navigator >
            <Stack.Screen name="Home" component={Home}/>
            <Stack.Screen name="Activity Missing" component={ActivityMissing}/>
            <Stack.Screen name="TLSV MinhChung" component={TLSVMinhChung}/>
            <Stack.Screen name="Diem Danh" component={DiemDanh} />
            <Stack.Screen name="Find SV" component={FindSV} />
            <Stack.Screen name="Activity Adding" component={AddActivity} />
            <Stack.Screen name="Thong Ke" component={ThongKe} />
            <Stack.Screen name="Activity Detail" component={HoatDongDetail} />
            <Stack.Screen name="UserSV Detail" component={userSVDetail} />
            <Stack.Screen name="Activity Attended" component={ActivityAttended} />
            <Stack.Screen name="MinhChung HoatDong" component={MinhChung} />
            <Stack.Screen name="UserDetail" component={userDetail} />
            <Stack.Screen name="Add TLSV" component={AddTLSV} />
        </Stack.Navigator>
        
    )
}

export default HomeRoute;