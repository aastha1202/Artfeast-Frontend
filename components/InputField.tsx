/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from "react"
import { Animated, Pressable, StyleSheet, Text, View, ViewStyle } from "react-native"
import { TextInput, TouchableOpacity } from "react-native-gesture-handler"
import { ArtFeastText } from "./ArtFeastText"

interface InputFieldType{
    label: string,
    value: string,
    placeholder: string,
    onChangeText: (text: string)=> void
    secureTextEntry?: boolean
}

function InputField({ label, value, onChangeText, placeholder,secureTextEntry }: InputFieldType){
  const [isFocused, setIsFocused] = useState(false)
  const labelPosition = new Animated.Value(isFocused || value ? -10 : 20);
  const labelstyle = {
    color: isFocused || value ? 'black' : 'rgba(151, 151, 151, 1)',
    top:labelPosition,
    left:10,
    backgroundColor:'white'
  }
    function handleFocus(){
      setIsFocused(true)
      Animated.timing(labelPosition, {
        toValue: -10,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }

    const handleBlur = () => {
      setIsFocused(false);
      if (!value) {
        Animated.timing(labelPosition, {
          toValue: 10,
          duration: 200,
          useNativeDriver: false,
        }).start();
      }
    };
    return(
    <View style={styles.inputTextContainer}>
    <Animated.Text style={[labelstyle,styles.label]}>{label}</Animated.Text>
      <TextInput
        style={styles.inputStyles}
        placeholder={placeholder}
        // placeholderTextColor="rgba(151, 151, 151, 1)"
        cursorColor='black'
        onChangeText={onChangeText}
        value={value}
        secureTextEntry={secureTextEntry}
        onFocus={handleFocus}
        onBlur={handleBlur}
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
  style={[styles.buttonStyles,{backgroundColor: fill==='white' ? 'white' : disabled? '#F5F7FA' :'#212121', borderWidth: disabled? 0:1.5, borderColor: '#212121',},customStyle]}
  onPress={onPress}
  activeOpacity={0.8}
  >
  <ArtFeastText
    style={{
      textAlign: 'center',
      fontSize: 18,
      color: fill==='white' ? '#212121' : disabled? '#89939E':'white' ,
      
    }} text=    {title} />
</TouchableOpacity>
  )
} 

interface AFInputField  {
  placeholder: string
  keyboardType: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  onChangeText : (text: string)=>void 
  value?: string 
}

function AFInputField ({placeholder,keyboardType, onChangeText,value }:AFInputField){
  const [editable, setEditable] = useState(true)
  const [disable, setDisabled] = useState(false)
  useEffect(() => {
    if (value &&  value?.length>=1) {
      setEditable(true);
    } else {
      setEditable(false);
    }
  }, [value]);

  return(
    <Pressable onPress={()=> setEditable(true)}>
 <TextInput  placeholder={placeholder}  onChangeText={(text:  string)=>onChangeText(text)} keyboardType={keyboardType} cursorColor='black'  placeholderTextColor='#89939E'  style={{backgroundColor: editable ? 'white': '#F5F7FA', borderWidth: 1,minWidth:100,borderColor:editable? '#89939E': '#F5F7FA',color:'black',borderRadius:10,paddingHorizontal:10,fontSize:15, fontFamily:'Inter'}}/>
   </Pressable>
  )
}


interface ArtworkDetailsValuesTypes  {
  label: string
  value: string

}

function ArtworkDetailsValues ({label,value}: ArtworkDetailsValuesTypes){
  return(
    <View style={{ display:'flex',flexDirection:'row', alignItems:'center', width: '80%'}}>
    <ArtFeastText style={{color:'#212121',fontSize:17, width: '50%'}} text={label}/>
    <ArtFeastText style={{color:'#212121',fontSize:17,fontFamily:'Inter-SemiBold' }} text={value}/>
  </View>

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
        padding:15,
        fontFamily:'Inter'
      },
      buttonStyles: {
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 5,
        width: 180
      },
      label:{
        position:'absolute',
        paddingHorizontal:0,
        textAlignVertical:'center',
        zIndex: 100,
      }
})

export  {AFButton, InputField, AFInputField, ArtworkDetailsValues }
