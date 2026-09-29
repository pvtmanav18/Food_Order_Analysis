"""
PHASE 5: Model Building
Food Order Analysis Project (FoodHub dataset)

Task: classify whether an order will receive a HIGH rating (4 or 5) based on
order characteristics -- cost, cuisine, restaurant popularity, weekend flag,
price tier. This is a customer-satisfaction classification task grounded
entirely in order attributes.

Input : data/foodhub_order_features.csv
Output: models/*.pkl, models/model_comparison.csv, models/feature_importance.csv
"""

import pandas as pd
import numpy as np
import joblib
import os
import sys

from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

INPUT_PATH = "data/foodhub_order_features.csv"
MODEL_DIR = "models"


def load_data(path):
    try:
        return pd.read_csv(path)
    except FileNotFoundError:
        print(f"ERROR: '{path}' not found. Run Phase 4 first.")
        sys.exit(1)
    except Exception as e:
        print(f"ERROR loading data: {e}")
        sys.exit(1)


def split_and_scale(df, target_col="high_rating", test_size=0.2, random_state=42):
    try:
        X = df.drop(columns=[target_col])
        y = df[target_col]
    except KeyError:
        print(f"ERROR: target column '{target_col}' not found.")
        sys.exit(1)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=random_state, stratify=y
    )
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    return X_train, X_test, y_train, y_test, X_train_scaled, X_test_scaled


def evaluate(name, y_true, y_pred, results):
    try:
        acc = accuracy_score(y_true, y_pred)
        prec = precision_score(y_true, y_pred, zero_division=0)
        rec = recall_score(y_true, y_pred, zero_division=0)
        f1 = f1_score(y_true, y_pred, zero_division=0)
        results.append({"Model": name, "Accuracy": round(acc, 3), "Precision": round(prec, 3),
                         "Recall": round(rec, 3), "F1": round(f1, 3)})
        print(f"{name:22s} | Acc: {acc:.3f} | Prec: {prec:.3f} | Rec: {rec:.3f} | F1: {f1:.3f}")
    except Exception as e:
        print(f"Warning: could not evaluate '{name}': {e}")


def train_logistic_regression(X_train_scaled, y_train, X_test_scaled, y_test, results):
    try:
        model = LogisticRegression(max_iter=1000, random_state=42)
        model.fit(X_train_scaled, y_train)
        pred = model.predict(X_test_scaled)
        evaluate("Logistic Regression", y_test, pred, results)
        joblib.dump(model, os.path.join(MODEL_DIR, "logistic_regression.pkl"))
        return model
    except Exception as e:
        print(f"ERROR training Logistic Regression: {e}")
        return None


def train_random_forest(X_train, y_train, X_test, y_test, results):
    try:
        params = {"n_estimators": [100, 200], "max_depth": [4, 8, None], "min_samples_leaf": [1, 3]}
        grid = GridSearchCV(RandomForestClassifier(random_state=42), params, cv=3,
                             scoring="f1", n_jobs=-1)
        grid.fit(X_train, y_train)
        best_model = grid.best_estimator_
        pred = best_model.predict(X_test)
        evaluate("Random Forest", y_test, pred, results)
        print(f"  Best RF params: {grid.best_params_}")
        joblib.dump(best_model, os.path.join(MODEL_DIR, "random_forest.pkl"))
        return best_model
    except Exception as e:
        print(f"ERROR training Random Forest: {e}")
        return None


def save_results(results, best_rf, feature_names):
    results_df = pd.DataFrame(results).sort_values("F1", ascending=False)
    print("\n" + "=" * 55)
    print("MODEL COMPARISON (sorted by F1, higher is better)")
    print("=" * 55)
    print(results_df.to_string(index=False))
    results_df.to_csv(os.path.join(MODEL_DIR, "model_comparison.csv"), index=False)

    if best_rf is not None:
        try:
            importances = pd.Series(best_rf.feature_importances_, index=feature_names).sort_values(ascending=False)
            print("\nTop 10 Feature Importances (Random Forest):")
            print(importances.head(10))
            importances.to_csv(os.path.join(MODEL_DIR, "feature_importance.csv"), header=["importance"])
        except Exception as e:
            print(f"Warning: could not compute feature importances: {e}")


def main():
    os.makedirs(MODEL_DIR, exist_ok=True)
    df = load_data(INPUT_PATH)
    X_train, X_test, y_train, y_test, X_train_scaled, X_test_scaled = split_and_scale(df)
    print(f"Train size: {X_train.shape[0]}, Test size: {X_test.shape[0]}")
    print(f"Baseline (majority class) rate: {max(y_train.mean(), 1-y_train.mean()):.3f}")

    results = []
    train_logistic_regression(X_train_scaled, y_train, X_test_scaled, y_test, results)
    best_rf = train_random_forest(X_train, y_train, X_test, y_test, results)

    save_results(results, best_rf, X_train.columns)
    print(f"\nModels and reports saved to {MODEL_DIR}/")


if __name__ == "__main__":
    main()
