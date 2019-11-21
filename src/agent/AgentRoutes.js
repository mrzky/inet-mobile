import {createStackNavigator, createAppContainer} from 'react-navigation';

import AgentUbahPassword from './AgentUbahPassword';
import AgentTabRoutes from './AgentTabRoutes';

const AgentRoutes = createStackNavigator(
    {
      AgentUbahPassword: {
        screen: AgentUbahPassword
      },
      AgentProfil: {
        screen: AgentTabRoutes,
        navigationOptions: {
          header: null
        }
      },
    },
    {
      initialRouteName: "AgentProfil",
    }
  );
  
  export default createAppContainer(AgentRoutes);