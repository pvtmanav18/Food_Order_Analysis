"""
PHASE 6: Model Evaluation
Food Order Analysis Project (FoodHub dataset)

Input : data/foodhub_order_features.csv, models/*.pkl
Output: eval_plots/*.png, eval_plots/evaluation_summary.csv
"""

import pandas as pd
import numpy as np
import joblib
import os
import sys
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import confusion_matrix, classification_report, accuracy_score

sns.set_style("whitegrid")
INPUT_PATH = "data/foodhub_order_features.csv"
MODEL_DIR = "models"
PLOT_DIR = "eval_plots"


def load_data(path):
    try:
        return pd.read_csv(path)
    except FileNotFoundError:
        print(f"ERROR: '{path}' not found. Run Phase 4 first.")
        sys.exit(1)
    except Exception as e:
        print(f"ERROR loading data: {e}")
        sys.exit(1)


def load_model(path):
    try:
        return joblib.load(path)
    except FileNotFoundError:
        print(f"ERROR: model '{path}' not found. Run Phase 5 first.")
        sys.exit(1)
    except Exception as e:
        print(f"ERROR loading model: {e}")
        sys.exit(1)


def prepare_test_set(df, target_col="high_rating"):
    X = df.drop(columns=[target_col])
    y = df[target_col]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    scaler = StandardScaler()
    scaler.fit(X_train)
    return X_test, y_test, scaler.transform(X_test)


def plot_confusion_matrix(y_test, pred, model_name, filename):
    cm = confusion_matrix(y_test, pred)
    plt.figure(figsize=(5.5, 5))
    sns.heatmap(cm, annot=True, fmt="d", cmap="Blues",
                xticklabels=["Not High", "High"], yticklabels=["Not High", "High"])
    plt.title(f"Confusion Matrix -- {model_name}")
    plt.xlabel("Predicted")
    plt.ylabel("Actual")
    plt.tight_layout()
    plt.savefig(os.path.join(PLOT_DIR, filename), dpi=120)
    plt.close()


def plot_model_comparison():
    try:
        comp = pd.read_csv(os.path.join(MODEL_DIR, "model_comparison.csv"))
        comp_melt = comp.melt(id_vars="Model", value_vars=["Accuracy", "Precision", "Recall", "F1"])
        plt.figure(figsize=(8, 5))
        sns.barplot(data=comp_melt, x="variable", y="value", hue="Model", palette="Set2")
        plt.title("Model Comparison Across Metrics")
        plt.xlabel("Metric")
        plt.ylabel("Score")
        plt.ylim(0, 1)
        plt.tight_layout()
        plt.savefig(os.path.join(PLOT_DIR, "03_model_comparison.png"), dpi=120)
        plt.close()
    except Exception as e:
        print(f"Warning: could not plot model comparison: {e}")


def plot_feature_importance():
    try:
        fi = pd.read_csv(os.path.join(MODEL_DIR, "feature_importance.csv"))
        fi.columns = ["Feature", "Importance"]
        fi = fi.sort_values("Importance", ascending=True).tail(10)
        plt.figure(figsize=(8, 5))
        plt.barh(fi["Feature"], fi["Importance"], color="teal")
        plt.title("Top 10 Feature Importances (Random Forest)")
        plt.xlabel("Importance")
        plt.tight_layout()
        plt.savefig(os.path.join(PLOT_DIR, "04_feature_importance.png"), dpi=120)
        plt.close()
    except Exception as e:
        print(f"Warning: could not plot feature importance: {e}")


def main():
    os.makedirs(PLOT_DIR, exist_ok=True)
    df = load_data(INPUT_PATH)
    X_test, y_test, X_test_scaled = prepare_test_set(df)

    lr = load_model(os.path.join(MODEL_DIR, "logistic_regression.pkl"))
    rf = load_model(os.path.join(MODEL_DIR, "random_forest.pkl"))

    pred_lr = lr.predict(X_test_scaled)
    pred_rf = rf.predict(X_test)

    plot_confusion_matrix(y_test, pred_lr, "Logistic Regression", "01_confusion_matrix_lr.png")
    plot_confusion_matrix(y_test, pred_rf, "Random Forest", "02_confusion_matrix_rf.png")
    plot_model_comparison()
    plot_feature_importance()

    print("=" * 55)
    print("CLASSIFICATION REPORT -- Random Forest (best model)")
    print("=" * 55)
    print(classification_report(y_test, pred_rf, target_names=["Not High", "High"]))

    acc_lr = accuracy_score(y_test, pred_lr)
    acc_rf = accuracy_score(y_test, pred_rf)
    baseline = max(y_test.mean(), 1 - y_test.mean())

    summary = pd.DataFrame({
        "Metric": ["Logistic Regression Accuracy", "Random Forest Accuracy", "Baseline (majority class)"],
        "Value": [round(acc_lr, 3), round(acc_rf, 3), round(baseline, 3)],
    })
    try:
        summary.to_csv(os.path.join(PLOT_DIR, "evaluation_summary.csv"), index=False)
    except Exception as e:
        print(f"Warning: could not save evaluation summary: {e}")

    print(summary.to_string(index=False))
    print(f"\nAll evaluation plots saved to {PLOT_DIR}/")


if __name__ == "__main__":
    main()
