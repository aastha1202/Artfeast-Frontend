/* eslint-disable prettier/prettier */
import React from 'react';

import { TouchableOpacity, View, StyleSheet } from 'react-native';

interface RadioButtonType{
    onPress: ()=> void
    checked: boolean
}

export const RadioButton =(props: RadioButtonType )=> {

    return (

        <TouchableOpacity style={styles.circle} onPress={props.onPress}>

            {props.checked ? (<View style={styles.checkedCircle} />) : (<View />)}

        </TouchableOpacity>

    )
};

const styles = StyleSheet.create({
    circle: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#89939E',
        alignItems: 'center', 
        justifyContent: 'center',
        marginHorizontal: 10
    },
    checkedCircle: {
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#131313'
    }

});