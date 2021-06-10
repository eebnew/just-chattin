import { StatusBar } from "expo-status-bar";
import React, { useLayoutEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Input } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { auth, db } from "../firebase";

const AddChatScreen = ({ navigation }) => {
  const createChat = async () => {
    await db
      .collection("chats")
      .add({
        chatName: input,
      })
      .then(() => navigation.goBack())
      .catch((error) => alert(error));
  };

  const [input, setInput] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Add a new chat",
      headerBackTitle: "Chats",
    });
  }, [navigation]);
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Input
        placeholder="Enter the chat name"
        value={input}
        onSubmitEditing={createChat}
        onChangeText={(text) => setInput(text)}
        leftIcon={() => (
          <Icon name="wechat" type="antdesign" size={24} color="black" />
        )}
      />
      <Button disabled={!input} title="Create new chat" onPress={createChat} />
    </View>
  );
};

export default AddChatScreen;

const styles = StyleSheet.create({
  container: {
    padding: 30,
    backgroundColor: "#fff",
    height: "100%",
  },
});
