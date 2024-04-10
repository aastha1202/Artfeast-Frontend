/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable prettier/prettier */
import React,{useEffect} from "react";
import { Image, View,Text ,StyleSheet, FlatList} from "react-native";
import BottomNavigation from "./BottomNavigation";
import api from '../utils/api'
import { API_URL } from "@env";
import { Posts, UserInfo, UserPosts } from "../types/ComponentTypes";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { AFButton } from "./InputField";
import Sidebar from "./Sidebar";
import { useAppDispatch, useAppSelector } from "../hooks";
import { userDetails } from "../features/userDetailsSlice";

function Profile(){
    type GridItemProps = {
      item: string
    }
    const[posts,setPosts]= React.useState<string[]>([])
    const navigation = useNavigation()
    const userProfile = useAppSelector(state => state.data as UserInfo | null);
    const [profile,setProfileDetail] = React.useState<UserInfo>()
    const dispatch = useAppDispatch();
    const GridItem : React.FC<GridItemProps> = ({ item }) => (
        <View style={styles.gridItem} >
          <Image source={{ uri: item }} style={styles.image} />
        </View>
      );
      const fetchUserPosts = async ()=>{
          // const token = await AsyncStorage.getItem("token");
          // console.log('userId',savedUserId)
          const response= await api.get(`${API_URL}/post/userPosts`)
          // console.log('res',response.data)
          const postInfo= response.data
        const postUrls = postInfo.map((obj:UserPosts)=>(obj.postUrl))
          setPosts(postUrls)
          console.log(postUrls)

      }
    useEffect(() => {
      dispatch(userDetails())
        fetchUserPosts()

    }, [])
    useEffect(() => {
      if (userProfile) {
        console.log(userProfile,'profile')
        setProfileDetail(userProfile); 
      }
    }, [userProfile]);

    async function handleSwitchRole(){
      await api.post(`${API_URL}/userDetails/switchRole`).then((res)=>{
        console.log(res.data.message)
        dispatch(userDetails());
        fetchUserPosts()
      }).catch(err=> {
        console.log(err)
      })
    }
    
   return(

    <View style={{flex:1, paddingTop:20}} >
      <ScrollView>
        <Text style={{color:'black',fontSize:20,fontWeight:"700",paddingLeft: 30,marginBottom: 10}}>{profile?.userName}</Text>
        <Sidebar/>
        <View style={{flexDirection:'row',justifyContent:'space-around',alignItems:'center', }}>
        <View style={{}}>
        <Image source= {require('./Assets/ProflePic.png')} style={{aspectRatio:1,height:100 }} />
        <Text style={{color:'black', alignSelf:'center',fontSize:18, fontWeight:'400'}}  >{profile?.fullName}</Text>

        </View>
        {profile?.role==='artist' &&  <View style={{}}>
                <Text style={[styles.fontColor, styles.numberFont]}  >{posts.length}</Text>
                <Text style={styles.fontColor}   >Posts</Text>
            </View>}
           {profile?.role==='artist' && <View>
                <Text style={[styles.fontColor,styles.numberFont]}  >{profile?.followers ? profile?.followers?.length : 0 }</Text>
                <Text style={styles.fontColor}  >Followers</Text>
            </View>}
            <View>
                <Text style={[styles.fontColor,styles.numberFont]}  >{profile?.followings? profile?.followings?.length: 0}</Text>
                <Text style={styles.fontColor}  >Following</Text>
            </View>
        </View>
        {/* <Text style={{color:'black',paddingBottom:40, paddingLeft: 40}}  >{user?.userName}</Text> */}

        <View>
        
        <SafeAreaView style={{}}>
        
        {
              profile?.role==='artist' && posts.length > 0  &&  
                    <FlatList
                    // key={'#'}
                    data={posts}
                    renderItem={({ item }) => <GridItem item={item} />}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={2}
                  />
                // <Image key={index}  source={{uri:img}} style={{width:100,height:100}} />

        }
        </SafeAreaView>
        </View>
        { profile?.role==='artist' ? <AFButton fill="black" title="Add new posts" onPress={()=> navigation.navigate('UploadScreen')} customStyle={{width:'90%', alignSelf:'center', borderRadius:100, marginBottom: 20}} /> :
        <AFButton fill="black" title="Switch to Artist" onPress={()=> handleSwitchRole()} customStyle={{width:'90%', alignSelf:'center', borderRadius:100, marginBottom: 20}} />}
        </ScrollView>
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
    flex: 1,
    // flexWrap: "wrap",
    margin: 5,
  },
  image: {
    width: 200,
    height: 200,
    // borderRadius: 8,
    resizeMode: 'contain',
    backgroundColor:'aliceblue'
  },
  numberFont: {
    fontSize: 18,
    fontWeight: '400',
  }
})
export default Profile