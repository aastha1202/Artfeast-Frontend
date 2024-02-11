/* eslint-disable prettier/prettier */
import React,{useEffect} from "react";
import { Image, View,Text ,StyleSheet, FlatList} from "react-native";
import BottomNavigation from "./BottomNavigation";
import api from '../utils/api'
import { API_URL } from "@env";
import { Posts, UserDetails } from "../types/ComponentTypes";
function Profile(){
    type GridItemProps = {
      item: string
    }
    const[posts,setPosts]= React.useState<string[]>([])
    const [user, setUserDetails]= React.useState<UserDetails>()
    const GridItem : React.FC<GridItemProps> = ({ item }) => (
        <View style={styles.gridItem}>
          <Image source={{ uri: item }} style={styles.image} />
        </View>
      );
    useEffect(() => {

        const fetchUserPosts = async ()=>{
            // const token = await AsyncStorage.getItem("token");
            // console.log('userId',savedUserId)
            const response= await api.get(`${API_URL}/post/userPosts`)
            // console.log('res',response.data)
            const postInfo= response.data
            console.log('res',postInfo[0].userId)
            setUserDetails(postInfo[0].userId)
            const postUrls = postInfo.map((obj:Posts)=>(obj.postUrl))
            setPosts(postUrls)
            console.log(postUrls)

        }
        fetchUserPosts()
    }, [])
    
   return(

    <View style={{flex:1}} >
        <View >
        <Image source={require('./Assets/Profile.png')} style={{width:'100%',height:300,resizeMode:'cover'}} />
        <Image source= {require('./Assets/ProflePic.png')} style={{position:'absolute',bottom:-50,resizeMode:'cover',alignSelf:'center'}} />
        <Image source={require('./Assets/edit.png')} style={{position:'absolute',bottom:-50,left:250}} />
        </View>
        <Text style={{color:'black',textAlign:'center', paddingTop:70,paddingBottom:40}}  >{user?.userName}</Text>
        <View style={{flexDirection:'row',justifyContent:'space-around'}}>
            <View style={{}}>
                <Text style={styles.fontColor}  >{posts.length}</Text>
                <Text style={styles.fontColor}   >Posts</Text>
            </View>
            <View>
                <Text style={styles.fontColor}  >{user?.followers ? user?.followers?.length : 0 }</Text>
                <Text style={styles.fontColor}  >Followers</Text>
            </View>
            <View>
                <Text style={styles.fontColor}  >{user?.followings? user?.followings?.length: 0}</Text>
                <Text style={styles.fontColor}  >Following</Text>
            </View>
        </View>
        {
              posts.length > 0  &&  
                    <FlatList
                    data={posts}
                    renderItem={({ item }) => <GridItem item={item} />}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={3} // Set the number of columns you want in your grid
                  />
                // <Image key={index}  source={{uri:img}} style={{width:100,height:100}} />

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
    flex: 1,
    margin: 5,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 8,
    resizeMode: 'cover',
  },
})
export default Profile