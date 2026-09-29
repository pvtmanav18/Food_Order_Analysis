"""Generate architecture/flowchart/module diagrams for the food order analysis documentation."""
import matplotlib.pyplot as plt
from matplotlib.patches import FancyArrowPatch, FancyBboxPatch
import textwrap
import os

os.makedirs("doc_assets", exist_ok=True)

def draw_box(ax, x, y, w, h, text, color="#4C72B0", fontsize=9.5, wrap=20):
    box = FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.03",
                          linewidth=1.3, edgecolor="black", facecolor=color, alpha=0.9)
    ax.add_patch(box)
    wrapped = "\n".join(textwrap.wrap(text, width=wrap)) if wrap else text
    ax.text(x + w/2, y + h/2, wrapped, ha="center", va="center", fontsize=fontsize,
            color="white", weight="bold", linespacing=1.4)

def draw_arrow(ax, x1, y1, x2, y2, color="black"):
    arrow = FancyArrowPatch((x1, y1), (x2, y2), arrowstyle="-|>", mutation_scale=16,
                             linewidth=1.4, color=color)
    ax.add_patch(arrow)

# ==================================================================
# Flowchart (5.2)
# ==================================================================
steps = [
    "Start",
    "Load Raw Dataset (foodhub_order.csv)",
    "Data Cleaning (ratings, duplicates, standardize text, drop delivery columns)",
    "Exploratory Data Analysis (order value, cuisine, ratings, day patterns)",
    "Feature Engineering (encoding, price tiers, restaurant popularity)",
    "Train-Test Split",
    "Train Classifiers (Logistic Regression, Random Forest)",
    "Evaluate Models (Accuracy, Precision, Recall, F1)",
    "Select Best Model",
    "Generate Results & Conclusion",
    "End",
]

box_h = 1.5
gap = 0.9
box_w = 6.5
total_h = len(steps) * (box_h + gap)

fig, ax = plt.subplots(figsize=(7, total_h * 0.55))
ax.set_xlim(0, 10)
ax.set_ylim(0, total_h + 1)
ax.axis("off")

y = total_h
positions = []
for step in steps:
    draw_box(ax, 1.75, y, box_w, box_h, step, fontsize=10, wrap=26)
    positions.append((5, y))
    y -= (box_h + gap)

for i in range(len(positions) - 1):
    x1, y1 = positions[i]
    x2, y2 = positions[i + 1]
    draw_arrow(ax, x1, y1, x2, y2 + box_h)

plt.tight_layout()
plt.savefig("doc_assets/flowchart.png", dpi=140, bbox_inches="tight")
plt.close()

# ==================================================================
# System Architecture (5.1)
# ==================================================================
fig, ax = plt.subplots(figsize=(10, 6))
ax.set_xlim(0, 14)
ax.set_ylim(0, 9)
ax.axis("off")

draw_box(ax, 0.5, 6, 3.8, 1.8, "Data Layer (CSV Dataset)", "#55A868", fontsize=10, wrap=16)
draw_box(ax, 5.1, 6, 3.8, 1.8, "Processing Layer\nPandas, NumPy -- Cleaning + Feature Engineering", "#4C72B0", fontsize=9.5, wrap=26)
draw_box(ax, 9.7, 6, 3.8, 1.8, "Analysis Layer\nMatplotlib, Seaborn -- Order Analysis Visualizations", "#C44E52", fontsize=9.5, wrap=24)

draw_box(ax, 0.5, 2.5, 3.8, 1.8, "Output Layer\nReports, Plots, Trained Models", "#64B5CD", fontsize=9.5, wrap=20)
draw_box(ax, 5.1, 2.5, 3.8, 1.8, "Modeling Layer\nscikit-learn -- Rating Classification", "#8172B2", fontsize=9.5, wrap=20)
draw_box(ax, 9.7, 2.5, 3.8, 1.8, "Evaluation Layer\nAccuracy, Precision, Recall, F1", "#CCB974", fontsize=9.5, wrap=22)

draw_arrow(ax, 4.3, 6.9, 5.1, 6.9)
draw_arrow(ax, 8.9, 6.9, 9.7, 6.9)
draw_arrow(ax, 11.6, 6.0, 11.6, 4.3)
draw_arrow(ax, 9.7, 3.4, 8.9, 3.4)
draw_arrow(ax, 5.1, 3.4, 4.3, 3.4)

plt.title("System Architecture", fontsize=14, weight="bold", pad=15)
plt.tight_layout()
plt.savefig("doc_assets/architecture.png", dpi=140, bbox_inches="tight")
plt.close()

# ==================================================================
# Module Diagram (5.3)
# ==================================================================
fig, ax = plt.subplots(figsize=(11, 8))
ax.set_xlim(0, 15)
ax.set_ylim(0, 12)
ax.axis("off")

modules = [
    "phase1_data_understanding.py",
    "phase2_data_cleaning.py",
    "phase3_eda.py",
    "phase4_feature_engineering.py",
    "phase5_model_building.py",
    "phase6_model_evaluation.py",
    "phase7_results_conclusion.py",
]

module_box_w = 7.5
module_box_h = 1.1
gap = 0.45
start_y = 11.2

shared_x = 10.8
shared_y = 4.5
shared_w = 3.3
shared_h = 2.2
shared_cx = shared_x + shared_w / 2
shared_cy = shared_y + shared_h / 2

y = start_y
for name in modules:
    draw_box(ax, 0.5, y, module_box_w, module_box_h, name, "#4C72B0", fontsize=9.5, wrap=32)
    box_right_x = 0.5 + module_box_w
    box_mid_y = y + module_box_h / 2
    mid_x = (box_right_x + shared_x) / 2
    ax.plot([box_right_x, mid_x], [box_mid_y, box_mid_y], color="gray", linewidth=1.1)
    ax.plot([mid_x, mid_x], [box_mid_y, shared_cy], color="gray", linewidth=1.1)
    draw_arrow(ax, mid_x, shared_cy, shared_x, shared_cy, color="gray")
    y -= (module_box_h + gap)

draw_box(ax, shared_x, shared_y, shared_w, shared_h, "Shared Data & Model Files\n(data/, models/, eda_plots/, eval_plots/)",
         "#55A868", fontsize=9.5, wrap=20)

plt.title("Module Diagram", fontsize=14, weight="bold", pad=15)
plt.tight_layout()
plt.savefig("doc_assets/module_diagram.png", dpi=140, bbox_inches="tight")
plt.close()

print("Diagrams generated in doc_assets/")
