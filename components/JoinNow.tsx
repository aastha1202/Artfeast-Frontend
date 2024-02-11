/* eslint-disable prettier/prettier */
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';

export default function JoinNow() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text style={styles.joinNowHeader}>
        Unleash Your Artistic Journey with Artfeast!
      </Text>
      <Image source={require('./Assets/Union.png')} style={styles.imgStyling} />
      <Image source={require('./Assets/Pic1.png')} style={styles.pic1Styling} />
      <Image source={require('./Assets/Pic2.png')} style={styles.pic2Styling} />
      <TouchableOpacity
        style={styles.buttonStyles}
        onPress={() => navigation.navigate('Login')}>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 16,
            color: 'rgba(158, 20, 57, 1)',
          }}>
          Join Now
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  joinNowHeader: {
    zIndex: 2,
    top: 20,
    position: 'absolute',
    fontSize: 24,
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 1)',
  },
  imgStyling: {
    position: 'absolute',
    right: 0,
    width: '100%',
    zIndex: 0,
    top: 0,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
    padding: 0,
  },
  pic1Styling: {
    // flex:1,
    zIndex: 1,
    position: 'absolute',
    right: '10%',
    top: '25%',
    // width:"100%",
    aspectRatio: 1,
    marginHorizontal: 'auto',
    marginVertical: 0,
  },
  pic2Styling: {
    //    width:'100%',
  },
  buttonStyles: {
    // border
    borderColor: 'white',
    // borderWidth:1,
    // borderRadius:10,
    padding: 12,
    width: '40%',
    position: 'absolute',
    bottom: '10%',
    elevation: 2,
  },
});
