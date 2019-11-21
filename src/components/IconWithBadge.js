import React from 'react';
import { View, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default class IconWithBadge extends React.Component {
    render() {
      const { name, badgeCount, color, size } = this.props;
      return (
        <View style={{ width: hp('5%'), height: hp('5%'), margin: wp('2%'), alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name={name} size={size} color={color} />
          { badgeCount > 0 && (
            <View style={{
              // If you're using react-native < 0.57 overflow outside of the parent
              // will not work on Android, see https://git.io/fhLJ8
              position: 'absolute',
              right: -wp('1.2%'),
              top: -wp('0.5%'),
              backgroundColor: 'red',
              borderRadius: 6,
              width: hp('2%'),
              height: hp('2%'),
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>{badgeCount}</Text>
            </View>
          )}
        </View>
      );
    }
  }