import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const SignUpScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [name, setName] = useState('');
    const navigation = useNavigation();

    const handleDataSignUp = async () => {
        try {
            if (email.length > 0 && password.length > 0 && name.length > 0) {
                // Create a new user with email and password
                const response = await auth().createUserWithEmailAndPassword(email, password);

                // Create user data for Firestore
                const userData = {
                    id: response.user.uid,
                    name: name,
                    email: email,
                };

                // Save user data to Firestore
                await firestore().collection('users').doc(response.user.uid).set(userData);

                // Send email verification
                // await response.user.sendEmailVerification();

                // Sign out the user
                await auth().signOut();

                // Notify the user and navigate to login screen
                Alert.alert('Success', 'Please verify your email. Check your inbox.');
                navigation.navigate('Login');
            } else {
                Alert.alert('Error', 'Please fill in all fields!');
            }
        } catch (err) {
            // Log the error and update the message state
            setMessage('Failed to sign up. Please try again later.');
            Alert.alert('Error', err.message || 'An unknown error occurred.');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.helloContainer}>
                <Text style={styles.createAccountText}>Create account</Text>
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.textInput}
                    placeholder='Username'
                    value={name}
                    onChangeText={setName}
                />
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.textInput}
                    placeholder='E-mail'
                    value={email}
                    onChangeText={setEmail}
                    keyboardType='email-address'
                />
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.textInput}
                    placeholder='Mobile'
                    keyboardType='phone-pad'
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
            <View style={styles.createButtonContainer}>
                <TouchableOpacity onPress={handleDataSignUp} style={styles.button}>
                    <View style={styles.buttonContent}>
                        <Text style={styles.buttonText}>Create</Text>
                    </View>
                </TouchableOpacity>
            </View>

            <View>
                <Text style={styles.lastText}>Already Have An Account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.lastTextLogin}>Login!</Text>
                </TouchableOpacity>
            </View>

            {message ? <Text style={styles.errorText}>{message}</Text> : null}

            <View style={styles.footerContainer}>
                <Text style={styles.footerText}>Or create an account using social media</Text>
                <View style={styles.socialContainer}>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#faf0e6',
        flex: 1,
        paddingHorizontal: 25,
    },
    helloContainer: {
        marginBottom: 30,
    },
    createAccountText: {
        textAlign: 'center',
        fontSize: 35,
        color: '#262626',
        fontWeight: 'bold',
    },
    inputContainer: {
        backgroundColor: '#faf0e6',
        flexDirection: 'row',
        borderRadius: 25,
        marginVertical: 10,
        alignItems: 'center',
        elevation: 10,
        paddingHorizontal: 10,
        color: '#262626',
    },
    inputIcon: {
        marginRight: 5,
    },
    textInput: {
        flex: 1,
        color: '#3CB371',
        paddingVertical: 10,
        fontSize:15,
    },
    createButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 20,
        paddingHorizontal: 25,
        marginHorizontal:170,
    },
    button: {
        height: 38,
        width: 100,
        borderRadius: 17,
        backgroundColor: '#3CB371',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        marginRight: 5,
    },
    footerContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    footerText: {
        color: '#262626',
        fontSize: 16,
        marginBottom: 10,
    },
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    socialIcon: {
        margin: 10,
    },
    lastText: {
        color: '#262626',
        textAlign: 'center',
        fontSize: 16,
        marginTop: 20,
    },
    lastTextLogin: {
        color: '#262626',
        textAlign: 'center',
        marginTop: 5,
        textDecorationLine: 'underline',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 10,
    },
});

export default SignUpScreen;