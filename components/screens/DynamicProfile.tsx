/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable prettier/prettier */
import React,{useEffect} from "react";
import { Image, View,Text ,StyleSheet, FlatList} from "react-native";
import BottomNavigation from "../BottomNavigation";
import api from '../../utils/api'
import { API_URL } from "@env";
import { UserInfo, UserPosts } from "../../types/ComponentTypes";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "types/RouteTypes";
import { AFButton } from "../InputField";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { userDetails } from "../../features/userDetailsSlice";

function DynamicProfile(){
    type GridItemProps = {
      item: string,
      postId: string
    }
    type PostType = {
        postUrl : string,
        postId: string
    }
    const[posts,setPosts]= React.useState<PostType[]>([])
    const navigation = useNavigation()
    const [profile,setProfileDetail] = React.useState<UserInfo>()
    const route = useRoute<RouteProp<RootStackParamList, 'DynamicProfile'>>();
    const [userId, setUserId] = React.useState('')
    const dispatch =  useAppDispatch()
    const user= useAppSelector(state=> state.data as UserInfo | null ) 
    const [followings, setFollowings] = React.useState<string[]>([]) 
    const [isSameArtist, setSameArtist] = React.useState(false)
    let postUrls = React.useRef()
    const GridItem : React.FC<GridItemProps> = ({ item ,postId}) => (
        <View style={styles.gridItem} >
         <TouchableOpacity  onPress={() =>
                      navigation.navigate('PostDescription', {
                        postId: postId,
                      })} >
          <Image source={{ uri: item }} style={styles.image} />
          </TouchableOpacity>
        </View>
      );
    useEffect(()=> {
        setUserId(route?.params?.userId)
        dispatch(userDetails())
    },[route?.params?.userId])
    useEffect(() => {
      if (user?.followings) {
        setFollowings(user.followings); 
      }
    }, [user]);
    useEffect(() => {
        
        // fetchUserPosts()
        async function fetchUserPosts(){
            console.log(userId)
            console.log(API_URL)
            await api.get(`${API_URL}/userDetails/${userId}`).then((res)=> {
                const {user, postsOfUser}= res.data
          console.log(user, postsOfUser)
          setProfileDetail(user)
          postUrls.current = postsOfUser.map((obj:UserPosts)=>(obj.postUrl))
          checkSameArtist(user.userId)
          setPosts(postsOfUser)
        //   console.log(postUrls)
            }).catch((err)=> console.log(err))
          }

          fetchUserPosts()
    }, [route?.params?.userId,userId])

    function checkSameArtist(loggedInuserId: string){
      setSameArtist(loggedInuserId===user?.userId)
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

   return(

    <View style={{flex:1, paddingTop:20}} >
      <View>
        <Text style={{color:'black',fontSize:20,fontWeight:"700",paddingLeft: 30,marginBottom: 10}}>{profile?.userName}</Text>
        <View style={{flexDirection:'row',justifyContent:'space-around',alignItems:'center', }}>
        <View style={{}}>
        <Image
                    resizeMode="contain"
                    source={{uri: profile?.profilePictureUrl}}
                    style={{aspectRatio:1,height:100 ,borderRadius:100}}
                  />
        <Text style={{color:'black', alignSelf:'center',fontSize:18, fontWeight:'400'}}  >{profile?.fullName}</Text>

        </View>
         <View style={{}}>
                <Text style={[styles.fontColor, styles.numberFont]}  >{posts?.length}</Text>
                <Text style={styles.fontColor}   >Posts</Text>
            </View>
           <View>
                <Text style={[styles.fontColor,styles.numberFont]}  >{profile?.followers ? profile?.followers?.length : 0 }</Text>
                <Text style={styles.fontColor}  >Followers</Text>
            </View>
            <View>
                <Text style={[styles.fontColor,styles.numberFont]}  >{profile?.followings? profile?.followings?.length: 0}</Text>
                <Text style={styles.fontColor}  >Following</Text>
            </View>
        </View>
        </View>

        { !isSameArtist ? !followings.includes(userId) ? (
        <View>
        <AFButton fill="black" title="Follow" customStyle={{width: '92%',marginHorizontal:15,marginTop:20,borderRadius: 10,paddingVertical:8}} onPress={()=> handleFollow(userId)}/>
        </View>):
        <AFButton fill="black" title="UnFollow" customStyle={{width: '92%',marginHorizontal:15,marginTop:20,borderRadius: 10,paddingVertical:8}} onPress={()=> handleUnFollow(userId)}/>:<></>}
        <View style={{display:'flex', flexDirection:'row',marginVertical:20}}>
        {
            posts  &&  
                    <FlatList
                    key={'#'}
                    data={posts}
                    renderItem={({ item }) => <GridItem item={item.postUrl} postId={item.postId}/>}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={2}
                    // contentContainerStyle={{alignSelf:'center'}}

                  />

        }
        </View>
        {posts  && <ScrollView></ScrollView>

        }
        <BottomNavigation/>
    </View>
   )
}

const styles= StyleSheet.create({
   fontColor:{
    color:'black',
    textAlign:'center'
   },
   gridItem: {
    // flex: 1,
    // flexWrap: "wrap",
    // margin: 5,
  },
  image: {
    width: 180,
    height: 200,
    // borderRadius: 8,
    resizeMode:'contain',
    // backgroundColor:'aliceblue'
  },
  numberFont: {
    fontSize: 18,
    fontWeight: '400',
  }
})
export default DynamicProfile