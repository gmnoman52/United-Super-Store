import { useState } from 'react';
import { Image, View } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { colors as c } from '../theme';
export function ProductThumbnail({uri,name}:{uri:string|null;name:string}) {
  const [failed,setFailed]=useState(false);
  if(uri && !failed) return <Image source={{uri}} accessibilityLabel={name} onError={()=>setFailed(true)} style={{width:80,height:96,borderRadius:12,backgroundColor:c.background}}/>;
  return <View accessibilityLabel={`${name}, no photo available`} style={{width:80,height:96,borderRadius:12,backgroundColor:c.background,alignItems:'center',justifyContent:'center'}}><Feather name="shopping-bag" size={24} color={c.textSecondary}/></View>;
}
