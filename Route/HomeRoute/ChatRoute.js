import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import Home from "../../components/Home/Home";
import SingleChat from "../../components/Chat/SingleChat";
import Chat from "../../components/Chat/Chat";
import ChatTest from "../../components/Chat/ChatTest";

const Stack = createNativeStackNavigator();

const ChatRoute = () => {

    return (
        <Stack.Navigator >
            <Stack.Screen name="Chat" component={Chat}/>
            <Stack.Screen name="Single Chat" component={SingleChat} />
            <Stack.Screen name="Chat Test" component={ChatTest}/>
        </Stack.Navigator>
        
    )
}

export default ChatRoute;