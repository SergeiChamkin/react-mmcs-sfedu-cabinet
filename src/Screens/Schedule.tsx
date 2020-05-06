import React, { Component } from 'react';
import { StyleSheet, AsyncStorage, Animated, ScrollView, TouchableOpacity, Alert, AppState, BackHandler, StatusBar } from 'react-native';
import { Container, Header, Content, Tab, Tabs, Text, Left, Body, View, Spinner, Card, Right } from 'native-base';
import moment, { isMoment } from "moment";
import momentRU from 'moment/locale/ru'
import { theme } from '../core/theme';
import Cell from '../Components/Cell'
import { wS, hS } from '../Utils/Scale';
import * as SecureStore from 'expo-secure-store';
import { AppLoading } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import { refreshSchedule, getTypeOfWeek } from "../Utils/Utils"
import Constants from 'expo-constants'

export interface Props { nav: any }

interface State {
    typeWeek: string;
    isLoading: boolean;
    timetable: any;
    importantTitle: string;
    isRefreshing: boolean;
    selectedTab:number
}

export default class Schedule extends Component {


    async refresh() {
        try {
            this.tab=this.getRelevantIndex();
            var newWeek = await getTypeOfWeek();
            var oldTimetable = await AsyncStorage.getItem("timetable");
            var newTimeTable = await refreshSchedule();

            var reloadTimetable = false;
            if (JSON.stringify(global.s) != oldTimetable) {
                console.log("should reload")
                //await AsyncStorage.setItem("timetable",JSON.stringify(global.s))
                reloadTimetable = true;
            }

            //console.log(oldTimetable)
            //console.log("new week:" + newWeek)

            if (newWeek != this.state.week) {
                if (reloadTimetable) {
                    this.setState({ typeWeek: newWeek, isRefreshing: false, timetable: global.s })
                } else {
                    this.setState({ typeWeek: newWeek, isRefreshing: false })
                }
                this.getStringTypeOfWeek()
            }
            console.log("ended background update!")
            this.forceUpdate()

        } catch (err) {
            console.log(err)
        }
    }

    _handleAppStateChange = nextAppState => {
        if (nextAppState === "active") {
            if (!this.state.isRefreshing) {
                this.setState({ isRefreshing: true }, async () => { this.refresh() })
            }
            this.forceUpdate()
        }
    };


    constructor(props: Props) {
        super(props);
        moment.updateLocale('ru', momentRU);
        this.state = { typeWeek: global.week, isLoading: false, timetable: global.s, importantTitle: "", isRefreshing: false }
    }


    async componentDidMount() {
        this.tab=this.getRelevantIndex();
        //this.refresh();
        AppState.addEventListener("change", this._handleAppStateChange);
        this.getStringTypeOfWeek();
        var isFirst = await SecureStore.getItemAsync("isFirstS")
        if (isFirst == null) {
            await SecureStore.setItemAsync("isFirstS", "1")
            Alert.alert(
                'Информация',
                'В данном окне отображается расписание. Линией разделяются предметы по верхней и нижней неделе соответственно расположению. Расписание обновляется автоматически, но есть возможность ручного обновления с помощью нажатия на refresh button. Для дополнительной информации о паре нажмите на неё.',
                [
                    { text: 'Ок', onPress: async () => console.log("ok") },
                ],
                { cancelable: false },
            );
        }
    }

    simpleMerger(data) {
        data.sort((a, b) => {
            if (a.subjectname < b.subjectname) {
                return -1;
            }
            if (a.subjectname > b.subjectname) {
                return 1;
            }
            return 0;
        })

        for (var i = 0; i < data.length - 1; i++) {
            if (data[i].subjectname == data[i + 1].subjectname) {
                if (!data[i].roomname.includes(data[i + 1].roomname) && !data[i].teachername.includes(data[i + 1].teachername)) {
                    data[i].roomname += "\n" + data[i + 1].roomname;
                    data[i].teachername += "\n" + data[i + 1].teachername;
                    data[i].teacherdegree += "\n" + data[i + 1].teacherdegree;
                    i -= 1
                }
                data.splice(i + 1, 1);
            }
        }

        return data;
    }

