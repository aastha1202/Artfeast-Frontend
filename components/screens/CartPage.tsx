/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import { API_URL } from '@env'
import api from '../../utils/api'
import { useEffect, useState } from 'react'
import React, { Alert, Image, StyleSheet, Text, Touchable, View } from 'react-native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/FontAwesome'
import Icons from 'react-native-vector-icons/MaterialIcons'
import { Button } from 'react-native'
import RazorpayCheckout from 'react-native-razorpay';
import { AFButton } from '../InputField'
import { ArtFeastText } from '../ArtFeastText'
import Toast from 'react-native-toast-message'
import { useNavigation } from '@react-navigation/native'

interface cartItems {
    postId:{
        postId:string,
        price: string,
        postUrl:string,
        theme: string,
        artworkName: string,
        dimensions: {
          height: number
          width: number
          depth: number
        }
        userId: {
          fullName: string
      },
    },
    quantity : string
}


function CartPage(){
    const [cartItems, setCartItem] = useState<cartItems[]>([])
    const [totalPrice, setTotalPrice] = useState(0)
    const navigation = useNavigation()
    async function fetchCart(){
      console.log(API_URL)
        await api.get(`${API_URL}/cart/`).then((res)=> {
            console.log('from cart page', res.data)
            setCartItem(res.data.items)
            setFetchCart(false)
        }).catch((err)=> console.log(err))
    }
    useEffect(()=>{
        fetchCart()
    },[])

    
    useEffect(() => {
      let total = 0
      cartItems?.forEach(item => {
        total += parseInt(item.postId.price) * parseInt(item.quantity)
      })
      setTotalPrice(total)
    }, [cartItems])

   async function handleRemoveItem(postId:String){
        await api.delete(`${API_URL}/cart/${postId}`).then((res)=> {
            console.log(res.data)
            fetchCart()
        }).catch((err)=> console.log(err))   
    }
    let options = {
        description: 'Online Fee',
        image: '',
        currency: 'INR',
        amount: `${totalPrice}00`,
        key: 'rzp_test_97rtsy35cFClby',  //env
        name: 'ArtFeast',
        prefill: {
          email: 'test@email.com',
          contact: '9191919191',
          name: 'ReactNativeForYou',
        },
        theme: {color: '#212121'},
      };

      function handlePayment(): void{
        RazorpayCheckout.open(options) 
        .then((data) => {
          // handle success
          // Alert.alert(`Success: ${data.razorpay_payment_id}`;
          console.log(data)
          Toast.show({
            type:'success',
            text1:'Order Placed'
          })
          api.post(`${API_URL}/order/add`).then((res)=> {
            console.log('after payment',res.data)
            fetchCart()

          }).catch((err)=>{
            console.log(err)
          })
        })
        .catch((error) => {
          // handle failure
          Alert.alert(`Error: ${error.code} | ${error.description}`);
        });
      }
    return(
       <View style={{flex:1}}>
       {cartItems.length>0 ? <View style={{flex:1,justifyContent:'space-between', }} >
        <ScrollView>
        <View style={{flex:1,gap:20, marginBottom:20}} >
       {cartItems?.map((item)=>(
        <View style={{backgroundColor: 'white',padding:20, }}>
        <View style={{flex:1,flexDirection: 'row', gap: 20,justifyContent: 'space-between'}}>
        <View style={{flex:1,flexDirection:'row',gap:20}}>
        <Image source={{uri:item.postId.postUrl}}  style={{height: 120, aspectRatio:1}} />
        <View style={{flex:1,gap:5}}>
        <ArtFeastText style={{color:'black', marginTop:10, fontSize: 15}} text={item.postId.userId.fullName}/>
        <ArtFeastText style={{color:'black', fontSize: 15}} text={item.postId.artworkName}/>
        <ArtFeastText style={{color:'#89939E', fontSize: 15, fontStyle:'italic'}}text={item.postId.theme} />
        <ArtFeastText style={{color:'black', fontSize: 15}} text={`${item.postId.dimensions.height}x${item.postId.dimensions.width}x${item.postId.dimensions.depth} cm`}/>

        {/* <Text style={{color:'black', marginTop:10, fontSize: 15}}>{item.quantity} */}
        </View>

        <View style={{alignItems:'center'}}>
        <TouchableOpacity onPress={()=>handleRemoveItem(item.postId.postId)}  >
          <Icons name='delete-outline' color='#89939E' size={30} />
        </TouchableOpacity>
        </View>
    
        </View>
        </View>
        <View style={styles.horizontalLine}></View>

        <View style={{display:'flex', flexDirection:'row', justifyContent:'space-between',alignItems:'center',marginTop: 10}}>
        <View style={styles.quantityContainer}>
        <ArtFeastText style={{color:'#89939E', textAlign:'center'}} text={`Qty: ${item.quantity}`}/>
        </View>
        <ArtFeastText style={{color:'black', fontSize: 15,alignSelf:'flex-end'}} text={`Rs. ${item.postId.price}`}/>
        </View>

        </View>
       ))
       }
       </View>
       </ScrollView>
       <View style={{display:'flex',flexDirection:'row', justifyContent:'space-between', padding: 20, backgroundColor:'white'}}> 
       <ArtFeastText style={{color:'black', fontWeight: '700', fontSize:25, }}  text={`Total : ${totalPrice}`}/>
       <AFButton fill='black'  title='Proceed' onPress={handlePayment} />
       </View>
       </View> : 
       (<View style={{flex:1,justifyContent:'center',alignSelf:'center'}}>
        <ArtFeastText text='No Item in Cart' style={{textAlign:'center',fontWeight: '700'}}/>
        <View>
        <TouchableOpacity onPress={()=>navigation.navigate('ProductPage')}>
          <ArtFeastText text='Browse Arts'   style={{textAlign:'center'}}/>
        </TouchableOpacity>
        </View>

        </View>

       )}

       <Toast/>
       </View> 
    )
}

const styles = StyleSheet.create({
  horizontalLine:{
    width: '100%',
    borderTopWidth:2,
    borderTopColor: '#F5F5F5',
    marginTop:10
  },
  quantityContainer:{
    borderWidth: 1,
    borderColor:'#89939E',
    width: 80,
    borderRadius: 5

  }
})

export default CartPage