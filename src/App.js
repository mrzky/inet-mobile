import React, {Component} from "react";
import Routes from "./Routes";
import { View, StatusBar } from "react-native";
import { createAppContainer } from "react-navigation";
import { NetworkProvider } from './NetworkProvider';

const AppContainer = createAppContainer(Routes);
console.ignoredYellowBox = ['Warning: Each', "Warning: Failed prop type"];

export default class App extends Component {
    render() {
        return (
            <NetworkProvider>
                <View style={{ flex: 1 }}><StatusBar backgroundColor="#ffcc00" barStyle="light-content" />
                    <AppContainer />
                </View>
            </NetworkProvider>
        );
    }
}

