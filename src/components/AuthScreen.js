import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, ImageBackground, Alert, Modal, TouchableOpacity } from 'react-native';
import { auth } from '../firebaseConfig';
import styles from '../styles/styles';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const AuthScreen = ({
  email,
  setEmail,
  password,
  setPassword,
  phoneNumber,
  setPhoneNumber,
  isLogin,
  setIsLogin,
  signUpMethod,
  setSignUpMethod,
  handleGetOTP,
  userName,
  setUserName,
  handleForgotPassword,
  handleAuthentication,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const navigation = useNavigation();

  const addUser = async () => {
  try {
    await firestore().collection('Users').add({
      name: userName,           // Correct assignment
      email: email,             // Correct assignment
      Mobile_Number: phoneNumber, // Correct assignment
    });
    console.log('Username is:', userName);
    console.log('Email address:', email);
    console.log('Phone Number is:', phoneNumber);
    console.log('User added Successfully with the above Details!');
  } catch (error) {
    console.error('Error adding user: ', error);
    Alert.alert('Error', 'Failed to add user. Please try again.');
  }
};
  const handleVerification = async () => {
    console.log('Starting OTP verification');
    if (verificationCode.length === 6) {
      try {
        console.log('Verification ID:', verificationId);
        console.log('Verification Code:', verificationCode);

        const credential = auth.PhoneAuthProvider.credential(verificationId, verificationCode);
        await auth().signInWithCredential(credential);

        setIsModalVisible(false);
        Alert.alert('Success', 'User signed in successfully with phone number!');
      } catch (error) {
        console.error('Verification error:', error.message);
        Alert.alert('Verification Error', error.message);
      }
    } else {
      Alert.alert('Invalid Code', 'Please enter a valid 6-digit verification code.');
    }
  };
  return (
<ImageBackground 
      source={require('./Auth.jpg')}
      // source={{ uri: 'https://img.freepik.com/premium-photo/abstract-blue-purple-gradient-background-with-curved-shape_1174990-224750.jpg?ga=GA1.1.503132469.1717491573&semt=ais_hybrid' }} 
      // https://www.pixelstalk.net/wp-content/uploads/images6/Green-Aesthetic-Pictures-Free-Download-1.jpg
      style={[styles.imageBackground, { width: 370, height: 800 }]}
    >
      <View style={[styles.authContainer, { height: 400, padding: 30, marginTop: 250 }]}>
        <Text style={styles.title}>{isLogin ? 'Sign In' : 'Sign Up'}</Text>
        {!isLogin && (
          <View style={styles.toggleContainer}>
            <Text
              style={[styles.toggleText, signUpMethod === 'email' && styles.selectedToggleText]}
              onPress={() => setSignUpMethod('email')}
            >
              Email
            </Text>
            <Text> / </Text>
            <Text
              style={[styles.toggleText, signUpMethod === 'phone' && styles.selectedToggleText]}
              onPress={() => setSignUpMethod('phone')}
            >
              Phone
            </Text>
          </View>
        )}

        {isLogin || signUpMethod === 'email' ? (
          <>
            <View >
              <TextInput
                style={styles.input}
                value={userName}
                onChangeText={setUserName}
                placeholder="👤 Username"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            <View>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="✉ Email"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </>
        ) : (
          <View >
            <TextInput
              style={styles.input}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="📞 Phone Number"
              keyboardType="phone-pad"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        )}

        <View >
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder={isLogin || signUpMethod === 'email' ? '🔒 Password' : '🔑 Verification Code'}
            secureTextEntry={isLogin || signUpMethod === 'email'}
            keyboardType={isLogin || signUpMethod === 'email' ? "default" : "numeric"}
          />
          {isLogin && (
        <TouchableOpacity style={[styles.forgotPasswordButton,{marginLeft:25}]} onPress={handleForgotPassword}>
          <Text style={{color:'white',marginLeft:150,fontWeight:'bold'}}>Forgot Password?</Text>
        </TouchableOpacity>
      )}
        </View>

        <View style={styles.buttonContainer}>
          {!isLogin && signUpMethod === 'phone' && (
            <TouchableOpacity style={[styles.button, {marginLeft:180,width: 80, alignItems: 'center', paddingVertical: 0, marginTop: 0, marginBottom: 0 ,backgroundColor:"transparent"}]} onPress={handleGetOTP}>
              <Text style={styles.buttonText}>Get OTP?</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.button} onPress={handleAuthentication}>
            <Text style={styles.buttonText}>{isLogin ? 'Sign In' : 'Sign Up'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomContainer}>
        
          <Text
            style={[styles.toggleText, { color: '#3b9b50', textAlign: 'center' }]}
            onPress={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
          </Text>
          <Text style={{color: '#ccc', marginTop: 12, textAlign: 'center', fontSize: 14, fontWeight: 'bold'}}>
    © 2024 GrowSmart
    {'\n'}
    <Text style={{color: '#aaa', marginTop: 4, fontSize: 10, fontStyle: 'italic'}}>
        Developed by Prranith. All rights reserved.
    </Text>
</Text>

        </View>
      </View>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Verification Code</Text>
            <TextInput
              style={styles.input}
              value={verificationCode}
              onChangeText={setVerificationCode}
              placeholder="Verification Code"
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.button} onPress={handleVerification}>
              <Text style={styles.buttonText}>Verify</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <Text style={styles.closeModal}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};

export default AuthScreen;