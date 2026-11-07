import type{ReactNode}from'react';import{Modal,View,Pressable}from'react-native';
import type{Region}from'../layout.mjs';
export type DrawerHostProps={open:boolean;onClose:()=>void;region:Region;children:ReactNode};
/** Native adapter. The content is identical on phone/tablet/foldable. */
export function DrawerHost({open,onClose,region,children}:DrawerHostProps){const width=Math.min(420,region.width);return <Modal visible={open} transparent animationType="none" onRequestClose={onClose} statusBarTranslucent navigationBarTranslucent><View style={{flex:1,backgroundColor:'rgba(0,13,26,.38)'}}><Pressable accessibilityLabel="Dismiss account drawer" onPress={onClose} style={{position:'absolute',inset:0}}/><View accessibilityViewIsModal importantForAccessibility="yes" style={{position:'absolute',left:region.x+region.width-width,top:region.y,width,height:region.height,backgroundColor:'#fff'}}>{children}</View></View></Modal>;}
