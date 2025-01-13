from flask import Flask, request, jsonify
import pickle
import numpy as np
import os
import base64
from io import BytesIO
from PIL import Image
from network import Network

app = Flask(__name__)
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'models', 'finalModel.pkl')

class CustomUnpickler(pickle.Unpickler):
    def find_class(self, module, name):
        if module == "__main__":
            module = "network"
        return super().find_class(module, name)

def preprocess_image(image):
    normalized_image = (image / np.max(image)) * 255
    normalized_image = normalized_image.astype(np.uint8)
    
    pil_image = Image.fromarray(normalized_image)
    binary_image = pil_image.point(lambda p: 255 if p > 50 else p * 1.5)
    
    return np.array(binary_image)

def custom_load(file):
    return CustomUnpickler(file).load()

with open(MODEL_PATH, 'rb') as file:
    model = custom_load(file)

@app.route("/api/", methods=['GET'])
def index():
    return "<h1> Hello World! </h1>"

@app.route("/api/predict", methods=['POST'])
def predict():
    try:
        data = request.get_json()
        base64img = data['image']
        image_data = base64img.split(',')[1]
        
        img = Image.open(BytesIO(base64.b64decode(image_data)))
        img = img.convert('L')
        img = img.resize((28, 28), Image.Resampling.LANCZOS)
        img_array = np.array(img)    
            
        img_array = 255 - img_array
        img_array = preprocess_image(img_array)
        img_array = img_array.astype(np.float32) / 255.0
        
        img_array = img_array.flatten()
        
        prediction, confidence, activations = model.feedforward_with_activations(img_array)
        
        return jsonify({
            'prediction': int(prediction),
            'confidence': float(confidence),
            'activations': activations
        })
        
    except Exception as e:
        print(f"Error during prediction: {str(e)}")
        return jsonify({'error': str(e)}), 500
    
@app.route("/api/directpredict", methods=['POST'])
def directPredict():
    try:
        data = request.get_json()
        image_array = np.array(data['image']) # these are activations directly returned from the frontend
        
        prediction, confidence, activations = model.feedforward_with_activations(image_array)
        
        return jsonify({
            'prediction': int(prediction),
            'confidence': float(confidence),
            'activations': activations
        })
        
    except Exception as e:
        print(f"Error during prediction: {str(e)}")
        return jsonify({'error': str(e)}), 500
    
if __name__ == '__main__':
    app.run(debug=True)