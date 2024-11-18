import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, ScrollView, Alert, RefreshControl } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { auth } from '../firebaseConfig'; // Assuming this is where your Firebase config is stored
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient'; // For gradients

const DetailsScreen = () => {
  const [storedUsername, setStoredUsername] = useState('');
  const [rainfallHistory, setRainfallHistory] = useState([]); // To store historical rainfall data
  const [refreshing, setRefreshing] = useState(false); // State to control pull-to-refresh
  const navigation = useNavigation(); // Hook for navigation

  // Fetch user data from Firestore
  const fetchUserData = async () => {
    try {
      const userDocRef = firestore().collection('users').doc(auth().currentUser.uid);
      const userDoc = await userDocRef.get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        setStoredUsername(userData.username || ''); // Fallback if username is not set
        
        // Check if 'predictions' field exists and is an array
        if (userData.predictions && Array.isArray(userData.predictions)) {
          setRainfallHistory(userData.predictions);
        } else {
          console.log('No predictions data available');
        }
      } else {
        console.log('No user data found');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // Fetch user data when component mounts
  useEffect(() => {
    fetchUserData();
  }, []);

  // Function to delete a specific entry from rainfall history
  const deleteHistory = async (index) => {
    try {
      const updatedHistory = rainfallHistory.filter((_, i) => i !== index);
      setRainfallHistory(updatedHistory); // Update the local state

      // Update the Firestore document
      const userDocRef = firestore().collection('users').doc(auth().currentUser.uid);
      await userDocRef.update({
        predictions: updatedHistory,
      });

      Alert.alert('Success', 'History entry deleted successfully');

      // Automatically refresh the screen after deletion
      fetchUserData();

    } catch (error) {
      console.error('Error deleting history:', error);
      Alert.alert('Error', 'Failed to delete history entry');
    }
  };

  // Function to handle pull-to-refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchUserData().then(() => setRefreshing(false));
  };

  return (
    <ImageBackground
      source={require('./details.jpg')}
      style={styles.imageBackground}
    >
      <ScrollView 
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.heading}>Details</Text>

        {/* User Information */}
        <Text style={styles.detailText}>👤 Username: {storedUsername}</Text>
        <Text style={styles.detailText}>📧 Email: {auth().currentUser.email}</Text>

        {/* Rainfall, Yield, Production History */}
        <Text style={styles.subHeading}>{'\n'}🌧️ History</Text>
        {rainfallHistory.length > 0 ? (
          rainfallHistory.map((data, index) => (
            <View key={index} style={styles.dataCard}>
              <Text style={styles.dataText}>📅 Year: {data.year}</Text>
              <Text style={styles.dataText}>🏞️ State: {data.state}</Text>
              <Text style={styles.dataText}>🌱 Crop Name: {data.cropName}</Text>
              <Text style={styles.dataText}>🌧️ Rainfall: {data.predictedRainfall} mm</Text>
              <Text style={styles.dataText}>🌱 Yield: {data.predictedYield} kg/hectare</Text>
              <Text style={styles.dataText}>🚜 Production: {data.predictedProduction} tons</Text>

              {/* Delete Button */}
              <TouchableOpacity onPress={() => deleteHistory(index)}>
                <LinearGradient colors={['#ff6347', '#ff4500']} style={styles.deleteButton}>
                  <Text style={styles.deleteButtonText}>🗑️ Delete Entry</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>No data available</Text>
        )}

        {/* Button to navigate back to the home screen */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <LinearGradient colors={['#4682b4', '#6bb8d6']} style={styles.button}>
            <Text style={styles.buttonText}>← Back to Home</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* App Guide */}
        <Text style={styles.subHeading}>📘 App Guide:</Text>
        <Text style={styles.guideText}>
          This app helps predict rainfall, yield, and production for various regions based on historical data and
          advanced algorithms. You can enter the year and state to get predictions, view your historical data, and more.{'\n\n\n'}
        </Text>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: 'black',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
  },
  detailText: {
    fontSize: 20,
    marginVertical: 10,
    color: 'black',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
  },
  subHeading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    color: 'black',
    textAlign: 'center',
  },
  dataCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    width: '90%',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  dataText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: '#ff6347',
    marginTop: 20,
    textAlign: 'center',
  },
  guideText: {
    fontSize: 19,
    marginVertical: 15,
    textAlign: 'center',
    color: 'black',
  },
  button: {
    padding: 15,
    borderRadius: 25,
    marginTop: 20,
    width: 200,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 5 },
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  deleteButton: {
    padding: 10,
    borderRadius: 20,
    marginTop: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 5 },
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default DetailsScreen;
