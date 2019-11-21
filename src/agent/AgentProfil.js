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
export default class AgentProfil extends Component<Props> {

    
    static contextType = NetworkContext;

    static navigationOptions = {
    header: (
        <View
            style={{
            // flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            height: 56,
            backgroundColor: '#138EE9',
            }}>
            <View style={{
            // flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            // marginLeft: hp('2%')
            }}>
            <Image
            resizeMode={'contain'}
            style={{height: hp('8%'), marginVertical: 5}}
            source={require('../assets/icons/user.png')}
            />
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
            tipe_user: '',
            spinner: false,
            foto: '',
            nama: '',
            email: '',
            kontak: '',
            alamat: '',
            provinsi: '',
            kab_kota: '',
            saldo: 0,
            imageChange: false,
            isSwitchOn: false,
            loaded: false,
            token: ''
        }
    }
    async componentDidMount() {
        // SplashScreen.hide();
        // this.checkPermission();
        // this.initNofication();
        this._cekLogin();
        this._getUserData();
        // this._loadUserData();
        // this.loadToken();
    }

    componentDidUpdate() {
        if (!this.context.isConnected){
          this.props.navigation.navigate("NoConnection");
        }
    }

    // async checkPermission() {
    //     if (!await firebase.messaging().hasPermission()) {
    //       try {
    //         await firebase.messaging().requestPermission();
    //       } catch(e) {
    //         alert("Failed to grant permission")
    //       }
    //     }
    //   }
    
    //   async loadToken() {
    //     firebase.messaging().getToken().then(token => {
    //       console.log("TOKEN (getFCMToken)", token);
    //       this.setState({token: token});
    //       this._saveToken();
    //     });
    //   }
      
    //   async initNofication() {
    //     const channel = new firebase.notifications.Android.Channel('test-channel', 'Test Channel', firebase.notifications.Android.Importance.Max)
    //                 .setDescription('My apps test channel');
    // // Create the channel
    //         firebase.notifications().android.createChannel(channel);
    //         this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification: Notification) => {
    //             // Process your notification as required
    //             // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
    //             // notification.setChannelId('test-channel')
    //             // notification
    //             // firebase.notifications().displayNotification(notification);
    //             // this.showNotification(notification);
    //         });
    //         this.notificationListener = firebase.notifications().onNotification((notification: Notification) => {
              
    //             // Process your notification as required
    //             notification
    //                 .android.setChannelId('test-channel')
    //                 .android.setSmallIcon('ic_launcher')
    //                 .android.setVibrate([1000, 1000])
    //                 // .android.setSound('arpeggio.mp3')
    //                 .android.setPriority(firebase.notifications.Android.Priority.High);
    
    //             firebase.notifications()
    //                 .displayNotification(notification);
    //                 if (AppState.currentState === 'active') {
    //                   Vibration.vibrate([0, 500, 100, 500, 100, 500]);
    //                 } else if (AppState.currentState === 'inactive') {
    //                   Vibration.vibrate([0, 500, 100, 500, 100, 500]);
    //                 } else if (AppState.currentState === 'background') {
    //                   Vibration.vibrate([0, 500, 100, 500, 100, 500]);
    //                 }
                
    //         });

    //         this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen: NotificationOpen) => {
    //             // Get the action triggered by the notification being opened
    //             const action = notificationOpen.action;
    //             // Get information about the notification that was opened
    //             const notification: Notification = notificationOpen.notification;
        
    //             console.log('NOTIF OPENED', notification.data);
    //             if (
    //               // notification.data.length === 0
    //               Object.entries(notification.data).length === 0 &&
    //                  notification.data.constructor === Object
    //               ) {
    //               // Alert.alert('DATA NULL')
    //             } else {
    //               // Alert.alert('DATA NOT NULL');
    //               const obj = JSON.parse(notification.data.extra_data);
    //               console.log('obj', obj);
    //                 if (obj.page == 'Chat') {
    //                   this.props.navigation.navigate(obj.page, {
    //                     id_order: obj.id_order,
    //                     id_pengirim: obj.id_pengirim,
    //                     id_penerima: obj.id_penerima,
    //                     tipe_pengirim: obj.tipe_pengirim,
    //                     tipe_penerima: obj.tipe_penerima,
    //                     nama_penerima: obj.nama_penerima
    //                 });
    //                 }
    //             }
    //           });
        
