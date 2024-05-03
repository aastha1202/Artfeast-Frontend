/* eslint-disable prettier/prettier */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Modal} from 'react-native';

export default function Sidebar() {
  const [showSidebar, setShowSidebar] = useState(false);
  const navigation = useNavigation()
  const handleLogout = async () =>{
    await AsyncStorage.removeItem('token',()=>{
      console.log(AsyncStorage.getItem('token'), 'after deletion')
      navigation.navigate('JoinNow');
      setShowSidebar(false)
    })
  
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setShowSidebar(true)}>
        {/* <Text style={{color:'black'}}>Open Sidebar</Text> */}
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showSidebar}
        onRequestClose={() => setShowSidebar(false)}>
        <View style={styles.modalContainer}>
          <View style={{backgroundColor:'white',width:300,height: '100%'}}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  logoutButton: {
    backgroundColor: 'white',
    padding: 20,
  },
  logoutText: {
    color: 'black',
    fontWeight: 'bold',
  },
});
