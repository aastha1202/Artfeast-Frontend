/* eslint-disable prettier/prettier */
import { StyleSheet} from 'react-native'
import React from 'react'
import {
  ViroARScene,
  ViroARSceneNavigator,
  ViroImage,
} from '@viro-community/react-viro';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../types/RouteTypes';

const ImageTexture = (postUrl: string) => {
  const onInitialized = (arSceneState : any, reason : any) => {
    console.log(arSceneState)
    console.log(reason);
  };

  return (
    /** ViroARScene will open up AR enabled camera in your scene */
    <ViroARScene onTrackingUpdated={onInitialized}>
    <ViroImage
        position={[0, 0, -1]}
        scale={[0.3, 0.3, 0.1]}
        rotation={[0, 0, 0]}
        source={{uri: postUrl}}    />
    </ViroARScene>
  );
};

export default function Product() {
  // const [post,setPostUrl]= React.useState('')
  const route= useRoute<RouteProp<RootStackParamList, 'Product'>>()
  const postUrl = route.params?.data;

  return (
    <ViroARSceneNavigator
    autofocus={true}
    initialScene={{
        scene:()=> ImageTexture(postUrl),
    }}
    style={styles.f1}
    />
  );
}

const styles = StyleSheet.create({
  f1: {flex: 1},
  helloWorldTextStyle: {
    fontFamily: 'Arial',
    fontSize: 60,
    color: 'black',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  
})