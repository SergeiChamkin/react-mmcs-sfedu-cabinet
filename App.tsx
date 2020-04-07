import React from 'react';
import { StyleSheet, View } from 'react-native';
import LoginScreen from './src/Screens/Login'
import { AppLoading } from 'expo';
import { Container, Text } from 'native-base';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import Schedule from './src/Screens/Schedule'
import BNavigation from './src/Navigation/BottomTabNavigation'
export interface Props { }

interface State {
  isReady: boolean
}

export default class App extends React.Component<Props, State> {

  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      ...Ionicons.font,
    });
    this.setState({ isReady: true });
  }

  render() {
    if (!this.state.isReady) {
      return <AppLoading />;
    }

    return (
      <LoginScreen/>
    );
  }

}

const styles = StyleSheet.create({
});
