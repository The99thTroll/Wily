import React, {Component} from 'react'
import {View, Text, Stylesheet, Image} from 'react-native'
import {createAppContainer, createSwitchNavigator} from 'react-navigation'
import {createBottomTabNavigator} from 'react-navigation-tabs'
import {Icon} from 'react-native-elements';
import "react-native-vector-icons";
import BookTransactionScreen from './sceens/bookTransactionScreen';
import SearchSceen from './sceens/searchScreen';
import LoginScreen from './sceens/loginScreen';

export default class App extends React.Component{
  render(){
    return(
      <AppContainer/>
    );
  }
}

const bottomTabNavigator = createBottomTabNavigator({
  BookTransactions: {screen: BookTransactionScreen},
  Search: {screen: SearchSceen}
},
{
  defaultNavigationOptions: ({navigation}) => ({
    tabBarIcon: ({tintColor})=> {
      const rootName = navigation.state.routeName
      if(rootName == "BookTransactions"){
        return(<Icon name="book" type="font-awesome" color={tintColor}/>)
      }else if(rootName == "Search"){
        return(<Icon name="search" type="font-awesome" color={tintColor}/>)
      }
    }
  }),
  tabBarOptions: {
    activeTintColor: '#308bdb',
    inactiveTintColor: 'gray'
  },
})

const switchNavigator = createSwitchNavigator({
  LoginScreen:  {screen: LoginScreen},
  TabNavigator: {screen: bottomTabNavigator}
})

const AppContainer = createAppContainer(switchNavigator);