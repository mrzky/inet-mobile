import React, {Component} from 'react';
import NetInfo from '@react-native-community/netinfo';

export const NetworkContext = React.createContext({ isConnected: true });

type Props = {}
export class NetworkProvider extends Component<Props>  {
    state = {
        isConnected: true
    };

    componentDidMount() {
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
    }

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
    }

    handleConnectivityChange = isConnected => { 
        this.setState({ isConnected });
        // this.props.navigation.navigate('NoConnection');
    }

    render() {
    return (
            <NetworkContext.Provider value={this.state}>
                {this.props.children}
            </NetworkContext.Provider>
        );
    }
}