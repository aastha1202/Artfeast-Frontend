/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
/* eslint-disable semi */
/* eslint-disable quotes */
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import React ,{ useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native"
import { RootStackParamList } from "types/RouteTypes";
import api from '../../utils/api'
import { API_URL } from "@env";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import Icon from 'react-native-vector-icons/FontAwesome'
import Icons from 'react-native-vector-icons/Feather'
import { AFButton, ArtworkDetailsValues } from "../InputField";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { UserInfo } from "types/ComponentTypes";
import { userDetails } from "../../features/userDetailsSlice";
import Comment from "../Comment";
import { ArtFeastText } from "../ArtFeastText";

interface PostDetails {
  postUrl: string,
  description : string,
  price: string,
  userId : {
    userId: string,
    fullName: string,
    profilePictureUrl: string
  }
  likes: string[]
  category: string
  dimensions: {
    height: number,
    width : number,
    depth: number
  },
  condition: string
  customization: boolean
  artworkName: string

} 

const PostDescription = () => {
    const [postDetails, setPostDetails] = useState<PostDetails>({postUrl:'', price: '', description: '' ,likes:[], userId : {userId: '',fullName: '', profilePictureUrl:''},category:'', dimensions: {height:0, width: 0, depth: 0}, condition:'', customization: false, artworkName:''})
    const [postId, setPostId] = useState('')
    const dispatch =  useAppDispatch()
    const user= useAppSelector(state=> state.data as UserInfo | null ) 
    const [followings, setFollowings] = React.useState<string[]>([]) 
    const route = useRoute<RouteProp<RootStackParamList, 'PostDescription'>>();
    const [openComment,setOpenComment] = useState(false)
    const navigation = useNavigation()
    const [isSameArtist, setSameArtist] = useState(false)
    async function fetchPostDetails(){
      console.log(postId)
      console.log(API_URL)
      await api.get(`${API_URL}/post/${postId}`).then((res)=> {
        console.log('response from ',res.data.userId)
         setSameArtist(res.data.userId.userId === user?.userId)
         console.log(isSameArtist)
        setPostDetails(res.data)
      }).catch((err)=> console.log(err))
    }
    useEffect(() => {
      dispatch(userDetails())
      setPostId(route.params?.postId)
      fetchPostDetails()
    }, [route.params?.postId, postId]);
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
        await api.post(`${API_URL}/post/like/${postId}`).then(()=> {
          // setRefetchData(false)
          fetchPostDetails()
        })
      } catch (error) {
        console.log(error);
      }
    }

    async function handleUnlikePost(){
      try {
        console.log('postId', postId)
        await api.post(`${API_URL}/post/unlike/${postId}`).then(()=> {
          // setRefetchData(false)
          fetchPostDetails()
        })
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
                        <Image source={require('../Assets/viewfinder-dot.png')} />
                        <ArtFeastText style={styles.scanText} text="Scan art on your wall"/>
                    </TouchableOpacity>
                </View>
              </View>
              </View>
            
            {/* Like , Comment , Save */}
            <View style={{backgroundColor:'#F5F7FA', display:'flex', flexDirection:'row', justifyContent:'space-between', padding:20}}>
              <View style={{display:'flex', flexDirection:'row', alignItems:'center' , gap:10}}>
              {user && !postDetails?.likes?.includes(user.userId) ? 
              <View style={{alignItems:'center'}}>
              <TouchableOpacity onPress={handleLikePost}>
               <Icon name='heart-o' color='#212121' size={20} />
              </TouchableOpacity>
              </View> : 
              <TouchableOpacity onPress={handleUnlikePost} >
                 <Icon name='heart' color='#212121' size={20} />
                </TouchableOpacity>}
                <ArtFeastText style={styles.TextColor} text='Like'/>
              </View>
              <View style={styles.verticalLine}></View>
           
              <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:10}}>
              <TouchableOpacity onPress={()=> setOpenComment(true)}>
              <Icons name='message-circle' color='#212121' size={20}/>
                </TouchableOpacity>
                <ArtFeastText style={styles.TextColor} text='Comment'/>
              </View>
              <View style={styles.verticalLine}></View>


             <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:10}}>
              <Icon name='heart-o' color='#212121' size={20}/>
                <ArtFeastText style={styles.TextColor} text='Save'/>
              </View>
            </View>


            {/* Artwork Details */}
            {!openComment ? <View style={{gap: 10,padding:20}}> 
            <ArtworkDetailsValues label='Category' value={postDetails.category}/>
            <ArtworkDetailsValues label='Dimension' value={`${postDetails.dimensions?.height}x${postDetails.dimensions?.width}x${postDetails.dimensions?.depth} inch`}/>
            <ArtworkDetailsValues label="Condition" value={postDetails.condition}/>
            <ArtworkDetailsValues label="Customization" value={postDetails.customization ? 'Yes' : 'No'}/>
            <ArtworkDetailsValues label="Artwork Name" value={postDetails.artworkName}/>
            </View> : 
            <Comment postId={postId}/>
            }


            <View style={styles.horizontalLine}></View>

            {/* About the Artwork */}
            <View style={{padding:20, gap:20}}>
              <ArtFeastText style={{color:'#212121', fontFamily:'Inter-Bold', fontSize:20}} text='About the Artwork'/>
              <ArtFeastText style={{color:'#212121', fontSize:17}} text={postDetails.description}/>
              {/* Lorem ipsum dolor sit amet consectetur. Adipiscing in tincidunt sagittis senectus nulla urna. Pretium mi quis eleifend egestas semper sem ac aliquam. Sapien sit pretium suspendisse gravida nibh diam dictum at. Morbi porta velit suscipit urna vestibulum eu id sapien. */}
            </View>

            <View style={styles.horizontalLine}></View>

            {/* About the artist */}
            <View style={{padding:20, gap:20}}>
              <ArtFeastText style={{color:'#212121', fontFamily:'Inter-Bold', fontSize:20}} text='About the Artist'/>
              <View style={{display: 'flex', flexDirection:'row', justifyContent: 'space-between'}}>
              <View style={{display: 'flex', flexDirection:'row', gap: 20, alignItems:'center'}}>
              <Image source={{uri:postDetails?.userId?.profilePictureUrl}} style={{borderRadius:100,width:50,aspectRatio:1}}/>
              
              <View style={{display:'flex'}}>
              <ArtFeastText style={{color:'#212121', fontSize:17}} text={postDetails?.userId?.fullName}/>
              <ArtFeastText style={{color:'#89939E', fontSize:16}} text='Artist'/>
              </View>
              </View>
              {/* Follow button */}
              {!isSameArtist ? 
                !followings.includes(postDetails?.userId?.userId) ? (
                  <TouchableOpacity style={{borderWidth: 1, paddingHorizontal: 20, paddingVertical: 5, borderRadius: 100 , borderColor: '#212121' }} onPress={()=>handleFollow(postDetails.userId.userId)}>
                    <ArtFeastText style={{color:'#212121', fontSize:17}} text='Follow'/>
                  </TouchableOpacity>) : (
                    <TouchableOpacity style={{borderWidth: 1, paddingHorizontal: 20, paddingVertical: 5, borderRadius: 100 , borderColor: '#212121' }} onPress={()=> handleUnFollow(postDetails.userId.userId)}>
                    <ArtFeastText style={{color:'#212121', fontSize:17}} text='Unfollow'/>
                      
                  </TouchableOpacity>
                  )
                  : 
                  <></>
              }
              
              </View>

            </View>

            
            </ScrollView>
            {/* Add to cart */}
            <View style={styles.AddToCartDiv}> 
            <ArtFeastText style={{color:'black', fontFamily:'Inter-Bold', fontSize:30}} text={`Rs. ${postDetails.price}`}/>
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
  verticalLine:{
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
    elevation: 1,
    paddingHorizontal: '5%',
    paddingVertical: '3%',
    borderTopStartRadius: 0.2,
    margin:0,
    width: '100%',
    gap: 10,
  },
  horizontalLine:{
    marginHorizontal:20,
    borderTopWidth:1,
    borderTopColor: '#89939E',
    marginTop:10
  },
  
})
export default PostDescription
