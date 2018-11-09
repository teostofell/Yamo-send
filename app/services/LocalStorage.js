import { AsyncStorage } from 'react-native'

const base = '@yamo-'
export default class LocalStorage {
  static set(key, value) {
      return AsyncStorage.setItem(`${base}${key}`, value.toString())
  }

  static get(key, value) {
      return AsyncStorage.getItem(`${base}${key}`)
  }

  static remove(key){
      return AsyncStorage.removeItem(`${base}${key}`)
  }

  static clear(){
      return AsyncStorage.clear()
  }
}