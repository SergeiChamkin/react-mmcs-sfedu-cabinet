import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Container, Header, Content, Tab, Tabs, Text, Left,Body } from 'native-base';
import moment from "moment";
import momentRU from 'moment/locale/ru'
import { theme } from '../core/theme';

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
                <Header style={{ marginTop: Expo.Constants.statusBarHeight,backgroundColor:theme.colors.primary }}>
                    <Left>
                        <Text style={{fontSize:20,color:"white"}}>{moment().format('DD MMMM')}</Text>
                    </Left>
                    <Body/>
                </Header>
                <Tabs>
                    <Tab heading="Tab1" tabStyle={{backgroundColor:theme.colors.primary}}>
                        <Text>21414</Text>
                    </Tab>
                    <Tab heading="Tab2" tabStyle={{backgroundColor:theme.colors.primary}}>
                        <Text>21414</Text>
                    </Tab>
                    <Tab heading="Tab3" tabStyle={{backgroundColor:theme.colors.primary}}>
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
