"""
PHASE 7: Results & Conclusion
Food Order Analysis Project (FoodHub dataset)

Input : models/*, eval_plots/*
Output: results/final_summary.csv, results/conclusion.txt
"""

import pandas as pd
import os
import sys

MODEL_DIR = "models"
EVAL_DIR = "eval_plots"
RESULTS_DIR = "results"


def load_csv_safe(path, label):
    try:
        return pd.read_csv(path)
    except FileNotFoundError:
        print(f"ERROR: '{path}' not found. Run earlier phases first ({label}).")
        sys.exit(1)
    except Exception as e:
        print(f"ERROR loading {label}: {e}")
        sys.exit(1)


def summarize_results(model_comparison, feature_importance, evaluation_summary):
    print("=" * 60); print("FINAL RESULTS SUMMARY"); print("=" * 60)
    best_model_row = model_comparison.sort_values("F1", ascending=False).iloc[0]
    print(f"\nBest performing model: {best_model_row['Model']}")
    print(f"  Accuracy : {best_model_row['Accuracy']}")
    print(f"  Precision: {best_model_row['Precision']}")
    print(f"  Recall   : {best_model_row['Recall']}")
    print(f"  F1 Score : {best_model_row['F1']}")

    print("\nTop 5 most important features for predicting a high rating:")
    print(feature_importance.head(5).to_string(index=False))

    print("\nEvaluation summary:")
    print(evaluation_summary.to_string(index=False))
    return best_model_row


def write_conclusion(best_model_row, baseline):
    beat_baseline = best_model_row["Accuracy"] > baseline
    performance_note = (
        f"outperforming the majority-class baseline of {baseline:.3f}."
        if beat_baseline else
        f"but did NOT outperform the majority-class baseline of {baseline:.3f}. "
        f"This is itself a meaningful finding: whether a customer rates an order highly "
        f"is not well explained by order value, cuisine, restaurant popularity, or timing "
        f"alone -- satisfaction likely depends on factors this dataset does not capture "
        f"(e.g., food quality, order accuracy, prior experience with the restaurant)."
    )
    conclusion = f"""
CONCLUSION
----------
This project analyzed 1,898 food orders from the FoodHub dataset to understand
order patterns, customer rating behavior, and the drivers of order satisfaction.

Key findings:
1. A large share of orders (about 39%) are never rated by the customer at all,
   which itself is a useful signal for engagement analysis.
2. Weekend orders substantially outnumber weekday orders (71% vs 29%), and
   American and Italian cuisines dominate order volume.
3. Order value varies meaningfully across cuisines, with some cuisines
   commanding a consistently higher average order value than others.
4. Order value and restaurant popularity were the strongest (though still
   modest) predictors among the available features when attempting to
   classify whether an order receives a high rating.

Best model: {best_model_row['Model']} achieved an F1 score of {best_model_row['F1']} and
an accuracy of {best_model_row['Accuracy']} for classifying whether an order receives
a high rating (4 or 5 stars), {performance_note}

Business recommendation: since rating behavior is difficult to predict from
order-level attributes alone, platforms should focus on directly encouraging
rating submission (since 39% of orders go unrated) rather than trying to
infer satisfaction indirectly from order value or cuisine. Popular,
high-volume restaurants and weekend ordering patterns are useful for
operational planning even where they don't strongly predict individual
satisfaction.

Note: this analysis is scoped to food ORDER characteristics (value, cuisine,
restaurant, timing, and rating behavior). Delivery logistics (preparation
time, delivery time) were intentionally excluded from this analysis, as the
project's focus is order-level patterns rather than delivery performance.
"""
    print(conclusion)
    return conclusion


def main():
    os.makedirs(RESULTS_DIR, exist_ok=True)
    model_comparison = load_csv_safe(os.path.join(MODEL_DIR, "model_comparison.csv"), "model comparison")
    feature_importance = load_csv_safe(os.path.join(MODEL_DIR, "feature_importance.csv"), "feature importance")
    evaluation_summary = load_csv_safe(os.path.join(EVAL_DIR, "evaluation_summary.csv"), "evaluation summary")

    best_model_row = summarize_results(model_comparison, feature_importance, evaluation_summary)
    baseline_row = evaluation_summary[evaluation_summary["Metric"].str.contains("Baseline")]
    baseline = float(baseline_row["Value"].iloc[0]) if not baseline_row.empty else 0.5
    conclusion_text = write_conclusion(best_model_row, baseline)

    try:
        with open(os.path.join(RESULTS_DIR, "conclusion.txt"), "w") as f:
            f.write(conclusion_text)
        model_comparison.to_csv(os.path.join(RESULTS_DIR, "final_model_comparison.csv"), index=False)
        print(f"Final results saved to {RESULTS_DIR}/")
    except Exception as e:
        print(f"Warning: could not save final results: {e}")


if __name__ == "__main__":
    main()
