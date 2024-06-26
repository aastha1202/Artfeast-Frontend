/* eslint-disable prettier/prettier */
import React, { useState, useEffect} from 'react';
// import SplashScreen from 'react-native-splash-screen';
// import {SafeAreaView} from 'react-native';
import Login from './components/screens/Login';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Signin from './components/screens/Signin';
import Product from './components/Product';
import JoinNow from './components/screens/JoinNow';
import UserType from './components/UserType';
import {WithSplashScreen} from './components/screens/Splash';
import ProductPage from './components/screens/ProductPage';
import Profile from './components/screens/Profile';
import { Provider } from 'react-redux';
import store from './store/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAuthorizationHeader } from './utils/api';
import UploadScreen from './components/screens/UploadScreen';
import PostDescription from './components/screens/PostDescription';
import CartPage from './components/screens/CartPage';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DynamicProfile from './components/screens/DynamicProfile';
import NotificationPage from './components/screens/NotificationPage';
import ArtistOrder from './components/screens/ArtistOrder';
import CategoryPage from './components/screens/CategoryPage';

function App(): JSX.Element {
  const Stack = createStackNavigator();

  const [isAppReady, setIsAppReady] = useState(false);
  const [token,setToken] = useState<string | null>(null)
  // const isDarkMode = useColorScheme() === 'dark';
  // useEffect(() => {
  //   SplashScreen.hide();
  // }, []);

  useEffect(() => {

    setTimeout(() => {
      setIsAppReady(true);
    }, 2000);

    const setTokenValue = async ()=>{
      const retrievedToken = await AsyncStorage.getItem('token',()=>{
        setToken(retrievedToken)
        if (token) {
          setAuthorizationHeader(token);
        }
      })
    }
    console.log("token",token)
    setTokenValue()
  }, [token]);

  return (
    <WithSplashScreen isAppReady={isAppReady}>
    <Provider store={store}>
    <NavigationContainer>
      <Stack.Navigator initialRouteName={token ? 'ProductPage' : 'JoinNow'} >
        <Stack.Screen
          name="Signin"
          component={Signin}
          // options={{headerShown: false}}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          // options={{headerShown: false}}
        />
        <Stack.Screen
          name="Product"
          component={Product}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="JoinNow"
          component={JoinNow}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="UserType"
          component={UserType}
          options={{headerShown: false}}
        />
         <Stack.Screen
          name="ProductPage"
          component={ProductPage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="UploadScreen"
          component={UploadScreen}
          options={{
            title: 'Upload Art',
            headerStyle: {
              backgroundColor: '#212121',
            },
            headerTintColor: '#fff',
          }}
        />
        <Stack.Screen
         name="PostDescription"
         component={PostDescription}
         options={{headerShown: false}}
         />
         <Stack.Screen
         name="DynamicProfile"
         component={DynamicProfile}
         options={{headerShown: false}}
         />
          <Stack.Screen
         name="NotificationPage"
         component={NotificationPage}
         options={{headerShown: false}}
         />
          <Stack.Screen
         name="CategoryPage"
         component={CategoryPage}
         options={{headerShown: false}}
         />
         <Stack.Screen
         name="Cart"
         component={CartPage}
        //  options={{headerShown: false}}
        options={{
          title: 'My Cart',
          headerStyle: {
            backgroundColor: '#212121',
          },
          headerTintColor: '#fff',
        }}
         />
      </Stack.Navigator>
    </NavigationContainer>
    </Provider>
    </WithSplashScreen>
  );
}


export default App;
