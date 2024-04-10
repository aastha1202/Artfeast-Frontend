/* eslint-disable prettier/prettier */
import { StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import { RouteProp, useRoute} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
import { RootStackParamList } from '../types/RouteTypes';
import { API_URL } from '@env';
import CheckBox from '@react-native-community/checkbox';
import { ScrollView } from 'react-native-gesture-handler';

export default function UserType() {
  const [userId, setuserId] = useState('');
  // const [artist, setArtist] = useState(false);
  // const [artEnth, setArtEnth] = useState(false)
  const [userType, setUserType] = useState('');
  const [disable, setDisable] = useState(true)
  const route = useRoute<RouteProp<RootStackParamList, 'UserType'>>();
  const navigation = useNavigation();
  useEffect(() => {
    setuserId(route.params?.userId);
  }, [route.params?.userId]);
  useEffect(()=>{
    if(userType){
      setDisable(false)
    }
    else
    setDisable(true)
  },[userType,disable])
  function handleCheckBoxChange(type: 'artist' | 'customer') {
    setUserType(type);
  }
  function updateUserType() {
    console.log('rmail', userId);
    // if (artist){
    //   userType='artist'
    // }
    // else if (artEnth){
    //   userType='customer'
    // }
    if(!userType){
      return
    }
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
        navigation.navigate('Login');
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
  return (
    <View style={styles.containerStyle}>
      <ScrollView contentContainerStyle={{gap:20,marginTop:60}}>
      <View>
      <Text  style={styles.headerFont}  >You wish to join ARTFEAST as an?</Text>
      <Text style={[ styles.subtextFont]}>
      Select the type of user you wish to be      
      </Text>
      </View>
      <View style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
      <CheckBox boxType='square' tintColors={{true:'black'}}  value={userType === 'artist'}  onChange={()=> handleCheckBoxChange('artist')} />
      <Text style={{color:'black' , fontSize: 18}}>Artist</Text>
      </View>
      <View style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
      <CheckBox boxType='square' tintColors={{true:'black'}}  value={userType === 'customer'}  onChange={()=> handleCheckBoxChange('customer')} />
      <Text style={{color:'black' , fontSize: 18}}>Art enthusiast</Text>
      </View>
        
      </ScrollView>
      <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            padding: 15,
            gap: 20,
            justifyContent: 'center',
          }}>
          <TouchableOpacity
            style={[styles.buttonStyles,{backgroundColor: disable ?'#F5F7FA' :'black',}]}
            disabled={disable}
            onPress={updateUserType}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 16,
                color: `${disable ? "#717171": 'white'}`,
              }}>
              Continue
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
    padding: 20,
  },
  buttonStyles: {
    borderRadius: 100,
    padding: 12,
    width: '100%',
    color: 'black',
  },
  headerFont: {
    fontSize: 22,
    fontWeight:'600',
    color: 'black',
    textAlign:'center'
  },
  subtextFont: {
    fontSize: 16,
    color: '#89939E',
    textAlign:'center',
  },
});
