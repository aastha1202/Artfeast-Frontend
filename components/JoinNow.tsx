/* eslint-disable prettier/prettier */
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';

export default function JoinNow() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.joinNowContainer} >
      <Text style={styles.joinNowHeader}>
      Artfeast - Where Creativity Flourishes
      </Text>
      <Text style={styles.joinNowSubText}>
      Welcome to Artfeast, a vibrant hub where artists thrive and art enthusiasts explore. Let's ignite creativity together!
      </Text>
      <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={[styles.buttonStyles, {backgroundColor:'white'}]}
        onPress={() => navigation.navigate('Signin')}>
        <Text
          style={[styles.buttonText, {color:'black'}]}>
          Signup
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.buttonStyles, {borderBlockColor:'white', borderWidth:2}]}
        onPress={() => navigation.navigate('Login')}>
        <Text
          style={[styles.buttonText, {color:'white'}]}>
          Login
        </Text>
      </TouchableOpacity>
      </View>
      </View>
      <Image source={require('./Assets/JoinNow.png')} style={styles.imgStyling} />   
    </View>
  );
}

const styles = StyleSheet.create({
  joinNowContainer:{
    zIndex: 2,
    bottom: 40 ,
    position: 'absolute',
    padding:14,
  },
  joinNowHeader: {
    fontSize: 30,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 1)',
  },
  joinNowSubText:{
    color: 'rgba(255, 255, 255, 1)',
    fontSize: 18,
  },
  imgStyling: {
    width: '100%',
    height: '100%'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
    padding: 0,
  },
  buttonStyles: {
    borderColor: 'white',
    padding: 12,
    width: '45%',
    elevation: 2,
    borderRadius:100,
  },
  buttonText: {
    fontSize: 18,
    textAlign:'center',
  },
  buttonContainer:{
    flex:1,
    flexDirection:'row',
    gap:40,
    paddingTop:20
  }
});