    //           const notificationOpen: NotificationOpen = await firebase.notifications().getInitialNotification();
    //           if (notificationOpen) {
    //               // App was opened by a notification
    //               // Get the action triggered by the notification being opened
    //               const action = notificationOpen.action;
    //               // Get information about the notification that was opened
    //               const notification: Notification = notificationOpen.notification;
    //               console.log('NOTIF INITIAL', notification.data);
    //               if (
    //                 // notification.data.length === 0 ||
    //                 //  notification.data === "{}" || 
    //                  Object.entries(notification.data).length === 0 &&
    //                  notification.data.constructor === Object
    //                  ) {
    //                 // Alert.alert('DATA NULL')
    //               } else {
    //                 // Alert.alert('DATA NOT NULL');
    //                 const obj = JSON.parse(notification.data.extra_data);
    //                 console.log('obj page', obj.page);
    //                 if (obj.page == 'Chat') {
    //                   this.props.navigation.navigate(obj.page, {
    //                     id_order: obj.id_order,
    //                     id_pengirim: obj.id_pengirim,
    //                     id_penerima: obj.id_penerima,
    //                     tipe_pengirim: obj.tipe_pengirim,
    //                     tipe_penerima: obj.tipe_penerima,
    //                     nama_penerima: obj.nama_penerima
    //                 });
    //                 }
    //               }
    //           }
    //   }

