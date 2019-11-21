/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {TouchableOpacity, StyleSheet, Text, View, ToastAndroid, Alert, ActivityIndicator } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { DefaultTheme, TextInput, HelperText } from 'react-native-paper';
import { NetworkContext } from '../NetworkProvider';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import ApiUrl from '../components/ApiUrl'

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
export default class AgentUbahPassword extends Component<Props> {

    static contextType = NetworkContext;

    static navigationOptions = {
        title: "Ubah Password",
        headerStyle: {
        backgroundColor: '#138EE9'
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
        fontWeight: 'normal',
        fontFamily: 'Basic'
        },
        fonts: {
        regular: 'Basic',
        medium: 'Basic',
        light: 'Basic',
        thin: 'Basic',
        }
    }

    constructor(props){
        super(props);
        this.state = {
            passwordSekarang: '',
            passwordBaruUlangi: '',
            passwordBaru: '',
            spinner: false,
            userData: []
        };
    }

    componentDidMount() {
        this._getUserData();
    }

    componentDidUpdate() {
        if (!this.context.isConnected){
        this.props.navigation.navigate("NoConnection");
        }
    }

    async _getUserData() {
        try {
          const myArray = await AsyncStorage.getItem('USER');
          if (myArray !== null) {
            const user = JSON.parse(myArray);
            this.setState({
              userData: user,
              refreshing: false,
            });
            console.log("USER ASYNC", this.state.userData.saldo);
          }
        } catch(e) {
          console.log("USER ASYNC", e.message);
        }
      }

    async _ubahPassword() {

        if (this.state.passwordBaruUlangi != this.state.passwordBaru) {
            return true;
        }

        this.setState({
            spinner: true
        });

        var bodyFormData = new FormData();
        bodyFormData.append('id', this.state.userData.id_pelamar);
        bodyFormData.append('tipe_petugas', this.state.userData.tipe_user);
        bodyFormData.append('password_sekarang', this.state.passwordSekarang);
        bodyFormData.append('password_baru', this.state.passwordBaruUlangi);

        await axios({
            method: 'post',
            url: ApiUrl+'ubah_password',
            data: bodyFormData,
            config: { headers: { 'Content-Type': 'multipart/form-data' }}
        })
        .then((response) => {
            console.log("UBAH PASSWORD", response.data);
            if (!response.data.error) {
                console.log('Ubah Password', response.data.message);
                ToastAndroid.show('Berhasil Disimpan..', ToastAndroid.SHORT);
                this.props.navigation.goBack();
                this.setState({
                    spinner: false
                });
            } else {
                Alert.alert('Ubah Password', response.data.message);
                ToastAndroid.show('Gagal Disimpan..', ToastAndroid.SHORT);
                this.setState({
                    spinner: false
                });
            }
        })
        .catch((error) => {
          ToastAndroid.show('Masalah koneksi', ToastAndroid.SHORT);
            console.log(error);
            this.setState({
                spinner: false
            });
        });
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
        {/* <StatusBar backgroundColor="#23b5db" barStyle="light-content" /> */}

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
        <View style={styles.inputContainer}>
            <TextInput 
                style={[styles.inputBox, {marginTop: hp('4%')}]}
                placeholder="Password Sekarang"
                mode="outlined"
                underlineColor='#138EE9'
                label="Password Sekarang"
                theme={theme}
                secureTextEntry={true}
                onChangeText={pass => this.setState({ passwordSekarang: pass })}
                value={this.state.passwordSekarang}/>
                <HelperText
                    style={styles.helperText}
                    type="error"
                    visible={this.state.passwordSekarang.length <= 5}>
                    Password minimal 6 karakter!
                </HelperText>
            </View>

        <View style={styles.inputContainer}>
            <TextInput 
                style={styles.inputBox}
                placeholder="Password Baru"
                mode="outlined"
                underlineColor='#138EE9'
                label="Password Baru"
                theme={theme}
                secureTextEntry={true}
                onChangeText={pass => this.setState({ passwordBaru: pass })}
                value={this.state.passwordBaru}/>
                <HelperText
                    style={styles.helperText}
                    type="error"
                    visible={this.state.passwordBaru.length <= 5}>
                    Password minimal 6 karakter!
                </HelperText>
            </View>

            <View style={styles.inputContainer}>
                <TextInput 
                    style={styles.inputBox}
                    placeholder="Ulangi Password Baru"
                    mode="outlined"
                    underlineColor='#138EE9'
                    label="Ulangi Password Baru"
                    theme={theme}
                    secureTextEntry={true}
                    onChangeText={ pass => { 
                        this.setState({ passwordBaruUlangi: pass });
                        // this.matchPassword();
                    }}
                    value={this.state.passwordBaruUlangi}/>
                <HelperText
                    style={styles.helperText}
                    type="error"
                    visible={this.state.passwordBaruUlangi != this.state.passwordBaru}>
                    Password harus sama!
                </HelperText>
            </View>

          <TouchableOpacity 
            style={styles.button}
            onPress={() => this._ubahPassword()}
          >
            <Text style={styles.buttonText}>SIMPAN</Text>
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
  },
  
  button: {
    width: wp('85%'),
    backgroundColor:'#138EE9',
    borderRadius: 2, 
    marginVertical: hp('2%'),
    paddingVertical: hp('2%')
  },
  
  buttonText: {
    fontSize: hp('2.3%'),
    fontWeight:'500',
    color:'rgb(255, 255,255)',
    textAlign:'center',
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

  inputBox: { 
    fontFamily: 'Basic',
    width: wp('85%'),
    paddingHorizontal: wp('4%'),
    fontSize: hp('2.3%'),
    color:'#138EE9',
    
  },

  containerLogo : {
    justifyContent:'flex-end',
    alignItems: 'center',
  },

  inputContainer: {
    marginBottom: hp('2%'),
  },

  helperText: {
    marginBottom: -hp('1.5%')
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

  
});