import pandas as pd
from xgboost import XGBRegressor
import joblib
from sklearn.model_selection import train_test_split

data = pd.read_csv('ecommerce_data_discounted_final.csv')
df = pd.DataFrame(data)

df = df.drop_duplicates()
df = df.dropna()

df = pd.get_dummies(df, columns=["product_name", "brand"])
product_columns = [col for col in df.columns if col.startswith("product_name_") or col.startswith("brand_")]

feature_cols = ["price", "discount", "month", "year"] + product_columns

X = df[feature_cols]
y = df["quantity_sold"]

df = df.sample(frac=1, random_state=42).reset_index(drop=True)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = XGBRegressor(
    n_estimators=80,
    max_depth=4,
    learning_rate=0.3,
    random_state=42
)
model.fit(X_train, y_train)
y_pred = model.predict(X_test)
joblib.dump(model, 'model.pkl')
