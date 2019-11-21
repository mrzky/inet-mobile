/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Image, BackHandler } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { NetworkContext } from './NetworkProvider';


type Props = {};
export default class ResetPassword extends Component<Props> {
    static contextType = NetworkContext;

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
      }
    
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }
    
    handleBackButton() {
        return true;
    }

    componentDidUpdate() {
        if (this.context.isConnected){
            this.props.navigation.goBack();
        }
    }

    render() {
        return (
        <View style={styles.container}>
            {/* <StatusBar backgroundColor="#23b5db" barStyle="light-content" /> */}

            <Image style={{ width: hp('20%'), height: hp('20%') }} source={require('./assets/icons/no-wifi.png')}/>
            <Text style={styles.topText}>Tidak Ada Koneksi Internet! ({this.context.isConnected ? 'online' : 'offline'})</Text>

            <TouchableOpacity 
                style={styles.button}
                onPress={() => this.props.navigation.goBack()}
            >
                <Text style={styles.buttonText}>REFRESH</Text>
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
    justifyContent :'center'
  },
  

  button: {
    // width: wp('15%'),
    backgroundColor:'#138EE9',
    borderRadius: 2, 
    marginVertical: hp('4%'),
    padding: hp('1%'),
    elevation: 4
  },
  
  buttonText: {
    fontSize: hp('2.3%'),
    fontWeight:'500',
    color:'rgb(255, 255,255)',
    textAlign:'center',
  },

  daftarText: {
    width: wp('85%'),
    fontSize: hp('2.5%'),
    color:'#138EE9',
    textAlign:'center',
    marginVertical: hp('5%')
  },

  topText: {
    width: wp('85%'),
    fontSize: hp('2.5%'),
    color:'#138EE9',
    textAlign:'center',
    marginVertical: hp('3%')
  },
  
});