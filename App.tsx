import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { AndroidImportance, AndroidNotificationVisibility, NotificationChannel, NotificationChannelInput } from 'expo-notifications';
import { downloadToFolder } from 'expo-file-dl';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const channelId = "DownloadInfo"

export default function App() {
  const [uri, setUri] = useState("");
  const [filename, setFilename] = useState("");

  async function setNotificationChannel() {
    const loadingChannel: NotificationChannel | null = await Notifications.getNotificationChannelAsync(channelId);

    // if we didn't find a notification channel set how we like it, then we create one
    if (loadingChannel == null) {
      const channelOptions: NotificationChannelInput = {
        name: channelId,
        importance: AndroidImportance.HIGH,
        lockscreenVisibility: AndroidNotificationVisibility.PUBLIC,
        sound: 'default',
        vibrationPattern: [250],
        enableVibrate: true
      };
      await Notifications.setNotificationChannelAsync(channelId, channelOptions);
    }
  }

  useEffect(() => {
    setNotificationChannel();
  });

  async function getCameraRollPermissions() {
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
  }
  useEffect(() => {
    getCameraRollPermissions();
  });

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <TextInput
        value={uri}
        placeholder="http://www.example.com/image.jpg"
        onChangeText={(uri) => setUri(uri)}
        style={{width: '80%'}}
      />
      <TextInput
        value={filename}
        placeholder="image.jpg"
        onChangeText={(filename) => setFilename(filename)}
        style={{width: '80%'}}
      />
      <Button title='Download' onPress={async () => {
        await downloadToFolder(uri, filename, "Download", channelId);
      }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
