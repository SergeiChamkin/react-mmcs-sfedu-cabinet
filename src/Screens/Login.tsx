import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Alert } from 'react-native';
import { TextInput } from 'react-native-paper';
import Background from '../Components/Background';
import Logo from '../Components/Logo';
import Header from '../Components/Header';
import Button from '../Components/Button';
import { theme } from '../core/theme';
import axios from 'axios';
export interface Props { }

interface State {
  username: string,
  password: string,
  isAuthClicked: boolean
}

export default class LoginScreen extends Component {

  constructor(props: Props) {
    super(props);
    this.state = { username: "", password: "", isAuthClicked: false }
  }

  auth() {
    if (this.state.isAuthClicked == true) {
      return
    }
    this.setState({ isAuthClicked: true }, () => {
      var bodyFormData = new FormData();
      bodyFormData.append('openid_url', this.state.username);
      bodyFormData.append('password', this.state.password);
      axios({
        method: 'post',
        url: 'https://openid.sfedu.ru/server.php/login',
        data: bodyFormData
      })
        .then((response) => {
          console.log(response.data);
          if (!response.data.includes("Вы вошли как")) {
            Alert.alert(
              'Не удалось войти',
              'Неправильный логин или пароль',
              [
                { text: 'Ок', onPress: () => console.log('OK Pressed') },
              ],
              { cancelable: false },
            );
            this.setState({isAuthClicked:false})
          }
        })
        .catch((error) => {
          Alert.alert(
            'Не удалось войти',
            'Нет подключения к сети',
            [
              { text: 'Ок', onPress: () => console.log('OK Pressed') },
            ],
            { cancelable: false },
          );
          this.setState({ isAuthClicked: false })
        });
    })
  }


  render() {
    return (
      <Background>

        <Logo />

        <Header>Добро пожаловать!</Header>


        <View style={styles.inputContainer}>
          <TextInput
            label="Логин"
            returnKeyType="next"
            style={styles.input}
            value={this.state.username}
            selectionColor={theme.colors.primary}
            underlineColor="transparent"
            mode="outlined"
            onChangeText={(text) => { this.setState({ username: text }) }}
            autoCapitalize="none"
            textContentType="username"
            keyboardType="default"
            onSubmitEditing={() => {
              this.pass.focus()
            }}
          />
        </View>



        <View style={styles.inputContainer}>
          <TextInput
            ref={input => {
              this.pass = input;
            }}
            style={styles.input}
            selectionColor={theme.colors.primary}
            underlineColor="transparent"
            mode="outlined"
            ref={input => {
              console.log("refed")
              this.pass = input;
            }}
            label="Пароль"
            returnKeyType="done"
            onChangeText={(text) => { this.setState({ password: text }) }}
            value={this.state.password}
            secureTextEntry
            blurOnSubmit
          />
        </View>


        <View style={styles.forgotPassword}>
          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPasswordScreen')}
          >
            <Text style={styles.label}>Забыли пароль?</Text>
          </TouchableOpacity>
        </View>

        <Button mode="contained" onPress={() => { this.auth() }} disabled={this.state.isAuthClicked}>
          Войти
        </Button>

        <View style={styles.row}>
          <Text style={styles.label}>Ещё нет аккаунта? </Text>
          <TouchableOpacity>
            <Text style={styles.link}>Завести!</Text>
          </TouchableOpacity>
        </View>
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
    marginTop: 4,
  },
  label: {
    color: "#414757",
  },
  link: {
    fontWeight: 'bold',
    color: "#600EE6",
  },
  inputContainer: {
    width: '100%',
    marginVertical: 12,
  },
  input: {
    backgroundColor: theme.colors.surface,
  },
});
