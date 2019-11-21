/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, ToastAndroid, TouchableOpacity, RefreshControl, ActivityIndicator, Alert, AppState, Vibration } from 'react-native';
import { Button, Switch  } from 'react-native-paper';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ScrollView } from 'react-native-gesture-handler';
// import SplashScreen from 'react-native-splash-screen';
import Ionicons from "react-native-vector-icons/Ionicons"
import AsyncStorage from '@react-native-community/async-storage';
import { NetworkContext } from '../NetworkProvider';
import axios from 'axios';
import NumberFormat from 'react-number-format';
import { StackActions, NavigationActions } from 'react-navigation';
import ApiUrl from '../components/ApiUrl'
import Host from '../components/url'
// import firebase from 'react-native-firebase';
import ApiHost from '../components/ApiHost';

type Props = {};
export default class AdminProfil extends Component<Props> {

    
    static contextType = NetworkContext;

    static navigationOptions = {
    header: (
        <View
            style={{
            // flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            height: 10,
            backgroundColor: '#ffcc00',
            }}>
            <View style={{
            // flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            // marginLeft: hp('2%')
            }}>
            {/* <Image
            resizeMode={'contain'}
            style={{height: hp('8%'), marginVertical: 5}}
            source={require('../assets/icons/user.png')}
            /> */}
            {/* <Text
                style={{
                color: 'white',
                textAlign: 'left',
                fontWeight: 'bold',
                fontSize: hp('3%'),
                marginLeft: hp('1%'),
                }}>
                Saufa Center
            </Text> */}
            </View>
        </View>
    ),
    }

    constructor(props){
        super(props);
        this.state = {
            userData: [],
            userDetails: [],
            refreshing: false,
            ImageSource: null,
            data: null,
            Image_TAG: '',
            spinner: false,
            imageChange: false,
            isSwitchOn: false,
            loaded: false,
            userToken: '',
        }
    }
    async componentDidMount() {
        this._cekLogin();
        // this._getUserData();
        this._getUserToken();
    }

    componentDidUpdate() {
        if (!this.context.isConnected){
          this.props.navigation.navigate("NoConnection");
        }
    }


    async _cekLogin() {
        try {
          const value = await AsyncStorage.getItem('USER');
          // console.log('CEK LOG', value);
          if (value == null) {
              this._logout();
          }
        } catch (error) {
          console.log('Error getting User!')
        }
      }

