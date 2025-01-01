import tensorflow as tf

# Define your custom function if needed
def absolute_difference(inputs):
    return tf.abs(inputs[0] - inputs[1])

def load_model(model_path):
    try:
        # Add custom objects if any
        custom_objects = {
            'absolute_difference': absolute_difference
        }
        
        # Load the model
        model = tf.keras.models.load_model(
            model_path,
            custom_objects=custom_objects,
            compile=True
        )
        print("Model loaded successfully!")
        return model
    except Exception as e:
        print(f"Error loading model: {e}")
        return None
    
model = load_model("model/best_ncf_model.keras")
