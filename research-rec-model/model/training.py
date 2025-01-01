import tensorflow as tf
from tensorflow.keras import layers, models, regularizers
from tensorflow.keras.layers import Dropout, BatchNormalization, Multiply, Dense, Concatenate
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau, ModelCheckpoint
import numpy as np

# Define the custom Lambda function outside the model
def absolute_difference(inputs):
    return tf.abs(inputs[0] - inputs[1])

def build_advanced_ncf_model(
    num_users, 
    num_items, 
    latent_dim=512,  
    dropout_rate=0.4,  
    l2_reg=1e-3,  
    use_advanced_interactions=True  
):
    # Input layers for user and item
    user_input = layers.Input(shape=(1,), name='user_input')
    item_input = layers.Input(shape=(1,), name='item_input')
    
    # Embedding layers
    user_embedding = layers.Embedding(
        num_users, 
        latent_dim, 
        embeddings_regularizer=regularizers.l2(l2_reg),
        embeddings_initializer='glorot_uniform',
        name='user_embedding'
    )(user_input)
    user_embedding = Dropout(0.3, name='user_dropout')(user_embedding)
    
    item_embedding = layers.Embedding(
        num_items, 
        latent_dim, 
        embeddings_regularizer=regularizers.l2(l2_reg),
        embeddings_initializer='glorot_uniform',
        name='item_embedding'
    )(item_input)
    item_embedding = Dropout(0.3, name='item_dropout')(item_embedding)
    
    # Flatten embeddings
    user_vector = layers.Flatten(name='user_flatten')(user_embedding)
    item_vector = layers.Flatten(name='item_flatten')(item_embedding)
    
    # Interaction features
    interaction = Multiply(name='multiply_interaction')([user_vector, item_vector])
    
    # Advanced interaction techniques
    if use_advanced_interactions:
        # Use the custom Lambda function
        abs_diff = layers.Lambda(
            absolute_difference,
            name='absolute_difference'
        )([user_vector, item_vector])
        
        concatenated = layers.Concatenate(name='main_concatenate')([
            user_vector, 
            item_vector, 
            interaction,
            abs_diff
        ])
    else:
        concatenated = layers.Concatenate(name='main_concatenate')([user_vector, item_vector, interaction])
    
    # Fully connected layers with named layers
    def dense_block(x, units, dropout_rate, l2_reg, block_number):
        x = Dense(
            units, 
            kernel_regularizer=regularizers.l2(l2_reg),
            name=f'dense_{block_number}'
        )(x)
        x = BatchNormalization(name=f'batch_norm_{block_number}')(x)
        x = layers.LeakyReLU(name=f'leaky_relu_{block_number}')(x)
        x = Dropout(dropout_rate, name=f'dropout_{block_number}')(x)
        return x
    
    x = dense_block(concatenated, 512, dropout_rate, l2_reg, 1)
    x = dense_block(x, 256, dropout_rate, l2_reg, 2)
    x = dense_block(x, 128, dropout_rate, l2_reg, 3)
    
    # Output layer
    output = Dense(1, activation='sigmoid', name='output')(x)
    
    # Build and compile model
    model = models.Model(inputs=[user_input, item_input], outputs=output, name='ncf_model')
    
    # Compile with custom metrics
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-4, clipnorm=1.0),
        loss=tf.keras.losses.BinaryCrossentropy(label_smoothing=0.1),
        metrics=['accuracy', 
                tf.keras.metrics.AUC(name='auc'),
                tf.keras.metrics.Precision(name='precision'),
                tf.keras.metrics.Recall(name='recall')]
    )
    return model

def create_advanced_callbacks(patience_early_stopping=15, patience_lr_reduction=7, model_checkpoint_path="best_ncf_model.keras"):
    callbacks = [
        EarlyStopping(
            monitor='val_loss',
            patience=patience_early_stopping,
            restore_best_weights=True,
            min_delta=1e-4,
            mode='min'
        ),
        ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.7,
            patience=patience_lr_reduction,
            min_lr=1e-5,
            verbose=1,
            mode='min'
        ),
        ModelCheckpoint(
            model_checkpoint_path,
            save_best_only=True,
            monitor="val_loss",
            save_weights_only=False,
            verbose=1,
            mode='min'
        )
    ]
    return callbacks

# Function to load the model
def load_saved_model(model_path):
    try:
        # Define custom objects
        custom_objects = {
            'absolute_difference': absolute_difference
        }
        
        # Load the model with custom objects
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
    
    
# Training function (similar to your existing approach)
def train_ncf_model(
    interaction_matrix,
    train_samples, 
    train_labels, 
    test_samples, 
    test_labels,
    epochs=150,
    batch_size=128
):
    # Get the number of users and items
    num_users, num_items = interaction_matrix.shape
    
    # Build the model
    ncf_model = build_advanced_ncf_model(num_users, num_items)
    
    # Print model summary
    ncf_model.summary()
    
    # Prepare user and item inputs
    train_user_ids = train_samples[:, 0]
    train_item_ids = train_samples[:, 1]
    test_user_ids = test_samples[:, 0]
    test_item_ids = test_samples[:, 1]
    
    # Create callbacks
    callbacks = create_advanced_callbacks()
    
    # Train the model
    history = ncf_model.fit(
        [train_user_ids, train_item_ids],
        train_labels,
        validation_data=([test_user_ids, test_item_ids], test_labels),
        epochs=epochs,
        batch_size=batch_size,
        callbacks=callbacks,
        verbose=1
    )
    
    return ncf_model, history