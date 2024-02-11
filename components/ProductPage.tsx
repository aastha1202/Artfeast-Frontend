/* eslint-disable prettier/prettier */
/* eslint-disable quotes */
/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import React, {ErrorInfo, useEffect} from 'react';
import {
  Image,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Button,
} from 'react-native';
import {ScrollView, TextInput} from 'react-native-gesture-handler';
import * as ImagePicker from 'react-native-image-picker';
// import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import BottomNavigation from './BottomNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL,CLOUDINARY_UPLOAD_PRESET,CLOUDINARY_API_KEY} from '@env'
import { Posts } from '../types/ComponentTypes';
import api from '../utils/api'
// import { userDetails } from "../features/userDetailsSlice";
// import { useAppSelector, useAppDispatch } from "../hooks";

interface ProductPageProps {
  // Define props interface here if needed
}


const ProductPage: React.FC<ProductPageProps> = () => {
  const navigation = useNavigation();
  // const dispatch =  useAppDispatch()
  // const user= useAppSelector(state=> state.data)
  const [post, setPost] = React.useState<ImagePicker.Asset | null>(null);
  const [allPosts, setPosts] = React.useState<Posts[]>([]);
  const [follow, setFollow] = React.useState(false);

  function handleChoosePhoto() {
    ImagePicker.launchImageLibrary({mediaType: 'photo'}, response => {
      if (response && response.assets && response.assets.length > 0) {
        console.log(response);
        setPost(response.assets[0]);
        console.log(post);
      }
    });
  }

  // interface ErrorType  {
  //     message: string
  // }
  // let response;
  // useEffect(()=>{
  //  dispatch(userDetails())
  //  console.log('productpg',user)
  // },[])

  useEffect(() => {
    const fetchData = async () => {
      // const token = await AsyncStorage.getItem('token');
      console.log(`${API_URL}/post/posts`)
      try {
        const response = await api.get(`${API_URL}/post/posts`);
        console.log('response of profile', response.data);
        setPosts(response.data);
      } catch (error) {
        if(error instanceof Error)
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData(); 
  }, []);

  async function handleFollow(ToFollowUserId: string) {
    // const token = await AsyncStorage.getItem('token');
    // console.log(token);
    try {
      await api.post(`${API_URL}/follows/${ToFollowUserId}`);
      setFollow(true);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleUnFollow(ToUnFollowUserId: string) {
    const token = await AsyncStorage.getItem('token');
    console.log(token);
    try {
      await api.delete(`${API_URL}/follows/${ToUnFollowUserId}`,);
      setFollow(false);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleUploadPost() {
    try {
      const data = new FormData();
      data.append('file', {
        uri: post?.uri,
        type: post?.type,
        name: post?.fileName,
      });
      data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET); // Replace with your Cloudinary upload preset

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
      console.log('postUrl', postUrl);
      // const token = await AsyncStorage.getItem('token');
      // setPostUrl(cloudinaryResponse.secure_url)
      const dbResponse = await api.post(`${API_URL}/post/upload`,postUrl);

      console.log('Database update successful:', dbResponse.data);
    } catch (error) {
      console.error('Error:', error);
    }

    // .then(response => {
    //   console.log('Database update successful:', response.data);
    // })
    // .catch(error => {
    //   console.error('Error:', error);
    // });
  }

  return (
    <View style={{flex: 1}}>
      <ScrollView>
        <View style={styles.flexbox}>
          <Image style={[styles.image]} source={require('./Assets/Logo.png')} />
          <View style={styles.flex}>
            <Image
              style={{width: 25, height: 27}}
              source={require('./Assets/bell.png')}
            />
            <Image
              style={{width: 25, height: 27}}
              source={require('./Assets/shopping-bag.png')}
            />
          </View>
        </View>

        <View style={{paddingHorizontal: 20}}>
          <Image
            style={[styles.searchImage]}
            source={require('./Assets/Vector.png')}
          />
          <TextInput
            style={[styles.inputStyles]}
            placeholder="Search"
            placeholderTextColor="rgba(151, 151, 151, 1)"></TextInput>
        </View>

        {allPosts?.map((item, index) => (
          <View style={styles.usersPost} key={index}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 20,
                justifyContent: 'space-between',
                paddingBottom: 10,
              }}>
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 12}}>
                <Image source={require('./Assets/Oval.png')} />
                <Text style={{color: 'black'}}>{item?.userId?.userName}</Text>
              </View>
              {!follow ? (
                <TouchableOpacity
                  style={styles.buttonStyles}
                  onPress={() => handleFollow(item.userId?.userId)}>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 16,
                      color: 'rgba(151, 151, 151, 1)',
                    }}>
                    Follow+
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.buttonStyles}
                  onPress={() => handleUnFollow(item.userId?.userId)}>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 16,
                      color: 'rgba(151, 151, 151, 1)',
                    }}>
                    UnFollow
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={{flex: 1, alignItems: 'center'}}>
              <Image
                style={{width: 300, height: 300}}
                source={{uri: item.postUrl}}
              />
              <TouchableOpacity
                style={styles.productimageStyles}
                onPress={() =>
                  navigation.navigate('Product', {data: item.postUrl})
                }>
                <Image
                  style={{position: 'absolute'}}
                  source={require('./Assets/viewfinder-dot.png')}
                />
                <Text
                  style={{
                    position: 'absolute',
                    left: 30,
                    fontSize: 16,
                    color: 'white',
                  }}>
                  Scan on your wall
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{flex: 1, flexDirection: 'row', gap: 10}}>
              <Image
                style={{aspectRatio: 1, width: 40, height: 35}}
                source={require('./Assets/like.png')}
              />
              <Image
                style={{aspectRatio: 1, width: 35, height: 35}}
                source={require('./Assets/Comment.png')}
              />
            </View>
          </View>
        ))}
        <View>
          {post && (
            <>
              <Image
                source={{uri: post.uri}}
                style={{width: 200, height: 200}}
              />
              <Button title="Upload Photo" onPress={handleUploadPost} />
            </>
          )}
          <Button title="Choose Photo" onPress={handleChoosePhoto} />
        </View>
      </ScrollView>
      <BottomNavigation />
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
  },
  flexbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flex: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '70%',
    gap: 12,
  },
  usersPost: {
    paddingTop: 10,
    paddingBottom: 20,
    // width:300
  },
  inputStyles: {
    borderColor: 'rgba(0, 0, 0, 1)',
    backgroundColor: 'rgba(229, 229, 229, 0.3)',
    fontSize: 16,
    height: 40,
    color: 'rgba(151, 151, 151, 1)',
    width: '100%',
    borderRadius: 8,
    padding: 10,
    paddingLeft: 50,
    position: 'relative',
  },
  searchImage: {
    position: 'absolute',
    top: 10,
    left: 35,
  },
  buttonStyles: {
    backgroundColor: 'rgba(229, 229, 229, 0.3)',
    //  borderWidth:1,
    borderRadius: 10,
    padding: 12,
    width: '30%',
    color: 'rgba(151, 151, 151, 1)',
  },
  productimageStyles: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'rgba(38, 38, 38, 0.5)',
    width: '100%',
    height: 30,
  },
});

export default ProductPage;
