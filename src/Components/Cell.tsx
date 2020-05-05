import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Alert, Linking } from 'react-native';
import { TextInput } from 'react-native-paper';
import { wS, hS } from "../Utils/Scale"
import RightBlock from "../Components/rightBlock"
export interface Props {
    subjects: any,
    typeWeek:string
}

interface State {
}

export default class Cell extends Component<Props, State> {


    constructor(props: Props) {
        super(props);
    }

    componentDidMount() {
        /*
        console.log("-----------------------")

        console.log(this.props.subjects.data)
        //console.log(this.props.subjects.time)
        console.log("-----------------------")
        */
    }

    getCleanTime(time) {
        return time.substr(0, time.length - 3)
    }

    generateRow(data, from,type) {
        var temp = []

        for (var i = from; i < (from + 2) && (i < data.length); i++) {
            temp.push(<RightBlock isActive={((type=="full"||type=="-1")?false:(this.props.typeWeek==type))} typeWeek={this.props.typeWeek} data={data[i]} id={"RightBlock" + data[i].id} />)
        }
        return <View style={{ flexDirection: "row", marginTop: (from >= 2 ? hS(15) : 0), paddingTop: (from >= 2 ? hS(15) : 0), borderTopWidth: (from >= 2 ? 0 : 0), borderTopColor: "grey" }} id={"ROW" + data[from].id}>{temp}</View>;
    }

    generator() {
        var ui = []
        for (var i = 0; i < this.props.subjects.data[0].length; i += 2) {
            ui.push(this.generateRow(this.props.subjects.data[0], i,this.props.subjects.data[1].length >= 1?"1":"full"))
        }

        if (this.props.subjects.data[1].length >= 1)
            ui.push(<View style={{
                flexDirection: "row",  //borderStyle: 'dotted',
                //borderWidth: 1, //border rad
                //opacity:1,
                backgroundColor:"grey",
                height:1,
                marginTop: hS(4), marginBottom: hS(4)
            }}></View>)


        for (var i = 0; i < this.props.subjects.data[1].length; i += 2) {
            ui.push(this.generateRow(this.props.subjects.data[1], i,"0"))
        }

        return ui
    }

    render() {
        return (
            <View style={{ flexDirection: "row", marginTop: hS(22), marginLeft: wS(17), marginRight: wS(17) }}>
                <View style={styles.timeView}>
                    <View style={{ flexDirection: "column", justifyContent: "center" }}>
                        <Text style={styles.timeText} id={this.props.subjects.time[1] + this.props.id}>
                            {this.getCleanTime(this.props.subjects.time[1])}
                        </Text>
                        <Text style={styles.timeText} id={this.props.subjects.time[2] + this.props.id}>
                            {this.getCleanTime(this.props.subjects.time[2])}
                        </Text>
                    </View>
                </View>
                <View style={{ width: 1, backgroundColor: 'grey', marginLeft: wS(5), marginTop: hS(10), marginBottom: hS(10) }}></View>
                <View style={{ flex: 1 }}>
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
