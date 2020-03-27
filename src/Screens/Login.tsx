import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Linking} from 'react-native';
import Background from '../Components/Background';
import Logo from '../Components/Logo';
import Header from '../Components/Header';
import Button from '../Components/Button';
import TextInput from '../Components/TextInput';
import { theme } from '../Core/theme';

export default class LoginScreen extends Component {
  render() {
    return (
      <Background>

        <Logo />

        <Header>Добро пожаловать!</Header>

        <TextInput
          label="Логин"
          returnKeyType="next"
          value={""}
          autoCapitalize="none"
          textContentType="username"
          keyboardType="default"
        />

        <TextInput
          label="Пароль"
          returnKeyType="done"
          value={""}
          secureTextEntry
        />

        <View style={styles.forgotPassword}>
          <TouchableOpacity
            onPress={() => Linking.openURL('https://grade.sfedu.ru/remind')}
          >
            <Text style={styles.label}>Забыли пароль?</Text>
          </TouchableOpacity>
        </View>

        <Button mode="contained">
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
});
