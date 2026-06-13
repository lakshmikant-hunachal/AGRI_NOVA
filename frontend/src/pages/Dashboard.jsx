import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, Upload, RefreshCw, Save, CheckCircle, AlertTriangle, 
  Video, X, Sliders, TrendingUp, CloudSun, CircleDollarSign, 
  MessageSquare, Calendar, User, MapPin, Send, Loader, Wifi 
} from 'lucide-react';
import { 
  saveScan, scanCropImage, scanSoilImage, chatWithAI, 
  getWeatherAdvisory, getMandiPrices, getUserScans 
} from '../api/api';
import { useTranslation } from '../context/LanguageContext';

// Localized translation dictionaries for the newly added features
const localDict = {
  en: {
    navScanner: "Disease Scanner",
    navSoil: "Soil Advisor",
    navHistory: "My Scans",
    navWeather: "Weather Advisory",
    navMandi: "Mandi Prices",
    navChatbot: "Expert Chatbot",
    navProfile: "Farm Profile",
    offlineMsg: "You are currently offline. Using cached scanner diagnostics.",
    onlineMsg: "Back online! Syncing records.",
    weatherTitle: "Live Weather & Smart Advisory",
    tempLabel: "Temperature",
    humidityLabel: "Humidity",
    forecastLabel: "Forecast",
    uvLabel: "UV Index",
    rainLabel: "Rain Probability",
    locating: "Determining coordinates...",
    weatherFail: "Could not fetch weather data. Check connection.",
    mandiTitle: "Mandi Market Prices (Agmarknet)",
    mandiSearchPlaceholder: "Search by crop, state or market...",
    mandiCrop: "Crop",
    mandiState: "State",
    mandiMarket: "Market",
    mandiPrice: "Price / Qtl",
    mandiTrend: "Trend",
    chatbotTitle: "AgriNova Expert Chatbot",
    chatbotPlaceholder: "Ask about blights, fertilizers, sowing tips...",
    profileTitle: "My Farm Profile",
    profileSetupDesc: "Save your farm attributes to generate a customized seasonal crop calendar.",
    profileAcre: "Farm Area (Acres)",
    profileState: "Region / State",
    profileCrop: "Active Crop",
    profileSowingDate: "Sowing Date",
    profileBtnSave: "Generate Crop Calendar",
    calendarTitle: "Your Seasonal Crop Calendar",
    daysUnit: "Days",
    historyTitle: "Scan Records History",
    historyEmpty: "No previous scans found. Go to the Disease Scanner to run your first check!",
    activeCrop: "Active Crop",
    gradeBadge: "Grade"
  },
  hi: {
    navScanner: "बीमारी स्कैनर",
    navSoil: "मिट्टी सलाहकार",
    navHistory: "इतिहास",
    navWeather: "मौसम सलाहकार",
    navMandi: "मंडी दरें",
    navChatbot: "कृषि चैटबॉट",
    navProfile: "खेत प्रोफ़ाइल",
    offlineMsg: "आप वर्तमान में ऑफ़लाइन हैं। लोकल स्कैनर का उपयोग कर रहे हैं।",
    onlineMsg: "वापस ऑनलाइन! रिकॉर्ड सिंक हो रहे हैं।",
    weatherTitle: "लाइव मौसम और स्मार्ट सलाह",
    tempLabel: "तापमान",
    humidityLabel: "आर्द्रता",
    forecastLabel: "पूर्वानुमान",
    uvLabel: "यूवी सूचकांक",
    rainLabel: "बारिश की संभावना",
    locating: "स्थान का पता लगाया जा रहा है...",
    weatherFail: "मौसम डेटा प्राप्त नहीं हो सका। कनेक्शन जांचें।",
    mandiTitle: "मंडी बाजार भाव (एगमार्कनेट)",
    mandiSearchPlaceholder: "फसल, राज्य या मंडी द्वारा खोजें...",
    mandiCrop: "फसल",
    mandiState: "राज्य",
    mandiMarket: "बाजार",
    mandiPrice: "मूल्य / क्विंटल",
    mandiTrend: "रुझान",
    chatbotTitle: "एग्रीनोवा कृषि चैटबॉट",
    chatbotPlaceholder: "बीमारियों, उर्वरकों, बुवाई के बारे में पूछें...",
    profileTitle: "मेरी खेत प्रोफ़ाइल",
    profileSetupDesc: "कस्टमाइज्ड मौसमी फसल कैलेंडर बनाने के लिए खेत के विवरण सहेजें।",
    profileAcre: "खेत का क्षेत्रफल (एकड़)",
    profileState: "क्षेत्र / राज्य",
    profileCrop: "सक्रिय फसल",
    profileSowingDate: "बुवाई की तारीख",
    profileBtnSave: "फसल कैलेंडर बनाएं",
    calendarTitle: "आपका मौसमी फसल कैलेंडर",
    daysUnit: "दिन",
    historyTitle: "स्कैन रिकॉर्ड इतिहास",
    historyEmpty: "कोई पुराना स्कैन नहीं मिला। पहली जांच के लिए बीमारी स्कैनर पर जाएं!",
    activeCrop: "सक्रिय फसल",
    gradeBadge: "ग्रेड"
  },
  ta: {
    navScanner: "நோய் ஸ்கேனர்",
    navSoil: "மண் ஆலோசகர்",
    navHistory: "எனது ஸ்கேன்கள்",
    navWeather: "வானிலை ஆலோசனை",
    navMandi: "மண்டி விலைகள்",
    navChatbot: "அரட்டை ஆலோசகர்",
    navProfile: "பண்ணை சுயவிவரம்",
    offlineMsg: "நீங்கள் தற்போது ஆஃப்லைனில் உள்ளீர்கள். ஆஃப்லைன் கண்டறிதல் பயன்படுத்தப்படுகிறது.",
    onlineMsg: "மீண்டும் ஆன்லைனில்! பதிவுகள் ஒத்திசைக்கப்படுகின்றன.",
    weatherTitle: "நேரடி வானிலை மற்றும் ஸ்மார்ட் ஆலோசனை",
    tempLabel: "வெப்பநிலை",
    humidityLabel: "ஈரப்பதம்",
    forecastLabel: "வானிலை முன்னறிவிப்பு",
    uvLabel: "UV குறியீடு",
    rainLabel: "மழைக்கான வாய்ப்பு",
    locating: "இருப்பிடத்தைக் கண்டறிகிறது...",
    weatherFail: "வானிலை தரவைப் பெற முடியவில்லை. இணைப்பைச் சரிபார்க்கவும்.",
    mandiTitle: "மண்டி சந்தை விலைகள் (அக்மார்க்நெட்)",
    mandiSearchPlaceholder: "பயிர், மாநிலம் அல்லது சந்தை மூலம் தேடுங்கள்...",
    mandiCrop: "பயிர்",
    mandiState: "மாநிலம்",
    mandiMarket: "சந்தை",
    mandiPrice: "விலை / குவிண்டால்",
    mandiTrend: "போக்கு",
    chatbotTitle: "அக்ரிநோவா அரட்டை ஆலோசகர்",
    chatbotPlaceholder: "பயிர் நோய்கள், உரங்கள், விதைப்பு குறிப்புகள் கேட்கவும்...",
    profileTitle: "என் பண்ணை சுயவிவரம்",
    profileSetupDesc: "தனிப்பயனாக்கப்பட்ட பயிர் காலெண்டரை உருவாக்க உங்கள் பண்ணை விவரங்களைச் சேமிக்கவும்.",
    profileAcre: "பண்ணை பரப்பளவு (ஏக்கர்)",
    profileState: "மாநிலம் / பகுதி",
    profileCrop: "பயிரிடப்படும் பயிர்",
    profileSowingDate: "விதைத்த தேதி",
    profileBtnSave: "பயிர் காலெண்டரை உருவாக்கு",
    calendarTitle: "உங்கள் பயிர் காலண்டர்",
    daysUnit: "நாட்கள்",
    historyTitle: "கடந்த கால ஸ்கேன் வரலாறு",
    historyEmpty: "ஸ்கேன்கள் எதுவும் இல்லை. நோய் ஸ்கேனரைப் பயன்படுத்தி முதல் சோதனையைத் தொடங்குங்கள்!",
    activeCrop: "பயிரிடப்படும் பயிர்",
    gradeBadge: "தரம்"
  }
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { lang, t } = useTranslation();

  // Helper to resolve localized text dynamically with fallback to English
  const getLocText = (key) => {
    const activeLang = localDict[lang] || localDict['en'];
    return activeLang[key] || localDict['en'][key] || key;
  };

  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('scanner');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  // Crop Scanner States
  const [selectedImage, setSelectedImage] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [scanSaved, setScanSaved] = useState(false);
  
  // Soil Advisor States
  const [selectedSoilImage, setSelectedSoilImage] = useState(null);
  const [isSoilScanning, setIsSoilScanning] = useState(false);
  const [soilResult, setSoilResult] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('');
  const [selectedWater, setSelectedWater] = useState('');
  const [advisoryResult, setAdvisoryResult] = useState(null);
  const [cropQuality, setCropQuality] = useState(null);
  const [animateCharts, setAnimateCharts] = useState(false);

  // Scan History
  const [historyList, setHistoryList] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Weather States
  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState('');
  const [coords, setCoords] = useState(null);

  // Mandi States
  const [mandiPrices, setMandiPrices] = useState([]);
  const [mandiSearch, setMandiSearch] = useState('');
  const [mandiLoading, setMandiLoading] = useState(false);

  // Chatbot States
  const [messages, setMessages] = useState([
    {
      role: 'model',
      text: lang === 'hi' 
        ? "नमस्ते! मैं एग्रीनोवा हूँ, आपका सहायक कृषि सलाहकार। मुझसे फसलों, मिट्टी, खाद या कीटों के बारे में कोई भी प्रश्न पूछें।" 
        : lang === 'ta'
        ? "வணக்கம்! நான் அக்ரிநோவா, உங்கள் வேளாண் ஆலோசகர். பயிர்கள், மண், உரங்கள் அல்லது பூச்சிகள் பற்றி ஏதேனும் கேள்வி கேட்கலாம்."
        : "Namaste! I am AgriNova, your personal farming AI assistant. Ask me anything about crop diseases, soils, fertilizer calculations, or sowing tips."
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatBottomRef = useRef(null);

  // Farm Profile & Crop Calendar States
  const [farmProfile, setFarmProfile] = useState(() => {
    const saved = localStorage.getItem('farm_profile');
    return saved ? JSON.parse(saved) : { area: '', region: '', crop: '', sowingDate: '' };
  });
  const [generatedCalendar, setGeneratedCalendar] = useState(null);

  // Camera & Refs
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraType, setCameraType] = useState('crop'); // 'crop' or 'soil'
  
  const fileInputRef = useRef(null);
  const soilFileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Online/Offline Status listener
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Fetch basic user context
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
    } else {
      setUser(JSON.parse(userData));
    }
    
    return () => stopCamera();
  }, [navigate]);

  // Handle auto-scroll chatbot
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Load weather when weather tab is loaded
  useEffect(() => {
    if (activeTab === 'weather' && !weatherData) {
      fetchUserLocationAndWeather();
    }
  }, [activeTab]);

  // Load Mandi prices when mandi tab is loaded
  useEffect(() => {
    if (activeTab === 'mandi' && mandiPrices.length === 0) {
      fetchMandiPrices();
    }
  }, [activeTab]);

  // Load history when history tab is loaded
  useEffect(() => {
    if (activeTab === 'history' && user) {
      fetchScanHistory();
    }
  }, [activeTab, user]);

  // Initialize crop calendar if profile is fully loaded
  useEffect(() => {
    if (farmProfile.crop && farmProfile.sowingDate) {
      generateCropCalendarTimeline(farmProfile.crop, farmProfile.sowingDate);
    }
  }, [farmProfile]);

  useEffect(() => {
    if (isCameraOpen && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [isCameraOpen]);

  useEffect(() => {
    if (soilResult) {
      setAnimateCharts(false);
      const timer = setTimeout(() => setAnimateCharts(true), 100);
      return () => clearTimeout(timer);
    }
  }, [soilResult]);

  const fetchScanHistory = async () => {
    if (!user) return;
    setHistoryLoading(true);
    try {
      const data = await getUserScans(user.email);
      setHistoryList(data);
    } catch (err) {
      console.error("Error fetching scans history:", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const fetchMandiPrices = async () => {
    setMandiLoading(true);
    try {
      const data = await getMandiPrices();
      setMandiPrices(data);
    } catch (err) {
      console.error("Error fetching mandi prices:", err);
    } finally {
      setMandiLoading(false);
    }
  };

  const fetchUserLocationAndWeather = () => {
    setWeatherLoading(true);
    setWeatherError('');

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setCoords({ lat, lon });
          try {
            const data = await getWeatherAdvisory(lat, lon);
            setWeatherData(data);
          } catch (err) {
            setWeatherError(getLocText('weatherFail'));
          } finally {
            setWeatherLoading(false);
          }
        },
        async (error) => {
          console.warn("Geolocation permission denied or timed out. Falling back to default (Bangalore).");
          const defaultLat = 12.9716;
          const defaultLon = 77.5946;
          setCoords({ lat: defaultLat, lon: defaultLon });
          try {
            const data = await getWeatherAdvisory(defaultLat, defaultLon);
            setWeatherData(data);
          } catch (err) {
            setWeatherError(getLocText('weatherFail'));
          } finally {
            setWeatherLoading(false);
          }
        },
        { timeout: 10000 }
      );
    } else {
      setWeatherError("Geolocation is not supported by your browser.");
      setWeatherLoading(false);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      setIsCameraOpen(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access the camera. Please verify camera permissions.");
    }
  };

  const startCropCamera = () => {
    setCameraType('crop');
    startCamera();
  };

  const startSoilCamera = () => {
    setCameraType('soil');
    startCamera();
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageDataUrl = canvas.toDataURL('image/jpeg');
      
      if (cameraType === 'crop') {
        setSelectedImage(imageDataUrl);
        setScanResult(null);
        setScanSaved(false);
      } else {
        setSelectedSoilImage(imageDataUrl);
        setSoilResult(null);
        setAdvisoryResult(null);
        setCropQuality(null);
      }
      stopCamera();
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
        setScanResult(null);
        setScanSaved(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSoilUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedSoilImage(e.target.result);
        setSoilResult(null);
        setAdvisoryResult(null);
        setCropQuality(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Real AI Crop Scan Call
  const handleScan = async () => {
    if (!selectedImage) return;
    setIsScanning(true);
    try {
      const result = await scanCropImage(selectedImage);
      setScanResult(result);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to analyze leaf image. Please try again.");
    } finally {
      setIsScanning(false);
    }
  };

  // Real AI Soil Scan Call
  const handleSoilScan = async () => {
    if (!selectedSoilImage) return;
    setIsSoilScanning(true);
    try {
      const result = await scanSoilImage(selectedSoilImage);
      setSoilResult(result);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to analyze soil image.");
    } finally {
      setIsSoilScanning(false);
    }
  };

  const handleSaveScan = async () => {
    if (!scanResult || !user) return;
    try {
      await saveScan({
        userEmail: user.email,
        ...scanResult,
        image: selectedImage
      });
      setScanSaved(true);
      alert(t('dashboard.results.saveSuccess'));
    } catch (err) {
      console.error(err);
      alert(t('dashboard.results.saveFail'));
    }
  };

  // Chatbot send message
  const handleSendChatMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setChatLoading(true);

    try {
      // Map state messages to API history format
      const history = messages.map(m => ({ role: m.role, text: m.text }));
      const response = await chatWithAI(userMessage, history);
      setMessages(prev => [...prev, { role: 'model', text: response.reply }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I am facing a temporary issue in connecting. Please check your internet connection." }]);
    } finally {
      setChatLoading(false);
    }
  };

  // Generate Yield Strategy Planner
  const generateYieldStrategy = () => {
    if (!selectedCrop || !selectedSeason || !selectedWater) {
      alert("Please select all parameters first.");
      return;
    }

    let health = 88;
    let moisture = 14;
    let grade = 'A';
    let diseaseRes = 85;

    if (selectedWater === 'High') {
      moisture = 18;
      health += 4;
    } else if (selectedWater === 'Low') {
      moisture = 10;
      health -= 5;
      diseaseRes -= 5;
    }

    if (selectedSeason === 'Kharif') {
      health += 2;
    }

    health = Math.min(Math.max(health, 50), 98);
    moisture = Math.min(Math.max(moisture, 5), 95);
    diseaseRes = Math.min(Math.max(diseaseRes, 50), 98);
    grade = health > 92 ? 'A+' : health > 85 ? 'A' : health > 75 ? 'B+' : 'B';

    setCropQuality({ health, moisture, grade, diseaseRes });

    const strategies = {
      Tomato: {
        strategy: "Prune lower leaves and suckers to enhance airflow and light penetration. Implement crop rotation with non-solanaceous crops to reduce soil-borne pests. Maintain consistent moisture levels using drip irrigation to prevent blossom-end rot.",
        fertilizer: "Apply N-P-K in a 1:2:2 ratio during early planting. Top-dress with Calcium Nitrate at fruit set to prevent calcium deficiency. Incorporate well-decomposed organic compost."
      },
      Rice: {
        strategy: "Use System of Rice Intensification (SRI) for water saving and root development. Maintain shallow flooding (2-5 cm) until grain filling. Ensure timely mechanical weeding to reduce nutrient competition.",
        fertilizer: "Apply Urea in three split doses (50% basal, 25% active tillering, 25% panicle initiation). Incorporate single superphosphate (SSP) and muriate of potash (MOP) as basal application."
      },
      Wheat: {
        strategy: "Sow at optimum depth of 4-5 cm. Apply light irrigation at critical stages (Crown Root Initiation, flowering, and jointing). Conduct line sowing instead of broadcasting for uniform yield.",
        fertilizer: "Apply full dose of Phosphorus (P) and Potassium (K) as basal. Top-dress Nitrogen (N) in two splits after first and second irrigation. Add Zinc Sulfate to correct local micronutrient deficiencies."
      },
      Cotton: {
        strategy: "Ensure optimal plant spacing of 60x30 cm. Practice timely nipping (pinching terminal buds at 75-80 days) to promote lateral sympodial branching. Maintain soil aeration via timely inter-cultivation.",
        fertilizer: "Incorporate organic farmyard manure (FYM) before sowing. Apply Nitrogen (N) in split doses matching vegetative and flowering peaks. Supplement with Boron sprays to reduce boll shedding."
      },
      Maize: {
        strategy: "Ensure deep summer ploughing to eradicate weeds and pests. Maintain optimal plant population of 66,000 plants/hectare. Avoid waterlogging during the early growth and flowering stages.",
        fertilizer: "Apply basal dose of NPK (120:60:40 kg/ha). Apply Nitrogen top-dressing at knee-high and tasseling stages. Apply zinc sulfate to prevent white bud disease."
      }
    };

    const cropData = strategies[selectedCrop] || {
      strategy: "Ensure soil pH is balanced. Practice drip irrigation to prevent root rot. Rotate crops annually.",
      fertilizer: "Apply balanced NPK fertilizer based on soil nutrient composition. Boost with organic compost."
    };

    setAdvisoryResult(cropData);
  };

  // Crop Calendar Generator
  const generateCropCalendarTimeline = (crop, sowingDateStr) => {
    const sowingDate = new Date(sowingDateStr);
    
    const cropStages = {
      Tomato: [
        { name: "Sowing & Nursery Management", days: "1 - 25", icon: "🌱", desc: "Sow seeds in nursery beds. Keep soil moist but not waterlogged. Cover with net to protect from insects." },
        { name: "Transplanting", days: "25 - 30", icon: "🚜", desc: "Transplant healthy seedlings to primary fields. Apply organic compost and basal NPK fertilizer dose." },
        { name: "Vegetative Growth & Weeding", days: "30 - 60", icon: "🌿", desc: "Regular weeding and staking. Apply light nitrogen top-dressing. Prune early suckers for better yield." },
        { name: "Flowering & Fruit Set", days: "60 - 90", icon: "🌸", desc: "Ensure steady drip irrigation to avoid blossom-end rot. Spray calcium borate. Apply potash fertilizer." },
        { name: "Harvesting Period", days: "90 - 120", icon: "🍅", desc: "Harvest tomatoes when they are pinkish-red. Pack in crates and ship to mandis immediately." }
      ],
      Rice: [
        { name: "Seed Sowing in Seedbed", days: "1 - 20", icon: "🌱", desc: "Sow seeds in wet nurseries. Treat seeds with bio-fungicide to prevent blast disease." },
        { name: "Field Preparation & Transplanting", days: "20 - 30", icon: "🚜", desc: "Puddle and level the main field. Transplant 2-3 seedlings per hill at 15-20 cm spacing." },
        { name: "Active Tillering & Weeding", days: "30 - 60", icon: "🌿", desc: "Apply first split of Urea. Keep water level at 2-3 cm. Conduct manual or mechanical weeding." },
        { name: "Panicle Initiation & Flowering", days: "60 - 90", icon: "🌾", desc: "Apply final split of Urea and Potash. Maintain water level. Monitor for stem borer pests." },
        { name: "Grain Filling & Harvesting", days: "90 - 120", icon: "🌾", desc: "Drain the field 10 days before harvesting. Harvest when 80-85% grains turn golden-yellow." }
      ],
      Wheat: [
        { name: "Sowing & Seed Treatment", days: "1 - 10", icon: "🌱", desc: "Treat seeds with Trichoderma. Sow using seed drill at 4-5 cm depth with row spacing of 22 cm." },
        { name: "Crown Root Initiation (CRI) Stage", days: "20 - 25", icon: "💧", desc: "Most critical irrigation stage. Apply first irrigation. Top-dress with Urea fertilizer." },
        { name: "Tillering & Jointing", days: "30 - 60", icon: "🌿", desc: "Apply second irrigation. Control weeds using post-emergence herbicides. Apply second Urea dose." },
        { name: "Flowering & Milk Stage", days: "60 - 90", icon: "🌾", desc: "Irrigate gently to avoid lodging under heavy wind. Monitor for rust diseases on leaf blades." },
        { name: "Maturity & Harvesting", days: "95 - 120", icon: "🌾", desc: "Harvest when grains become hard and straw turns dry and golden. Safe moisture level is <12%." }
      ],
      Cotton: [
        { name: "Land Prep & Sowing", days: "1 - 15", icon: "🌱", desc: "Sow seeds in rows. Maintain spacing based on soil strength. Apply basal fertilizer." },
        { name: "Square Formation (Budding)", days: "35 - 50", icon: "🌿", desc: "First flower buds (squares) appear. Apply nitrogen top-dressing. Keep field weed-free." },
        { name: "Peak Flowering & Boll Setting", days: "50 - 90", icon: "🌸", desc: "Spraying of boron to prevent square/boll shedding. Keep soil moderately moist." },
        { name: "Boll Bursting & First Pick", days: "90 - 120", icon: "☁️", desc: "First picking of open bolls. Pick clean dry cotton in sunny weather only." }
      ],
      Maize: [
        { name: "Sowing Stage", days: "1 - 10", icon: "🌱", desc: "Sow seeds in lines at 5-6 cm depth. Maintain 60 cm line-to-line and 20 cm plant-to-plant gap." },
        { name: "Knee-High Stage", days: "25 - 35", icon: "🌿", desc: "Apply first top-dressing of Nitrogen. Conduct weeding and earthing up to support plant roots." },
        { name: "Tasseling & Silking Stage", days: "45 - 65", icon: "🌾", desc: "Extremely critical water stage. Ensure proper soil moisture. Apply second split of Nitrogen." },
        { name: "Cob Development & Maturity", days: "65 - 95", icon: "🌽", desc: "Harvest cobs for sweet corn at milk stage, or grain maize when kernel moisture drops below 20%." }
      ]
    };

    const stages = cropStages[crop] || [];
    const formattedStages = stages.map(s => {
      const range = s.days.split(' - ');
      const startDays = parseInt(range[0]);
      const endDays = parseInt(range[1]);
      
      const targetDateStart = new Date(sowingDate);
      targetDateStart.setDate(sowingDate.getDate() + startDays);
      const targetDateEnd = new Date(sowingDate);
      targetDateEnd.setDate(sowingDate.getDate() + endDays);

      return {
        ...s,
        startDate: targetDateStart.toLocaleDateString(lang === 'hi' ? 'hi-IN' : lang === 'ta' ? 'ta-IN' : 'en-US', { day: 'numeric', month: 'short' }),
        endDate: targetDateEnd.toLocaleDateString(lang === 'hi' ? 'hi-IN' : lang === 'ta' ? 'ta-IN' : 'en-US', { day: 'numeric', month: 'short' })
      };
    });

    setGeneratedCalendar({ crop, sowingDate: sowingDate.toLocaleDateString(), stages: formattedStages });
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    localStorage.setItem('farm_profile', JSON.stringify(farmProfile));
    generateCropCalendarTimeline(farmProfile.crop, farmProfile.sowingDate);
    alert(lang === 'hi' ? "खेत प्रोफ़ाइल सहेजी गई और कैलेंडर तैयार किया गया!" : lang === 'ta' ? "பண்ணை சுயவிவரம் சேமிக்கப்பட்டு காலண்டர் உருவாக்கப்பட்டது!" : "Farm profile saved and calendar generated!");
  };

  const filteredMandiPrices = mandiPrices.filter(item => {
    const query = mandiSearch.toLowerCase();
    return item.crop.toLowerCase().includes(query) ||
           item.state.toLowerCase().includes(query) ||
           item.market.toLowerCase().includes(query);
  });

  if (!user) return null;

  return (
    <div className="container" style={{ padding: '1.5rem 1.5rem 6.5rem' }}>
      
      {/* Offline/Online Status Banner */}
      {!isOnline && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.2)',
          border: '1px solid var(--danger)',
          color: '#fca5a5',
          padding: '0.75rem 1.5rem',
          borderRadius: 'var(--radius-sm)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '1.5rem',
          fontSize: '0.9rem',
          animation: 'fadeIn 0.5s ease'
        }}>
          <Wifi size={18} style={{ color: 'var(--danger)', transform: 'rotate(180deg)' }} />
          <span>{getLocText('offlineMsg')}</span>
        </div>
      )}

      {/* Header Profile Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="heading-lg" style={{ marginBottom: '0.3rem', fontSize: '2.2rem' }}>
            {t('dashboard.greeting')}{user.name}
          </h1>
          <p style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={16} style={{ color: 'var(--primary)' }} />
            {farmProfile.region ? `${farmProfile.region}` : t('dashboard.subtitle')}
            {farmProfile.crop && ` | ${getLocText('activeCrop')}: ${farmProfile.crop}`}
          </p>
        </div>
      </div>

      {/* Dashboard Navigation Controls - Desktop Tabs */}
      <div className="nav-tabs-desktop" style={{ 
        display: 'flex', 
        gap: '0.5rem', 
        borderBottom: '1px solid var(--surface-border)', 
        marginBottom: '2rem', 
        paddingBottom: '0.5rem', 
        overflowX: 'auto',
        whiteSpace: 'nowrap'
      }}>
        {[
          { id: 'scanner', label: getLocText('navScanner'), icon: <Camera size={18} /> },
          { id: 'soilAdvisor', label: getLocText('navSoil'), icon: <Sliders size={18} /> },
          { id: 'history', label: getLocText('navHistory'), icon: <Calendar size={18} /> },
          { id: 'weather', label: getLocText('navWeather'), icon: <CloudSun size={18} /> },
          { id: 'mandi', label: getLocText('navMandi'), icon: <CircleDollarSign size={18} /> },
          { id: 'chatbot', label: getLocText('navChatbot'), icon: <MessageSquare size={18} /> },
          { id: 'profile', label: getLocText('navProfile'), icon: <User size={18} /> }
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)} 
            style={{ 
              background: activeTab === tab.id ? 'rgba(16, 185, 129, 0.12)' : 'none', 
              color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-muted)', 
              fontWeight: activeTab === tab.id ? '600' : '500', 
              padding: '0.75rem 1.25rem', 
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid var(--primary)' : 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              minHeight: '44px', // Larger touch targets
              transition: 'var(--transition)'
            }}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      
      {/* 1. DISEASE SCANNER */}
      {activeTab === 'scanner' && (
        <div className="grid">
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h3 className="heading-md" style={{ alignSelf: 'flex-start', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Camera style={{ color: 'var(--primary)' }} /> {t('dashboard.scanner.title')}
            </h3>
            
            {!selectedImage && !(isCameraOpen && cameraType === 'crop') ? (
              <div style={{ width: '100%', display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                <div 
                  style={{ width: '100%', border: '2px dashed var(--surface-border)', borderRadius: 'var(--radius-md)', padding: '3.5rem 2rem', textAlign: 'center', cursor: 'pointer', transition: 'var(--transition)' }}
                  onClick={() => fileInputRef.current?.click()}
                  onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                  onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--surface-border)'}
                >
                  <div style={{ background: 'rgba(15, 23, 42, 0.5)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.2rem' }}>
                    <Upload size={28} style={{ color: 'var(--text-muted)' }} />
                  </div>
                  <h4 style={{ fontWeight: '600', marginBottom: '0.5rem', fontSize: '1.1rem' }}>{t('dashboard.scanner.uploadTitle')}</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t('dashboard.scanner.uploadDesc')}</p>
                  <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" style={{ display: 'none' }} />
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '0.5rem 0' }}>
                  <hr style={{ flex: 1, borderColor: 'var(--surface-border)', opacity: 0.5 }} />
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>OR</span>
                  <hr style={{ flex: 1, borderColor: 'var(--surface-border)', opacity: 0.5 }} />
                </div>

                <button onClick={startCropCamera} className="btn-outline" style={{ width: '100%', padding: '1rem', minHeight: '48px', fontSize: '1rem' }}>
                  <Video size={20} /> {t('dashboard.scanner.btnCamera')}
                </button>
              </div>
            ) : isCameraOpen && cameraType === 'crop' ? (
              <div style={{ width: '100%' }}>
                <div style={{ position: 'relative', width: '100%', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '1.5rem', background: '#000' }}>
                  <video ref={videoRef} autoPlay playsInline style={{ width: '100%', maxHeight: '450px', display: 'block' }}></video>
                  <button onClick={stopCamera} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(0,0,0,0.6)', color: 'white', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>
                    <X size={20} />
                  </button>
                </div>
                <button onClick={captureImage} className="btn-primary" style={{ width: '100%', minHeight: '48px', fontSize: '1rem' }}>
                  <Camera size={20} /> {t('dashboard.scanner.btnCapture')}
                </button>
                <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
              </div>
            ) : (
              <div style={{ width: '100%' }}>
                <div style={{ position: 'relative', width: '100%', paddingTop: '75%', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '1.5rem', border: '1px solid var(--surface-border)' }}>
                  <img src={selectedImage} alt="Crop Leaf Scan" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                
                {!scanResult && (
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => setSelectedImage(null)} className="btn-outline" style={{ flex: 1, minHeight: '48px' }}>
                      <RefreshCw size={18} /> {t('dashboard.scanner.btnRetake')}
                    </button>
                    <button onClick={handleScan} className="btn-primary" style={{ flex: 2, minHeight: '48px' }} disabled={isScanning}>
                      {isScanning ? (
                        <>
                          <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} /> {t('dashboard.scanner.btnAnalyzing')}
                        </>
                      ) : (
                        <>
                          <Camera size={18} /> {t('dashboard.scanner.btnAnalyze')}
                        </>
                      )}
                    </button>
                  </div>
                )}

                {scanResult && (
                  <button onClick={() => { setSelectedImage(null); setScanResult(null); setScanSaved(false); }} className="btn-outline" style={{ width: '100%', minHeight: '48px' }}>
                    <RefreshCw size={18} /> Scan Another Crop
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Results Area */}
          <div className="glass-card">
            <h3 className="heading-md" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp style={{ color: 'var(--primary)' }} /> {t('dashboard.results.title')}
            </h3>
            
            {!scanResult ? (
              <div style={{ height: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                <Camera size={52} style={{ opacity: 0.15, marginBottom: '1.2rem' }} />
                <p style={{ textAlign: 'center', maxWidth: '80%' }}>{t('dashboard.results.placeholder')}</p>
              </div>
            ) : (
              <div className="animate-fade-in">
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem', 
                  marginBottom: '1.5rem', 
                  padding: '1.2rem', 
                  background: 'rgba(239, 68, 68, 0.1)', 
                  borderRadius: 'var(--radius-md)', 
                  border: '1px solid rgba(239, 68, 68, 0.2)' 
                }}>
                  <AlertTriangle size={28} style={{ color: 'var(--danger)', flexShrink: 0 }} />
                  <div>
                    <h4 style={{ color: 'var(--danger)', fontWeight: '600', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t('dashboard.results.detected')}</h4>
                    <p style={{ fontSize: '1.3rem', fontWeight: '800', margin: '0.2rem 0 0' }}>{scanResult.disease}</p>
                  </div>
                  <div style={{ marginLeft: 'auto', background: 'var(--danger)', color: 'white', padding: '0.4rem 0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', fontWeight: 'bold' }}>
                    {scanResult.confidence}% {t('dashboard.results.match')}
                  </div>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <h4 style={{ fontWeight: '600', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
                    <CheckCircle size={20} style={{ color: 'var(--primary)' }} />
                    {t('dashboard.results.treatmentTitle')}
                  </h4>
                  <p style={{ color: 'var(--text-main)', background: 'rgba(15, 23, 42, 0.5)', padding: '1.2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-border)', lineHeight: '1.7' }}>
                    {scanResult.treatment}
                  </p>
                </div>

                <button 
                  onClick={handleSaveScan} 
                  className="btn-primary" 
                  style={{ width: '100%', minHeight: '48px', fontSize: '1rem' }} 
                  disabled={scanSaved}
                >
                  <Save size={18} /> {scanSaved ? "Saved Successfully!" : t('dashboard.results.btnSave')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. SOIL ADVISOR */}
      {activeTab === 'soilAdvisor' && (
        <div className="grid">
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h3 className="heading-md" style={{ alignSelf: 'flex-start', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sliders style={{ color: 'var(--primary)' }} /> {t('dashboard.soil.title')}
            </h3>
            
            {!selectedSoilImage && !(isCameraOpen && cameraType === 'soil') ? (
              <div style={{ width: '100%', display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                <div 
                  style={{ width: '100%', border: '2px dashed var(--surface-border)', borderRadius: 'var(--radius-md)', padding: '3.5rem 2rem', textAlign: 'center', cursor: 'pointer', transition: 'var(--transition)' }}
                  onClick={() => soilFileInputRef.current?.click()}
                  onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                  onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--surface-border)'}
                >
                  <div style={{ background: 'rgba(15, 23, 42, 0.5)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.2rem' }}>
                    <Upload size={28} style={{ color: 'var(--text-muted)' }} />
                  </div>
                  <h4 style={{ fontWeight: '600', marginBottom: '0.5rem', fontSize: '1.1rem' }}>{getLocText('profileSetupDesc').split(' ')[0]} {t('dashboard.soil.uploadTitle')}</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t('dashboard.scanner.uploadDesc')}</p>
                  <input type="file" ref={soilFileInputRef} onChange={handleSoilUpload} accept="image/*" style={{ display: 'none' }} />
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '0.5rem 0' }}>
                  <hr style={{ flex: 1, borderColor: 'var(--surface-border)', opacity: 0.5 }} />
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>OR</span>
                  <hr style={{ flex: 1, borderColor: 'var(--surface-border)', opacity: 0.5 }} />
                </div>

                <button onClick={startSoilCamera} className="btn-outline" style={{ width: '100%', padding: '1rem', minHeight: '48px' }}>
                  <Video size={20} /> {t('dashboard.scanner.btnCamera')}
                </button>
              </div>
            ) : isCameraOpen && cameraType === 'soil' ? (
              <div style={{ width: '100%' }}>
                <div style={{ position: 'relative', width: '100%', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '1.5rem', background: '#000' }}>
                  <video ref={videoRef} autoPlay playsInline style={{ width: '100%', maxHeight: '450px', display: 'block' }}></video>
                  <button onClick={stopCamera} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(0,0,0,0.6)', color: 'white', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>
                    <X size={20} />
                  </button>
                </div>
                <button onClick={captureImage} className="btn-primary" style={{ width: '100%', minHeight: '48px' }}>
                  <Camera size={20} /> {t('dashboard.scanner.btnCapture')}
                </button>
                <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
              </div>
            ) : (
              <div style={{ width: '100%' }}>
                <div style={{ position: 'relative', width: '100%', paddingTop: '75%', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '1.5rem', border: '1px solid var(--surface-border)' }}>
                  <img src={selectedSoilImage} alt="Soil Sample" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                
                {!soilResult && (
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => { setSelectedSoilImage(null); setSoilResult(null); }} className="btn-outline" style={{ flex: 1, minHeight: '48px' }}>
                      <RefreshCw size={18} /> {t('dashboard.scanner.btnRetake')}
                    </button>
                    <button onClick={handleSoilScan} className="btn-primary" style={{ flex: 2, minHeight: '48px' }} disabled={isSoilScanning}>
                      {isSoilScanning ? (
                        <>
                          <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} /> {t('dashboard.soil.btnAnalyzing')}
                        </>
                      ) : (
                        t('dashboard.soil.btnAnalyze')
                      )}
                    </button>
                  </div>
                )}

                {soilResult && (
                  <div className="animate-fade-in" style={{ width: '100%' }}>
                    <div style={{ padding: '1.2rem', background: 'rgba(16, 185, 129, 0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.2)', marginBottom: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.4rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>{t('dashboard.soil.soilType')}:</span>
                        <span style={{ fontWeight: '800', color: 'var(--primary)' }}>
                          {soilResult.type}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.4rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>{t('dashboard.soil.phLevel')}:</span>
                        <span style={{ fontWeight: '800' }}>{soilResult.ph} (Slightly Acidic)</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', marginTop: '0.6rem' }}>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t('dashboard.soil.cropsLabel')}:</span>
                        <span style={{ fontWeight: '600', marginTop: '0.2rem', color: 'var(--text-main)' }}>{soilResult.crops}</span>
                      </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1.2rem', borderBottom: '1px solid var(--surface-border)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Sliders size={18} style={{ color: 'var(--primary)' }} />
                        {t('dashboard.soil.nutrientsTitle')}
                      </h4>
                      
                      {/* Nitrogen Bar */}
                      <div style={{ marginBottom: '1.25rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.85rem' }}>
                          <span>Nitrogen (N)</span>
                          <span style={{ fontWeight: '600', color: '#34d399' }}>{soilResult.nutrients.nitrogen}% (Optimum)</span>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-full)', height: '10px', overflow: 'hidden' }}>
                          <div style={{ background: 'linear-gradient(90deg, #10b981 0%, #34d399 100%)', width: animateCharts ? `${soilResult.nutrients.nitrogen}%` : '0%', height: '100%', borderRadius: 'var(--radius-full)', transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>
                        </div>
                      </div>

                      {/* Phosphorus Bar */}
                      <div style={{ marginBottom: '1.25rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.85rem' }}>
                          <span>Phosphorus (P)</span>
                          <span style={{ fontWeight: '600', color: '#60a5fa' }}>{soilResult.nutrients.phosphorus}% (Medium)</span>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-full)', height: '10px', overflow: 'hidden' }}>
                          <div style={{ background: 'linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)', width: animateCharts ? `${soilResult.nutrients.phosphorus}%` : '0%', height: '100%', borderRadius: 'var(--radius-full)', transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>
                        </div>
                      </div>

                      {/* Potassium Bar */}
                      <div style={{ marginBottom: '1.25rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.85rem' }}>
                          <span>Potassium (K)</span>
                          <span style={{ fontWeight: '600', color: '#fbbf24' }}>{soilResult.nutrients.potassium}% (Optimum)</span>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-full)', height: '10px', overflow: 'hidden' }}>
                          <div style={{ background: 'linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)', width: animateCharts ? `${soilResult.nutrients.potassium}%` : '0%', height: '100%', borderRadius: 'var(--radius-full)', transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>
                        </div>
                      </div>

                      {/* Organic Carbon Bar */}
                      <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.85rem' }}>
                          <span>Organic Carbon</span>
                          <span style={{ fontWeight: '600', color: '#c084fc' }}>{soilResult.nutrients.carbon}% (High)</span>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-full)', height: '10px', overflow: 'hidden' }}>
                          <div style={{ background: 'linear-gradient(90deg, #a855f7 0%, #c084fc 100%)', width: animateCharts ? `${soilResult.nutrients.carbon}%` : '0%', height: '100%', borderRadius: 'var(--radius-full)', transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>
                        </div>
                      </div>
                    </div>

                    <button onClick={() => { setSelectedSoilImage(null); setSoilResult(null); }} className="btn-outline" style={{ width: '100%', minHeight: '44px' }}>
                      <RefreshCw size={16} /> Scan Another Soil Sample
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Advisory & Yield Planner */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <h3 className="heading-md" style={{ marginBottom: '1.5rem' }}>Crop Advisory & Yield Planner</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.5rem' }}>
              <div>
                <label className="input-label">{t('dashboard.soil.selectCrop')}</label>
                <select 
                  className="input-field" 
                  value={selectedCrop} 
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  style={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid var(--surface-border)', width: '100%', color: 'var(--text-main)', padding: '0.85rem', borderRadius: 'var(--radius-sm)' }}
                >
                  <option value="">-- Choose Crop --</option>
                  <option value="Tomato">Tomato (टमाटर)</option>
                  <option value="Rice">Rice (धान)</option>
                  <option value="Wheat">Wheat (गेहूं)</option>
                  <option value="Cotton">Cotton (कपास)</option>
                  <option value="Maize">Maize (मक्का)</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="input-label">{t('dashboard.soil.selectSeason')}</label>
                  <select 
                    className="input-field" 
                    value={selectedSeason} 
                    onChange={(e) => setSelectedSeason(e.target.value)}
                    style={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid var(--surface-border)', width: '100%', color: 'var(--text-main)', padding: '0.85rem', borderRadius: 'var(--radius-sm)' }}
                  >
                    <option value="">-- Season --</option>
                    <option value="Kharif">Kharif (Monsoon)</option>
                    <option value="Rabi">Rabi (Winter)</option>
                    <option value="Zaid">Zaid (Summer)</option>
                  </select>
                </div>
                
                <div>
                  <label className="input-label">Water Level</label>
                  <select 
                    className="input-field" 
                    value={selectedWater} 
                    onChange={(e) => setSelectedWater(e.target.value)}
                    style={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid var(--surface-border)', width: '100%', color: 'var(--text-main)', padding: '0.85rem', borderRadius: 'var(--radius-sm)' }}
                  >
                    <option value="">-- Water --</option>
                    <option value="High">Irrigated (High)</option>
                    <option value="Medium">Sprinklers/Drip (Medium)</option>
                    <option value="Low">Low / Rainfed</option>
                  </select>
                </div>
              </div>

              <button onClick={generateYieldStrategy} className="btn-primary" style={{ width: '100%', minHeight: '48px', fontSize: '1.05rem' }}>
                {t('dashboard.soil.btnGenerate')}
              </button>
            </div>

            {advisoryResult && cropQuality && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', borderTop: '1px solid var(--surface-border)', paddingTop: '1.5rem' }}>
                <div>
                  <h4 style={{ fontWeight: '700', color: 'var(--primary)', marginBottom: '0.5rem', fontSize: '1.05rem' }}>{t('dashboard.soil.strategyTitle')}</h4>
                  <p style={{ color: 'var(--text-main)', background: 'rgba(15, 23, 42, 0.4)', padding: '1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.95rem', border: '1px solid var(--surface-border)' }}>
                    {advisoryResult.strategy}
                  </p>
                </div>

                <div>
                  <h4 style={{ fontWeight: '700', color: 'var(--secondary)', marginBottom: '0.5rem', fontSize: '1.05rem' }}>{t('dashboard.soil.fertilizerTitle')}</h4>
                  <p style={{ color: 'var(--text-main)', background: 'rgba(15, 23, 42, 0.4)', padding: '1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.95rem', border: '1px solid var(--surface-border)' }}>
                    {advisoryResult.fertilizer}
                  </p>
                </div>

                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1.2rem', borderBottom: '1px solid var(--surface-border)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <TrendingUp size={18} style={{ color: 'var(--primary)' }} />
                    {t('dashboard.soil.qualityTitle')}
                  </h4>
                  
                  <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--surface-border)', borderRadius: 'var(--radius-md)', minWidth: '100px', flex: '1 1 auto' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{getLocText('gradeBadge')}</span>
                      <div style={{ width: '58px', height: '58px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 'bold', color: '#fff', boxShadow: 'var(--shadow-glow)' }}>
                        {cropQuality.grade}
                      </div>
                    </div>

                    <div style={{ flex: '2 1 200px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.2rem' }}>
                          <span>Health Index</span>
                          <span style={{ fontWeight: '600' }}>{cropQuality.health}%</span>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-full)', height: '8px', overflow: 'hidden' }}>
                          <div style={{ background: '#10b981', width: `${cropQuality.health}%`, height: '100%', borderRadius: 'var(--radius-full)' }}></div>
                        </div>
                      </div>

                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.2rem' }}>
                          <span>Moisture Content</span>
                          <span style={{ fontWeight: '600' }}>{cropQuality.moisture}%</span>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-full)', height: '8px', overflow: 'hidden' }}>
                          <div style={{ background: '#3b82f6', width: `${cropQuality.moisture}%`, height: '100%', borderRadius: 'var(--radius-full)' }}></div>
                        </div>
                      </div>

                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.2rem' }}>
                          <span>Disease Resistance</span>
                          <span style={{ fontWeight: '600' }}>{cropQuality.diseaseRes}%</span>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-full)', height: '8px', overflow: 'hidden' }}>
                          <div style={{ background: '#f59e0b', width: `${cropQuality.diseaseRes}%`, height: '100%', borderRadius: 'var(--radius-full)' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. SCAN RECORDS HISTORY */}
      {activeTab === 'history' && (
        <div className="glass-card animate-fade-in" style={{ minHeight: '400px' }}>
          <h3 className="heading-md" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar style={{ color: 'var(--primary)' }} /> {getLocText('historyTitle')}
          </h3>
          
          {historyLoading ? (
            <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Loader size={36} style={{ animation: 'spin 1s linear infinite', color: 'var(--primary)' }} />
            </div>
          ) : historyList.length === 0 ? (
            <div style={{ height: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              <Calendar size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
              <p style={{ textAlign: 'center', maxWidth: '80%' }}>{getLocText('historyEmpty')}</p>
            </div>
          ) : (
            <div className="history-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {historyList.map((scan, i) => (
                <div 
                  key={i} 
                  className="glass" 
                  style={{ 
                    borderRadius: 'var(--radius-md)', 
                    overflow: 'hidden', 
                    border: '1px solid var(--surface-border)',
                    boxShadow: 'var(--shadow-lg)',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <div style={{ position: 'relative', width: '100%', height: '180px' }}>
                    {scan.image ? (
                      <img src={scan.image} alt={scan.disease} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Camera size={36} style={{ opacity: 0.1 }} />
                      </div>
                    )}
                    <span style={{ 
                      position: 'absolute', 
                      bottom: '0.75rem', 
                      right: '0.75rem', 
                      background: scan.disease.toLowerCase().includes('healthy') ? 'var(--success)' : 'var(--danger)', 
                      color: 'white', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '4px', 
                      fontSize: '0.75rem', 
                      fontWeight: 'bold' 
                    }}>
                      {scan.confidence}% Match
                    </span>
                  </div>

                  <div style={{ padding: '1.25rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      {new Date(scan.timestamp).toLocaleDateString(lang === 'hi' ? 'hi-IN' : lang === 'ta' ? 'ta-IN' : 'en-US', { dateStyle: 'medium' })}
                    </span>
                    <h4 style={{ fontSize: '1.15rem', fontWeight: 'bold', margin: '0.4rem 0 0.75rem' }}>
                      {scan.disease}
                    </h4>
                    <p style={{ 
                      fontSize: '0.85rem', 
                      color: 'var(--text-muted)', 
                      background: 'rgba(0,0,0,0.2)', 
                      padding: '0.75rem', 
                      borderRadius: 'var(--radius-sm)',
                      flexGrow: 1,
                      lineHeight: '1.5'
                    }}>
                      {scan.treatment.substring(0, 140)}{scan.treatment.length > 140 ? '...' : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. WEATHER ADVISORY */}
      {activeTab === 'weather' && (
        <div className="glass-card animate-fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--surface-border)', paddingBottom: '0.75rem' }}>
            <h3 className="heading-md" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CloudSun style={{ color: 'var(--primary)' }} /> {getLocText('weatherTitle')}
            </h3>
            <button onClick={fetchUserLocationAndWeather} className="btn-outline" style={{ padding: '0.4rem 0.8rem', minHeight: '36px', fontSize: '0.85rem' }}>
              <RefreshCw size={14} /> Sync Weather
            </button>
          </div>

          {weatherLoading ? (
            <div style={{ height: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Loader size={36} style={{ animation: 'spin 1s linear infinite', color: 'var(--primary)', marginBottom: '0.5rem' }} />
              <p style={{ color: 'var(--text-muted)' }}>{getLocText('locating')}</p>
            </div>
          ) : weatherError ? (
            <div style={{ height: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)' }}>
              <AlertTriangle size={36} style={{ marginBottom: '0.5rem' }} />
              <p>{weatherError}</p>
            </div>
          ) : weatherData ? (
            <div className="weather-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Weather Stats Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem' }}>
                <div className="glass" style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-border)', textAlign: 'center' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>{getLocText('tempLabel')}</p>
                  <h3 style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0.5rem 0', color: 'var(--text-main)' }}>{weatherData.temp}°C</h3>
                  <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '500' }}>{weatherData.forecast}</span>
                </div>

                <div className="glass" style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-border)', textAlign: 'center' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>{getLocText('humidityLabel')}</p>
                  <h3 style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0.5rem 0', color: '#60a5fa' }}>{weatherData.humidity}%</h3>
                  <span style={{ fontSize: '0.85rem', opacity: 0.6 }}>Atmospheric water</span>
                </div>

                <div className="glass" style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-border)', textAlign: 'center' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>{getLocText('uvLabel')}</p>
                  <h3 style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0.5rem 0', color: '#f59e0b' }}>{weatherData.uvIndex}</h3>
                  <span style={{ fontSize: '0.85rem', color: weatherData.uvIndex > 7 ? 'var(--danger)' : 'var(--success)' }}>
                    {weatherData.uvIndex > 7 ? 'Very High' : 'Moderate'}
                  </span>
                </div>

                <div className="glass" style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-border)', textAlign: 'center' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>{getLocText('rainLabel')}</p>
                  <h3 style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0.5rem 0', color: '#c084fc' }}>{weatherData.rainChance}%</h3>
                  <span style={{ fontSize: '0.85rem', opacity: 0.6 }}>Precipitation</span>
                </div>
              </div>

              {/* Weather Smart Advisory Banner */}
              <div style={{ 
                padding: '1.5rem', 
                background: 'rgba(59, 130, 246, 0.08)', 
                border: '1px solid rgba(59, 130, 246, 0.2)', 
                borderRadius: 'var(--radius-md)',
                marginTop: '0.5rem'
              }}>
                <h4 style={{ color: 'var(--secondary)', fontWeight: '700', fontSize: '1.1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CloudSun size={20} /> Smart Farming Advisory
                </h4>
                <p style={{ color: 'var(--text-main)', fontSize: '1rem', lineHeight: '1.6', margin: 0 }}>
                  {weatherData.advisory}
                </p>
                <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right' }}>
                  Data source: {weatherData.source}
                </div>
              </div>

            </div>
          ) : null}
        </div>
      )}

      {/* 5. MANDI PRICES */}
      {activeTab === 'mandi' && (
        <div className="glass-card animate-fade-in">
          <h3 className="heading-md" style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CircleDollarSign style={{ color: 'var(--primary)' }} /> {getLocText('mandiTitle')}
          </h3>

          <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
            <input 
              type="text" 
              className="input-field" 
              placeholder={getLocText('mandiSearchPlaceholder')}
              value={mandiSearch}
              onChange={(e) => setMandiSearch(e.target.value)}
              style={{ paddingLeft: '1rem', minHeight: '44px' }}
            />
          </div>

          {mandiLoading ? (
            <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Loader size={36} style={{ animation: 'spin 1s linear infinite', color: 'var(--primary)' }} />
            </div>
          ) : (
            <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-border)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--surface-border)' }}>
                    <th style={{ padding: '1rem' }}>{getLocText('mandiCrop')}</th>
                    <th style={{ padding: '1rem' }}>{getLocText('mandiState')}</th>
                    <th style={{ padding: '1rem' }}>{getLocText('mandiMarket')}</th>
                    <th style={{ padding: '1rem' }}>{getLocText('mandiPrice')}</th>
                    <th style={{ padding: '1rem' }}>{getLocText('mandiTrend')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMandiPrices.map((item, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'var(--transition)' }}>
                      <td style={{ padding: '1rem', fontWeight: '600' }}>{item.crop}</td>
                      <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{item.state}</td>
                      <td style={{ padding: '1rem' }}>{item.market}</td>
                      <td style={{ padding: '1rem', fontWeight: 'bold' }}>{item.priceRange}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          gap: '0.25rem', 
                          fontSize: '0.8rem', 
                          fontWeight: 'bold',
                          padding: '0.2rem 0.5rem', 
                          borderRadius: '4px',
                          background: item.trend === 'up' ? 'rgba(34, 197, 94, 0.15)' : item.trend === 'down' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                          color: item.trend === 'up' ? 'var(--success)' : item.trend === 'down' ? 'var(--danger)' : 'var(--warning)'
                        }}>
                          {item.trend === 'up' ? '▲ Up' : item.trend === 'down' ? '▼ Down' : '● Stable'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredMandiPrices.length === 0 && (
                    <tr>
                      <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No matching crops found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 6. EXPERT CHATBOT */}
      {activeTab === 'chatbot' && (
        <div className="glass-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '520px', padding: '1rem' }}>
          <h3 className="heading-md" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--surface-border)', paddingBottom: '0.75rem' }}>
            <MessageSquare style={{ color: 'var(--primary)' }} /> {getLocText('chatbotTitle')}
          </h3>

          {/* Messages Window */}
          <div style={{ 
            flexGrow: 1, 
            overflowY: 'auto', 
            marginBottom: '1rem', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1rem', 
            paddingRight: '0.5rem' 
          }}>
            {messages.map((m, i) => (
              <div 
                key={i} 
                style={{ 
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                  background: m.role === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.06)',
                  color: '#fff',
                  padding: '0.85rem 1.1rem',
                  borderRadius: m.role === 'user' ? '18px 18px 0px 18px' : '18px 18px 18px 0px',
                  border: m.role === 'user' ? 'none' : '1px solid var(--surface-border)',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap',
                  fontSize: '0.95rem'
                }}
              >
                {m.text}
              </div>
            ))}
            {chatLoading && (
              <div style={{ 
                alignSelf: 'flex-start',
                background: 'rgba(255,255,255,0.03)',
                padding: '0.75rem 1rem',
                borderRadius: '18px 18px 18px 0px',
                border: '1px solid var(--surface-border)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>AgriNova is writing...</span>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Form input */}
          <form onSubmit={handleSendChatMessage} style={{ display: 'flex', gap: '0.75rem' }}>
            <input 
              type="text" 
              className="input-field" 
              placeholder={getLocText('chatbotPlaceholder')}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              disabled={chatLoading}
              style={{ minHeight: '44px', flexGrow: 1 }}
            />
            <button 
              type="submit" 
              className="btn-primary" 
              style={{ padding: '0 1.25rem', height: '44px', width: '56px', borderRadius: 'var(--radius-sm)' }}
              disabled={chatLoading}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      {/* 7. FARM PROFILE & CROP CALENDAR */}
      {activeTab === 'profile' && (
        <div className="grid">
          {/* Profile form */}
          <div className="glass-card">
            <h3 className="heading-md" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User style={{ color: 'var(--primary)' }} /> {getLocText('profileTitle')}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              {getLocText('profileSetupDesc')}
            </p>

            <form onSubmit={handleProfileSave}>
              <div className="input-group">
                <label className="input-label">{getLocText('profileAcre')}</label>
                <input 
                  type="number" 
                  className="input-field"
                  placeholder="e.g. 5"
                  value={farmProfile.area}
                  onChange={(e) => setFarmProfile({...farmProfile, area: e.target.value})}
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label">{getLocText('profileState')}</label>
                <input 
                  type="text" 
                  className="input-field"
                  placeholder="e.g. Karnataka / Punjab"
                  value={farmProfile.region}
                  onChange={(e) => setFarmProfile({...farmProfile, region: e.target.value})}
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label">{getLocText('profileCrop')}</label>
                <select 
                  className="input-field"
                  value={farmProfile.crop}
                  onChange={(e) => setFarmProfile({...farmProfile, crop: e.target.value})}
                  required
                  style={{ background: 'rgba(15, 23, 42, 0.9)' }}
                >
                  <option value="">-- Select Crop --</option>
                  <option value="Tomato">Tomato (टमाटर)</option>
                  <option value="Rice">Rice (धान)</option>
                  <option value="Wheat">Wheat (गेहूं)</option>
                  <option value="Cotton">Cotton (कपास)</option>
                  <option value="Maize">Maize (मक्का)</option>
                </select>
              </div>

              <div className="input-group" style={{ marginBottom: '2rem' }}>
                <label className="input-label">{getLocText('profileSowingDate')}</label>
                <input 
                  type="date" 
                  className="input-field"
                  value={farmProfile.sowingDate}
                  onChange={(e) => setFarmProfile({...farmProfile, sowingDate: e.target.value})}
                  required
                />
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', minHeight: '48px', fontSize: '1.05rem' }}>
                <Save size={18} /> {getLocText('profileBtnSave')}
              </button>
            </form>
          </div>

          {/* Calendar Display */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <h3 className="heading-md" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar style={{ color: 'var(--primary)' }} /> {getLocText('calendarTitle')}
            </h3>

            {!generatedCalendar ? (
              <div style={{ height: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                <Calendar size={52} style={{ opacity: 0.15, marginBottom: '1rem' }} />
                <p style={{ textAlign: 'center', maxWidth: '80%' }}>Setup your farm profile and sowing date to generate your personalized crop calendar timeline.</p>
              </div>
            ) : (
              <div className="calendar-timeline animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', paddingLeft: '1rem' }}>
                <div style={{ position: 'absolute', top: '10px', bottom: '10px', left: '1.75rem', width: '2px', background: 'var(--surface-border)' }}></div>
                
                {generatedCalendar.stages.map((stage, i) => (
                  <div key={i} style={{ display: 'flex', gap: '1.25rem', position: 'relative', zIndex: 5 }}>
                    <div style={{ 
                      width: '32px', 
                      height: '32px', 
                      borderRadius: '50%', 
                      background: 'var(--bg-color)', 
                      border: '2px solid var(--primary)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontSize: '1rem',
                      flexShrink: 0
                    }}>
                      {stage.icon}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span>{stage.name}</span>
                        <span style={{ fontSize: '0.75rem', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--primary)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                          {stage.startDate} - {stage.endDate} ({stage.days} {getLocText('daysUnit')})
                        </span>
                      </h4>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem', lineHeight: '1.5' }}>
                        {stage.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 8. MOBILE BOTTOM NAVIGATION BAR */}
      <div className="nav-tabs-mobile glass" style={{ 
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '68px',
        borderTop: '1px solid var(--surface-border)',
        zIndex: 100,
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '0.25rem 0.5rem',
        boxShadow: '0 -4px 12px rgba(0,0,0,0.5)'
      }}>
        {[
          { id: 'scanner', label: getLocText('navScanner').split(' ')[0], icon: <Camera size={20} /> },
          { id: 'soilAdvisor', label: getLocText('navSoil').split(' ')[0], icon: <Sliders size={20} /> },
          { id: 'weather', label: getLocText('navWeather').split(' ')[0], icon: <CloudSun size={20} /> },
          { id: 'chatbot', label: getLocText('navChatbot').split(' ')[1] || getLocText('navChatbot'), icon: <MessageSquare size={20} /> },
          { id: 'profile', label: "Farm", icon: <User size={20} /> }
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: 'none',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.25rem',
              color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-muted)',
              fontSize: '0.7rem',
              fontWeight: activeTab === tab.id ? '700' : '500',
              padding: '0.4rem 0.25rem',
              cursor: 'pointer',
              flexGrow: 1,
              minHeight: '48px', // High mobile tap target
              transition: 'var(--transition)'
            }}
          >
            <div style={{ transform: activeTab === tab.id ? 'scale(1.1)' : 'scale(1)', transition: 'var(--transition)' }}>
              {tab.icon}
            </div>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

    </div>
  );
};

export default Dashboard;
