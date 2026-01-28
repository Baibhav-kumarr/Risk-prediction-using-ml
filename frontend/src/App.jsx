import { useState } from "react";
import axios from "axios";

export default function App() {
  const [formData, setFormData] = useState({
    person_age: "",
    person_income: "",
    person_emp_length: "",
    person_home_ownership: "RENT",
    loan_percent_income: ""
  });

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult("");

    try {
      const res = await axios.post(import.meta.env.VITE_API_BASE + "/predict", {
        person_age: Number(formData.person_age),
        person_income: Number(formData.person_income),
        person_emp_length: Number(formData.person_emp_length),
        person_home_ownership: formData.person_home_ownership,
        loan_percent_income: Number(formData.loan_percent_income)
      });

      setResult(res.data.risk);
    } catch (err) {
      setResult("❌ Error connecting to backend");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8">

        <h1 className="text-3xl font-bold text-center text-slate-800">
          Credit Risk Prediction
        </h1>
        <p className="text-center text-slate-500 mt-1 mb-6">
          Decision Tree Based Model
        </p>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Numeric Inputs */}
          {[
            ["person_age", "Age"],
            ["person_income", "Annual Income"],
            ["person_emp_length", "Employment Years"],
            ["loan_percent_income", "Loan % of Income"]
          ].map(([name, label]) => (
            <div key={name}>
              <label className="block text-sm font-medium text-slate-700">
                {label}
              </label>
              <input
                type="number"
                name={name}
                required
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          ))}

          {/* Select */}
          <Select
            label="Home Ownership"
            name="person_home_ownership"
            options={["RENT", "OWN"]}
            onChange={handleChange}
          />

          {/* Submit */}
          <div className="md:col-span-2 mt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? "Predicting..." : "Predict Risk"}
            </button>
          </div>
        </form>

        {result && (
          <div
            className={`mt-6 text-center text-lg font-semibold ${
              result.includes("LOW")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {result}
          </div>
        )}
      </div>
    </div>
  );
}

function Select({ label, name, options, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <select
        name={name}
        onChange={onChange}
        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
