import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../../assets/styles/signupStyles';
import api from "../../constants/axiosInstance";
import COLORS from "../../constants/colors";
import { setError, setLoading, setUser } from '../../store/authSlice';


export default function Signup() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const isLoading = useSelector((state) => state.auth.isLoading);
    const dispatch = useDispatch();
    const router = useRouter();

    const handleSignUp = async () => {
        if (!username || !email || !password) {
            Alert.alert("Error", "Please fill in all fields.");
            return;
        }
        dispatch(setLoading(true));
        try {
            const res = await api.post('/auth/register', { username, email, password });
            const { user, token } = res.data;

            await AsyncStorage.setItem('token', token);
            await AsyncStorage.setItem('user', JSON.stringify(user));

            dispatch(setUser({ user, token }));
            Alert.alert("Success", "Account created successfully!");
        } catch (error) {
            dispatch(setError(error.response?.data?.message || 'Registration failed'));
            Alert.alert("Error", error.response?.data?.message || 'Registration failed');
        }
        finally{
            dispatch(setLoading(false));
        }
};
  return (
    <KeyboardAvoidingView style={{flex:1}}
    behavior={Platform.OS ==='ios'? 'padding' : 'height'}>
        <View style={styles.container}>
            <View style={styles.card}>
            <View style={styles.header}>
                 <Text style={styles.title}>BookNook ✨</Text>
                 <Text style={styles.subtitle}>Dive into stories worth sharing</Text>
            </View>
        
        <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Username</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={COLORS.primary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="prajwal"
                  placeholderTextColor={COLORS.placeholderText}
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />
              </View>
            </View>
            
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
                  placeholder="prajwal@gmail.com"
                  value={email}
                  placeholderTextColor={COLORS.placeholderText}
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
                  placeholder="******"
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
            <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={isLoading}>
            {isLoading ? (
                <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Sign Up</Text>
                )}
            </TouchableOpacity>
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Already have an account?</Text>
                    <TouchableOpacity onPress={()=>router.back()}>
                        <Text style={styles.link}>Login</Text>
                    </TouchableOpacity>
                 </View>
                </View>
              </View>
              </View>
    </KeyboardAvoidingView>
  )
}