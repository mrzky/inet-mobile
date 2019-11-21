/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import { Dimensions, Platform, StyleSheet, Text, View, FlatList, Image, TouchableOpacity, RefreshControl, ActivityIndicator, ToastAndroid } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ScrollView } from 'react-native-gesture-handler';
import { NetworkContext } from '../NetworkProvider';
import NumberFormat from 'react-number-format';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import Modal from "react-native-modal";
import ApiUrl from '../components/ApiUrl'
import Host from '../components/url';
import AsyncStorage from '@react-native-community/async-storage';
import { FloatingAction } from "react-native-floating-action";
import moment from 'moment';
import 'moment/locale/id'
moment.locale('id');
import { TextInput, DefaultTheme } from 'react-native-paper';

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

type Props = {};
export default class DataAkun extends Component<Props> {

  static contextType = NetworkContext;

  static navigationOptions = {
    title: "Data Akun",
    headerStyle: {
        backgroundColor: '#ffcc00'
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
        fontWeight: 'normal',
    },
  };

  constructor(props) {
    super(props);
    this.state={
      dataAkun: [],
      userData: [],
      refreshing: false,
      spinner: false,
      status: 0,
      nama: '',
      username: '',
      password: ''
    }
  }

  componentDidMount() {
    this._getUserToken();
    // this._loadPesanan();
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
        this._loadAkun();
    }
  }

  _loadAkun = async () => {
    
    this.setState({spinner: true});
    var bodyFormData = new FormData();
    bodyFormData.append('token', this.state.userToken);

    await axios({
        method: 'post',
        url: ApiUrl+'list_account',
        data: bodyFormData,
        config: { headers: { 'Content-Type': 'multipart/form-data' }}
    })
    .then((response) => {
      if (!response.data.error){
        console.log("RESPONSE", response.data);
        console.log("PESANAN", response.data.riwayat_saldo);
        // this._saveUser(response.data.profil);
        this.setState({
            status: response.data.status,
            dataAkun: response.data.akun,
            refreshing: false,
            spinner: false
        });
      } else {
        ToastAndroid.show('Data tidak ditemukan', ToastAndroid.SHORT);
        this.setState({
          refreshing: false,
          spinner: false,
          dataAkun: undefined
        })
      }
    })
    .catch((error) => {
      // ToastAndroid.show('Masalah koneksi', ToastAndroid.SHORT);
        console.log('ERR LOAD TAMBAH SALDO', error);
        this.setState({
            refreshing: false,
            spinner: false
        });
    });
  }

  _tambahAkun = async () => {
    
    this.setState({spinner: true});
    var bodyFormData = new FormData();
    bodyFormData.append('token', this.state.userToken);
    bodyFormData.append('nama', this.state.nama);
    bodyFormData.append('username', this.state.username);
    bodyFormData.append('password', this.state.password);
    bodyFormData.append('role', 0);

    await axios({
        method: 'post',
        url: ApiUrl+'create_account',
        data: bodyFormData,
        config: { headers: { 'Content-Type': 'multipart/form-data' }}
    })
    .then((response) => {
      if (!response.data.error){
        console.log("RESPONSE", response.data);
        this._showModal();
        this._loadAkun();
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

  _onRefresh = () => {
    this.setState({refreshing: true, spinner: true, dataAkun: []});
    this._getUserToken();
  }


  _showModal = () => {
    this.setState({
        isModalVisible: !this.state.isModalVisible
    });
    console.log('modal', this.state.isModalVisible);
  }

  render() {

    const actions = [
      {
        text: "Tambah Akun",
        icon: <Ionicons name='ios-person-add' size={hp('3%')} color='white' />,
        name: "tambahakun",
        position: 1,
        color: '#ffcc00'
      },
    ];

    const deviceWidth = Dimensions.get("window").width;
        const deviceHeight = Platform.OS === "ios"
            ? Dimensions.get("window").height
            : require("react-native-extra-dimensions-android").get("REAL_WINDOW_HEIGHT");

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
        this.state.dataAkun && this.state.dataAkun < 0 || this.state.dataAkun == undefined ? 
            <View style={{flex: 1, alignItems: 'center',  justifyContent: 'center', marginTop: 10}}>
                <Image width={hp('10%')} height={hp('10%')} source={require('../assets/icons/problem.png')} />
                <Text>Belum Ada Data</Text>
                <TouchableOpacity 
                style={{backgroundColor: '#138EE9', marginTop: 10, padding: 5, borderRadius: 4, elevation: 4}} 
                onPress={() => this._onRefresh()}>
                    <Text style={{color: 'white'}}>Muat Ulang</Text>
                    </TouchableOpacity>
                  <FloatingAction
                    color={'#ffcc00'}
                    overlayColor={'rgba(0, 0, 0, 0)'}
                    actions={actions}
                    onPressItem={name => {
                      console.log(`selected button: ${name}`);
                      // switch(name) {
                      //   case "topupsaldo":
                      //     this.props.navigation.navigate('TopUp');
                      //   case "riwayattopup":
                      //     this.props.navigation.navigate('RiwayatTopUp');
                      // }
                      if (name == 'tambahsaldo') {
                        this._showModal();
                      }
                    }}
                />
            </View> :
      <View style={{flex: 1}}>
        <ScrollView 
        style={{backgroundColor: '#f2f2f2'}}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />}>
        <View style={styles.container}>
            {/* {this.state.status != 502 ?  */}
            <View style={styles.layanan}>
              <CustomListview
                navigation={this.props.navigation}
                itemList={this.state.dataAkun}
              />
            </View> 
            {/* :
            <View style={{flex: 1, alignItems: 'center',  justifyContent: 'center', marginTop: 10}}>
                <Text>Belum Ada Data</Text>
                <TouchableOpacity 
                style={{backgroundColor: '#138EE9', marginTop: 10, padding: 5, borderRadius: 4, elevation: 4}} 
                onPress={() => this._onRefresh()}>
                    <Text style={{color: 'white'}}>Muat Ulang</Text>
                    </TouchableOpacity>
            </View>
            } */}
          </View>
      </ScrollView>
      <Modal 
          isVisible={this.state.isModalVisible}
          deviceHeight={deviceHeight}
          deviceWidth={deviceWidth}
          backdropOpacity={0.5}
          
          style={{alignItems: 'center', borderRadius: 10}}
      >
          <View style={{ 
              backgroundColor: 'white',
              // height: hp('70%'), 
              width: wp('85%')}}>
              <View style={{borderBottomColor: 'gray', borderBottomWidth: 0.5, padding: 10, backgroundColor: '#ffcc00', alignItems: 'center'}}>
                  <Text style={{
                      alignSelf: 'center', 
                      color: 'white',
                      fontSize: hp('2.3%')
                      }}>
                      Tambah Akun
                  </Text>
              </View>
              <View>
              <View style={styles.itemContainer}>
                <View  style={styles.inputContainer}>
                    <TextInput
                    style={styles.inputBox}
                    placeholder="Nama"
                    mode="flat"
                    multiline
                    placeholderTextColor='#ffcc00'
                    label="Nama"
                    theme={theme}
                    onChangeText={nama => this.setState({ nama })}
                    value={this.state.nama}/>
                </View>
              </View>
              <View style={styles.itemContainer}>
                <View  style={styles.inputContainer}>
                    <TextInput
                    style={styles.inputBox}
                    placeholder="Username"
                    mode="flat"
                    multiline
                    placeholderTextColor='#ffcc00'
                    label="Username"
                    theme={theme}
                    onChangeText={username => this.setState({ username })}
                    value={this.state.username}/>
                </View>
              </View>
              <View style={styles.itemContainer}>
                <View  style={styles.inputContainer}>
                    <TextInput
                    style={styles.inputBox}
                    placeholder="Password"
                    mode="flat"
                    multiline
                    placeholderTextColor='#ffcc00'
                    label="Password"
                    theme={theme}
                    onChangeText={password => this.setState({ password })}
                    value={this.state.password}/>
                </View>
              </View>
              </View>
              <View style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: hp('3%')}}>
              <TouchableOpacity 
                  style={{
                  width: wp('30%'), 
                  height: wp('10%'), 
                  alignSelf: 'center',
                  alignItems: 'center',
                  backgroundColor:'#ffcc00',
                  paddingVertical: hp('1%'),
                  paddingHorizontal: wp('2%'),
                  marginBottom: hp('2%'),
                  borderRadius: 4,}}
                  onPress={() => {this._tambahAkun()}}>
                  <Text style={{fontSize: hp('2%'), alignSelf: 'center', color: 'white', textAlign: 'center'}}>
                      Simpan
                  </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                  style={{
                  width: wp('30%'), 
                  height: wp('10%'), 
                  alignSelf: 'center',
                  alignItems: 'center',
                  backgroundColor:'red',
                  paddingVertical: hp('1%'),
                  marginBottom: hp('2%'),
                  borderRadius: 4,}}
                  onPress={() => {this._showModal()}}>
                  <Text style={{fontSize: hp('2%'), alignSelf: 'center', color: 'white', textAlign: 'center'}}>
                      Batal
                  </Text>
              </TouchableOpacity>
            </View>
          </View>
      </Modal>
        <FloatingAction
            color={'#ffcc00'}
            overlayColor={'rgba(0, 0, 0, 0)'}
            actions={actions}
            onPressItem={name => {
              console.log(`selected button: ${name}`);
              switch(name) {
                case "tambahakun":
                  this._showModal();
              }
              // if (name == 'topupsaldo') {
              //   this.props.navigation.navigate('TopUp');
              // } else if(name == 'riwayattopup'){
              //   this.props.navigation.navigate('RiwayatTopUp');
              // }
            }}
        />
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container : {
    backgroundColor:'#f2f2f2',
    alignItems:'center',
    justifyContent :'center'
  },
  layanan: {
    flex: 1,
    width: wp('95%'),
    // height: wp('100%'),
    marginBottom: hp('5%')
  },
  listContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: hp('2%'),
    marginTop: hp('2%'),
    borderRadius: 5,
    backgroundColor: '#FFF',
    },
    title: {
        fontSize: hp('2.5%'),
        color: '#000',
    },
    container_text: {
        flex: 1,
        flexDirection: 'column',
        marginLeft: wp('2%'),
        justifyContent: 'center',
    },
    description: {
        fontSize: hp('2%'),
        // fontStyle: 'italic',
    },
    harga: {
        fontSize: hp('1.6%'),
        // marginLeft: 4,s
        color: 'white',
        width: wp('40%'),
        borderRadius: 5,
        backgroundColor: 'green',
        padding: hp('0.5%'),
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
    photo: {
        height: hp('8.5%'),
        width: hp('8.5%'),
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
      itemContainer: {
        width: wp('65%'),
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: hp('3%'),
        marginHorizontal: hp('2%')
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
});

const CustomListview = ({ navigation, itemList }) => (
    // <View style={styles.container}>
        <FlatList
                data={itemList}
                renderItem={({ item }) => <CustomRow
                    navigation={navigation}
                    uid={item.uid}
                    nama={item.nama}
                    username={item.username}
                    insert_date={item.insert_date}
                    update_date={item.update_date}
                />}
                keyExtractor={(item, index) => index.toString()}
            />

    // </View>s
);

const CustomRow = ({ navigation, uid, nama, username, update_date, insert_date, }) => (
    <TouchableOpacity style={styles.listContainer} 
    onPress={() => navigation.navigate("RincianAkun", {
      uid: uid,
      username: username,
      nama: nama,
      update_date: update_date,
      insert_date: insert_date,
      })}
    >
          {/* { uri: Host+'foto_kategori/'+foto } */}
        <Image source={require('../assets/icons/user.png')} style={styles.photo} />
        <View style={styles.container_text}>
            <Text style={styles.title}>
              {username}
            </Text>
            <Text style={styles.description}>
                {nama}
            </Text>
            <Text style={styles.description}>
                {moment(insert_date).format('Do MMMM YYYY, HH:mm')}
            </Text>
        </View>
        <Image source={require('../assets/icons/checked.png')} style={styles.photo} /> 
    </TouchableOpacity>
);