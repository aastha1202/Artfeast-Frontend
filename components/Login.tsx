/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

export default function Signin() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigation = useNavigation();
  const user = {
    userName: email,
    password: password,
  };
  const storeToken = async (token: string) => {
    try {
      console.log('afterlogin', token);
      await AsyncStorage.setItem('token', token);
      const savedtoken = await AsyncStorage.getItem('token');
      console.log('uid', savedtoken);
    } catch (error) {
      console.log(error);
    }
  };

  function handleLogin() {
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
          console.log('data', data);
          storeToken(data.token);
          navigation.navigate('ProductPage');
        } else {
          console.log('signin error');
        }
      })
      .catch(error => {
        console.error('Network errors', error);
      });
  }
  return (
    <ScrollView>
      <Image
        style={styles.loginPageImage}
        source={require('./Assets/Shape.png')}
      />
      <View style={styles.headerContainer}>
        <Text style={[styles.loginPageHeader, styles.headerFont]}>
          Welcomes Back!
        </Text>
        <Text style={[styles.loginPageHeader, styles.subtextFont]}>
          Enter Username and Password
        </Text>
      </View>
      <View style={styles.flexBox}>
        <TextInput
          style={styles.inputStyles}
          placeholder="Enter Email"
          placeholderTextColor="rgba(151, 151, 151, 1)"
          onChangeText={text => setEmail(text)}
        />
        <TextInput
          style={styles.inputStyles}
          placeholder="Password"
          placeholderTextColor="rgba(151, 151, 151, 1)"
          secureTextEntry={true}
          onChangeText={text => setPassword(text)}
        />
        <TouchableOpacity style={styles.buttonStyles} onPress={handleLogin}>
          <Text style={styles.buttonTextStyle}>
            Login
          </Text>
        </TouchableOpacity>

        <Text style={{color: 'rgba(166, 166, 170, 1)'}}>
          Are you new at Artfeast?{' '}
          <TouchableOpacity onPress={() => navigation.navigate('Signin')}>
            <Text
              style={{ color: 'rgba(158, 20, 57, 1)',textDecorationLine: 'underline'}}>
              Sign up
            </Text>
          </TouchableOpacity>
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loginPageImage: {
    resizeMode: 'cover',
    width: '100%',
  },
  headerFont: {
    fontSize: 30,
    color: 'rgba(255, 255, 255, 1)',
  },
  subtextFont: {
    fontSize: 20,
    color: ' rgba(255, 255, 255, 0.8)',
  },
  header: {
    fontSize: 32,
  },
  headerContainer: {
    position: 'absolute',
    right: 20,
    top: 40,
  },
  loginPageHeader: {
    textAlign: 'right',
  },
  flexBox: {
    flex: 1,
    gap: 20,
    paddingHorizontal: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  inputStyles: {
    borderColor: 'rgba(0, 0, 0, 1)',
    color: 'rgba(151, 151, 151, 1)',
    backgroundColor: 'rgba(229, 229, 229, 0.3)',
    fontSize: 16,
    height: 40,
    width: '100%',
    borderRadius: 8,
    padding: 10,
  },
  buttonStyles: {
    backgroundColor: 'rgba(158, 20, 57, 1)',
    borderRadius: 10,
    padding: 12,
    width: '100%',
    color: 'rgba(0, 0, 0, 1)',
  },
  buttonTextStyle:{
    textAlign: 'center',
    fontSize: 16,
    color: 'white',
  }});
