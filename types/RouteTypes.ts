/* eslint-disable prettier/prettier */
export type RootStackParamList = {
  Product: {data: string},
  UserType : {userId : string},
  PostDescription : {
    postUrl : string,
    description: string,
    price: number
    postId: string
  },
  DynamicProfile : {
    userId: string
  },
  CategoryPage: {
    categoryName: string
  }
};
