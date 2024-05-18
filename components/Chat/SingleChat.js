import { Alert, FlatList, StatusBar, StyleSheet, View } from "react-native";

import { GiftedChat } from 'react-native-gifted-chat'
import { useContext, useEffect, useState } from "react";
import userContext from "../../Context/userContext/userContext";
import moment from "moment";
import { getDatabase, ref, child, push, update, onValue, get } from "firebase/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text } from "react-native-paper";


const SingleChat = (props) => {
    const [messages, setMessages] = useState([]);
    const [user,] = useContext(userContext);
    const [messText, setMessText] = useState('');
    const [role, setRole] = useState(null);
    const [allChat, setAllChat] = useState([]);
    const [chatChosen, setChatChosen] = useState([]);
    const [newID, setNewID] = useState(null);
    // const [flag, setFlag] = useState(false)

    const { data } = props.route.params;

    useEffect(() => {
        // setFlag(false)
        const loadMessage = async () => {
            user.userdata.groups.map((r) => setRole(r.name))
            // console.warn("roomID",data.roomID)
            const db = getDatabase();
            // const dbRef = ref(db);
            // if (newID !== null) {
            // get(child(dbRef, '/messages/' + `${user.userdata.id}_${data.id}/` + newID)).then((snapshot) => {
            //     // console.warn("Snap", snapshot.val())
            //     if (snapshot.exists()) {
            //         // setAllChat((state) => [...state, snapshot.val()]);
            //         setChatChosen((state) => [...state, snapshot.val()])
            //         // console.warn("allchatTop", allChat)
            //         setMessages(previousMessages =>
            //             GiftedChat.append(previousMessages, chatChosen),
            //         )
            //     } else {
            //         console.log("No data available");
            //     }
            // }).catch((error) => {
            //     console.error(error);
            // });

            let idMessage = await AsyncStorage.getItem("customID")
            console.warn("idMess", idMessage)

            const starCountRef = ref(db, '/messages/' + `${user.userdata.id}_${data.id}/` + idMessage);
            onValue(starCountRef, (snapshot) => {
                if (snapshot.val() !== null) {
                    console.warn("Snap", snapshot.val())
                    setChatChosen((state) => [...state, snapshot.val()]);
                    console.warn("chatChosen", chatChosen)
                    console.warn("length", chatChosen.length)



                    // // all
                    // console.warn("allpathBottom", chatChosen)
                }
            });

            // if (chatChosen.length > 0) {
                setMessages(previousMessages =>
                    GiftedChat.append(previousMessages, chatChosen),
                )
                console.warn("message", messages)
            // }

            // const starCountRef = ref(db, '/messages/' + `${user.userdata.id}_${data.id}`);
            // onValue(starCountRef, (snapshot) => {
            //     if (snapshot.val() !== null) {
            //         console.warn("Snap", snapshot.val())
            //         setChatChosen(snapshot.val());
            //         console.warn("chatChosen", chatChosen)
            //         // console.warn("length", chatChosen.length)

            //         // const starCountRefInside = ref(db, '/messages/');
            //         // onValue(starCountRefInside, (snapshot) => {
            //         //     if (snapshot.val() !== null) {
            //         //         console.warn("Snap", snapshot.val())
            //         //         setChatChosen((state) => [...state, snapshot.val()]);
            //         //         console.warn("chatChosen", chatChosen)
            //         //         console.warn("length", chatChosen.length)
            //         //     }
            //         // });

            //         // // all
            //         // console.warn("allpathBottom", chatChosen)
            //     }
            // });

            // if (chatChosen.length > 0) {
            // setMessages(previousMessages =>
            //     GiftedChat.append(previousMessages, chatChosen),
            // )
            // console.warn("message", messages)
            // }

            // }
            // console.warn(data.roomID)

            // console.warn()



            // if (allChat !== null) {
            //     console.warn("allChat", Object.values(allChat))
            //     // allChat.map((chat) => {
            //     //     // console.warn("message" ,chat.message)
            //     //     // setMessages((state) => [...state, [
            //     //     //     {
            //     //     //         _id: user.userdata.id,
            //     //     //         text: chat.message,
            //     //     //         createdAt: chat.sendTime,
            //     //     //         user: {
            //     //     //             _id: data.id,
            //     //     //             name: data.first_name + " " + data.last_name,
            //     //     //             avatar: "https://res.cloudinary.com/dtlqyvkvu/" + data.avatar,
            //     //     //         },
            //     //     //     },
            //     //     // ]])
            //     // })

            // }

            // Object.values(allChat).map((chat) => console.warn("chat",chat.-Ny7owF8OZQ2jCDMwWFO.id))

            // allChat.map((chat) => {
            // setMessages([
            //     {
            //         _id: data.id,
            //         text: "Hello",
            //         createdAt: new Date(),
            //         user: {
            //             _id: user.userdata.id,
            //             name: 'React Native',
            //             avatar: user.userdata.avatar_path,
            //         },
            //     },
            // ])

            // })

            // setMessages([chatChosen])

            // if (allChat !== null) {
            //     setMessages(previousMessages =>
            //         GiftedChat.append(previousMessages, allChat),
            //     )
            // }
        }

        loadMessage();
    }, [newID])

    const onSend = (async (messages = []) => {
        // console.warn("message", messages)

        if (messText !== "") {
            let msgData = {
                // roomID: data.roomID,
                _id: data.id,
                createdAt: new Date(),
                text: messText,
                user: {
                    _id: user.userdata.id,
                    name: user.userdata.first_name + " " + user.userdata.last_name,
                    avatar: user.userdata.avatar_path
                }
            }


            const db = getDatabase();

            // Get a key for a new Post.
            const newPostKey = push(child(ref(db), '/messages/' + `${user.userdata.id}_${data.id}`)).key;
            // msgData.id = newPostKey
            await AsyncStorage.setItem("customID", newPostKey)

            setNewID(newPostKey)

            // roomID = data.roomID

            // Write the new post's data simultaneously in the posts list and the user's post list.
            const updates = {};
            updates['/messages/' + `${user.userdata.id}_${data.id}` + "/" + newPostKey] = msgData;

            let chatListUpdate = {
                // roomID,
                name: user.userdata.last_name + " " + user.userdata.first_name,
                img: "https://res.cloudinary.com/dtlqyvkvu/" + user.userdata.avatar,
                email: user.userdata.email,
                MSSV: user.userdata.mssv,
                role: role,
                khoa: user.userdata.khoa.name,
                lop: user.userdata.lop.name,
                lastMsg: messText,
                sendTime: msgData.createdAt
            }
            updates['chatlist/' + data.id + '/' + user.userdata.id] = chatListUpdate;

            delete data["password"]

            data.lastMsg = messText;
            data.sendTime = msgData.createdAt

            updates['chatlist/' + user.userdata.id + '/' + data.id] = data;
            
            setMessages(previousMessages =>
                GiftedChat.append(previousMessages, chatChosen),
            )
            console.warn("message", messages)


            setMessages(previousMessages =>
                GiftedChat.append(previousMessages, messages),
            )

            setMessText('')
            // setFlag(true)
            return update(ref(db), updates);

        } else {
            Alert.alert("Nhập tin nhấn")
        }
    })

    // const Item = ({ title }) => (
    //     <GiftedChat
    //             text={messText}
    //             onInputTextChanged={text => {
    //                 setMessText(text)
    //             }}
    //             messages={messages}
    //             onSend={(messages) => {
    //                 // setMessText(text)
    //                 onSend(messages)
    //             }}
    //             user={{
    //                 _id: user.userdata.id,
    //                 name: user.userdata.first_name + " " + user.userdata.last_name,
    //                 avatar: user.userdata.avatar_path
    //             }}
    //         />
    // );

    return (
        <>
            {/* <FlatList
                data={chatChosen}
                renderItem={({ item }) => {
                    return (
                        <GiftedChat

                            text={messText}
                            onInputTextChanged={text => {
                                setMessText(text)
                            }}
                            messages={item}
                            onSend={(messages) => {
                                // setMessText(text)
                                onSend(messages)
                            }}
                            user={{
                                _id: user.userdata.id,
                                name: user.userdata.first_name + " " + user.userdata.last_name,
                                avatar: user.userdata.avatar_path
                            }}
                        />
                    )
                }}
                keyExtractor={(item, index) => index}
            /> */}
            <GiftedChat

                text={messText}
                onInputTextChanged={text => {
                    setMessText(text)
                }}
                messages={messages}
                onSend={(messages) => {
                    // setMessText(text)
                    onSend(messages)
                }}
                user={{
                    _id: user.userdata.id,
                    name: user.userdata.first_name + " " + user.userdata.last_name,
                    avatar: user.userdata.avatar_path
                }}
            />
        </>
    )
}

export default SingleChat;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight || 0,
    },
    item: {
        backgroundColor: '#f9c2ff',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    title: {
        fontSize: 32,
    },
});
