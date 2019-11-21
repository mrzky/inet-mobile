import {createStackNavigator, createAppContainer} from 'react-navigation';

// Halaman
import Login from './Login';
import Agent from './agent/AgentRoutes';
import Admin from './admin/AdminRoutes';
import NoConnection from "./NoConnection";

const Routes = createStackNavigator(
    {
      Login: {
        screen: Login,
        navigationOptions: {
          header: null
        }
      },
      Agent: {
        screen: Agent,
        navigationOptions: {
          header: null
        }
      },
      Admin: {
        screen: Admin,
        navigationOptions: {
          header: null
        }
      },
      NoConnection: {
        screen: NoConnection,
        navigationOptions: {
          header: null
        }
      },
    },
    {
      initialRouteName: "Login",
    }
  );
  
  export default createAppContainer(Routes);