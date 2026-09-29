"""
Generates the full Mini Project Documentation PDF following the required
department structure.
"""

import pandas as pd
from reportlab.platypus import (
    BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer, PageBreak,
    Image, Table, TableStyle, NextPageTemplate
)
from reportlab.platypus.tableofcontents import TableOfContents
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY

OUT_PATH = "Food_Order_Analysis_Documentation.pdf"

# ------------------------------------------------------------------
# Styles
# ------------------------------------------------------------------
styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name="CoverTitle", fontSize=20, leading=26, alignment=TA_CENTER, spaceAfter=14, fontName="Helvetica-Bold"))
styles.add(ParagraphStyle(name="CoverSub", fontSize=13, leading=18, alignment=TA_CENTER, spaceAfter=8))
styles.add(ParagraphStyle(name="ChapterHeading", fontSize=16, leading=20, spaceBefore=6, spaceAfter=12, fontName="Helvetica-Bold", textColor=colors.black))
styles.add(ParagraphStyle(name="SectionHeading", fontSize=12.5, leading=16, spaceBefore=10, spaceAfter=6, fontName="Helvetica-Bold", textColor=colors.black))
styles.add(ParagraphStyle(name="BodyJustify", fontSize=10.3, leading=15, alignment=TA_JUSTIFY, spaceAfter=8))
styles.add(ParagraphStyle(name="CodeStyle", fontName="Courier", fontSize=7.3, leading=9, backColor=colors.HexColor("#F4F4F4")))
styles.add(ParagraphStyle(name="CenterBold", fontSize=11, alignment=TA_CENTER, fontName="Helvetica-Bold", spaceAfter=6))
styles.add(ParagraphStyle(name="Center", fontSize=10.5, alignment=TA_CENTER, spaceAfter=6))

story = []

def chapter(title):
    story.append(Paragraph(title, styles["ChapterHeading"]))

def section(title):
    story.append(Paragraph(title, styles["SectionHeading"]))

def body(text):
    story.append(Paragraph(text, styles["BodyJustify"]))

def img(path, width=15*cm, max_height=22*cm):
    try:
        from PIL import Image as PILImage
        with PILImage.open(path) as im:
            iw, ih = im.size
        aspect = ih / iw
        height = width * aspect
        if height > max_height:
            height = max_height
            width = height / aspect
        story.append(Image(path, width=width, height=height))
        story.append(Spacer(1, 8))
    except Exception as e:
        story.append(Paragraph(f"[Image could not be loaded: {path} -- {e}]", styles["Normal"]))

def df_to_table(df, col_widths=None):
    data = [list(df.columns)] + df.astype(str).values.tolist()
    t = Table(data, colWidths=col_widths, repeatRows=1)
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#2E5395")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 8.5),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#F0F0F5")]),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0,0), (-1,-1), 4),
        ("BOTTOMPADDING", (0,0), (-1,-1), 4),
    ]))
    return t

def code_block(filepath, filename_label=None):
    """Read a Python source file and render it in the PDF as a monospace code block."""
    try:
        with open(filepath, "r") as f:
            code_text = f.read()
    except Exception as e:
        story.append(Paragraph(f"[Could not load {filepath}: {e}]", styles["Normal"]))
        return

    story.append(Paragraph(filename_label or filepath, styles["SectionHeading"]))
    # Escape XML-special characters, preserve indentation and line breaks
    safe = (code_text.replace("&", "&amp;")
                      .replace("<", "&lt;")
                      .replace(">", "&gt;"))
    lines = safe.split("\n")
    # Render in chunks to avoid one gigantic Paragraph
    chunk_size = 60
    for i in range(0, len(lines), chunk_size):
        chunk = lines[i:i + chunk_size]
        html_chunk = "<br/>".join(
            line.replace(" ", "&nbsp;") if line.strip() else "&nbsp;" for line in chunk
        )
        story.append(Paragraph(html_chunk, styles["CodeStyle"]))
    story.append(Spacer(1, 10))


