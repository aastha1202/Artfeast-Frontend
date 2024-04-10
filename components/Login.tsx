/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';
import { setAuthorizationHeader } from '../utils/api';
import {InputField} from './InputField';
import Toast from 'react-native-toast-message';

export default function Signin() {
  const [userName, setUserName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [disable,setDisable] = useState(true)
  const navigation = useNavigation();
  const user = {
    userName: userName,
    password: password,
  };
  const storeToken = async (token: string) => {
    try {
      console.log('afterlogin', token);
      const tokens = await AsyncStorage.getItem('token', ()=>{
        console.log(tokens,'afterlogin if there is any token')
      })
      await AsyncStorage.setItem('token', token, async ()=> {
        const savedtoken = await AsyncStorage.getItem('token');
        console.log('uid', savedtoken);
        if(savedtoken){
          setAuthorizationHeader(savedtoken)
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(()=>{
    if(userName && password)
    setDisable(false)
    else
    setDisable(true)
  },[userName,password])

  function handleLogin() {
    if(!userName || !password){
      Toast.show({
        type: 'error',
        text1: 'Please enter all the fields',
        topOffset: 0,
      });
      return
    }
    fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    })
      .then(response => response.json())
      .then(data => {
        if (data) {
          if(data.message==='Login successful'){
            console.log('data', data.token);
            storeToken(data.token);
            navigation.navigate('ProductPage');
          }
          else{
            Toast.show({
              type: 'error',
              text1: data.message,
              topOffset: 0,
            });
          }
        } else {
          console.log('signin error');
        }
      })
      .catch(error => {
        console.error('Network errors', error);
      });
  }
  return (
    <View style={styles.containerStyle}>
    <Toast/>
    <ScrollView>
      <View style={styles.flexBox}>
        <InputField
          placeholder="Enter UserName"
          onChangeText={text => setUserName(text.trim())}
          value={userName}
          label='UserName'
        />
        <InputField
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={text => setPassword(text)}
          value={password}
          label='Password'
        />
      </View>
    </ScrollView>
    <View style={styles.bottomContainer}>
         <View style={{display:'flex', flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
         <Text style={{color: 'rgba(166, 166, 170, 1)',}}>
         Are you new at Artfeast?{' '}
          </Text>
          <TouchableOpacity style={{}} onPress={() => navigation.navigate('Signin')}>
            <Text
              style={{
                color: 'black',
                textDecorationLine: 'underline',
              }}>
              Sign up
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[styles.buttonStyles, {backgroundColor: disable ?  '#F5F7FA': 'black'}]}
          onPress={handleLogin}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 18,
              color: `${disable ? "#717171": 'white'}`,
            }}>
            Login
          </Text>
        </TouchableOpacity>
</View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: 'white',
    flex: 1,
    margin: 0,
    padding: 40,

  },
  flexBox: {
    flex: 1,
    gap: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  buttonStyles: {
    backgroundColor: '#F5F7FA',
    //  borderWidth:1,
    borderRadius: 100,
    padding: 12,
    width: '100%',
    color: 'black',
  },
  bottomContainer :{
    gap: 20,
    width:'100%',
  }
});
