/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {TouchableOpacity, Linking, StyleSheet, Text, View, Image, Alert, ToastAndroid, BackHandler, ActivityIndicator} from 'react-native';
// import SplashScreen from 'react-native-splash-screen';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { DefaultTheme, TextInput, HelperText } from 'react-native-paper';
import ApiUrl from './components/ApiUrl'
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import { NetworkContext } from './NetworkProvider';

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#138EE9',
    accent: '#f1c40f',
    text: '#138EE9',
  },
  fonts: {
    regular: 'Basic',
    medium: 'Basic',
    light: 'Basic',
    thin: 'Basic',
  }
};

type Props = {};
export default class Login extends Component<Props> {

  static contextType = NetworkContext;

  state = {
    username: '',
    password: '',
    spinner: false,
  };

  componentDidMount() {
    // SplashScreen.hide();
    this._cekLogin();
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton() {
    ToastAndroid.show('Exit', ToastAndroid.SHORT);
    BackHandler.exitApp();
    return true;
  }

  componentDidUpdate() {
    if (!this.context.isConnected){
      this.props.navigation.navigate("NoConnection");
    }
  }

  async _cekLogin() {
    try {
      const value = await AsyncStorage.getItem('USER');
      const user = JSON.parse(value);
      // console.log('CEK LOG', value);
      if (value != null) {
        user.role == 1 ? this.props.navigation.navigate("Admin") : this.props.navigation.navigate("Admin");
        // AsyncStorage.clear();
      }
    } catch (error) {
      console.log('Error getting User!')
    }
  }

  _showAlert(message) {
    Alert.alert('Login', message);
  }


  async _saveUser(user) {
    await AsyncStorage.setItem('USER', JSON.stringify(user))
      .then(() => {
        console.log('User Saved!')})
      .catch(() => {
        console.log('Error Saving User!')
      });
  }

  async _saveToken(token) {
    await AsyncStorage.setItem('TOKEN', token)
      .then(() => {
        console.log('Token Saved!')})
      .catch(() => {
        console.log('Error Saving Token!')
      });
  }

  async _login() {
    const { username, password } = this.state;
    if (username.length == 0 || password.length == 0 ) {
        // provinsi.length == 0 || kabupaten.length == 0 ||
      this._showAlert('Semua data harus diisi!');
    } else {
      this.setState({
        spinner: true
      });

      var bodyFormData = new FormData();
      // bodyFormData.append('image', imageFile); //gambar
      bodyFormData.append('username', username);
      bodyFormData.append('password', password);

      await axios({
        method: 'post',
        url: ApiUrl+'login',
        data: bodyFormData,
        config: { headers: { 'Content-Type': 'multipart/form-data' }}
        })
        .then((response) => {
          console.log("RESPONSE", response.data);
          if (!response.data.error) {
            this._saveUser(response.data.user);
            this._saveToken(response.data.token);
            ToastAndroid.show('Login sukses..', ToastAndroid.SHORT);
            response.data.user.role == 1 ? this.props.navigation.navigate("Admin") : this.props.navigation.navigate("Agent");
            this.setState({
              spinner: false
            });
          } else {
            this.setState({
              spinner: false
            });
            this._showAlert(response.data.message);
          }
        })
        .catch((error) => {
          console.log(error);
          this._showAlert(error.message);
          this.setState({
            spinner: false
          });
        });
    }
  }

  render() {
    return (
      this.state.spinner ? 
      <View style={styles.laoding}>
        <View style={styles.spinnerStyle}>
            <ActivityIndicator animating={true} color='#138EE9' size='large'/>
            <Text style={{fontSize: hp('2.5%'), color: '#138EE9', marginTop: 5}}>
              Loading
            </Text>
          </View>
        </View> :
      <View style={styles.container}>
        {/* <Spinner
              visible={this.state.spinner}
              // animation='fade'
              overlayColor='rgba(0, 0, 0, 0.2)'
              cancelable={false}
              customIndicator={
                <View style={styles.spinnerStyle}>
                  <ActivityIndicator animating={true} color='#138EE9' size={30}/>
                  <Text style={{fontSize: hp('2.5%'), color: '#138EE9', marginTop: 5}}>
                    Loading
                  </Text>
                </View>}
            /> */}

          <Image resizeMode={'contain'} style={{height: hp('25%'), marginBottom: 20}} source={require('./assets/icons/user.png')}/>
          <Text style={styles.headText}>Login Agent</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputBox}
              placeholder="Username"
              mode="outlined"
              underlineColor='#138EE9'
              label="Username"
              theme={theme}
              onChangeText={username => this.setState({ username })}
              value={this.state.username}/>
            {/* <HelperText
            style={styles.helperText}
              type="error"
              visible={!this.state.email.includes('@')}>
                Email tidak sesuai!
            </HelperText> */}
          </View>

          <View style={styles.inputContainer}>
            <TextInput 
              style={styles.inputBox}
              placeholder="Password"
              mode="outlined"
              underlineColor='#138EE9'
              label="Password"
              theme={theme}
              secureTextEntry={true}
              onChangeText={password => this.setState({ password })}
              value={this.state.password}/>
            <HelperText
              style={styles.helperText}
              type="error"
              visible={this.state.password.length <= 5}>
                Password minimal 6 karakter!
            </HelperText>
          </View>

          <TouchableOpacity
            onPress={() => {Linking.openURL('https://demo-saufa-center.000webhostapp.com/lupa_password.php')}}
          >
            <Text style={styles.lupaText}>Lupa Password?</Text>
          </TouchableOpacity>

          
          <TouchableOpacity 
            style={styles.button}
            onPress={() => this._login()}
          >
            <Text style={styles.buttonText}>LOGIN</Text>
          </TouchableOpacity>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  
  container : {
    backgroundColor:'#ffffff',
    flex: 1,
    alignItems:'center',
    justifyContent :'center',
    marginBottom: hp('5%')
  },

  containerForm : {
    flexGrow: 1,
    justifyContent:'center',
    alignItems: 'center'
  },

  containerLogo : {
    flexGrow: 1,
    justifyContent:'flex-end',
    alignItems: 'center'
  },

  inputContainer: {
    marginBottom: hp('2%'),
  },

  helperText: {
    marginBottom: -hp('1.5%')
  },
  
  inputBox: {
    fontFamily: 'Basic',
    width: wp('85%'),
    paddingHorizontal: wp('4%'),
    fontSize: hp('2.3%'),
    color:'#f5d316',
    // marginVertical: hp('2%'),
  },
  
  button: {
    width: wp('85%'),
    backgroundColor:'#ffcc00',
    borderRadius: 2, 
    marginVertical: hp('4%'),
    paddingVertical: hp('2%')
  },
  
  buttonText: {
    fontSize: hp('2.3%'),
    color:'rgb(255, 255,255)',
    textAlign:'center',
  },

  lupaText: {
    width: wp('85%'),
    fontSize: hp('2.5%'),
    color:'#879da3',
    textAlign:'right'
  },

  daftarText: {
    width: wp('85%'),
    fontSize: hp('2.5%'),
    color:'#ffcc00',
    textAlign:'center',
    marginVertical: hp('5%')
  },

  spinnerStyle: {
    width: hp('20%'), 
    height: hp('20%'), 
    alignItems: "center", 
    justifyContent: 'center',
    flexDirection: 'column',
    backgroundColor: 'white',
    borderRadius: 5,
  },
  laoding: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headText: {
    width: wp('85%'),
    fontSize: hp('3%'),
    color:'#ffcc00',
    textAlign:'center',
    marginTop: -hp('2%'),
    marginBottom: hp('2%')
  },

  });