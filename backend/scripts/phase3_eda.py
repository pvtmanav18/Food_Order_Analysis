"""
PHASE 3: Exploratory Data Analysis
Food Order Analysis Project (FoodHub dataset)

Input : data/foodhub_order_cleaned.csv
Output: eda_plots/*.png
"""

import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import os
import sys

sns.set_style("whitegrid")
INPUT_PATH = "data/foodhub_order_cleaned.csv"
PLOT_DIR = "eda_plots"


def load_data(path):
    try:
        return pd.read_csv(path)
    except FileNotFoundError:
        print(f"ERROR: '{path}' not found. Run Phase 2 first.")
        sys.exit(1)
    except Exception as e:
        print(f"ERROR loading data: {e}")
        sys.exit(1)
  

def save_plot(fig_func, filename, *args, **kwargs):
    try:
        fig_func(*args, **kwargs)
        plt.tight_layout()
        plt.savefig(os.path.join(PLOT_DIR, filename), dpi=120)
        plt.close()
        print(f"Saved: {filename}")
    except Exception as e:
        print(f"Warning: could not generate '{filename}': {e}")
        plt.close()


def plot_order_value_distribution(df):
    plt.figure(figsize=(8, 5))
    sns.histplot(df["cost_of_the_order"], bins=30, kde=True, color="steelblue")
    plt.title("Distribution of Order Value")
    plt.xlabel("Order Value ($)")
    plt.ylabel("Number of Orders")


def plot_top_cuisines(df):
    plt.figure(figsize=(8, 5))
    counts = df["cuisine_type"].value_counts().head(10)
    sns.barplot(x=counts.values, y=counts.index, hue=counts.index, palette="viridis", legend=False)
    plt.title("Top 10 Cuisine Types by Order Count")
    plt.xlabel("Number of Orders")
    plt.ylabel("Cuisine")


def plot_top_restaurants(df):
    plt.figure(figsize=(8, 5))
    counts = df["restaurant_name"].value_counts().head(10)
    sns.barplot(x=counts.values, y=counts.index, hue=counts.index, palette="mako", legend=False)
    plt.title("Top 10 Restaurants by Order Count")
    plt.xlabel("Number of Orders")
    plt.ylabel("Restaurant")


def plot_orders_by_day_type(df):
    plt.figure(figsize=(6, 5))
    counts = df["day_of_the_week"].value_counts()
    sns.barplot(x=counts.index, y=counts.values, hue=counts.index, palette="Set2", legend=False)
    plt.title("Order Volume: Weekday vs Weekend")
    plt.xlabel("Day Type")
    plt.ylabel("Number of Orders")


def plot_rating_distribution(df):
    plt.figure(figsize=(7, 5))
    order = ["Not given", "3", "4", "5"]
    counts = df["rating"].value_counts().reindex(order)
    sns.barplot(x=counts.index, y=counts.values, hue=counts.index, palette="coolwarm", legend=False)
    plt.title("Distribution of Customer Ratings")
    plt.xlabel("Rating")
    plt.ylabel("Number of Orders")


def plot_cost_by_cuisine(df):
    plt.figure(figsize=(9, 5))
    top_cuisines = df["cuisine_type"].value_counts().head(8).index
    subset = df[df["cuisine_type"].isin(top_cuisines)]
    sns.boxplot(data=subset, x="cuisine_type", y="cost_of_the_order", hue="cuisine_type",
                palette="Set3", legend=False)
    plt.title("Order Value by Cuisine (Top 8 Cuisines)")
    plt.xlabel("Cuisine")
    plt.ylabel("Order Value ($)")
    plt.xticks(rotation=30, ha="right")


def plot_cost_by_day_type(df):
    plt.figure(figsize=(6, 5))
    sns.boxplot(data=df, x="day_of_the_week", y="cost_of_the_order", hue="day_of_the_week",
                palette="Set1", legend=False)
    plt.title("Order Value: Weekday vs Weekend")
    plt.xlabel("Day Type")
    plt.ylabel("Order Value ($)")


def plot_rating_vs_cost(df):
    plt.figure(figsize=(7, 5))
    order = ["Not given", "3", "4", "5"]
    sns.boxplot(data=df, x="rating", y="cost_of_the_order", order=order, hue="rating",
                palette="pastel", legend=False)
    plt.title("Order Value by Rating Given")
    plt.xlabel("Rating")
    plt.ylabel("Order Value ($)")


def print_key_findings(df):
    print("=" * 60); print("KEY EDA FINDINGS"); print("=" * 60)
    print(f"\nTotal revenue: ${df['cost_of_the_order'].sum():,.2f}")
    print(f"Average order value: ${df['cost_of_the_order'].mean():.2f}")
    print(f"\nMost popular cuisine: {df['cuisine_type'].value_counts().idxmax()} "
          f"({df['cuisine_type'].value_counts().max()} orders)")
    print(f"Top restaurant by order count: {df['restaurant_name'].value_counts().idxmax()} "
          f"({df['restaurant_name'].value_counts().max()} orders)")
    print(f"\nOrders on weekends: {(df['day_of_the_week']=='Weekend').sum()} "
          f"({(df['day_of_the_week']=='Weekend').mean()*100:.1f}%)")
    print(f"\nMean order value on weekend vs weekday:")
    print(df.groupby("day_of_the_week")["cost_of_the_order"].mean().round(2))
    print(f"\nShare of orders rated vs not rated:")
    print(df["is_rated"].value_counts(normalize=True).round(3) * 100)


def main():
    os.makedirs(PLOT_DIR, exist_ok=True)
    df = load_data(INPUT_PATH)

    save_plot(plot_order_value_distribution, "01_order_value_distribution.png", df)
    save_plot(plot_top_cuisines, "02_top_cuisines.png", df)
    save_plot(plot_top_restaurants, "03_top_restaurants.png", df)
    save_plot(plot_orders_by_day_type, "04_orders_by_day_type.png", df)
    save_plot(plot_rating_distribution, "05_rating_distribution.png", df)
    save_plot(plot_cost_by_cuisine, "06_cost_by_cuisine.png", df)
    save_plot(plot_cost_by_day_type, "07_cost_by_day_type.png", df)
    save_plot(plot_rating_vs_cost, "08_rating_vs_cost.png", df)

    print_key_findings(df)
    print(f"\nAll plots saved to {PLOT_DIR}/")


if __name__ == "__main__":
    main()
