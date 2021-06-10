import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Keyboard, KeyboardAvoidingView, TouchableOpacity } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import KeyboardListener from 'react-native-keyboard-listener';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { Avatar } from "react-native-elements";
import { auth, db } from "../firebase";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import firebase from "firebase/app";

const ChatScreen = ({ navigation, route }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const scrollViewRef = useRef();

  const toBottom = () => scrollViewRef.current.scrollToEnd({ animated: true });

  useLayoutEffect(() => {
    navigation.setOptions({
      title: route.params.chatName,
      headerTitleAlign: "left",
      headerTitle: () => (
        <View style={styles.head}>
          <Avatar
            rounded
            source={{
              uri:
                "https://cencup.com/wp-content/uploads/2019/07/avatar-placeholder.png",
            }}
          />
          <Text style={styles.textHead}>{route.params.chatName}</Text>
        </View>
      ),
      headerRight: () => (
        <View style={styles.rightHead}>
          <TouchableOpacity>
            <FontAwesome name="video-camera" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="call" size={24} color="white" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  useLayoutEffect(() => {
    const unsubscribe = db
      .collection("chats")
      .doc(route.params.id)
      .collection("messages")
      .orderBy("timestamp", "asc")
      .onSnapshot((snapshot) =>
        setMessages(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        )
      );
    return unsubscribe;
  }, [route]);

  const sendMessage = () => {
    Keyboard.dismiss();
    db.collection("chats").doc(route.params.id).collection("messages").add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      displayName: auth.currentUser.displayName,
      email: auth.currentUser.email,
      photoURL: auth.currentUser.photoURL,
    });

    setInput("");
  };

  const deleteMessage = (msgid) => {
    Alert.alert(
      "Delete Message",
      "Are you sure you want to delete this message?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => ok() }
      ],
      { cancelable: false }
    );
    
    const ok = () => {
      db.collection("chats").doc(route.params.id).collection("messages").doc(msgid).delete().catch((error) => {
        alert(error);
    });
    }
  };

  return (
    <SafeAreaView style={styles.droidSafeArea}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : ""}
        style={styles.container}
        keyboardVerticalOffset={90}
      >
        <>
          <KeyboardAwareScrollView onContentSizeChange={()=>toBottom()} ref={scrollViewRef} contentContainerStyle={{ paddingTop: 15}}>
            <KeyboardListener
              onDidShow={()=>toBottom()}
            />
            {messages.map(({ id, data }) =>
              data.email === auth.currentUser.email ? (
                <TouchableOpacity key={id} onLongPress={()=>deleteMessage(id)}>
                <View  style={styles.sender}>
                  <Text style={styles.textSender}>{data.message}</Text>
                </View>
                </TouchableOpacity>
              ) : (
                <View key={id} style={styles.reciever}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 10,
                    }}
                  >
                    <Text style={styles.nameReciever}>{data.displayName}</Text>
                  </View>
                  <Avatar
                    rounded
                    position="absolute"
                    bottom={-15}
                    left={-5}
                    size={30}
                    source={{ uri: data.photoURL }}
                  />
                  <Text style={styles.textReciever}>{data.message}</Text>
                </View>
              )
            )}
            </KeyboardAwareScrollView>
          <View style={styles.footer}>
            <TextInput
              value={input}
              onChangeText={(text) => setInput(text)}
              placeholder="Type message..."
              style={styles.textInput}
              multiline
              />
            <TouchableOpacity disabled={!input} onPress={sendMessage} activeOpacity={0.5}>
              <Ionicons name="send" size={24} color="dodgerblue" />
            </TouchableOpacity>
          </View>
        </>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  head: {
    flexDirection: "row",
    alignItems: "center",
  },
  textHead: {
    color: "white",
    marginLeft: 10,
    fontWeight: "700",
  },
  rightHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 80,
    marginRight: 20,
  },
  droidSafeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: "white",
  },
  container: { flex: 1 },
  sender: {
    padding: 13,
    backgroundColor: "#ECECEC",
    alignSelf: "flex-end",
    borderRadius: 20,
    marginRight: 15,
    marginBottom: 20,
    minWidth: "50%",
    maxWidth: "80%",
    position: "relative",
  },
  reciever: {
    padding: 13,
    backgroundColor: "dodgerblue",
    alignSelf: "flex-start",
    borderRadius: 20,
    marginLeft: 15,
    marginBottom: 20,
    minWidth: "50%",
    maxWidth: "80%",
    position: "relative",
  },
  nameReciever: { 
    color: "white", 
    left:10, 
    paddingRight:10, 
    fontSize:10, 
  },
  textReciever: { 
    color: "white", 
    marginLeft:10, 
    marginBottom:15, 
    fontWeight:"500", 
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 15,
  },
  textInput: {
    bottom: 0,
    minHeight: 40,
    flex: 1,
    marginRight: 15,
    backgroundColor: "#ECECEC",
    padding: 10,
    color: "black",
    borderRadius: 30,
  },
});
