/* eslint-disable prettier/prettier */
/* eslint-disable quotes */
/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {Image, View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
// import * as ImagePicker from 'react-native-image-picker';
import BottomNavigation from './BottomNavigation';
import {API_URL} from '@env';
import {Posts, UserInfo} from '../types/ComponentTypes';
import api from '../utils/api';
import {userDetails} from '../features/userDetailsSlice';
import {useAppSelector, useAppDispatch} from '../hooks';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icons from 'react-native-vector-icons/EvilIcons';
import {useIsFocused} from '@react-navigation/native';

interface ProductPageProps {}

const ProductPage: React.FC<ProductPageProps> = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.data as UserInfo | null);
  const [allPosts, setPosts] = React.useState<Posts>();
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchData = async () => {
      // const token = await AsyncStorage.getItem('token');
      try {
        const response = await api.get(`${API_URL}/post/`);
        // console.log('response from home page', response.data);
        setPosts(response.data);
      } catch (error) {
        if (error instanceof Error)
          console.error('Error fetching data:', error.message);
      }
    };

    fetchData();

    dispatch(userDetails());
    console.log('productpg', user);
  }, [isFocused]);

  return (
    <View style={{flex: 1}}>
      <ScrollView>
        <View style={styles.container}>
        <View style={styles.flexbox}>
          <Image
            resizeMode="contain"
            style={[styles.image]}
            source={require('./Assets/NewLogo.png')}
          />
          <View style={styles.flex}>
            <Icons name="search" color="black" size={40} />
            <Icon name="heart-o" color="black" size={30} />
          </View>
        </View>

        {/* Top artist */}
        <View>
          <Text style={{fontWeight: '500', color: 'black', fontSize: 20,paddingLeft: 20,marginVertical:10}}>
            Explore our top Artists
          </Text>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <View style={{display: 'flex', flexDirection: 'row', gap: 20}}>
              {allPosts?.trendingArtists?.map(artist => (
                <View key={artist._id} style={{alignItems: 'center'}}>
                  <Image
                    resizeMode="contain"
                    source={require('./Assets/ProflePic.png')}
                  />
                  <Text style={{color: 'black'}}>{artist.fullName}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Trending Arts */}
        <View>
          <Text style={{fontWeight: '500', color: 'black', fontSize: 20,paddingLeft:20,marginVertical:10}}>
            Trending Arts
          </Text>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <View style={{display: 'flex', flexDirection: 'row', gap: 20}}>
              {allPosts?.trendingArts?.map(artist => (
                <View key={artist._id}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('PostDescription', {
                        postId: artist.postId,
                      })
                    }>
                    <Image
                      source={{uri: artist.postUrl}}
                      width={120}
                      height={120}
                    />
                  </TouchableOpacity>
                  <Text style={{color: 'black'}}>{artist.user}</Text>
                  <Text style={{color: 'black', fontWeight: '500'}}>
                    Rs. {artist.price}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Categories */}
        <View>
        <Text style={{fontWeight: '500', color: 'black', fontSize: 20,paddingLeft: 20,marginVertical:10}}>
            Explore by Category
          </Text>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <View style={{display: 'flex', flexDirection: 'row', gap: 20}}>
            {allPosts?.categoriesPosts?.map((post,index)=>(
                       <View key={index}>
                       {/* <TouchableOpacity
                         onPress={() =>
                           navigation.navigate('PostDescription', {
                             postId: artist.postId,
                           })
                         }> */}
                         <Image
                           source={{uri: post.postUrl}}
                           width={120}
                           height={120}
                         />
                       {/* </TouchableOpacity> */}
                       <Text style={{color: 'black'}}>{post.category}</Text>
                     </View>
            ))

            }
            </View>
            </ScrollView>
        </View>
        </View>
      </ScrollView>
      <BottomNavigation />
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 130,
  },
  flexbox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: 20,
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
    // width: '30%',
    color: 'rgba(151, 151, 151, 1)',
  },
  productimageStyles: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'rgba(38, 38, 38, 0.5)',
    width: '100%',
    height: 30,
  },
  container : {
    // paddingLeft:10,
  }
});

export default ProductPage;