    _logout = async () => {
        this.setState({spinner: true});
        try {
            await AsyncStorage.clear()
            .then(() => {
                console.log('ASYNCSOTRAGE CLEARED!');
                this.setState({spinner: false});
                // this.props.navigation.navigate("Login");
                const resetAction = StackActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({ routeName: 'Login' })],
                });
                this.props.navigation.dispatch(resetAction);
            })
        } catch(e) {
            console.log('ERROR CLEARING ASYNCSOTRAGE', e.message);
        }
    }

    _getUserToken = async () => {
        const token = await AsyncStorage.getItem('TOKEN');
        if (token !== null) {
            this.setState({userToken: token});
            this._getUserData();
        }
    }

    _getUserData = async () => {
        const myArray = await AsyncStorage.getItem('USER');
        if (myArray !== null) {
            const user = JSON.parse(myArray);
            this.setState({
                userData: JSON.parse(myArray),
                refreshing: false,
                loaded: true
            });
            console.log("USER ASYNC", this.state.userData.tipe_user);
            // this._loadUserData(this.state.userData.tipe_user);
            this._loadUserData();
        }
    }

    async _saveUser(user) {
        console.log('when call saveuser',user);
        await AsyncStorage.setItem('USER', JSON.stringify(user))
          .then(() => {
            console.log('User Saved!');
            // this._getUserData();
            })
          .catch(() => {
            console.log('Error Saving User!')
          });
      }

    _loadUserData = async () => {

        console.log('_loadUserData called')

        var bodyFormData = new FormData();
        bodyFormData.append('token', this.state.userToken);
        bodyFormData.append('uid', this.state.userData.uid);

        await axios({
            method: 'post',
            url: ApiUrl+'read_account',
            data: bodyFormData,
            config: { headers: { 'Content-Type': 'multipart/form-data' }}
        })
        .then((response) => {
            if(!response.data.error){
                console.log("RESPONSE", response.data);
                this._saveUser(response.data.profil);
                // this._getUserData();
                this.setState({
                    userDetails: response.data.profil,
                    // userData: response.data.profil,
                    refreshing: false
                });
            } else {
                // ToastAndroid.show('Kesalahan pada server', ToastAndroid.SHORT);
                console.log("_loadUserData", response.data)
                this.setState({
                    refreshing: false
                })
            }
        })
        .catch((error) => {
            ToastAndroid.show('Masalah koneksi. Coba Lagi!', ToastAndroid.SHORT);
            console.log(error);
            this.setState({
                refreshing: false
            });
        });
    }

    _onRefresh = () => {
        this.setState({refreshing: false, userDetails: []});
        // this._getUserData();
        this._loadUserData();
        // this.loadToken();
        
    }

    _capitalizeEachWord = (text) => {
        // Alert.alert(text);
        if (text != undefined) {
            const str = text.split('|')[1];
            return str.toLowerCase()
            .split(' ')
            .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
            .join(' ');
        }
        
        
    }

    render() {        
        return(
            this.state.spinner ? 
            <View style={styles.laoding}>
                <View style={styles.spinnerStyle}>
                    <ActivityIndicator animating={true} color='#ffcc00' size='large'/>
                    <Text style={{fontSize: hp('2.5%'), color: '#ffcc00', marginTop: 5}}>
                    Loading
                    </Text>
                </View>
            </View> :
            <ScrollView 
            style={styles.container}
            refreshControl={
                <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh.bind(this)}
                />}
            >
                <View style={styles.header}></View>
                {/* {this.state.userData.foto_wajah == undefined ? <View style={styles.avatar}><ActivityIndicator/></View> :  */}
                <Image style={styles.avatar} source={require('../assets/icons/user.png')}/>
                <View style={styles.body}>
                    <View style={styles.bodyContent}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.name} >{this.state.userData.nama}</Text>
                        </View>
                    <View style={styles.itemContainer}>
                        <View style={styles.iconContainer}>
                            <Ionicons name='ios-person' size={hp('5%')} color='red' />
                        </View>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>Username</Text>
                            <Text style={styles.subtitle}>{this.state.userDetails.username}</Text>
                        </View>
                    </View>
                    <View style={styles.itemContainer}>
                        <View style={styles.iconContainer}>
                            <Ionicons name='ios-phone-portrait' size={hp('5%')} color='green' />
                        </View>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>Telepon</Text>
                            <Text style={styles.subtitle}>+62888812312</Text>
                        </View>
                    </View>
                    <View style={styles.itemContainer}>
                        <View style={styles.iconContainer}>
                            <Ionicons name='ios-home' size={hp('5%')} color='orange' />
                        </View>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>Alamat</Text>
                            <Text style={styles.subtitle}>Medan</Text>
                        </View>
                    </View>
                    <TouchableOpacity 
                    style={styles.button}
                    onPress={() => this.props.navigation.navigate("UbahPassword")}
                    >
                        <Text style={styles.buttonText}>UBAH PASSWORD</Text>
                    </TouchableOpacity>
                    <Button
                    mode="outlined"
                    style={styles.buttonLogout}
                    onPress={() => this._logout()}
                    >
                        LOGOUT
                        {/* <Text style={styles.buttonText}>LOGOUT</Text> */}
                    </Button>
                    </View>
                </View>
            </ScrollView>
                
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header:{
        backgroundColor: "#ffcc00",
        height:hp('20%'),
      },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
      avatar: {
        width: hp('20%'),
        height: hp('20%'),
        borderRadius: 5,
        borderWidth: 4,
        borderColor: "white",
        backgroundColor: 'white',
        marginBottom: hp('3%'),
        alignSelf:'center',
        position: 'absolute',
        marginTop: hp('7%')
      },
      gantiFoto: {
        width: hp('6%'),
        height: hp('6%'),
        borderRadius: 63,
        borderWidth: 4,
        borderColor: "white",
        elevation: 2,
        backgroundColor: "white",
        // marginBottom: hp('3%'),
        // alignSelf:'flex-end',
        alignItems: 'center',
        // justifyContent: 'center',
        position: 'absolute',
        marginTop: hp('23%'),
        marginLeft: wp('62%')
      },
      name:{
        fontSize:22,
        color:"#FFFFFF",
        fontWeight:'600',
        // marginLeft: wp('2%')
      },
      body:{
        marginTop:40,
      },
      bodyContent: {
        flex: 1,
        alignItems: 'center',
        padding:30,
      },
      name:{
        fontSize:28,
        color: "#696969",
        fontWeight: "600"
      },
      itemContainer: {
          width: wp('85%'),
          flexDirection: 'row',
          alignItems: 'flex-start',
          marginTop: hp('3%')
      },
      iconContainer: {
        width: hp('7%'),
        height: hp('7%'),
        borderRadius: 63,
        elevation: 4,
        backgroundColor: "white",
        alignItems: 'center',
        justifyContent: 'center'
    },
    titleContainer: {
        marginLeft: wp('2%'),
        justifyContent: 'center'
    },
    title: {
        color: 'grey',
        fontSize: hp('2%')
    },
    subtitle: {
        fontSize: hp('2.5%'),
        marginRight: wp('10%'),
    },
    button: {
        width: wp('85%'),
        backgroundColor:'#ffcc00',
        borderRadius: 2, 
        marginTop: hp('4%'),
        paddingVertical: hp('2%')
    },

    buttonLogout: {
        width: wp('85%'),
        borderRadius: 2, 
        marginVertical: hp('4%'),
        // paddingVertical: hp('2%')
      },
      
      buttonText: {
        fontSize: hp('2.3%'),
        color:'white',
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
      switch: {
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          marginTop: 10,
      }
});