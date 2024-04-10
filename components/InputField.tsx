/* eslint-disable prettier/prettier */
import React from "react"
import { StyleSheet, Text, View, ViewStyle } from "react-native"
import { TextInput, TouchableOpacity } from "react-native-gesture-handler"

interface InputFieldType{
    label: string,
    value: string,
    placeholder: string,
    onChangeText: (text: string)=> void
    secureTextEntry?: boolean
}

function InputField({ label, value, onChangeText, placeholder,secureTextEntry }: InputFieldType){
    return(
    <View style={styles.inputTextContainer}>
    <Text style={{color:'black',position:'absolute', top:-10 , left:10, backgroundColor:'white'}}>{label}</Text>
      <TextInput
        style={styles.inputStyles}
        placeholder={placeholder}
        placeholderTextColor="rgba(151, 151, 151, 1)"
        cursorColor='black'
        onChangeText={onChangeText}
        value={value}
        secureTextEntry={secureTextEntry}
      />
      </View>
    )
}

interface AFButtonProps {
  title: string,
  onPress: () => void,
  fill : 'white' | 'black',
  customStyle?: ViewStyle
  disabled?: boolean
}
function AFButton({title,onPress, fill, customStyle,disabled}: AFButtonProps){
  return(
<TouchableOpacity
  style={[styles.buttonStyles,{backgroundColor: fill==='white' ? 'white' : '#212121', borderWidth: 1.5, borderColor: '#212121',},customStyle]}
  disabled={disabled}
  onPress={onPress}>
  <Text
    style={{
      textAlign: 'center',
      fontSize: 18,
      color: fill==='white' ? '#212121' : 'white' ,
      
    }}>
    {title}
  </Text>
</TouchableOpacity>
  )
} 

interface AFInputField  {
  placeholder: string
  keyboardType: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  onChangeText : (text: string)=>void 
}

function AFInputField ({placeholder,keyboardType, onChangeText}:AFInputField){
  return(
    <TextInput placeholder={placeholder} onChangeText={(text:  string)=>onChangeText(text)} keyboardType={keyboardType} cursorColor='black'  placeholderTextColor='#89939E'  style={{backgroundColor:'#F5F7FA',minWidth:100,color:'black',borderRadius:10,paddingHorizontal:10}}/>
  )
}


const styles = StyleSheet.create({
    inputTextContainer:{
        borderBottomColor: 'black',
        borderWidth:1.5,
        borderRadius: 10,
        width:'100%'
      },
      inputStyles: {
        color:'black',
        fontSize: 16,
        // height: 40,
        width: '100%',
        borderRadius: 10,
        padding:15
      },
      buttonStyles: {
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 5,
        width: 180
      },

})

export  {AFButton, InputField, AFInputField }
