import {createStackNavigator, createAppContainer} from 'react-navigation';

import AdminUbahPassword from './AdminUbahPassword';
import AdminTabRoutes from './AdminTabRoutes';
import RincianAkun from './RincianAkun';

const AdminRoutes = createStackNavigator(
    {
      AdminUbahPassword: {
        screen: AdminUbahPassword
      },
      AdminUbahPassword: {
        screen: AdminUbahPassword
      },
      AdminProfil: {
        screen: AdminTabRoutes,
        navigationOptions: {
          header: null
        }
      },
      RincianAkun: {
        screen: RincianAkun,
        navigationOptions: {
          headerStyle: {
            backgroundColor: '#ffcc00',
            elevation: 0
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'normal',
          }, 
        }
      },
    },
    {
      initialRouteName: "AdminProfil",
    }
  );
  
  export default createAppContainer(AdminRoutes);