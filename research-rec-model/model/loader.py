from scipy.sparse import load_npz

def load_interaction_matrix(file_path):
    """
    Load a sparse interaction matrix from a .npz file.
    """
    try:
        # Charger la matrice sparse
        interaction_matrix = load_npz(file_path)
        print("Interaction matrix loaded successfully!")
        print(f"Matrix type: {type(interaction_matrix)}")
        print(f"Matrix shape: {interaction_matrix.shape}")
        return interaction_matrix
    except FileNotFoundError:
        print(f"File not found: {file_path}")
        return None
    except Exception as e:
        print(f"Error loading interaction matrix: {e}")
        return None

interaction_matrix = load_interaction_matrix("model/interaction_matrix.npz")
