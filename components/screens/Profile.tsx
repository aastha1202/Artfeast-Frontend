/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable prettier/prettier */
import React,{useEffect, useState} from "react";
import { Image, View ,StyleSheet, FlatList, Pressable} from "react-native";
import BottomNavigation from "../BottomNavigation";
import api from '../../utils/api'
import { API_URL, CLOUDINARY_API_KEY, CLOUDINARY_UPLOAD_PRESET } from "@env";
import { UserInfo, UserPosts } from "../../types/ComponentTypes";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { AFButton } from "../InputField";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { userDetails } from "../../features/userDetailsSlice";
import  Icon  from "react-native-vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator } from "react-native";
import { ArtFeastText } from "../ArtFeastText";
import axios from "axios";
import * as ImagePicker from 'react-native-image-picker';
import Toast from "react-native-toast-message";

function Profile(){
    type GridItemProps = {
      item: string
    }
    const[posts,setPosts]= React.useState<string[]>([])
    const navigation = useNavigation()
    const userProfile = useAppSelector(state => state.data as UserInfo | null);
    const [profile,setProfileDetail] = React.useState<UserInfo>({
      userName : '',
      followings : [],
      followers:  [],
      role : '', 
      fullName: '',
      profilePictureUrl: '',
      userId: '',
    })
    const [loading, setLoading] = useState(false)
    const dispatch = useAppDispatch();
    const [profilePhoto, setProfilePhoto] = React.useState<ImagePicker.Asset | null>(null);

    const GridItem : React.FC<GridItemProps> = ({ item }) => (
        <View style={styles.gridItem} >
          <Image source={{ uri: item }} style={styles.image} />
        </View>
      );
      const fetchUserPosts = async ()=>{
          // const token = await AsyncStorage.getItem("token");
          // console.log('userId',savedUserId)
          setLoading(true)
          const response= await api.get(`${API_URL}/post/userPosts`)
          // console.log('res',response.data)
          setLoading(false)
          const postInfo= response.data
          console.log('profile', postInfo)
          const postUrls = postInfo.map((obj:UserPosts)=>(obj.postUrl))

          setPosts(postUrls)
          console.log(postUrls)

      }
      function handleChoosePhoto() {
        ImagePicker.launchImageLibrary({mediaType: 'photo'}, response => {
          if (response && response.assets && response.assets.length > 0) {
            setProfilePhoto(response.assets[0]);
            updateProfilePhoto()
          }
        });
      }
      const updateProfilePhoto = async () => {
        console.log('profile photo',profilePhoto)
        if (!profilePhoto) {
          Toast.show({
            type: 'error',
            text1: 'Please select an image to upload',
          });
          return;
        }
      
        const data = new FormData();
        data.append('file', {
          uri: profilePhoto.uri,
          type: profilePhoto.type,
          name: profilePhoto.fileName,
        });
        console.log(data)
        data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        try {
          setLoading(true);
          console.log(data)
          const cloudinaryResponse = await axios.post(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_API_KEY}/image/upload`,
            data,
            {
              headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
              },
            }
          );

          const profilePhotoUrl = cloudinaryResponse.data.secure_url;
          const dbResponse = await api.put(`${API_URL}/userDetails`, {
            profilePictureUrl: profilePhotoUrl,
          });
      
          console.log('Database update successful:', dbResponse.data);
          // setProfileDetail((prevProfile) => ({
          //   ...prevProfile,
          //   profilePictureUrl: profilePhoto,
          // }));
          dispatch(userDetails())
          setLoading(false);
        } catch (error) {
          console.error('Error:', error);
          setLoading(false);
          Toast.show({
            type: 'error',
            text1: 'Error uploading to Cloudinary or updating database',
          });
        }
      };
      
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
      await api.post(`https://artfeast-backend.onrender.com/userDetails/switchRole`).then((res)=>{
        console.log(res.data.message)
        dispatch(userDetails());
        fetchUserPosts()
      }).catch(err=> {
        console.log(err)
      })
    }
    const handleLogout = async () =>{
      await AsyncStorage.removeItem('token',()=>{
        console.log(AsyncStorage.getItem('token'), 'after deletion')
        navigation.navigate('JoinNow');
      })
    
    }
  
   return(

    <View style={{flex:1, paddingTop:20}} >
      <ScrollView >
        <View style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between',paddingHorizontal: 30,}}>
        <ArtFeastText style={{fontSize:20,fontFamily:"Inter-Bold",marginBottom: 10}} text={profile.userName}/>
        <Pressable onPress={handleLogout} >
         <Icon name="logout" size={30} color='black'/>
         </Pressable>
         </View>
        <View style={{flexDirection:'row',justifyContent:'space-around',alignItems:'center', }}>
        <View style={{}}>
        <TouchableOpacity onPress={handleChoosePhoto}>
        <Image source={{ uri:  profile?.profilePictureUrl}} style={{aspectRatio:1,height:100 ,borderRadius:100}} />
        </TouchableOpacity>
        <ArtFeastText style={{color:'black', alignSelf:'center',fontSize:18, fontWeight:'400'}}  text={profile?.fullName} />

        </View>
        {profile?.role==='artist' &&  <View style={{}}>
                <ArtFeastText style={styles.numberFont} text={String(posts.length)}/>
                <ArtFeastText style={styles.fontColor}  text='Posts'/>
            </View>}
           {profile?.role==='artist' && <View>
                <ArtFeastText style={styles.numberFont} text={String(profile?.followers ? profile?.followers?.length : 0) } />
                <ArtFeastText style={styles.fontColor} text='Followers'/>
            </View>}
            <View>
                <ArtFeastText style={styles.numberFont} text={String(profile?.followings? profile?.followings?.length: 0)} />
                <ArtFeastText style={styles.fontColor} text='Following'/>
            </View>
        </View>

        
        {loading && <ActivityIndicator size='large' color='#212121'/>}
        <View style={{display:'flex', flexDirection:'row',marginBottom:20}}>

          <View style={{flexDirection:'row',flexWrap:'wrap',gap:10, padding:10}}>
        {
              profile?.role==='artist' && posts.length > 0  &&  
              posts.map((post,index) => (
                <View key={index} style={{width:'48%'}}>
                  <Image source={{ uri: post }} style={styles.image} />
                  </View>
                  ))

              
                  //   <FlatList
                  //   key={'#9'}
                  //   data={posts}
                  //   renderItem={({ item }) => <GridItem item={item} />}
                  //   keyExtractor={(item, index) => index.toString()}
                  //   numColumns={3}
                  //   ItemSeparatorComponent={() => <View style={{height: 0, width:0}} />}
                  //   contentContainerStyle={{alignContent:'center',alignSelf:'center'}}
                  // />
                // <Image key={index}  source={{uri:img}} style={{width:100,height:100}} />

        }
        </View>
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
    // flex: 1,
    // flexWrap: "wrap",
    // margin: 5,
    // justifyContent:'center',
  },
  image: {
    width: '100%',
    // height: 200,
    aspectRatio:1,
    // borderRadius: 8,
    // resizeMode: 'contain',
    // backgroundColor:'aliceblue'
  },
  numberFont: {
    fontSize: 18,
    fontWeight: '400',
    textAlign:'center'
  }
})
export default Profile