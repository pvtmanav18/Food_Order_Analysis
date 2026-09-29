from fastapi import FastAPI, HTTPException, Query, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Optional
import pandas as pd
import joblib
import os
import json

app = FastAPI(title="FoodHub Analytics API", version="2.0.0")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Paths - BASE_DIR points directly to backend/ folder
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "data", "foodhub_order.csv")
CLEANED_DATA_PATH = os.path.join(BASE_DIR, "data", "foodhub_order_cleaned.csv")
UPLOADED_DATA_PATH = os.path.join(BASE_DIR, "data", "uploaded_food_order.csv")
MODEL_PATH = os.path.join(BASE_DIR, "models", "random_forest.pkl")

# Mount Static directories if they exist
eda_dir = os.path.join(BASE_DIR, "eda_plots")
eval_dir = os.path.join(BASE_DIR, "eval_plots")
assets_dir = os.path.join(BASE_DIR, "doc_assets")
docs_dir = os.path.join(BASE_DIR, "documentation")

if os.path.exists(eda_dir):
    app.mount("/static/eda", StaticFiles(directory=eda_dir), name="eda")
if os.path.exists(eval_dir):
    app.mount("/static/eval", StaticFiles(directory=eval_dir), name="eval")
if os.path.exists(assets_dir):
    app.mount("/static/assets", StaticFiles(directory=assets_dir), name="assets")
if os.path.exists(docs_dir):
    app.mount("/static/docs", StaticFiles(directory=docs_dir), name="docs")

# Load model globally
rf_model = None
try:
    if os.path.exists(MODEL_PATH):
        rf_model = joblib.load(MODEL_PATH)
except Exception as e:
    print(f"Failed to load model: {e}")

class PredictionInput(BaseModel):
    cost_of_the_order: float
    is_weekend: int
    Cuisine_American: int = 0
    Cuisine_Chinese: int = 0
    Cuisine_Indian: int = 0
    Cuisine_Italian: int = 0
    Cuisine_Japanese: int = 0
    Cuisine_Mediterranean: int = 0
    Cuisine_Mexican: int = 0
    Cuisine_Middle_Eastern: int = 0
    Cuisine_Other: int = 0
    restaurant_order_count: int
    Price_Low: int
    Price_Medium: int
    Price_High: int

@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "model_loaded": rf_model is not None,
        "data_loaded": os.path.exists(DATA_PATH)
    }

@app.get("/api/stats")
def get_stats():
    target_data = UPLOADED_DATA_PATH if os.path.exists(UPLOADED_DATA_PATH) else (CLEANED_DATA_PATH if os.path.exists(CLEANED_DATA_PATH) else DATA_PATH)
    if not os.path.exists(target_data):
        raise HTTPException(status_code=404, detail="Data file not found")
    
    df = pd.read_csv(target_data)
    total_orders = len(df)
    avg_cost = round(float(df['cost_of_the_order'].mean()), 2)
    min_cost = round(float(df['cost_of_the_order'].min()), 2)
    max_cost = round(float(df['cost_of_the_order'].max()), 2)
    total_restaurants = int(df['restaurant_name'].nunique())
    
    # Calculate average rating (excluding 'Not given')
    ratings = pd.to_numeric(df['rating'], errors='coerce')
    avg_rating = round(float(ratings.mean()), 2) if not ratings.isna().all() else 0.0
    unrated_orders = int((df['rating'] == 'Not given').sum())
    unrated_pct = round((unrated_orders / total_orders) * 100, 1)

    # Orders by day of the week
    weekend_orders = int((df['day_of_the_week'] == 'Weekend').sum())
    weekday_orders = total_orders - weekend_orders
    weekend_pct = round((weekend_orders / total_orders) * 100, 1)
    
    return {
        "total_orders": total_orders,
        "avg_cost": avg_cost,
        "min_cost": min_cost,
        "max_cost": max_cost,
        "total_restaurants": total_restaurants,
        "avg_rating": avg_rating,
        "unrated_orders": unrated_orders,
        "unrated_pct": unrated_pct,
        "weekend_orders": weekend_orders,
        "weekday_orders": weekday_orders,
        "weekend_pct": weekend_pct
    }

