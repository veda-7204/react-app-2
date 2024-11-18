import React, { useState } from 'react';
import {
    Alert,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    StyleSheet,
} from 'react-native';
import { StackActions, useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

const LoginScreen = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Function to handle user login
    const handleLogin = async () => {
        // Check if email and password are provided
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields!');
            return;
        }

        try {
            // Attempt to sign in the user
            const userCredential = await auth().signInWithEmailAndPassword(email, password);
            const user = userCredential.user;

            // Check if the email is verified
            if (user.emailVerified) {
                Alert.alert('Success', 'You are logged in');
                navigation.dispatch(StackActions.replace('Home')); // Navigate to Home
            } else {
                Alert.alert('Alert', 'Please verify your email. Check your inbox.');
                await user.sendEmailVerification(); // Resend verification email
            }
        } catch (error) {
            console.error(error); // Log the error for debugging
            Alert.alert('Login Error', error.message); // Show error in an alert
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Sign in to your account</Text>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.textInput}
                    placeholder='Email'
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.textInput}
                    placeholder='Password'
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
            </View>

            <Text style={styles.forgotPasswordText}>Forgot your password?</Text>

            <TouchableOpacity onPress={handleLogin} style={styles.button}>
                <Text style={styles.buttonText}>Sign in</Text>
            </TouchableOpacity>

            <Text style={styles.footerText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.createAccountText}>Create</Text>
            </TouchableOpacity>

            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
        </View>
    );
};

// Styles for the component
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#faf0e6',
        justifyContent: 'center',
        paddingHorizontal: 30,
    },
    headerText: {
        fontSize: 30,
        fontWeight: '500',
        color: '#262626',
        textAlign: 'center',
        marginBottom: 20,
    },
    inputContainer: {
        backgroundColor: '#faf0e6',
        borderRadius: 25,
        marginVertical: 10,
        elevation: 10,
        paddingHorizontal: 15,
        height: 50,
    },
    textInput: {
        flex: 1,
        padding: 10,
        color: '#262626',
    },
    forgotPasswordText: {
        color: '#BEBEBE',
        textAlign: 'right',
        fontSize: 15,
        marginTop: 10,
    },
    button: {
        backgroundColor: '#3CB371',
        borderRadius: 17,
        height: 38,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    footerText: {
        color: '#262626',
        textAlign: 'center',
        fontSize: 20,
        marginTop: 20,
    },
    createAccountText: {
        color: 'green',
        fontSize: 20,
        textAlign: 'center',
        marginTop: 10,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 10,
    },
});

export default LoginScreen;
