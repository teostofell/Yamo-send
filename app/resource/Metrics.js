import { Dimensions, Platform } from 'react-native'

const { width, height } = Dimensions.get('window')

export const METRICS = {
    screenWidth: width,
    screenHeight: height,
    scaleWidth: width / 1125,
    scaleHeight: height / 2436
}