"""
PHASE 2: Data Cleaning & Preprocessing
Food Order Analysis Project (FoodHub dataset)

Input : data/foodhub_order.csv
Output: data/foodhub_order_cleaned.csv
"""

import pandas as pd
import sys

INPUT_PATH = "data/foodhub_order.csv"
OUTPUT_PATH = "data/foodhub_order_cleaned.csv"


def load_data(path):
    try:
        return pd.read_csv(path)
    except FileNotFoundError:
        print(f"ERROR: '{path}' not found. Run Phase 1 first.")
        sys.exit(1)
    except Exception as e:
        print(f"ERROR loading data: {e}")
        sys.exit(1)


def remove_duplicates(df):
    before = len(df)
    df = df.drop_duplicates(subset="order_id")
    print(f"Duplicate orders removed: {before - len(df)}")
    return df


def standardize_text_columns(df):
    for col in ["restaurant_name", "cuisine_type", "day_of_the_week"]:
        try:
            df[col] = df[col].str.strip().str.title()
        except (KeyError, AttributeError) as e:
            print(f"Warning: could not standardize '{col}': {e}")
    return df


def handle_rating_column(df):
    """'Not given' is a valid response meaning the customer did not rate the order.
    We keep it as its own category rather than treating it as missing data."""
    try:
        df["rating"] = df["rating"].astype(str).str.strip()
        df["is_rated"] = (df["rating"] != "Not given").astype(int)
        print(f"Orders with a rating: {df['is_rated'].sum()} / {len(df)}")
    except KeyError:
        print("Warning: 'rating' column not found.")
    return df


def run_sanity_checks(df):
    checks = {
        "cost_of_the_order": lambda s: (s > 0).all(),
        "food_preparation_time": lambda s: (s > 0).all(),
        "delivery_time": lambda s: (s > 0).all(),
    }
    all_passed = True
    for col, check_fn in checks.items():
        try:
            if not check_fn(df[col]):
                print(f"WARNING: sanity check failed for '{col}'")
                all_passed = False
        except KeyError:
            print(f"Warning: column '{col}' not found.")
    if all_passed:
        print("All value-range sanity checks passed.")
    return df


def flag_cost_outliers(df):
    try:
        Q1, Q3 = df["cost_of_the_order"].quantile([0.25, 0.75])
        IQR = Q3 - Q1
        lower, upper = Q1 - 1.5 * IQR, Q3 + 1.5 * IQR
        df["is_cost_outlier"] = (df["cost_of_the_order"] < lower) | (df["cost_of_the_order"] > upper)
        print(f"Order-value outliers flagged (kept): {df['is_cost_outlier'].sum()}")
    except KeyError:
        print("Warning: 'cost_of_the_order' not found, skipping outlier flag.")
    return df


def drop_out_of_scope_columns(df):
    """This project is scoped to food ORDER analysis (value, cuisine, ratings, volume) --
    not delivery logistics. food_preparation_time and delivery_time are dropped here
    so they don't influence any downstream analysis or modeling."""
    drop_cols = [c for c in ["food_preparation_time", "delivery_time"] if c in df.columns]
    if drop_cols:
        df = df.drop(columns=drop_cols)
        print(f"Dropped out-of-scope delivery-related columns: {drop_cols}")
    return df


def main():
    df = load_data(INPUT_PATH)
    print(f"Starting rows: {len(df)}")

    df = remove_duplicates(df)
    df = standardize_text_columns(df)
    df = handle_rating_column(df)
    df = run_sanity_checks(df)
    df = flag_cost_outliers(df)
    df = drop_out_of_scope_columns(df)

    print(f"\nFinal shape: {df.shape}")
    try:
        df.to_csv(OUTPUT_PATH, index=False)
        print(f"Saved cleaned dataset to {OUTPUT_PATH}")
    except Exception as e:
        print(f"ERROR saving cleaned dataset: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
