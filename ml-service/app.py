from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import joblib

app = FastAPI()

# 🔹 Load trained Decision Tree model
model = joblib.load("decision_tree_credit_model.pkl")

# 🔹 Load encoder (only one categorical feature left)
home_encoder = joblib.load("person_home_ownership_encoder.pkl")


# 🔹 Input schema (must match frontend + training)
class InputData(BaseModel):
    person_age: int
    person_income: float
    person_emp_length: float
    person_home_ownership: str
    loan_percent_income: float


@app.post("/predict")
def predict(data: InputData):

    # 🔹 Prepare input dataframe
    input_df = pd.DataFrame([{
        "person_age": data.person_age,
        "person_income": data.person_income,
        "person_emp_length": data.person_emp_length,
        "person_home_ownership": home_encoder.transform(
            [data.person_home_ownership]
        )[0],
        "loan_percent_income": data.loan_percent_income
    }])

    # 🔹 Prediction
    pred = model.predict(input_df)[0]

    return {
        "risk": "HIGH RISK" if pred == 1 else "LOW RISK"
    }
