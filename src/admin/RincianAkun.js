 /**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Picker, TimePickerAndroid, Alert, ToastAndroid, ActivityIndicator } from 'react-native';
import { TextInput, DefaultTheme } from 'react-native-paper';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ScrollView } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NetworkContext } from '../NetworkProvider';
import NumberFormat from 'react-number-format';
import Host from '../components/url';
import axios from 'axios';
import { StackActions, NavigationActions } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import ApiUrl from '../components/ApiUrl'
import moment from 'moment';
import 'moment/locale/id'
moment.locale('id');

const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
      ...DefaultTheme.colors,
      primary: '#ffcc00',
      accent: '#f1c40f',
      text: 'black',
    },
    fonts: {
      regular: 'Basic',
      medium: 'Basic',
      light: 'Basic',
      thin: 'Basic',
    }
  };

//   const { navigation } = this.props;
//   const uid = navigation.getParam('uid');
//   const username = navigation.getParam('username');
//   const nama = navigation.getParam('nama');
//   const insert_date = navigation.getParam('insert_date');
//   const update_date = navigation.getParam('update_date');

type Props = {};
export default class RincianAkun extends Component<Props> {

    static contextType = NetworkContext;

    static navigationOptions = {
        // title: "Rincian Layanan",
        headerStyle: {
          backgroundColor: '#ffcc00',
          elevation: 0
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'normal',
        },  
    }
    state = {
        nama: this.props.navigation.getParam('nama'),
        username: this.props.navigation.getParam('username'),
        insert_date: moment(this.props.navigation.getParam('insert_date')).format('Do MMMM YYYY, HH:mm'),
        update_date: moment(this.props.navigation.getParam('update_date')).format('Do MMMM YYYY, HH:mm'),
        uid: this.props.navigation.getParam('uid'),
        userToken: '',
    }

    componentDidMount() {
    this._getUserToken();
    }

    componentDidUpdate() {
        if (!this.context.isConnected){
          this.props.navigation.navigate("NoConnection");
        }
    }

    componentWillUnmount(){console.log('componentWillUnmount')}

    _getUserToken = async () => {
        const data = await AsyncStorage.getItem('TOKEN');
        if (data !== null) {
            // const user = JSON.parse(myArray);
            this.setState({
                userToken: data
            });
        }
      }

    _simpanAkun = async () => {
    
        this.setState({spinner: true});
        var bodyFormData = new FormData();
        bodyFormData.append('token', this.state.userToken);
        bodyFormData.append('uid', this.state.uid);
        bodyFormData.append('nama', this.state.nama);
        bodyFormData.append('username', this.props.navigation.getParam('username'));
        bodyFormData.append('username_baru', this.state.username);
    
        await axios({
            method: 'post',
            url: ApiUrl+'update_account',
            data: bodyFormData,
            config: { headers: { 'Content-Type': 'multipart/form-data' }}
        })
        .then((response) => {
          if (!response.data.error){
            console.log("RESPONSE", response.data);
            ToastAndroid.show('Berhasil!', ToastAndroid.SHORT);
                const resetAction = StackActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({ routeName: 'Admin' })],
                });
                this.props.navigation.dispatch(resetAction);
          } else {
            ToastAndroid.show("Gagal", ToastAndroid.SHORT);
            this.setState({
              refreshing: false,
              spinner: false,
            })
          }
        })
        .catch((error) => {
          // ToastAndroid.show('Masalah koneksi', ToastAndroid.SHORT);
            console.log('Failed to connect', error);
            this.setState({
                refreshing: false,
                spinner: false
            });
        });
      }

      _hapusAkun = async () => {
    
        this.setState({spinner: true});
        var bodyFormData = new FormData();
        bodyFormData.append('token', this.state.userToken);
        bodyFormData.append('uid', this.state.uid);
    
        await axios({
            method: 'post',
            url: ApiUrl+'delete_account',
            data: bodyFormData,
            config: { headers: { 'Content-Type': 'multipart/form-data' }}
        })
        .then((response) => {
          if (!response.data.error){
            console.log("RESPONSE", response.data);
            ToastAndroid.show('Dihapus!', ToastAndroid.SHORT);
                const resetAction = StackActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({ routeName: 'Admin' })],
                });
                this.props.navigation.dispatch(resetAction);
          } else {
            ToastAndroid.show("Gagal", ToastAndroid.SHORT);
            this.setState({
              refreshing: false,
              spinner: false,
            })
          }
        })
        .catch((error) => {
          // ToastAndroid.show('Masalah koneksi', ToastAndroid.SHORT);
            console.log('Failed to connect', error);
            this.setState({
                refreshing: false,
                spinner: false
            });
        });
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
            <ScrollView style={styles.container}>
                <View style={styles.header}></View>
                <View style={styles.listContainer}>
                    <Image source={require('../assets/icons/user.png')} resizeMode={'contain'} style={styles.photo} />
                    <View style={styles.container_text}>
                        <Text style={styles.title}>{this.state.username}</Text>
                    </View>
                </View>
                <View style={styles.body}>
                    <View style={styles.bodyContent}>
                        <View style={styles.content}>
                            <View style={[styles.itemContainer, {marginTop: hp('1%')}]}>
                                <View style={styles.iconContainer}>
                                    <Ionicons name='ios-clipboard' size={hp('5%')} color='green' />
                                </View>
                                <View pointerEvents="none" style={styles.inputContainer}>
                                    <TextInput
                                    style={styles.inputBox}
                                    placeholder="UID"
                                    mode="flat"
                                    multiline
                                    placeholderTextColor='#ffcc00'
                                    label="UID"
                                    theme={theme}
                                    onChangeText={uid => this.setState({ uid })}
                                    value={this.state.uid}/>
                                </View>
                            </View>
                            <View style={styles.itemContainer}>
                                <View style={styles.iconContainer}>
                                    <Ionicons name='ios-card' size={hp('5%')} color='green' />
                                </View>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                    style={styles.inputBox}
                                    placeholder="Username"
                                    mode="flat"
                                    placeholderTextColor='#ffcc00'
                                    label="Username"
                                    theme={theme}
                                    onChangeText={username => this.setState({ username })}
                                    value={this.state.username}/>
                                </View>
                            </View>
                            
                            <View style={styles.itemContainer}>
                                <View style={styles.iconContainer}>
                                    <Ionicons name='ios-person' size={hp('5%')} color='green' />
                                </View>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                    style={styles.inputBox}
                                    placeholder="Nama Lengkap"
                                    mode="flat"
                                    placeholderTextColor='#ffcc00'
                                    label="Nama Lengkap"
                                    theme={theme}
                                    onChangeText={nama => this.setState({ nama })}
                                    value={this.state.nama}/>
                                </View>
                            </View>
                            <View style={styles.itemContainer}>
                                <View style={styles.iconContainer}>
                                    <Ionicons name='ios-calendar' size={hp('5%')} color='green' />
                                </View>
                                <View pointerEvents="none" style={styles.inputContainer}>
                                    <TextInput
                                    style={styles.inputBox}
                                    placeholder="Dibuat pada"
                                    mode="flat"
                                    multiline
                                    placeholderTextColor='#ffcc00'
                                    label="Dibuat pada"
                                    theme={theme}
                                    onChangeText={insert_date => this.setState({ insert_date })}
                                    value={this.state.insert_date}/>
                                </View>
                            </View>
                            <View style={styles.itemContainer}>
                                <View style={styles.iconContainer}>
                                    <Ionicons name='ios-calendar' size={hp('5%')} color='green' />
                                </View>
                                <View pointerEvents="none" style={styles.inputContainer}>
                                    <TextInput
                                    style={styles.inputBox}
                                    placeholder="Diubah pada"
                                    mode="flat"
                                    multiline
                                    placeholderTextColor='#ffcc00'
                                    label="Diubah pada"
                                    theme={theme}
                                    onChangeText={update_date => this.setState({ update_date })}
                                    value={this.state.update_date}/>
                                </View>
                            </View>
                        </View>
                        <View style={{justifyContent: 'space-around', alignItems:'center', flexDirection:'row', marginTop: 20}}>
                            <TouchableOpacity 
                            style={styles.button}
                            onPress={() => this._simpanAkun()}
                            >
                                <Text style={styles.buttonText}>Simpan Perubahan</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                            style={[styles.button, {backgroundColor: 'red'}]}
                            onPress={() => this._hapusAkun()}
                            >
                                <Text style={styles.buttonText}>Hapus Akun</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#f2f2f2'
    },
    header:{
        backgroundColor: "#ffcc00",
        height:hp('20%'),
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
        borderColor: "#ffcc00",
        elevation: 2,
        backgroundColor: "#ffcc00",
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
        // marginTop:40,
      },
      bodyContent: {
        flex: 1,
        alignItems: 'center',
        marginTop: hp('8%'),
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
        width: wp('40%'),
        backgroundColor:'#ffcc00',
        borderRadius: 2, 
        marginTop: hp('2%'),
        marginHorizontal: hp('1%'),
        marginBottom: hp('1%'),
        paddingVertical: hp('2%'),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        fontSize: hp('2.3%'),
        color:'rgb(255, 255,255)',
        textAlign:'center',
    },
    photo: {
        height: hp('10.5%'),
        width: hp('10.5%'),
    },
    title: {
        fontSize: hp('2.5%'),
        color: '#000',
    },
    description: {
        fontSize: hp('2%'),
        // fontStyle: 'italic',
    },
    harga: {
        fontSize: hp('2%'),
        color: 'white',
        height: hp('4%'),
        borderRadius: 5,
        backgroundColor: '#ffcc00',
        padding: hp('0.5%'),
        textAlign: 'center'
    },
    container_text: {
        flex: 1,
        flexDirection: 'column',
        // marginLeft: wp('2%'),
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleBody: {
        color: 'grey',
        fontSize: hp('3%')
    },
    subtitle: {
        fontSize: hp('2.5%'),
        // marginRight: wp('10%'),
    },
    header:{
        backgroundColor: "#ffcc00",
        height:hp('20%'),
    },
    listContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        // alignContent: 'center',
        justifyContent: 'center',
        padding: hp('2%'),
        // marginTop: hp('2%'),
        width: wp('70%'),
        height: hp('30%'),
        borderRadius: 5,
        backgroundColor: '#FFF',
        borderColor: "white",
        elevation: 4,
        alignSelf:'center',
        position: 'absolute',
    },
    content: {
        flexDirection: 'column',
        flex: 1,
    },
    itemContainer: {
        width: wp('89%'),
        flexDirection: 'row',
        alignItems: 'flex-start',
        // justifyContent: 'center',
        marginTop: hp('3%'),
        // alignItems: 'center'
    },
    iconContainer: {
        width: hp('7%'),
        height: hp('7%'),
        borderRadius: 63,
        elevation: 4,
        backgroundColor: "white",
        alignItems: 'center',
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputContainer: {
        marginTop: -hp('1.5%'),
        marginLeft: hp('1.7%'),
    },
    inputBox: {
        fontFamily: 'Basic',
        width: wp('70%'),
        backgroundColor: 'white',
        // paddingHorizontal: wp('4%'),
        fontSize: hp('2.3%'),
        // alignItems: 'center',
        color:'#138EE9',
        // marginVertical: hp('2%'),
    },
    listDropdown: {
        width: wp('70%'),
        fontSize: hp('2.3%'),
        color:'#138EE9',
        textAlign:'center',
        marginTop: -hp('1%'),
        // marginLeft: hp('1.5%'),
    },
    pickerContainer : { 
        flexDirection: 'column' ,
        marginLeft: hp('1.7%'),
        marginTop: -hp('0.6%'),
    },
    picker: { 
        fontSize: hp('2.3%'),
        color:'#ffcc00',    
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
});