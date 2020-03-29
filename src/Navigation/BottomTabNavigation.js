import * as React from 'react';
import { BottomNavigation, Text } from 'react-native-paper';
import Schedule from '../Screens/Schedule'
import LoginScreen from '../Screens/Login'

const ScheduleRoute = () => <Schedule/>;

const GradeRoute = () => <LoginScreen/>;

const AccountRoute = () => <Text>Recents</Text>;

export default class BNavigation extends React.Component {
  state = {
    index: 0,
    routes: [
      { key: 'schedule', title: 'Расписание', icon: 'table' },
      { key: 'grade', title: 'БРС', icon: 'checkbox-multiple-marked-circle-outline' },
      { key: 'account', title: 'Личный кабинет', icon: 'account-circle' },
    ],
  };

  _handleIndexChange = index => this.setState({ index });

  _renderScene = BottomNavigation.SceneMap({
    schedule: ScheduleRoute,
    grade: GradeRoute,
    account: AccountRoute,
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