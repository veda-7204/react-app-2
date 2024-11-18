from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

# Load models and encoders for Rainfall and Yield Prediction
# Rainfall Prediction Model

rf_model_rainfall = joblib.load('../src/requirements.txt/rf_model_rainfall.pkl')
label_encoder_state_rainfall = joblib.load('../src/requirements.txt/label_encoder_state.pkl')

# Crop Yield Prediction Model
rf_yield_model = joblib.load('../src/requirements.txt/crop_yield_model.pkl')
label_encoder_state_yield = joblib.load('../src/requirements.txt/label_encoder_state.pkl')
label_encoder_crop_yield = joblib.load('../src/requirements.txt/label_encoder_crop.pkl')

# Load models and encoders for Crop Name Prediction (New files)
rf_crop_model = joblib.load('../src/require.txt/crop_prediction_model.pkl')
scaler_crop = joblib.load('../src/require.txt/scaler.pkl')
label_encoder_crop_new = joblib.load('../src/require.txt/crop_encoder.pkl')
label_encoder_season_new = joblib.load('../src/require.txt/season_encoder.pkl')
label_encoder_state_crop_new = joblib.load('../src/require.txt/state_encoder.pkl')

# Rainfall Prediction Endpoint
@app.route('/predict_rainfall', methods=['POST'])
def predict_rainfall():
    """
    Predict rainfall based on the year and state.
    """
    data = request.json
    crop_year = data['year']
    state = data['state']

    # Encode the state using the rainfall encoder
    state_encoded = label_encoder_state_rainfall.transform([state])[0]

    # Prepare input data for the model
    input_data = np.array([[crop_year, state_encoded]])

    # Make the prediction
    predicted_rainfall = rf_model_rainfall.predict(input_data)[0]

    return jsonify({'predicted_rainfall': predicted_rainfall})


# Crop Name Prediction Endpoint (New Model and Encoders)
@app.route('/predict_crop', methods=['POST'])
def predict_crop():
    """
    Predict crop name based on various features (year, state, season, area, production, rainfall, etc.).
    """
    try:
        data = request.json
        crop_year = data['year']
        state = data['state']
        season = data['season']
        area = data['area']
        production = data['production']
        rainfall = data['rainfall']
        fertilizer = data['fertilizer']
        pesticides = data['pesticides']
        yield_value = data['yield']

        # Log the incoming data for debugging purposes
        print(f"Received data: {data}")

        # Encode state and season using the new crop prediction encoders
        state_encoded = label_encoder_state_crop_new.transform([state])[0]
        season_encoded = label_encoder_season_new.transform([season])[0]

        # Prepare input data for the model
        input_data = np.array([[crop_year, state_encoded, season_encoded, area, production, rainfall, fertilizer, pesticides, yield_value]])

        # Log the input data before scaling
        print(f"Input data before scaling: {input_data}")

        # Scale the input data using the new crop prediction scaler
        input_data_scaled = scaler_crop.transform(input_data)

        # Log the scaled input data
        print(f"Scaled input data: {input_data_scaled}")

        # Make the prediction
        predicted_crop = rf_crop_model.predict(input_data_scaled)
        predicted_crop_name = label_encoder_crop_new.inverse_transform(predicted_crop)[0]

        return jsonify({'predicted_crop': predicted_crop_name})
    except Exception as e:
        print(f"Error occurred: {e}")
        return jsonify({'error': str(e)}), 500


# Crop Yield Prediction Endpoint (Using Past Model and Encoders)
@app.route('/predict_yield', methods=['POST'])
def predict_yield():
    """
    Predict crop yield based on various features (year, state, crop name, rainfall, etc.).
    """
    data = request.json
    crop_year = data['year']
    state = data['state']
    crop_name = data['crop_name']
    rainfall = data['rainfall']
    fertilizer = data['fertilizer']
    pesticides = data['pesticides']

    # Encode the state and crop name using the yield prediction encoders
    state_encoded = label_encoder_state_yield.transform([state])[0]
    crop_encoded = label_encoder_crop_yield.transform([crop_name])[0]

    # Prepare input data for the model
    input_data = np.array([[crop_year, state_encoded, rainfall, crop_encoded, fertilizer, pesticides]])

    # Make the prediction
    predicted_yield = rf_yield_model.predict(input_data)[0]

    return jsonify({'predicted_yield': predicted_yield})


if __name__ == '__main__':
    # Run the Flask app, allowing access from any IP (host='0.0.0.0')
    app.run(debug=True, host='0.0.0.0')
 