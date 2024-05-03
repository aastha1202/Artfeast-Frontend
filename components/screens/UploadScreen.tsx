/* eslint-disable prettier/prettier */
import {API_URL, CLOUDINARY_API_KEY, CLOUDINARY_UPLOAD_PRESET} from '@env';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Image, StyleSheet, Text, TextInput, View} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import api from '../../utils/api';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import Icons from 'react-native-vector-icons/AntDesign';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import {useNavigation} from '@react-navigation/native';
import {AFButton, AFInputField} from '../InputField';
import {Picker} from '@react-native-picker/picker';
import { RadioButton } from '../RadioButton';
import { ArtFeastText } from '../ArtFeastText';

interface UploadScreenDataType{
    description: string,
    artworkName: string,
    theme: string,
    condition: string,
    dimensions: {
      height: number,
      width: number,
      depth: number,
    },
    category: string,
    customization: boolean,
    postUrl: string,
    price: number
}

const UploadScreen = () => {
  const [post, setPost] = React.useState<ImagePicker.Asset | null>(null);
  const [postDescription, setPostDescription] = React.useState<UploadScreenDataType>({
    description: '',
    artworkName: '',
    theme: '',
    condition: '',
    dimensions: {
      height: 0,
      width: 0,
      depth: 0,
    },
    category: '',
    customization: false,
    postUrl: '',
    price :0
  });
  const navigation = useNavigation();
  const [isOpen, setIsOpen] = useState(true);
  const [isuploadPhotoDivOpen, setUploadPhotoDivOpen] = useState(false);
  const [isDisable,setDisabled] = useState(true)
  const categories = [
    'Abstract',
    'Oil Painting',
    'Glass Painting',
    'Pastel',
    'Acrylic',
    'Realism',
  ];
  const [loading, setLoading] = useState(false)


  function handleChoosePhoto() {
    ImagePicker.launchImageLibrary({mediaType: 'photo'}, response => {
      if (response && response.assets && response.assets.length > 0) {
        setPost(response.assets[0]);
      }
    });
  }
  async function handleUploadPost() {
    try {
      if (!postDescription.artworkName || !postDescription.category || !postDescription.condition   ){
        Toast.show({
          type:'error',
          text1:'All fields are required to fill'
      })
      return
      }
      setLoading(true)
      const data = new FormData();
      data.append('file', {
        uri: post?.uri,
        type: post?.type,
        name: post?.fileName,
      });
      data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
     await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_API_KEY}/image/upload`,
        data,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          },
        },
      ).then(async (cloudinaryResponse)=> {
        console.log('Upload successful:', cloudinaryResponse.data);
        const postUrl = cloudinaryResponse.data.secure_url;
        setPostDescription(prev => ({...prev, postUrl: postUrl}));
        const dbResponse = await api.post(`${API_URL}/post/upload`, {
          postDescription: {
            ...postDescription,
            postUrl: postUrl, 
          },
        });
  
        console.log('Database update successful:', dbResponse.data);
        setLoading(false)
        Toast.show({
          type: 'success',
          text1: 'Post Uploaded successfully',
        });
        setTimeout(() => {
          navigation.navigate('ProductPage');
        }, 1000);
      }).catch((error) => {
        console.error('Error:', error);
        Toast.show({
          type: 'error',
          text1: 'Error uploading to Cloudinary or updating database',
        });
    })
   } catch (error) {
      console.error('Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        
      });
    }
  }
  useEffect(() => {
    if (
      postDescription.artworkName &&
      postDescription.category &&
      postDescription.condition &&
      postDescription.description &&
      postDescription.dimensions.height &&
      postDescription.dimensions.width &&
      postDescription.dimensions.depth &&
      postDescription.price >= 0
    ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [postDescription]);
  function handleSave() {
    setIsOpen(false)
    setUploadPhotoDivOpen(true)
  }
  return (
    <ScrollView>
      <Toast  />
      {loading && (
  <View style={{ justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size='large' color='#212121' />
  </View>
)}
   {!loading &&   <View style={styles.ParentDiv}>
        <View style={styles.dropdown}>
          <View style={styles.headingDiv}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
              }}>
              <Icons name="gift" size={30} color="black" />
              <ArtFeastText style={{ fontSize: 20,fontFamily:'Inter-Bold'}} text=' Artwork Details'/>
               
            </View>
            <TouchableOpacity onPress={() => setIsOpen(!isOpen)}>
              {!isOpen ? (
                <Icon name="arrow-down" size={20} color="black" />
              ) : (
                <Icon name="arrow-up" size={20} color="black" />
              )}
            </TouchableOpacity>
          </View>
          {isOpen && (
            <View style={styles.options}>
              <AFInputField
                keyboardType="default"
                placeholder="ArtWork Name"
                value={postDescription.artworkName}
                onChangeText={(text: string) =>
                  setPostDescription(prev => ({
                    ...prev,
                    artworkName: text.trim(),
                  }))
                }
              />
              <AFInputField
                keyboardType="default"
                placeholder="Theme"
                value={postDescription.theme}
                onChangeText={(text: string) =>
                  setPostDescription(prev => ({...prev, theme: text.trim()}))
                }
              />
              <AFInputField
                keyboardType="numeric"
                placeholder="Enter price"
                value={postDescription.price>0 ? String(postDescription.price): ''}
                onChangeText={(text: string) =>
                  setPostDescription(prev => ({...prev, price: Number(text)}))
                }
              />
              <AFInputField
                keyboardType="default"
                placeholder="Condition"
                value={postDescription.condition}
                onChangeText={(text: string) =>
                  setPostDescription(prev => ({
                    ...prev,
                    condition: text.trim(),
                  }))
                }
              />
              <View style={{display:'flex',flexDirection:'row',paddingHorizontal:10,paddingVertical:10}}>
              <ArtFeastText style={{fontSize:15, color:'#89939E'}} text='Customization'/>
              <RadioButton checked={postDescription.customization} onPress={()=> setPostDescription(prev =>({ ...prev, customization:true}))}/>
              <ArtFeastText style={{fontSize:15, color:'#89939E'}} text='Yes'/>
              <RadioButton checked={!postDescription.customization} onPress={()=> setPostDescription(prev =>({ ...prev, customization:false}))}/>
              <ArtFeastText style={{fontSize:15, color:'#89939E'}} text="No"/>
              </View>

              <View style={{borderWidth:1,borderColor:categories.includes(postDescription.category)? '#89939E': '#F5F7FA',borderRadius:10,backgroundColor:  categories.includes(postDescription.category)? 'white':'#F5F7FA',paddingLeft:7}}>
              <Picker
                selectedValue={postDescription.category}
                style={{color: categories.includes(postDescription.category)? 'black': '#89939E',}}
                dropdownIconColor="#89939E"
                onValueChange={itemValue =>
                  setPostDescription(prev => ({...prev, category: itemValue}))
                }>
                <Picker.Item label="Select Category" value="" color="#89939E" style={{backgroundColor:'#F5F7FA',color:'#89939E'}} />
                {categories.map(category => (
                  <Picker.Item
                    key={category}
                    label={category}
                    value={category}
                    color="black"
                    style={{backgroundColor:  categories.includes(postDescription.category)? 'white':'#F5F7FA',fontSize:15}}
                  />
                ))}
              </Picker>
              </View>
              <TextInput
                multiline={true}
                placeholder="About Artwork"
                style={[styles.inputStyles, {backgroundColor: postDescription.description.length>0 ? 'white': '#F5F7FA', borderWidth: 1,minWidth:100,borderColor: postDescription.description.length>0? '#89939E': '#F5F7FA',color:'black',borderRadius:10,paddingHorizontal:10,fontSize:15}]}
                placeholderTextColor="#89939E"
                cursorColor='black'
                numberOfLines={5}
                onChangeText={(text: string) =>
                  setPostDescription(prev => ({
                    ...prev,
                    description: text.trim(),
                  }))
                }
              />
              <View style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
              <ArtFeastText style={{fontFamily:''}} text='Dimension'/>
              <ArtFeastText text='inch' style={{backgroundColor:'black', color:'white', paddingHorizontal: 10, paddingVertical:4}}/>
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <AFInputField
                  keyboardType="numeric"
                  placeholder="Height"
                  value={postDescription.dimensions.height>0 ? String(postDescription.dimensions.height): ''}
                  onChangeText={(text: string) =>
                    {setPostDescription(prev => ({
                      ...prev,
                      dimensions: {...prev.dimensions,height: Number(text)},
                    }))
                  }
                  }
                />
                <AFInputField
                  keyboardType="numeric"
                  placeholder="Width"
                  value={postDescription.dimensions.width>0 ? String(postDescription.dimensions.width): ''}
                  onChangeText={(text: string) =>
                    setPostDescription(prev => ({
                      ...prev,
                      dimensions: { ...prev.dimensions,width: Number(text)},
                    }))
                  }
                />
                <AFInputField
                  keyboardType="numeric"
                  placeholder="Depth"
                  value={postDescription.dimensions.depth>0 ? String(postDescription.dimensions.depth): ''}
                  onChangeText={(text: string) =>
                    setPostDescription(prev => ({
                      ...prev,
                      dimensions: {...prev.dimensions,depth: Number(text)},
                    }))
                  }
                />
              </View>
              <AFButton
                fill="black"
                title="Save and Continue"
                disabled= {isDisable}
                onPress={() => handleSave()}
                customStyle={{width: '100%', borderRadius: 100}}
              />
            </View>
          )}
        </View>
        <View style={styles.dropdown}>
          <View style={styles.headingDiv}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
              }}>
              <Icon name="picture" size={20} color="black" />
              <ArtFeastText style={{fontSize: 20, fontFamily:'Inter-Bold'}} text='Upload Photo' />
            </View>
            <TouchableOpacity
              onPress={() => setUploadPhotoDivOpen(!isuploadPhotoDivOpen)}>
              {!isuploadPhotoDivOpen ? (
                <Icon name="arrow-down" size={20} color="black" />
              ) : (
                <Icon name="arrow-up" size={20} color="black" />
              )}
            </TouchableOpacity>
          </View>
          {isuploadPhotoDivOpen && (
            <View style={styles.options}>
              {post ? (
                <>
                  <Image
                    source={{uri: post.uri}}
                    style={{width: '100%', height: 300}}
                  />
                </>
              ) : (
                <>
                  <View style={styles.UploadPhotoDiv}>
                    <TouchableOpacity
                      style={styles.buttonStyles}
                      onPress={handleChoosePhoto}>
                      <ArtFeastText
                        style={{
                          textAlign: 'center',
                          fontSize: 18,
                          color: '#717171',
                        }}
                        text='Add Photo'
                        />
                        </TouchableOpacity>
                  </View>
                </>
              )}
              <AFButton
                fill="black"
                title="Submit"
                onPress={() => handleUploadPost()}
                customStyle={{width: '100%', borderRadius: 100}}
              />
            </View>
          )}
        </View>
      </View>}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  inputStyles: {
    color: 'black',
    textAlignVertical: 'top',
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize:15,
    fontFamily:'Inter, sans-serif'
  },
  ParentDiv: {
    margin: 20,
    flex: 1,
    gap: 20,
    zIndex: -100,
  },
  UploadPhotoDiv: {
    color: 'grey',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    shadowColor: '#89939E',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0,
    // shadowRadius: 1,
    elevation: 8,
    borderRadius: 10,
  },
  dropdown: {
    position: 'relative',
    zIndex: 1,
    // padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: 'white',
  },
  trigger: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  headingDiv: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  options: {
    padding: 20,
    borderRadius: 5,
    backgroundColor: '#fff',
    // maxHeight: 150,
    overflow: 'scroll',
    borderTopWidth: 1,
    gap: 10,
  },
  option: {
    padding: 10,
    // borderRadius: 100,
    // borderBottomColor: '#ccc',
  },
  buttonStyles: {
    backgroundColor: '#F5F7FA',
    //  borderWidth:1,
    borderRadius: 100,
    paddingHorizontal: 40,
    paddingVertical: 10,
    width: '100%',
    color: 'black',
  },
});
export default UploadScreen;
