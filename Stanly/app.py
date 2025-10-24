from flask import Flask, render_template, request, jsonify
import joblib
import numpy as np
import os

app = Flask(__name__)

# Load the model and scaler
try:
    model = joblib.load('model.pkl')
    scaler = joblib.load('scaler.pkl')
    print("Model and scaler loaded successfully!")
except Exception as e:
    print(f"Error loading model/scaler: {e}")
    model = None
    scaler = None

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        if model is None or scaler is None:
            return jsonify({
                'error': 'Model or scaler not loaded. Please ensure model.pkl and scaler.pkl exist.'
            }), 500

        data = request.get_json()
        
        # Extract features in the correct order
        features = [
            float(data.get('ph', 0)),
            float(data.get('Hardness', 0)),
            float(data.get('Solids', 0)),
            float(data.get('Chloramines', 0)),
            float(data.get('Sulfate', 0)),
            float(data.get('Conductivity', 0)),
            float(data.get('Organic_carbon', 0)),
            float(data.get('Trihalomethanes', 0)),
            float(data.get('Turbidity', 0))
        ]
        
        # Scale the features
        features_scaled = scaler.transform([features])
        
        # Make prediction
        prediction = model.predict(features_scaled)[0]
        prediction_proba = model.predict_proba(features_scaled)[0]
        
        result = {
            'potability': int(prediction),
            'potable_text': 'Potable (Safe to Drink)' if prediction == 1 else 'Not Potable (Unsafe)',
            'confidence': float(max(prediction_proba) * 100)
        }
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)