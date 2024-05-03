/* eslint-disable prettier/prettier */
export interface Posts {
  // userId: {
  //   userName: string;
  //   userId: string;
  // };
  // postId: string,
  // postUrl: string
  // price: Number,
  // description: string
  trendingArtists : [{
    _id: string,
    fullName: string,
    userId: string,
    profilePictureUrl: string
  }],
  trendingArts : [{
    _id: string,
    postUrl : string,
    price: number,
    user : string,
    postId: number,
    theme: string
  }],
  categoriesPosts: [{
    postUrl : string,
    category: string
  }]
}

export interface UserDetails {
        userName : string
        userId : string
        fullName: string
        followers : string []
        followings : string[]
        role: string
}

export interface UserInfo {
      userName : string
       followings : string []
       followers: string []
       role : string 
       fullName: string
       profilePictureUrl: string
       userId: string
}

export interface UserPosts{
  _id: string,
  postUrl: string
  likes: string []
}
