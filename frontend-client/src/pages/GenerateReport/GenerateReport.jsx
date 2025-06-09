import { useEffect, useState } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  TextField,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import ButtonComponent from "../../widgets/ButtonComponent";
import classes from "./GenerateReport.module.css"


const LegendCheckbox = ({ label, checked, onChange, color }) => (
  <FormControlLabel
    control={
      <Checkbox
        checked={checked}
        onChange={onChange}
        sx={{
          color,
          '&.Mui-checked': {
            color,
          },
        }}
      />
    }
    label={<Typography variant="body2">{label}</Typography>}
  />
);

export default function PredictSales({ company }) {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showActual, setShowActual] = useState(true);
  const [showPrediction, setShowPrediction] = useState(true);

  const token = localStorage.getItem("token");
  const backendUrl = "http://localhost:4000/api/product";

  useEffect(() => {
    const companyId = company.companyId;

    const fetchProductsByCompany = async () => {
      try {
        const res = await axios.get(`${backendUrl}/company/${companyId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(res.data?.data || []);
      } catch (err) {
        setError("Failed to load products.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsByCompany();
  }, [company.companyId, token]);

  const handleGenerate = async () => {
    setError('');
    setReport(null);

  if (!selectedProductId || !selectedDate) {
    setError("Please select a product and a month/year.");
    return;
  }

  const product = products.find((p) => p.id === selectedProductId || p.id === Number(selectedProductId));
  if (!product) {
    setError('Selected product not found.');
    return;
  }

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth() + 1;

  setLoading(true);

  try {
    const predictRes = await axios.post("http://localhost:4000/api/report/user",
          { name: product.name, month, year },
          { headers: { Authorization: `Bearer ${token}` } }
        );

    // const prediction = predictRes.data.prediction;
    // const message = predictRes.data.message;

    // const actualValues = predictRes?.data?.actual_values || [];
    // const createdByRole = predictRes?.data?.created_by?.role || 'N/A';

    const predictions = predictRes.data.predictions || [];
    const actualValues = predictRes.data.actual_values || [];
    const createdByRole = predictRes?.data?.created_by?.role || 'N/A';
    const message = predictRes.data.message;
      //new
    const chartData = predictions
    .sort((a, b) => a.month - b.month)
    .map((entry) => ({
      monthYear: `${entry.month}/${selectedDate.getFullYear()}`,
      predicted: entry.prediction,
    }));

    // Add actuals to chartData
    actualValues?.forEach((entry) => {
      const label = `${entry.month}/${entry.year}`;
      const existing = chartData.find((d) => d.monthYear === label);
      if (existing) {
        existing.actual = entry.quantity_sold;
      } else {
        chartData.push({
          monthYear: label,
          actual: entry.quantity_sold,
        });
      }
    });

    // Add selected date as placeholder if missing
    const selectedLabel = `${month}/${year}`;
    const exists = chartData.some((d) => d.monthYear === selectedLabel);
    if (!exists) {
      chartData.push({
        monthYear: selectedLabel,
        predicted: null,
        actual: null,
      });
    }
    //new

    setReport({
      product,
      predictions:chartData,
      message,
      actualValues,
      createdByRole,
      selectedDate,
    });
  } catch (err) {
    setError('Unexpected error occurred.');
    console.error('Prediction failed', err);

    setReport({
      product,
      prediction: null,
      message: 'Prediction failed',
      actualValues: [],
      createdByRole: 'Unavailable',
      selectedDate,
    });
  } finally {
    setLoading(false);
  }
};

  // const formattedChartData = () => {
  //   if (!report || !selectedDate) return [{ monthYear: ''}, { monthYear: ''}, { monthYear: ''}, { monthYear: ''}, { monthYear: ''}, { monthYear: ''}];

  //   const chartData = report.actualValues.map((entry) => {
  //     const label = `${entry.month}/${entry.year}`;
  //     return {
  //       monthYear: label,
  //       actual: entry.quantity_sold,
  //       predicted:
  //         label === `${selectedDate.getMonth() + 1}/${selectedDate.getFullYear()}`
  //           ? report.prediction
  //           : null,
  //     };
  //   });


  const formattedChartData = () => {
  if (!report || !selectedDate) return [];

  const actualMap = new Map();
  report.actualValues?.forEach((entry) => {
    const label = `${entry.month}/${entry.year}`;
    actualMap.set(label, entry.quantity_sold);
  });

  const predictedMap = new Map();
  //  report.actualValues?.forEach((entry) => {
  //   const label = `${entry.month}/${entry.year}`;
  //   predictedMap.set(label, entry.quantity_sold);
  // });
  report.predictions?.forEach((entry) => {
    if (predictedMap.get(entry.monthYear) === undefined)
       predictedMap.set(entry.monthYear, entry.predicted);
  });
  console.log("sadadsad", predictedMap)
  const allLabels = new Set([...actualMap.keys(), ...predictedMap.keys()]);
  const mergedData = Array.from(allLabels).sort((a, b) => {
    const [am, ay] = a.split('/').map(Number);
    const [bm, by] = b.split('/').map(Number);
    return new Date(ay, am - 1) - new Date(by, bm - 1);
  }).map((label) => ({
    monthYear: label,
    actual: showActual ? actualMap.get(label) ?? null : null,
    predicted: showPrediction ? predictedMap.get(label) ?? null : null,
  }));
    return mergedData;
};


    // const selectedLabel = `${selectedDate.getMonth() + 1}/${selectedDate.getFullYear()}`;
    // const alreadyExists = chartData.some((entry) => entry.monthYear === selectedLabel);

  //   if (!alreadyExists) {
  //     chartData.push({
  //       monthYear: selectedLabel,
  //       actual: null,
  //       predicted: report.prediction,
  //     });
  //   }

  //   return chartData;
  // };

  const data = formattedChartData();
  const showGrids = !report || !selectedDate || (!showActual && !showPrediction);
  

   return (
    <div className={classes.container}>
        <div className={classes.title}>
          Predict Product Sales
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#fff', marginTop: '16px', marginBottom: '8px', width: 'calc(100% - 120px)'}}>
        <FormControl sx={{width: '246px'}} size="small">
          <InputLabel size="small">Product</InputLabel>
          <Select size="small"
          value={selectedProductId ?? ""}
          onChange={(e) => setSelectedProductId((e.target.value))}
          label="Product"
          sx={{
              '& .MuiSelect-select': {
                textAlign: 'left'
              }
            }}
          >
          {products
            .map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.name}
              </MenuItem>
          ))}
          </Select>
        </FormControl>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            size="small"
            views={['year', 'month']}
            label="Month and Year"
            minDate={new Date(2000, 0)}
            maxDate={new Date(2100, 11)}
            value={selectedDate}
            onChange={setSelectedDate}
            slotProps={{
               textField: {
                 size: 'small',
                 helperText: null
               }
             }}
          />
        </LocalizationProvider>

        <ButtonComponent variant="contained" className="button" onClick={handleGenerate} disabled={loading} sx={{height: '38px !important', width: '150px'}}>
          Generate
        </ButtonComponent>
        {loading && <CircularProgress size={24} sx={{color:"#d5d2d5"}}/>}
      </div>
      {/* <ResponsiveContainer width="100%" height={350} style={{marginBottom: '-26px', height: '100%'}}>
        <LineChart data={data} margin={{ top: 20, right: 50, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="monthYear"  padding={{ left: 0, right: 200 }}/>
          <YAxis domain={showGrids ? [0, 1000] : undefined} ticks={showGrids ? [0, 250, 500, 750, 1000] : undefined} padding={{ top: 60 }}/>
          <Tooltip />

          {showActual && <Line
            type="monotone"
            dataKey="actual"
            stroke="#8884d8"
            name="Actual Sales"
            dot={{ r: 3 }}
          />}
          {showPrediction && <Line
            type="monotone"
            dataKey="predicted"
            stroke="#82ca9d"
            name="Predicted Sales"
            dot={{ r: 5, fill: '#82ca9d' }}
            strokeDasharray="5 5"
          />}
        </LineChart>
      </ResponsiveContainer> */}

        <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data} margin={{ top: 20, right: 50, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="monthYear" />
          <YAxis />
          <Tooltip />

          {showActual && (
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#8884d8"
              name="Actual Sales"
              dot={{ r: 3 }}
            />
          )}
          {showPrediction && (
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="#82ca9d"
              name="Predicted Sales"
              dot={{ r: 5, fill: '#82ca9d' }}
              strokeDasharray="5 5"
            />
          )}
        </LineChart>
      </ResponsiveContainer>
      <Box mt={2} display="flex" justifyContent="center" gap={4}>
        <LegendCheckbox
          label="Actual Sales"
          checked={showActual}
          onChange={() => setShowActual(!showActual)}
          color="#8884d8"
        />
        <LegendCheckbox
          label="Prediction"
          checked={showPrediction}
          onChange={() => setShowPrediction(!showPrediction)}
          color="#82ca9d"
        />
      </Box>
        <div className={classes.detailsContainer}>
          <div className={classes.detailsContent}>
            Price: <span className={classes.highlightedDetails}>{`${report ? '₪' + report.product.price : '--'}`}</span>
          </div>
          <hr className={classes.separator} />
          <div className={classes.detailsContent}>
            Discount: <span className={classes.highlightedDetails}>{`${report ? report.product.discount + '%' : '--'}`}</span>
          </div>
          <hr className={classes.separator} />
          <div className={classes.detailsContent}>
            Brand: <span className={classes.highlightedDetails}>{`${report ? report.product.brand : '--'}`}</span>
          </div>
          <hr className={classes.separator} />
          <div className={classes.detailsContent}>
            Prediction Date: <span className={classes.highlightedDetails}>{`${selectedDate ? (selectedDate.getMonth() + 1 + '/' + selectedDate.getFullYear()) : '--'}`}</span>
          </div>
          <hr className={classes.separator} />
          <div className={classes.detailsContent}>
            Requested By: <span className={classes.highlightedDetails}>{`${report ? report.createdByRole : '--'}`}</span>
          </div>
          <hr className={classes.separator} />
          <div className={classes.detailsContent}>
          Predicted Quantity: <span className={classes.highlightedDetails}>{report?.predictions?.length > 0
              ? (
                  report.predictions.find(
                    (d) =>
                      d.monthYear ===
                      `${selectedDate?.getMonth() + 1}/${selectedDate?.getFullYear()}`
                  )?.predicted?.toFixed(2) ?? '--'
                )
              : '--'}</span>
          </div>
        </div>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
     </div>
  );
};
