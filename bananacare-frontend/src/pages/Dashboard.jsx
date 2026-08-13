import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Leaf,
    Sprout,
    ScanLine,
    History,
    LogOut,
    LayoutDashboard,
} from "lucide-react";

import { removeToken } from "../services/authService";
import { getMyFarms } from "../services/farmService";
import { getPlantationsByFarm } from "../services/plantationService";
import { getDiagnosisSummary } from "../services/diagnosisService";

import "./Dashboard.css";

function Dashboard() {
    const navigate = useNavigate();

    // =====================================================
    // STATE
    // =====================================================

    const [farms, setFarms] = useState([]);
    const [plantations, setPlantations] = useState([]);

    const [diagnosisCount, setDiagnosisCount] = useState(0);
    const [healthStatus, setHealthStatus] = useState("NO DATA");

    const [latestDiagnosis, setLatestDiagnosis] = useState(null);

    const [loading, setLoading] = useState(true);
    const [dashboardError, setDashboardError] = useState("");

    // =====================================================
    // LOAD DASHBOARD DATA
    // =====================================================

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                setLoading(true);
                setDashboardError("");

                // =================================================
                // 1. GET FARMS
                // =================================================

                const farmData = await getMyFarms();

                const safeFarmData = Array.isArray(farmData)
                    ? farmData
                    : [];

                setFarms(safeFarmData);

                // User has no farms
                if (safeFarmData.length === 0) {
                    setPlantations([]);
                    setDiagnosisCount(0);
                    setHealthStatus("NO DATA");
                    setLatestDiagnosis(null);

                    return;
                }

                // =================================================
                // 2. GET PLANTATIONS FOR ALL FARMS
                // =================================================

                const plantationRequests = safeFarmData.map((farm) =>
                    getPlantationsByFarm(farm.id)
                );

                const plantationResults = await Promise.all(
                    plantationRequests
                );

                const allPlantations = plantationResults
                    .filter(Array.isArray)
                    .flat();

                setPlantations(allPlantations);

                // User has farms but no plantations
                if (allPlantations.length === 0) {
                    setDiagnosisCount(0);
                    setHealthStatus("NO DATA");
                    setLatestDiagnosis(null);

                    return;
                }

                // =================================================
                // 3. GET DIAGNOSIS SUMMARY FOR EVERY PLANTATION
                // =================================================

                const summaryRequests = allPlantations.map(
                    (plantation) =>
                        getDiagnosisSummary(plantation.id)
                );

                const summaries = await Promise.all(
                    summaryRequests
                );

                // =================================================
                // 4. TOTAL DIAGNOSES
                // =================================================

                const totalDiagnoses = summaries.reduce(
                    (total, summary) => {
                        return total + (summary?.totalDiagnoses || 0);
                    },
                    0
                );

                setDiagnosisCount(totalDiagnoses);

                // =================================================
                // 5. OVERALL HEALTH STATUS
                // =================================================

                const statuses = summaries
                    .map(
                        (summary) =>
                            summary?.plantationHealthStatus
                    )
                    .filter(Boolean);

                if (
                    statuses.includes("ATTENTION_REQUIRED")
                ) {
                    setHealthStatus("ATTENTION REQUIRED");
                } else if (
                    statuses.includes("MONITOR")
                ) {
                    setHealthStatus("MONITOR");
                } else if (
                    statuses.includes("GOOD")
                ) {
                    setHealthStatus("GOOD");
                } else if (
                    statuses.includes("HEALTHY")
                ) {
                    setHealthStatus("HEALTHY");
                } else {
                    setHealthStatus("NO DATA");
                }

                // =================================================
                // 6. FIND LATEST DIAGNOSIS
                // =================================================

                const latestDiagnoses = summaries
                    .map(
                        (summary) =>
                            summary?.latestDiagnosis
                    )
                    .filter(Boolean);

                if (latestDiagnoses.length > 0) {
                    latestDiagnoses.sort((a, b) => {
                        return (
                            new Date(b.diagnosedAt) -
                            new Date(a.diagnosedAt)
                        );
                    });

                    setLatestDiagnosis(
                        latestDiagnoses[0]
                    );
                } else {
                    setLatestDiagnosis(null);
                }
            } catch (error) {
                console.error(
                    "Dashboard loading error:",
                    error
                );

                setDashboardError(
                    "Unable to load dashboard data."
                );
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {
        removeToken();

        navigate("/login");
    };

    // =====================================================
    // HEALTH STATUS CLASS
    // =====================================================

    const getHealthStatusClass = () => {
        switch (healthStatus) {
            case "HEALTHY":
                return "health-good";

            case "GOOD":
                return "health-good";

            case "MONITOR":
                return "health-monitor";

            case "ATTENTION REQUIRED":
                return "health-danger";

            default:
                return "health-no-data";
        }
    };

    // =====================================================
    // UI
    // =====================================================

    return (
        <div className="dashboard-page">

            {/* =================================================
          SIDEBAR
      ================================================= */}

            <aside className="sidebar">

                <div className="sidebar-brand">

                    <div className="sidebar-logo">
                        <Leaf size={26} />
                    </div>

                    <div>
                        <h2>BananaCare</h2>
                        <span>Plant Health AI</span>
                    </div>

                </div>

                <nav className="sidebar-nav">

                    <button className="nav-item active">
                        <LayoutDashboard size={20} />
                        Dashboard
                    </button>

                    <button
                        className="nav-item"
                        onClick={() => navigate("/farms")}
                    >
                        <Sprout size={20} />
                        Farms
                    </button>

                    <button
                        className="nav-item"
                        onClick={() => navigate("/diagnose")}
                    >
                        <ScanLine size={20} />
                        Diagnose Leaf
                    </button>

                    <button
                        className="nav-item"
                        onClick={() => navigate("/history")}
                    >
                        <History size={20} />
                        Diagnosis History
                    </button>

                </nav>

                <button
                    className="logout-button"
                    onClick={handleLogout}
                >
                    <LogOut size={20} />
                    Logout
                </button>

            </aside>

            {/* =================================================
          MAIN CONTENT
      ================================================= */}

            <main className="dashboard-main">

                {/* HEADER */}

                <header className="dashboard-header">

                    <div>
                        <h1>Dashboard</h1>

                        <p>
                            Monitor your banana plantations and AI
                            diagnoses.
                        </p>
                    </div>

                    <div className="status-badge">
                        <span className="status-dot"></span>
                        System Online
                    </div>

                </header>

                {/* ERROR */}

                {dashboardError && (
                    <div className="login-error">
                        {dashboardError}
                    </div>
                )}

                {/* =================================================
            WELCOME SECTION
        ================================================= */}

                <section className="welcome-card">

                    <div>

            <span className="welcome-label">
              BANANACARE AI
            </span>

                        <h2>
                            Keep your banana plantation healthy 🍌
                        </h2>

                        <p>
                            Upload banana leaf images and use AI to
                            detect possible diseases early.
                        </p>

                        <button
                            onClick={() =>
                                navigate("/diagnose")
                            }
                        >
                            Diagnose a Leaf
                        </button>

                    </div>

                    <div className="welcome-icon">
                        <Leaf size={80} />
                    </div>

                </section>

                {/* =================================================
            STATISTICS
        ================================================= */}

                <section className="dashboard-stats">

                    {/* FARMS */}

                    <div className="stat-card">

                        <div className="stat-icon">
                            <Sprout size={24} />
                        </div>

                        <div>
                            <span>Total Farms</span>

                            <h3>
                                {loading
                                    ? "..."
                                    : farms.length}
                            </h3>
                        </div>

                    </div>

                    {/* PLANTATIONS */}

                    <div className="stat-card">

                        <div className="stat-icon">
                            <Leaf size={24} />
                        </div>

                        <div>
                            <span>Plantations</span>

                            <h3>
                                {loading
                                    ? "..."
                                    : plantations.length}
                            </h3>
                        </div>

                    </div>

                    {/* DIAGNOSES */}

                    <div className="stat-card">

                        <div className="stat-icon">
                            <ScanLine size={24} />
                        </div>

                        <div>
                            <span>Diagnoses</span>

                            <h3>
                                {loading
                                    ? "..."
                                    : diagnosisCount}
                            </h3>
                        </div>

                    </div>

                    {/* HEALTH STATUS */}

                    <div className="stat-card">

                        <div className="stat-icon">
                            <History size={24} />
                        </div>

                        <div>
                            <span>Health Status</span>

                            <h3
                                className={`health-status ${getHealthStatusClass()}`}
                            >
                                {loading
                                    ? "..."
                                    : healthStatus}
                            </h3>
                        </div>

                    </div>

                </section>

                {/* =================================================
            LOWER DASHBOARD
        ================================================= */}

                <section className="dashboard-content">

                    {/* =================================================
              RECENT DIAGNOSIS
          ================================================= */}

                    <div className="dashboard-panel">

                        <div className="panel-header">

                            <div>
                                <h3>Recent Diagnosis</h3>

                                <p>
                                    Your latest AI leaf analysis
                                </p>
                            </div>

                        </div>

                        {loading ? (

                            <div className="empty-state">

                                <ScanLine size={42} />

                                <h4>Loading diagnosis...</h4>

                                <p>
                                    Fetching your latest AI result.
                                </p>

                            </div>

                        ) : latestDiagnosis ? (

                            <div className="latest-diagnosis">

                                {latestDiagnosis.imageUrl && (

                                    <img
                                        src={`http://localhost:8080${latestDiagnosis.imageUrl}`}
                                        alt="Diagnosed banana leaf"
                                        className="diagnosis-image"
                                    />

                                )}

                                <div className="diagnosis-details">

                  <span>
                    Latest AI Result
                  </span>

                                    <h2>
                                        {latestDiagnosis
                                                .diseaseInfo
                                                ?.displayName ||
                                            latestDiagnosis
                                                .predictedDisease}
                                    </h2>

                                    <p>
                                        Confidence:{" "}

                                        <strong>
                                            {
                                                latestDiagnosis
                                                    .confidencePercentage
                                            }
                                            %
                                        </strong>
                                    </p>

                                    {latestDiagnosis
                                        .diseaseInfo
                                        ?.severity && (

                                        <p>
                                            Severity:{" "}

                                            <strong>
                                                {
                                                    latestDiagnosis
                                                        .diseaseInfo
                                                        .severity
                                                }
                                            </strong>
                                        </p>

                                    )}

                                    <p>
                                        Detected:{" "}

                                        <strong>
                                            {latestDiagnosis.diagnosedAt
                                                ? new Date(
                                                    latestDiagnosis
                                                        .diagnosedAt
                                                ).toLocaleString()
                                                : "N/A"}
                                        </strong>
                                    </p>

                                    <button
                                        onClick={() =>
                                            navigate("/history")
                                        }
                                    >
                                        View Diagnosis History
                                    </button>

                                </div>

                            </div>

                        ) : (

                            <div className="empty-state">

                                <ScanLine size={42} />

                                <h4>
                                    No diagnoses yet
                                </h4>

                                <p>
                                    Diagnose your first banana leaf
                                    to see AI results here.
                                </p>

                            </div>

                        )}

                    </div>

                    {/* =================================================
              QUICK ACTIONS
          ================================================= */}

                    <div className="dashboard-panel">

                        <div className="panel-header">

                            <div>
                                <h3>Quick Actions</h3>

                                <p>
                                    Manage your plantation
                                </p>
                            </div>

                        </div>

                        <div className="quick-actions">

                            {/* FARMS */}

                            <button
                                onClick={() =>
                                    navigate("/farms")
                                }
                            >
                                <Sprout size={22} />

                                <div>
                                    <strong>
                                        Manage Farms
                                    </strong>

                                    <span>
                    Add and view farms
                  </span>
                                </div>

                            </button>

                            {/* DIAGNOSE */}

                            <button
                                onClick={() =>
                                    navigate("/diagnose")
                                }
                            >
                                <ScanLine size={22} />

                                <div>
                                    <strong>
                                        AI Diagnosis
                                    </strong>

                                    <span>
                    Analyse banana leaf
                  </span>
                                </div>

                            </button>

                            {/* HISTORY */}

                            <button
                                onClick={() =>
                                    navigate("/history")
                                }
                            >
                                <History size={22} />

                                <div>
                                    <strong>
                                        View History
                                    </strong>

                                    <span>
                    Previous diagnoses
                  </span>
                                </div>

                            </button>

                        </div>

                    </div>

                </section>

            </main>

        </div>
    );
}

export default Dashboard;