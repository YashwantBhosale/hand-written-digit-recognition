## Overview
This project demonstrates working of a simple neural network using the MNIST dataset. The special thing about this project is that it is implemented only using numpy and no other libraries. The neural network is trained using the backpropagation algorithm. The neural network is trained on the MNIST dataset and is able to achieve an accuracy of 97.8% on the test dataset.
The project also contains a simple web interface to draw digits and predict the digit using the trained neural network.

## About the project
The aim was to understand the working of a neural network and implement it from scratch. The project is divided into two parts:
1. Training the neural network using the MNIST dataset
2. Creating a simple web interface to draw digits and predict the digit using the trained neural network.

The neural network is trained using the MNIST dataset. The dataset contains 60,000 training images and 10,000 test images. Each image is of size 28x28 pixels. The neural network has an input layer of 784 neurons, two hidden layers of 128 neurons and 64 neurons and finally, an output layer of 10 neurons. The neural network is trained using the backpropagation algorithm.

1. Although it achieves an accuracy of 97.8% on the test dataset, the neural network is not perfect because it captures very straightforward patterns. For example, it fails to predict the digit 4 when the top horizontal line is missing. This is because the neural network is not deep enough to capture such patterns.
2. You will find another notebook in the project which uses pytorch library to train the neural network (credit: [Mehmood Deshmukh](https://github.com/Mehmood-Deshmukh)). it achieves far better accuracy almost above 99% on the test dataset.
3. The web interface is created using Flask + React (Please don't open it on mobile :p). The web interface allows you to draw digits and predict the digit using the trained neural network. The web interface is hosted on vercel and can be accessed [here](https://hand-written-digit-recognition-main.vercel.app/).

## Notebooks
1. [Neural Network using numpy](/hand_written_digit_recognition.ipynb)
2. [Neural Network using pytorch](/resnet.ipynb)

## Reference and inspiration
1. **[3Blue1Brown's Video on Neural Network](https://www.youtube.com/watch?v=aircAruvnKk)** This video explained neural network so good that it inspired me to implement it from scratch. It doesnt talk about code but the math behind it and why does it make sense for layered network like neural network to work. Whole series is worth watching.
2. **[Michael Nielsen's Book on Neural Network and Deep Learning](http://neuralnetworksanddeeplearning.com/)** This book is the main reference for most of the code in the project. The book explains every concept related to neural network in fairly simple and intuitive way. The book also explains the backpropagation algorithm in detail.


## Authors
- Github: [Yashwant Bhosale](https://github.com/YashwantBhosale)
- LinkedIn: [Yashwant Bhosale](https://www.linkedin.com/in/yashwant-bhosale-4ab062292/)
- Github: [Mehmood Deshmukh](https://github.com/Mehmood-Deshmukh)
- LinkedIn: [Mehmood Deshmukh](https://www.linkedin.com/in/mehmood-deshmukh-93533a2a7/)
