import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Alert, Linking, AppState, BackHandler } from 'react-native';
import { TextInput } from 'react-native-paper';
import { wS, hS } from "../Utils/Scale"
import { WebView } from 'react-native-webview';
import { Spinner } from 'native-base';
import * as SecureStore from 'expo-secure-store';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import { authUser } from "../Utils/Utils"
export interface Props {
    nav: any;
}

interface State {
    countOfLoading: number;
    isRefreshing: boolean;
    url: string;
    injection: string;
    badUrls: number;
    isShow: boolean;
}


export default class BRS extends Component<Props, State> {
    username = ''
    password = ''
    backCount = 0
    url = ''

    hiderwb() {
        this.setState({ isShow: false })
    }


    async checker(val) {
        this.sleep(5200).then(() => {
            if (this.state.isShow == false && this.backCount == val) {
                Alert.alert(
                    'Ошибка',
                    'Не удалось загрузить страницу',
                    [
                        { text: 'Я подожду', onPress: () => console.log('OK Pressed') },
                        { text: 'Перезагрузить', onPress: () => this.refresh() },
                    ],
                    { cancelable: true },
                );
            }
        })
    }

    async refresh(val) {
        this.backCount++; //Невероятно красивое решение!!!!!!!!!!!!!!!!!!
        this.checker(val);
        this.username = await SecureStore.getItemAsync("username");
        this.password = await SecureStore.getItemAsync("password");
        this.setState({ url: 'https://openid.sfedu.ru/server.php?openid.return_to=http%3A%2F%2Fgrade.sfedu.ru%2Fhandler%2Fsign%2Fopenidfinish%3Fuser_role%3Dstudent&openid.mode=checkid_setup&openid.identity=https%3A%2F%2Fopenid.sfedu.ru%2Fserver.php%2Fidpage%3Fuser%3D' + this.username + '&openid.trust_root=http%3A%2F%2Fgrade.sfedu.ru&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.claimed_id=https%3A%2F%2Fopenid.sfedu.ru%2Fserver.php%2Fidpage%3Fuser%3D' + this.username + '&openid.realm=http%3A%2F%2Fgrade.sfedu.ru&openid.ns.sreg=http://openid.net/extensions/sreg/1.1&openid.sreg.optional=email%2Cnickname%2Cr61globalkey%2Cstaff%2Cstudent%2Cr61studentid&', injection: "document.querySelector('#foo > table > tbody > tr:nth-child(1) > td > input[type=password]').value = '" + this.password + "';document.querySelector('#foo > table > tbody > tr:nth-child(2) > td > input[type=submit]:nth-child(1)').click();" })
        this.setState({ countOfLoading: 0, badUrls: 0, isShow: false })
        this.refWebview.clearCache();
        this.refWebview.injectJavaScript('window.location.assign("' + this.state.url + '");')
        this.refWebview.injectJavaScript(this.state.injection)
    }

    _handleAppStateChange = nextAppState => {

        if (nextAppState === "active") {
            if (!this.state.isRefreshing) {
                this.setState({ isRefreshing: true }, () => { this.refresh() })
            }
        }
    };

