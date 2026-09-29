"""
PHASE 1: Data Collection & Understanding
Food Order Analysis Project (FoodHub dataset)
"""

import pandas as pd


pd.set_option("display.max_columns", None)
pd.set_option("display.width", 120)

DATA_PATH = "data/foodhub_order.csv"


def load_data(path):
    try:
        return pd.read_csv(path)
    except FileNotFoundError:
        print(f"ERROR: '{path}' not found. Place the dataset in the data/ folder.")
        
    except Exception as e:
        print(f"ERROR loading data: {e}")
        


def show_shape(df):
    print("=" * 60); print("1. SHAPE OF THE DATASET"); print("=" * 60)
    print(f"Rows: {df.shape[0]}, Columns: {df.shape[1]}\n")


def show_head(df):
    print("=" * 60); print("2. FIRST 5 ROWS"); print("=" * 60)
    print(df.head(), "\n")


def show_info(df):
    print("=" * 60); print("3. DATA TYPES & INFO"); print("=" * 60)
    print(df.info(), "\n")


def show_numeric_summary(df):
    print("=" * 60); print("4. NUMERICAL SUMMARY STATISTICS"); print("=" * 60)
    print(df.describe(), "\n")


def show_categorical_summary(df):
    print("=" * 60); print("5. CATEGORICAL COLUMN OVERVIEW"); print("=" * 60)
    for col in ["restaurant_name", "cuisine_type", "day_of_the_week", "rating"]:
        if col in df.columns:
            print(f"\n--- {col} ({df[col].nunique()} unique) ---")
            print(df[col].value_counts().head(10))


def show_missing_values(df):
    print("\n" + "=" * 60); print("6. MISSING VALUES"); print("=" * 60)
    missing = df.isnull().sum()
    non_zero = missing[missing > 0]
    print(non_zero if not non_zero.empty else "No missing (NaN) values found.")
    print("\nNote: 'rating' contains a 'Not given' category rather than NaN -- "
          "this is a valid response, not missing data, and is handled in Phase 2.\n")


def show_duplicates(df):
    print("=" * 60); print("7. DUPLICATE ROWS"); print("=" * 60)
    print(f"Number of duplicate rows: {df.duplicated().sum()}")
    print(f"Duplicate order_ids: {df['order_id'].duplicated().sum()}\n")


def show_target_overview(df):
    print("=" * 60); print("8. KEY BUSINESS METRICS OVERVIEW"); print("=" * 60)
    print(f"Total orders: {len(df)}")
    print(f"Unique customers: {df['customer_id'].nunique()}")
    print(f"Unique restaurants: {df['restaurant_name'].nunique()}")
    print(f"Total revenue (sum of cost_of_the_order): ${df['cost_of_the_order'].sum():,.2f}")
    print(f"Average order value: ${df['cost_of_the_order'].mean():.2f}\n")


def main():
    df = load_data(DATA_PATH)
    show_shape(df)
    show_head(df)
    show_info(df)
    show_numeric_summary(df)
    show_categorical_summary(df)
    show_missing_values(df)
    show_duplicates(df)
    show_target_overview(df)
    print("Phase 1 complete.")


if __name__ == "__main__":
    main()
