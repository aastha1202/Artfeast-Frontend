/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
/* eslint-disable semi */
/* eslint-disable quotes */
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import React ,{ useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native"
import { RootStackParamList } from "types/RouteTypes";
import api from '../utils/api'
import { API_URL } from "@env";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import Icon from 'react-native-vector-icons/FontAwesome'
import { AFButton } from "./InputField";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppDispatch, useAppSelector } from "../hooks";
import { UserInfo } from "types/ComponentTypes";
import { userDetails } from "../features/userDetailsSlice";

interface PostDetails {
  postUrl: string,
  description : string,
  price: string,
  userId : {
    userId: string,
    fullName: string
  }
  likes: string[]
} 

const PostDescription = () => {
    const [postDetails, setPostDetails] = useState<PostDetails>({postUrl:'', price: '', description: '' ,likes:[], userId : {userId: '',fullName: ''}})
    const [postId, setPostId] = useState('')
    const dispatch =  useAppDispatch()
    const user= useAppSelector(state=> state.data as UserInfo | null ) 
    const [refetchData, setRefetchData] = useState(false)
    const [followings, setFollowings] = React.useState<string[]>([]) 
    const route = useRoute<RouteProp<RootStackParamList, 'PostDescription'>>();
    const navigation = useNavigation()
    useEffect(() => {
      dispatch(userDetails())
      setPostId(route.params?.postId)
      async function fetchPostDetails(){
        console.log(postId)
        await api.get(`${API_URL}/post/${postId}`).then((res)=> {
          console.log('pd',res.data)
          setPostDetails(res.data)
        }).catch((err)=> console.log(err))
      }
      fetchPostDetails()

    }, [route.params?.postId, postId,refetchData]);
    useEffect(() => {
      if (user?.followings) {
        setFollowings(user.followings); 
      }
    }, [user]);
    async function handleAddCart(){
        await api.post(`${API_URL}/cart/add`,{postId, quantity: 1}).then((res)=>
        {
            if (res.status==200){
                console.log(res)
                Toast.show({
                    type:'success',
                    text1:'Product added to cart successfully'
                })
            navigation.navigate('Cart')
        }}
        ).catch((e)=>console.log(e))
    }

    async function handleFollow(ToFollowUserId: string) {
      // const token = await AsyncStorage.getItem('token');
      // console.log(token);
      try {
        await api.post(`${API_URL}/follows/${ToFollowUserId}`);
        setFollowings(prevFollowings => [...prevFollowings, ToFollowUserId]);
        // setFollow(true);
      } catch (error) {
        console.log(error);
      }
    }

    async function handleUnFollow(ToUnFollowUserId: string) {
      const token = await AsyncStorage.getItem('token');
      console.log(token);
      try {
        await api.delete(`${API_URL}/follows/${ToUnFollowUserId}`,);
        setFollowings(prevFollowings => prevFollowings.filter(id=>id !== ToUnFollowUserId))
        // setFollow(false);
      } catch (error) {
        console.log(error);
      }
    }

    async function handleLikePost() {
      try {
        console.log('postId', postId)
        await api.post(`${API_URL}/post/like/${postId}`);
        setRefetchData(true)
      } catch (error) {
        console.log(error);
      }
    }
    return (
        <View style={styles.ParentDiv}>
           <ScrollView>
          {/* Post Image */}
            <View style={{padding:20}}>
            <View style={{position:'relative', width:'100%',}}>
            <Image source={{uri:postDetails.postUrl}}  style={{width:'100%',height:300}} />
            <Icon name='heart-o' color='white' size={30} style={styles.heartStyle}/>
            <View style={styles.overlay}>
                    <TouchableOpacity
                        style={styles.productImageStyles}
                        onPress={() => navigation.navigate('Product', { data: postDetails.postUrl })}>
                        <Image source={require('./Assets/viewfinder-dot.png')} />
                        <Text style={styles.scanText}>Scan art on your wall</Text>
                    </TouchableOpacity>
                </View>
              </View>
              </View>
            
            {/* Like , Comment , Save */}
            <View style={{backgroundColor:'#F5F7FA', display:'flex', flexDirection:'row', justifyContent:'space-between', padding:20}}>
              <View style={{display:'flex', flexDirection:'row', alignItems:'center' , gap:10}}>
              {!postDetails?.likes?.includes(postDetails?.userId?.userId) ? <TouchableOpacity onPress={handleLikePost}>
               <Icon name='heart-o' color='#212121' size={20} />
              </TouchableOpacity> : 
              <TouchableOpacity >
                 <Icon name='heart' color='#212121' size={20} />
                </TouchableOpacity>}
                <Text style={styles.TextColor}>Like</Text>
              </View>
              <View style={styles.horizontalLine}></View>
           
              <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:10}}>
              <Icon name='heart-o' color='#212121' size={20}/>
                <Text style={styles.TextColor}>Comment</Text>
              </View>
              <View style={styles.horizontalLine}></View>


             <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:10}}>
              <Icon name='heart-o' color='#212121' size={20}/>
                <Text style={styles.TextColor}>Save</Text>
              </View>
            </View>

            {/* About the Artwork */}
            <View style={{padding:20, gap:20}}>
              <Text style={{color:'#212121', fontWeight:'600', fontSize:20}}>About the Artwork</Text>
              <Text style={{color:'#212121', fontSize:17}}>{postDetails.description} Lorem ipsum dolor sit amet consectetur. Adipiscing in tincidunt sagittis senectus nulla urna. Pretium mi quis eleifend egestas semper sem ac aliquam. Sapien sit pretium suspendisse gravida nibh diam dictum at. Morbi porta velit suscipit urna vestibulum eu id sapien.</Text>
            </View>

            {/* About the artist */}
            <View style={{padding:20, gap:20}}>
              <Text style={{color:'#212121', fontWeight:'600', fontSize:20}}>About the Artist</Text>
              <View style={{display: 'flex', flexDirection:'row', justifyContent: 'space-between'}}>
              <View style={{display: 'flex', flexDirection:'row', gap: 20, alignItems:'center'}}>
              <Image source={require('./Assets/Oval.png')} />
              <View style={{display:'flex'}}>
              <Text style={{color:'#212121', fontSize:17}}>{postDetails?.userId?.fullName}  </Text>
              <Text style={{color:'#89939E', fontSize:16}}>Artist</Text>
              </View>
              </View>
              {/* Follow button */}
              {!followings.includes(postDetails?.userId?.userId) ? (
              <TouchableOpacity style={{borderWidth: 1, paddingHorizontal: 20, paddingVertical: 5, borderRadius: 100 , borderColor: '#212121' }} onPress={()=>handleFollow(postDetails.userId.userId)}>
                <Text style={{color:'#212121', fontSize:17}}>
                  Follow
                </Text>
              </TouchableOpacity>) : (
                <TouchableOpacity style={{borderWidth: 1, paddingHorizontal: 20, paddingVertical: 5, borderRadius: 100 , borderColor: '#212121' }} onPress={()=> handleUnFollow(postDetails.userId.userId)}>
                <Text style={{color:'#212121', fontSize:17}}>
                  Unfollow
                </Text>
              </TouchableOpacity>
              )}
              </View>

            </View>
            </ScrollView>
            {/* Add to cart */}
            <View style={styles.AddToCartDiv}> 
            <Text style={{color:'black', fontWeight:'600', fontSize:30}}>Rs. {postDetails.price}</Text>
            <View style={{display:'flex', flexDirection:'row', width: '100%',justifyContent:'space-between' }}>
            <AFButton fill="white" title="Add to Cart"  onPress={handleAddCart}/>
            <AFButton fill='black' title="Buy Now"  onPress={handleAddCart}/>
            </View>

            </View>
            <Toast/>
        </View>
    )
}

const styles= StyleSheet.create({
    inputStyles : {
        color: 'black',
        borderWidth: 2,
        borderColor: 'black',
        textAlignVertical: 'top',
        borderRadius: 10,
        padding: 20

    },
    heartStyle:{
      position:'absolute',
      top:10,
      right:10
    },
    ParentDiv:{
      flex: 1,
      // gap: 20,
      backgroundColor:'white',
    },
    ScrollView:{
        // flex: 1,
    },
    description: {
      color: 'black',
      fontWeight:'600'

    },
    overlay: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      backgroundColor: 'rgba(38, 38, 38, 0.5)',
      alignItems: 'center',
  },
  productImageStyles: {
      flexDirection: 'row',
      gap: 15,
      // alignItems: 'center',
      // justifyContent: 'center',
      paddingVertical: 10,
  },
  scanText: {
      fontSize: 16,
      color: 'white',
  },
  horizontalLine:{
    height: '100%',
    borderLeftWidth:1,
    borderLeftColor: '#212121',
  },
  TextColor:{
    color:'#212121',
    fontSize:20
  },
  AddToCartDiv: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopStartRadius: 1,
    width: '100%',
    gap:10,

  }
})
export default PostDescription
