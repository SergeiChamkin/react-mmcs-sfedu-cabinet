import * as React from 'react';
import { BottomNavigation, Text } from 'react-native-paper';
import Schedule from '../Screens/Schedule'
import LoginScreen from '../Screens/Login'
import BRS from '../Screens/Brs'
import { BackHandler } from 'react-native'
import Settings from '../Screens/Settings'

export default class BNavigation extends React.Component {
  state = {
    index: global.value == "Расписание" ? 0 : 1,
    routes: [
      { key: 'schedule', title: 'Расписание', icon: 'table' },
      { key: 'grade', title: 'БРС', icon: 'checkbox-multiple-marked-circle-outline' },
      { key: 'settings', title: 'Настройки', icon: 'settings' },
    ],
  };

  ScheduleRoute = () => <Schedule nav={(i) => { this.props.nav(i) }} />;
  ref = ''
  GradeRoute = () => <BRS ref={(r) => { this.ref = r }} nav={(i) => { this.props.nav(i) }}></BRS>;

  SettingsRoute = () => <Settings nav={(i) => { this.props.nav(i) }} />;

  _handleIndexChange = index => {
    if (index == 1) {
      if (this.ref != '') {
        this.ref.refresh()
      }
      //console.log(this.ref)
    }
    if (index == 0 || index == 2) {
      if (this.ref != '') {
        this.ref.hiderwb()
      }
    }
    this.setState({ index });
  }
  _renderScene = BottomNavigation.SceneMap({
    schedule: this.ScheduleRoute,
    grade: this.GradeRoute,
    settings: this.SettingsRoute,
  });


  render() {
    return (
      <BottomNavigation
        navigationState={this.state}
        onIndexChange={this._handleIndexChange}
        renderScene={this._renderScene}
      />
    );
  }
}