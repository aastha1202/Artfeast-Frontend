/* eslint-disable prettier/prettier */
import { API_URL } from '@env'
import { ArtFeastText } from '../ArtFeastText'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Image, View } from 'react-native'
import api from '../../utils/api'
import { ScrollView } from 'react-native-gesture-handler'

interface OrderType {
    _id: string;
    userId: {
      fullName: string
    };
    items: {
      postId: {
        _id: string;
        postUrl: string;
        artworkName: string
        theme: string

      };
      quantity: number;
      _id: string;
    }[];
    paymentStatus: string;
    createdAt: string;
    __v: number;
  }[];

const ArtistOrder = () => {
    const [orders, setOrders] = useState<OrderType[]>([])
    async function fetchOrders(){
      console.log(API_URL)
        await api.get(`${API_URL}/order/artists`).then((res)=> {
            console.log(res.data)
            setOrders(res.data)
        }).catch((err)=> console.log(err))
    }
    useEffect(()=>{
        fetchOrders()
    },[])

  return (
    <ScrollView>
      {orders.length === 0 && <ActivityIndicator size="large" color="black" />}
          {orders.map((order) => (
        <View key={order._id} style={{ padding: 20, backgroundColor: 'white' ,margin: 20}}>
          {order.items.map((item) => (
            <View key={item._id} style={{ flexDirection: 'row', marginBottom: 20 }}>
              <Image source={{ uri: item.postId.postUrl }} style={{ width: 100, height: 100, marginRight: 10 }} />
              <View style={{ flex: 1 }}>
                <ArtFeastText text={`Artwork Name: ${item.postId.artworkName}`}  style={{fontSize:17}}/>
                <ArtFeastText text={`Theme: ${item.postId.theme}`}  style={{fontSize:17}}/>

                {/* <Text>Dimensions: {item.postId.dimensions.height}x{item.postId.dimensions.width}x{item.postId.dimensions.depth} cm</Text> */}
                {/* <ArtFeastText text={`Quantity: ${item.postId}`}/> */}
                {/* Add more order details as needed */}
              </View>
            </View>
          ))}
          <ArtFeastText text={`Payment Status: Success`} style={{fontSize:17}}/>
          <ArtFeastText text={`Ordered By: ${order.userId.fullName}`}  style={{fontSize:17}} />

        </View>
      ))}
    </ScrollView>
  )
}

export default ArtistOrder