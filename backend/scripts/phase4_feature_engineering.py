"""
PHASE 4: Feature Engineering
Food Order Analysis Project (FoodHub dataset)

Goal: prepare features to predict whether an order receives a HIGH rating
(4 or 5) -- a customer-satisfaction classification task grounded in order
characteristics (cost, cuisine, restaurant popularity, day type), NOT delivery
logistics.

Input : data/foodhub_order_cleaned.csv
Output: data/foodhub_order_features.csv
"""

import pandas as pd
import sys

INPUT_PATH = "data/foodhub_order_cleaned.csv"
OUTPUT_PATH = "data/foodhub_order_features.csv"


def load_data(path):
    try:
        return pd.read_csv(path)
    except FileNotFoundError:
        print(f"ERROR: '{path}' not found. Run Phase 2 first.")
        sys.exit(1)
    except Exception as e:
        print(f"ERROR loading data: {e}")
        sys.exit(1)


def create_target(df):
    """High rating = 4 or 5. Orders with '3' or 'Not given' are treated as not-high."""
    try:
        df["high_rating"] = df["rating"].isin(["4", "5"]).astype(int)
        print(f"High-rating orders: {df['high_rating'].sum()} / {len(df)} "
              f"({df['high_rating'].mean()*100:.1f}%)")
    except KeyError:
        print("Warning: 'rating' column not found, cannot create target.")
    return df


def encode_day_type(df):
    try:
        df["is_weekend"] = (df["day_of_the_week"] == "Weekend").astype(int)
    except KeyError:
        print("Warning: 'day_of_the_week' not found.")
    return df


def one_hot_encode_cuisine(df, top_n=8):
    """One-hot encode the most common cuisines; group the rest as 'Other' to
    keep the feature space manageable."""
    try:
        top_cuisines = df["cuisine_type"].value_counts().head(top_n).index
        df["cuisine_grouped"] = df["cuisine_type"].where(df["cuisine_type"].isin(top_cuisines), "Other")
        df = pd.get_dummies(df, columns=["cuisine_grouped"], prefix="Cuisine", drop_first=False)
    except KeyError:
        print("Warning: 'cuisine_type' not found.")
    return df


def add_restaurant_popularity(df):
    """Number of orders each restaurant has received -- a proxy for popularity/trust."""
    try:
        popularity = df.groupby("restaurant_name")["order_id"].transform("count")
        df["restaurant_order_count"] = popularity
    except KeyError:
        print("Warning: could not compute restaurant popularity.")
    return df


def add_price_tier(df):
    """Bucket order value into Low / Medium / High tiers based on quartiles."""
    try:
        df["price_tier"] = pd.qcut(df["cost_of_the_order"], q=3, labels=["Low", "Medium", "High"])
        df = pd.get_dummies(df, columns=["price_tier"], prefix="Price", drop_first=False)
    except (KeyError, ValueError) as e:
        print(f"Warning: could not create price tiers: {e}")
    return df


def finalize_for_modeling(df):
    drop_cols = [c for c in ["order_id", "customer_id", "restaurant_name", "cuisine_type",
                              "day_of_the_week", "rating", "is_cost_outlier", "is_rated"] if c in df.columns]
    df = df.drop(columns=drop_cols)
    bool_cols = df.select_dtypes(include="bool").columns
    df[bool_cols] = df[bool_cols].astype(int)
    return df


def main():
    df = load_data(INPUT_PATH)
    print(f"Starting shape: {df.shape}")

    df = create_target(df)
    df = encode_day_type(df)
    df = one_hot_encode_cuisine(df)
    df = add_restaurant_popularity(df)
    df = add_price_tier(df)
    model_df = finalize_for_modeling(df)

    print(f"\nFinal shape after feature engineering: {model_df.shape}")
    print(f"Final columns:\n{list(model_df.columns)}")

    try:
        model_df.to_csv(OUTPUT_PATH, index=False)
        print(f"\nSaved feature-engineered dataset to {OUTPUT_PATH}")
    except Exception as e:
        print(f"ERROR saving feature-engineered dataset: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
