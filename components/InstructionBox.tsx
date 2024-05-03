/* eslint-disable prettier/prettier */
import { StyleSheet, View } from "react-native"
import { ArtFeastText } from "./ArtFeastText"
import { TouchableOpacity } from "react-native-gesture-handler"

interface InstructionBoxType {
    step: number,
    onNext: ()=> void
}


function InstructionBox({step, onNext}: InstructionBoxType){
    return(
        <View>
        {step === 1 && (
        <View>
          <ArtFeastText style={styles.instructions} text='Point your phone at the wall'/>
          <TouchableOpacity onPress={onNext}>
          <ArtFeastText style={styles.nextButton} text='Next'/>
        </TouchableOpacity>
        </View>
        )}
        {step === 2 && (
            <View>
                <ArtFeastText style={styles.instructions} text='Drag the photo to place it where you want on the wall'/>
                <TouchableOpacity onPress={onNext}>
                <ArtFeastText style={styles.nextButton} text='Dismiss'/>
                </TouchableOpacity>
            </View>
        )}
        </View>
    )
}

const styles = StyleSheet.create({
    instructions: {
      marginTop: 10,
      fontSize: 16,
      textAlign: 'center',
    },
    nextButton: {
      marginTop: 20,
      fontSize: 16,
      color: 'white',
      backgroundColor: '#212121',
      textAlign:'center',
      padding:10,
      borderRadius:2,
    },
  });
  

export default InstructionBox