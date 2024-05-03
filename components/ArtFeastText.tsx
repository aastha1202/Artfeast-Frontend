/* eslint-disable prettier/prettier */
import React from "react"
import { StyleSheet, Text, TextStyle,  } from "react-native"

interface ArtFeastTextProps {
    text: string;
    style?: TextStyle;
}


function ArtFeastText({ text, style = {} }: ArtFeastTextProps){
    return(
        <Text style={[styles.artfeastTextStyle,style]}>{text}</Text>
    )
}

const styles = StyleSheet.create({
    artfeastTextStyle : {
        fontFamily: 'Inter',
        color: '#212121',
    }
})

export  {ArtFeastText }
