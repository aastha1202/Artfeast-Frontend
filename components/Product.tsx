/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { ImageSourcePropType, StyleSheet, View } from 'react-native';
import {
  ViroARScene,
  ViroARSceneNavigator,
  ViroImage,
  ViroNode,
} from '@viro-community/react-viro';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../types/RouteTypes';
import InstructionBox from './InstructionBox';

const ImageTexture = (postUrl: string) => {
  const [position, setPosition] = useState<[number,number,number]>([0, 0, -1]);
  
  const onDrag = (dragToPos: React.SetStateAction<[number,number,number]>, source: ImageSourcePropType) => {
    setPosition(dragToPos);
    console.log('Dragging to position:', dragToPos,source);
  };


  return (
    <ViroARScene>
      <ViroNode
        position={position}
        dragType="FixedToWorld"
        onDrag={(pos, src) => onDrag(pos, src)}
        >
        <ViroImage
          scale={[0.3, 0.3, 0.2]}
          source={{ uri: postUrl }}
        />
      </ViroNode>
    </ViroARScene>
  );
};

export default function Product() {
  const route = useRoute<RouteProp<RootStackParamList, 'Product'>>();
  const postUrl = route.params?.data;
  const [step, setStep] = useState(1);

  const nextStep = () => {
    setStep(step + 1);
  };


  return (
    <>
      <ViroARSceneNavigator
        autofocus={true}
        initialScene={{
          scene: () => ImageTexture(postUrl),
        }}
        style={styles.f1}
      />
     {step<=2 && <View style={styles.textContainer}>
        <InstructionBox  step={step} onNext={nextStep} />
      </View>}
    </>
  );
}

const styles = StyleSheet.create({
  f1: { flex: 1 },
  textContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20
  },
});


