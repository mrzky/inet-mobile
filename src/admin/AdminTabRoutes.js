import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons"
import { createBottomTabNavigator, createStackNavigator } from "react-navigation";
import Profil from "./AdminProfil";
import IconWithBadge from "../components/IconWithBadge";
import DataAkun from "./DataAkun";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

  const Saya = createStackNavigator({
    Saya: {
      screen: Profil,
    }
  });

  const Akun = createStackNavigator({
    Akun: {
      screen: DataAkun,
      navigationOptions: {
        title: 'Data Akun',
        headerStyle: {
          backgroundColor: '#ffcc00'
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'normal',
        },
      }
    }
  });

  // const Agent = createStackNavigator({
  //   Data: {
  //     screen: TabRiwayat,
  //   },
  //   Tambah: {
  //     screen: RiwayatIsiSaldo,
  //     navigationOptions: {
  //         title: 'Top Up',
  //         header: null
  //     }
  //   }
  // });



  const HomeIconWithBadge = (props) => {
    // You should pass down the badgeCount in some other ways like react context api, redux, mobx or event emitters.
    return <IconWithBadge {...props} badgeCount={1} />;  
  }
  
  const AdminTabRoutes = createBottomTabNavigator(
    {
      // Beranda: Saya,
      // Pesanan: Pesanan,
      Akun: Akun,
      Saya: Saya,
    },
    {
      initialRouteName: "Saya",
      defaultNavigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, horizontal, tintColor }) => {
          const { routeName } = navigation.state;
          let IconComponent = Ionicons;
          let iconName;

          // if (routeName === 'Beranda') {
          //   iconName = `ios-home`;
          //   // IconComponent = HomeIconWithBadge;
          // } else 
          if (routeName === 'Pesanan') {
            iconName = `ios-cart`;
            // IconComponent = HomeIconWithBadge;
          } else if (routeName === 'Akun') {
            iconName = `ios-paper`;
            // IconComponent = HomeIconWithBadge;
          } else if (routeName === 'Saya') {
            iconName = `ios-person`;
            // IconComponent = HomeIconWithBadge;
          }
  
          // You can return any component that you like here!
          return <IconComponent name={iconName} size={hp('3.7%')} color={tintColor} />;
        },
      }),
      tabBarOptions: {
        activeTintColor: "#f5d316",
        inactiveTintColor: "grey",
        style: {
          height: hp('10%'),
          paddingVertical: hp('1%'),
          backgroundColor: "#fff",
          elevation: 4
        },
        labelStyle: {
          fontSize: hp('1.7%'),
          lineHeight: hp('2%')
        }
      },
    }
  );
  
  export default AdminTabRoutes;