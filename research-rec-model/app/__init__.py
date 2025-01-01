from flask import Flask
from flask_cors import CORS
from model.model_loader import model
from app.routes import routes
from model.loader import interaction_matrix




def create_app():
    app = Flask(__name__)
    CORS(app)
    
    
    app.register_blueprint(routes)


    # Load the model
    if model is None:
        print("Model failed to load. Ensure the file path is correct and the model is valid.")
        raise RuntimeError("Failed to load the model. Check the model path and file format.")
    
    
    if interaction_matrix is None:
        print("Interaction matrix failed to load. Ensure the file path is correct and the matrix is valid.")
        raise RuntimeError("Failed to load the interaction matrix. Check the file path and file format.")


    return app
