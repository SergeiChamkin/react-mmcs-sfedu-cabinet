import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Alert, Linking } from 'react-native';
import { TextInput } from 'react-native-paper';
import { wS, hS } from "../Utils/Scale"
export interface Props {
    data: any
    isActive?: boolean,
    //isPaired?:boolean,
}

interface State {
}

export default class RightBlock extends Component<Props, State> {


    constructor(props: Props) {
        super(props);
    }

    componentDidMount() {
    }

    formatTeacherName(name) {

        var parts = name.split(" ");
        if (parts.length > 3) {
            parts = (name.split("\n"))
            parts = parts.map((item) => {
                var p = item.split(" ")
                return p[0] + " " + p[1].substr(0, 1) + ". " + p[2].substr(0, 1) + ".";
            })
            return parts.join("\n")
        }
        if (parts.length != 3) return name
        return parts[0] + " " + parts[1].substr(0, 1) + ". " + parts[2].substr(0, 1) + ".";
    }

    formatSubject() {
        if (this.props.data.subjectabbr == "") {
            return this.props.data.subjectname;
        } else return this.props.data.subjectabbr;
    }

    getClearCab(cab) {
        var splitted = cab.split("\n")
        splitted = splitted.map((item) => {
            if (item.indexOf("(") == -1) {
                return item
            }
            else return item.substr(0, item.indexOf("("))
        })
        return splitted.join("\n");
    }

    onPresser() {
        Alert.alert(
            'Информация',
            'Предмет:\n' + this.props.data.subjectname + '\nПреподаватель:\n' + this.props.data.teachername + "\nСтепень преподавателя:\n" + this.props.data.teacherdegree + "\nКабинет:\n" + this.props.data.roomname,
            [
                { text: 'Ок', onPress: () => console.log('OK Pressed') },
            ],
            { cancelable: true },
        );
    }

    render() {
        return (
            <TouchableOpacity style={{ flex: 1 }} onPress={() => { this.onPresser() }} key={this.props.data.id + "-touch"+Math.random()}>
                <View style={styles.rightBlock} key={this.props.data.id + "rightBlock"+Math.random()}>
                    <Text style={[this.props.isActive ? styles.subjectTextGrey : styles.subjectText, styles.textUltra]} key={this.props.data.id+" subject"}>{this.formatSubject()}</Text>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Text key={this.props.data.id + "-techer"} style={this.props.isActive ? { color: "grey" } : { color: "black" }}>{this.formatTeacherName(this.props.data.teachername)}</Text>
                        <Text key={this.props.data.id + "-cab"} style={[{ fontStyle: "italic" }, this.props.isActive ? { color: "grey" } : { color: "black" }]}>{this.getClearCab(this.props.data.roomname)}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}
const styles = StyleSheet.create({
    subjectText: {
        fontSize: 19
    },
    subjectTextGrey: {
        fontSize: 19,
        color: "grey"
    },
    greyText: {
        color: "grey"
    },
    rightBlock: {
        flex: 1,
        marginLeft: wS(10),
        flexDirection: "column",
        justifyContent: "space-between"
    },
    cabinetText: {
        fontWeight: "bold",
    },
    textUltra: {
        //!!!
    }
});
