from flask import Blueprint, request, jsonify
import numpy as np
from model.loader import interaction_matrix
from model.model_loader import model
from model.training import  build_advanced_ncf_model
import traceback

routes = Blueprint('routes', __name__)

@routes.route('/popular-articles', methods=['GET'])
def get_popular_articles():
    try:
        # Vérifier que la matrice est chargée
        if interaction_matrix is None:
            raise RuntimeError("Interaction matrix is not loaded.")

        # Calculer les scores de popularité pour chaque article (somme par colonne)
        item_popularity = np.asarray(interaction_matrix.sum(axis=0)).flatten()

        # Trier les indices des articles par score de popularité décroissant
        popular_item_indices = np.argsort(-item_popularity)

        # Nombre d'articles populaires à retourner
        top_n = int(request.args.get('top_n', 10))
        top_n = min(top_n, len(popular_item_indices))  # Éviter de dépasser la taille des données

        # Créer la liste des articles populaires avec leurs scores
        popular_items = [
            {"item_id": int(item_id), "popularity_score": int(item_popularity[item_id])}
            for item_id in popular_item_indices[:top_n]
        ]

        return jsonify({
            "message": f"Top {top_n} popular articles retrieved successfully.",
            "data": popular_items
        })
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": f"Could not calculate popular articles: {e}"}), 500




@routes.route('/predict-popularity', methods=['POST'])
def predict_popularity():
    try:
        data = request.json
        # Vérification des données
        if not all(key in data for key in ('citeulike_id', 'raw_title', 'raw_abstract')):
            return jsonify({"error": "Missing required fields"}), 400

        # Préparer les données pour le modèle
        features = [[data['citeulike_id'], len(data['raw_title']), len(data['raw_abstract'])]]
        prediction = model.predict(features)[0][0]

        return jsonify({
            "article_id": data.get("article_id"),
            "predicted_popularity": prediction
        })
    except Exception as e:
        return jsonify({"error": f"Prediction error: {e}"}), 500
    


@routes.route('/recommendations', methods=['POST'])
def get_recommendations():
    try:
        data = request.json
        user_id = data['user_id']
        new_interactions = data['interactions']  # [{user_id, item_id, interaction_value}, ...]

        print(f"Received data for user_id: {user_id}")
        print(f"New interactions: {new_interactions}")

        # Map user_id to user_index
        user_index = (
            int(user_id) if user_id.isdigit() else hash(user_id) % interaction_matrix.shape[0]
        )
        print(f"Mapped user_id '{user_id}' to user_index: {user_index}")

        # Step 1: Aggregate interaction values for each user-item pair
        aggregated_scores = {}
        for interaction in new_interactions:
            item_index = int(interaction['item_id'])
            value = int(interaction['interaction_value'])
            if (user_index, item_index) not in aggregated_scores:
                aggregated_scores[(user_index, item_index)] = 0
            aggregated_scores[(user_index, item_index)] += value

        print(f"Aggregated scores: {aggregated_scores}")

        # Step 2: Apply threshold and update interaction matrix
        for (user_idx, item_idx), score in aggregated_scores.items():
            # Calculate binary value
            binary_value = 1 if score >= 0.5 else 0
            print(f"Updating interaction matrix: user_index={user_idx}, item_index={item_idx}, binary_value={binary_value}")
            interaction_matrix[user_idx, item_idx] = binary_value

        # Step 3: Get candidate items for recommendations
        all_item_ids = np.arange(interaction_matrix.shape[1])
        interacted_items = np.array(
            [int(interaction['item_id']) for interaction in new_interactions]
        )
        candidate_items = np.setdiff1d(all_item_ids, interacted_items)

        print(f"Interacted items: {interacted_items}")
        print(f"Candidate items for recommendation: {candidate_items}")

        # Predict scores for candidate items
        user_inputs = [np.full(len(candidate_items), user_index), candidate_items]
        predictions = model.predict(user_inputs)

        print(f"Predictions for candidate items: {predictions}")

        # Combine items and scores
        recommendations = sorted(
            zip(candidate_items, predictions),
            key=lambda x: x[1],
            reverse=True,
        )

        # Return top recommendations
        return jsonify({
            "user_id": user_id,
            "recommendations": [
                {"item_id": int(item), "score": float(score)}
                for item, score in recommendations
            ],
        })
    except Exception as e:
        print(f"Error generating recommendations: {e}")
        return jsonify({"error": str(e)}), 500



@routes.route("/retrain-model", methods=["POST"])
def retrain_model():
    global model, interaction_matrix

    try:
        data = request.json
        print(f"Incoming data: {data}")

        if "interactions" not in data:
            return jsonify({"error": "Missing 'interactions' field in request."}), 400

        new_interactions = data["interactions"]

        # Initialize separate arrays for users and items
        user_indices = []
        item_indices = []
        interaction_values = []
        
        # Maps for user and item IDs to indices
        user_map = {}
        item_map = {}
        current_user_idx = 0
        current_item_idx = 0

        # First pass: create mappings
        for interaction in new_interactions:
            user_id = str(interaction['user_id'])
            item_id = str(interaction['item_id'])
            
            # Map user ID
            if user_id not in user_map:
                user_map[user_id] = current_user_idx
                current_user_idx += 1
            
            # Map item ID
            if item_id not in item_map:
                item_map[item_id] = current_item_idx
                current_item_idx += 1

        # Second pass: create training arrays
        for interaction in new_interactions:
            user_id = str(interaction['user_id'])
            item_id = str(interaction['item_id'])
            value = float(interaction['interaction_value'])
            
            user_idx = user_map[user_id]
            item_idx = item_map[item_id]
            
            user_indices.append(user_idx)
            item_indices.append(item_idx)
            interaction_values.append(value)

        # Convert to numpy arrays
        user_indices = np.array(user_indices, dtype=np.int32)
        item_indices = np.array(item_indices, dtype=np.int32)
        interaction_values = np.array(interaction_values, dtype=np.float32)

        # Update interaction matrix size if needed
        new_user_size = max(interaction_matrix.shape[0], len(user_map))
        new_item_size = max(interaction_matrix.shape[1], len(item_map))
        if new_user_size > interaction_matrix.shape[0] or new_item_size > interaction_matrix.shape[1]:
            interaction_matrix = expand_interaction_matrix(interaction_matrix, new_user_size, new_item_size)

        # Update interaction matrix
        for user_idx, item_idx, value in zip(user_indices, item_indices, interaction_values):
            interaction_matrix[user_idx, item_idx] = value


        # Train the model with separate input arrays
        history = model.fit(
            [user_indices, item_indices],  # Input as two separate arrays
            interaction_values,            # Labels
            epochs=10,
            batch_size=256,
            verbose=1
        )

        # Save the updated model
        model.save("model/saved_models/best_model_retrained.keras")

        return jsonify({
            "message": "Model retrained successfully",
            "history": {key: list(val) for key, val in history.history.items()},
            "matrix_shape": interaction_matrix.shape,
            "num_users": len(user_map),
            "num_items": len(item_map)
        }), 200

    except Exception as e:
        print(f"Error during retraining: {e}")
        traceback.print_exc()  # This will print the full stack trace
        return jsonify({"error": str(e)}), 500


def expand_interaction_matrix(matrix, new_user_size, new_item_size):
    """Expand the interaction matrix to accommodate new users/items."""
    expanded_matrix = np.zeros((new_user_size, new_item_size), dtype=matrix.dtype)
    expanded_matrix[:matrix.shape[0], :matrix.shape[1]] = matrix
    return expanded_matrix
