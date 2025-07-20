import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from 'expo-image';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from "react-redux";
import styles from "../../assets/styles/loginStyles.js";
import api from "../../constants/axiosInstance.js";
import COLORS from "../../constants/colors";
import { setError, setLoading, setUser } from '../../store/authSlice';



export default function Login() {
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [showPassword,setShowPassword] = useState(false);
    const isLoading = useSelector((state) => state.auth.isLoading);
    const dispatch = useDispatch();
    const router = useRouter();

    const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    dispatch(setLoading(true));
    try {
      const res = await api.post('/auth/login', { email, password });
      const { user, token } = res.data;

      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      dispatch(setUser({ user, token }));
      Alert.alert('Success', 'Logged in successfully!');
    } catch (error) {
      dispatch(setError(error.response?.data?.message || 'Login failed'));
      Alert.alert('Error', error.response?.data?.message || 'Login failed');
      console.log(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS ==="ios" ? 'padding' : "height"}>
        <View style={styles.container}>
            <View style={styles.topIllustration}>
                <Image
                source={require("../../assets/images/Bookloverbro.svg")}
                style={styles.illustrationImage}
                contentFit='contain'
                />
        </View>
        <View style={styles.card}>
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={COLORS.primary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor={COLORS.placeholderText}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputContainer}>
                
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={COLORS.primary}
                  style={styles.inputIcon}
                />
                
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor={COLORS.placeholderText}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />

                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color={COLORS.primary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Login</Text>
              )}
            </TouchableOpacity>
            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account?</Text>
                <Link href="/signup">
                  <Text style={styles.link}>Sign Up</Text>
                </Link>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}