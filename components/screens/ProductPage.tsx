/* eslint-disable prettier/prettier */
/* eslint-disable quotes */
/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {Image, View, StyleSheet, TouchableOpacity} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
// import * as ImagePicker from 'react-native-image-picker';
import BottomNavigation from '../BottomNavigation';
import {API_URL} from '@env';
import {Posts, UserInfo} from '../../types/ComponentTypes';
import api from '../../utils/api';
import {userDetails} from '../../features/userDetailsSlice';
import {useAppSelector, useAppDispatch} from '../../hooks';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icons from 'react-native-vector-icons/Feather';
import {useIsFocused} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ArtFeastText } from '../ArtFeastText';

interface ProductPageProps {}

const ProductPage: React.FC<ProductPageProps> = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.data as UserInfo | null);
  const [allPosts, setPosts] = React.useState<Posts>();
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchData = async () => {
      const token = await AsyncStorage.getItem('token')
      console.log(token, 'profilePage')
      if (token){
        console.log(API_URL,'api')
        try {
          const response = await api.get(`${API_URL}/post/`);
          console.log('response fromxx home page', response.data.trendingArtists);
          setPosts(response.data);
        } catch (error) {
          if (error instanceof Error)
            console.error('Error fetching data:', error.message);
        }
      }
      // const token = await AsyncStorage.getItem('token');
    };

    fetchData();

    dispatch(userDetails());
    console.log('productpg', user);
  }, [ isFocused]);

  return (
    <View style={{flex: 1}}>
      <ScrollView>
        <View style={styles.container}>
        <View style={styles.flexbox}>
          <Image
            resizeMode="contain"
            style={[styles.image]}
            source={require('../Assets/NewLogo.png')}
          />
          <View style={styles.flex}>
            <Icons name="search" color="black" size={30} />
            <Icon name="heart-o" color="black" size={30} />
          </View>
        </View>

        {/* Top artist */}
        <View>
          <ArtFeastText style={{fontFamily:'Inter-Bold',fontSize: 20,paddingLeft: 20,marginVertical:10}} text='Explore our top Artists'/>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <View style={{display: 'flex', flexDirection: 'row', gap: 20}}>
              {allPosts?.trendingArtists?.map(artist => (
                <View key={artist._id} style={{alignItems: 'center'}}>
                  <TouchableOpacity onPress={()=> navigation.navigate('DynamicProfile', {
                    userId:artist.userId
                  })}>
                  <Image
                    resizeMode="contain"
                    source={{uri: artist.profilePictureUrl}}
                    style={{aspectRatio:1,height:80 ,borderRadius:100}}
                  />
                  </TouchableOpacity>
                  <ArtFeastText style={{color: 'black',fontSize:17}} text={artist.fullName}/>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Trending Arts */}
        <View>
          <ArtFeastText style={{fontFamily:'Inter-Bold', fontSize: 20,paddingLeft:20,marginVertical:10}} text='Trending Arts' />
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
                      width={180}
                      height={180}
                      
                    />
                  </TouchableOpacity>
                  <ArtFeastText style={{fontSize:17}} text={artist.user}/>
                  <ArtFeastText style={{fontSize:17, color:'#89939E', fontStyle:'italic'}} text={artist.theme}/>
                  <ArtFeastText style={{fontFamily:'Inter-SemiBold',fontSize:17}} text={`Rs. ${artist.price}`}/>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Categories */}
        <View>
        <ArtFeastText style={{fontFamily:'Inter-Bold', fontSize: 20,paddingLeft: 20,marginVertical:10}} text='Explore by Category'/>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <View style={{display: 'flex', flexDirection: 'row', gap: 20}}>
            {allPosts?.categoriesPosts?.map((post,index)=>(
                       <View key={index} gap={10}>
                       <TouchableOpacity
                         onPress={() =>
                           navigation.navigate('CategoryPage', {
                             categoryName:post.category ,
                           })
                         }>
                         <Image
                           source={{uri: post.postUrl}}
                           width={180}
                           height={180}
                         />
                       </TouchableOpacity>
                       <ArtFeastText style={{color: 'black',textAlign:'center',fontSize:17}} text={post.category}/>
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
