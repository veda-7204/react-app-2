import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
  ScrollView,
  ActivityIndicator, // Import ActivityIndicator for the loading spinner
} from 'react-native';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';
import { useRoute } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore'; // Import Firestore
import auth from '@react-native-firebase/auth';

const CropPredictionScreen = () => {
  const route = useRoute();
  const { predictedRainfall: initialPredictedRainfall, year: initialYear, state: initialState } = route.params;

  const [season, setSeason] = useState('');
  const [area, setArea] = useState('');
  const [production, setProduction] = useState('');
  const [fertilizer, setFertilizer] = useState('');
  const [pesticides, setPesticides] = useState('');
  const [yieldValue, setYieldValue] = useState('');
  const [predictedCrop, setPredictedCrop] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state

  // New state variables for year, state, and predictedRainfall
  const [year, setYear] = useState(initialYear.toString());
  const [state, setState] = useState(initialState);
  const [predictedRainfall, setPredictedRainfall] = useState(initialPredictedRainfall.toString());

  const handleCropPrediction = async () => {
    if (!season || !area || !production || !fertilizer || !pesticides || !yieldValue) {
      Alert.alert('Input Error', 'Please fill in all fields.');
      return;
    }

    setLoading(true); // Start loading

    try {
      const response = await axios.post(
        'http://192.168.0.159:5000/predict_crop',
        {
          year,
          state,
          season,
          area,
          production,
          rainfall: predictedRainfall,
          fertilizer,
          pesticides,
          yield: yieldValue,
        }
      );

      if (response.data && response.data.predicted_crop) {
        setPredictedCrop(response.data.predicted_crop);
        await savePredictionToUserDocument(season, area, production, fertilizer, pesticides, yieldValue, predictedCrop); // Save to Firestore
      } else {
        throw new Error('Invalid response from the API');
      }
    } catch (error) {
      console.error('Error during crop prediction:', error.message);
      Alert.alert('Error', 'Failed to predict crop. Please try again later.');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const savePredictionToUserDocument = async (season, area, production, fertilizer, pesticides, yieldValue, predictedCrop) => {
    try {
      const user = auth().currentUser;
      if (!user) {
        Alert.alert('Error', 'User not authenticated.');
        return;
      }

      const userDocRef = firestore().collection('users').doc(user.uid);
      await userDocRef.update({
        predictions: firestore.FieldValue.arrayUnion({ season, area, production, fertilizer, pesticides, yieldValue, predictedCrop }),
      });
      console.log('Prediction saved successfully!');
    } catch (error) {
      console.error('Error saving prediction to Firestore:', error.message);
      Alert.alert('Error', 'Failed to save prediction.');
    }
  };

  return (
    <ImageBackground source={require('./crop.jpg')} style={styles.imageBackground}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.heading}>Crop Prediction</Text>

          {/* Input fields for year, state, and predictedRainfall */}
          <TextInput
            style={styles.input}
            placeholder="📅 Enter Year"
            placeholderTextColor="#999"
            color='#262626'
            value={year}
            onChangeText={setYear}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="🏞️ Enter State"
            placeholderTextColor="#999"
            color='#262626'
            value={state}
            onChangeText={setState}
          />
          <TextInput
            style={styles.input}
            placeholder="🌧️ Predicted Rainfall"
            placeholderTextColor="#999"
            color='#262626'
            value={predictedRainfall}
            onChangeText={setPredictedRainfall}
            keyboardType="numeric"
          />

          <TextInput
            style={styles.input}
            placeholder="🌿 Enter Season"
            placeholderTextColor="#999"
            color='#262626'
            value={season}
            onChangeText={setSeason}
          />
          <TextInput
            style={styles.input}
            placeholder="🌍 Enter Area (in hectares)"
            placeholderTextColor="#999"
            color='#262626'
            value={area}
            onChangeText={setArea}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="🏭 Enter Production (in tons)"
            placeholderTextColor="#999"
            color='#262626'
            value={production}
            onChangeText={setProduction}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="🌱 Enter Fertilizer (in kg)"
            placeholderTextColor="#999"
            color='#262626'
            value={fertilizer}
            onChangeText={setFertilizer}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="🐞 Enter Pesticides (in liters)"
            placeholderTextColor="#999"
            color='#262626'
            value={pesticides}
            onChangeText={setPesticides}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="🌾 Enter Yield (in tons)"
            placeholderTextColor="#999"
            color='#262626'
            value={yieldValue}
            onChangeText={setYieldValue}
            keyboardType="numeric"
          />

          <TouchableOpacity onPress={handleCropPrediction} disabled={loading}>
            <LinearGradient colors={['#006400', '#50C878']} style={styles.button}>
              {loading ? (
                <ActivityIndicator size="small" color="#FFF" /> // Display loading spinner while fetching data
              ) : (
                <Text style={styles.buttonText}>Predict Crop</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {predictedCrop && (
            <View style={styles.resultCard}>
              <Text style={styles.resultText}>Predicted Crop: {predictedCrop}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: 350,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 30,
    alignItems: 'center',
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E8B57',
    marginBottom: 25,
    textAlign: 'center',
  },
  input: {
    height: 50,
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  button: {
    height: 50,
    borderRadius: 25,
    width: 220,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultCard: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  resultText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#006400',
  },
});

export default CropPredictionScreen;