# ------------------------------------------------------------------
# 1. COVER PAGE
# ------------------------------------------------------------------
story.append(Spacer(1, 40))
story.append(Paragraph("Ahmedabad Institute of Technology", styles["CoverSub"]))
story.append(Paragraph("Department of Computer Engineering", styles["CoverSub"]))
story.append(Spacer(1, 40))
story.append(Paragraph("Food Order Analysis Using Data Science", styles["CoverTitle"]))
story.append(Spacer(1, 20))
story.append(Paragraph("Mini Project Documentation", styles["CoverSub"]))
story.append(Paragraph("Python for Data Science (BE05000231)", styles["CoverSub"]))
story.append(Paragraph("5th Semester -- CE-C", styles["CoverSub"]))
story.append(Spacer(1, 60))
story.append(Paragraph("Submitted by:", styles["CenterBold"]))
story.append(Paragraph("[Student Name 1] -- [Enrollment No.]", styles["Center"]))
story.append(Paragraph("[Student Name 2] -- [Enrollment No.]", styles["Center"]))
story.append(Spacer(1, 30))
story.append(Paragraph("Guided by:", styles["CenterBold"]))
story.append(Paragraph("[Faculty Guide Name]", styles["Center"]))
story.append(Spacer(1, 40))
story.append(Paragraph("Academic Year: [20XX -- 20XX]", styles["Center"]))
story.append(PageBreak())

# ------------------------------------------------------------------
# 2. CERTIFICATE
# ------------------------------------------------------------------
story.append(Paragraph("CERTIFICATE", styles["ChapterHeading"]))
story.append(Spacer(1, 20))
body("This is to certify that the mini project entitled <b>\"Food Order Analysis Using Data "
     "Science\"</b> has been carried out by <b>[Student Name 1] ([Enrollment No.])</b> and "
     "<b>[Student Name 2] ([Enrollment No.])</b> under my guidance in partial fulfilment of "
     "the requirements for the subject <b>Python for Data Science (BE05000231)</b>, 5th "
     "Semester, CE-C, at <b>Ahmedabad Institute of Technology</b>, during the academic year "
     "[20XX-20XX].")
story.append(Spacer(1, 40))
story.append(Paragraph("_____________________", styles["Center"]))
story.append(Paragraph("Faculty Guide", styles["Center"]))
story.append(Spacer(1, 20))
story.append(Paragraph("_____________________", styles["Center"]))
story.append(Paragraph("Head of Department", styles["Center"]))
story.append(PageBreak())

# ------------------------------------------------------------------
# 3. ACKNOWLEDGEMENT
# ------------------------------------------------------------------
story.append(Paragraph("ACKNOWLEDGEMENT", styles["ChapterHeading"]))
body("We would like to express our sincere gratitude to our faculty guide, "
     "<b>[Faculty Guide Name]</b>, for their valuable guidance and continuous support "
     "throughout the development of this mini project. We are also thankful to the "
     "Department of Computer Engineering, Ahmedabad Institute of Technology, for providing "
     "the resources and environment necessary to complete this project. Finally, we thank "
     "our peers and family for their encouragement.")
story.append(PageBreak())

# ------------------------------------------------------------------
# 4. ABSTRACT
# ------------------------------------------------------------------
story.append(Paragraph("ABSTRACT", styles["ChapterHeading"]))
body("Understanding customer ordering behavior is essential for online food platforms to "
     "optimize operations, marketing, and customer satisfaction. This project analyzes "
     "1,898 real-world food orders from the FoodHub dataset to uncover patterns in order "
     "value, cuisine popularity, restaurant performance, and customer rating behavior. The "
     "workflow covers data cleaning, exploratory data analysis, feature engineering, and a "
     "supervised classification model to predict whether an order receives a high customer "
     "rating. Two classification models -- Logistic Regression and Random Forest -- were "
     "trained and compared. The analysis found that American and Italian cuisines dominate "
     "order volume, weekend orders substantially outnumber weekday orders, and a striking "
     "39% of orders are never rated by the customer at all. Order value and restaurant "
     "popularity emerged as the strongest available predictors of a high rating, though "
     "neither the Logistic Regression nor Random Forest model was able to outperform a "
     "simple majority-class baseline -- indicating that rating behavior depends on factors "
     "not captured in this dataset, such as food quality or delivery experience. These "
     "insights are directly useful for a food delivery platform seeking to increase rating "
     "engagement and understand cuisine- and restaurant-level order patterns. This project "
     "is scoped strictly to food ORDER analysis; delivery logistics (preparation and "
     "delivery time) were intentionally excluded.")
