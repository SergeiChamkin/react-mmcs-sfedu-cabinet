import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Alert, Linking, Keyboard, KeyboardAvoidingView, AsyncStorage } from 'react-native';
import { TextInput } from 'react-native-paper';
import Background from '../Components/Background';
import Logo from '../Components/Logo';
import Header from '../Components/Header';
import Button from '../Components/Button';
import { theme } from '../core/theme';
import axios from 'axios';
import AwesomeAlert from 'react-native-awesome-alerts';
import * as SecureStore from 'expo-secure-store';
import { authUser, getScheduleUtils } from "../Utils/Utils"
import { hS } from '../Utils/Scale';
import * as FileSystem from 'expo-file-system';
import { AppLoading } from 'expo';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants'


export interface Props { nav: Function }

interface State {
  username: string,
  password: string,
  isAuthClicked: boolean;
  showAlert: boolean;
  progress: boolean;
  message: string;
  isBad: boolean;
  isLoginGood: boolean;
  isPasswordGood: boolean;
}

export default class LoginScreen extends Component<Props, State> {
  pass: any;


  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  constructor(props: Props) {
    super(props);
    this.state = { username: "", password: "", isAuthClicked: false, showAlert: false, message: "Входим в аккаунт", progress: true, isBad: false, isLoginGood: false, isPasswordGood: false }
  }


  showAlert = () => {
    this.setState({
      showAlert: true
    });
  };

  hideAlert = () => {
    this.setState({
      showAlert: false
    });
  };

  async componentDidMount() {
    var isFirst = await SecureStore.getItemAsync("isFirstLogin")
    if (isFirst == null) {
      await SecureStore.setItemAsync("isFirstLogin", "1")
      var perm = await Permissions.getAsync(Permissions.NOTIFICATIONS)
      //console.log(perm)
      if(perm.permissions.notifications.status!="granted"){
        Alert.alert(
          'Информация',
          'Сейчас Вам предложат включить уведомления, это нужно для того, чтобы приложение могло в фоне уведомлять о новых оценках. Уведомления можно включить в настройках телефона',
          [
            { text: 'Ок', onPress: async () => this.askPermition() },
          ],
          { cancelable: false },
        );
      } else{
        Alert.alert(
          'Информация',
          'Данное приложение может уведомлять о новых оценках, для этого оставьте приложение работать в фоне.',
          [
            { text: 'Ок', onPress: async () =>{console.log("ok")} },
          ],
          { cancelable: true },
        );
      }
    }
  }

  async askPermition() {
    let result = await Permissions.askAsync(Permissions.NOTIFICATIONS);

    if (Constants.isDevice && result.status === 'granted') {
      console.log('Notification permissions granted.')
    }

  }

  async getSchedule() {
    try {
      var response = await getScheduleUtils(this.state.username);
      await AsyncStorage.setItem("timetable", JSON.stringify(response));
      global.s = response;
      this.setState({ message: "Успешно", progress: false });
      await this.sleep(500);
      this.props.nav("BNavigation")
      await this.sleep(3000)
      this.setState({ isAuthClicked: false, isBad: false, username: "", password: "" })
    } catch (e) {
      this.setState({ isAuthClicked: false, isBad: true, message: "Ошибка с сетью", progress: false })
    }
  }

  async auth() {
    Keyboard.dismiss()
    this.showAlert();
    

    if (this.state.isAuthClicked == true) {
      return
    }

    this.setState({ isAuthClicked: true, isBad: false, message: "Входим в аккаунт", progress: true }, async () => {
      try {
        //await fetch("https://openid.sfedu.ru/server.php/logout",2500);
        var response = await authUser(this.state.username, this.state.password);
        if (response.includes("Вы вошли как")) {
          await this.sleep(750)
          await SecureStore.setItemAsync("username", this.state.username)
          await SecureStore.setItemAsync("password", this.state.password)
          this.setState({ message: "Успешно!" })
          await this.sleep(650)
          this.setState({ message: "Получаю расписание" })
          this.getSchedule()
        } else {
          await this.sleep(750)
          this.setState({ message: "Неверные данные!", isBad: true, isAuthClicked: false, password: "", isPasswordGood: false, progress: false })
        }
      } catch (err) {
        this.setState({ message: "Ошибка c сетью!", isBad: true, isAuthClicked: false, password: "", isPasswordGood: false, progress: false })
      }
    })
  }

