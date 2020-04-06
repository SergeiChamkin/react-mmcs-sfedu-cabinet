import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Container, Header, Content, Tab, Tabs, Text, Left, Body, View } from 'native-base';
import moment, { isMoment } from "moment";
import momentRU from 'moment/locale/ru'
import { theme } from '../core/theme';
import Cell from '../Components/Cell'
import { wS } from '../Utils/Scale';
export interface Props { }

interface State {

}

export default class Schedule extends Component {

    constructor(props: Props) {
        super(props);
        moment.updateLocale('ru', momentRU);
        this.state = {}
    }


    render() {
        return (
            <Container>
                <Header style={{ backgroundColor: theme.colors.primary }}>
                    <Left>
                        <Text style={{ fontSize: 20, color: "white" }}>{moment().format('LL')}</Text>
                    </Left>
                    <Body />
                </Header>
                <Tabs>
                    <Tab heading="Tab1" tabStyle={{ backgroundColor: theme.colors.primary }}>
                        <View style={{ marginLeft: wS(11), marginRight: wS(11) }}>
                            <Cell
                                subjects={[{ time: ["11:55", "14:35"], subject: ["Мат. Статистика", "БД"], cab: [[309], [310]], teachers: [["Земблякова"], ["Крутько"]] }, { time: ["11:55", "14:35"], subject: ["Мат. Статистика", "БД"], cab: [[309], [312]], teachers: [["Земблякова"], ["Крутько2"]] }]}
                            />
                            <Cell
                                subjects={[{ time: ["11:55", "14:35"], subject: ["Мат. Статистика", "БД"], cab: [[309], [310]], teachers: [["Земблякова"], ["Крутько"]] }, { time: ["11:55", "14:35"], subject: ["Мат. Статистика", "БД"], cab: [[309], [312]], teachers: [["Земблякова"], ["Крутько2"]] }]}
                            />
                            <Cell
                                subjects={[{ time: ["11:55", "14:35"], subject: ["Мат. Статистика", "БД"], cab: [[309], [310]], teachers: [["Земблякова"], ["Крутько"]] }, { time: ["11:55", "14:35"], subject: ["Мат. Статистика", "БД"], cab: [[309], [312]], teachers: [["Земблякова"], ["Крутько2"]] }]}
                            />
                        </View>
                    </Tab>
                    <Tab heading="Tab2" tabStyle={{ backgroundColor: theme.colors.primary }}>
                        <Text>21414</Text>
                    </Tab>
                    <Tab heading="Tab3" tabStyle={{ backgroundColor: theme.colors.primary }}>
                        <Text>21414</Text>
                    </Tab>
                </Tabs>
            </Container>
        );
    }
}
const styles = StyleSheet.create({
    root: {
        flex: 1
    }
});
