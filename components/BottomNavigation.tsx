/* eslint-disable prettier/prettier */
import { View, TouchableOpacity, Image, Text , StyleSheet} from "react-native"
import { useNavigation } from "@react-navigation/native";

function BottomNavigation(){
    const navigation= useNavigation()

    const bottomRoute =[ 
      {route:'Home', icon:require('./Assets/Home.png') },
      {route:'Explore', icon: require('./Assets/explore.png')},
      {route:'Add', icon: require('./Assets/add.png')},
      {route:'Blog', icon: require('./Assets/pencil.png'),},
      {route:'Profile', icon:require('./Assets/Oval.png')}
    ]
    return(
    <View style={styles.bottomNavigation}>
    { bottomRoute.map((obj)=>{
     return(
       <TouchableOpacity style={{paddingBottom:10}}  onPress={()=> navigation.navigate(`${obj.route}`)} >
       <Image style={{aspectRatio:1,width:35,height:35}} source={obj.icon}/>
       <Text style={{color:'black',textAlign:'center'}}>{obj.route}</Text>
       </TouchableOpacity>
     )
    })
    }
   </View>
    )
  }

  const styles= StyleSheet.create({
    bottomNavigation:{
        position:'absolute',
        bottom:0,
        flexDirection:'row',
        paddingTop:10,
        gap:30,
        width:"100%",
        justifyContent:'space-evenly',
        alignItems:'center',
        boxShadow: "0px 4px 10px 0px rgba(0, 0, 0, 0.25) inset",
        backgroundColor:'white',

      }
  })
  export default BottomNavigation