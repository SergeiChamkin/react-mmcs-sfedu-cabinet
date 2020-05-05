import React, { memo } from 'react';
import { Image, StyleSheet } from 'react-native';
import { hS } from '../Utils/Scale';
const Logo = () => (
  <Image source={require('../../assets/logo.png')} style={styles.image} resizeMode="contain"/>
);

const styles = StyleSheet.create({
  image: {
    width: hS(200),
    height: hS(200),
    marginBottom: 12,
  },
});

export default memo(Logo);
