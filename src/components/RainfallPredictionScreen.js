import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Alert,
  Animated,
  Easing,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import BASE_URL from './apiConfig'; // Import the base URL

const RainfallPredictionScreen = () => {
  const [year, setYear] = useState('');
  const [state, setState] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state
  const [userLoading, setUserLoading] = useState(true); // User data loading state
  const rainfallAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  const [storedUsername, setStoredUsername] = useState('');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const user = auth().currentUser;
      if (!user) {
        Alert.alert('Error', 'No user is currently logged in.');
        setUserLoading(false);
        return;
      }

      const userDocRef = firestore().collection('users').doc(user.uid);
      const userDoc = await userDocRef.get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        setStoredUsername(userData.username || ''); // Fallback if username is not set
      } else {
        console.log('No user data found');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert('Error', 'Failed to fetch user data.');
    } finally {
      setUserLoading(false);
    }
  };

  const handlePrediction = async () => {
    // Validate inputs
    if (!year || !state) {
      Alert.alert('Input Error', 'Please enter both year and state.');
      return;
    }

    const yearNum = parseInt(year, 10);
    if (isNaN(yearNum) || year.length !== 4) {
      Alert.alert('Input Error', 'Please enter a valid 4-digit year.');
      return;
    }

    if (userLoading) {
      Alert.alert('Please wait', 'Fetching user data. Please try again in a moment.');
      return;
    }

    setLoading(true); // Start loading

    try {
      const response = await axios.post(
        `${BASE_URL}/predict_rainfall`,
        { year: yearNum, state },
        { timeout: 30000 } // Increased timeout to 15 seconds
      );

      console.log('API Response:', response.data);

      if (response.data && response.data.predicted_rainfall !== undefined) {
        const predictedRainfall = response.data.predicted_rainfall;
        setResult(predictedRainfall);
        startAnimations();
        await savePredictionToUserDocument(yearNum, state, predictedRainfall);
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (error) {
      console.error('Error fetching prediction:', error.message);
      Alert.alert('Error', 'Failed to fetch the prediction. Please try again later.');
    } finally {
      setLoading(false); // End loading
    }
  };

  const startAnimations = () => {
    Animated.timing(rainfallAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
      easing: Easing.out(Easing.exp),
    }).start();
  };

  const savePredictionToUserDocument = async (year, state, predictedRainfall) => {
    try {
      const user = auth().currentUser;
      if (!user) {
        Alert.alert('Error', 'User not authenticated.');
        return;
      }

      const userDocRef = firestore().collection('users').doc(user.uid);
      await userDocRef.update({
        predictions: firestore.FieldValue.arrayUnion({
          username: storedUsername,
          year,
          state,
          predictedRainfall,
          // createdAt: firestore.FieldValue.serverTimestamp(),
        }),
      });
      console.log('Prediction saved successfully!');
    } catch (error) {
      console.error('Error saving prediction to Firestore:', error.message);
      Alert.alert('Error', 'Failed to save prediction.');
    }
  };

  if (userLoading) {
    // Show loading indicator while fetching user data
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#006400" />
        <Text style={styles.loadingText}>Fetching user data...</Text>
      </View>
    );
  }

  return (
    <ImageBackground source={require('./crop.jpg')} style={styles.imageBackground}>
      <View style={styles.container}>
        <Text style={styles.heading}>Rainfall Prediction</Text>
        <TextInput
          style={styles.input} 
          placeholder="📅 Enter Year"
          placeholderTextColor="#999"
          value={year}
          onChangeText={(text) => setYear(text)}
          keyboardType="numeric"
          maxLength={4}
        />
        <TextInput
          style={styles.input}
          placeholder="🗺 Enter State"
          placeholderTextColor="#999"
          value={state}
          onChangeText={(text) => setState(text)}
        />
        <TouchableOpacity onPress={handlePrediction} disabled={loading}>
          <LinearGradient colors={['#006400', '#50C878']} style={styles.button}>
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Predict Rainfall</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {result !== null && (
          <Animated.View style={[styles.resultCard, { opacity: rainfallAnim }]}>
            <Text style={styles.resultText}>Predicted Rainfall: {result} mm</Text>
          </Animated.View>
        )}

        {result !== null && (
          <>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('CropPrediction', { predictedRainfall: result, year, state })
              }
            >
              <Text style={styles.navigationText}>→ Go to Crop Prediction</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate('CropYieldPrediction', { predictedRainfall: result, year, state })
              }
            >
              <Text style={styles.navigationText}>→ Go to Yield Prediction</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
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
    width: 330,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 30,
    alignItems: 'center',
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 25,
    color: '#2E8B57',
    textAlign: 'center',
  },
  input: {
    height: 50,
    marginBottom: 20,
    paddingHorizontal: 15,
    width: 280,
    backgroundColor: '#',
    color: '#262626',
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  button: {
    height: 45,
    borderRadius: 25,
    marginTop: 20,
    width: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resultCard: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#006400',
  },
  navigationText: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'green',
    textDecorationLine: 'underline',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#006400',
  },
});

export default RainfallPredictionScreen;
