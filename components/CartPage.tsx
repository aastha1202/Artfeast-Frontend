/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import { API_URL } from '@env'
import api from '../utils/api'
import { useEffect, useState } from 'react'
import React, { Alert, Image, StyleSheet, Text, Touchable, View } from 'react-native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/FontAwesome'
import Icons from 'react-native-vector-icons/MaterialIcons'
import { Button } from 'react-native'
import RazorpayCheckout from 'react-native-razorpay';
import { AFButton } from './InputField'

interface cartItems {
    postId:{
        postId:String,
        price: String,
        postUrl:String,
        description:String,
        userId: {
          fullName: String
      },
    },
    quantity : String
}


function CartPage(){
    const [cartItems, setCartItem] = useState<cartItems[]>([])
    const [fetchCart, setFetchCart] = useState(false)
    const [totalPrice, setTotalPrice] = useState(0)

    useEffect(()=>{
        async function fetchCart(){
            await api.get(`${API_URL}/cart/`).then((res)=> {
                console.log('from cart page', res.data)
                setCartItem(res.data.items)
                setFetchCart(false)
            }).catch((err)=> console.log(err))
        }
        fetchCart()
    },[fetchCart])

    
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
            setFetchCart(true)
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
          Alert.alert(`Success: ${data.razorpay_payment_id}`);
          api.post(`${API_URL}/order/add`).then((res)=> {
            console.log(res.data)
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
        <View style={{flex:1,justifyContent:'space-between', }} >
        <ScrollView>
        <View style={{flex:1,gap:20, marginBottom:20}} >
       {cartItems?.map((item)=>(
        <View style={{backgroundColor: 'white',padding:20, }}>
        <View style={{flex:1,flexDirection: 'row', gap: 20, alignItems:'start',justifyContent: 'space-between'}}>
        <View style={{flex:1,flexDirection:'row',gap:20}}>
        <Image source={{uri:item.postId.postUrl}}  style={{height: 120, aspectRatio:1}} />
        <View style={{flex:1,gap:20}}>
        <Text style={{color:'black', marginTop:10, fontSize: 15}}>{item.postId.userId.fullName}</Text>
        <Text style={{color:'black', fontSize: 15}}>{item.postId.description}</Text>
        {/* <Text style={{color:'black', marginTop:10, fontSize: 15}}>{item.quantity}</Text> */}
        </View>
        <TouchableOpacity onPress={()=>handleRemoveItem(item.postId.postId)} style={{height:50}}>
          <Icons name='delete-outline' color='#89939E' size={30} />
        </TouchableOpacity>
    
        </View>
        </View>
        <View style={styles.horizontalLine}></View>

        <View style={{display:'flex', flexDirection:'row', justifyContent:'space-between',alignItems:'center',marginTop: 10}}>
        <View style={styles.quantityContainer}>
        <Text style={{color:'#89939E', textAlign:'center'}}>Qty: {item.quantity}</Text>
        </View>
        <Text style={{color:'black', fontSize: 15,alignSelf:'flex-end'}}>Rs. {item.postId.price}</Text>
        </View>

        </View>
       ))}
       </View>
       </ScrollView>
       <View style={{display:'flex',flexDirection:'row', justifyContent:'space-between', padding: 20, backgroundColor:'white'}}> 
       <Text style={{color:'black', fontWeight: '700', fontSize:25, }}>Total : {totalPrice}</Text>
       <AFButton fill='black'  title='Proceed' onPress={handlePayment} />
       </View>
       </View>
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