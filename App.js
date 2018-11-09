/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, YellowBox} from 'react-native';

import { Provider } from 'react-redux';
import SplashScreen from 'react-native-splash-screen'

import {InitialRoot, Main} from './app/routes';
import { appInitialized, changeAppRoot } from './app/store/app/actions'
import { restoreSession } from './app/store/session/actions'
import { configureStore } from './app/store'

import LoadingIndicator from './app/components/LoadingIndicator'

const store = configureStore()

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);
YellowBox.ignoreWarnings(['Class RCTCxxModule']);
YellowBox.ignoreWarnings(['Module SafeAreaManager']);

export default class App extends Component {

  state = {
    page: 'login',
    loading: false,
    firebaseAuth: null,
  }

  constructor() {
    super();
    
    SplashScreen.hide();

    store.subscribe(this.onStoreUpdate.bind(this));
  }

  onStoreUpdate() {
    const { root } = store.getState().app
    if (root == 'after-login' || root == 'login') {
      this.setState({page: root})
    }

    const { restoring, loading, firebaseAuth, error, deleted, pageName } = store.getState().session
    this.setState({
      loading: restoring | loading,
      firebaseAuth: firebaseAuth
    })
  }

  componentDidMount() {
    // LocalStorage.get('userInfo').then((userInfo) => {
    //   if(userInfo){
    //     store.dispatch(changeAppRoot('after-login', 'default'))        
    //   }else{
    //     store.dispatch(appInitialized());
    //   }
    // })
    // store.dispatch(changeAppRoot('after-login', 'default'))

    // store.dispatch(restoreSession("App"));
  }

  render() {
    return (
      <Provider store={store}>
        {
          this.state.page == 'login' ? <InitialRoot />
          : <Main />
        }
      </Provider>
    );
  }
}
