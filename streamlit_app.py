import streamlit as st
import pandas as pd

st.set_page_config(
    page_title="Smart Rehabilitation Analytics",
    page_icon="🦶",
    layout="wide",
)

st.title("Smart Rehabilitation Analytics Dashboard")
st.caption("Prototype v1.0 — Demo Data Only — Not for Clinical Use")

# Load demo data from the backend CSV files if available.
try:
    rehab_df = pd.read_csv("backend/data/rehabilitation_data.csv")
    intraday_df = pd.read_csv("backend/data/intraday_data.csv")
    data_available = True
except Exception:
    rehab_df = pd.DataFrame()
    intraday_df = pd.DataFrame()
    data_available = False

if not data_available:
    st.warning("Demo CSV files were not found. Please ensure the backend/data folder exists and contains rehabilitation_data.csv and intraday_data.csv.")
    st.stop()

st.subheader("Overview")

col1, col2, col3, col4 = st.columns(4)
col1.metric("Patients", rehab_df["patient_id"].nunique())
col2.metric("Days", rehab_df["date"].nunique())
col3.metric("Avg Recovery Score", round(rehab_df["recovery_score"].mean(), 2))
col4.metric("Avg Energy Harvested (MJ)", round(rehab_df["energy_harvested_mj"].mean(), 2))

st.subheader("Patient Summary")
patient_filter = st.selectbox("Select patient", sorted(rehab_df["patient_id"].unique()))
patient_df = rehab_df[rehab_df["patient_id"] == patient_filter].sort_values("date")

if not patient_df.empty:
    st.dataframe(patient_df, use_container_width=True)

    st.subheader("Key Trends")
    trend_col1, trend_col2, trend_col3 = st.columns(3)
    with trend_col1:
        st.line_chart(patient_df.set_index("date")["gait_speed"]) 
    with trend_col2:
        st.line_chart(patient_df.set_index("date")["recovery_score"]) 
    with trend_col3:
        st.line_chart(patient_df.set_index("date")["energy_harvested_mj"]) 

st.subheader("Daily Activity Snapshot")
if not intraday_df.empty:
    st.dataframe(intraday_df.head(50), use_container_width=True)

st.sidebar.header("Navigation")
st.sidebar.write("This Streamlit app provides a quick overview of the rehabilitation demo dataset.")
st.sidebar.write("It is intended for prototype exploration and demo purposes only.")

st.sidebar.subheader("Dataset")
st.sidebar.write(f"Rehab records: {len(rehab_df)}")
st.sidebar.write(f"Intraday records: {len(intraday_df)}")

st.sidebar.markdown(
    """
    ### Notes
    - Demo data only
    - Not for clinical use
    - Research prototype
    """
)
