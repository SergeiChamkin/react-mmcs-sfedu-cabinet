import * as React from 'react';
import { BottomNavigation, Text } from 'react-native-paper';
import Schedule from '../Screens/Schedule'

const Schedule2 = () => <Schedule/>;

const AlbumsRoute = () => <Text>Albums</Text>;

const RecentsRoute = () => <Text>Recents</Text>;

export default class BNavigation extends React.Component {
  state = {
    index: 0,
    routes: [
      { key: 'schedule', title: 'Расписание', icon: 'table' },
      { key: 'albums', title: 'БРС', icon: 'checkbox-multiple-marked-circle-outline' },
      { key: 'recents', title: 'Личный кабинет', icon: 'account-circle' },
    ],
  };

  _handleIndexChange = index => this.setState({ index });

  _renderScene = BottomNavigation.SceneMap({
    schedule: Schedule2,
    albums: AlbumsRoute,
    recents: RecentsRoute,
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