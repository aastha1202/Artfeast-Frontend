/* eslint-disable prettier/prettier */
import React, { View, TouchableOpacity, Text , StyleSheet} from "react-native"
import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/Feather'

function BottomNavigation(){
    const navigation= useNavigation()

    const bottomRoute =[ 
      {route:'ProductPage', iconName:'home', label: 'Home'},
      {route:'Cart', iconName: 'shopping-cart', label:'Cart'}, 
      {route:'UploadScreen', iconName: 'bell', label: 'Notification'},
      {route:'Profile', iconName:'user', label: 'Profile'}
    ]
    return(
    <View style={styles.bottomNavigation}>
    { bottomRoute.map((obj)=>
     (
       <TouchableOpacity style={{paddingBottom:10}}  onPress={()=> navigation.navigate(`${obj.route}`)} >
       <Icon name={obj.iconName} color='black' size={30} style={{alignSelf:'center'}}/>
       <Text style={{color:'black',textAlign:'center'}}>{obj.label}</Text>
       </TouchableOpacity>
     )
    )
    }
   </View>
    )
  }

  const styles= StyleSheet.create({
    bottomNavigation:{
        // position:'absolute',
        // bottom:0,
        flexDirection:'row',
        paddingTop:10,
        gap:30,
        width:'100%',
        justifyContent:'space-evenly',
        alignItems:'center',
        boxShadow: "0px 4px 10px 0px rgba(0, 0, 0, 0.25) inset",
        backgroundColor:'white',
        // marginTop: 200,

      }
  })
  export default BottomNavigation