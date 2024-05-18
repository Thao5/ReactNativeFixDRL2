import { useContext, useEffect, useState } from "react";
import userContext from "../../Context/userContext/userContext";
import { ScrollView } from "react-native";
import { Avatar, Card, Divider, List, MD3Colors, Searchbar, Text } from "react-native-paper";
import { getDatabase, ref, child, get, push, update, onValue } from "firebase/database";
import uuid from 'react-native-uuid';
// import { useIsFocused } from "@react-navigation/native";

const Chat = ({ navigation }) => {
    const [user,] = useContext(userContext);
    const [allUser, setallUser] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [role, setRole] = useState(null);
    const [chatList, setChatList] = useState([]);
    // const isFocused = useIsFocused()

    useEffect(() => {
        const dbRef = ref(getDatabase());
        get(child(dbRef, `user/`)).then((snapshot) => {
            // console.info(snapshot.val())
            // setallUser(Object.values(snapshot.val()).filter((it) => it.id !== user.userdata.id))
            snapshot.val().map((u) => {
                setallUser(Object.values(u).filter((it) => it.id !== user.userdata.id && it.username !== "admin"))
            }
            )

            // allUser.map((us) => console.warn(us.email))
        }).catch((error) => {
            console.error(error);
        });

        user.userdata.groups.map((r) => setRole(r.name))

        const db = getDatabase();
        const starCountRef = ref(db, 'chatlist/' + user.userdata.id);
        onValue(starCountRef, (snapshot) => {
            if (snapshot.val() !== null) {
                setChatList(Object.values(snapshot.val()));
                // console.warn(chatList)
            }
        });

    }, [])

    const createChatList = (data) => {
        const database = getDatabase();
        const dbRef = ref(getDatabase());
        get(child(dbRef, 'chatlist/' + user.userdata.id + '/' + data.id)).then((snapshot) => {
            if (snapshot.val() === null) {
                const db = getDatabase();
                let roomID = uuid.v4();
                console.warn(roomID)
                // A post entry.
                const newChatroomRef = push(ref(database, 'chatrooms'), {
                    firstUser: user.userdata.id,
                    secondUser: data.id,
                    messages: [],
                });

                const newChatroomId = newChatroomRef.key;
                const postData = {
                    roomID: newChatroomId,
                    name: user.userdata.last_name + " " + user.userdata.first_name,
                    img: "https://res.cloudinary.com/dtlqyvkvu/" + user.userdata.avatar,
                    email: user.userdata.email,
                    MSSV: user.userdata.mssv,
                    role: role,
                    khoa: user.userdata.khoa.name,
                    lop: user.userdata.lop.name,
                    lastMsg: "",
                };

                const newChat = {
                    firstUser: user.userdata.id,
                    secondUser: data.id,
                    messages: [],
                }

                // Get a key for a new Post.
                // const newPostKey = push(child(ref(db), 'chatlist')).key;

                // Write the new post's data simultaneously in the posts list and the user's post list.
                const updates = {};
                updates['chatlist/' + data.id + '/' + user.userdata.id] = postData;
                delete data["password"]

                data.roomID = newChatroomId;
                updates['chatlist/' + user.userdata.id + '/' + data.id] = data;

                // updates['messages'] = newChat;



                navigation.navigate("Chat Test", { data: data })

                return update(ref(db), updates);
            } else {
                // const newChatroomRef = push(ref(database, 'chatrooms'), {
                //     firstUser: user.userdata.id,
                //     secondUser: data.id,
                //     messages: [],
                //   });

                //   const newChatroomId = newChatroomRef.key;

                const dbRef = ref(getDatabase());
                get(child(dbRef, 'chatlist/' + user.userdata.id + '/' + data.id)).then((snapshot) => {
                    if (snapshot.exists()) {
                        const db = getDatabase();
                        const updates = {};
                        // console.log(snapshot.val());
                        // console.warn(snapshot.val().roomID)
                        data.roomID = snapshot.val().roomID;
                        updates['chatlist/' + user.userdata.id + '/' + data.id] = data;
                        navigation.navigate("Chat Test", { data: data })
                        return update(ref(db), updates);
                    } else {
                        console.log("No data available");
                    }
                }).catch((error) => {
                    console.error(error);
                });
                
            }
        }).catch((error) => {
            console.error(error);
        });

        // const db = getDatabase();
        // let roomID = uuid.v4();
        // console.warn(roomID)
        // // A post entry.
        // const newChatroomRef = push(ref(database, 'chatrooms'), {
        //     firstUser: user.userdata.id,
        //     secondUser: data.id,
        //     messages: [],
        // });

        // const newChatroomId = newChatroomRef.key;
        // const postData = {
        //     roomID: newChatroomId,
        //     name: user.userdata.last_name + " " + user.userdata.first_name,
        //     img: "https://res.cloudinary.com/dtlqyvkvu/" + user.userdata.avatar,
        //     email: user.userdata.email,
        //     MSSV: user.userdata.mssv,
        //     role: role,
        //     khoa: user.userdata.khoa.name,
        //     lop: user.userdata.lop.name,
        //     lastMsg: "",
        // };

        // const newChat = {
        //     firstUser: user.userdata.id,
        //     secondUser: data.id,
        //     messages: [],
        // }

        // // Get a key for a new Post.
        // // const newPostKey = push(child(ref(db), 'chatlist')).key;

        // // Write the new post's data simultaneously in the posts list and the user's post list.
        // const updates = {};
        // updates['chatlist/' + data.id + '/' + user.userdata.id] = postData;
        // delete data["password"]

        // data.roomID = newChatroomId;
        // updates['chatlist/' + user.userdata.id + '/' + data.id] = data;

        // // updates['messages'] = newChat;



        // navigation.navigate("Chat Test", { data: data })

        // return update(ref(db), updates);

    }

    return (
        <ScrollView style={{ marginTop: 40 }}>
            {allUser === null ? <></> : <>
                <Searchbar
                    placeholder="Search"
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                />
                <Divider />
                {allUser.map((userList) => (

                    <>{
                        searchQuery === '' ? <>

                            <Card onPress={() => createChatList(userList)} style={{ marginTop: 10 }} mode="outlined">
                                <Card.Title title={userList.last_name + " " + userList.first_name} subtitle={userList.email} left={() => <Avatar.Image size={50} source={{ uri: "https://res.cloudinary.com/dtlqyvkvu/" + userList.avatar }} />} />
                                <Card.Content>
                                    {chatList.map((userChat) => (
                                        <>
                                            {userChat.id === userList.id ? <Text variant="bodyMedium">{userChat.lastMsg}</Text> : <></>}

                                        </>

                                    ))}

                                </Card.Content>
                            </Card>

                        </> : userList.first_name.includes(searchQuery) || userList.last_name.includes(searchQuery) || userList.email.includes(searchQuery) ?
                            <>
                                <Card onPress={() => createChatList(userList)} style={{ marginTop: 10 }} mode="outlined">
                                    <Card.Title title={userList.last_name + " " + userList.first_name} subtitle={userList.email} left={() => <Avatar.Image size={50} source={{ uri: "https://res.cloudinary.com/dtlqyvkvu/" + userList.avatar }} />} />
                                    <Card.Content>
                                        <Text variant="bodyMedium">Card content</Text>
                                    </Card.Content>
                                </Card>

                            </> :
                            <>
                            </>
                    }
                    </>
                ))}
            </>}
        </ScrollView>
    )
}

export default Chat;