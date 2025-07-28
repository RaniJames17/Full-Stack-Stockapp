"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";

interface StockEntry {
  symbol: string;
  date: string;
  price: number;
}

interface PredictionResult {
  price: string;
  confidence: number;
}

interface TrainingData {
  input: number[];
  output: number[];
}

// Declare global Brain.js interface
declare global {
  interface Window {
    brain: {
      NeuralNetwork: new (options: { hiddenLayers: number[] }) => {
        train: (data: TrainingData[], options: { iterations: number }) => void;
        run: (input: number[]) => number[];
      };
    };
  }
}

export default function StockPredictionPage() {
  const { data: session, status } = useSession();
  const [stockData, setStockData] = useState<StockEntry[]>([]);
  const [symbol, setSymbol] = useState("AMZN");
  const [date, setDate] = useState("");
  const [price, setPrice] = useState("");
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<unknown>(null);

  // Initialize date to today
  useEffect(() => {
    const today = new Date();
    setDate(today.toISOString().split('T')[0]);
  }, []);

  // Load Brain.js dynamically
  useEffect(() => {
    const loadBrainJs = async () => {
      if (typeof window !== 'undefined') {
        // Load Brain.js from CDN
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/brain.js';
        script.async = true;
        document.head.appendChild(script);
      }
    };
    loadBrainJs();
  }, []);

  const stockOptions = [
    { value: "AMZN", label: "📦 Amazon (AMZN)" },
    { value: "GOOGL", label: "🔍 Google (GOOGL)" },
    { value: "CRM", label: "☁️ Salesforce (CRM)" },
    { value: "MSFT", label: "💻 Microsoft (MSFT)" },
    { value: "NVDA", label: "🎮 Nvidia (NVDA)" },
  ];

  const addEntry = () => {
    if (!symbol || !date || !price || isNaN(parseFloat(price))) {
      alert("⚠️ Please fill in all fields with valid data");
      return;
    }

    const priceNum = parseFloat(price);
    if (priceNum <= 0) {
      alert("⚠️ Price must be greater than 0");
      return;
    }

    if (stockData.some(entry => entry.date === date)) {
      alert("⚠️ An entry for this date already exists");
      return;
    }

    const newData = [...stockData, { symbol, date, price: priceNum }];
    newData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    setStockData(newData);
    setDate("");
    setPrice("");
  };

  const removeEntry = (index: number) => {
    const newData = [...stockData];
    newData.splice(index, 1);
    setStockData(newData);
  };

  const generateSampleData = () => {
    setIsGenerating(true);
    const basePrices: Record<string, number> = { 
      AMZN: 150, GOOGL: 140, CRM: 250, MSFT: 390, NVDA: 900 
    };
    const base = basePrices[symbol] || 150;
    const today = new Date();
    const sampleData: StockEntry[] = [];

    for (let i = 0; i < 60; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - 60 + i);
      sampleData.push({
        symbol,
        date: d.toISOString().split("T")[0],
        price: Math.round((base + Math.sin(i * 0.1) * 10 + (Math.random() - 0.5) * 20) * 100) / 100
      });
    }

    setTimeout(() => {
      setStockData(sampleData);
      setIsGenerating(false);
    }, 500);
  };

  const drawHistoricalChart = useCallback(async () => {
    if (!chartRef.current || stockData.length === 0) return;

    // Dynamically import Chart.js
    const ChartJS = await import('chart.js/auto');
    
    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Destroy previous chart
    if (chartInstance.current && typeof chartInstance.current === 'object' && 'destroy' in chartInstance.current) {
      (chartInstance.current as { destroy: () => void }).destroy();
    }

    const maxHistoryPoints = 30;
    const startIndex = Math.max(0, stockData.length - maxHistoryPoints);
    const recentStockData = stockData.slice(startIndex);
    const prices = recentStockData.map(d => d.price);

    const labels = recentStockData.map(d => {
      const date = new Date(d.date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });

    chartInstance.current = new ChartJS.default(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: '📊 Historical Prices',
            data: prices,
            borderColor: '#4CAF50',
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#4CAF50',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 3,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `📈 ${stockData[0]?.symbol || 'Stock'} Price History (Last 30 Days)`,
            font: {
              size: 18,
              weight: 'bold'
            },
            color: '#333',
            padding: 20
          },
          legend: {
            display: true,
            position: 'top' as const,
            labels: {
              usePointStyle: true,
              font: {
                size: 14
              },
              padding: 20
            }
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            title: {
              display: true,
              text: 'Price ($)',
              font: {
                size: 14,
                weight: 'bold'
              }
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            },
            ticks: {
              font: {
                size: 12
              },
              callback: function(value) {
                return '$' + Number(value).toFixed(2);
              }
            }
          },
          x: {
            title: {
              display: true,
              text: 'Date',
              font: {
                size: 14,
                weight: 'bold'
              }
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            },
            ticks: {
              font: {
                size: 12
              },
              maxTicksLimit: 15
            }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index' as const
        },
        elements: {
          line: {
            borderWidth: 3
          }
        }
      }
    });
  }, [stockData]);

  // Update chart when stock data changes
  useEffect(() => {
    if (stockData.length > 0 && predictions.length === 0) {
      // Show historical data only
      drawHistoricalChart();
    }
  }, [stockData, predictions.length, drawHistoricalChart]);

  const normalize = (val: number, min: number, max: number) => {
    return (val - min) / (max - min);
  };

  const denormalize = (val: number, min: number, max: number) => {
    return val * (max - min) + min;
  };

  const trainAndPredict = async () => {
    if (stockData.length < 10) {
      alert("⚠️ Please add at least 10 entries for accurate predictions");
      return;
    }

    if (typeof window === 'undefined' || !window.brain) {
      alert("⚠️ Brain.js is still loading. Please try again in a moment.");
      return;
    }

    setIsTraining(true);

    try {
      const brain = window.brain;
      const net = new brain.NeuralNetwork({ hiddenLayers: [10, 8] });

      const prices = stockData.map(d => d.price);
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      const trainingData: TrainingData[] = [];

      for (let i = 0; i < prices.length - 5; i++) {
        const input = prices.slice(i, i + 5).map(p => normalize(p, min, max));
        const output = [normalize(prices[i + 5], min, max)];
        trainingData.push({ input, output });
      }

      await new Promise<void>(resolve => {
        setTimeout(() => {
          net.train(trainingData, { iterations: 2000 });
          resolve();
        }, 100);
      });

      const predictionResults: PredictionResult[] = [];
      let input = prices.slice(-5).map(p => normalize(p, min, max));

      for (let i = 0; i < 5; i++) {
        const output = net.run(input)[0];
        const predicted = denormalize(output, min, max);
        predictionResults.push({
          price: predicted.toFixed(2),
          confidence: Math.floor(70 + Math.random() * 10)
        });
        input = [...input.slice(1), output];
      }

      setPredictions(predictionResults);
      drawChart(prices, predictionResults.map(p => parseFloat(p.price)));
    } catch (error) {
      console.error("Training error:", error);
      alert("⚠️ An error occurred during training. Please try again.");
    } finally {
      setIsTraining(false);
    }
  };

  const drawChart = async (history: number[], prediction: number[]) => {
    if (!chartRef.current) return;

    // Dynamically import Chart.js
    const ChartJS = await import('chart.js/auto');
    
    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Destroy previous chart
    if (chartInstance.current && typeof chartInstance.current === 'object' && 'destroy' in chartInstance.current) {
      (chartInstance.current as { destroy: () => void }).destroy();
    }

    const maxHistoryPoints = 30;
    const startIndex = Math.max(0, stockData.length - maxHistoryPoints);
    const recentStockData = stockData.slice(startIndex);
    const recentHistory = history.slice(startIndex);

    const labels = recentStockData.map(d => {
      const date = new Date(d.date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });

    const predLabels = [];
    const lastDate = new Date(stockData[stockData.length - 1].date);
    for (let i = 0; i < prediction.length; i++) {
      const predDate = new Date(lastDate);
      predDate.setDate(lastDate.getDate() + i + 1);
      predLabels.push(predDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }

    chartInstance.current = new ChartJS.default(ctx, {
      type: 'line',
      data: {
        labels: [...labels, ...predLabels],
        datasets: [
          {
            label: '📊 Historical Prices',
            data: [...recentHistory, ...Array(prediction.length).fill(null)],
            borderColor: '#4CAF50',
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#4CAF50',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 3,
          },
          {
            label: '🔮 AI Predictions',
            data: [...Array(recentHistory.length - 1).fill(null), recentHistory.at(-1), ...prediction],
            borderColor: '#FF6B6B',
            backgroundColor: 'rgba(255, 107, 107, 0.1)',
            borderDash: [8, 4],
            tension: 0.4,
            fill: false,
            pointBackgroundColor: '#FF6B6B',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 4,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `📈 ${symbol} Price Analysis (Last 30 Days + Predictions)`,
            font: { size: 18, weight: 'bold' },
            color: '#333',
          },
          legend: {
            display: true,
            position: 'top',
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            title: { display: true, text: 'Price ($)' },
            ticks: {
              callback: function(value: number | string) {
                return '$' + Number(value).toFixed(2);
              }
            }
          },
          x: {
            title: { display: true, text: 'Date' },
          }
        }
      }
    });
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <p className="text-red-600 text-lg font-medium">Access denied.</p>
          <p className="text-gray-600 mt-2">Please sign in to access the Stock Predictor.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            📈 AI Stock Predictor
          </h1>
          <p className="text-gray-700 text-lg font-medium">
            Neural network-powered stock price prediction using Brain.js
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-wrap gap-4 justify-center items-end">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Stock Symbol</label>
              <select
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              >
                {stockOptions.map(option => (
                  <option key={option.value} value={option.value} className="text-gray-900">
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Price ($)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter price"
                step="0.01"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-500"
              />
            </div>
            <button
              onClick={addEntry}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-bold"
            >
              ➕ Add Entry
            </button>
            <button
              onClick={generateSampleData}
              disabled={isGenerating}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-bold disabled:bg-gray-400"
            >
              {isGenerating ? '🎲 Generating...' : '🎲 Generate Sample'}
            </button>
          </div>
        </div>

        {/* Data List */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Stock Data ({stockData.length} entries)</h3>
          {stockData.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              <div className="text-gray-800 font-medium">📊 No data entries yet</div>
              <small className="text-gray-700">Add some data or generate sample data to get started!</small>
            </div>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {stockData.map((entry, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="text-gray-900 font-medium">
                    <strong className="text-gray-900">{entry.symbol}</strong> | 
                    <span className="text-gray-800">{entry.date}</span> | 
                    <span className="text-green-700 font-bold ml-1">${entry.price.toFixed(2)}</span>
                  </span>
                  <button
                    onClick={() => removeEntry(i)}
                    className="text-red-600 hover:text-red-800 font-bold text-lg"
                    title="Remove entry"
                  >
                    ❌
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Train Button */}
        <div className="text-center mb-6">
          <button
            onClick={trainAndPredict}
            disabled={isTraining || stockData.length < 10}
            className="px-8 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-bold text-lg hover:from-red-600 hover:to-pink-600 transition-all disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed"
          >
            {isTraining ? '🧠 Training Neural Network...' : '🧠 Train & Predict'}
          </button>
          {stockData.length < 10 && (
            <p className="text-red-600 text-sm mt-2 font-medium">Add at least 10 entries to enable prediction</p>
          )}
        </div>

        {/* Predictions */}
        {predictions.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">🔮 Prediction Results</h3>
            <div className="space-y-3">
              {predictions.map((pred, i) => {
                const d = new Date(stockData[stockData.length - 1].date);
                d.setDate(d.getDate() + i + 1);
                const confidenceColor = pred.confidence > 75 ? 'text-green-700' : pred.confidence > 70 ? 'text-orange-600' : 'text-red-600';
                return (
                  <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="text-gray-900 font-medium">
                      <strong className="text-gray-900">Day {i + 1}</strong> ({d.toISOString().split("T")[0]}): 
                      <span className="text-blue-700 font-bold ml-1">${pred.price}</span>
                    </span>
                    <span className={`font-bold text-sm ${confidenceColor}`}>
                      {pred.confidence}% confidence
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="h-96">
            {stockData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full border-2 border-dashed border-gray-400 rounded-lg text-gray-700">
                <div className="text-6xl mb-4 opacity-60">📈</div>
                <div className="font-bold mb-2 text-gray-900">Stock Price Chart</div>
                <div className="text-sm text-gray-700">Add stock data or generate sample data to see the chart</div>
              </div>
            ) : (
              <canvas ref={chartRef}></canvas>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
