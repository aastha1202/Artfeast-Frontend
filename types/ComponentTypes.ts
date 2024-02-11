/* eslint-disable prettier/prettier */
export interface Posts {
  userId: {
    userName: string;
    userId: string;
  };
  postUrl: string;
}

export interface UserDetails {
        userName : string
        userId : string
        followers : string []
        followings : string[]
}
