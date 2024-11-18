import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import r2_score, mean_squared_error, mean_absolute_error

class RainfallModel:
    def _init_(self, data_path):
        self.data_path = data_path
        self.scaler = StandardScaler()
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.state_mapping = {}
        self.load_and_prepare_data()

    def load_and_prepare_data(self):
        # Load the data
        df = pd.read_csv(self.data_path)

        # Map states to numeric values
        self.state_mapping = {state: idx for idx, state in enumerate(df['State'].unique())}
        df['State'] = df['State'].map(self.state_mapping)

        # Features and target variable
        X = df[['Crop_Year', 'State']]
        y = df['Annual_Rainfall']  # Ensure your dataset has this column

        # Train/test split
        self.X_train, self.X_test, self.y_train, self.y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        # Feature scaling
        self.X_train_scaled = self.scaler.fit_transform(self.X_train)
        self.X_test_scaled = self.scaler.transform(self.X_test)

        # Train the model
        self.model.fit(self.X_train_scaled, self.y_train)

    def predict(self, year, state):
        # Convert state to numeric
        if state not in self.state_mapping:
            raise ValueError(f"State '{state}' is not in the dataset. Please check the state name.")

        state_num = self.state_mapping[state]
        input_data = pd.DataFrame([[year, state_num]], columns=['Crop_Year', 'State'])
        input_scaled = self.scaler.transform(input_data)

        return self.model.predict(input_scaled)

    def evaluate(self):
        y_pred = self.model.predict(self.X_test_scaled)
        r2 = r2_score(self.y_test, y_pred)
        mse = mean_squared_error(self.y_test, y_pred)
        mae = mean_absolute_error(self.y_test, y_pred)

        return {
            'r2_score': r2,
            'mean_squared_error': mse,
            'mean_absolute_error': mae
        }