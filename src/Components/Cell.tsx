import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Alert, Linking } from 'react-native';
import { TextInput } from 'react-native-paper';
import { wS, hS } from "../Utils/Scale"
import RightBlock from "../Components/rightBlock"
export interface Props {
    subjects: []
}

interface State {
}

export default class Cell extends Component<Props, State> {


    constructor(props: Props) {
        super(props);
    }

    componentDidMount() {
        console.log(this.props.subjects.length)
    }
    generator() {
        if (this.props.subjects.length == 1) {
            var arr1 = this.props.subjects[0].subject.map((subject, index) => {
                return (
                    <View style={{flexDirection: "column" }}>
                        <View style={{flexDirection: "row" }}>{arr1}</View>
                    </View>
                )
            })

            return (
                this.props.subjects[0].subject.map((subject, index) => {
                    return (
                        <RightBlock
                            cab={this.props.subjects[0].cab[index]}
                            teachers={this.props.subjects[0].teachers[index]}
                            subject={subject}
                        />
                    )
                })

            )
        } else {

            var arr1 = this.props.subjects[0].subject.map((subject, index) => {
                return (
                    <RightBlock
                        cab={this.props.subjects[0].cab[index]}
                        teachers={this.props.subjects[0].teachers[index]}
                        subject={subject}
                    />
                )
            })
            var arr2 = this.props.subjects[1].subject.map((subject, index) => {
                return (
                    <RightBlock
                        cab={this.props.subjects[1].cab[index]}
                        teachers={this.props.subjects[1].teachers[index]}
                        subject={subject}
                    />
                )
            })

            return (
                <View style={{flexDirection: "column" }}>
                    <View style={{flexDirection: "row" }}>{arr1}</View>
                    <View style={{flexDirection: "row" }}>{arr2}</View>
                </View>
            )
        }
    }
    render() {
        return (
            <View style={{ flexDirection: "row",marginTop:hS(22) }}>
                <View style={styles.timeView}>
                    <View style={{ flexDirection: "column", justifyContent: "center" }}>
                        <Text style={styles.timeText}>
                            {this.props.subjects[0].time[0]}
                        </Text>
                        <Text style={styles.timeText}>
                            {this.props.subjects[0].time[1]}
                        </Text>
                    </View>
                </View>
                <View style={{flex:1}}>
                {this.generator()}
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    timeText: {
        fontSize: 18,
    },
    timeView: {
        flexDirection: "column",
        justifyContent: "space-around",
    },
    subjectText: {
        fontSize: 22
    },
    rightBlock: {
        paddingLeft: wS(10),
        paddingRight: wS(10)
    },
    cabinetText: {
        fontWeight: "bold",

    }
});
