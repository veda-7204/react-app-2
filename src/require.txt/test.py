import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import accuracy_score
import pickle

# Load the dataset
df = pd.read_csv('../top_10_cropnames.csv')

# Strip spaces in all string columns and handle any missing values
df = df.applymap(lambda x: x.strip() if isinstance(x, str) else x)

# Fill missing values (if any) with appropriate values (mean for numerical, mode for categorical)
df['Area'].fillna(df['Area'].mean(), inplace=True)
df['Production'].fillna(df['Production'].mean(), inplace=True)
df['Annual_Rainfall'].fillna(df['Annual_Rainfall'].mean(), inplace=True)
df['Fertilizer'].fillna(df['Fertilizer'].mean(), inplace=True)
df['Pesticide'].fillna(df['Pesticide'].mean(), inplace=True)
df['Yield'].fillna(df['Yield'].mean(), inplace=True)

# Create and store encoders for 'Season' and 'State'
season_encoder = LabelEncoder()
state_encoder = LabelEncoder()

df['Season'] = season_encoder.fit_transform(df['Season'])
df['State'] = state_encoder.fit_transform(df['State'])

# Create an encoder for the target 'Crop'
crop_encoder = LabelEncoder()
df['Crop'] = crop_encoder.fit_transform(df['Crop'])

# Define features and target
X = df[['Crop_Year', 'Season', 'State', 'Area', 'Production', 'Annual_Rainfall', 'Fertilizer', 'Pesticide', 'Yield']]
y = df['Crop']

# Scale the features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Split data into train and test sets
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

# Initialize RandomForestClassifier
model = RandomForestClassifier(n_estimators=100, random_state=42)

# Train the model
model.fit(X_train, y_train)

# Make predictions
y_pred = model.predict(X_test)

# Check accuracy
accuracy = accuracy_score(y_test, y_pred)
print(f'Model accuracy: {accuracy * 100:.2f}%')

# Function to predict crop based on input data
def predict_crop(input_data):
    # Preprocess the input data (strip spaces, encode, and scale)
    input_data['Season'] = season_encoder.transform([input_data['Season']])[0]
    input_data['State'] = state_encoder.transform([input_data['State']])[0]
    
    # Create a DataFrame from the input data
    input_df = pd.DataFrame([input_data])
    
    # Scale the input data
    input_scaled = scaler.transform(input_df)

    # Predict the crop code
    predicted_crop_code = model.predict(input_scaled)[0]
    
    # Decode the predicted crop
    predicted_crop = crop_encoder.inverse_transform([predicted_crop_code])[0]
    return predicted_crop

# Example usage
input_data = {
    'Crop_Year': 2024,
    'Season': 'Kharif',  # Example input
    'State': 'Assam',
    'Area': 500.0,
    'Production': 2000.0,
    'Annual_Rainfall': 1500.0,
    'Fertilizer': 3000.0,
    'Pesticide': 50.0,
    'Yield': 2.5
}

predicted_crop = predict_crop(input_data)
print(f'Predicted Crop: {predicted_crop}')

# Save the trained model, encoders, and scaler to pkl files
with open('crop_prediction_model.pkl', 'wb') as model_file:
    pickle.dump(model, model_file)

with open('season_encoder.pkl', 'wb') as season_file:
    pickle.dump(season_encoder, season_file)

with open('state_encoder.pkl', 'wb') as state_file:
    pickle.dump(state_encoder, state_file)

with open('crop_encoder.pkl', 'wb') as crop_file:
    pickle.dump(crop_encoder, crop_file)

with open('scaler.pkl', 'wb') as scaler_file:
    pickle.dump(scaler, scaler_file)

print("Model, encoders, and scaler saved successfully!")
