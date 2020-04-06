import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Alert, Linking } from 'react-native';
import { TextInput } from 'react-native-paper';
import { wS, hS } from "../Utils/Scale"
export interface Props {
    cab: [],
    teachers: [],
    subject: string,
    isActive?:boolean
}

interface State {
}

export default class RightBlock extends Component<Props, State> {


    constructor(props: Props) {
        super(props);
    }

    componentDidMount(){
    }
    render() {
        return (
            <View style={styles.rightBlock}>
                <Text style={this.props.isActive!=undefined?styles.subjectTextGrey:styles.subjectText}>{this.props.subject}</Text>
                <View style={{flexDirection:"row",justifyContent:"space-between"}}>
                <Text>{this.props.teachers[0]}</Text>
                <Text>{this.props.cab[0]}</Text>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    timeText: {
        fontSize: 18,
    },
    subjectText: {
        fontSize: 15
    },
    subjectTextGrey: {
        fontSize: 15,
        color:"grey"
    },
    rightBlock: {
        flex:1,
        marginLeft:wS(10),
        flexDirection:"column",
        justifyContent:"space-between"
    },
    cabinetText: {
        fontWeight: "bold",
    }
});
