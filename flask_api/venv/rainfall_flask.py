from flask import Flask, request, jsonify
from rainfall_model import RainfallModel

# Create an instance of the RainfallModel class
rainfall_model = RainfallModel(data_path='crop.csv')  # Make sure this is the correct path to your rainfall data

app = Flask(__name__)

# Rainfall Prediction Route
@app.route('/predict_rainfall', methods=['POST'])
def predict_rainfall():
    try:
        # Get the input data
        data = request.json['data']
        year = int(data[0][0])
        state = data[0][1]

        # Predict rainfall for the input year and state
        prediction = rainfall_model.predict(year, state)

        # Evaluate model accuracy
        metrics = rainfall_model.evaluate()

        return jsonify({
            'prediction': prediction.tolist(),
            'accuracy': metrics['r2_score'],
            'mse': metrics['mean_squared_error'],
            'mae': metrics['mean_absolute_error']
        })

    except ValueError as e:
        # Handle error if the state is not found
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        # Catch-all for other errors
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)