@app.get("/api/cuisines")
def get_cuisines():
    target_data = UPLOADED_DATA_PATH if os.path.exists(UPLOADED_DATA_PATH) else (CLEANED_DATA_PATH if os.path.exists(CLEANED_DATA_PATH) else DATA_PATH)
    if not os.path.exists(target_data):
        raise HTTPException(status_code=404, detail="Data file not found")
        
    df = pd.read_csv(target_data)
    cuisine_counts = df['cuisine_type'].value_counts()
    
    # Calculate avg cost per cuisine
    avg_costs = df.groupby('cuisine_type')['cost_of_the_order'].mean().round(2).to_dict()
    
    return {
        "labels": list(cuisine_counts.index),
        "data": [int(x) for x in cuisine_counts.values],
        "avg_costs": avg_costs
    }

@app.get("/api/eda/plots")
def get_eda_plots():
    plots = [
        {
            "id": "eda_01",
            "filename": "01_order_value_distribution.png",
            "title": "Order Value Distribution",
            "category": "Order Characteristics",
            "summary": "Right-skewed distribution peaking around $12-$16 with a maximum of $35.41. Most orders fall within the $10-$20 range.",
            "insight": "Mean order value is $16.50, standard deviation is $7.48. No statistical outliers were detected via IQR."
        },
        {
            "id": "eda_02",
            "filename": "02_top_cuisines.png",
            "title": "Top Cuisines by Order Volume",
            "category": "Cuisine Analysis",
            "summary": "American (584 orders) and Japanese (470 orders) represent over 55% of all orders, followed by Italian (298) and Chinese (215).",
            "insight": "Top 4 cuisines account for 82.5% of total platform volume, suggesting concentrated customer culinary preference."
        },
        {
            "id": "eda_03",
            "filename": "03_top_restaurants.png",
            "title": "Top 10 High-Volume Restaurants",
            "category": "Restaurant Performance",
            "summary": "Shake Shack, The Meatball Shop, Blue Ribbon Sushi, and Blue Ribbon Fried Chicken dominate the order distribution.",
            "insight": "A small fraction of popular brands generate disproportionate traffic and high customer trust."
        },
        {
            "id": "eda_04",
            "filename": "04_orders_by_day_type.png",
            "title": "Orders by Day Type (Weekend vs Weekday)",
            "category": "Temporal Patterns",
            "summary": "Weekends account for 1,351 orders (71.2%), while weekdays represent 547 orders (28.8%).",
            "insight": "Food ordering demand peaks heavily on Saturday and Sunday; staffing and promotional pushes should align with weekends."
        },
        {
            "id": "eda_05",
            "filename": "05_rating_distribution.png",
            "title": "Customer Rating Distribution",
            "category": "Customer Satisfaction",
            "summary": "38.8% of orders are 'Not given'. Of rated orders, 588 are 5-star, 386 are 4-star, and 188 are 3-star.",
            "insight": "Rated orders are predominantly positive (5-star is the mode), but the massive unrated share represents a major engagement gap."
        },
        {
            "id": "eda_06",
            "filename": "06_cost_by_cuisine.png",
            "title": "Cost of Order by Cuisine Type",
            "category": "Pricing & Cuisine",
            "summary": "French, Southern, and Spanish exhibit higher average order costs ($19-$22), while Korean and Vietnamese average lower.",
            "insight": "Cuisine type has a clear influence on average order value, informing premium pricing and commission tiers."
        },
        {
            "id": "eda_07",
            "filename": "07_cost_by_day_type.png",
            "title": "Order Cost by Day Type",
            "category": "Temporal Patterns",
            "summary": "Average order cost is virtually identical across Weekday ($16.40) and Weekend ($16.54).",
            "insight": "While weekend volume surges by 2.5x, customers spend approximately the same per order regardless of day."
        },
        {
            "id": "eda_08",
            "filename": "08_rating_vs_cost.png",
            "title": "Rating vs Order Cost",
            "category": "Satisfaction Drivers",
            "summary": "Rating distribution across cost buckets shows minimal variation between 3-star, 4-star, and 5-star orders.",
            "insight": "Order price alone does not drive higher satisfaction, explaining why ML models based on transactional features hit baseline limits."
        }
    ]
    return {"plots": plots, "base_url": "/static/eda"}