    getData(id, index, type) {
        var ids = [id];

        for (var i = 0; i < this.state.timetable.lessons.length; i++) {
            if (this.state.timetable.lessons[i].times[0] == this.state.timetable.lessons[index].times[0] &&
                this.state.timetable.lessons[i].times[1] == this.state.timetable.lessons[index].times[1] &&
                this.state.timetable.lessons[i].times[2] == this.state.timetable.lessons[index].times[2] && i != index) {
                ids.push(this.state.timetable.lessons[i].id)
                this.used[i] = true;
                if (this.state.timetable.lessons[i].timeslot == 'upper') {
                    var temp = ids[0]
                    ids[0] = ids[1]
                    ids[1] = temp
                }
                break;
            }
        }

        var data1 = [];
        var data2 = [];
        for (var i = 0; i < this.state.timetable.curricula.length; i++) {
            if (this.state.timetable.curricula[i].lessonid == id) {
                data1.push(this.state.timetable.curricula[i])
            } else
                if (ids.length == 2 && this.state.timetable.curricula[i].lessonid == ids[1]) {
                    data2.push(this.state.timetable.curricula[i])
                }
        }

        if (type == "lower" && ids.length == 1) {
            data2 = data1
            data1 = []
            data1.push({ id: Math.random() * 100 + 1 + "", subjectabbr: "", roomname: "", teachername: "" })
        }

        if (type == "upper" && ids.length == 1) {
            data2.push({ id: Math.random() * 100 + 1 + "", subjectabbr: "", roomname: "", teachername: "" })
        }

        return [this.simpleMerger(data1), this.simpleMerger(data2)];
    }

    getDay(index) {
        switch (index) {
            case 0:
                return "Пн"
            case 1:
                return "Вт"
            case 2:
                return "Ср"
            case 3:
                return "Чт"
            case 4:
                return "Пят"
            case 5:
                return "Суб"
        }
    }

    used = null;
    usedDays = null;

    posInUsed(index) {
        var iter = 0;
        for (var i = 0; i <=index; i++) {
            if (this.usedDays[i]) {
                iter++;
            }
        }
        return iter==0?0:iter-1;
    }

    getRelevantIndex() {
        //console.log(this.usedDays)
        var currDay=new Date().getDay()-1
        for (var i = 0; i < 6; i++) {
            if (!this.usedDays[i]) {
                continue
            } else {
                //console.log(i)
                if (i == currDay) {
                    //console.log("Find:" + i)
                    return this.posInUsed(i);
                    return
                }
            }
        }
        for (var i = currDay + 1; i <= 6; i++) {
            if (!this.usedDays[i]) {
                continue
            } else {
                //console.log("Find:" + i)
                return this.posInUsed(i);
            }
        }
        return 0;
    }

    tab=0;
    reft='';
    generateTabs() {
        this.usedDays = new Array(6).fill(false)
        var answ = []
        var currDay = 0
        var lessons = []
        this.used = new Array(this.state.timetable.lessons.length).fill(false)
        for (var i = 0; i < this.state.timetable.lessons.length; i++) {
            if (!this.used[i]) {
                this.used[i] = true
            } else {
                continue
            }
            if (this.state.timetable.lessons[i].timeslot[0] != currDay) {
                this.usedDays[currDay] = true
                answ.push(
                    <Tab heading={this.getDay(currDay)} tabStyle={{ backgroundColor: theme.colors.primary, elevation: 0 }} activeTabStyle={{ backgroundColor: theme.colors.primary }} textStyle={{ fontSize: 18, color: "white" }} activeTextStyle={{ fontSize: 18, color: "white" }}>
                        <ScrollView style={{ flex: 1 }} bounces={false}>
                            {lessons}
                            <View style={{ height: hS(28) }}></View>
                        </ScrollView>
                    </Tab>
                )
                lessons = []
                currDay = this.state.timetable.lessons[i].timeslot[0]
            }
            this.usedDays[currDay] = true
            lessons.push(
                <Cell
                    typeWeek={global.week} id={"CELL" + this.state.timetable.lessons[i].id + Math.random()} subjects={{ time: this.state.timetable.lessons[i].times, data: this.getData(this.state.timetable.lessons[i].id, i, this.state.timetable.lessons[i].timeslot[3]) }}
                />
            )
        }
        this.tab=this.getRelevantIndex()
        answ.push(
            <Tab heading={this.getDay(currDay)} tabStyle={{ backgroundColor: theme.colors.primary, elevation: 0 }} activeTabStyle={{ backgroundColor: theme.colors.primary }} textStyle={{ fontSize: 18, color: "white" }} activeTextStyle={{ fontSize: 18, color: "white" }}>
                <ScrollView style={{ flex: 1 }} bounces={false}>
                    {lessons}
                    <View style={{ height: hS(28) }}></View>
                </ScrollView>
            </Tab >
        )

        return (
            <Tabs prerenderingSiblingsNumber={10} style={{ flex: 1, elevation: 0 }} noShadow={true} tabContainerStyle={{
                elevation: 0
            }} initialPage={this.tab} ref={(r)=>{this.reft=r}} page={this.tab} onChangeTab={(i)=>{this.tab=i}}>
                {answ}
            </Tabs>
        )
    }


