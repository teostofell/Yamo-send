import React, {Component} from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, YellowBox, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/EvilIcons';
import { TextField } from 'react-native-material-textfield';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { connect } from 'react-redux';

import styles from './styles'

import { setUserData } from '../../../../store/userData'
import { updateUserInterests } from '../../../../store/firebaseData'
import Globals from '../../../../Globals';

class InterestScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      title: 'Interests',
      headerTitleStyle: {
        alignSelf: 'center',
        textAlign: 'center'
      },
      headerLeft: (
        <TouchableOpacity style={{ paddingLeft: 20 }} onPress={()=>{ 
          // navigation.state.params.updateFavorites(23)
          navigation.goBack();
        }} >
          <Icon name="arrow-left" size={30} color="#aaaaaa" />
        </TouchableOpacity>
      ),
    //   headerRight: (
    //     <TouchableOpacity style={{ paddingRight: 20 }} onPress={()=>{ params.handleSave() }} >
    //       <Text style={{ color: '#aaaaaa', fontSize: 18, paddingRight: 20 }}>Save</Text>
    //     </TouchableOpacity>
    //   ),
    //   headerMode: 'Float',
    };
  };

  state = {
    interestList: [],
  }

  constructor(props) {
    super(props);

    this.onChangeText = this.onChangeText.bind(this);

    this.onSubmitInterest = this.onSubmitInterest.bind(this);
    this.interestRef = this.updateRef.bind(this, 'interest');
  }
  
  componentDidMount() {
    // if (this.props.user.interests != null) {
    //   console.log("--- interest 1 ---");
    //   console.log(this.props.user.interests);
    //   console.log("--- interest 2 ---");
    //   this.setState({
    //     interestList: this.props.user.interests,
    //   });
    // }
    if (Globals.userData.interests != null) {
      this.setState({
        interestList: Globals.userData.interests,
      })
    }
  }

  componentDidUpdate(prevProps) {
    // if (!prevProps.apiFailed && this.props.apiFailed) {
    //   let userData = this.props.user;
    //   Alert.alert(
    //     "Failed", 
    //     this.props.apiFailed,
    //     [
    //       {text: 'OK', onPress: () => { 
    //         if (userData.interests != null) {
    //           this.setState({
    //             interestList: userData.interests,
    //           });
    //         }
    //       }},
    //     ]
    //   );
    //   return;
    // }
    // if (!prevProps.apiError && this.props.apiError) {
    //   let userData = this.props.user;
    //     Alert.alert(
    //       "Error", 
    //       this.props.apiError,
    //       [
    //         {text: 'OK', onPress: () => { 
    //           if (userData.interests != null) {
    //             this.setState({
    //               interestList: userData.interests,
    //             });
    //           }
    //         }},
    //       ]
    //     );
    //   return;
    // }
    // if (this.props.apiPageName == 'interestsPage') {
    //   if (!prevProps.apiInterestsSuccess && this.props.apiInterestsSuccess) {
    //     let userData = this.props.user;
    //     userData.interests = this.state.interestList;
    //     this.props.setUserData(userData.firebaseID, userData);
    //   }
    // }
  }

  onChangeText(text) {
    ['interest']
      .map((name) => ({ name, ref: this[name] }))
      .forEach(({ name, ref }) => {
        if (ref.isFocused()) {
          this.setState({ [name]: text });
        }
      });
  }

  onSubmitInterest() {
    this.interest.blur();
    this.onSubmit();
  }

  onSubmit() {
    let errors = {};
    let values = {};

    ['interest']
      .forEach((name) => {
        let value = this[name].value();

        if (!value) {
          errors[name] = 'Should not be empty';
        } else {
          if ('interest' === name) {
            const newInterest = [ ...this.state.interestList, value ]; 
            values[name] = newInterest;
            this.setState({
            //   interestList: newInterest,
              interest: ''
            });
          }
        }
      });
    if (errors['interest'] == null) {
      this.setState({
        interestList: values['interest']
      })
      this.updateInterests(values['interest']);
    } else {
      this.setState({ errors });
    }
  }

  updateRef(name, ref) {
    this[name] = ref;
  }

  removeInterest(item) {
    var array = [...this.state.interestList];
    var index = array.indexOf(item);
    array.splice(index, 1);
    this.setState({
      interestList: array
    })

    this.updateInterests(array);
  }

  renderInterests() {
    return this.state.interestList.map((i, key) => {
      return (
        <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', marginTop: 25, paddingBottom: 5 }} key={key} >
          <Text style={{ fontSize: 17, color: '#222222', alignItems: 'center' }} >{i}</Text>
          <TouchableOpacity onPress={()=>{ this.removeInterest(i) }} >
            <Icon name="close" size={24} color="#ff0000" />
          </TouchableOpacity>
        </View>
      );
    }, this);
  }

  updateInterests(interest) {
    // var l_interest = '';
    // interest.forEach((value) => {
    //   if (l_interest == '') {
    //     l_interest = '"' + value + '"';
    //   } else {
    //     l_interest = l_interest + ', "' + value + '"';
    //   }
    // });
    // l_interest =  '[' + l_interest + ']';

    this.setState({
      interestList: interest
    })
    var userData = Globals.userData;
    // this.props.updateUserInterests(userData.email, userData.firebaseID, l_interest, 'PdiHnIR3tJAqD11o!QF7HZg', 'interestsPage')

    userData.interests = interest;
    this.props.dispatch(updateUserInterests( userData.uid, interest, 'Interests' ))
    this.props.dispatch(setUserData(userData));
    Globals.userData = userData;
  }

  render() {
    let { ...data } = this.state;

    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView style={{ backgroundColor: 'white' }} keyboardShouldPersistTaps="always" >
          <View style={{ padding: 15 }} >
            <TextField
              ref={this.interestRef}
              value={data.interest}
              // defaultValue={defaultEmail}
              keyboardType='email-address'
              autoCapitalize='none'
              tintColor={'#fe1394'}
              autoCorrect={false}
              enablesReturnKeyAutomatically={true}
              onFocus={this.onFocus}
              onChangeText={this.onChangeText}
              onSubmitEditing={this.onSubmitInterest}
              returnKeyType='next'
              label='Add your interests'
            />
          </View>

          <View style={{ padding: 15 }} >
            <Text style={{ fontSize: 16, color: 'rgba(34, 34, 34, 0.3)' }} >LIST OF INTERESTS</Text>
            
            {
              this.renderInterests()
            }
          
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }

}

const mapStateToProps = (state) => {
  const props = {
    user: state.userData.user,
  };
  return props;
}

export default connect(mapStateToProps)(InterestScreen)