    constructor(props: Props) {
        super(props);
        this.state = { isShow: false, countOfLoading: 0, isRefreshing: false, url: '', injection: "", badUrls: 0 }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    logout() {
        SecureStore.deleteItemAsync("username")
        SecureStore.deleteItemAsync("password")
        Alert.alert(
            'Ошибка',
            'Неправильный логин или пароль. Войдите снова',
            [
                { text: 'Ок', onPress: () => console.log('OK Pressed') },
            ],
            { cancelable: false },
        );
        this.props.nav("login")
    }

    async componentDidMount() {
        AppState.addEventListener("change", this._handleAppStateChange);
        var isFirst = await SecureStore.getItemAsync("isFirstBRS")
        if (isFirst == null) {
            await SecureStore.setItemAsync("isFirstBRS", "1")
            Alert.alert(
                'Информация',
                'В данном окне будет автоматически загружаться БРС, для перехода назад на главную используйте свайп влево',
                [
                    { text: 'Ок', onPress: async () => console.log("ok") },
                ],
                { cancelable: false },
            );
        }
        this.username = await SecureStore.getItemAsync("username");
        this.password = await SecureStore.getItemAsync("password");
        this.setState({ url: 'https://openid.sfedu.ru/server.php?openid.return_to=http%3A%2F%2Fgrade.sfedu.ru%2Fhandler%2Fsign%2Fopenidfinish%3Fuser_role%3Dstudent&openid.mode=checkid_setup&openid.identity=https%3A%2F%2Fopenid.sfedu.ru%2Fserver.php%2Fidpage%3Fuser%3D' + this.username + '&openid.trust_root=http%3A%2F%2Fgrade.sfedu.ru&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.claimed_id=https%3A%2F%2Fopenid.sfedu.ru%2Fserver.php%2Fidpage%3Fuser%3D' + this.username + '&openid.realm=http%3A%2F%2Fgrade.sfedu.ru&openid.ns.sreg=http://openid.net/extensions/sreg/1.1&openid.sreg.optional=email%2Cnickname%2Cr61globalkey%2Cstaff%2Cstudent%2Cr61studentid&', injection: "document.querySelector('#foo > table > tbody > tr:nth-child(1) > td > input[type=password]').value = '" + this.password + "';document.querySelector('#foo > table > tbody > tr:nth-child(2) > td > input[type=submit]:nth-child(1)').click();" })
        this.checker();
    }



    async handleNavChange(data) {
        if (data == null) return;
        if (data.nativeEvent == null) return;
        if (data.nativeEvent.url == null) return;
        this.url = data.nativeEvent.url
        this.refWebview.injectJavaScript('var err=document.querySelector("#content > ul");null==err?console.log("ok"):window.ReactNativeWebView.postMessage("logout");var c =document.querySelector("#wrap > div.header_wrapper > div.navigation > a"); c.setAttribute("href","");var b = document.getElementsByClassName("footer")[0]; b.remove();b = document.getElementsByClassName("helpLink")[0]; b.remove();var popup=document.querySelector("body > div.popup_overlay"),observer=new MutationObserver(function(){"none"!=popup.style.display&&(window.ReactNativeWebView.postMessage("NeedReload!"),popup.style.display="none")});observer.observe(popup,{attributes:!0,childList:!0});')

        if (data.nativeEvent.url.includes("https://grade.") && this.state.countOfLoading == 0) {
            this.setState({ countOfLoading: 1, isShow: false })
            return
        }

        if (data.nativeEvent.url.includes("https://grade.") && !this.state.isShow) {
            await new Promise(r => setTimeout(r, 250));
            this.setState({ isShow: true, isRefreshing: false, badUrls: 0 })
        }
    }

    refWebview = null

    onSwipeLeft(state) {
        if (this.state.isShow) {
            if (this.url != 'https://grade.sfedu.ru/') {
                this.refWebview.goBack()
            }
        }
    }


    render() {
        const config = {
            velocityThreshold: 0.01,
            directionalOffsetThreshold: 95
        };
        return (
            <View style={{ flex: 1 }}>
                {!this.state.isShow && <View style={{ height: "100%", justifyContent: "center" }}><Spinner style={{ alignSelf: "center" }} color={"#600EE6"} /></View>}
                <GestureRecognizer
                    onSwipeRight={(state) => this.onSwipeLeft(state)}
                    config={config}
                    style={{
                        flex: 1,
                    }}
                >
                    <WebView
                        ref={(r) => { this.refWebview = r }}
                        source={{ uri: this.state.url }}
                        javaScriptEnabled={true}
                        injectedJavaScript={this.state.injection}
                        onLoadEnd={(i) => { this.handleNavChange(i) }}
                        showsVerticalScrollIndicator={false}
                        onMessage={(i) => { if (i.nativeEvent.data == "NeedReload!") { /*Иногда по 2 раза рефрешит*/ }; if (i.nativeEvent.data == "logout") { this.logout() } }}
                        sharedCookiesEnabled
                        thirdPartyCookiesEnabled
                        domStorageEnabled
                    />
                </GestureRecognizer>
            </View>
        );
    }
}
const styles = StyleSheet.create({
});