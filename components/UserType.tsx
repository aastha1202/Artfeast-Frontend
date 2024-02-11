/* eslint-disable prettier/prettier */
import {Image, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import React, {useEffect, useState} from 'react';
import { RouteProp, useRoute} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
import { RootStackParamList } from '../types/RouteTypes';
import { API_URL } from '@env';

export default function UserType() {
  const [userType, setUserType] = useState('');
  const [userId, setuserId] = useState('');
  const route = useRoute<RouteProp<RootStackParamList, 'UserType'>>();
  const navigation = useNavigation();
  useEffect(() => {
    setuserId(route.params?.userId);
  }, [route.params?.userId]);

  function updateUserType() {
    console.log('rmail', userId);
    fetch(`${API_URL}/auth/updateRole`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        role: userType,
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        navigation.navigate('Signin');
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
  return (
    <View >
      <Image
        source={require('./Assets/Union1.png')}
        style={{width: '100%', position: 'absolute'}}
      />
      <Text style={[ styles.subtextFont]}>
        Elevate Art, Explore Passion with Artfeast.
      </Text>
      <View style={{marginVertical: 400}}>
        <Picker
          selectedValue={userType}
          style={{
            backgroundColor: 'rgba(247, 247, 247, 1)',
            color: 'rgba(151, 151, 151, 1)',
          }}
          onValueChange={(itemValue) => setUserType(itemValue)}>
          <Picker.Item label="Joining ArtFeast as...." value={null} />
          <Picker.Item label="Artist" value="artist" />
          <Picker.Item label="Art Enthusiasts" value="customer" />
        </Picker>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            padding: 15,
            gap: 20,
            justifyContent: 'center',
          }}>
          <TouchableOpacity style={[styles.buttonStyles, styles.cancelButton]}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 16,
                color: 'rgba(151, 151, 151, 1)',
              }}>
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonStyles}
            onPress={updateUserType}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 16,
                color: 'white',
              }}>
              Confirm
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  buttonStyles: {
    backgroundColor: 'rgba(158, 20, 57, 1)',
    //  borderWidth:1,
    borderRadius: 10,
    padding: 12,
    width: '45%',
    color: 'rgba(0, 0, 0, 1)',
  },
  cancelButton: {
    backgroundColor: 'rgba(247, 247, 247, 1)',
  },
  headerFont: {
    fontSize: 30,
    color: 'rgba(255, 255, 255, 1)',
  },
  subtextFont: {
    fontSize: 20,
    color: ' rgba(255, 255, 255, 0.8)',
  },
});