@app.get("/api/eval/summary")
def get_eval_summary():
    comparison_file = os.path.join(BASE_DIR, "results", "final_model_comparison.csv")
    eval_file = os.path.join(BASE_DIR, "eval_plots", "evaluation_summary.csv")
    feat_file = os.path.join(BASE_DIR, "models", "feature_importance.csv")

    comparison = []
    if os.path.exists(comparison_file):
        df_comp = pd.read_csv(comparison_file)
        comparison = df_comp.to_dict(orient="records")

    features = []
    if os.path.exists(feat_file):
        df_feat = pd.read_csv(feat_file)
        df_feat.columns = ["feature", "importance"]
        df_feat['importance'] = df_feat['importance'].astype(float).round(4)
        features = df_feat.to_dict(orient="records")

    plots = [
        {
            "id": "eval_01",
            "filename": "01_confusion_matrix_lr.png",
            "title": "Logistic Regression Confusion Matrix",
            "model": "Logistic Regression",
            "description": "Balanced predictions across classes, with accuracy of 47.4% and F1 score of 0.438."
        },
        {
            "id": "eval_02",
            "filename": "02_confusion_matrix_rf.png",
            "title": "Random Forest Confusion Matrix",
            "model": "Random Forest",
            "description": "Tuned Random Forest achieving F1 score of 0.472 and accuracy of 47.6%."
        },
        {
            "id": "eval_03",
            "filename": "03_model_comparison.png",
            "title": "Model Performance Comparison",
            "model": "Benchmark",
            "description": "Direct comparison across Accuracy, Precision, Recall, and F1 between Random Forest and Logistic Regression."
        },
        {
            "id": "eval_04",
            "filename": "04_feature_importance.png",
            "title": "Random Forest Feature Importance",
            "model": "Feature Analysis",
            "description": "Order cost (32.8%) and restaurant popularity (21.4%) dominate predictive weights."
        }
    ]

    return {
        "comparison": comparison,
        "features": features,
        "plots": plots,
        "base_url": "/static/eval",
        "baseline_accuracy": 0.513,
        "key_takeaway": "Random Forest slightly outperformed Logistic Regression (F1: 0.472 vs 0.438), but neither surpassed the 0.513 majority-class baseline. Customer satisfaction is driven by experiential factors (food quality, order accuracy) beyond transactional order attributes."
    }

@app.get("/api/orders")
def get_orders(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    cuisine: Optional[str] = None,
    day_type: Optional[str] = None,
    rating: Optional[str] = None,
    search: Optional[str] = None
):
    target_data = UPLOADED_DATA_PATH if os.path.exists(UPLOADED_DATA_PATH) else (CLEANED_DATA_PATH if os.path.exists(CLEANED_DATA_PATH) else DATA_PATH)
    if not os.path.exists(target_data):
        raise HTTPException(status_code=404, detail="Data file not found")
        
    df = pd.read_csv(target_data)

    if cuisine and cuisine != 'All':
        df = df[df['cuisine_type'].str.lower() == cuisine.lower()]
    if day_type and day_type != 'All':
        df = df[df['day_of_the_week'].str.lower() == day_type.lower()]
    if rating and rating != 'All':
        df = df[df['rating'].astype(str) == str(rating)]
    if search:
        search_lower = search.lower()
        df = df[
            df['restaurant_name'].str.lower().str.contains(search_lower, na=False) |
            df['order_id'].astype(str).str.contains(search_lower, na=False)
        ]

    total_filtered = len(df)
    start_idx = (page - 1) * limit
    end_idx = start_idx + limit
    sliced = df.iloc[start_idx:end_idx]

    # Convert to clean dict list
    records = []
    for _, row in sliced.iterrows():
        records.append({
            "order_id": int(row['order_id']),
            "customer_id": int(row['customer_id']),
            "restaurant_name": str(row['restaurant_name']),
            "cuisine_type": str(row['cuisine_type']),
            "cost_of_the_order": round(float(row['cost_of_the_order']), 2),
            "day_of_the_week": str(row['day_of_the_week']),
            "rating": str(row['rating'])
        })

    return {
        "total": total_filtered,
        "page": page,
        "limit": limit,
        "total_pages": (total_filtered + limit - 1) // limit,
        "orders": records
    }

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Invalid file type. Only CSV is allowed.")
    contents = await file.read()
    with open(UPLOADED_DATA_PATH, "wb") as f:
        f.write(contents)
    return {"message": "File uploaded successfully", "filename": file.filename}

