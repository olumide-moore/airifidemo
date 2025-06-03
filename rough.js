


// Simulate real-time updates
//This would automatically update your chart every 2 seconds.

const [data, setData] = useState(initialData);

useEffect(() => {
  const interval = setInterval(() => {
    setData(prev => [...prev.slice(1), getNewDataPoint()]);
  }, 2000);

  return () => clearInterval(interval);
}, []);
