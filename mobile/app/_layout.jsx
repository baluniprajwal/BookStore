import { SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider, useDispatch, useSelector } from 'react-redux';
import SafeScreen from "../components/SafeScreen";
import store from '../store/store';
import { logout, setUser } from "../store/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { useState } from "react";
import { useFonts } from "expo-font";
import Loader from "../components/Loader";

SplashScreen.preventAutoHideAsync();

function AuthCheck(){
  const router = useRouter();
  const segments = useSegments();
  const dispatch = useDispatch();
  const [checkAuth,setCheckAuth] = useState(false);
  const { user, token } = useSelector((state) => state.auth);
  const [fontsLoaded] = useFonts({
    "JetBrainsMono-Medium": require("../assets/fonts/JetBrainsMono-Medium.ttf"),
  });

   useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

   useEffect(() => {
    async function checkAuth() {
      try {
        setCheckAuth(true);
        const storedToken = await AsyncStorage.getItem("token");
        const storedUser = await AsyncStorage.getItem("user");
        if (storedToken && storedUser) {
          dispatch(setUser({ token: storedToken, user: JSON.parse(storedUser) }));
        } else {
          dispatch(logout());
        }
      } catch (error) {
        dispatch(logout());
      }finally{
        setCheckAuth(false);
      }
    }
    checkAuth();
  }, [dispatch]);

  useEffect(() => {
    const isOnAuthRoute = segments[0] === "(auth)";
    const isLoggedIn = !!user && !!token;

    if (!isLoggedIn && !isOnAuthRoute) {
      router.replace("/(auth)");
    } else if (isLoggedIn && isOnAuthRoute) {
      router.replace("/(tabs)");
    }
  }, [user, token, segments]);
   if (checkAuth){
    return <Loader/>;
   }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(auth)" />
    </Stack>
  );
}


export default function RootLayout() {
  return (
     <Provider store={store}>
    <SafeAreaProvider>
      <SafeScreen>
          <AuthCheck/>
      </SafeScreen>
      <StatusBar style="dark"/>
    </SafeAreaProvider>
    </Provider>
  )
}