@app.post("/api/predict")
def predict_rating(input_data: PredictionInput):
    if rf_model is None:
        raise HTTPException(status_code=500, detail="Model is not loaded")
        
    features = pd.DataFrame([{
        "cost_of_the_order": input_data.cost_of_the_order,
        "is_weekend": input_data.is_weekend,
        "Cuisine_American": input_data.Cuisine_American,
        "Cuisine_Chinese": input_data.Cuisine_Chinese,
        "Cuisine_Indian": input_data.Cuisine_Indian,
        "Cuisine_Italian": input_data.Cuisine_Italian,
        "Cuisine_Japanese": input_data.Cuisine_Japanese,
        "Cuisine_Mediterranean": input_data.Cuisine_Mediterranean,
        "Cuisine_Mexican": input_data.Cuisine_Mexican,
        "Cuisine_Middle Eastern": input_data.Cuisine_Middle_Eastern,
        "Cuisine_Other": input_data.Cuisine_Other,
        "restaurant_order_count": input_data.restaurant_order_count,
        "Price_Low": input_data.Price_Low,
        "Price_Medium": input_data.Price_Medium,
        "Price_High": input_data.Price_High
    }])
    
    try:
        proba = rf_model.predict_proba(features)[0]
        prediction = rf_model.predict(features)[0]
        
        return {
            "prediction": int(prediction),
            "probability_high": round(float(proba[1]), 4),
            "probability_low": round(float(proba[0]), 4),
            "class_label": "High Rating (4-5 Stars)" if prediction == 1 else "Low/Medium Rating (3 Stars or Lower)",
            "confidence_pct": round(float(max(proba)) * 100, 1)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/results/conclusion")
def get_conclusion():
    conclusion_path = os.path.join(BASE_DIR, "results", "conclusion.txt")
    if not os.path.exists(conclusion_path):
        raise HTTPException(status_code=404, detail="Conclusion file not found")
    with open(conclusion_path, "r", encoding="utf-8") as f:
        return {"text": f.read()}

@app.get("/api/results/comparison")
def get_comparison():
    comparison_path = os.path.join(BASE_DIR, "results", "final_model_comparison.csv")
    if not os.path.exists(comparison_path):
        raise HTTPException(status_code=404, detail="Comparison file not found")
    df = pd.read_csv(comparison_path)
    return {"data": df.to_dict(orient="records")}

@app.get("/api/project-info")
def get_project_info():
    return {
        "title": "Food Order Analysis Using Data Science",
        "institution": "Ahmedabad Institute of Technology",
        "department": "Department of Computer Engineering",
        "subject": "Python for Data Science (BE05000231)",
        "term": "5th Semester -- CE-C",
        "scope": "Food order characteristics (order value, cuisine, restaurant, timing, rating). Delivery logistics (preparation & delivery time) excluded.",
        "dataset_records": 1898,
        "unique_restaurants": 178,
        "unique_customers": 1200,
        "pdf_url": "/static/docs/Food_Order_Analysis_Documentation.pdf",
        "diagrams": {
            "architecture": "/static/assets/architecture.png",
            "flowchart": "/static/assets/flowchart.png",
            "module_diagram": "/static/assets/module_diagram.png"
        }
    }

@app.get("/api/docs/download")
def download_documentation():
    pdf_path = os.path.join(BASE_DIR, "documentation", "Food_Order_Analysis_Documentation.pdf")
    if not os.path.exists(pdf_path):
        raise HTTPException(status_code=404, detail="Documentation PDF not found")
    return FileResponse(
        pdf_path,
        media_type="application/pdf",
        filename="Food_Order_Analysis_Documentation.pdf"
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
