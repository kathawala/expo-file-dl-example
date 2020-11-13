/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useEffect, useState } from "react";
import { StyleSheet, View, TextInput, Button, StatusBar } from "react-native";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import {
  AndroidImportance,
  AndroidNotificationVisibility,
  NotificationChannel,
  NotificationChannelInput,
  NotificationContentInput,
} from "expo-notifications";
import { downloadToFolder } from "expo-file-dl";

declare const global: { HermesInternal: null | {} };

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const channelId = "DownloadInfo";

const App = () => {
  const [uri, setUri] = useState("");
  const [filename, setFilename] = useState("");

  async function setNotificationChannel() {
    const loadingChannel: NotificationChannel | null = await Notifications.getNotificationChannelAsync(
      channelId
    );

    // if we didn't find a notification channel set how we like it, then we create one
    if (loadingChannel == null) {
      const channelOptions: NotificationChannelInput = {
        name: channelId,
        importance: AndroidImportance.HIGH,
        lockscreenVisibility: AndroidNotificationVisibility.PUBLIC,
        sound: "default",
        vibrationPattern: [250],
        enableVibrate: true,
      };
      await Notifications.setNotificationChannelAsync(
        channelId,
        channelOptions
      );
    }
  }

  useEffect(() => {
    setNotificationChannel();
  });

  // IMPORTANT: You MUST obtain MEDIA_LIBRARY permissions for the file download to succeed
  // If you don't the downloads will fail
  async function getMediaLibraryPermissions() {
    await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
  }

  // You also MUST obtain NOTIFICATIONS permissions to show any notification
  // to the user. Please read the docs for more on permissions for notifications
  // https://docs.expo.io/versions/latest/sdk/notifications/#fetching-information-about-notifications-related-permissions
  async function getNotificationPermissions() {
    await Permissions.askAsync(Permissions.NOTIFICATIONS);
  }

  useEffect(() => {
    getMediaLibraryPermissions();
  });

  useEffect(() => {
    getNotificationPermissions();
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <TextInput
        value={uri}
        placeholder="http://www.example.com/image.jpg"
        onChangeText={(val) => setUri(val)}
        style={styles.width80}
      />
      <TextInput
        value={filename}
        placeholder="image.jpg"
        onChangeText={(val) => setFilename(val)}
        style={styles.width80}
      />
      <Button
        title="Download"
        onPress={async () => {
          // You can also call downloadToFolder with custom notification content, or without any notifications sent at all

          // ***************************
          // custom notification content
          // ***************************
          // const customNotifInput: {downloading: NotificationContentInput, finished: NotificationContentInput, error: NotificationContentInput} = {
          //   downloading: { title: "Custom title 1", body: 'Custom body 1', color: '#06004a' },
          //   finished: { title: "Custom title 2", body: 'Custom body 2', color: '#004a00' },
          //   error: { title: "Custom title 3", body: 'Custom body 3', color: '#810002' }
          // };
          // await downloadToFolder(uri, filename, "Download", channelId, { notification: "custom" }, customNotifInput);

          // ****************
          // no notifications
          // ****************
          // await downloadToFolder(uri, filename, "Download", channelId, { notification: "none" });

          // *******
          // default
          // *******
          await downloadToFolder(uri, filename, "Download", channelId);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  width80: {
    width: "80%",
  },
});

export default App;
