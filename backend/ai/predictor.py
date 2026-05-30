import pickle
from ai.preprocess import clean_text

# LOAD MODEL + VECTORIZER
model = pickle.load(open("ai/model.pkl", "rb"))
vectorizer = pickle.load(open("ai/vectorizer.pkl", "rb"))

# LABEL MAP
LABELS = {
    0: "Low",
    1: "Medium",
    2: "High"
}

def predict_priority(title: str, description: str):

    text = clean_text(title + " " + description)

    vector = vectorizer.transform([text])

    prediction = model.predict(vector)[0]

    if isinstance(prediction, int):
        priority = LABELS.get(prediction, "Low")
    else:
        priority = prediction

    return {
        "priority": priority
    }