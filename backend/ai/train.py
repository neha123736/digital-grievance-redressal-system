import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import pickle

from preprocess import clean_text

# Load dataset
df = pd.read_csv("dataset.csv")

# Clean text
df["text"] = df["text"].apply(clean_text)

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(
    df["text"],
    df["priority"],
    test_size=0.2,
    random_state=42
)

# Text → Vector
vectorizer = TfidfVectorizer(max_features=3000)

X_train_vec = vectorizer.fit_transform(X_train)

# Train model
model = LogisticRegression()

model.fit(X_train_vec, y_train)

# Save files
pickle.dump(model, open("model.pkl", "wb"))
pickle.dump(vectorizer, open("vectorizer.pkl", "wb"))

print("Model trained successfully 🚀")