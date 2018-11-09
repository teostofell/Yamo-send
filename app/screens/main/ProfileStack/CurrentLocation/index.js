import React, {Component} from 'react';
import { StyleSheet, TouchableOpacity, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { View, Button } from 'react-native-ui-lib';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GoogleAutoComplete } from 'react-native-google-autocomplete';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Feather';
import deepDiffer from 'react-native/lib/deepDiffer'

import styles from './styles'
import { setUserData } from '../../../../store/userData'
import { updateUserCity } from '../../../../store/firebaseData'

import { LocationItem } from '../../../../components/LocationItem'

import Globals from '../../../../Globals';

class CurrentLocationScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      title: 'Current Location',
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
      headerMode: 'Float',
    };
  };

  state = {
    errors: '',
    city: '',
  };

  constructor(props) {
    super(props);
    // this.onFocus = this.onFocus.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    // this.cityRef = this.updateRef.bind(this, 'city');
  }
  
  componentDidMount() {
    // this.setState({
    //   city: this.props.user.city
    // });

    if (Globals.userData.city != this.state.city) {
      this.setState({
        city: Globals.userData.city
      })
    }    
  }

  componentDidUpdate(prevProps) {
    // if (!prevProps.apiFailed && this.props.apiFailed) {
    //   return;
    // }
    // if (!prevProps.apiError && this.props.apiError) {
    //   return;
    // }
    // if (this.props.apiPageName == 'setCurrentLocationPage') {
    //   if (!prevProps.apiLocationSuccess && this.props.apiLocationSuccess) {
    //     let userData = this.props.user;
    //     userData.city = this.state.city;
    //     this.props.setUserData(userData.firebaseID, userData);
    //     Actions.pop({ refresh: { test: Math.random() } });
    //   }
    // }

    // if (deepDiffer(this.state.userData, this.props.user)) {
    //   this.setState({
    //     userData: this.props.user
    //   })
    // }


    // if (this.props.user != null) {
    //   if ( this.props.user.city != this.state.city) {
    //     this.setState({
    //       city: this.props.user.city
    //     })
    //   }
    // }

    // if (Globals.userData.city != this.state.city) {
    //   this.setState({
    //     city: Globals.userData.city
    //   })
    // }
  }

  onSubmit() {
    let errors = {};

    if (this.state.city == "") {
      // errors[name] = 'Should not be empty';
    } else {
      this.onSetCurrentLocation(this.state.city);
    }
  }
  
  onSetCurrentLocation(city) {
    let userData = Globals.userData;

    // this.props.updateUserCity(userData.email, userData.firebaseID, city, 'PdiHnIR3tJAqD11o!QF7HZg', 'setCurrentLocationPage')
    
    this.props.dispatch(updateUserCity( userData.uid, city, 'CurrentLocation' ))
    userData.city = city;
    this.props.dispatch(setUserData(userData));
    Globals.userData = userData;
  }

  render() {
    let userData = Globals.userData;
    
    var strLabel = {
      Confirmation: {
        en: 'Confirmation',
        fr: 'Valider',
      }
    }
    let { errors = {}, ...data } = this.state;

    return (
      <View flex paddingH-25 paddingT-10 bg-white>
        <GooglePlacesAutocomplete
          placeholder='Select your city'
          minLength={2} // minimum length of text to search
          autoFocus={false}
          returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
          listViewDisplayed='auto'    // true/false/undefined
          fetchDetails={true}
          renderDescription={(row) => row.description} // custom description render
          onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
            this.setState({
              city: data.description
            })
          }}
          getDefaultValue={() => {
            return userData.city; // text input default value
            // return ''; // text input default value
          }}
          query={{
            // available options: https://developers.google.com/places/web-service/autocomplete
            key: 'AIzaSyCU4YlcxKL5lleN5wKiRfLhoJPfGXOjTRs',
            // key: 'AIzaSyBXrXIVA4KO2Y2BGurwg7116Rw7fCyhdT4',
            
            // language: 'en', // language of the results
            language: 'fr', // language of the results
            types: '(cities)', // default: 'geocode'
            origin: 'http://mywebsite.com'
          }}
          styles={{
            description: {
              fontWeight: 'bold'
            },
            textInputContainer: {
              backgroundColor: 'rgba(0, 0, 0, 0)',
              borderTopWidth: 0,
              borderBottomWidth: 0,
            },
            textInput: {
              marginLeft: 0,
              marginRight: 0,
              height: 38,
              color: '#5d5d5d',
              fontSize: 16,
              borderBottomWidth: 2,
              borderColor: 'rgba(0, 0, 0, 0.8)'
            },
            predefinedPlacesDescription: {
              color: '#1faadb'
            }
          }}
          currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
        />
        {/* <GoogleAutoComplete apiKey="AIzaSyCFQXyosWbxw95jnNtruOY4btR1ztnuXQE" debounce={300}>
          {({ inputValue, handleTextChange, locationResults, fetchDetails, isSearching, clearSearchs }) => (
            <React.Fragment>
              <View style = {styles.inputWrapper}>
                <TextInput
                  style={{
                    height: 40,
                    width: 300,
                    borderWidth: 1,
                    paddingHorizontal: 16,
                  }}
                  value={inputValue}
                  onChangeText={handleTextChange}
                  placeholder="Location..."
                />
                <Button title="clear" onPress={clearSearchs} />
              </View>
              {isSearching && <ActivityIndicator size="large" color="red" /> }
              <ScrollView style={{ maxHeight: 100 }}>
                {locationResults.map((el, i) => (
                  <LocationItem
                    {...el}
                    fetchDetails={fetchDetails}
                    key={String(i)}
                  />
                ))}
              </ScrollView>
              <ScrollView>
                {locationResults.map(el => {
                  console.log("-- 1 --");
                  <LocationItem
                    {...el}
                    key={el.id}
                    fetchDetails={fetchDetails}
                  />
                })}
              </ScrollView>
            </React.Fragment>
          )}
        </GoogleAutoComplete> */}
        <Button text70 white backgroundColor="#fe1394" label={strLabel.Confirmation.fr} style={{marginBottom: 40}} onPress={this.onSubmit}/>
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

export default connect(mapStateToProps)(CurrentLocationScreen)