story.append(PageBreak())

# ------------------------------------------------------------------
# 5. TABLE OF CONTENTS
# ------------------------------------------------------------------
story.append(Paragraph("TABLE OF CONTENTS", styles["ChapterHeading"]))
toc = TableOfContents()
toc.levelStyles = [
    ParagraphStyle(name="TOC1", fontSize=11, leading=16, fontName="Helvetica-Bold"),
    ParagraphStyle(name="TOC2", fontSize=10, leading=14, leftIndent=16),
]
story.append(toc)
story.append(PageBreak())

# ------------------------------------------------------------------
# 6. LIST OF ABBREVIATIONS
# ------------------------------------------------------------------
story.append(Paragraph("LIST OF ABBREVIATIONS", styles["ChapterHeading"]))
abbr_data = [
    ["Abbreviation", "Full Form"],
    ["EDA", "Exploratory Data Analysis"],
    ["ML", "Machine Learning"],
    ["F1", "F1 Score (harmonic mean of precision and recall)"],
    ["CSV", "Comma-Separated Values"],
    ["IQR", "Interquartile Range"],
    ["API", "Application Programming Interface"],
]
story.append(df_to_table(pd.DataFrame(abbr_data[1:], columns=abbr_data[0]), col_widths=[4*cm, 10*cm]))
story.append(PageBreak())
# ==================================================================
# CHAPTER 1: INTRODUCTION
# ==================================================================
chapter("Chapter 1: Introduction")

section("1.1 Background")
body("Online food ordering platforms process a high volume of orders across many restaurants "
     "and cuisines every day. Understanding the patterns behind these orders -- what "
     "customers order, how much they spend, when they order, and whether they are satisfied "
     "-- is critical for platform operators to make informed business decisions. Data "
     "science techniques make it possible to systematically analyze historical order data "
     "to uncover these patterns.")

section("1.2 Problem Statement")
body("Food ordering platforms accumulate large amounts of order data, but without structured "
     "analysis it is difficult to know which cuisines and restaurants drive the most orders, "
     "how order value varies across categories, and what factors are associated with "
     "customers leaving a high rating. This project addresses that gap through exploratory "
     "and predictive analysis of order-level data.")

section("1.3 Objectives")
body("&bull; To collect and clean a real-world food order dataset.<br/>"
     "&bull; To perform exploratory data analysis on order value, cuisine, restaurant, and "
     "timing patterns.<br/>"
     "&bull; To engineer meaningful features describing each order.<br/>"
     "&bull; To build and compare classification models predicting whether an order receives "
     "a high customer rating.<br/>"
     "&bull; To derive actionable business insights from the analysis.")

section("1.4 Scope of the Project")
body("This project covers the complete data science pipeline -- from raw order data to a "
     "trained classification model -- applied to food order characteristics: order value, "
     "cuisine, restaurant, day type, and customer rating. Delivery logistics such as food "
     "preparation time and delivery time are explicitly excluded from the analysis, as the "
     "project is scoped strictly to food ORDER analysis rather than delivery performance.")

section("1.5 Applications")
body("&bull; Identifying top-performing cuisines and restaurants for promotional focus.<br/>"
     "&bull; Understanding order value trends across cuisines and day types.<br/>"
     "&bull; Improving customer rating engagement (since a large share of orders go unrated).<br/>"
     "&bull; Supporting menu and pricing strategy based on order value patterns.")
story.append(PageBreak())

# ==================================================================
# CHAPTER 2: LITERATURE SURVEY
# ==================================================================
chapter("Chapter 2: Literature Survey")
body("Prior studies on e-commerce and food-ordering platforms commonly use exploratory data "
     "analysis to understand purchasing patterns -- order frequency, average order value, and "
     "category popularity -- as a foundation for business strategy. Classification models "
     "such as Logistic Regression and Random Forest are frequently used in customer "
     "satisfaction and churn-prediction studies to identify which factors are associated with "
     "positive outcomes. A recurring finding in this literature is that satisfaction and "
     "rating behavior are often only weakly explained by transactional attributes (price, "
     "category, timing) alone, and are more strongly influenced by product/service quality "
     "factors that are not always captured in transactional datasets -- a pattern consistent "
     "with the findings of this project.")
