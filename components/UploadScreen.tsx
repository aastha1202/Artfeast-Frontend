/* eslint-disable prettier/prettier */
import {API_URL, CLOUDINARY_API_KEY, CLOUDINARY_UPLOAD_PRESET} from '@env';
import axios from 'axios';
import React, {useState} from 'react';
import {Image, StyleSheet, Text, TextInput, View} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import api from '../utils/api';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import Icons from 'react-native-vector-icons/AntDesign';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import {useNavigation} from '@react-navigation/native';
import {AFButton, AFInputField} from './InputField';
import CheckBox from '@react-native-community/checkbox';
import {Picker} from '@react-native-picker/picker';

const UploadScreen = () => {
  const [post, setPost] = React.useState<ImagePicker.Asset | null>(null);
  const [postDescription, setPostDescription] = React.useState({
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
  });
  const navigation = useNavigation();
  const [isOpen, setIsOpen] = useState(false);
  const [isuploadPhotoDivOpen, setUploadPhotoDivOpen] = useState(false);
  const categories = [
    'Abstract',
    'Oil Painting',
    'Glass Painting',
    'Pastel',
    'Acrylic',
    'Realism',
  ];
  const handleSelect = (item: {}) => {
    // onSelect(item);
    console.log(item);
    setIsOpen(false);
  };

  function handleChoosePhoto() {
    ImagePicker.launchImageLibrary({mediaType: 'photo'}, response => {
      if (response && response.assets && response.assets.length > 0) {
        console.log(response);
        setPost(response.assets[0]);
        console.log(post);
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
      const data = new FormData();
      data.append('file', {
        uri: post?.uri,
        type: post?.type,
        name: post?.fileName,
      });
      data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      console.log(CLOUDINARY_API_KEY);
      const cloudinaryResponse = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_API_KEY}/image/upload`,
        data,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      console.log('Upload successful:', cloudinaryResponse);
      const postUrl = cloudinaryResponse.data.secure_url;
      setPostDescription(prev => ({...prev, postUrl: postUrl}));
      // const token = await AsyncStorage.getItem('token');
      // setPostUrl(cloudinaryResponse.secure_url)
      const dbResponse = await api.post(`${API_URL}/post/upload`, {
        postDescription,
      });

      console.log('Database update successful:', dbResponse.data);
      Toast.show({
        type: 'success',
        text1: 'Post Uploaded successfully',
      });
      setTimeout(() => {
        navigation.navigate('ProductPage');
      }, 1000);
    } catch (error) {
      console.error('Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        
      });
    }
  }
  function handleSave() {}
  return (
    <ScrollView>
      <Toast  />
      <View style={styles.ParentDiv}>
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
              <Text style={{color: 'black', fontSize: 20, fontWeight: '600'}}>
                Artwork Details
              </Text>
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
                onChangeText={(text: string) =>
                  setPostDescription(prev => ({...prev, theme: text.trim()}))
                }
              />
              <AFInputField
                keyboardType="numeric"
                placeholder="Enter price"
                onChangeText={(text: string) =>
                  setPostDescription(prev => ({...prev, price: text}))
                }
              />
              {/* <AFInputField
                keyboardType="default"
                placeholder="Category"
                onChangeText={(text: string) =>
                  setPostDescription(prev => ({...prev, category: text.trim()}))
                }
              /> */}
              <AFInputField
                keyboardType="default"
                placeholder="Condition"
                onChangeText={(text: string) =>
                  setPostDescription(prev => ({
                    ...prev,
                    condition: text.trim(),
                  }))
                }
              />
              {/* <Text style={{color: 'black'}}>Customization</Text> */}
              {/* <CheckBox boxType='square' tintColors={{true:'black'}} value={postDescription.customization} onChange={(text: string) =>
                  setPostDescription(prev => ({
                    ...prev,
                    customization: Boolean(text),
                  }))} /> */}
              <AFInputField
                keyboardType="default"
                placeholder="Customization"
                onChangeText={(text: string) =>
                  setPostDescription(prev => ({
                    ...prev,
                    customization: Boolean(text),
                  }))
                }
              />
              <Picker
                selectedValue={postDescription.category}
                style={{color: 'black', backgroundColor: '#F5F7FA'}}
                dropdownIconColor="black"
                onValueChange={itemValue =>
                  setPostDescription(prev => ({...prev, category: itemValue}))
                }>
                <Picker.Item label="Select Category" value="" color="#89939E" style={{backgroundColor: '#F5F7FA'}} />
                {categories.map(category => (
                  <Picker.Item
                    key={category}
                    label={category}
                    value={category}
                    color="black"
                    style={{backgroundColor: '#F5F7FA'}}
                  />
                ))}
              </Picker>
              <TextInput
                multiline={true}
                placeholder="Write about your art"
                style={styles.inputStyles}
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

              <Text style={{color: 'black'}}>Dimension</Text>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <AFInputField
                  keyboardType="numeric"
                  placeholder="Height"
                  onChangeText={(text: string) =>
                    setPostDescription(prev => ({
                      ...prev,
                      dimension: {...prev.dimensions, height: Number(text)},
                    }))
                  }
                />
                <AFInputField
                  keyboardType="numeric"
                  placeholder="Width"
                  onChangeText={(text: string) =>
                    setPostDescription(prev => ({
                      ...prev,
                      dimension: {...prev.dimensions, width: Number(text)},
                    }))
                  }
                />
                <AFInputField
                  keyboardType="numeric"
                  placeholder="Depth"
                  onChangeText={(text: string) =>
                    setPostDescription(prev => ({
                      ...prev,
                      dimension: {...prev.dimensions, depth: Number(text)},
                    }))
                  }
                />
              </View>
              <AFButton
                fill="black"
                title="Save and Continue"
                disabled= {true}
                onPress={() => handleSave}
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
              <Text style={{color: 'black', fontSize: 20, fontWeight: '600'}}>
                Upload Photo
              </Text>
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
                      <Text
                        style={{
                          textAlign: 'center',
                          fontSize: 18,
                          color: '#717171',
                        }}>
                        Add Photo
                      </Text>
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
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  inputStyles: {
    color: 'black',
    backgroundColor: '#F5F7FA',
    // borderWidth: 2,
    borderColor: 'black',
    textAlignVertical: 'top',
    borderRadius: 10,
    paddingHorizontal: 10,
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