    async getStringTypeOfWeek() {
        var t = this.state.typeWeek
        if (t == 1) {
            this.setState({ typeWeek: " нижняя неделя" })
        } else {
            if (t == -1) {
                this.setState({ typeWeek: " неопр. неделя" })
            } else {
                this.setState({ typeWeek: " верхняя неделя" })
            }
        }
    }

    getClearTime() {
        var rawtime = moment().format('llll');
        rawtime = rawtime.replace(",", "").split(" ")
        rawtime = rawtime[1] + " " + rawtime[2]+" ("+rawtime[0].toUpperCase()+")"
        return rawtime
    }

    async refreshScheduleClicked() {
        if (this.state.importantTitle == "") {
            this.setState({ importantTitle: "Получаю расписание" }, async () => {
                try {
                    var r = await refreshSchedule()
                    if (r != "Ok") {
                        Alert.alert(
                            'Ошибка',
                            'Неправильный логин или пароль. Войдите снова',
                            [
                                { text: 'Ок', onPress: () => console.log('OK Pressed') },
                            ],
                            { cancelable: false },
                        );
                        await SecureStore.deleteItemAsync("username")
                        await SecureStore.deleteItemAsync("password")
                        this.props.nav("login")
                    } else {

                        Alert.alert(
                            'Успешно',
                            "Обновлено",
                            [
                                { text: 'Ок', onPress: () => console.log('OK Pressed') },
                            ],
                            { cancelable: false },
                        );

                    }

                } catch (err) {
                    Alert.alert(
                        'Ошибка',
                        'Невозможно подключиться к серверу',
                        [
                            { text: 'Ок', onPress: () => console.log('OK Pressed') },
                        ],
                        { cancelable: false },
                    );

                }
                this.setState({ importantTitle: "" })
            })
        }
    }

    render() {
        return (
            <View style={{ flex: 1 }}>

                <Header style={{ backgroundColor: theme.colors.primary, flexDirection: "row", justifyContent: "center", width: "100%" }} noShadow={true} androidStatusBarColor={theme.colors.primary}>
                    <View style={{ flexDirection: "row", marginLeft: wS(12), marginRight: wS(12), justifyContent: "space-between", flex: 1,alignSelf:"center" }}>
                        {this.state.importantTitle != "" ? <Text style={{ fontSize: 20, color: "white", alignSelf: "center", width: wS(500) }}>{this.state.importantTitle}</Text> :
                            <View style={{ flexDirection: "row" }}>
                                <Text style={{ fontSize: 20, color: "white", alignSelf: "center" }}>{this.getClearTime()}</Text>
                                <View style={{ justifyContent: "center", opacity: this.state.typeWeekAnim }}><Text style={{ fontSize: 20, color: "white" }}>{this.state.typeWeek}</Text></View>

                            </View>
                        }
                    </View>

                    <Right style={{alignSelf:"center"}}>
                        <TouchableOpacity style={{ flexDirection: "row", marginRight: wS(8) }} onPress={() => { this.refreshScheduleClicked() }}>
                            <Ionicons name="md-refresh" size={32} color="white" />
                        </TouchableOpacity>
                    </Right>
                </Header>
                <View style={{ flex: 1 }}>
                    {this.generateTabs()}
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    root: {
        flex: 1
    }
});