story.append(PageBreak())

# ==================================================================
# CHAPTER 3: REQUIREMENT ANALYSIS
# ==================================================================
chapter("Chapter 3: Requirement Analysis")

section("3.1 Hardware Requirements")
hw_data = pd.DataFrame({
    "Component": ["Processor", "RAM", "Storage", "Operating System"],
    "Minimum Requirement": ["Dual-core 2 GHz or higher", "4 GB (8 GB recommended)", "500 MB free space", "Windows / Linux / macOS"],
})
story.append(df_to_table(hw_data, col_widths=[5*cm, 9*cm]))
story.append(Spacer(1, 10))

section("3.2 Software Requirements")
sw_data = pd.DataFrame({
    "Software": ["Python", "Jupyter Notebook / IDE", "pip (package manager)"],
    "Version": ["3.9 or above", "Latest", "Latest"],
})
story.append(df_to_table(sw_data, col_widths=[6*cm, 8*cm]))
story.append(Spacer(1, 10))

section("3.3 Python Libraries Used")
lib_data = pd.DataFrame({
    "Library": ["pandas", "numpy", "matplotlib", "seaborn", "scikit-learn", "joblib"],
    "Purpose": [
        "Data loading, cleaning, and manipulation",
        "Numerical computations",
        "Data visualization (base plotting)",
        "Statistical data visualization",
        "Classification models, train-test split, evaluation metrics",
        "Saving and loading trained models",
    ],
})
story.append(df_to_table(lib_data, col_widths=[3.5*cm, 10.5*cm]))
story.append(PageBreak())

# ==================================================================
# CHAPTER 4: DATASET DESCRIPTION
# ==================================================================
chapter("Chapter 4: Dataset Description")

section("4.1 Dataset Source")
body("The dataset used is the <b>\"FoodHub Data\"</b> dataset, publicly available on Kaggle: "
     "https://www.kaggle.com/datasets/tasnimniger/foodhub-data")

section("4.2 Dataset Information")
body("The dataset contains <b>1,898 records</b> and <b>9 original columns</b>, each "
     "representing one food order placed through the FoodHub platform, covering 1,200 "
     "unique customers and 178 unique restaurants.")

section("4.3 Attribute Description")
attr_data = pd.DataFrame({
    "Attribute": ["order_id", "customer_id", "restaurant_name", "cuisine_type",
                  "cost_of_the_order", "day_of_the_week", "rating",
                  "food_preparation_time*", "delivery_time*"],
    "Description": [
        "Unique identifier for each order",
        "Unique identifier for each customer",
        "Name of the restaurant the order was placed from",
        "Type of cuisine offered by the restaurant",
        "Order value in dollars (used as a proxy for revenue)",
        "Whether the order was placed on a Weekday or Weekend",
        "Customer rating (3, 4, 5, or 'Not given')",
        "Time to prepare the food (minutes) -- excluded from analysis (out of scope)",
        "Time to deliver the order (minutes) -- excluded from analysis (out of scope)",
    ],
})
story.append(df_to_table(attr_data, col_widths=[3.6*cm, 10.4*cm]))
body("<i>* food_preparation_time and delivery_time exist in the raw dataset but were "
     "dropped during cleaning (Phase 2), since this project is scoped strictly to food "
     "order analysis and not delivery performance.</i>")

section("4.4 Data Quality Analysis")
body("Initial inspection (Phase 1) found no missing (NaN) values and no duplicate order_ids. "
     "The rating column contains a 'Not given' category for orders the customer chose not to "
     "rate (736 of 1,898 orders, about 38.8%) -- this was treated as a valid response "
     "category rather than missing data. No statistical outliers were found in order value "
     "using the IQR method.")
story.append(PageBreak())

# ==================================================================
# CHAPTER 5: SYSTEM DESIGN
# ==================================================================
chapter("Chapter 5: System Design")