      _saveToken = async () => {
    
        var bodyFormData = new FormData();
        // bodyFormData.append('image', imageFile); //gambar
        bodyFormData.append('id_user', this.state.userData.id_pelamar);
        bodyFormData.append('tipe_user', this.state.userData.tipe_user);
        bodyFormData.append('token', this.state.token);
    
        await axios({
            method: 'post',
            url: ApiUrl+'save_token',
            data: bodyFormData,
            config: { headers: { 'Content-Type': 'multipart/form-data' }}
        })
        .then((response) => {
            if(!response.data.error){
                console.log("SAVE TOKEN", response.data.message);
                this.setState({
                    // userData: response.data.profil,
                    refreshing: false
                });
            } else {
                // ToastAndroid.show('Kesalahan pada server', ToastAndroid.SHORT);
                console.log("save token", response.data)
                this.setState({
                    refreshing: false
                })
            }
        })
        .catch((error) => {
            ToastAndroid.show('Masalah koneksi. Coba lagi!', ToastAndroid.SHORT);
            console.log(error);
            this.setState({
                refreshing: false
            });
        });
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
        bodyFormData.append('email', this.state.userData.email);

        await axios({
            method: 'post',
            url: ApiUrl+'profil',
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
                this.switchOnlineFromReload(response.data.profil.saldo, response.data.profil.online);
                // if (response.data.profil.online == 1) {
                //     this.setState({
                //         isSwitchOn: true
                //     });
                // } else if (response.data.profil.online == 2) {
                //     this.setState({
                //         isSwitchOn: false
                //     });
                // }
                this.loadToken();
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

    switchOnline = (saldo, value) => {
        if (value) {
            if (saldo < 50000 || saldo < 0) {
                this.setState({
                    isSwitchOn: false
                });
                Alert.alert('Saldo Tidak Mencukupi', 'Anda tidak dapat Online jika saldo anda kurang dari Rp. 50.000, Silahkan Top Up Saldo Anda!');
                this.ubah_online_status(false, false);
            } else {
                // if(!first) {
                //     this.ubah_online_status(true, false);
                //     this. ({
                //         isSwitchOn: true
                //     });
                // } else {
                    this.ubah_online_status(true, false);
                    this.setState({
                        isSwitchOn: true
                    });  
                // }
            }
        } else {
            this.setState({
                isSwitchOn: false
            });
            this.ubah_online_status(false, false);
        }


    }

    switchOnlineFromReload = (saldo, online) => {
        if (online == 1) {
            if (saldo < 50000 || saldo < 0) {
                Alert.alert('Saldo Tidak Mencukupi', 'Anda tidak dapat Online jika saldo anda kurang dari Rp. 50.000, Silahkan Top Up Saldo Anda!');
                this.ubah_online_status(false, false);
                this.setState({
                    isSwitchOn: false
                });
            } else {
                this.ubah_online_status(true, false);
                this.setState({
                    isSwitchOn: true
                }); 
            }
        } else {
            this.setState({
                isSwitchOn: false
            });
            this.ubah_online_status(false, false);
        }


    }

    _onRefresh = () => {
        this.setState({refreshing: false, userDetails: []});
        // this._getUserData();
        this._loadUserData();
        // this.loadToken();
        
    }

    ubah_online_status = async (value, reload) => { 

        this.setState({spinner: true});
        
        var bodyFormData = new FormData();

        if (value) {
            var online = 1;
        } else {
            var online = 2;
        }

        bodyFormData.append('id', this.state.userData.id_pelamar);
        bodyFormData.append('tipe_petugas', this.state.userData.tipe_user);
        bodyFormData.append('online', online);

        await axios({
            method: 'post',
            url: ApiUrl+'ubah_online',
            data: bodyFormData,
            config: { headers: { 'Content-Type': 'multipart/form-data' }}
        })
        .then((response) => {
            if (!response.data.error) {
                console.log("RESPONSE", response.data);
                // Alert.alert('UBAH STATUS', 'Mengubah Status Berhasil!');
                ToastAndroid.show('Status diubah!', ToastAndroid.SHORT);
                this.setState({
                    refreshing: false,
                    spinner: false
                });
                if (reload) {this._loadUserData();}
            } else {
                ToastAndroid.show('Kesalahan pada server', ToastAndroid.SHORT);
                console.log("ubah online", response.data)
                this.setState({
                    refreshing: false,
                    spinner: false
                })
            }
        })
        .catch((error) => {
            ToastAndroid.show('Masalah koneksi. Coba Lagi!', ToastAndroid.SHORT);
            console.log(error);
            this.setState({
                refreshing: false,
                spinner: false
            });
        });

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

        const { isSwitchOn } = this.state;

        const actions = [
            {
              text: "Tarik Saldo",
              icon: require("../assets/icons/wallet_add.png"),
              name: "tariksaldo",
              position: 1
            },
          ];
        
        return(
            this.state.spinner ? 
            <View style={styles.laoding}>
                <View style={styles.spinnerStyle}>
                    <ActivityIndicator animating={true} color='#138EE9' size='large'/>
                    <Text style={{fontSize: hp('2.5%'), color: '#138EE9', marginTop: 5}}>
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
                {/* <Spinner
                visible={this.state.spinner}
                // animation='fade'
                overlayColor='rgba(0, 0, 0, 0.2)'
                cancelable={false}
                customIndicator={
                    <View style={styles.spinnerStyle}>
                        <ActivityIndicator animating={true} color='#138EE9' size={30}/>
                        <Text style={{fontSize: hp('2.5%'), color: '#138EE9', marginTop: 5}}>
                        LoadingApiHost+'assets/images/profil/user.png'
                        </Text>'https://i0.wp.com/www.winhelponline.com/blog/wp-content/uploads/2017/12/user.png?resize=256%2C256&quality=100&ssl=1
                    </View>}
                /> */}
                <View style={styles.header}></View>
                {this.state.userData.foto_wajah == undefined ? <View style={styles.avatar}><ActivityIndicator/></View> : 
                <Image style={styles.avatar} source={{uri: Host+'foto_pelamar/'+this.state.userData.foto_wajah}}/>}
                <View style={styles.body}>
                    <View style={styles.bodyContent}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.name} >{this.state.userData.nama}</Text>
                        </View>
                        <View style={styles.switch}>
                            {isSwitchOn ? <Text style={{color: 'green', fontWeight: 'bold', fontSize: hp('2.7')}}>ONLINE</Text> :
                            <Text style={{color: 'red', fontWeight: 'bold', fontSize: hp('2.7')}}>OFFLINE</Text>
                            }
                            <Switch
                                value={isSwitchOn}
                                onValueChange={(value) =>this.switchOnline(this.state.userDetails.saldo, value)}
                        />
                        </View>
                    <View style={styles.itemContainer}>
                        <View style={styles.iconContainer}>
                            <Ionicons name='ios-cash' size={hp('5%')} color='blue' />
                        </View>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>Saldo</Text>
                            <NumberFormat value={this.state.userDetails.saldo} displayType={'text'} thousandSeparator={true} prefix={'Rp '} renderText={
                                value => <Text style={styles.subtitle}>{value}</Text>}/>
                        </View>
                    </View>
                    <View style={styles.itemContainer}>
                        <View style={styles.iconContainer}>
                            <Ionicons name='ios-mail' size={hp('5%')} color='red' />
                        </View>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>Email</Text>
                            <Text style={styles.subtitle}>{this.state.userDetails.email}</Text>
                        </View>
                    </View>
                    <View style={styles.itemContainer}>
                        <View style={styles.iconContainer}>
                            <Ionicons name='ios-phone-portrait' size={hp('5%')} color='green' />
                        </View>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>Telepon</Text>
                            <Text style={styles.subtitle}>{this.state.userDetails.kontak}</Text>
                        </View>
                    </View>
                    <View style={styles.itemContainer}>
                        <View style={styles.iconContainer}>
                            <Ionicons name='ios-home' size={hp('5%')} color='orange' />
                        </View>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>Alamat</Text>
                            <Text style={styles.subtitle}>{this.state.userDetails.alamat} {this._capitalizeEachWord(this.state.userData.kab_kota)} Provinsi {this._capitalizeEachWord(this.state.userData.provinsi)}</Text>
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
        backgroundColor: "#138EE9",
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
        borderColor: "#138EE9",
        elevation: 2,
        backgroundColor: "#138EE9",
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
        backgroundColor:'#138EE9',
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