import React from 'react';
import { StyleSheet, View, Keyboard, AsyncStorage } from 'react-native';
import LoginScreen from './src/Screens/Login'
import { AppLoading, Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import { Container, Text } from 'native-base';
import * as Font from 'expo-font';
import Constants from 'expo-constants'
import { Ionicons } from '@expo/vector-icons';
import Schedule from './src/Screens/Schedule'
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import * as SecureStore from 'expo-secure-store';
import { getMarks } from "./src/Utils/Utils"
import BRS from '../src/Screens/Brs'
import BottomTabNavigation from "./src/Navigation/BottomTabNavigation"
import BNavigation from "./src/Navigation/BottomNavigationMain"
import { getTypeOfWeek } from './src/Utils/Utils'
export interface Props { }

interface State {
  isReady: boolean;
  screen: string;
}


TaskManager.defineTask("BACKGROUND_CHECK_MARKS", async () => {
  console.log("Started")
  var perm = await Permissions.getAsync(Permissions.NOTIFICATIONS)
  console.log(perm.permissions.notifications.status=="granted")
  if(perm.permissions.notifications.status!="granted"){
    return BackgroundFetch.Result.NoData
  }

  try {

    var b = await SecureStore.getItemAsync("backgroundCheck")
    if (b != null) global.backSwitch = b == "true"
    else global.backSwitch = true
    var bb = await SecureStore.getItemAsync("nightCheck")
    if (bb != null) global.nightSwitch = bb == "true"

    if (!b) {
      return BackgroundFetch.Result.NoData
    }

    var h = new Date().getHours();

    if (bb) {
      if (h > 21 || h < 7) {
        return BackgroundFetch.Result.NoData
      }
    }

    var username = await SecureStore.getItemAsync("username");
    var password = await SecureStore.getItemAsync("password");
    if (username == null || password == null) {
      return BackgroundFetch.Result.Failed
    }


    var prev = await SecureStore.getItemAsync("prev");
    if (prev == undefined) {
      //console.log("Установил оценки")
      prev = await getMarks(username, password)
      await SecureStore.setItemAsync("prev", prev)
      return BackgroundFetch.Result.NewData
    }
    var newMarks = await getMarks(username, password)
    //console.log(newMarks + " vs " + prev)


    if (prev != newMarks) {
      const localNotification = {
        title: "Выставленна новая оценка!",
        body: "Проверьте её в приложении",
        data: "",
        ios: {
          sound: true
        },
        sound: true,
        android: {
          sound: true
        }
      }
      Notifications.presentLocalNotificationAsync(localNotification).catch((err) => {
        console.log(err)
      })
      await SecureStore.setItemAsync("prev", newMarks)
    }

    const receivedNewData = "None=)"
    return receivedNewData ? BackgroundFetch.Result.NewData : BackgroundFetch.Result.NoData;
  } catch (error) {
    return BackgroundFetch.Result.Failed;
  }
});



BackgroundFetch.registerTaskAsync("BACKGROUND_CHECK_MARKS", {
  minimumInterval: 30 * 60
});


export default class App extends React.Component<Props, State> {


constructor(props) {
  super(props);
  this.state = {
    isReady: false,
  };
}

async componentDidMount() {

  var perm = await Permissions.getAsync(Permissions.NOTIFICATIONS)
  //console.log(perm.permissions.notifications.status=="granted")

  BackgroundFetch.setMinimumIntervalAsync(60 * 30)
  //console.log(await TaskManager.getRegisteredTasksAsync())

  await Font.loadAsync({
    Roboto: require('native-base/Fonts/Roboto.ttf'),
    Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
    ...Ionicons.font,
  });


  var sc = await SecureStore.getItemAsync("screen")
  if (sc != null) global.value = sc;
  else global.value = "Расписание"

  var b = await SecureStore.getItemAsync("backgroundCheck")
  if (b != null) global.backSwitch = b == "true"
  else global.backSwitch = true
  var bb = await SecureStore.getItemAsync("nightCheck")
  if (bb != null) global.nightSwitch = bb == "true"
  else global.nightSwitch = false
  global.s = JSON.parse(await AsyncStorage.getItem("timetable"))
  global.week = await getTypeOfWeek()
  var username = await SecureStore.getItemAsync("username");
  var password = await SecureStore.getItemAsync("password");


  /*
  this.setState({ screen: "login", isReady: true })
  return
  */

  if (username == null || password == null) {
    this.setState({ screen: "login", isReady: true })
    return
  }

  this.setState({ isReady: true, screen: "BNavigation" });
  //
}

nav(where) {
  this.setState({ screen: where })
}

render() {
  if (!this.state.isReady) {
    return <AppLoading />;
  }
  if (this.state.screen == "login") {
    return <LoginScreen nav={(i) => { this.nav(i) }} />
  } else
    return (
      <BNavigation nav={(i) => { this.nav(i) }} />
    );
}

}

const styles = StyleSheet.create({
});
