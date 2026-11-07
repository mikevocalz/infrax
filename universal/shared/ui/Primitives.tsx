import type{ReactNode}from'react';
import{Text,View,type TextProps,type ViewProps}from'react-native';
import{Button}from'@nyc-tron/ui/components/Button';
import{TextField,type TextFieldProps}from'@nyc-tron/ui/components/TextField';
import{Card}from'@nyc-tron/ui/components/Card';
export const colors={navy:'#000d1a',orange:'#f37021',ink:'#263c50',muted:'#4b5e70',line:'#dbe3eb',paper:'#ffffff'};
export function Heading({children,...props}:TextProps){return <Text {...props} accessibilityRole="header" style={[{fontSize:24,lineHeight:31,fontWeight:'700',color:colors.navy,flexShrink:1},props.style]}>{children}</Text>;}
export function Body({children,...props}:TextProps){return <Text {...props} style={[{fontSize:16,lineHeight:24,color:colors.ink,flexShrink:1},props.style]}>{children}</Text>;}
export function Stack({children,...props}:ViewProps){return <View {...props} style={[{gap:16,minWidth:0},props.style]}>{children}</View>;}
export function Panel({children}:{children:ReactNode}){return <Card unstyled style={{padding:20,gap:14,borderWidth:1,borderColor:colors.line,borderRadius:6,backgroundColor:colors.paper,minWidth:0}}>{children}</Card>;}
export function Action({title,onPress,disabled=false,secondary=false,expanded}:{title:string;onPress:()=>void;disabled?:boolean;secondary?:boolean;expanded?:boolean}){
 return <Button unstyled accessibilityState={{expanded}} title={title} onPress={onPress} disabled={disabled} style={{minHeight:48,paddingHorizontal:16,paddingVertical:12,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:secondary?colors.line:colors.orange,backgroundColor:secondary?'#fff':colors.orange,borderRadius:4,opacity:disabled?0.5:1}}/>;
}
export function Field(props:TextFieldProps){return <View style={{flexGrow:1,flexShrink:1,minWidth:90}}><TextField {...props} unstyled style={[{fontSize:18,padding:12,minHeight:48,borderWidth:1,borderColor:colors.line,borderRadius:4,color:colors.navy,minWidth:90},props.style]}/></View>;}