  checkPassword(text) {
    if (text.length >= 5 && /^[0-9a-zA-Z_.@#$%^&-]+$/.test(text)) {
      this.setState({ isPasswordGood: true });
    } else {
      this.setState({ isPasswordGood: false });
    }
  }

  //Возможно условия другие, поэтому оставил 2 функции
  checkLogin(text) {
    if (text.length >= 3 && /^[0-9a-zA-Z_.@-]+$/.test(text)) {
      this.setState({ isLoginGood: true });
    } else {
      this.setState({ isLoginGood: false });
    }
  }

  render() {
    const { showAlert } = this.state;
    return (
      <Background>

        <Logo />

        <Header>Добро пожаловать!</Header>


        <KeyboardAvoidingView style={{ width: "100%" }} behavior={"padding"} keyboardVerticalOffset={-hS(45)}>
            <View style={[styles.inputContainer, { zIndex: -1 }]}>
              <TextInput
                theme={{colors:{primary:theme.colors.primary}}}
                label="Логин"
                returnKeyType="next"
                style={styles.input}
                value={this.state.username}
                selectionColor={theme.colors.primary}
                underlineColor="transparent"
                mode="outlined"
                onChangeText={(text) => { this.setState({ username: text }); this.checkLogin(text) }}
                textContentType="username"
                keyboardType="default"
                onSubmitEditing={() => {
                  this.pass.focus()
                }}
                blurOnSubmit={false}

              />
            </View>



            <View style={[styles.inputContainer, { zIndex: -1 }]}>
              <TextInput
                ref={input => {
                  this.pass = input;
                }}
                theme={{colors:{primary:theme.colors.primary}}}
                style={styles.input}
                selectionColor={theme.colors.primary}
                underlineColor="transparent"
                mode="outlined"
                label="Пароль"
                returnKeyType="done"
                onChangeText={(text) => { this.setState({ password: text }); this.checkPassword(text) }}
                value={this.state.password}
                secureTextEntry
                blurOnSubmit={false}
                onSubmitEditing={() => {
                  if (!(this.state.isAuthClicked || !this.state.isLoginGood || !this.state.isPasswordGood)) {
                    this.auth()
                  }
                }}
              />
            </View>

            <View style={styles.forgotPassword}>
              <TouchableOpacity
                onPress={() => Linking.openURL('https://grade.sfedu.ru/remind')}
              >
                <Text style={styles.label}>Забыли пароль?</Text>
              </TouchableOpacity>
            </View>

            <View style={{ zIndex: -10, width: "100%" }}>
              <Button mode="contained" onPress={() => { this.auth() }} disabled={(this.state.isAuthClicked || !this.state.isLoginGood || !this.state.isPasswordGood)} style={{ zIndex: -1 }}>
                Войти
            </Button>
            </View>
        </KeyboardAvoidingView>
        <View style={styles.row}>
          <Text style={styles.label}>Ещё нет аккаунта? </Text>
          <TouchableOpacity>
            <Text style={styles.link}>Завести!</Text>
          </TouchableOpacity>
        </View>

        <AwesomeAlert
          show={showAlert}
          showProgress={this.state.progress}
          title="Авторизация"
          message={this.state.message}
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={false}
          showCancelButton={this.state.isBad}
          showConfirmButton={false}
          cancelText="Ок"
          confirmButtonColor="#DD6B55"
          progressColor={theme.colors.primary}
          titleStyle={{ fontSize: 27 }}
          messageStyle={{ fontSize: 18 }}
          progressSize={40}
          onCancelPressed={() => {
            this.hideAlert();
          }}
          onConfirmPressed={() => {
            this.hideAlert();
          }}
        />
      </Background>
    );
  }
}
const styles = StyleSheet.create({
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: hS(4),
    zIndex: -1
  },
  label: {
    color: "#414757",
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  inputContainer: {
    width: '100%',
    marginVertical: hS(14),
  },
  input: {
    backgroundColor: theme.colors.surface,
  },
});