section("5.1 System Architecture")
img("doc_assets/architecture.png")

section("5.2 Flowchart")
img("doc_assets/flowchart.png", width=8*cm, max_height=23*cm)

section("5.3 Module Diagram")
img("doc_assets/module_diagram.png")

section("5.4 Workflow Description")
body("The project is implemented as seven sequential Python modules (phase1 through phase7), "
     "each reading the output of the previous stage and writing its own output to disk. Every "
     "module uses functions with exception handling so that a missing file or malformed value "
     "produces a clear error message instead of a crash.")
story.append(PageBreak())

# ==================================================================
# CHAPTER 6: PROJECT METHODOLOGY
# ==================================================================
chapter("Chapter 6: Project Methodology")
body("<b>1. Data Collection:</b> Real-world order dataset obtained from Kaggle.<br/>"
     "<b>2. Data Cleaning:</b> Duplicate removal, text standardization, rating category "
     "handling, outlier flagging on order value, and removal of out-of-scope delivery "
     "columns.<br/>"
     "<b>3. Exploratory Data Analysis:</b> Visualizations of order value, cuisine popularity, "
     "restaurant performance, day-type patterns, and rating distribution.<br/>"
     "<b>4. Feature Engineering:</b> One-hot encoding of top cuisines, restaurant popularity "
     "(order count), price tier buckets, and a weekend flag. A binary 'high_rating' target "
     "(4 or 5 stars) was created for classification.<br/>"
     "<b>5. Model Building:</b> Stratified 80/20 train-test split, feature scaling, training "
     "of Logistic Regression and Random Forest classifiers (with hyperparameter tuning via "
     "GridSearchCV).<br/>"
     "<b>6. Model Evaluation:</b> Accuracy, Precision, Recall, F1 score, and confusion "
     "matrices, compared against a majority-class baseline.<br/>"
     "<b>7. Results & Conclusion:</b> Consolidation of findings into actionable insights.")
story.append(PageBreak())

# ==================================================================
# CHAPTER 7: PROJECT IMPLEMENTATION
# ==================================================================
chapter("Chapter 7: Project Implementation")
body("All code was implemented in Python using pandas, NumPy, matplotlib, seaborn, and "
     "scikit-learn, organized into seven modular scripts corresponding to the seven project "
     "phases. Every script uses functions for each logical step, with file I/O and data "
     "operations wrapped in try/except blocks. The full source code is provided in the "
     "Appendix.")

section("7.1 Sample Code -- Feature Engineering (excerpt)")
code_sample = """def add_restaurant_popularity(df):
    \"\"\"Number of orders each restaurant has received -- a proxy for popularity/trust.\"\"\"
    try:
        popularity = df.groupby("restaurant_name")["order_id"].transform("count")
        df["restaurant_order_count"] = popularity
    except KeyError:
        print("Warning: could not compute restaurant popularity.")
    return df"""
story.append(Paragraph(code_sample.replace("\n", "<br/>").replace(" ", "&nbsp;"), styles["CodeStyle"]))
story.append(PageBreak())

# ==================================================================
# CHAPTER 8: PROJECT SCREENSHOTS AND RESULTS
# ==================================================================
chapter("Chapter 8: Project Screenshots and Results")

section("8.1 Exploratory Data Analysis")
img("doc_assets/eda_01.png", width=11*cm)
img("doc_assets/eda_02.png", width=11*cm)
story.append(PageBreak())
img("doc_assets/eda_05.png", width=11*cm)
img("doc_assets/eda_06.png", width=11*cm)
story.append(PageBreak())

section("8.2 Model Evaluation")
img("doc_assets/eval_02.png", width=10*cm)
img("doc_assets/eval_04.png", width=11*cm)
story.append(PageBreak())
# ==================================================================
# CHAPTER 9: TESTING AND VALIDATION
# ==================================================================
chapter("Chapter 9: Testing and Validation")
body("Each module was tested individually: Phase 1 was verified to correctly report dataset "
     "shape and business metrics; Phase 2 was verified to leave zero duplicate order_ids and "
     "correctly drop the two out-of-scope columns; Phase 4's output was checked to confirm "
     "all columns were numeric and model-ready; Phase 5's models were validated using a "
     "stratified 80/20 train-test split with a fixed random seed (42) for reproducibility. "
     "Exception handling in every module was tested by temporarily removing input files and "
     "confirming that clear, descriptive error messages were produced instead of a crash.")

