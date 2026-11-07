import{Stack}from'expo-router';import{SafeAreaProvider}from'react-native-safe-area-context';
import{WorkspaceProvider}from'../../shared/workspace/Provider';
export default function Layout(){return <SafeAreaProvider><WorkspaceProvider origin={process.env.EXPO_PUBLIC_INFRAX_API_ORIGIN}><Stack screenOptions={{headerShown:false}}/></WorkspaceProvider></SafeAreaProvider>;}
