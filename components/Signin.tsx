/* eslint-disable prettier/prettier */
import {
  StyleSheet,
  ScrollView,
  TextInput,
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import { API_URL } from '@env';

export default function Login() {
  const [fullName, setFullName] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  function handleSignup() {
    const user = {
      fullName: fullName,
      userName: userName,
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
        if (data.userId) {
          console.log('User registered successfully');
          console.log('User ID:', data.userId);
          navigation.navigate('UserType', {userId: data.userId});
        } else {
          console.log('Registration error');
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
          Welcome Back!
        </Text>
        <Text style={[styles.loginPageHeader, styles.subtextFont]}>
          Enter details and Get Started
        </Text>
      </View>
      <View style={styles.flexBox}>
        <TextInput
          style={styles.inputStyles}
          placeholder="Full Name"
          placeholderTextColor="rgba(151, 151, 151, 1)"
          onChangeText={text => setFullName(text)}
        />
        <TextInput
          style={styles.inputStyles}
          placeholder="Create Username"
          placeholderTextColor="rgba(151, 151, 151, 1)"
          onChangeText={text => setUserName(text)}
        />
        <TextInput
          style={styles.inputStyles}
          placeholder="Password"
          placeholderTextColor="rgba(151, 151, 151, 1)"
          secureTextEntry={true}
          onChangeText={text => setPassword(text)}
        />
        <TouchableOpacity
          style={styles.buttonStyles}
          onPress={handleSignup}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 16,
              color: 'white',
            }}>
            Get Started
          </Text>
        </TouchableOpacity>

        <Text style={{color: 'rgba(166, 166, 170, 1)'}}>
          Already have an account?{' '}
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text
              style={{
                color: 'rgba(158, 20, 57, 1)',
                textDecorationLine: 'underline',
              }}>
              Login
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
  headerContainer: {
    position: 'absolute',
    right: 20,
    top: 40,
    // flex:1,
    // textAlign:'right',
    // justifyContent:'flex-end'
  },
  loginPageHeader: {
    textAlign: 'right',
    // color:"rgba(255, 255, 255, 1)"
  },
  header: {
    fontSize: 32,
  },
  flexBox: {
    flex: 1,
    gap: 20,
    paddingHorizontal: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputStyles: {
    borderColor: 'rgba(0, 0, 0, 1)',
    backgroundColor: 'rgba(229, 229, 229, 0.3)',
    fontSize: 16,
    height: 40,
    width: '100%',
    borderRadius: 8,
    padding: 10,
  },
  buttonStyles: {
    backgroundColor: 'rgba(158, 20, 57, 1)',
    //  borderWidth:1,
    borderRadius: 10,
    padding: 12,
    width: '100%',
    color: 'rgba(0, 0, 0, 1)',
  },
});
