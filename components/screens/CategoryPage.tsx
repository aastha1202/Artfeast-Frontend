/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable jsx-quotes */
/* eslint-disable prettier/prettier */
import { API_URL } from "@env"
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios"
import { ArtFeastText } from "../ArtFeastText";
import { useEffect, useState } from "react"
import { ActivityIndicator, Image, Share, StyleSheet, View } from "react-native";
import { RootStackParamList } from "types/RouteTypes";
import api from '../../utils/api'
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import Icon from 'react-native-vector-icons/AntDesign'
import { useAppDispatch, useAppSelector } from "../../hooks";
import { userDetails } from "../../features/userDetailsSlice";
import { UserInfo } from "types/ComponentTypes";
import Icons from 'react-native-vector-icons/Ionicons'
// import Feather from 'react-native-vector-icons/Feather'


interface CategoryPost{
        "dimensions": {
            "height": number,
            "width": number,
            "depth": number
        },
        "_id": string,
        "postId": string,
        "userId": string,
        "postUrl":string,
        "description": string,
        "artworkName": string,
        "theme": string,
        "condition": string,
        "category": string,
        "customization": boolean,
        "price": number,
        "likes": string[],

    
}

function CategoryPage(){
    const route = useRoute<RouteProp<RootStackParamList, 'CategoryPage'>>();
    const [posts , setPosts] = useState<CategoryPost[]>([])
    const [followings, setFollowings] = useState<string[]>([]) 
    const dispatch =  useAppDispatch()
    const user= useAppSelector(state=> state.data as UserInfo | null ) 
    const navigation = useNavigation();


    async function fetchCategoryPosts(){
        const categoryName = route.params.categoryName;
        const apiUrl = `${API_URL}/post/category/${categoryName}`;
        console.log(apiUrl)
        try {
            const res = await api.get(apiUrl);
            setPosts(res.data)
        } catch (err) {
            console.log(err);
        }
    }
    
    useEffect(()=>{
        fetchCategoryPosts()
        dispatch(userDetails())
    },[])

    useEffect(() => {
        if (user?.followings) {
          setFollowings(user.followings); 
        }
      }, [user]);
    async function handleLikePost(postId:string) {
        try {
          await api.post(`${API_URL}/post/like/${postId}`).then(()=> {
            // setRefetchData(false)
            fetchCategoryPosts()
          })
        } catch (error) {
          console.log(error);
        }
      }
  
      async function handleUnlikePost(postId: string){
        try {
          await api.post(`${API_URL}/post/unlike/${postId}`).then(()=> {
            // setRefetchData(false)
            fetchCategoryPosts()
          })
        } catch (error) {
          console.log(error);
        }
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
        try {
          await api.delete(`${API_URL}/follows/${ToUnFollowUserId}`,);
          setFollowings(prevFollowings => prevFollowings.filter(id=>id !== ToUnFollowUserId))
          // setFollow(false);
        } catch (error) {
          console.log(error);
        }
      }
      async function sharePost(postUrl: string) {
        try {
          await Share.share({
            message: `Check out this post! ${postUrl}` ,
            url: postUrl,
          });
        } catch (error) {
          console.error(error);
        }
      };
      
    return(
        <ScrollView contentContainerStyle={styles.container}>
        {posts.length===0 && 
        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
        <ActivityIndicator color='#212121' size='large' />
        </View>
        }
        {posts.map((post) => (
          <View key={post._id} style={styles.item}>
             <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('PostDescription', {
                        postId: post.postId,
                      })
                    }>
            <Image source={{ uri: post.postUrl }} style={styles.image} />
            </TouchableOpacity>
          <ArtFeastText text={post.theme} style={{fontSize:17}} />
            <ArtFeastText text={`Rs. ${post.price}`}  style={{fontFamily:'Inter-SemiBold',fontSize:17}}/>
            <View  style={{display:'flex', flexDirection:'row', alignContent:'center',gap:10}}>
            {user && !post?.likes?.includes(user?.userId) ? 
              <View>
              <TouchableOpacity onPress={()=> handleLikePost(post.postId)}>
               <Icon name='like2' color='#212121' size={30} />
              </TouchableOpacity>
              </View> : 
              <TouchableOpacity onPress={()=>handleUnlikePost(post.postId)}>
                 <Icon name='like1' color='#212121' size={30} />
                </TouchableOpacity>}
            {
                !followings.includes(post?.userId) ? (
                  <TouchableOpacity onPress={()=>handleFollow(post.userId)}>
                    <Icons name='person-add-outline' size={30} color='#212121' />

                  </TouchableOpacity>) : (
                    <TouchableOpacity  onPress={()=> handleUnFollow(post.userId)}>
                    <Icons name='person-add' size={30} color='#212121'/>

                  </TouchableOpacity>
                  )
              }
              <TouchableOpacity onPress={()=> sharePost(post.postUrl)}>
              <Icons name="share-social-outline"  size={30} color='#212121'/>
              </TouchableOpacity>
              </View>
          </View>
        ))}
        
      </ScrollView>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      paddingHorizontal: 10,
      paddingVertical: 20
    },
    item: {
      width: "48%",
      marginBottom: 10,
    },
    image: {
      width: "100%",
      aspectRatio: 1, 
      // borderRadius: 10,
    },
  });
  
  export default CategoryPage;