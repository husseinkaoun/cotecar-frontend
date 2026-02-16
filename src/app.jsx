// ✅ FILE: src/App.jsx
// CôteCar — Enhanced Modern UI: Sleek tabs with animations, smooth scrolling, logo refresh/reset, tidy layouts, improved responsiveness
import { useEffect, useMemo, useRef, useState } from "react";
import { login, logout } from "./auth";
import { apiFetch, adminListVerifications, adminReviewVerification } from "./api";
import "./App.css";
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
/* ─────────────────────────────────────────
   STATIC PAGES
───────────────────────────────────────── */
function PrivacyPolicyPage() {
  return (
    <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1>Privacy Policy</h1>
      <p>
        <b>Last updated:</b> {new Date().toISOString().slice(0, 10)}
      </p>
      <p>
        CôteCar (“we”, “our”, “us”) is a vehicle marketplace. This Privacy Policy explains what
        information we collect and how we use it.
      </p>
      <h2>Information we collect</h2>
      <ul>
        <li>
          <b>Account info:</b> email, name, phone (if you provide it).
        </li>
        <li>
          <b>Listings:</b> car details, description, photos, location you enter.
        </li>
        <li>
          <b>Verification (optional):</b> ID photo + selfie if you submit verification.
        </li>
        <li>
          <b>Usage/technical:</b> basic logs for security and troubleshooting.
        </li>
      </ul>
      <h2>How we use your information</h2>
      <ul>
        <li>To create accounts and let you sign in.</li>
        <li>To publish and manage vehicle listings.</li>
        <li>To prevent fraud and improve platform safety.</li>
        <li>To respond to support requests.</li>
      </ul>
      <h2>Google Sign-In</h2>
      <p>
        If you use Google Sign-In, we receive basic profile information (like your Google email)
        to create/login to your account.
      </p>
      <h2>Sharing</h2>
      <p>
        We do not sell your personal information. We may share data only when required to operate
        the service (hosting providers) or when required by law.
      </p>
      <h2>Contact</h2>
      <p>
        Email: <b>husseinkaoun@icloud.com</b>
      </p>
      <p style={{ marginTop: 20 }}>
        <a href="/">Back to app</a>
      </p>
    </div>
  );
}
function TermsOfServicePage() {
  return (
    <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1>Terms of Service</h1>
      <p>
        <b>Last updated:</b> {new Date().toISOString().slice(0, 10)}
      </p>
      <p>By using CôteCar, you agree to these Terms.</p>
      <h2>Use of the service</h2>
      <ul>
        <li>You are responsible for the accuracy of your listings.</li>
        <li>No illegal, harmful, or misleading content.</li>
        <li>We may remove listings that violate these terms.</li>
      </ul>
      <h2>Accounts</h2>
      <p>You are responsible for keeping your account secure and for activity under your account.</p>
      <h2>Verification</h2>
      <p>Verification is optional. If you submit documents, you confirm they are your own and valid.</p>
      <h2>Disclaimer</h2>
      <p>Listings are provided by sellers. CôteCar is not responsible for transactions between users.</p>
      <h2>Contact</h2>
      <p>
        Email: <b>husseinkaoun@icloud.com</b>
      </p>
      <p style={{ marginTop: 20 }}>
        <a href="/">Back to app</a>
      </p>
    </div>
  );
}
/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
function formatCFA(value) {
  const n = Number(value || 0);
  try {
    return new Intl.NumberFormat("fr-FR").format(n) + " CFA";
  } catch {
    return `${n} CFA`;
  }
}
function formatSoldDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "";
  try {
    return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(d);
  } catch {
    return d.toISOString().slice(0, 10);
  }
}
function mapEmbedUrl(lat, lng) {
  if (lat == null || lng == null) return "";
  if (Number.isNaN(Number(lat)) || Number.isNaN(Number(lng))) return "";
  return `https://www.google.com/maps?q=${Number(lat)},${Number(lng)}&z=15&output=embed`;
}
function isMobileDevice() {
  return /android|iphone|ipad|ipod/i.test(navigator.userAgent);
}
function cleanPhone(raw) {
  let p = String(raw || "").trim().replace(/[^\d+]/g, "");
  if (p.startsWith("00")) p = "+" + p.slice(2);
  return p;
}
const COUNTRY_CODES = [
  {"code": "+1", "countries": "United States, Canada"},
  {"code": "+20", "countries": "Egypt"},
  {"code": "+211", "countries": "South Sudan"},
  {"code": "+212", "countries": "Morocco, Western Sahara"},
  {"code": "+213", "countries": "Algeria"},
  {"code": "+216", "countries": "Tunisia"},
  {"code": "+218", "countries": "Libya"},
  {"code": "+220", "countries": "The Gambia"},
  {"code": "+221", "countries": "Senegal"},
  {"code": "+222", "countries": "Mauritania"},
  {"code": "+223", "countries": "Mali"},
  {"code": "+224", "countries": "Guinea"},
  {"code": "+225", "countries": "Ivory Coast"},
  {"code": "+226", "countries": "Burkina Faso"},
  {"code": "+227", "countries": "Niger"},
  {"code": "+228", "countries": "Togo"},
  {"code": "+229", "countries": "Benin"},
  {"code": "+230", "countries": "Mauritius"},
  {"code": "+231", "countries": "Liberia"},
  {"code": "+232", "countries": "Sierra Leone"},
  {"code": "+233", "countries": "Ghana"},
  {"code": "+234", "countries": "Nigeria"},
  {"code": "+235", "countries": "Chad"},
  {"code": "+236", "countries": "Central African Republic"},
  {"code": "+237", "countries": "Cameroon"},
  {"code": "+238", "countries": "Cape Verde"},
  {"code": "+239", "countries": "São Tomé and Príncipe"},
  {"code": "+240", "countries": "Equatorial Guinea"},
  {"code": "+241", "countries": "Gabon"},
  {"code": "+242", "countries": "Republic of the Congo"},
  {"code": "+243", "countries": "Democratic Republic of the Congo"},
  {"code": "+244", "countries": "Angola"},
  {"code": "+245", "countries": "Guinea-Bissau"},
  {"code": "+246", "countries": "British Indian Ocean Territory"},
  {"code": "+247", "countries": "Ascension Island"},
  {"code": "+248", "countries": "Seychelles"},
  {"code": "+249", "countries": "Sudan"},
  {"code": "+250", "countries": "Rwanda"},
  {"code": "+251", "countries": "Ethiopia"},
  {"code": "+252", "countries": "Somalia"},
  {"code": "+253", "countries": "Djibouti"},
  {"code": "+254", "countries": "Kenya"},
  {"code": "+255", "countries": "Tanzania"},
  {"code": "+256", "countries": "Uganda"},
  {"code": "+257", "countries": "Burundi"},
  {"code": "+258", "countries": "Mozambique"},
  {"code": "+260", "countries": "Zambia"},
  {"code": "+261", "countries": "Madagascar"},
  {"code": "+262", "countries": "Réunion, Mayotte, French Southern and Antarctic Lands"},
  {"code": "+263", "countries": "Zimbabwe"},
  {"code": "+264", "countries": "Namibia"},
  {"code": "+265", "countries": "Malawi"},
  {"code": "+266", "countries": "Lesotho"},
  {"code": "+267", "countries": "Botswana"},
  {"code": "+268", "countries": "Eswatini"},
  {"code": "+269", "countries": "Comoros"},
  {"code": "+27", "countries": "South Africa"},
  {"code": "+290", "countries": "Saint Helena, Tristan da Cunha"},
  {"code": "+291", "countries": "Eritrea"},
  {"code": "+297", "countries": "Aruba"},
  {"code": "+298", "countries": "Faroe Islands"},
  {"code": "+299", "countries": "Greenland"},
  {"code": "+30", "countries": "Greece"},
  {"code": "+31", "countries": "Netherlands"},
  {"code": "+32", "countries": "Belgium"},
  {"code": "+33", "countries": "France"},
  {"code": "+34", "countries": "Spain"},
  {"code": "+350", "countries": "Gibraltar"},
  {"code": "+351", "countries": "Portugal"},
  {"code": "+352", "countries": "Luxembourg"},
  {"code": "+353", "countries": "Republic of Ireland"},
  {"code": "+354", "countries": "Iceland"},
  {"code": "+355", "countries": "Albania"},
  {"code": "+356", "countries": "Malta"},
  {"code": "+357", "countries": "Cyprus"},
  {"code": "+358", "countries": "Finland, Åland"},
  {"code": "+359", "countries": "Bulgaria"},
  {"code": "+36", "countries": "Hungary"},
  {"code": "+370", "countries": "Lithuania"},
  {"code": "+371", "countries": "Latvia"},
  {"code": "+372", "countries": "Estonia"},
  {"code": "+373", "countries": "Moldova"},
  {"code": "+374", "countries": "Armenia"},
  {"code": "+375", "countries": "Belarus"},
  {"code": "+376", "countries": "Andorra"},
  {"code": "+377", "countries": "Monaco"},
  {"code": "+378", "countries": "San Marino"},
  {"code": "+379", "countries": "Vatican City"},
  {"code": "+380", "countries": "Ukraine"},
  {"code": "+381", "countries": "Serbia"},
  {"code": "+382", "countries": "Montenegro"},
  {"code": "+383", "countries": "Kosovo"},
  {"code": "+385", "countries": "Croatia"},
  {"code": "+386", "countries": "Slovenia"},
  {"code": "+387", "countries": "Bosnia and Herzegovina"},
  {"code": "+389", "countries": "North Macedonia"},
  {"code": "+39", "countries": "Italy, Vatican City"},
  {"code": "+40", "countries": "Romania"},
  {"code": "+41", "countries": "Switzerland"},
  {"code": "+420", "countries": "Czech Republic"},
  {"code": "+421", "countries": "Slovakia"},
  {"code": "+423", "countries": "Liechtenstein"},
  {"code": "+43", "countries": "Austria"},
  {"code": "+44", "countries": "United Kingdom, Guernsey, Isle of Man, Jersey"},
  {"code": "+45", "countries": "Denmark"},
  {"code": "+46", "countries": "Sweden"},
  {"code": "+47", "countries": "Norway, Svalbard and Jan Mayen, Bouvet Island"},
  {"code": "+48", "countries": "Poland"},
  {"code": "+49", "countries": "Germany"},
  {"code": "+500", "countries": "Falkland Islands, South Georgia and the South Sandwich Islands"},
  {"code": "+501", "countries": "Belize"},
  {"code": "+502", "countries": "Guatemala"},
  {"code": "+503", "countries": "El Salvador"},
  {"code": "+504", "countries": "Honduras"},
  {"code": "+505", "countries": "Nicaragua"},
  {"code": "+506", "countries": "Costa Rica"},
  {"code": "+507", "countries": "Panama"},
  {"code": "+508", "countries": "Saint Pierre and Miquelon"},
  {"code": "+509", "countries": "Haiti"},
  {"code": "+51", "countries": "Peru"},
  {"code": "+52", "countries": "Mexico"},
  {"code": "+53", "countries": "Cuba"},
  {"code": "+54", "countries": "Argentina"},
  {"code": "+55", "countries": "Brazil"},
  {"code": "+56", "countries": "Chile"},
  {"code": "+57", "countries": "Colombia"},
  {"code": "+58", "countries": "Venezuela"},
  {"code": "+590", "countries": "Guadeloupe, Saint Barthélemy, Saint Martin"},
  {"code": "+591", "countries": "Bolivia"},
  {"code": "+592", "countries": "Guyana"},
  {"code": "+593", "countries": "Ecuador"},
  {"code": "+594", "countries": "French Guiana"},
  {"code": "+595", "countries": "Paraguay"},
  {"code": "+596", "countries": "Martinique"},
  {"code": "+597", "countries": "Suriname"},
  {"code": "+598", "countries": "Uruguay"},
  {"code": "+599", "countries": "Caribbean Netherlands, Curaçao"},
  {"code": "+60", "countries": "Malaysia"},
  {"code": "+61", "countries": "Australia, Christmas Island, Cocos Islands"},
  {"code": "+62", "countries": "Indonesia"},
  {"code": "+63", "countries": "Philippines"},
  {"code": "+64", "countries": "New Zealand, Pitcairn Islands"},
  {"code": "+65", "countries": "Singapore"},
  {"code": "+66", "countries": "Thailand"},
  {"code": "+670", "countries": "East Timor"},
  {"code": "+672", "countries": "Norfolk Island, Australian Antarctic Territory"},
  {"code": "+673", "countries": "Brunei"},
  {"code": "+674", "countries": "Nauru"},
  {"code": "+675", "countries": "Papua New Guinea"},
  {"code": "+676", "countries": "Tonga"},
  {"code": "+677", "countries": "Solomon Islands"},
  {"code": "+678", "countries": "Vanuatu"},
  {"code": "+679", "countries": "Fiji"},
  {"code": "+680", "countries": "Palau"},
  {"code": "+681", "countries": "Wallis and Futuna"},
  {"code": "+682", "countries": "Cook Islands"},
  {"code": "+683", "countries": "Niue"},
  {"code": "+685", "countries": "Samoa"},
  {"code": "+686", "countries": "Kiribati"},
  {"code": "+687", "countries": "New Caledonia"},
  {"code": "+688", "countries": "Tuvalu"},
  {"code": "+689", "countries": "French Polynesia"},
  {"code": "+690", "countries": "Tokelau"},
  {"code": "+691", "countries": "Federated States of Micronesia"},
  {"code": "+692", "countries": "Marshall Islands"},
  {"code": "+7", "countries": "Russia, Kazakhstan"},
  {"code": "+81", "countries": "Japan"},
  {"code": "+82", "countries": "South Korea"},
  {"code": "+84", "countries": "Vietnam"},
  {"code": "+850", "countries": "North Korea"},
  {"code": "+852", "countries": "Hong Kong"},
  {"code": "+853", "countries": "Macau"},
  {"code": "+855", "countries": "Cambodia"},
  {"code": "+856", "countries": "Laos"},
  {"code": "+86", "countries": "China"},
  {"code": "+880", "countries": "Bangladesh"},
  {"code": "+886", "countries": "Taiwan"},
  {"code": "+90", "countries": "Turkey"},
  {"code": "+91", "countries": "India"},
  {"code": "+92", "countries": "Pakistan"},
  {"code": "+93", "countries": "Afghanistan"},
  {"code": "+94", "countries": "Sri Lanka"},
  {"code": "+95", "countries": "Myanmar"},
  {"code": "+960", "countries": "Maldives"},
  {"code": "+961", "countries": "Lebanon"},
  {"code": "+962", "countries": "Jordan"},
  {"code": "+963", "countries": "Syria"},
  {"code": "+964", "countries": "Iraq"},
  {"code": "+965", "countries": "Kuwait"},
  {"code": "+966", "countries": "Saudi Arabia"},
  {"code": "+967", "countries": "Yemen"},
  {"code": "+968", "countries": "Oman"},
  {"code": "+970", "countries": "State of Palestine"},
  {"code": "+971", "countries": "United Arab Emirates"},
  {"code": "+972", "countries": "Israel, State of Palestine"},
  {"code": "+973", "countries": "Bahrain"},
  {"code": "+974", "countries": "Qatar"},
  {"code": "+975", "countries": "Bhutan"},
  {"code": "+976", "countries": "Mongolia"},
  {"code": "+977", "countries": "Nepal"},
  {"code": "+98", "countries": "Iran"},
  {"code": "+992", "countries": "Tajikistan"},
  {"code": "+993", "countries": "Turkmenistan"},
  {"code": "+994", "countries": "Azerbaijan"},
  {"code": "+995", "countries": "Georgia"},
  {"code": "+996", "countries": "Kyrgyzstan"}
];
function digitsOnly(s) {
  return String(s || "").replace(/\D/g, "");
}
// keep max length if you want (CI mobile is usually 10 digits now)
function normalizeLocalPhone(s) {
  return digitsOnly(s);
}
function buildFullPhone(code, localDigits) {
  const d = normalizeLocalPhone(localDigits);
  return d ? `${code}${d}` : "";
}
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}
function normalizePath(p) {
  return String(p || "").replaceAll("\\", "/");
}
function imgUrl(path) {
  if (!path) return "";
  const p = normalizePath(path);
  if (p.startsWith("http://") || p.startsWith("https://")) {
    return p;
  }
  return `${API_BASE}/${p.replace(/^\/+/, "")}`;
}
function InfoPill({ label, value }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="pill">
      <div className="pillLabel">{label}</div>
      <div className="pillValue">{value}</div>
    </div>
  );
}
function labelOrDash(v) {
  return v === null || v === undefined || String(v).trim() === "—" ? "—" : String(v);
}
function toNumberOrNull(v) {
  const s = String(v ?? "").trim();
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}
function normalizeText(s) {
  return String(s || "").toLowerCase().trim();
}
function waLink(raw) {
  let p = String(raw || "").trim().replace(/[^\d+]/g, "");
  if (p.startsWith("00")) p = "+" + p.slice(2);
  if (p.startsWith("+")) p = p.slice(1);
  if (!p) return "";
  return `https://wa.me/${p}`;
}
function openWhatsApp(number) {
  const link = waLink(number);
  if (!link) return;
  window.open(link, "_blank", "noopener,noreferrer");
}
// 🔹 Friendly frontend error messages (SAFE VERSION)
function humanizeApiError(msg) {
  if (!msg) return "Something went wrong";
  const s = String(msg).toLowerCase();
  if (s.includes("unauthorized")) return "Session expired. Please login again.";
  // ✅ Do NOT rewrite phone errors anymore
  return String(msg);
}
async function registerFetch({ fullName, phone, email, password }) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fullName: String(fullName || "").trim(),
      phone: String(phone || "").trim(),
      email: String(email || "").trim(),
      password,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  const data = await res.json();
  if (data?.token) localStorage.setItem("token", data.token);
  return data;
}
/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
export default function App() {
  const [cities, setCities] = useState([]);
  // Auth
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authTab, setAuthTab] = useState("LOGIN"); // LOGIN | REGISTER
  const [authBusy, setAuthBusy] = useState(false);
  const [regFullName, setRegFullName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regWantVerify, setRegWantVerify] = useState(false);
  const [user, setUser] = useState(null);
  const [err, setErr] = useState("");
  // Cars
  const [loadingCars, setLoadingCars] = useState(false);
  const [creatingCar, setCreatingCar] = useState(false);
  const [showMyCars, setShowMyCars] = useState(false);
  const [pageMode, setPageMode] = useState("BROWSE"); // BROWSE | SELL
  // Profile
  const [profile, setProfile] = useState({
    fullName: "",
    phone: "",
    whatsapp: "",
    city: "",
    sellerType: "PRIVATE",
    address: "",
    lat: "",
    lng: "",
    verificationStatus: "NOT_SUBMITTED",
    verificationNote: "",
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const hasSellerPhone = !!String(profile?.phone || "").trim();
  const hasSellerName = !!String(profile?.fullName || "").trim();
  const [phoneLocal, setPhoneLocal] = useState("");
  const [whatsLocal, setWhatsLocal] = useState("");
  const [selectedPhoneCode, setSelectedPhoneCode] = useState("+225");
  const [selectedWhatsCode, setSelectedWhatsCode] = useState("+225");
  // Catalog
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const years = useMemo(() => {
    const y = new Date().getFullYear();
    return Array.from({ length: 40 }, (_, i) => y + 1 - i);
  }, []);
  const fuels = ["Electric", "Hybrid", "Petrol", "Diesel"];
  const conditions = ["New", "Used"];
  const transmissions = ["Automatic", "Manual"];
  const [cars, setCars] = useState([]);
  const [createForm, setCreateForm] = useState({
    brand: "",
    year: "",
    model: "",
    fuel: "",
    price: "",
    mileage: "",
    condition: "Used",
    transmission: "Automatic",
    carType: "",
    color: "",
    title: "",
    description: "",
    locationMode: "MANUAL",
    address: "",
    lat: "",
    lng: "",
  });
  const [photos, setPhotos] = useState([]);
  const [photoErr, setPhotoErr] = useState("");
  // Browse filters
  const [q, setQ] = useState("");
  const [locationCity, setLocationCity] = useState("");
  const [conditionFilter, setConditionFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("NEWEST");
  const [viewMode, setViewMode] = useState("LIST");
  const [verifiedFirst, setVerifiedFirst] = useState(false);
  const [brandSearch, setBrandSearch] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [modelFilter, setModelFilter] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minKm, setMinKm] = useState("");
  const [maxKm, setMaxKm] = useState("");
  const [minYear, setMinYear] = useState("");
  const [maxYear, setMaxYear] = useState("");
  const [fuelChecks, setFuelChecks] = useState(() => new Set());
  const [transChecks, setTransChecks] = useState(() => new Set());
  const [carTypeChecks, setCarTypeChecks] = useState(() => new Set());
  const [sellerTypeChecks, setSellerTypeChecks] = useState(() => new Set());
  const [expanded, setExpanded] = useState(() => new Set());
  const [lightbox, setLightbox] = useState({ open: false, imgs: [], idx: 0 });
  // Verification upload
  const [verificationBusy, setVerificationBusy] = useState(false);
  const [idPhoto, setIdPhoto] = useState(null);
  const [selfiePhoto, setSelfiePhoto] = useState(null);
  const [verification, setVerification] = useState(null);
  const verifyBtnRef = useRef(null);
  const verifyDropRef = useRef(null);
  const [verifyOpen, setVerifyOpen] = useState(false);
  const [verifyPos, setVerifyPos] = useState({ top: 0, left: 0, width: 260 });
  // ✅ MOBILE FILTER DRAWER
  const [filtersOpen, setFiltersOpen] = useState(false);
  // ✅ MOBILE HAMBURGER MENU (iPhone)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

// Add the new state line HERE (after the last useState)
const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);




  function closeOverlays() {
    setMobileMenuOpen(false);
    setFiltersOpen(false);
    setVerifyOpen(false);
  }
  // Admin
  const isAdmin = String(user?.role || "").toUpperCase() === "ADMIN";
  const [adminStatus, setAdminStatus] = useState("PENDING");
  const [adminVerifs, setAdminVerifs] = useState([]);
  const [adminBusy, setAdminBusy] = useState(false);
  const [adminMsg, setAdminMsg] = useState("");
  const isLoggedIn = !!user;
/* =========================
   🔥 PROMO ROTATING BANNER
========================= */
const promoSlides = [
  {
    title: "Popular Brands on CôteCar",
    logos: [
      "https://1000logos.net/wp-content/uploads/2018/02/BMW-Logo-1997.png",  // BMW
      "https://www.freeiconspng.com/uploads/mercedes-benz-logo-png-9.png",  // Mercedes-Benz
      "https://www.freeiconspng.com/uploads/toyota-logo-png-1.png",  // Toyota
      "https://1000logos.net/wp-content/uploads/2021/04/Volkswagen-logo.png",  // Volkswagen
      "https://cdn.freebiesupply.com/logos/large/2x/audi-1-logo-png-transparent.png",  // Audi
      "https://cdn.freebiesupply.com/logos/thumbs/2x/ford-8-logo.png",  // Ford
      "https://1000logos.net/wp-content/uploads/2018/02/Ferrari-Logo.png",
      "https://logos-world.net/wp-content/uploads/2021/03/Lamborghini-Emblem.png",
      "https://1000logos.net/wp-content/uploads/2018/02/Porsche-Logo.png",  // Porsche
      "https://1000logos.net/wp-content/uploads/2021/04/Tesla-logo.png",


    ],
  },

  {
    title: "🏆 Verified Sellers",
    text: "Build trust and increase buyer confidence.",
    button: "Get Verified",
    action: () => openVerifyDropdown(),
  },
  {
    title: "🔥 Premium Dealer Package",
    text: "Unlimited listings + priority visibility.",
    button: "Upgrade",
    action: () => alert("Dealer package coming soon"),
  },
];
const [currentSlide, setCurrentSlide] = useState(0);



useEffect(() => {
  const timer = setInterval(() => {
    setCurrentSlide((prev) => (prev + 1) % promoSlides.length);
  }, 8000); // slower: 8 seconds per slide
  return () => clearInterval(timer);
}, []);







/* =========================
   ⭐ FAVORITES SYSTEM
========================= */

const [favorites, setFavorites] = useState(() => {
  try {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
});

useEffect(() => {
  localStorage.setItem("favorites", JSON.stringify(favorites));
}, [favorites]);

function toggleFavorite(carId) {
  setFavorites((prev) => {
    if (prev.includes(carId)) {
      return prev.filter((id) => id !== carId);
    } else {
      return [...prev, carId];
    }
  });
}

function isFavorite(carId) {
  return favorites.includes(carId);
}
  /* ─────────────────────────────────────────
     ✅ GOOGLE OAUTH SUCCESS HANDLER (ONLY ONCE)
     Works when backend redirects to:
     /oauth-success?token=....
  ────────────────────────────────────────── */
  useEffect(() => {
    if (window.location.pathname !== "/oauth-success") return;
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      // clean URL back to "/"
      window.history.replaceState({}, document.title, "/");
      // reload user then return to home
      (async () => {
        try {
          await loadMe();
        } finally {
          window.location.replace("/");
        }
      })();
    } else {
      window.history.replaceState({}, document.title, "/");
      setErr("Google login failed: missing token");
      window.location.replace("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /* ─────────────────────────────────────────
     SIMPLE ROUTE HANDLING (SAFE)
     MUST BE AFTER ALL HOOKS
  ────────────────────────────────────────── */
  const route = window.location.pathname;
  if (route === "/privacy") return <PrivacyPolicyPage />;
  if (route === "/terms") return <TermsOfServicePage />;
  if (route === "/oauth-success") {
    return (
      <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
        <h1>Signing you in…</h1>
        <p>Please wait, you will be redirected.</p>
        <p>
          If nothing happens,{" "}
          <a href="/" style={{ fontWeight: 900 }}>
            click here
          </a>
          .
        </p>
      </div>
    );
  }
  /* ─────────────────────────────────────────
     Lightbox helpers
  ────────────────────────────────────────── */
  function carImages(c) {
    const arr = Array.isArray(c?.images) ? c.images : [];
    return arr.map((p) => imgUrl(p)).filter(Boolean);
  }
  function openLightbox(c, startIndex = 0) {
    const imgs = carImages(c);
    if (imgs.length === 0) return;
    setLightbox({ open: true, imgs, idx: Math.max(0, Math.min(startIndex, imgs.length - 1)) });
  }
  function closeLightbox() {
    setLightbox({ open: false, imgs: [], idx: 0 });
  }
  function nextImg() {
    setLightbox((p) => ({ ...p, idx: (p.idx + 1) % p.imgs.length }));
  }
  function prevImg() {
    setLightbox((p) => ({ ...p, idx: (p.idx - 1 + p.imgs.length) % p.imgs.length }));
  }
  function CallButton({ phone, isSold, isOwner }) {
    const disabled = !phone || (isSold && !isOwner);
    const mobile = isMobileDevice();
    const label = mobile ? "Call" : "Copy";
    const title = isSold && !isOwner ? "SOLD" : mobile ? "Call" : "Copy number";
    return (
      <button
        className="btnCall"
        disabled={disabled}
        onClick={async () => {
          const phoneClean = cleanPhone(phone);
          if (!phoneClean) return;
          if (isMobileDevice()) {
            window.location.href = `tel:${phoneClean}`;
            return;
          }
          const ok = await copyToClipboard(phoneClean);
          if (ok) setErr(`Number copied: ${phoneClean}`);
          else setErr(`Copy this number: ${phoneClean}`);
          setTimeout(() => setErr(""), 2500);
        }}
        title={title}
        type="button"
      >
        {label}
      </button>
    );
  }
  function WhatsAppButton({ number, isSold, isOwner }) {
    const disabled = !number || (isSold && !isOwner);
    return (
      <button className="btnWhats" disabled={disabled} onClick={() => openWhatsApp(number)} title={isSold && !isOwner ? "SOLD" : "WhatsApp"} type="button">
        WhatsApp
      </button>
    );
  }
  /* ─────────────────────────────────────────
     Filters helpers
  ────────────────────────────────────────── */
  function toggleSet(setter, value) {
    setter((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  }
  function clearAllFilters() {
    setQ("");
    setLocationCity("");
    setConditionFilter("ALL");
    setSortBy("NEWEST");
    setVerifiedFirst(false);
    setBrandSearch("");
    setBrandFilter("");
    setModelFilter("");
    setMinPrice("");
    setMaxPrice("");
    setMinKm("");
    setMaxKm("");
    setMinYear("");
    setMaxYear("");
    setFuelChecks(new Set());
    setTransChecks(new Set());
    setCarTypeChecks(new Set());
    setSellerTypeChecks(new Set());
  }
  /* ─────────────────────────────────────────
     API loaders
  ────────────────────────────────────────── */
  async function loadMe() {
    try {
      const me = await apiFetch("/auth/me");
      setUser(me ? { ...me, id: me.id || me.userId } : null);
    } catch {
      setUser(null);
    }
  }
  async function loadCities() {
    try {
      const data = await apiFetch("/catalog/cities");
      const list = Array.isArray(data) ? data : [];
      setCities(Array.from(new Set(list)));
    } catch {
      setCities([]);
    }
  }
  async function loadProfile() {
    try {
      const p = await apiFetch("/users/me");
      setProfile({
        fullName: p?.fullName || "",
        phone: p?.phone || "",
        whatsapp: p?.whatsapp || "",
        city: p?.city || "",
        sellerType: p?.sellerType || "PRIVATE",
        address: p?.address || "",
        lat: p?.lat != null ? String(p.lat) : "",
        lng: p?.lng != null ? String(p.lng) : "",
        verificationStatus: p?.verificationStatus || "NOT_SUBMITTED",
        verificationNote: p?.verificationNote || "",
      });
      setPhoneLocal(digitsOnly(p?.phone || "").replace(/^225/, "").replace(/^0+/, ""));
      setWhatsLocal(digitsOnly(p?.whatsapp || "").replace(/^225/, "").replace(/^0+/, ""));
      const phoneCode = p?.phone ? p.phone.slice(0, p.phone.length - normalizeLocalPhone(p.phone).length) : "+225";
      const whatsCode = p?.whatsapp ? p.whatsapp.slice(0, p.whatsapp.length - normalizeLocalPhone(p.whatsapp).length) : "+225";
      setSelectedPhoneCode(phoneCode);
      setSelectedWhatsCode(whatsCode);
    } catch { }
  }
  async function loadVerification() {
    try {
      const v = await apiFetch("/verification/me");
      setVerification(v);
      if (v?.status) {
        setProfile((prev) => ({ ...prev, verificationStatus: v.status, verificationNote: v.note || "" }));
      }
    } catch {
      setVerification(null);
    }
  }
  async function loadAdminVerifications(status = adminStatus) {
    if (!isAdmin) return;
    setAdminBusy(true);
    setAdminMsg("");
    try {
      const list = await adminListVerifications(status);
      setAdminVerifs(Array.isArray(list) ? list : []);
    } catch (e) {
      setAdminMsg(String(e?.message || e || "Failed to load verifications"));
      setAdminVerifs([]);
    } finally {
      setAdminBusy(false);
    }
  }
  async function loadMakes() {
    try {
      const data = await apiFetch("/catalog/makes");
      setMakes(Array.isArray(data) ? data : []);
    } catch {
      setMakes([]);
    }
  }
  async function loadModelsForMake(make) {
    if (!make) {
      setModels([]);
      return;
    }
    try {
      const data = await apiFetch(`/catalog/models?make=${encodeURIComponent(make)}`);
      setModels(Array.isArray(data) ? data : []);
    } catch {
      setModels([]);
    }
  }
  async function loadCars() {
    setLoadingCars(true);
    setErr("");
    try {
      const path = showMyCars && user ? "/cars/mine" : "/cars";
      const data = await apiFetch(path);
      setCars(Array.isArray(data) ? data : []);
    } catch (e) {
      const msg = String(e.message || e);
      if (showMyCars && user && msg.includes("404")) {
        setErr("Backend lacks /cars/mine. Showing public cars only.");
        try {
          const data2 = await apiFetch("/cars");
          setCars(Array.isArray(data2) ? data2 : []);
        } catch (e2) {
          setErr(String(e2.message || e2));
          setCars([]);
        }
      } else {
        setErr(msg);
        setCars([]);
      }
    } finally {
      setLoadingCars(false);
    }
  }
  /* ─────────────────────────────────────────
     Effects
  ────────────────────────────────────────── */
  useEffect(() => {
    loadMe();
    loadMakes();
    loadCars();
    loadCities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (user) {
      loadProfile();
      loadVerification();
      if (String(user?.role || "").toUpperCase() === "ADMIN") loadAdminVerifications("PENDING");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  useEffect(() => {
    loadModelsForMake(createForm.brand);
    setCreateForm((p) => ({ ...p, model: "" }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createForm.brand]);
  useEffect(() => {
    loadCars();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showMyCars]);
  // Close filters drawer when switching to SELL
  useEffect(() => {
    if (pageMode === "SELL") setFiltersOpen(false);
  }, [pageMode]);
  /* ─────────────────────────────────────────
     Auth handlers
  ────────────────────────────────────────── */
  async function onLogin(e) {
    e.preventDefault();
    setErr("");
    setAuthBusy(true);
    try {
      await login(email, password);
      await loadMe();
      await loadProfile();
      await loadMakes();
      await loadCars();
    } catch (e2) {
      setErr(String(e2.message || e2));
    } finally {
      setAuthBusy(false);
    }
  }
  async function onRegister(e) {
    e.preventDefault();
    setErr("");
    setAuthBusy(true);
    try {
      await registerFetch({ fullName: regFullName, phone: regPhone, email: regEmail, password: regPassword });
      await loadMe();
      await loadProfile();
      await loadMakes();
      await loadCars();
      if (regWantVerify) {
        setPageMode("BROWSE");
        openVerifyDropdown();
      } else {
        setPageMode("SELL");
      }
    } catch (e2) {
      setErr(String(e2.message || e2));
    } finally {
      setAuthBusy(false);
    }
  }


function onLogout() {
  // Clear authentication
  logout();  // This removes the token from localStorage (from your ./auth file)

  // Clear all relevant React states
  setUser(null);
  setShowMyCars(false);
  setFiltersOpen(false);
  setMobileMenuOpen(false);
  setVerifyOpen(false);
  setProfileDropdownOpen?.(false); // if you added the desktop dropdown

  // Optional: Show a quick message (disappears after 1.5s)
  setErr("Logged out successfully");

  // MOST IMPORTANT LINE FOR iPHONE:
  // Force full page reload → fixes the "stuck Logout button" issue
  window.location.replace("/");
  
  // Optional: Clear error message after a short delay
  setTimeout(() => setErr(""), 1500);
}








  /* ─────────────────────────────────────────
     Profile save
  ────────────────────────────────────────── */
  async function saveProfile(e) {
    e.preventDefault();
    setErr("");
    setSavingProfile(true);
    try {
      const payload = {
        ...profile,
        lat: profile.lat ? Number(profile.lat) : null,
        lng: profile.lng ? Number(profile.lng) : null,
      };
      await apiFetch("/users/me", { method: "PATCH", body: JSON.stringify(payload) });
      await loadProfile();
      setErr("Profile saved ✅");
      setTimeout(() => setErr(""), 2000);
    } catch (e2) {
      setErr(String(e2.message || e2));
    } finally {
      setSavingProfile(false);
    }
  }
  /* ─────────────────────────────────────────
     Location helpers (Create Car)
  ────────────────────────────────────────── */
  function setCarToCurrentLocation() {
    setErr("");
    if (!navigator.geolocation) {
      setErr("Geolocation not supported on this device.");
      return;
    }
    setErr("Fetching your location... (allow permission if asked)");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(6);
        const lng = pos.coords.longitude.toFixed(6);
        setCreateForm((p) => ({
          ...p,
          locationMode: "CURRENT",
          lat,
          lng,
          address: p.address || "My current location (GPS detected)",
        }));
        setErr("Location acquired! Map preview updated below.");
      },
      (error) => {
        let msg = "Could not get location.";
        if (error.code === 1) msg = "Location permission denied — please allow access in browser settings.";
        if (error.code === 2) msg = "Location unavailable. Try manual entry.";
        if (error.code === 3) msg = "Location timed out. Try again.";
        setErr(msg);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  }
  function setCarToManualLocation() {
    setCreateForm((p) => ({ ...p, locationMode: "MANUAL", lat: "", lng: "" }));
  }
  /* ─────────────────────────────────────────
     Create Car
  ────────────────────────────────────────── */
  async function onCreateCar(e) {
    e.preventDefault();
    setErr("");
    // ✅ iPhone Safari sometimes doesn't show "required" popups,
    // so we validate the main required fields manually.
    const missing = [];
    if (!createForm.brand) missing.push("Brand");
    if (!createForm.year) missing.push("Year");
    if (!createForm.model) missing.push("Model");
    if (!createForm.fuel) missing.push("Fuel");
    if (!createForm.price) missing.push("Price");
    if (missing.length) {
      setErr(`Please fill: ${missing.join(", ")}.`);
      setCreatingCar(false);
      return;
    }
    // ✅ BLOCK ONLY IF SELLER PROFILE IS INCOMPLETE
    if (!hasSellerPhone || !hasSellerName) {
      setErr(
        'Please add your phone number in Seller Profile and click “Save Profile” before posting.'
      );
      setPageMode("SELL");
      return;
    }
    setCreatingCar(true);
    try {
      const autoTitle =
        createForm.brand && createForm.model
          ? `${createForm.brand} ${createForm.model}`
          : "";
      const fd = new FormData();
      fd.append("brand", createForm.brand);
      fd.append("year", String(createForm.year));
      fd.append("model", createForm.model);
      fd.append("fuel", createForm.fuel || "");
      fd.append("price", String(createForm.price));
      fd.append("mileage", createForm.mileage ? String(createForm.mileage) : "");
      fd.append("condition", createForm.condition || "");
      fd.append("transmission", createForm.transmission || "");
      fd.append("carType", createForm.carType || "");
      fd.append("color", createForm.color || "");
      fd.append("title", createForm.title || autoTitle);
      fd.append("description", createForm.description || "");
      fd.append("address", createForm.address || "");
      fd.append("lat", createForm.lat ? String(createForm.lat) : "");
      fd.append("lng", createForm.lng ? String(createForm.lng) : "");
      photos.forEach((f) => fd.append("images", f));
      await apiFetch("/cars", { method: "POST", body: fd });
      setCreateForm({
        brand: "",
        year: "",
        model: "",
        fuel: "",
        price: "",
        mileage: "",
        condition: "Used",
        transmission: "Automatic",
        carType: "",
        color: "",
        title: "",
        description: "",
        locationMode: "MANUAL",
        address: "",
        lat: "",
        lng: "",
      });
      setPhotos([]);
      setModels([]);
      await loadCars();
      setPageMode("BROWSE");
    } catch (e2) {
      setErr(humanizeApiError(e2?.message || e2));
    } finally {
      setCreatingCar(false);
    }
  }
  async function setCarStatus(carId, status) {
    setErr("");
    try {
      await apiFetch(`/cars/${carId}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
      // ✅ If you delist, auto switch to "My Cars" so the PAUSED ad stays visible
      if (status === "PAUSED") setShowMyCars(true);
      await loadCars();
    } catch (e) {
      setErr(String(e.message || e));
    }
  }
  async function deleteCar(carId) {
    if (!window.confirm("Are you sure you want to delete this car?")) return;
    setErr("");
    try {
      await apiFetch(`/cars/${carId}`, { method: "DELETE" });
      await loadCars();
    } catch (e) {
      setErr(String(e.message || e));
    }
  }
  function badgeLabel(car) {
    return car?.status || "ACTIVE";
  }
  function showSoldLine(car) {
    if (car?.status !== "SOLD") return null;
    const when = formatSoldDate(car?.soldAt);
    if (!when) return <div className="mutedSm">Sold</div>;
    return <div className="mutedSm">Sold on: {when}</div>;
  }
  /* ─────────────────────────────────────────
     Verification submit
  ────────────────────────────────────────── */
  async function onSubmitVerification(e) {
    e.preventDefault();
    setErr("");
    if (!idPhoto || !selfiePhoto) {
      setErr("Please upload both ID and selfie.");
      return;
    }
    setVerificationBusy(true);
    try {
      const fd = new FormData();
      fd.append("idImage", idPhoto);
      fd.append("selfie", selfiePhoto);
      fd.append("idType", "NATIONAL_ID");
      const res = await fetch(`${API_BASE}/verification/seller`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: fd,
      });
      if (!res.ok && res.status !== 204) {
        const text = await res.text();
        throw new Error(text || res.statusText);
      }
      await loadVerification();
      setIdPhoto(null);
      setSelfiePhoto(null);
      setErr("Verification submitted successfully! ✅");
    } catch (e) {
      setErr(String(e?.message || e || "Upload failed"));
    } finally {
      setVerificationBusy(false);
    }
  }
  /* ─────────────────────────────────────────
     Verify dropdown placement
  ────────────────────────────────────────── */
  function openVerifyDropdown() {
    const el = verifyBtnRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setVerifyPos({ top: r.bottom + 10, left: r.left, width: Math.max(260, r.width) });
    setVerifyOpen(true);
    setPageMode("BROWSE");
  }
  useEffect(() => {
    function onDocClick(e) {
      if (!verifyOpen) return;
      const drop = verifyDropRef.current;
      const btn = verifyBtnRef.current;
      if (drop && drop.contains(e.target)) return;
      if (btn && btn.contains(e.target)) return;
      setVerifyOpen(false);
    }
    function onEsc(e) {
      if (e.key === "Escape") setVerifyOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [verifyOpen]);
  /* ─────────────────────────────────────────
     Admin review
  ────────────────────────────────────────── */
  async function adminReview(verifId, status) {
    setAdminMsg("");
    try {
      await adminReviewVerification(verifId, status, "");
      await loadAdminVerifications(adminStatus);
      setAdminMsg(`Updated: ${status}`);
    } catch (e) {
      setAdminMsg(String(e?.message || e || "Admin review failed"));
    }
  }
  /* ─────────────────────────────────────────
     Derived browse data
  ────────────────────────────────────────── */
  const brandCounts = useMemo(() => {
    const map = new Map();
    for (const c of cars || []) {
      const b = String(c?.brand || "").trim();
      if (!b) continue;
      map.set(b, (map.get(b) || 0) + 1);
    }
    return map;
  }, [cars]);
  const modelCountsForBrand = useMemo(() => {
    const map = new Map();
    if (!brandFilter) return map;
    for (const c of cars || []) {
      if (String(c?.brand || "").trim() !== brandFilter) continue;
      const m = String(c?.model || "").trim();
      if (!m) continue;
      map.set(m, (map.get(m) || 0) + 1);
    }
    return map;
  }, [cars, brandFilter]);
  const visibleBrands = useMemo(() => {
    const s = normalizeText(brandSearch);
    let list = Array.from(brandCounts.keys());
    list.sort((a, b) => (brandCounts.get(b) || 0) - (brandCounts.get(a) || 0));
    if (s) list = list.filter((b) => normalizeText(b).includes(s));
    return list;
  }, [brandSearch, brandCounts]);
  const visibleModels = useMemo(() => {
    if (!brandFilter) return [];
    const list = Array.from(modelCountsForBrand.keys());
    list.sort((a, b) => (modelCountsForBrand.get(b) || 0) - (modelCountsForBrand.get(a) || 0));
    return list;
  }, [brandFilter, modelCountsForBrand]);
  const carTypeOptions = useMemo(() => {
    const s = new Set();
    for (const c of cars || []) {
      const t = String(c?.carType || "").trim();
      if (t) s.add(t);
    }
    return Array.from(s).sort((a, b) => a.localeCompare(b));
  }, [cars]);
  const filteredCars = useMemo(() => {
    const qText = normalizeText(q);
    const city = String(locationCity || "").trim();
    const pMin = toNumberOrNull(minPrice);
    const pMax = toNumberOrNull(maxPrice);
    const kMin = toNumberOrNull(minKm);
    const kMax = toNumberOrNull(maxKm);
    const yMin = toNumberOrNull(minYear);
    const yMax = toNumberOrNull(maxYear);
    let arr = (cars || []).slice();
    if (conditionFilter !== "ALL") arr = arr.filter((c) => String(c?.condition || "").toLowerCase() === normalizeText(conditionFilter));
    if (city) arr = arr.filter((c) => String(c?.owner?.city || "").trim() === city);
    if (brandFilter) arr = arr.filter((c) => String(c?.brand || "").trim() === brandFilter);
    if (modelFilter) arr = arr.filter((c) => String(c?.model || "").trim() === modelFilter);
    if (pMin != null) arr = arr.filter((c) => Number(c?.price || 0) >= pMin);
    if (pMax != null) arr = arr.filter((c) => Number(c?.price || 0) <= pMax);
    if (kMin != null)
      arr = arr.filter((c) => {
        const km = toNumberOrNull(c?.mileage);
        return km != null && km >= kMin;
      });
    if (kMax != null)
      arr = arr.filter((c) => {
        const km = toNumberOrNull(c?.mileage);
        return km != null && km <= kMax;
      });
    if (yMin != null) arr = arr.filter((c) => Number(c?.year || 0) >= yMin);
    if (yMax != null) arr = arr.filter((c) => Number(c?.year || 0) <= yMax);
    if (fuelChecks.size > 0) arr = arr.filter((c) => fuelChecks.has(String(c?.fuel || "")));
    if (transChecks.size > 0) arr = arr.filter((c) => transChecks.has(String(c?.transmission || "")));
    if (carTypeChecks.size > 0) arr = arr.filter((c) => carTypeChecks.has(String(c?.carType || "")));
    if (sellerTypeChecks.size > 0) arr = arr.filter((c) => sellerTypeChecks.has(String(c?.owner?.sellerType || "")));
    if (qText) {
      arr = arr.filter((c) => {
        const hay = [
          c?.brand,
          c?.model,
          c?.title,
          c?.description,
          c?.carType,
          c?.color,
          c?.fuel,
          c?.transmission,
          c?.address,
          c?.owner?.city,
          c?.owner?.fullName,
        ]
          .map((x) => normalizeText(x))
          .join(" ");
        return hay.includes(qText);
      });
    }
    if (verifiedFirst) {
      arr.sort(
        (a, b) =>
          (b?.owner?.verificationStatus === "VERIFIED" ? 1 : 0) - (a?.owner?.verificationStatus === "VERIFIED" ? 1 : 0)
      );
    }
    const sortNewest = (a, b) => new Date(b?.createdAt || b?.updatedAt || 0) - new Date(a?.createdAt || a?.updatedAt || 0);
    const sortOldest = (a, b) => new Date(a?.createdAt || a?.updatedAt || 0) - new Date(b?.createdAt || b?.updatedAt || 0);
    if (sortBy === "NEWEST") arr.sort(sortNewest);
    else if (sortBy === "OLDEST") arr.sort(sortOldest);
    else if (sortBy === "PRICE_ASC") arr.sort((a, b) => Number(a?.price || 0) - Number(b?.price || 0));
    else if (sortBy === "PRICE_DESC") arr.sort((a, b) => Number(b?.price || 0) - Number(a?.price || 0));
    else if (sortBy === "YEAR_DESC") arr.sort((a, b) => Number(b?.year || 0) - Number(a?.year || 0));
    else if (sortBy === "YEAR_ASC") arr.sort((a, b) => Number(a?.year || 0) - Number(b?.year || 0));
    else arr.sort(sortNewest);
    return arr;
  }, [
    cars,
    q,
    locationCity,
    conditionFilter,
    sortBy,
    verifiedFirst,
    brandFilter,
    modelFilter,
    minPrice,
    maxPrice,
    minKm,
    maxKm,
    minYear,
    maxYear,
    fuelChecks,
    transChecks,
    carTypeChecks,
    sellerTypeChecks,
  ]);
  const featuredIds = useMemo(() => new Set(filteredCars.slice(0, 3).map((c) => c.id)), [filteredCars]);
  /* ─────────────────────────────────────────
     ✅ FILTERS PANEL (REUSABLE)
     Used in desktop left column AND mobile drawer
  ────────────────────────────────────────── */
  function FiltersPanel() {
    return (
      <div className="panel">
        <div className="panelHead">
          <h3 className="panelTitle">Filters</h3>
          <button className="btn btnGhost" onClick={clearAllFilters} title="Clear filters" type="button">
            Clear
          </button>
        </div>
        <div className="panelBody">
          <div className="filterGroup">
            <div className="filterHead">Brand & Model</div>
            <input className="input" value={brandSearch} onChange={(e) => setBrandSearch(e.target.value)} placeholder="Search brand..." style={{ marginBottom: 8 }} />
            <div className="listBox" style={{ marginBottom: 8 }}>
              {visibleBrands.map((b) => {
                const active = b === brandFilter;
                const count = brandCounts.get(b) || 0;
                return (
                  <div
                    key={b}
                    className={`listItem ${active ? "listItemActive" : ""}`}
                    onClick={() => {
                      setBrandFilter((prev) => (prev === b ? "" : b));
                      setModelFilter("");
                    }}
                    title="Select brand"
                  >
                    <div style={{ fontWeight: 1000 }}>{b}</div>
                    <div className="count">{count}</div>
                  </div>
                );
              })}
              {visibleBrands.length === 0 ? (
                <div className="mutedSm" style={{ padding: 8 }}>
                  No brands found
                </div>
              ) : null}
            </div>
            {brandFilter ? (
              <>
                <div className="mutedSm" style={{ marginBottom: 6 }}>
                  Models for <b>{brandFilter}</b>
                </div>
                <div className="listBox">
                  <div className={`listItem ${modelFilter === "" ? "listItemActive" : ""}`} onClick={() => setModelFilter("")}>
                    <div style={{ fontWeight: 1000 }}>All models</div>
                    <div className="count">{Array.from(modelCountsForBrand.values()).reduce((a, b) => a + b, 0)}</div>
                  </div>
                  {visibleModels.map((m) => {
                    const active = m === modelFilter;
                    const count = modelCountsForBrand.get(m) || 0;
                    return (
                      <div key={m} className={`listItem ${active ? "listItemActive" : ""}`} onClick={() => setModelFilter((prev) => (prev === m ? "" : m))}>
                        <div style={{ fontWeight: 1000 }}>{m}</div>
                        <div className="count">{count}</div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : null}
          </div>
          <div className="filterGroup">
            <div className="filterHead">Price (CFA)</div>
            <div className="twoCols">
              <input className="input" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="Min" type="number" />
              <input className="input" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Max" type="number" />
            </div>
          </div>
          <div className="filterGroup">
            <div className="filterHead">Kilometers</div>
            <div className="twoCols">
              <input className="input" value={minKm} onChange={(e) => setMinKm(e.target.value)} placeholder="Min" type="number" />
              <input className="input" value={maxKm} onChange={(e) => setMaxKm(e.target.value)} placeholder="Max" type="number" />
            </div>
          </div>
          <div className="filterGroup">
            <div className="filterHead">Year</div>
            <div className="twoCols">
              <input className="input" value={minYear} onChange={(e) => setMinYear(e.target.value)} placeholder="Min" type="number" />
              <input className="input" value={maxYear} onChange={(e) => setMaxYear(e.target.value)} placeholder="Max" type="number" />
            </div>
          </div>
          <div className="filterGroup">
            <div className="filterHead">Fuel Type</div>
            {fuels.map((f) => (
              <div key={f} className="checkRow" onClick={() => toggleSet(setFuelChecks, f)}>
                <input className="chk" type="checkbox" readOnly checked={fuelChecks.has(f)} />
                <div className="checkLabel">
                  <span>{f}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="filterGroup">
            <div className="filterHead">Transmission Type</div>
            {transmissions.map((t) => (
              <div key={t} className="checkRow" onClick={() => toggleSet(setTransChecks, t)}>
                <input className="chk" type="checkbox" readOnly checked={transChecks.has(t)} />
                <div className="checkLabel">
                  <span>{t}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="filterGroup">
            <div className="filterHead">Car Type</div>
            {carTypeOptions.length === 0 ? (
              <div className="mutedSm">No car types yet</div>
            ) : (
              carTypeOptions.map((t) => (
                <div key={t} className="checkRow" onClick={() => toggleSet(setCarTypeChecks, t)}>
                  <input className="chk" type="checkbox" readOnly checked={carTypeChecks.has(t)} />
                  <div className="checkLabel">
                    <span>{t}</span>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="filterGroup">
            <div className="filterHead">Seller Type</div>
            {["PRIVATE", "DEALER"].map((t) => (
              <div key={t} className="checkRow" onClick={() => toggleSet(setSellerTypeChecks, t)}>
                <input className="chk" type="checkbox" readOnly checked={sellerTypeChecks.has(t)} />
                <div className="checkLabel">
                  <span>{t === "PRIVATE" ? "Individual" : "Dealer"}</span>
                </div>
              </div>
            ))}
          </div>
   </div>
  </div>
    );
  }

// Add this constant HERE (right before return)
const dropdownItemStyle = {
  padding: '12px 20px',
  color: '#111827',
  textDecoration: 'none',
  fontSize: 15,
  fontWeight: 500,
  display: 'block',
  transition: 'background 0.2s',
  cursor: 'pointer',
  border: 'none',
  background: 'transparent',
  textAlign: 'left',
  width: '100%',
};










  /* ─────────────────────────────────────────
     RENDER
  ────────────────────────────────────────── */
  return (
    <div className="page">














<style>{`
  :root{
    --accent-blue: #3b82f6;
    --accent-green: #22c55e;
    --brand-green: #009E60;
    --bg: #f9fafb;
    --card: #ffffff;
    --line: #e5e7eb;
    --txt: #111827;
    --muted: #6b7280;
    --muted2: #9ca3af;
    --shadow: 0 10px 20px rgba(0,0,0,0.05);
    --r14: 14px;
    --r12: 12px;
    --transition: 0.2s ease;
  }
  *{ box-sizing: border-box; transition: var(--transition); }
  html, body, #root{ height: 100%; width: 100%; margin: 0; scroll-behavior: smooth; }
  body{ overflow-x: hidden; background: var(--bg); color: var(--txt); }
  .page{ min-height: 100vh; width: 100vw; background: var(--bg);
    font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
  }
  .wrap{ width: 100%; max-width: 1280px; margin: 0 auto; padding: 14px; }
  .mutedSm{ font-size: 12px; color: var(--muted); font-weight: 800; }
  .smallNote{ font-size: 12px; color: var(--muted); }
  .muted{ color: var(--muted); }
  .header{
    position: sticky; top: 0; z-index: 20;
    background: rgba(255,255,255,0.95);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--line);
  }
  .headerInner{
    width: 100%; max-width: 1280px; margin: 0 auto;
    padding: 12px 14px;
    display: flex; align-items: center; gap: 12px;
  }
  .logo{ display: flex; align-items: center; gap: 10px; font-weight: 1000; cursor: pointer; }
  .logo:hover{ opacity: 0.85; }
  .logoImg{ height: 160px; width: auto; object-fit: contain; display: block; }
  @media (max-width: 520px){ .logoImg{ height: 160px; } }
  .headerControls{
    flex: 1; display: flex; gap: 10px; align-items: center; min-width: 0;
  }
  .locSelect{ min-width: 220px; max-width: 260px; border-radius: var(--r12); padding: 10px; border: 1px solid var(--line); }
  .searchWrap{
    flex: 1; min-width: 0;
    display: flex; align-items: center; gap: 10px;
    background: #fff; border: 1px solid var(--line);
    border-radius: 999px; padding: 8px 10px;
    box-shadow: var(--shadow);
  }
  .searchInput{ background: transparent; border: none; outline: none; width: 100%; }
  .searchWrap:focus-within{
    border-color: var(--accent-blue);
    box-shadow: 0 0 0 3px rgba(59,130,246,0.15);
  }
  .clearBtn{
    border: 0; background: transparent; cursor: pointer; font-size: 18px; font-weight: 900;
    line-height: 1; padding: 4px 8px; color: #6b7280;
  }
  .btn{
    padding: 10px 12px; border-radius: 999px; border: 1px solid var(--line);
    background: #fff; color: var(--txt); cursor: pointer; font-weight: 900;
    box-shadow: var(--shadow);
    transition: transform var(--transition), box-shadow var(--transition), border-color var(--transition);
    white-space: nowrap;
  }
  .btn:hover{ border-color: #d1d5db; box-shadow: 0 10px 20px rgba(0,0,0,0.08); transform: scale(1.02); }
  .btn:active{ transform: scale(0.98); }
  .btn:disabled{ opacity: 0.55; cursor: not-allowed; box-shadow: none; }
  .btnPrimary{ background: var(--accent-blue); border-color: rgba(0,0,0,0.08); color: #fff; }
  .btnSell{ background: var(--brand-green) !important; border-color: rgba(0,0,0,0.08) !important; color:#fff !important; }
  .btnGhost{ background: transparent; box-shadow: none; }
  .btnMini{
    padding: 8px 12px;
    border-radius: 12px;
    border: 1.5px solid #cfd4dc;
    background: #ffffff;
    font-weight: 900;
    cursor: pointer;
    font-size: 12px;
    color: #1c1f24;
  }
  .grid{ display: grid; grid-template-columns: 330px 1fr; gap: 14px; margin-top: 14px; align-items: start; }
  @media (max-width: 1000px){ .grid{ grid-template-columns: 1fr; } .locSelect{ min-width: 150px; max-width: 200px; } }
  .panel{ background: var(--card); border: 1px solid var(--line); border-radius: var(--r14); box-shadow: var(--shadow); overflow: hidden; }
  .panelHead{ padding: 12px; border-bottom: 1px solid var(--line);
    display: flex; align-items: center; justify-content: space-between; gap: 10px;
  }
  .panelTitle{ margin: 0; font-size: 13px; font-weight: 1000; letter-spacing: 0.3px; text-transform: uppercase; color: #374151; }
  .panelBody{ padding: 12px; overflow-y: auto; max-height: calc(100vh - 200px); }
  .field{ display: grid; gap: 6px; margin-bottom: 10px; }
  .label{ font-size: 12px; color: var(--muted); font-weight: 700; }
  .input, .select{
    width: 100%; padding: 10px 11px; border-radius: 12px;
    border: 1px solid var(--line); background: #fff; color: var(--txt); outline: none;
  }
  .input:focus, .select:focus{ border-color: var(--accent-blue); box-shadow: 0 0 0 3px rgba(59,130,246,0.15); }
  .twoCols{ display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  @media (max-width: 520px){ .twoCols{ grid-template-columns: 1fr; } }
  .filterGroup{
    border: 1px solid var(--line);
    border-radius: var(--r14);
    padding: 10px;
    margin-bottom: 12px;
    background: #fff;
  }
  .filterHead{ font-weight: 1000; margin: 0 0 8px 0; font-size: 13px; }
  .toolbar{ display: flex; align-items: center; justify-content: space-between; gap: 12px;
    padding: 10px 12px; border-bottom: 1px solid var(--line);
    flex-wrap: wrap;
  }
  .tabs{ display: flex; gap: 8px; align-items: center; flex-wrap: wrap; position: relative; }
  .tab{
    padding: 8px 14px; border-radius: 999px;
    background: transparent; font-weight: 900; font-size: 12px; cursor: pointer; color: #374151;
    transition: background var(--transition), color var(--transition), transform var(--transition);
    position: relative;
  }
  .tab:hover{ color: var(--accent-blue); transform: translateY(-1px); }
  .tabActive{
    background: var(--accent-blue); color: #fff !important;
    font-weight: 1000;
  }
  .resultsBody{ padding: 12px; }
  .resultsMeta{ display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:10px; flex-wrap:wrap; }
  .list{ display: grid; gap: 12px; }
  /* NEW/IMPROVED CARD STYLES START HERE (replaces your old .cardRow, .media, etc.) */
  .cardRow, .cardTile {
    background: #ffffff;
    border-radius: 20px;
    overflow: hidden;
    border: 1px solid #e5e7eb;
    box-shadow: 0 6px 20px rgba(0,0,0,0.08);
    transition: transform 0.22s ease, box-shadow 0.22s ease;
  }
  .cardRow:hover, .cardTile:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 28px rgba(0,0,0,0.12);
  }
  .media, .tileMedia {
    position: relative;
    background: #f8fafc;
    aspect-ratio: 4/3;          /* better proportions for cars */
    overflow: hidden;
  }
  .media img, .tileMedia img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
  }
  .media:hover img, .tileMedia:hover img {
    transform: scale(1.06);
  }
  .tagFeatured {
    position: absolute;
    top: 12px;
    left: 12px;
    background: #eab308;
    color: #1e293b;
    font-weight: 800;
    font-size: 11px;
    padding: 5px 11px;
    border-radius: 999px;
    box-shadow: 0 3px 10px rgba(234,179,8,0.4);
  }
  .tagStatus{
    position:absolute; bottom:10px; left:10px;
    background: rgba(255,255,255,0.90);
    color:#111; font-weight:1000; font-size:12px;
    padding:6px 10px; border-radius:999px; border:1px solid var(--line);
  }
  .tagSold{ background: rgba(239,68,68,0.92); color:#fff; border-color: rgba(239,68,68,0.25); }
  .tagPaused{ background: rgba(245,158,11,0.20); border-color: rgba(245,158,11,0.28); }
  .info{ padding:12px; display:flex; flex-direction:column; gap:10px; }
  .price {
    font-size: 22px;           /* bigger & bolder */
    font-weight: 900;
    color: #009E60;
    letter-spacing: -0.5px;
  }
  .title {
    font-size: 16px;
    font-weight: 800;
    color: #111827;
    margin: 4px 0 6px;
  }
  .metaRow {
    font-size: 13px;
    color: #6b7280;
    font-weight: 600;
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
  .metaDot{ width:4px; height:4px; border-radius:999px; background:#cfd4dc; margin-top:6px; }
  .actionsRow {
    margin-top: 12px;
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
  .btnCall, .btnWhats, .btnMini {
    padding: 9px 16px;
    border-radius: 12px;
    font-size: 13px;
    font-weight: 700;
    border: 1px solid #d1d5db;
    background: #ffffff;
  }
  .btnCall:hover, .btnWhats:hover{ background: #f9fafb; border-color: #9ca3af; }
  .btnCall:disabled, .btnWhats:disabled{ opacity: 0.55; cursor: not-allowed; }
  .expandBox{ margin-top:6px; padding-top:10px; border-top:1px dashed var(--line); display:grid; gap:10px; animation: fadeIn 0.3s ease; }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .pillWrap{ display:flex; gap:8px; flex-wrap:wrap; }
  .pill{ border:1px solid var(--line); border-radius:999px; padding:6px 10px; background:#fafafa; display:flex; gap:8px; align-items:baseline; }
  .pillLabel{ font-size:11px; color: var(--muted2); }
  .pillValue{ font-size:12px; font-weight:1000; color: var(--txt); }
  .detailsBox{ border:1px solid var(--line); border-radius:14px; overflow:hidden; background:#fff; }
  .detailsGrid{ display:grid; grid-template-columns:1fr 1fr; }
  @media (max-width: 640px){ .detailsGrid{ grid-template-columns: 1fr; } }
  .cell{ padding:10px; border-bottom:1px solid var(--line); border-right:1px solid var(--line); }
  .cell:nth-child(2n){ border-right: none; }
  @media (max-width: 640px){ .cell{ border-right: none; } }
  .cellLabel{ font-size:11px; color: var(--muted2); font-weight:900; }
  .cellValue{ margin-top:3px; font-weight:1000; font-size:13px; }
  .noticeSold{
    padding: 10px; border-radius: 12px;
    background: rgba(239,68,68,0.10);
    border: 1px solid rgba(239,68,68,0.20);
    font-size: 12px; color: #b91c1c;
  }
  .gridCards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
    padding: 0 8px;
  }
  @media (max-width: 640px) {
    .gridCards {
      grid-template-columns: 1fr;
      gap: 20px;
    }
    .tileMedia {
      aspect-ratio: 16/10;
    }
  }
  .err{
    margin-top: 12px; padding: 10px 12px; border-radius: 12px;
    background: rgba(239,68,68,0.10);
    border: 1px solid rgba(239,68,68,0.22);
    box-shadow: 0 10px 18px rgba(0,0,0,0.05);
    animation: fadeIn 0.3s ease;
  }
  .listBox{
    max-height: 300px; overflow-y: auto;
    border: 1px solid var(--line);
    border-radius: var(--r12);
    background: #fff;
    padding: 4px 0;
  }
  .listItem{
    padding: 10px 14px;
    display:flex; justify-content:space-between; align-items:center;
    cursor:pointer; transition: background var(--transition);
  }
  .listItem:hover{ background: rgba(59,130,246,0.08); }
  .listItemActive{
    background: rgba(59,130,246,0.15);
    font-weight: 1000;
    color: var(--accent-blue);
  }
  .count{
    font-size: 12px; color: var(--muted);
    background: var(--bg);
    padding: 2px 8px; border-radius: 6px;
    min-width: 28px; text-align:center;
  }
  .verifyDropdown{
    background:#fff;
    border:1px solid var(--line);
    border-radius: 14px;
    box-shadow: 0 16px 40px rgba(0,0,0,0.12);
    overflow:hidden;
    animation: fadeIn 0.3s ease;
  }
  .verifyDropHead{
    display:flex; align-items:center; justify-content:space-between; gap:10px;
    padding: 10px 12px;
    border-bottom: 1px solid var(--line);
    background:#fff;
  }
  .verifyDropBody{
    padding: 12px;
    max-height: 70vh;
    overflow:auto;
  }
  .checkRow{
    display:flex;
    align-items:center;
    gap:10px;
    padding: 8px 6px;
    cursor:pointer;
    border-radius: 10px;
    transition: background var(--transition);
  }
  .checkRow:hover{ background: rgba(59,130,246,0.06); }
  .checkLabel{ display:flex; align-items:center; gap:8px; font-weight:900; color:#374151; font-size:13px; }
  input[type="checkbox"],
  .chk {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    width: 16px;
    height: 16px;
    border: 2px solid #cfd4dc;
    border-radius: 4px;
    background: #ffffff;
    cursor: pointer;
    display: inline-grid;
    place-content: center;
    transition: background var(--transition), border-color var(--transition);
  }
  input[type="checkbox"]:checked,
  .chk:checked {
    background: #3b82f6;
    border-color: #3b82f6;
  }
  input[type="checkbox"]:checked::after,
  .chk:checked::after {
    content: "✓";
    color: #fff;
    font-size: 12px;
    font-weight: 900;
  }
  /* ✅ MOBILE FILTER DRAWER */
  .drawerOverlay{
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.45);
    z-index: 9998;
    animation: fadeIn 0.3s ease;
  }
  .drawer{
    position: fixed;
    top: 0; bottom: 0; left: 0;
    width: min(92vw, 420px);
    background: var(--bg);
    z-index: 9999;
    box-shadow: 18px 0 50px rgba(0,0,0,0.22);
    padding: 12px;
    overflow: auto;
    animation: slideIn 0.3s ease;
  }
  .drawerHead{
    display:flex; align-items:center; justify-content:space-between; gap:10px;
    margin-bottom: 10px;
  }
  .drawerTitle{
    font-weight: 1000;
    font-size: 13px;
    color: #111827;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }
  /* =========================
     ✅ iPhone Native Header + Slide Menu
     ========================= */
  .mobileHeader{
    display:none;
    position: sticky;
    top: 0;
    z-index: 5000;
    background: #fff;
    border-bottom: 1px solid #eee;
    padding: 12px 14px;
    align-items: center;
    justify-content: space-between;
  }
  .mobileLogo{ display:flex; align-items:center; gap:10px; cursor:pointer; }
  .mobileLogoImg{ height: 100px; width:auto; display:block; object-fit:contain; }
  .mobileHeaderActions{ display:flex; align-items:center; gap:10px; }
  .iconBtn{
    font-size: 28px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 6px 10px;
    border-radius: 12px;
    transition: background var(--transition);
  }
  .iconBtn:active{ background: rgba(0,0,0,0.06); }
  .mobileMenuOverlay{
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.40);
    z-index: 9000;
    display: flex;
    animation: fadeIn 0.3s ease;
  }
  .mobileMenu{
    width: 280px;
    max-width: 82vw;
    height: 100%;
    background: #fff;
    padding: 14px;
    animation: slideIn 0.22s ease;
    box-shadow: 18px 0 50px rgba(0,0,0,0.22);
  }
  .mobileMenuTop{
    display:flex;
    align-items:center;
    justify-content:space-between;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
    margin-bottom: 8px;
  }
  @keyframes slideIn{
    from{ transform: translateX(-100%); }
    to{ transform: translateX(0); }
  }
  .menuItem{
    padding: 14px 4px;
    border-bottom: 1px solid #eee;
    font-weight: 900;
    cursor: pointer;
    color: #111827;
    transition: background var(--transition);
  }
  .menuItem:hover{ background: rgba(0,0,0,0.03); }
  .menuItem.danger{ color: #b91c1c; }
  /* Desktop-only helpers */
  .desktopOnly{ display:block; }
  /* ✅ Show mobile header only on iPhone */
  @media (max-width: 640px){
    .mobileHeader{ display:flex; }
    .desktopHeader{ display:none; }
    .desktopOnly{ display:none !important; }
  }
  /* =========================
     MOBILE RESPONSIVE FIXES
     ========================= */
  @media (max-width: 640px){
    .headerInner{ flex-wrap: wrap; gap: 10px; }
    .headerControls{ width: 100%; flex: 1 1 100%; order: 3; gap: 10px; flex-wrap: wrap; }
    .locSelect{ width: 100%; min-width: 0; max-width: none; }
    .searchWrap{ width: 100%; flex: 1 1 100%; }
    .wrap{ padding: 10px; }
    /* Force 1-column layout */
    .grid{ grid-template-columns: 1fr !important; gap: 12px; }
    /* Cards */
    .cardRow{ grid-template-columns: 1fr !important; }
    .media img{ max-height: 220px; }
    .actionsRow{ gap: 10px; }
    .btnCall, .btnWhats, .btnMini{ padding: 10px 12px; font-size: 13px; border-radius: 14px; }
    .listBox{ max-height: 220px; }
    .price{ font-size: 18px; }
    .title{ font-size: 14px; }
    .mutedSm{ font-size: 12px; }
  }
  /* =========================
     🔥 ROTATING PROMO SLIDER
  ========================= */
  .promoSlider {
    width: 100%;
    margin-bottom: 18px;
  }
  .promoSlide {
    background: rgba(255, 255, 255, 0.08); /* semi-transparent white */
    backdrop-filter: blur(16px); /* the "glass" effect */
    -webkit-backdrop-filter: blur(16px); /* Safari support */
    border: 1px solid rgba(255, 255, 255, 0.18); /* subtle border */
    color: #ffffff; /* keep white text */
    /* ... rest remains the same ... */
  }
  .promoTitle {
    font-weight: 1000;
    font-size: 15px;
    margin-bottom: 6px;
  }
  .promoText {
    font-size: 13px;
    opacity: 0.85;
  }
  .promoBtn {
    background: #22c55e;
    border: none;
    padding: 10px 16px;
    border-radius: 14px;
    font-weight: 1000;
    font-size: 12px;
    cursor: pointer;
    color: #0f172a;
    transition: 0.2s ease;
  }
  .promoBtn:hover {
    background: #16a34a;
  }
  .promoDots {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 8px;
  }
  .promoDot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #cbd5e1;
    cursor: pointer;
    transition: 0.2s ease;
  }
  .promoDot.active {
    background: #0f172a;
    transform: scale(1.3);
  }
  /* Mobile */
  @media (max-width: 640px){
    .promoSlide {
      flex-direction: column;
      align-items: flex-start;
    }
    .promoBtn {
      width: 100%;
      margin-top: 10px;
    }
  }
  /* Infinite marquee animation for logos */
  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); } /* Moves half way because we duplicated the list */
  }
  .logo-marquee {
    overflow: hidden;
  }
  .logo-marquee > div {
    display: inline-flex;
    animation: marquee 30s linear infinite; /* 30s = scroll speed, make slower (e.g. 45s) or faster */
  }
  /* Pause on hover (optional - nice touch) */
  .logo-marquee:hover > div {
    animation-play-state: paused;
  }
  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); } /* Moves half-way for loop */
  }
  /* Pause on hover */
  .promoSlide:hover div[style*="animation"] {
    animation-play-state: paused;
  }
`}</style>






























      {/* ✅ MOBILE TOP BAR (iPhone) */}
      <div className="mobileHeader">
        <div
          className="mobileLogo"
          onClick={() => {
            setPageMode("BROWSE");
            setShowMyCars(false);
            setFiltersOpen(false);
            setMobileMenuOpen(false);
            setVerifyOpen(false);
            window.location.reload(); // Refresh page on logo click as requested
          }}
        >
          <img src="/logo.png" alt="CôteCar" className="mobileLogoImg" />
        </div>
        <div className="mobileHeaderActions">
          <button
            className="iconBtn"
            type="button"
            onClick={() => {
              setVerifyOpen(false);
              setFiltersOpen(false);
              setMobileMenuOpen(true);
            }}
            aria-label="Open menu"
            title="Menu"
          >
            ☰
          </button>
        </div>
      </div>








{mobileMenuOpen ? (
  <div 
    className="mobileMenuOverlay" 
    onClick={() => setMobileMenuOpen(false)}
    style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.65)',
      backdropFilter: 'blur(4px)',
      zIndex: 9000,
      display: 'flex',
    }}
  >
    <div 
      className="mobileMenu"
      onClick={e => e.stopPropagation()}
      style={{
        width: '80vw',
        maxWidth: 320,
        height: '100%',
        background: 'rgba(15, 23, 42, 0.78)',           // semi-transparent dark base
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(59, 130, 246, 0.22)',
        boxShadow: '12px 0 40px rgba(0,0,0,0.55)',
        color: '#e0f2fe',
        padding: '24px 16px',
        overflowY: 'auto',
        animation: 'slideIn 0.32s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
      }}>
        <h2 style={{
          fontSize: 24,
          fontWeight: 800,
          background: 'linear-gradient(90deg, #60a5fa, #a5b4fc)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.5px',
        }}>
          CôteCar
        </h2>

        <button
          onClick={() => setMobileMenuOpen(false)}
          style={{
            background: 'rgba(59, 130, 246, 0.18)',
            border: 'none',
            borderRadius: '50%',
            width: 44,
            height: 44,
            fontSize: 26,
            fontWeight: 700,
            color: '#bfdbfe',
            cursor: 'pointer',
            display: 'grid',
            placeItems: 'center',
            boxShadow: '0 4px 12px rgba(59,130,246,0.25)',
          }}
        >
          ×
        </button>
      </div>

      


{/* Menu Items – glowing outlined style */}
<div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
  {[
    { icon: '🔍', label: 'Search filters', action: () => { setFiltersOpen(true); setMobileMenuOpen(false); } },
    { icon: '🚗', label: 'Browse cars', action: () => { setPageMode("BROWSE"); setShowMyCars(false); setMobileMenuOpen(false); } },
    { icon: '➕', label: 'Sell car', action: () => { setPageMode("SELL"); setMobileMenuOpen(false); } },
    { icon: '📄', label: 'My cars', action: () => { setShowMyCars(true); setPageMode("BROWSE"); setMobileMenuOpen(false); } },
    { icon: '👤', label: 'Profile', action: () => { setPageMode("SELL"); setMobileMenuOpen(false); } },
    { icon: '✅', label: 'Verification', action: () => { openVerifyDropdown(); setMobileMenuOpen(false); } },
  ].map((item, index) => (
    <button
      key={index}
      onClick={() => {
        item.action?.();
        if (!item.danger) setMobileMenuOpen(false);
      }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '16px 20px',
        borderRadius: 16,
        background: 'transparent',
        border: `2px solid ${item.danger ? 'rgba(239,68,68,0.4)' : 'rgba(59,130,246,0.45)'}`,
        color: item.danger ? '#fca5a5' : '#bfdbfe',
        fontSize: 16,
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: `0 0 0 0 ${item.danger ? 'rgba(239,68,68,0.0)' : 'rgba(59,130,246,0.0)'}`,
        textAlign: 'left',
      }}
      onMouseEnter={e => {
        if (!item.danger) {
          e.currentTarget.style.borderColor = 'rgba(59,130,246,0.9)';
          e.currentTarget.style.boxShadow = '0 0 20px rgba(59,130,246,0.35)';
          e.currentTarget.style.transform = 'translateX(6px)';
        } else {
          e.currentTarget.style.borderColor = 'rgba(239,68,68,0.9)';
          e.currentTarget.style.boxShadow = '0 0 20px rgba(239,68,68,0.35)';
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = item.danger ? 'rgba(239,68,68,0.4)' : 'rgba(59,130,246,0.45)';
        e.currentTarget.style.boxShadow = '0 0 0 0 transparent';
        e.currentTarget.style.transform = 'translateX(0)';
      }}
      onTouchStart={e => {
        // subtle press feedback on mobile
        e.currentTarget.style.transform = 'scale(0.97)';
      }}
      onTouchEnd={e => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      <span style={{
        fontSize: 24,
        minWidth: 28,
        opacity: 0.9,
        color: item.danger ? '#f87171' : '#93c5fd'
      }}>
        {item.icon}
      </span>
      <span>{item.label}</span>
    </button>
  ))}

  {/* Conditional Logout/Login with reload fix */}
  {user ? (
    <button
      onClick={() => {
        logout();  // clear token
        setUser(null);  // clear state
        setMobileMenuOpen(false);  // close menu
        setErr("Logging out...");

        // Delay + reload for iOS
        setTimeout(() => {
          window.location.replace("/");
        }, 600);
      }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '16px 20px',
        borderRadius: 16,
        background: 'transparent',
        border: '2px solid rgba(239,68,68,0.4)',
        color: '#fca5a5',
        fontSize: 16,
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 0 0 0 rgba(239,68,68,0.0)',
        textAlign: 'left',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(239,68,68,0.9)';
        e.currentTarget.style.boxShadow = '0 0 20px rgba(239,68,68,0.35)';
        e.currentTarget.style.transform = 'translateX(6px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)';
        e.currentTarget.style.boxShadow = '0 0 0 0 transparent';
        e.currentTarget.style.transform = 'translateX(0)';
      }}
      onTouchStart={e => { e.currentTarget.style.transform = 'scale(0.97)'; }}
      onTouchEnd={e => { e.currentTarget.style.transform = 'scale(1)'; }}
    >
      <span style={{
        fontSize: 24,
        minWidth: 28,
        opacity: 0.9,
        color: '#f87171'
      }}>
        🚪
      </span>
      <span>Logout</span>
    </button>
  ) : (
    <button
      onClick={() => {
        setPageMode("SELL");
        setMobileMenuOpen(false);
      }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '16px 20px',
        borderRadius: 16,
        background: 'transparent',
        border: '2px solid rgba(59,130,246,0.45)',
        color: '#bfdbfe',
        fontSize: 16,
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 0 0 0 rgba(59,130,246,0.0)',
        textAlign: 'left',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(59,130,246,0.9)';
        e.currentTarget.style.boxShadow = '0 0 20px rgba(59,130,246,0.35)';
        e.currentTarget.style.transform = 'translateX(6px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(59,130,246,0.45)';
        e.currentTarget.style.boxShadow = '0 0 0 0 transparent';
        e.currentTarget.style.transform = 'translateX(0)';
      }}
      onTouchStart={e => { e.currentTarget.style.transform = 'scale(0.97)'; }}
      onTouchEnd={e => { e.currentTarget.style.transform = 'scale(1)'; }}
    >
      <span style={{
        fontSize: 24,
        minWidth: 28,
        opacity: 0.9,
        color: '#93c5fd'
      }}>
        🔑
      </span>
      <span>Login / Register</span>
    </button>
  )}
</div>

/* Optional small footer / legal */
<div style={{
  marginTop: 'auto',
  paddingTop: 24,
  fontSize: 12,
  color: 'rgba(203,213,225,0.6)',
  textAlign: 'center',
}}>

















        CôteCar © {new Date().getFullYear()}
      </div>
    </div>
  </div>
) : null}





































      {/* ✅ DESKTOP HEADER (kept) */}
      <div className="header desktopHeader">
        <div className="headerInner">
          <div
            className="logo"
            style={{ cursor: "pointer" }}
            onClick={() => {
              setPageMode("BROWSE");
              setShowMyCars(false);
              setFiltersOpen(false);
              setMobileMenuOpen(false);
              setVerifyOpen(false);
              window.location.reload(); // Refresh page on logo click as requested
            }}
          >
            <img src="/logo.png" alt="CôteCar" className="logoImg" />
          </div>
          <div className="headerControls">
            <select className="select locSelect" value={locationCity} onChange={(e) => setLocationCity(e.target.value)} title="Location">
              <option value="">All locations</option>
              {cities.map((c, i) => (
                <option key={`${c}-${i}`} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <div className="searchWrap">
              <input className="searchInput" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find cars, brands, models..." />
              {q ? (
                <button type="button" className="clearBtn" onClick={() => setQ("")} aria-label="Clear search" title="Clear">
                  ×
                </button>
              ) : null}
            </div>
          </div>
          {/* ✅ DESKTOP: Filters button stays */}
          {pageMode === "BROWSE" ? (
            <button className="btn" onClick={() => { setMobileMenuOpen(false); setFiltersOpen(true); setVerifyOpen(false); }} type="button" title="Filters">
              Filters
            </button>
          ) : null}








{isLoggedIn ? (
  <div style={{ position: 'relative' }}>
    <button
      className="btn btnGhost"
      onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
      title="Account"
      type="button"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 16px',
        borderRadius: 999,
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(0,158,96,0.1)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,158,96,0.2)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Avatar Circle */}
      <div style={{
        width: 36,
        height: 36,
        borderRadius: '50%',
        background: profile.fullName ? '#009E60' : '#6b7280',
        color: 'white',
        fontWeight: 800,
        fontSize: 15,
        display: 'grid',
        placeItems: 'center',
        border: '2px solid #009E60',
        boxShadow: '0 2px 8px rgba(0,158,96,0.25)',
      }}>
        {profile.fullName?.[0]?.toUpperCase() || 'U'}
      </div>

      {/* Name or "Account" */}
      <span style={{ fontWeight: 600, color: '#111827', fontSize: 15 }}>
        {profile.fullName?.split(' ')[0] || 'Account'}
      </span>

      {/* Chevron */}
      <span style={{ fontSize: 12, color: '#6b7280' }}>▼</span>
    </button>

    {/* Dropdown Menu */}
    {profileDropdownOpen && (
      <div style={{
        position: 'absolute',
        top: '100%',
        right: 0,
        marginTop: 12,
        background: '#ffffff',
        borderRadius: 16,
        boxShadow: '0 12px 32px rgba(0,0,0,0.18)',
        border: '1px solid #e5e7eb',
        minWidth: 240,
        zIndex: 100,
        overflow: 'hidden',
        animation: 'fadeIn 0.2s ease',
      }}>
        {/* Header */}
        <div style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>{profile.fullName || 'User'}</div>
          <div style={{ fontSize: 13, color: '#6b7280' }}>{user.email}</div>
        </div>

        {/* Items */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <button
            className="btn btnGhost"
            onClick={() => {
              setPageMode("BROWSE");
              setProfileDropdownOpen(false);
            }}
            style={dropdownItemStyle}
          >
            Browse
          </button>
          <button
            className="btn btnGhost"
            onClick={() => {
              setPageMode("SELL");
              setProfileDropdownOpen(false);
            }}
            style={dropdownItemStyle}
          >
            + Sell
          </button>
          <button
            className="btn btnGhost"
            ref={verifyBtnRef}
            onClick={() => {
              openVerifyDropdown();
              setProfileDropdownOpen(false);
            }}
            style={dropdownItemStyle}
          >
            Verify
          </button>
          <button
            className="btn btnGhost"
            onClick={() => {
              setPageMode("SELL"); // Assuming profile is in SELL mode
              setProfileDropdownOpen(false);
            }}
            style={dropdownItemStyle}
          >
            Profile
          </button>
          <button
            className="btn btnGhost"
            onClick={() => {
              setPageMode("BROWSE");
              setShowMyCars(true);
              setProfileDropdownOpen(false);
            }}
            style={dropdownItemStyle}
          >
            My Cars
          </button>
          <div style={{ height: 1, background: '#e5e7eb', margin: '4px 0' }} />
          <button
            className="btn btnGhost"
            onClick={() => {
              onLogout();
              setProfileDropdownOpen(false);
            }}
            style={{ ...dropdownItemStyle, color: '#ef4444' }}
          >
            Logout
          </button>
        </div>
      </div>
    )}
  </div>
) : (
  <button
    className="btn btnPrimary btnSell"
    onClick={() => setPageMode("SELL")}
    title="Sign in or Sell"
    type="button"
    style={{
      padding: '12px 24px',
      borderRadius: 999,
      background: '#009E60',
      color: 'white',
      fontWeight: 700,
      fontSize: 15,
      border: 'none',
      boxShadow: '0 4px 14px rgba(0,158,96,0.3)',
      transition: 'all 0.2s ease',
    }}
    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
  >
    Sign in / Sell
  </button>
)}





















        </div>
      </div>
      {/* ✅ MOBILE FILTER DRAWER */}
      {filtersOpen && pageMode === "BROWSE" ? (
        <>
          <div className="drawerOverlay" onClick={() => setFiltersOpen(false)} />
          <div className="drawer" role="dialog" aria-modal="true">
            <div className="drawerHead">
              <div className="drawerTitle">Filters</div>
              <button className="btnMini" type="button" onClick={() => setFiltersOpen(false)}>
                ×
              </button>
            </div>
            <FiltersPanel />
            <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
              <button className="btn btnGhost" type="button" onClick={clearAllFilters}>
                Clear
              </button>
              <button className="btn btnPrimary" type="button" onClick={() => setFiltersOpen(false)}>
                Apply
              </button>
            </div>
          </div>
        </>
      ) : null}
      {/* Verify Dropdown */}
      {verifyOpen ? (
        <div
          ref={verifyDropRef}
          className="verifyDropdown"
          style={{
            position: "fixed",
            top: verifyPos.top,
            left: verifyPos.left,
            width: verifyPos.width,
            zIndex: 9999,
          }}
        >
          <div className="verifyDropHead">
            <b>Seller Verification</b>
            <button className="btnMini" onClick={() => setVerifyOpen(false)} type="button">
              ×
            </button>
          </div>
          <div className="verifyDropBody">
            <div className="filterHead">Verification Status</div>
            {profile.verificationStatus === "VERIFIED" ? (
              <div style={{ padding: 10, background: "#e8f5e9", color: "#2e7d32", borderRadius: 12 }}>Verified ✅</div>
            ) : profile.verificationStatus === "PENDING" ? (
              <div style={{ padding: 10, background: "#fff3e0", color: "#ef6c00", borderRadius: 12 }}>Pending review...</div>
            ) : profile.verificationStatus === "REJECTED" ? (
              <div style={{ padding: 10, background: "#ffebee", color: "#c62828", borderRadius: 12 }}>
                Rejected: {profile.verificationNote || "No note provided."}
              </div>
            ) : (
              <div style={{ padding: 10, background: "#e3f2fd", color: "#1565c0", borderRadius: 12 }}>Not submitted</div>
            )}
            {profile.verificationStatus !== "PENDING" && profile.verificationStatus !== "VERIFIED" ? (
              <>
                <div className="filterHead" style={{ marginTop: 12 }}>
                  Submit Verification
                </div>
                <form onSubmit={onSubmitVerification} style={{ display: "grid", gap: 10 }}>
                  <div className="field">
                    <div className="label">Upload ID</div>
                    <input type="file" accept="image/*" onChange={(e) => setIdPhoto(e.target.files?.[0] || null)} required />
                  </div>
                  <div className="field">
                    <div className="label">Upload Selfie (Holding ID)</div>
                    <input type="file" accept="image/*" onChange={(e) => setSelfiePhoto(e.target.files?.[0] || null)} required />
                  </div>
                  <button type="submit" className="btn btnPrimary" disabled={verificationBusy}>
                    {verificationBusy ? "Submitting..." : "Submit"}
                  </button>
                </form>
              </>
            ) : null}
            {/* Admin section */}
            {isAdmin ? (
              <div style={{ marginTop: 14 }}>
                <div className="filterHead">Admin Review</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
                  {["PENDING", "VERIFIED", "REJECTED"].map((s) => (
                    <button
                      key={s}
                      className="btnMini"
                      type="button"
                      onClick={async () => {
                        setAdminStatus(s);
                        await loadAdminVerifications(s);
                      }}
                      disabled={adminBusy}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                {adminMsg ? (
                  <div className="mutedSm" style={{ marginBottom: 8 }}>
                    {adminMsg}
                  </div>
                ) : null}
                {adminBusy ? (
                  <div className="mutedSm">Loading…</div>
                ) : adminVerifs.length === 0 ? (
                  <div className="mutedSm">No items.</div>
                ) : (
                  <div style={{ display: "grid", gap: 10 }}>
                    {adminVerifs.slice(0, 20).map((v) => (
                      <div key={v.id} style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 10 }}>
                        <div style={{ fontWeight: 1000 }}>User ID: {v.userId}</div>
                        <div className="mutedSm">Status: {v.status}</div>
                        <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                          <button className="btnMini" type="button" onClick={() => adminReview(v.id, "VERIFIED")}>
                            Approve ✅
                          </button>
                          <button className="btnMini" type="button" onClick={() => adminReview(v.id, "REJECTED")}>
                            Reject ❌
                          </button>
                        </div>
                      </div>
                    ))}
                    <div className="mutedSm">Showing first 20.</div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}





{/* Body */}
      <div className="wrap">

{/* 🔥 PROMO BANNER - IMPROVED */}
<div className="promoSlider">
  <div className="promoSlide">
    <div style={{ flex: 1 }}>
      
     
      
      {/* Infinite auto-scrolling marquee */}
      <div 
        className="logo-marquee"
        style={{
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          width: '100%',
        }}
      >
        <div 
          style={{
            display: 'inline-flex',
            gap: 40,
            animation: 'marquee 30s linear infinite', // 30s = speed, adjust as needed
          }}
        >
          {/* Duplicate logos twice for seamless infinite loop */}
          {[...promoSlides[0].logos, ...promoSlides[0].logos].map((logoUrl, idx) => (
            <img
              key={idx}
              src={logoUrl}
              alt="Brand logo"
              style={{
                height: 80,
                width: 'auto',
                objectFit: 'contain',
                filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.15))',
              }}
            />
          ))}
        </div>
      </div>
    </div>

   </div>
</div>





        {err ? (
          <div className="err">
            <b>{err}</b>
          </div>
        ) : null}
        {/* SELL */}
        {pageMode === "SELL" ? (
          <div className="grid" style={{ gridTemplateColumns: "1fr", maxWidth: 900, margin: "0 auto" }}>
            <div className="panel">
              <div className="panelHead">
                <h3 className="panelTitle">Sell on CôteCar</h3>
                {isLoggedIn ? (
                  <div className="smallNote">
                    Logged in as <b>{user?.email || "—"}</b>
                  </div>
                ) : (
                  <div className="smallNote">Login or Register to post</div>
                )}
              </div>
              <div className="panelBody">
                {isLoggedIn ? (
                  <>
                    {/* Seller Profile */}
                    <div className="filterGroup">
                      <div className="filterHead">Seller Profile</div>
                      <form onSubmit={saveProfile} style={{ display: "grid", gap: 10, maxWidth: 560 }}>
                        <input className="input" value={profile.fullName} onChange={(e) => setProfile((p) => ({ ...p, fullName: e.target.value }))} placeholder="Full name (ex: Hussein Kaoun)" />
                        <div className="twoCols">
  <div className="field">
    <div className="label">Phone</div>
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <select className="select" value={selectedPhoneCode} onChange={(e) => setSelectedPhoneCode(e.target.value)} style={{ minWidth: 100 }}>
        {COUNTRY_CODES.map(({ code, countries }) => (
          <option key={code} value={code}>
            {code} ({countries})
          </option>
        ))}
      </select>
      <input
        className="input"
        inputMode="numeric"
        pattern="[0-9]*"
        value={phoneLocal}
        onChange={(e) => {
          const v = normalizeLocalPhone(e.target.value);
          setPhoneLocal(v);
          setProfile((p) => ({ ...p, phone: buildFullPhone(selectedPhoneCode, v) }));
        }}
        placeholder="enter local number"
      />
    </div>
    <div className="mutedSm" style={{ marginTop: 6 }}>
      Saved as: <b>{buildFullPhone(selectedPhoneCode, phoneLocal) || "—"}</b>
    </div>
  </div>
  <div className="field">
    <div className="label">WhatsApp</div>
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <select className="select" value={selectedWhatsCode} onChange={(e) => setSelectedWhatsCode(e.target.value)} style={{ minWidth: 100 }}>
        {COUNTRY_CODES.map(({ code, countries }) => (
          <option key={code} value={code}>
            {code} ({countries})
          </option>
        ))}
      </select>
      <input
        className="input"
        inputMode="numeric"
        pattern="[0-9]*"
        value={whatsLocal}
        onChange={(e) => {
          const v = normalizeLocalPhone(e.target.value);
          setWhatsLocal(v);
          setProfile((p) => ({ ...p, whatsapp: buildFullPhone(selectedWhatsCode, v) }));
        }}
        placeholder="enter local number"
      />
    </div>
    <div className="mutedSm" style={{ marginTop: 6 }}>
      Saved as: <b>{buildFullPhone(selectedWhatsCode, whatsLocal) || "—"}</b>
    </div>
  </div>
</div>













                        <select className="select" value={profile.city} onChange={(e) => setProfile((p) => ({ ...p, city: e.target.value }))}>
                          <option value="">Select City</option>
                          {cities.map((c, i) => (
                            <option key={`${c}-${i}`} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                        <select className="select" value={profile.sellerType} onChange={(e) => setProfile((p) => ({ ...p, sellerType: e.target.value }))}>
                          <option value="PRIVATE">Private Seller</option>
                          <option value="DEALER">Dealer</option>
                        </select>
                        <input className="input" value={profile.address} onChange={(e) => setProfile((p) => ({ ...p, address: e.target.value }))} placeholder="Seller Address (ex: Cocody Angré, Abidjan)" />
                        <div className="twoCols">
                          <input className="input" value={profile.lat} onChange={(e) => setProfile((p) => ({ ...p, lat: e.target.value }))} placeholder="Seller Latitude (ex: 5.3599)" />
                          <input className="input" value={profile.lng} onChange={(e) => setProfile((p) => ({ ...p, lng: e.target.value }))} placeholder="Seller Longitude (ex: -4.0083)" />
                        </div>
                        <button type="submit" disabled={savingProfile} className="btn btnPrimary">
                          {savingProfile ? "Saving..." : "Save Profile"}
                        </button>
                      </form>
                    </div>
                    {/* Create Car */}
                    <div className="filterGroup">
                      <div className="filterHead">Create Car</div>
                      <form onSubmit={onCreateCar} style={{ display: "grid", gap: 10 }}>
                        <div className="field">
                          <div className="label">Brand</div>
                          <select className="select" value={createForm.brand} onChange={(e) => setCreateForm((p) => ({ ...p, brand: e.target.value }))} required>
                            <option value="">Select Brand</option>
                            {makes.map((m) => (
                              <option key={m} value={m}>
                                {m}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="twoCols">
                          <div className="field">
                            <div className="label">Year</div>
                            <select className="select" value={createForm.year} onChange={(e) => setCreateForm((p) => ({ ...p, year: e.target.value }))} required>
                              <option value="">Select Year</option>
                              {years.map((y) => (
                                <option key={y} value={y}>
                                  {y}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="field">
                            <div className="label">Model</div>
                            <select
                              className="select"
                              value={createForm.model}
                              onChange={(e) => setCreateForm((p) => ({ ...p, model: e.target.value }))}
                              required
                              disabled={!createForm.brand}
                            >
                              {!createForm.brand ? <option value="">Select Brand first</option> : <option value="">Select Model</option>}
                              {models.map((mm) => (
                                <option key={mm} value={mm}>
                                  {mm}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="twoCols">
                          <div className="field">
                            <div className="label">Fuel</div>
                            <select className="select" value={createForm.fuel} onChange={(e) => setCreateForm((p) => ({ ...p, fuel: e.target.value }))} required>
                              <option value="">Select Fuel</option>
                              {fuels.map((f) => (
                                <option key={f} value={f}>
                                  {f}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="field">
                            <div className="label">Price (CFA)</div>
                            <input className="input" value={createForm.price} onChange={(e) => setCreateForm((p) => ({ ...p, price: e.target.value }))} placeholder="Type price" type="number" required />
                          </div>
                        </div>
                        <div className="twoCols">
                          <div className="field">
                            <div className="label">Mileage (km)</div>
                            <input className="input" value={createForm.mileage} onChange={(e) => setCreateForm((p) => ({ ...p, mileage: e.target.value }))} placeholder="ex: 99000" type="number" />
                          </div>
                          <div className="field">
                            <div className="label">Condition</div>
                            <select className="select" value={createForm.condition} onChange={(e) => setCreateForm((p) => ({ ...p, condition: e.target.value }))}>
                              {conditions.map((cnd) => (
                                <option key={cnd} value={cnd}>
                                  {cnd}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="twoCols">
                          <div className="field">
                            <div className="label">Transmission</div>
                            <select className="select" value={createForm.transmission} onChange={(e) => setCreateForm((p) => ({ ...p, transmission: e.target.value }))}>
                              {transmissions.map((t) => (
                                <option key={t} value={t}>
                                  {t}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="field">
                            <div className="label">Car Type</div>
                            <input className="input" value={createForm.carType} onChange={(e) => setCreateForm((p) => ({ ...p, carType: e.target.value }))} placeholder="SUV, Sedan, Hatchback..." />
                          </div>
                        </div>
                        <div className="field">
                          <div className="label">Color</div>
                          <input className="input" value={createForm.color} onChange={(e) => setCreateForm((p) => ({ ...p, color: e.target.value }))} placeholder="e.g. Black, White, Silver" />
                        </div>
                        <div className="actionsRow">
                          <button type="button" className="btn" onClick={setCarToCurrentLocation}>
                            Use my current location (GPS)
                          </button>
                          <button type="button" className="btn" onClick={setCarToManualLocation}>
                            Enter location manually
                          </button>
                          <span className="mutedSm">Tip: use lat/lng or GPS for precise map</span>
                        </div>
                        <input className="input" value={createForm.address} onChange={(e) => setCreateForm((p) => ({ ...p, address: e.target.value }))} placeholder="Car Address (ex: Cocody Angré, Abidjan)" />
                        <div className="twoCols" style={{ marginTop: 12 }}>
                          <div>
                            <div className="label">Latitude</div>
                            <input className="input" value={createForm.lat} onChange={(e) => setCreateForm((p) => ({ ...p, lat: e.target.value }))} placeholder="ex: 5.3599" type="number" step="any" />
                          </div>
                          <div>
                            <div className="label">Longitude</div>
                            <input className="input" value={createForm.lng} onChange={(e) => setCreateForm((p) => ({ ...p, lng: e.target.value }))} placeholder="ex: -4.0083" type="number" step="any" />
                          </div>
                        </div>
                        {createForm.lat && createForm.lng && !isNaN(Number(createForm.lat)) && !isNaN(Number(createForm.lng)) ? (
                          <div style={{ margin: "20px 0", borderRadius: 12, overflow: "hidden", boxShadow: "0 6px 16px rgba(0,0,0,0.12)" }}>
                            <iframe
                              title="car-location-preview"
                              width="100%"
                              height="320"
                              style={{ border: 0 }}
                              loading="lazy"
                              allowFullScreen
                              referrerPolicy="no-referrer-when-downgrade"
                              src={mapEmbedUrl(Number(createForm.lat), Number(createForm.lng))}
                            />
                            <div style={{ padding: 10, background: "#e8f5e9", fontSize: 14, color: "#2e7d32", textAlign: "center" }}>Location preview — looks correct?</div>
                          </div>
                        ) : createForm.lat || createForm.lng ? (
                          <div style={{ margin: "20px 0", padding: 12, background: "#ffebee", borderRadius: 8, color: "#c62828", fontSize: 14 }}>Please enter valid numbers for both latitude and longitude</div>
                        ) : (
                          <div style={{ margin: "20px 0", padding: 12, background: "#e3f2fd", borderRadius: 8, color: "#1565c0", fontSize: 14 }}>Enter lat/lng or use GPS button to see map preview here</div>
                        )}
                        {/* Photos */}
                        <div className="field" style={{ marginTop: 20 }}>
                          <div className="label">Photos (Upload)</div>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => {
                              setPhotoErr("");
                              const files = Array.from(e.target.files || []);
                              if (files.length > 10) setPhotoErr("Max 10 photos allowed.");
                              setPhotos(files.slice(0, 10));
                            }}
                            style={{ width: "100%" }}
                          />
                          {photoErr ? <div style={{ marginTop: 8, color: "#b42318", fontWeight: 800 }}>{photoErr}</div> : null}
                          {photos.length > 0 ? (
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginTop: 10 }}>
                              {photos.map((file, idx) => {
                                const url = URL.createObjectURL(file);
                                return (
                                  <div key={idx} style={{ position: "relative", borderRadius: 12, overflow: "hidden", border: "1px solid #e6e7ea" }}>
                                    <img
                                      src={url}
                                      alt={`photo-${idx}`}
                                      style={{ width: "100%", height: 110, objectFit: "cover", display: "block" }}
                                      onLoad={() => URL.revokeObjectURL(url)}
                                    />
                                    <button
                                      style={{
                                        position: "absolute",
                                        top: 4,
                                        right: 4,
                                        background: "rgba(255,255,255,0.85)",
                                        border: "none",
                                        borderRadius: "50%",
                                        width: 24,
                                        height: 24,
                                        display: "grid",
                                        placeItems: "center",
                                        cursor: "pointer",
                                        color: "#ef4444",
                                        fontWeight: "bold",
                                      }}
                                      onClick={() => setPhotos((prev) => prev.filter((_, i) => i !== idx))}
                                      title="Remove this photo"
                                      type="button"
                                    >
                                      ×
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          ) : null}
                          {photos.length > 0 ? (
                            <div className="mutedSm" style={{ marginTop: 10 }}>
                              Selected: {photos.map((p) => p.name).join(", ")}
                            </div>
                          ) : null}
                        </div>
                        <button type="submit" className="btn btnPrimary" style={{ marginTop: 16 }} disabled={creatingCar}>
                          {creatingCar ? "Creating..." : "Create Car"}
                        </button>
                      </form>
                    </div>
                    <div className="smallNote">Tip: after creating a car, you can manage it in Browse (status buttons show only for owner/admin).</div>
                  </>
                ) : (
                  <div className="filterGroup">
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                      <div className={`tab ${authTab === "LOGIN" ? "tabActive" : ""}`} onClick={() => setAuthTab("LOGIN")}>
                        Login
                      </div>
                      <div className={`tab ${authTab === "REGISTER" ? "tabActive" : ""}`} onClick={() => setAuthTab("REGISTER")}>
                        Register
                      </div>
                    </div>
                    {authTab === "LOGIN" ? (
                      <>
                        <div className="filterHead">Login</div>
                        <form onSubmit={onLogin} style={{ display: "grid", gap: 10, maxWidth: 420 }}>
                          <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                          <input className="input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />
                          <button type="submit" className="btn btnPrimary" disabled={authBusy}>
                            {authBusy ? "Please wait..." : "Login"}
                          </button>
                          {/* ✅ GOOGLE LOGIN BUTTON */}
                          <button
                            type="button"
                            className="btn"
                            style={{
                              background: "#fff",
                              border: "1px solid #ddd",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 8,
                            }}
                            onClick={() => {
                              window.location.href = `${API_BASE}/auth/google`;
                            }}
                          >
                            <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" style={{ width: 18, height: 18 }} />
                            Continue with Google
                          </button>
                        </form>
                        <div className="smallNote" style={{ marginTop: 10 }}>
                          New seller? Click <b>Register</b>.
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="filterHead">Register</div>
                        <form onSubmit={onRegister} style={{ display: "grid", gap: 10, maxWidth: 520 }}>
                          <input className="input" value={regFullName} onChange={(e) => setRegFullName(e.target.value)} placeholder="Full name (ex: Hussein Kaoun)" required />
                          <input className="input" value={regPhone} onChange={(e) => setRegPhone(e.target.value)} placeholder="Phone (ex: +2250700000000)" required />
                          <input className="input" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} placeholder="Email" required />
                          <input className="input" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} placeholder="Create password" type="password" required />
                          <label style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 4 }}>
                            <input className="chk" type="checkbox" checked={regWantVerify} onChange={(e) => setRegWantVerify(e.target.checked)} />
                            <span style={{ fontSize: 13, fontWeight: 900, color: "#374151" }}>Request verification now (optional)</span>
                          </label>
                          <button type="submit" className="btn btnPrimary" disabled={authBusy}>
                            {authBusy ? "Creating..." : "Create account"}
                          </button>
                          <div className="smallNote">After signup, you will be logged in automatically.</div>
                        </form>
                      </>
                    )}
                    <div className="smallNote" style={{ marginTop: 10 }}>
                      After login/register, you will see Seller Profile + Create Car here.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* BROWSE */
          <div className="grid">
            {/* ✅ DESKTOP Filters column (still shown, but drawer also exists for mobile) */}
            <div className="desktopOnly">
              <FiltersPanel />
            </div>
            {/* Results panel */}
            <div className="panel">




              




<div className="toolbar" style={{
  position: 'sticky',
  top: 0,
  zIndex: 15,
  background: 'rgba(255,255,255,0.96)',
  backdropFilter: 'blur(16px)',
  borderBottom: '1px solid rgba(229,231,235,0.8)',
  padding: '12px 0',
  boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
}}>
  {/* Horizontal scrollable category pills */}
  <div style={{
    display: 'flex',
    overflowX: 'auto',
    gap: 10,
    padding: '0 16px 12px',
    WebkitOverflowScrolling: 'touch',
    scrollbarWidth: 'none',
  }}>
    <style>{`
      .toolbar::-webkit-scrollbar { display: none; }
      .categoryPill {
        padding: 9px 18px;
        border-radius: 999px;
        fontSize: '14px',
        fontWeight: 600,
        whiteSpace: 'nowrap',
        cursor: 'pointer',
        transition: all 0.22s ease;
        border: '1px solid #d1d5db',
        background: 'transparent',
        color: '#374151',
      }
      .categoryPill.active {
        background: '#3b82f6',
        color: 'white',
        borderColor: '#3b82f6',
        boxShadow: '0 2px 8px rgba(59,130,246,0.3)',
      }







/* ... all your existing CSS ... */

/* New additions */
@keyframes slideIn {
  from { transform: translateX(-100%); opacity: 0.7; }
  to   { transform: translateX(0);     opacity: 1;   }
}

/* Make sure the overlay fades in nicely */
.mobileMenuOverlay {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}



    `}</style>


















    {["All", "New", "Used", "Public", "My Cars"].map((label) => {
      const isActive =
        (label === "Public" && !showMyCars) ||
        (label === "My Cars" && showMyCars) ||
        (label !== "Public" && label !== "My Cars" && conditionFilter === label.toUpperCase());

      return (
        <button
          key={label}
          className={`categoryPill ${isActive ? 'active' : ''}`}
          onClick={() => {
            if (label === "Public") setShowMyCars(false);
            else if (label === "My Cars") setShowMyCars(true);
            else setConditionFilter(label.toUpperCase());
          }}
        >
          {label}
        </button>
      );
    })}
  </div>

  {/* View mode + Reload + Sort + Verified – more compact on mobile */}
  <div style={{
    display: 'flex',
    flexWrap: 'wrap',
    gap: 12,
    padding: '0 16px 8px',
    alignItems: 'center',
  }}>
    <div style={{ display: 'flex', gap: 8 }}>
      <button
        onClick={() => setViewMode("LIST")}
        style={{
          padding: '8px 16px',
          borderRadius: 999,
          background: viewMode === "LIST" ? '#3b82f6' : 'transparent',
          color: viewMode === "LIST" ? '#fff' : '#374151',
          border: viewMode === "LIST" ? 'none' : '1px solid #d1d5db',
          fontSize: 13,
          fontWeight: 600,
        }}
      >
        List
      </button>
      <button
        onClick={() => setViewMode("GRID")}
        style={{
          padding: '8px 16px',
          borderRadius: 999,
          background: viewMode === "GRID" ? '#3b82f6' : 'transparent',
          color: viewMode === "GRID" ? '#fff' : '#374151',
          border: viewMode === "GRID" ? 'none' : '1px solid #d1d5db',
          fontSize: 13,
          fontWeight: 600,
        }}
      >
        Grid
      </button>
      <button
        onClick={loadCars}
        style={{
          padding: '8px 16px',
          borderRadius: 999,
          background: loadingCars ? '#e5e7eb' : '#f3f4f6',
          color: '#374151',
          border: '1px solid #d1d5db',
          fontSize: 13,
          fontWeight: 600,
        }}
      >
        {loadingCars ? "..." : "Reload"}
      </button>
    </div>

    <select
      value={sortBy}
      onChange={(e) => setSortBy(e.target.value)}
      style={{
        padding: '9px 14px',
        borderRadius: 12,
        border: '1px solid #d1d5db',
        background: '#fff',
        fontSize: 13,
        color: '#374151',
        minWidth: 160,
      }}
    >
      <option value="NEWEST">Newest first</option>
      <option value="OLDEST">Oldest first</option>
      <option value="PRICE_ASC">Price ↑</option>
      <option value="PRICE_DESC">Price ↓</option>
      <option value="YEAR_DESC">Year ↓</option>
    </select>

    <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#374151', whiteSpace: 'nowrap' }}>
      <input
        type="checkbox"
        checked={verifiedFirst}
        onChange={(e) => setVerifiedFirst(e.target.checked)}
        style={{ width: 16, height: 16, accentColor: '#3b82f6' }}
      />
      Verified first
    </label>
  </div>
</div>




























              <div className="resultsBody">
                <div className="resultsMeta">
                  <div className="mutedSm">
                    Showing <b>{filteredCars.length}</b> ads
                    {locationCity ? (
                      <>
                        {" "}
                        in <b>{locationCity}</b>
                      </>
                    ) : null}
                    {brandFilter ? (
                      <>
                        {" "}
                        • <b>{brandFilter}</b>
                      </>
                    ) : null}
                    {modelFilter ? (
                      <>
                        {" "}
                        • <b>{modelFilter}</b>
                      </>
                    ) : null}
                  </div>
                  <div className="mutedSm">
                    Currency: <b>CFA (XOF)</b>
                  </div>
                </div>
                {filteredCars.length === 0 ? (
                  <div className="muted">No cars match your filters. Try clearing filters.</div>
                ) : viewMode === "GRID" ? (





<div className="gridCards">
  {filteredCars.map((c) => {
    const myId = String(user?.id || user?.userId || "");
    const ownerId = String(c?.ownerId || c?.owner?.id || "");
    const isOwner = !!myId && !!ownerId && myId === ownerId;
    const isAdminNow = String(user?.role || "").toUpperCase() === "ADMIN";
    const canManage = isLoggedIn && (isOwner || isAdminNow);
    const isSold = c?.status === "SOLD";
    const isPaused = c?.status === "PAUSED";
    const isFeat = featuredIds.has(c.id);
    const phone = c.owner?.phone || "";
    const whats = c.owner?.whatsapp || "";
    return (
      <div key={c.id} className="cardTile">
        <div className="tileMedia">
          {isFeat ? <div className="tagFeatured">Featured</div> : null}
          {Array.isArray(c.images) && c.images.length > 0 ? (
            <img src={imgUrl(c.images[0])} alt="car" style={{ cursor: "pointer" }} onClick={() => openLightbox(c, 0)} />
          ) : (
            <div style={{ height: '100%', display: "grid", placeItems: "center", color: "#9aa3af", fontWeight: 900 }}>No photo</div>
          )}
          <div className={`tagStatus ${isSold ? "tagSold" : isPaused ? "tagPaused" : ""}`}>{badgeLabel(c)}</div>
          {Array.isArray(c.images) && c.images.length > 0 && (
            <div style={{ display: "flex", gap: 6, padding: 10, overflowX: "auto", background: 'rgba(255,255,255,0.85)', position: 'absolute', bottom: 0, width: '100%' }}>
              {c.images.map((im, i) => (
                <img
                  key={i}
                  src={imgUrl(im)}
                  alt={`thumb-${i}`}
                  style={{
                    width: 56,
                    height: 44,
                    objectFit: "cover",
                    borderRadius: 10,
                    border: "1px solid #e6e7ea",
                    cursor: "pointer",
                    opacity: i === 0 ? 0.6 : 1,
                  }}
                  onClick={() => openLightbox(c, i)}
                />
              ))}
            </div>
          )}
        </div>
        <div className="tileInfo" style={{ padding: '16px' }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
            <div>
              <div className="price">{formatCFA(c.price)}</div>
              <div className="title">
                {c.title || `${c.brand} ${c.model}`} <span style={{ color: "#6b7280", fontWeight: 900 }}>•</span> {c.year}
              </div>
              {c.owner?.verificationStatus === "VERIFIED" ? (
                <div
                  style={{
                    marginTop: 6,
                    display: "inline-block",
                    background: "#e8f5e9",
                    color: "#2e7d32",
                    padding: "4px 10px",
                    borderRadius: 999,
                    fontSize: 11,
                    fontWeight: 900,
                  }}
                >
                  ✔ Verified Seller
                </div>
              ) : null}
            </div>
            <button
              className="btnMini"
              type="button"
              onClick={() =>
                setExpanded((prev) => {
                  const next = new Set(prev);
                  if (next.has(c.id)) next.delete(c.id);
                  else next.add(c.id);
                  return next;
                })
              }
            >
              {expanded.has(c.id) ? "Hide" : "Details"}
            </button>
          </div>
          <div className="metaRow">
            <span>{c.year || "—"}</span>
            <span className="metaDot" />
            <span>{c.mileage != null && c.mileage !== "" ? `${c.mileage} km` : "— km"}</span>
            <span className="metaDot" />
            <span>{c.fuel || "—"}</span>
          </div>
          <div className="mutedSm">
            {c.owner?.city ? <b>{c.owner.city}</b> : "—"}
            {c.address ? <>• {c.address}</> : null}
          </div>
          <div className="actionsRow">
            <CallButton phone={phone} isSold={isSold} isOwner={isOwner} />
            <WhatsAppButton number={whats || phone} isSold={isSold} isOwner={isOwner} />
            <button
              className="btnMini"
              type="button"
              onClick={() => toggleFavorite(c.id)}
            >
              {isFavorite(c.id) ? "❤️ Saved" : "🤍 Save"}
            </button>
          </div>
          {expanded.has(c.id) ? (
            <div className="expandBox">
              {showSoldLine(c)}
              {isSold && !isOwner ? <div className="noticeSold">✅ SOLD — please do not contact the seller about this car.</div> : null}
              <div>
                <div style={{ fontWeight: 1000, marginBottom: 8 }}>Highlights</div>
                <div className="pillWrap">
                  <InfoPill label="KM" value={c.mileage != null ? `${c.mileage} km` : ""} />
                  <InfoPill label="Cond." value={c.condition} />
                  <InfoPill label="Fuel" value={c.fuel} />
                  <InfoPill label="Gear" value={c.transmission} />
                  <InfoPill label="Type" value={c.carType} />
                  <InfoPill label="Color" value={c.color} />
                </div>
              </div>
              <div className="detailsBox">
                <div className="detailsGrid">
                  <div className="cell">
                    <div className="cellLabel">Brand</div>
                    <div className="cellValue">{labelOrDash(c.brand)}</div>
                  </div>
                  <div className="cell">
                    <div className="cellLabel">Model</div>
                    <div className="cellValue">{labelOrDash(c.model)}</div>
                  </div>
                  <div className="cell">
                    <div className="cellLabel">Car Type</div>
                    <div className="cellValue">{labelOrDash(c.carType)}</div>
                  </div>
                  <div className="cell">
                    <div className="cellLabel">Color</div>
                    <div className="cellValue">{labelOrDash(c.color)}</div>
                  </div>
                  <div className="cell">
                    <div className="cellLabel">Seller Type</div>
                    <div className="cellValue">{labelOrDash(c.owner?.sellerType)}</div>
                  </div>
                  <div className="cell">
                    <div className="cellLabel">City</div>
                    <div className="cellValue">{labelOrDash(c.owner?.city)}</div>
                  </div>
                </div>
              </div>
              {c.lat && c.lng && !isNaN(c.lat) && !isNaN(c.lng) ? (
                <div style={{ display: "grid", gap: 8 }}>
                  <iframe
                    title={`map-${c.id}`}
                    src={mapEmbedUrl(Number(c.lat), Number(c.lng))}
                    width="100%"
                    height="220"
                    style={{ border: 0, borderRadius: 14 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                  <a href={`https://www.google.com/maps?q=${c.lat},${c.lng}`} target="_blank" rel="noreferrer" style={{ fontSize: 13 }}>
                    Open in Google Maps
                  </a>
                </div>
              ) : null}
              {isLoggedIn && canManage ? (
                <div className="actionsRow" style={{ marginTop: 4 }}>
                  <button className="btnMini" disabled={c.status === "SOLD"} onClick={() => setCarStatus(c.id, "SOLD")} type="button">
                    {c.status === "SOLD" ? "Sold ✅" : "Mark Sold"}
                  </button>
                  <button className="btnMini" disabled={c.status === "PAUSED"} onClick={() => setCarStatus(c.id, "PAUSED")} type="button">
                    Delist
                  </button>
                  <button className="btnMini" disabled={c.status === "ACTIVE"} onClick={() => setCarStatus(c.id, "ACTIVE")} type="button">
                    Relist
                  </button>
                  <button className="btnMini" onClick={() => deleteCar(c.id)} type="button">
                    Delete
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    );
  })}
</div>



















 ) : (






<div className="list">
  {filteredCars.map((c) => {
    const myId = String(user?.id || user?.userId || "");
    const ownerId = String(c?.ownerId || c?.owner?.id || "");
    const isOwner = !!myId && !!ownerId && myId === ownerId;
    const isAdminNow = String(user?.role || "").toUpperCase() === "ADMIN";
    const canManage = isLoggedIn && (isOwner || isAdminNow);
    const isSold = c?.status === "SOLD";
    const isPaused = c?.status === "PAUSED";
    const isFeat = featuredIds.has(c.id);
    const phone = c.owner?.phone || "";
    const whats = c.owner?.whatsapp || "";
    return (
      <div key={c.id} className="cardRow">
        <div className="media">
          {isFeat ? <div className="tagFeatured">Featured</div> : null}
          {Array.isArray(c.images) && c.images.length > 0 ? (
            <img
              src={imgUrl(c.images[0])}
              alt="car"
              style={{ cursor: "pointer" }}
              onClick={() => openLightbox(c, 0)}
            />
          ) : (
            <div
              style={{
                height: 220,
                display: "grid",
                placeItems: "center",
                color: "#9aa3af",
                fontWeight: 900,
              }}
            >
              No photo
            </div>
          )}
          {Array.isArray(c.images) && c.images.length > 1 && (
            <div style={{ display: "flex", gap: 6, padding: 10, overflowX: "auto" }}>
              {c.images.map((im, i) => (
                <img
                  key={i}
                  src={imgUrl(im)}
                  alt={`thumb-${i}`}
                  style={{
                    width: 60,
                    height: 46,
                    objectFit: "cover",
                    borderRadius: 10,
                    border: "1px solid #e6e7ea",
                    cursor: "pointer",
                  }}
                  onClick={() => openLightbox(c, i)}
                />
              ))}
            </div>
          )}
          <div className={`tagStatus ${isSold ? "tagSold" : isPaused ? "tagPaused" : ""}`}>
            {badgeLabel(c)}
          </div>
        </div>
        <div className="info" style={{ padding: '16px' }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
            <div>
              <div className="price">{formatCFA(c.price)}</div>
              <div className="title">
                {c.title || `${c.brand} ${c.model}`}{" "}
                <span style={{ color: "#6b7280", fontWeight: 900 }}>•</span> {c.year}
              </div>
              {c.owner?.verificationStatus === "VERIFIED" ? (
                <div
                  style={{
                    marginTop: 6,
                    display: "inline-block",
                    background: "#e8f5e9",
                    color: "#2e7d32",
                    padding: "4px 10px",
                    borderRadius: 999,
                    fontSize: 11,
                    fontWeight: 900,
                  }}
                >
                  ✔ Verified Seller
                </div>
              ) : null}
            </div>
            {/* ✅ ONE Details button (do not duplicate anywhere else) */}
            <button
              className="btnMini"
              type="button"
              onClick={() =>
                setExpanded((prev) => {
                  const next = new Set(prev);
                  if (next.has(c.id)) next.delete(c.id);
                  else next.add(c.id);
                  return next;
                })
              }
            >
              {expanded.has(c.id) ? "Hide details" : "View details"}
            </button>
          </div>
          <div className="metaRow">
            <span>{c.year || "—"}</span>
            <span className="metaDot" />
            <span>{c.mileage != null && c.mileage !== "" ? `${c.mileage} km` : "— km"}</span>
            <span className="metaDot" />
            <span>{c.fuel || "—"}</span>
            <span className="metaDot" />
            <span>{c.transmission || "—"}</span>
          </div>
          <div className="mutedSm">
            {c.owner?.city ? <b>{c.owner.city}</b> : "—"}
            {c.address ? <>• {c.address}</> : null}
          </div>
          <div className="actionsRow">
            <CallButton phone={phone} isSold={isSold} isOwner={isOwner} />
            <WhatsAppButton number={whats || phone} isSold={isSold} isOwner={isOwner} />
            {c.lat && c.lng && !isNaN(c.lat) && !isNaN(c.lng) ? (
              <a
                className="btnMini"
                href={`https://www.google.com/maps?q=${c.lat},${c.lng}`}
                target="_blank"
                rel="noreferrer"
              >
                Map
              </a>
            ) : null}
<button
  className="btnMini"
  type="button"
  onClick={() => toggleFavorite(c.id)}
>
  {isFavorite(c.id) ? "❤️ Saved" : "🤍 Save"}
</button>
          </div>
          {/* ✅ EXPANDED DETAILS (FULL like GRID) */}
          {expanded.has(c.id) ? (
            <div className="expandBox">
              {showSoldLine(c)}
              {isSold && !isOwner ? (
                <div className="noticeSold">✅ SOLD — please do not contact the seller about this car.</div>
              ) : null}
              {/* ✅ Highlights */}
              <div>
                <div style={{ fontWeight: 1000, marginBottom: 8 }}>Highlights</div>
                <div className="pillWrap">
                  <InfoPill label="KM" value={c.mileage != null && c.mileage !== "" ? `${c.mileage} km` : "—"} />
                  <InfoPill label="Cond." value={c.condition || "—"} />
                  <InfoPill label="Fuel" value={c.fuel || "—"} />
                  <InfoPill label="Gear" value={c.transmission || "—"} />
                  <InfoPill label="Type" value={c.carType || "—"} />
                  <InfoPill label="Color" value={c.color || "—"} />
                </div>
              </div>
              {/* ✅ Details grid */}
              <div className="detailsBox">
                <div className="detailsGrid">
                  <div className="cell">
                    <div className="cellLabel">Brand</div>
                    <div className="cellValue">{labelOrDash(c.brand)}</div>
                  </div>
                  <div className="cell">
                    <div className="cellLabel">Model</div>
                    <div className="cellValue">{labelOrDash(c.model)}</div>
                  </div>
                  <div className="cell">
                    <div className="cellLabel">Car Type</div>
                    <div className="cellValue">{labelOrDash(c.carType)}</div>
                  </div>
                  <div className="cell">
                    <div className="cellLabel">Color</div>
                    <div className="cellValue">{labelOrDash(c.color)}</div>
                  </div>
                  <div className="cell">
                    <div className="cellLabel">Seller Type</div>
                    <div className="cellValue">{labelOrDash(c.owner?.sellerType)}</div>
                  </div>
                  <div className="cell">
                    <div className="cellLabel">City</div>
                    <div className="cellValue">{labelOrDash(c.owner?.city)}</div>
                  </div>
                </div>
              </div>
              {/* ✅ Map preview + Open link */}
              {c.lat && c.lng && !isNaN(c.lat) && !isNaN(c.lng) ? (
                <div style={{ display: "grid", gap: 8 }}>
                  <iframe
                    title={`map-${c.id}`}
                    src={mapEmbedUrl(Number(c.lat), Number(c.lng))}
                    width="100%"
                    height="220"
                    style={{ border: 0, borderRadius: 14 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                  <a
                    href={`https://www.google.com/maps?q=${c.lat},${c.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: 13 }}
                  >
                    Open in Google Maps
                  </a>
                </div>
              ) : null}
              {/* ✅ Admin/Owner actions */}
              {isLoggedIn && canManage ? (
                <div className="actionsRow" style={{ marginTop: 4 }}>
                  <button
                    className="btnMini"
                    disabled={c.status === "SOLD"}
                    onClick={() => setCarStatus(c.id, "SOLD")}
                    type="button"
                  >
                    {c.status === "SOLD" ? "Sold ✅" : "Mark Sold"}
                  </button>
                  <button
                    className="btnMini"
                    disabled={c.status === "PAUSED"}
                    onClick={() => setCarStatus(c.id, "PAUSED")}
                    type="button"
                  >
                    Delist
                  </button>
                  <button
                    className="btnMini"
                    disabled={c.status === "ACTIVE"}
                    onClick={() => setCarStatus(c.id, "ACTIVE")}
                    type="button"
                  >
                    Relist
                  </button>
                  <button className="btnMini" onClick={() => deleteCar(c.id)} type="button">
                    Delete </button> </div>) : null} </div>) : null} </div> </div>);
  })} </div>)} </div> </div> </div> )}
{pageMode === "FAVORITES" && (
  <div className="panel">
    <h3 style={{ marginBottom: 12 }}>⭐ My Favorite Cars</h3>
    {favorites.length === 0 ? (
      <div className="mutedSm">No favorites yet.</div>
    ) : (
      <div className="gridCards">
        {cars
          .filter((c) => favorites.includes(c.id))
          .map((c) => (
            <div key={c.id} className="card">
              <div className="media">
                {Array.isArray(c.images) && c.images.length > 0 ? (
                  <img src={imgUrl(c.images[0])} alt="car" />
                ) : (
                  <div style={{ height: 200, display: "grid", placeItems: "center" }}>
                    No photo
                  </div>
                )}
              </div>
              <div className="info">
                <div className="price">{formatCFA(c.price)}</div>
                <div className="title">
                  {c.brand} {c.model} • {c.year}
                </div>
                <div style={{ marginTop: 8 }}>
                  <button
                    className="btnMini"
                    onClick={() => toggleFavorite(c.id)}
                  >
                    ❌ Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    )}
  </div>
)}

















            
        {/* Lightbox */}
        {lightbox.open ? (
          <div
            onClick={closeLightbox}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.75)",
              display: "grid",
              placeItems: "center",
              zIndex: 9999,
              padding: 14,
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "min(980px, 98vw)",
                background: "#fff",
                borderRadius: 16,
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", padding: 10 }}>
                <button className="btnMini" onClick={prevImg} type="button">
                  ◀ Prev
                </button>
                <div style={{ fontWeight: 900 }}>
                  {lightbox.idx + 1} / {lightbox.imgs.length}
                </div>
                <button className="btnMini" onClick={nextImg} type="button">
                  Next ▶
                </button>
              </div>
              <div style={{ background: "#111", position: "relative" }}>
                <img src={lightbox.imgs[lightbox.idx]} alt="large" style={{ width: "100%", maxHeight: "75vh", objectFit: "contain", display: "block" }} />
                <button
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: 15,
                    transform: "translateY(-50%)",
                    background: "rgba(255,255,255,0.3)",
                    border: "none",
                    color: "#fff",
                    fontSize: 32,
                    cursor: "pointer",
                    padding: "10px 15px",
                    borderRadius: "50%",
                  }}
                  onClick={prevImg}
                  type="button"
                >
                  ◀
                </button>
                <button
                  style={{
                    position: "absolute",
                    top: "50%",
                    right: 15,
                    transform: "translateY(-50%)",
                    background: "rgba(255,255,255,0.3)",
                    border: "none",
                    color: "#fff",
                    fontSize: 32,
                    cursor: "pointer",
                    padding: "10px 15px",
                    borderRadius: "50%",
                  }}
                  onClick={nextImg}
                  type="button"
                >
                  ▶
                </button>
              </div>
              <div style={{ display: "flex", gap: 8, padding: 10, overflowX: "auto" }}>
                {lightbox.imgs.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`lb-${i}`}
                    onClick={() => setLightbox((p) => ({ ...p, idx: i }))}
                    style={{
                      width: 70,
                      height: 55,
                      objectFit: "cover",
                      borderRadius: 10,
                      cursor: "pointer",
                      border: i === lightbox.idx ? "2px solid #3b82f6" : "1px solid #e6e7ea",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
