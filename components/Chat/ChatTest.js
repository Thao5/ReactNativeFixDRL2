import React, { useCallback, useContext, useEffect, useState } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { Image, Pressable, StyleSheet, Text } from 'react-native';
import { getDatabase, get, ref, onValue, off, update } from 'firebase/database';
import userContext from '../../Context/userContext/userContext';

export default ChatTest = (props) => {
    const [messages, setMessages] = useState([]);
    const { data } = props.route.params;
    const [user,] = useContext(userContext)
    const [messText, setMessText] = useState(null);
    const [role, setRole] = useState(null);

    useEffect(() => {
        user.userdata.groups.map((r) => setRole(r.name))
        //load old messages
        const loadData = async () => {
            const myChatroom = await fetchMessages();

            setMessages(renderMessages(myChatroom.messages));
        };

        loadData();

        // set chatroom change listener
        const database = getDatabase();
        const chatroomRef = ref(database, `chatrooms/${data.roomID}`);
        onValue(chatroomRef, snapshot => {
            if (snapshot.val() !== null) {
                const data = snapshot.val();
                setMessages(renderMessages(data.messages));
            }
        });

        return () => {
            //remove chatroom listener
            off(chatroomRef);
        };
    }, [fetchMessages, renderMessages, data.roomID]);

    const renderMessages = useCallback(
        msgs => {
            //structure for chat library:
            // msg = {
            //   _id: '',
            //   user: {
            //     avatar:'',
            //     name: '',
            //     _id: ''
            //   }
            // }

            return msgs
                ? msgs.reverse().map((msg, index) => ({
                    ...msg,
                    _id: index,
                    user: {
                        _id:
                            msg.sender === user.userdata.id
                                ? user.userdata.id
                                : data.id,
                        avatar:
                            msg.sender === user.userdata.id
                                ? user.userdata.avatar_path
                                : "https://res.cloudinary.com/dtlqyvkvu/" + data.avatar,
                        name:
                            msg.sender === user.userdata.id
                                ? user.userdata.last_name + " " + user.userdata.first_name
                                : data.last_name + " " + data.first_name,
                    },
                }))
                : [];
        },
        [
            user.userdata.avatar_path,
            user.userdata.last_name + " " + user.userdata.first_name,
            "https://res.cloudinary.com/dtlqyvkvu/" + data.avatar,
            data.last_name + " " + data.first_name,
        ],
    );

    const fetchMessages = useCallback(async () => {
        const database = getDatabase();

        const snapshot = await get(
            ref(database, `chatrooms/${data.roomID}`),
        );

        return snapshot.val();
    }, [data.roomID]);


    const onSend = useCallback(
        async (msg = []) => {
            //send the msg[0] to the other user
            const database = getDatabase();

            //fetch fresh messages from server
            const currentChatroom = await fetchMessages();

            // console.warn(currentChatroom)

            // if(currentChatroom === null) {
            // const lastMessages = [];
            // update(ref(database, `chatrooms/${data.roomID}`), {
            //     messages: [
            //         ...lastMessages,
            //         {
            //             text: msg[0].text,
            //             sender: user.userdata.id,
            //             createdAt: new Date(),
            //         },
            //     ],
            // });
            // } else {
            const lastMessages = currentChatroom.messages || [];
            update(ref(database, `chatrooms/${data.roomID}`), {
                messages: [
                    ...lastMessages,
                    {
                        text: msg[0].text,
                        sender: user.userdata.id,
                        createdAt: new Date(),
                    },
                ],
            });
            // }



            // const postData = {
            //     roomID: data.roomID,
            //     name: user.userdata.last_name + " " + user.userdata.first_name,
            //     img: "https://res.cloudinary.com/dtlqyvkvu/" + user.userdata.avatar,
            //     email: user.userdata.email,
            //     MSSV: user.userdata.mssv,
            //     role: role,
            //     khoa: user.userdata.khoa.name,
            //     lop: user.userdata.lop.name,
            //     lastMsg: messText,
            // };

            update(ref(database, 'chatlist/' + data.id + '/' + user.userdata.id), {
                roomID: data.roomID,
                name: user.userdata.last_name + " " + user.userdata.first_name,
                img: "https://res.cloudinary.com/dtlqyvkvu/" + user.userdata.avatar,
                email: user.userdata.email,
                MSSV: user.userdata.mssv,
                role: role,
                khoa: user.userdata.khoa.name,
                lop: user.userdata.lop.name,
                lastMsg: messText,
            });

            setMessages(prevMessages => GiftedChat.append(prevMessages, msg));
        },
        [fetchMessages, user.userdata.id, data.roomID],
    );

    return (
        <>
            {/* <Pressable onPress={onBack} style={styles.actionBar}>
                <Image source={require('./assets/back.png')} />
                <Text>{selectedUser?.name}</Text>
            </Pressable> */}
            <GiftedChat
                messages={messages}
                onInputTextChanged={text => {
                    setMessText(text)
                }}
                onSend={newMessage => onSend(newMessage)}
                user={{
                    _id: user.userdata.id,
                }}
            />
        </>
    );
}

const styles = StyleSheet.create({
    actionBar: {
        backgroundColor: '#cacaca',
        height: 41,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
});