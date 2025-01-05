from flask import Flask, request, jsonify
import pickle
import matplotlib.image as mpimg
import numpy as np
import os
import pickle

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

@app.route("/api/predict")
def predict():
    testImg = mpimg.imread('test.png')
    testImg = np.array(testImg)
    testImg = testImg.reshape(1, 784)
    
    prediction = model.predict(testImg)
    
    return jsonify({'prediction': int(prediction)})