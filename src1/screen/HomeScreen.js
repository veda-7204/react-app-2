import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import axios from 'axios';

const HomeScreen = ({ navigation }) => {
    const [year, setYear] = useState('');
    const [place, setPlace] = useState('');
    const [rainfallprediction, setRainfallPrediction] = useState(null);
    const [loading, setLoading] = useState(false);

    const handlePredict = async () => {
        setLoading(true);
        setRainfallPrediction(null);
        try {
            // Replace with your Flask API URL
            const API_URL = 'http://192.168.0.158:5000/api/predict'; // Use your actual IP address

            //const API_URL = 'http://192.168.218.69:5000/api/predict'; // For Android emulator
            // const API_URL = 'http://localhost:5000/api/predict'; // For iOS simulator
            // const API_URL = 'http://YOUR_LOCAL_IP:5000/api/predict'; // For physical devices

            const response = await axios.post(API_URL, {
                year: year,
                place: place,
            });

            setRainfallPrediction(response.data.prediction);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to get prediction from the server.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await auth().signOut();
            navigation.navigate('Login');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to the Dashboard!</Text>
            <Text style={styles.subtitle}>You are successfully logged in.</Text>
            <Text style={{ color: "black", marginBottom: 10 }}>Flask API prediction:</Text>

            <TextInput
                style={styles.input}
                placeholder="Enter the Year of prediction"
                keyboardType="phone-pad"
                value={year}
                onChangeText={setYear}
            />
            <TextInput
                style={styles.input}
                placeholder="Enter the name of place for prediction"
                value={place}
                onChangeText={setPlace}
            />

            <Button title={loading ? "Loading..." : "Get Prediction"} onPress={handlePredict} />
            <Text style={{ marginTop: 10, marginBottom: 10 , color:'#262626'}}>Predicted Rainfall: {rainfallprediction}</Text>

            <Button title="Logout" onPress={handleLogout} />
        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    subtitle: {
        fontSize: 18,
        color: '#666',
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 10,
        width: '80%',
        color : '#262626',
    },
});