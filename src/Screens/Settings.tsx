import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Alert, Linking, AppState, BackHandler, ImageBackground } from 'react-native';
import { TextInput, Switch, Divider } from 'react-native-paper';
import { wS, hS } from "../Utils/Scale"
import { Spinner, Icon, Picker, Form,Item } from 'native-base';
import * as SecureStore from 'expo-secure-store';
import { Header } from "native-base"
import { theme } from '../core/theme';
import RNPickerSelect from 'react-native-picker-select';
export interface Props {
    nav: any;

}

interface State {
    value: string;
    backSwitch: boolean;
    nightSwitch: boolean;
}

export default class Settings extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = { selected: global.value == null ? "Расписание" : global.value, backSwitch: global.backSwitch == null ? true : global.backSwitch, nightSwitch: global.nightSwitch == null ? false : global.nightSwitch }
    }


    async componentDidMount() {
        console.log(this.state.backSwitch + " " + this.state.nightSwitch)
    }

    onValueChange(value: string) {
        console.log(value)
        SecureStore.setItemAsync("screen", value)
        this.setState({
            selected: value
        });
    }

    onSwitchBackground(val) {
        console.log(!this.state.backSwitch)
        if (!this.state.backSwitch == false) {
            SecureStore.setItemAsync("nightCheck", (false).toString())
            this.setState({ nightSwitch: false })
        }

        SecureStore.setItemAsync("backgroundCheck", (!this.state.backSwitch).toString())
        this.setState({ backSwitch: !this.state.backSwitch })
    }

    onSwitchBackgroundNight(val) {
        console.log(!this.state.nightSwitch)
        SecureStore.setItemAsync("nightCheck", (!this.state.nightSwitch).toString())
        this.setState({ nightSwitch: !this.state.nightSwitch })
    }

    async logOut() {
        await SecureStore.deleteItemAsync("username")
        await SecureStore.deleteItemAsync("password")
        this.props.nav("login")
    }

    render() {
        return (
            <View style={{ flex: 1 }}>

                <Header style={{ backgroundColor: theme.colors.primary, flexDirection: "row", justifyContent: "center", width: "100%" }} noShadow={true} androidStatusBarColor={theme.colors.primary}>
                    <View style={{ flexDirection: "row" }}>
                        <Text style={{ fontSize: 20, color: "white", alignSelf: "center" }}>{"Настройки"}</Text>
                    </View>
                </Header>
                <ImageBackground
                    source={require('../../assets/background_dot.png')}
                    resizeMode="repeat"
                    style={{
                        flex: 1,
                        width: '100%',
                    }}
                >

                    <View style={{ marginLeft: wS(17), marginRight: wS(17), marginTop: hS(20), flexDirection: "column", justifyContent: "space-between", flex: 1 }}>
                        <View>
                            <Dividers text={"Окно по умолчанию"}></Dividers>
                            <Item picker>
                                <Picker
                                    mode="dropdown"
                                    iosIcon={<Icon name="arrow-down" />}
                                    style={{ width: undefined }}
                                    placeholderStyle={{ color: "#bfc6ea" }}
                                    placeholderIconColor="#007aff"
                                    onValueChange={(value) => {this.onValueChange(value)}}
                                    selectedValue={this.state.selected}
                                >
                                    <Picker.Item label="БРС" value="БРС" />
                                    <Picker.Item label="Расписание" value="Расписание" />
                                </Picker>
                            </Item>
                            <View style={{marginTop:hS(15)}}/>
                            <Dividers text={"Настройки фоновой проверки"}></Dividers>
                            <View style={{ flexDirection: "row", justifyContent: 'space-between', marginTop: hS(15) }}>
                                <Text style={{ width: wS(250), fontSize: 18 }}>
                                    Включить проверку оценок в фоновом режиме
                            </Text>
                                <Switch
                                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={(i) => { this.onSwitchBackground(i) }}
                                    value={this.state.backSwitch}
                                >

                                </Switch>
                            </View>

                            <View style={{ flexDirection: "row", justifyContent: 'space-between', marginTop: hS(15) }}>
                                <Text style={{ width: wS(250), fontSize: 18 }}>
                                    Проверять оценки ночью
                            </Text>
                                <Switch
                                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={(i) => { this.onSwitchBackgroundNight(i) }}
                                    value={this.state.nightSwitch}
                                    disabled={!this.state.backSwitch}
                                >

                                </Switch>
                            </View>
                        </View>
                        <TouchableOpacity style={{ borderBottomColor: "red", borderBottomWidth: 1, width: wS(250), marginBottom: hS(30), alignSelf: "center" }} onPress={() => { this.logOut() }}>
                            <Text style={{ fontSize: 25, alignSelf: "center", color: 'red', }}>Выйти из аккаунта</Text>
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
            </View>
        );
    }
}
const styles = StyleSheet.create({
});

class Dividers extends React.Component {
    render() {
        return (
            <View
                style={{
                    borderBottomColor: "grey",
                }}
            >
                <Text
                    style={{
                        fontSize: 20,
                        borderBottomWidth: 0.5,
                        textAlign: "left"
                    }}
                >
                    {this.props.text}
                </Text>
            </View>
        );
    }
}