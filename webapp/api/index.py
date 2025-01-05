from flask import Flask, request, jsonify
import pickle
import matplotlib.image as mpimg
import numpy as np
import os
import pickle
import base64
from io import BytesIO

from network import Network

app = Flask(__name__)
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'models', 'finalModel.pkl')

class CustomUnpickler(pickle.Unpickler):
    def find_class(self, module, name):
        if module == "__main__":
            module = "network"
        return super().find_class(module, name)

def custom_load(file):
    return CustomUnpickler(file).load()

with open(MODEL_PATH, 'rb') as file:
    model = custom_load(file)

@app.route("/api/python")
def hello_world():
    return "<p>Hello, World!</p>"

from flask import request, jsonify
from PIL import Image
import numpy as np
import base64
from io import BytesIO

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
        img_array = img_array.astype(np.float32) / 255.0

        img_array = img_array.flatten().reshape(1, 784)
        print(img_array)
        prediction = model.predict(img_array)
        save_debug_image(img_array.reshape(28, 28))
        
        return jsonify({'prediction': int(prediction)})
        
    except Exception as e:
        print(f"Error during prediction: {str(e)}")
        return jsonify({'error': str(e)}), 500

def save_debug_image(img_array, filename="debug.png"):
    img = Image.fromarray((img_array * 255).astype(np.uint8))
    img.save(filename)