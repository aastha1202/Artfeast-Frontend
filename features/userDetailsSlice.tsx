/* eslint-disable prettier/prettier */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice , createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';


//Action 
export const userDetails = createAsyncThunk('userDetails', async()=>{
    const token= await AsyncStorage.getItem('token')
    console.log('slice',token)
    const response = await axios.get('http://192.168.29.4:3000/userDetails',{
        headers:{
            Authorization:`Bearer ${token}`
        }
    })
    console.log('slice',response.data)
    return response.data
})

 const StoreUserDetails= createSlice({
    name:'userDetails',
    initialState:{
        isLoading:false,
        data:null,
        isError: false
    },
    reducers:{},
    extraReducers: (builder)=>{
        builder.addCase(userDetails.pending,(state)=>{
            state.isLoading= true
        });
        builder.addCase(userDetails.fulfilled,(state,action)=>{
            state.isLoading= false,
            state.data= action.payload
        });
        builder.addCase(userDetails.rejected,(state)=>{
            state.isError= true
        });
    },
    })

export default StoreUserDetails.reducer