from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestRegressor
import traceback

app = Flask(__name__) 
CORS(app)  # Enable CORS for all routes

# Load the dataset and preprocess it
data = pd.read_csv('../venv/crop.csv.csv')  # Adjust path accordingly

# Encode categorical variables
label_encoders = {}
for column in ['Crop', 'Season', 'State']:
    le = LabelEncoder()
    data[column] = le.fit_transform(data[column])
    label_encoders[column] = le

# Define features and target variable
X = data.drop(columns=['Annual_Rainfall'])
y = data['Annual_Rainfall']

# Split the data into training and testing sets (80% train, 20% test)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Initialize and train the Random Forest Regressor
rf_model = RandomForestRegressor(n_estimators=100, random_state=42)
rf_model.fit(X_train, y_train)

# Function to predict rainfall based on input year and state
def predict_rainfall(year, state):
    # Use the average values for other columns
    crop_encoded = X['Crop'].mode()[0]  # Most frequent crop
    season_encoded = X['Season'].mode()[0]  # Most frequent season
    area_mean = X['Area'].mean()  # Mean area
    production_mean = X['Production'].mean()  # Mean production
    fertilizer_mean = X['Fertilizer'].mean()  # Mean fertilizer usage
    pesticide_mean = X['Pesticide'].mean()  # Mean pesticide usage
    yield_mean = X['Yield'].mean()  # Mean yield

    # Encode the state
    state_encoded = label_encoders['State'].transform([state])[0]

    # Create a dataframe with the inputs
    input_data = pd.DataFrame({
        'Crop': [crop_encoded],
        'Crop_Year': [year],
        'Season': [season_encoded],
        'State': [state_encoded],
        'Area': [area_mean],
        'Production': [production_mean],
        'Fertilizer': [fertilizer_mean],
        'Pesticide': [pesticide_mean],
        'Yield': [yield_mean]
    })

    # Predict the annual rainfall
    predicted_rainfall = rf_model.predict(input_data)[0]
    return predicted_rainfall

@app.route('/')
def home():
    return "Flask API is running!"

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        year = int(data.get('year'))
        state = data.get('place')

        # Use the prediction function to get the rainfall prediction
        prediction = predict_rainfall(year, state)

        return jsonify({'prediction': prediction}), 200
    except Exception as e:
        traceback.print_exc()  # Print error to server log for debugging
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)