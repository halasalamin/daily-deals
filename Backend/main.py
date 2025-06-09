from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import joblib
import json
from fastapi import HTTPException
try:
    model = joblib.load("model.pkl")
    print("Model loaded!")
except Exception as e:
    print("Error loading model:", e)

try:
    with open("columns.json", "r") as f:
        column_order = json.load(f)
    print("Column order loaded!")
except Exception as e:
    print("Error loading column order:", e)


product_columns = [col for col in column_order if col.startswith("product_name_")]
brand_columns = [col for col in column_order if col.startswith("brand_")]

products = [col.replace("product_name_", "") for col in product_columns]
brands = [col.replace("brand_", "") for col in brand_columns]

class InputData(BaseModel):
    name: str 
    brand: str
    discount: float
    price: float
    month: int
    year: int

app = FastAPI()
@app.post("/")
async def predict(data: InputData):
    input_dict = {col: 0 for col in column_order}

    input_dict["discount"] = data.discount
    input_dict["price"] = data.price
    input_dict["month"] = data.month
    input_dict["year"] = data.year

    if data.name not in products:
        raise HTTPException(status_code=400, detail=f"Unknown product name: {data.name}")
    if data.brand not in brands:
        raise HTTPException(status_code=400, detail=f"Unknown brand: {data.brand}")


    input_dict[f"product_name_{data.name}"] = 1
    input_dict[f"brand_{data.brand}"] = 1

    df_input = pd.DataFrame([input_dict])[column_order]

    prediction = model.predict(df_input)

    return {"prediction": float(prediction[0])}