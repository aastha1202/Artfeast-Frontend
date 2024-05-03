/* eslint-disable prettier/prettier */
import {StyleSheet, ScrollView, View, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {API_URL} from '@env';
import {InputField} from '../InputField';
import Toast from 'react-native-toast-message';
import {ArtFeastText} from '../ArtFeastText';

export default function Login() {
  const [fullName, setFullName] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [disable, setDisable] = useState(true);
  const navigation = useNavigation();
  useEffect(() => {
    if (fullName && userName && password) setDisable(false);
    else setDisable(true);
  }, [userName, fullName, password]);

  function handleSignup() {
    console.log(API_URL)
    if (!fullName || !userName || !password) {
      Toast.show({
        type: 'error',
        text1: 'Please enter all fields',
        topOffset: 0,
      });
      return;
    }
    if (password.length < 8) {
      Toast.show({
        type: 'error',
        text1: 'Password must be at least 8 characters long',
        topOffset: 0,
      });
      return;
    }
    const user = {
      fullName: fullName.trim(),
      userName: userName.trim(),
      password: password,
    };

    fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if (data.message === 'User already exists') {
          Toast.show({
            type: 'error',
            text1: data.message,
            topOffset: 0,
          });
        }
        if (data.userId) {
          console.log('User registered successfully');
          console.log('User ID:', data.userId);
          navigation.navigate('UserType', {userId: data.userId});
        }
      })
      .catch(error => {
        console.log('Network errors', error.message);
        Toast.show({
          type: 'error',
          text1: error.message,
          topOffset: 0,
        });
      });
  }
  return (
    <View style={styles.containerStyle}>
      <ScrollView>
        <Toast />
        <View style={styles.flexBox}>
          <InputField
            placeholder="Enter your full name"
            label="Full Name"
            onChangeText={(text: string) => setFullName(text)}
            value={fullName}
          />
          <InputField
            placeholder="Enter UserName"
            label="UserName"
            onChangeText={(text: string) => setUserName(text)}
            value={userName}
          />
          <InputField
            placeholder="Enter password"
            label="Paswword"
            secureTextEntry={true}
            onChangeText={(text: string) => setPassword(text)}
            value={password}
          />

          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 2,
            }}>
            <ArtFeastText
              style={{color: 'rgba(166, 166, 170, 1)'}}
              text="By signing in, you agree to ArtFeast’s "
            />
            <ArtFeastText text="Terms of Service" />
            <ArtFeastText text="and Privacy Policy" />
          </View>
        </View>
      </ScrollView>
      <View style={styles.bottomContainer}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <ArtFeastText
            style={{color: 'rgba(166, 166, 170, 1)'}}
            text="Already have an account?"
          />
          <TouchableOpacity
            style={{}}
            onPress={() => navigation.navigate('Login')}>
            <ArtFeastText
              style={{
                textDecorationLine: 'underline',
              }}
              text="Login"
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[
            styles.buttonStyles,
            {backgroundColor: disable ? '#F5F7FA' : 'black'},
          ]}
          // disabled={disable}
          onPress={handleSignup}>
          <ArtFeastText
            style={{
              textAlign: 'center',
              fontSize: 18,
              color: `${disable ? '#717171' : 'white'}`,
            }}
            text="Signup"
          />
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
    // zIndex:-1000
  },
  flexBox: {
    flex: 1,
    gap: 20,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1000,
  },
  buttonStyles: {
    // backgroundColor: '#F5F7FA',
    //  borderWidth:1,
    borderRadius: 100,
    padding: 12,
    width: '100%',
    color: 'black',
  },
  bottomContainer: {
    gap: 20,
    width: '100%',
  },
});
