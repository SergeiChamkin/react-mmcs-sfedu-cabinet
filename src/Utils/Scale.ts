import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const scale = size => width / guidelineBaseWidth * size;
const hS = (size, factor=1) =>{return height>guidelineBaseHeight?(height / guidelineBaseHeight * size): (height / guidelineBaseHeight * size*factor)};
const wS = (size, factor = 1) =>{return width>guidelineBaseWidth?(width / guidelineBaseWidth * size): (width / guidelineBaseWidth * size*factor)};

export {scale, hS, wS};