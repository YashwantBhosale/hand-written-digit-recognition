import numpy as np
import gc

class Network:
    def __init__(self, layers, pixels=784):
        self.layers = layers
        self.pixels = pixels
        self.init_params()

    def init_params(self):
      # Force float32 during initialization
      self.W = [np.random.randn(y, x).astype(np.float32) * np.sqrt(2/x) 
             for x, y in zip(self.layers[:-1], self.layers[1:])]
      self.b = [np.zeros((y, 1), dtype=np.float32) 
             for y in self.layers[1:]]

    def relu(self, z):
        return np.maximum(0, z)

    def drelu(self, z):
        return np.where(z > 0, 1, 0)

    def softmax(self, z):
        exp_z = np.exp(z - np.max(z, axis=0, keepdims=True))
        return exp_z / np.sum(exp_z, axis=0, keepdims=True)

    def forward_prop(self, x):
        Z = []
        activations = [x]

        for i in range(len(self.layers) - 1):
            z = np.dot(self.W[i], activations[-1]) + self.b[i]
            Z.append(z)

            # Use ReLU for hidden layers, softmax for output
            activation = self.relu(z) if i < len(self.layers) - 2 else self.softmax(z)
            activations.append(activation)

        return Z, activations

    def one_hot_encoding(self, y):
        one_hot = np.zeros((10, 1)) # this should rather be not hardcoded but i am doing it anyway
        one_hot[y] = 1
        return one_hot

    def back_prop(self, x, y):
        nabla_weights = [np.zeros_like(w, dtype=np.float32) for w in self.W]
        nabla_biases = [np.zeros_like(b, dtype=np.float32) for b in self.b]

        # Feed input activations forward
        Z, activations = self.forward_prop(x)

        '''
          Now, after forward propagation we will have to propagate the error
          in the output to previous layers (except obviously input layer) in
          order to adjust weights and biases to adjust accordingly.
        '''

        # Output layer error
        delta = activations[-1] - self.one_hot_encoding(y)

        # Store gradients for output layer
        nabla_weights[-1] = np.dot(delta, activations[-2].T)
        nabla_biases[-1] = delta

        # Backpropagate through hidden layers
        for l in range(2, len(self.layers)):
            delta = np.dot(self.W[-l+1].T, delta) * self.drelu(Z[-l])
            nabla_biases[-l] = delta
            nabla_weights[-l] = np.dot(delta, activations[-l-1].T)

        return nabla_weights, nabla_biases

    def update_mini_batch(self, batch, learning_rate):
        nabla_w = [np.zeros_like(w, dtype=np.float32) for w in self.W]
        nabla_b = [np.zeros_like(b, dtype=np.float32) for b in self.b]
        
        for x, y in batch:
            delta_nabla_w, delta_nabla_b = self.back_prop(x, y)
            nabla_w = [nw + dnw for nw, dnw in zip(nabla_w, delta_nabla_w)]
            nabla_b = [nb + dnb for nb, dnb in zip(nabla_b, delta_nabla_b)]
        
        # Weight decay (L2 regularization)
        decay_rate = 0.0001
        self.W = [(1 - learning_rate * decay_rate) * w - (learning_rate/len(batch)) * nw 
                  for w, nw in zip(self.W, nabla_w)]
        self.b = [b - (learning_rate/len(batch)) * nb 
                 for b, nb in zip(self.b, nabla_b)]

    def train_model(self, train_data, train_labels, test_data, test_labels, epochs=30, batch_size=32, learning_rate=0.1):
        self.train = train_data.astype(np.float32) / 255.0
        self.train_labels = train_labels
        self.test = test_data.astype(np.float32) / 255.0
        self.test_labels = test_labels

        train_data = [(x.reshape(self.pixels, 1), y) for x, y in zip(self.train, self.train_labels)]
        test_data = [(x.reshape(self.pixels, 1), y) for x, y in zip(self.test, self.test_labels)]

        n_train = len(train_data)
        best_accuracy = 0
        maxStreak = 3
        currentStreak = 0

        for epoch in range(epochs):
            # Shuffle training data
            np.random.shuffle(train_data)

            # Process mini-batches
            for i in range(0, n_train, batch_size):
                batch = train_data[i:i + batch_size]
                self.update_mini_batch(batch, learning_rate)

            # Evaluate accuracy
            correct = sum(int(np.argmax(self.forward_prop(x)[1][-1]) == y)
                         for (x, y) in test_data)
            accuracy = (correct / len(test_data)) * 100

            print(f"Epoch {epoch + 1}: {correct}/{len(test_data)} = {accuracy:.2f}%")

            # early stopping based on streak
            if accuracy > best_accuracy:
                best_accuracy = accuracy
                currentStreak = 0
            else:
                currentStreak += 1

            if currentStreak >= maxStreak:
                print(f"Early stopping at epoch {epoch + 1}")
                break

            # adaptive learning rate (omitted for small size model)
            # if accuracy > best_accuracy:
            #     best_accuracy = accuracy
            # elif accuracy < best_accuracy - 1:  # Allow small fluctuations
            #     learning_rate *= 0.5  # Reduce learning rate if accuracy drops
            #     print(f"Reducing learning rate to {learning_rate}")
        
        del self.train
        del self.train_labels
        del self.test
        del self.test_labels

        gc.collect()


    def predict(self, x):
        return np.argmax(self.forward_prop(x.reshape(self.pixels, 1))[1][-1])
    

    def sigmoid(z):
        return 1.0/(1.0+np.exp(-z))
    
    def feedforward_with_activations(self, x):
        x = x.reshape(self.pixels, 1)
        activations = [x]
        
        for i in range(len(self.layers) - 1):
            z = np.dot(self.W[i], activations[-1]) + self.b[i]
            
            if i < len(self.layers) - 2:
                activation = self.relu(z)
            else:
                activation = self.softmax(z)
                
            activations.append(activation)
        
        final_output = activations[-1]
        prediction = np.argmax(final_output)
        confidence = float(np.max(final_output))
        
        activations_list = [act.flatten().tolist() for act in activations]
        
        return prediction, confidence, activations_list