section("9.1 Model Validation Results")
model_comp = pd.read_csv("models/model_comparison.csv")
story.append(df_to_table(model_comp, col_widths=[5*cm, 2.5*cm, 2.5*cm, 2.5*cm, 2.5*cm]))
story.append(PageBreak())

# ==================================================================
# CHAPTER 10: RESULTS AND DISCUSSION
# ==================================================================
chapter("Chapter 10: Results and Discussion")
body("The Random Forest classifier slightly outperformed Logistic Regression, achieving an "
     "F1 score of 0.472 and accuracy of 0.476, versus 0.438 and 0.474 respectively. However, "
     "neither model exceeded the majority-class baseline accuracy of 0.513 -- meaning simply "
     "always predicting the more common class would have performed at least as well. Feature "
     "importance analysis showed that <b>cost_of_the_order</b> (order value) and "
     "<b>restaurant_order_count</b> (restaurant popularity) were the most influential features "
     "available, together accounting for over half of the Random Forest's feature "
     "importance, but their overall predictive power remained limited. This indicates that "
     "whether a customer leaves a high rating is not well explained by order value, cuisine, "
     "restaurant popularity, or day type alone -- satisfaction likely depends on qualitative "
     "factors (food quality, order accuracy, delivery experience) that are not present in "
     "this dataset.")

section("10.1 Feature Importance")
feat_imp = pd.read_csv("models/feature_importance.csv").head(8)
feat_imp.columns = ["Feature", "Importance"]
feat_imp["Importance"] = feat_imp["Importance"].astype(float).round(4)
story.append(df_to_table(feat_imp, col_widths=[7*cm, 5*cm]))

section("10.2 Prediction Accuracy vs. Baseline")
eval_summary = pd.read_csv("eval_plots/evaluation_summary.csv")
story.append(df_to_table(eval_summary, col_widths=[8*cm, 4*cm]))
story.append(PageBreak())

# ==================================================================
# CHAPTER 11: CONCLUSION
# ==================================================================
chapter("Chapter 11: Conclusion")
body("This project successfully analyzed 1,898 food orders to understand order value "
     "patterns, cuisine and restaurant popularity, and customer rating behavior. American "
     "and Italian cuisines dominate order volume, weekend orders substantially outnumber "
     "weekday orders (71% vs 29%), and a notable 38.8% of orders are never rated at all. "
     "While a classification model was built to predict high ratings from order "
     "characteristics, it did not outperform a simple baseline -- itself a valuable finding, "
     "showing that rating behavior is not well explained by transactional order attributes "
     "alone. The most actionable insight from this project is the low rating-submission rate: "
     "platforms stand to gain more from directly encouraging customers to rate their orders "
     "than from trying to predict satisfaction indirectly.")
story.append(PageBreak())

# ==================================================================
# CHAPTER 12: FUTURE SCOPE
# ==================================================================
chapter("Chapter 12: Future Scope")
body("&bull; Incorporating additional order-level attributes (e.g., item-level detail, "
     "discounts applied, payment method) that may better explain rating behavior.<br/>"
     "&bull; Building a customer segmentation model based on order frequency and value to "
     "support targeted marketing.<br/>"
     "&bull; Deploying the analysis as an interactive dashboard (e.g., using Streamlit) for "
     "restaurant and cuisine performance monitoring.<br/>"
     "&bull; Running a controlled study or survey to capture qualitative satisfaction drivers "
     "not present in transactional data.<br/>"
     "&bull; Extending the analysis with time-series data to study seasonal ordering trends.")
story.append(PageBreak())

# ==================================================================
# REFERENCES
# ==================================================================
chapter("References")
body("1. Kaggle Dataset: FoodHub Data -- "
     "https://www.kaggle.com/datasets/tasnimniger/foodhub-data<br/>"
     "2. Pandas Documentation -- https://pandas.pydata.org/docs/<br/>"
     "3. Scikit-learn Documentation -- https://scikit-learn.org/stable/documentation.html<br/>"
     "4. Matplotlib Documentation -- https://matplotlib.org/stable/contents.html<br/>"
     "5. Seaborn Documentation -- https://seaborn.pydata.org/")
