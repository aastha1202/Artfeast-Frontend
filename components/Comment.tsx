/* eslint-disable prettier/prettier */
import { API_URL } from "@env";
import { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import api from '../utils/api'
import { ArtFeastText } from "./ArtFeastText";
import  Icon  from "react-native-vector-icons/Feather";

interface CommentProp {
    postId: string
}
interface CommentType{
        userId: {
            userId: string,
            fullName: string,
            userName: string,
            profilePictureUrl: string
        },
        text: string,
}


export default function Comment(props: CommentProp){
    const [comment, setComment] = useState('')
    const [allComment, setAllComments] = useState<CommentType[]>([])
    async function fetchComments(){
        await api.get(`${API_URL}/post/comment/${props.postId}`).then((res)=> {
            console.log(res.data,'comment')
            setAllComments(res.data.comments)
        }).catch(err=> console.log(err))
    }
    useEffect( ()=> {
        fetchComments()
    },[])
    async function handleAddComment(){
        console.log(API_URL)
        await api.post(`${API_URL}/post/comment/${props.postId}`,{comment}).then((res)=> {
            console.log(res.data,'post comment')
            fetchComments()
            setComment('')
        }).catch(err=> console.log(err))
    }
    return(
        <View style={{paddingHorizontal:15}}>
            <TextInput placeholder="Add a comment"  style={{fontSize:17, color:'black', fontFamily:'Inter'}} placeholderTextColor='#89939E' cursorColor='#212121' value={comment} onChangeText={(comment)=> setComment(comment)} onSubmitEditing={()=> handleAddComment()}/>
            <View style={{gap:10}}>
            {allComment?.map((comment)=> (
                <View style={{alignItems:'flex-start',gap:7}}>
                <View style={{display:'flex',flexDirection:'row', alignItems:'center',gap: 10}}>
                <Image source={{uri: comment.userId.profilePictureUrl}} width={30} height={30} style={{borderRadius:100}}/>
                <ArtFeastText style={{color:'#89939E', fontSize:  17,fontFamily:'Inter-Medium'}} text={comment.userId.fullName}/>
                </View>
                <ArtFeastText style={{ fontSize:  17}} text={comment.text}/>
                </View>
            ))}
            </View>
            <TouchableOpacity style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center',gap:10}}>
                <ArtFeastText  style={{ fontSize:  17, textAlign:'center', color:'#000000'}} text={'View all Comments'}/>
                <Icon name='arrow-right' size={30} color='#212121'/>

            </TouchableOpacity>
        </View>
    )
}

