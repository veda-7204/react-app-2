import React, { useState } from 'react';
import {
    View,
    Text,
    Button,
    StyleSheet,
    TextInput,
    Alert,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native'; // Import the navigation hook
import { StackActions } from '@react-navigation/native'; // Import StackActions for screen navigation

export default function MobileVerificationScreen() {
    const [mobile, setMobile] = useState('');
    const [otpInput, setOtpInput] = useState('');
    const [confirmData, setConfirmData] = useState(null);
    const navigation = useNavigation(); // Initialize navigation

    const sendOtp = async () => {
        try {
            // Ensure the mobile number is properly formatted
            const formattedMobile = `+91${mobile.trim()}`;

            // Check if the number is in valid format
            if (formattedMobile.length !== 13) {
                Alert.alert('Error', 'Please enter a valid 10-digit mobile number.');
                return;
            }

            // Request OTP from Firebase
            const response = await auth().signInWithPhoneNumber(formattedMobile);
            setConfirmData(response);
            Alert.alert('Alert', 'OTP sent!');
        } catch (err) {
            console.log('Send OTP error:', err);
            Alert.alert('Error', 'Failed to send OTP. Please ensure the phone number is correct.');
        }
    };

    const submitOtp = async () => {
        try {
            if (!confirmData) {
                Alert.alert('Error', 'Please send the OTP first.');
                return;
            }

            const response = await confirmData.confirm(otpInput);
            console.log('OTP verification response:', response);
            Alert.alert('Success', 'Your phone number is verified and you are logged in.');

            // Navigate to the Home screen after successful verification
            navigation.dispatch(StackActions.replace('Home')); // Use the correct screen name here
        } catch (err) {
            console.log('OTP verification error:', err);
            Alert.alert('Error', 'Invalid OTP. Please try again.');
        }
    };

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ marginHorizontal: 90, marginTop: 50 }}>Enter Your Mobile Number:</Text>
            <TextInput
                style={styles.MobileInput}
                onChangeText={setMobile}
                keyboardType="phone-pad"
                maxLength={10}
                value={mobile}
            />
            <Button title="Send OTP" onPress={sendOtp} />

            <Text style={{ marginTop: 60 }}>Enter Your OTP:</Text>
            <TextInput
                style={styles.MobileInput}
                onChangeText={setOtpInput}
                keyboardType="number-pad"
                maxLength={6}
                value={otpInput}
            />
            <Button title="SUBMIT" onPress={submitOtp} />
        </View>
    );
}

const styles = StyleSheet.create({
    MobileInput: {
        width: '70%',
        borderWidth: 1,
        marginTop: 30,
        marginHorizontal: 60,
        marginBottom: 6,
        color: '#262626',
        padding: 10,
        borderRadius: 5,
    },
});