story.append(PageBreak())

# ==================================================================
# APPENDIX
# ==================================================================
chapter("Appendix")

section("A.1 Source Code")
body("Full source code for all seven project phases, in execution order:")

source_files = [
    ("phase1_data_understanding.py", "Phase 1: Data Collection & Understanding"),
    ("phase2_data_cleaning.py", "Phase 2: Data Cleaning & Preprocessing"),
    ("phase3_eda.py", "Phase 3: Exploratory Data Analysis"),
    ("phase4_feature_engineering.py", "Phase 4: Feature Engineering"),
    ("phase5_model_building.py", "Phase 5: Model Building"),
    ("phase6_model_evaluation.py", "Phase 6: Model Evaluation"),
    ("phase7_results_conclusion.py", "Phase 7: Results & Conclusion"),
]
for fname, label in source_files:
    code_block(fname, label)
    story.append(PageBreak())

section("A.2 Dataset Sample")
try:
    raw = pd.read_csv("data/foodhub_order.csv").head(5)
    story.append(df_to_table(raw, col_widths=[1.7*cm]*9))
except Exception as e:
    body(f"[Could not load dataset sample: {e}]")
story.append(PageBreak())

section("A.3 Output Reports")

story.append(Paragraph("Model Comparison (models/model_comparison.csv)", styles["BodyJustify"]))
try:
    story.append(df_to_table(pd.read_csv("models/model_comparison.csv"), col_widths=[5*cm, 2.5*cm, 2.5*cm, 2.5*cm, 2.5*cm]))
except Exception as e:
    body(f"[Could not load model_comparison.csv: {e}]")
story.append(Spacer(1, 12))

story.append(Paragraph("Feature Importance (models/feature_importance.csv)", styles["BodyJustify"]))
try:
    fi = pd.read_csv("models/feature_importance.csv")
    fi.columns = ["Feature", "Importance"]
    fi["Importance"] = fi["Importance"].astype(float).round(4)
    story.append(df_to_table(fi, col_widths=[8*cm, 4*cm]))
except Exception as e:
    body(f"[Could not load feature_importance.csv: {e}]")
story.append(PageBreak())

story.append(Paragraph("Evaluation Summary (eval_plots/evaluation_summary.csv)", styles["BodyJustify"]))
try:
    story.append(df_to_table(pd.read_csv("eval_plots/evaluation_summary.csv"), col_widths=[8*cm, 4*cm]))
except Exception as e:
    body(f"[Could not load evaluation_summary.csv: {e}]")
story.append(Spacer(1, 12))

story.append(Paragraph("Final Conclusion Output (results/conclusion.txt)", styles["BodyJustify"]))
try:
    with open("results/conclusion.txt") as f:
        conclusion_text = f.read()
    safe = conclusion_text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\n", "<br/>")
    story.append(Paragraph(safe, styles["CodeStyle"]))
except Exception as e:
    body(f"[Could not load conclusion.txt: {e}]")

# ------------------------------------------------------------------
# Build document with TOC support
# ------------------------------------------------------------------
class DocTemplateWithTOC(BaseDocTemplate):
    def afterFlowable(self, flowable):
        if hasattr(flowable, 'style') and flowable.style.name in ("ChapterHeading",):
            text = flowable.getPlainText()
            self.notify('TOCEntry', (0, text, self.page))
        elif hasattr(flowable, 'style') and flowable.style.name in ("SectionHeading",):
            text = flowable.getPlainText()
            self.notify('TOCEntry', (1, text, self.page))

doc = DocTemplateWithTOC(OUT_PATH, pagesize=A4,
                          leftMargin=2*cm, rightMargin=2*cm, topMargin=2*cm, bottomMargin=2*cm)
frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id='normal')
doc.addPageTemplates([PageTemplate(id='main', frames=frame)])

doc.multiBuild(story)
print(f"Documentation generated: {OUT_PATH}")
