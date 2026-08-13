import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    AlertTriangle,
    ArrowLeft,
    CalendarDays,
    ChevronDown,
    Eye,
    History,
    Leaf,
    ScanLine,
    X,
} from "lucide-react";

import { getMyFarms } from "../services/farmService";
import { getPlantationsByFarm } from "../services/plantationService";

import {
    getDiagnosisHistory,
    getDiagnosisSummary,
} from "../services/diagnosisService";

import "./DiagnosisHistory.css";

function DiagnosisHistory() {
    const navigate = useNavigate();

    const [plantations, setPlantations] = useState([]);
    const [selectedPlantationId, setSelectedPlantationId] =
        useState("");

    const [diagnoses, setDiagnoses] = useState([]);
    const [summary, setSummary] = useState(null);

    const [selectedDiagnosis, setSelectedDiagnosis] =
        useState(null);

    const [loadingPlantations, setLoadingPlantations] =
        useState(true);

    const [loadingHistory, setLoadingHistory] =
        useState(false);

    const [error, setError] = useState("");

    // =====================================================
    // LOAD ALL PLANTATIONS
    // =====================================================

    useEffect(() => {
        const loadPlantations = async () => {
            try {
                setLoadingPlantations(true);
                setError("");

                const farms = await getMyFarms();

                const safeFarms = Array.isArray(farms)
                    ? farms
                    : [];

                if (safeFarms.length === 0) {
                    setPlantations([]);
                    return;
                }

                const requests = safeFarms.map((farm) =>
                    getPlantationsByFarm(farm.id)
                );

                const results = await Promise.all(requests);

                const allPlantations = results
                    .filter(Array.isArray)
                    .flat();

                setPlantations(allPlantations);

                if (allPlantations.length > 0) {
                    setSelectedPlantationId(
                        String(allPlantations[0].id)
                    );
                }
            } catch (err) {
                console.error(
                    "Loading plantations failed:",
                    err
                );

                setError(
                    err.response?.data?.message ||
                    "Unable to load plantations."
                );
            } finally {
                setLoadingPlantations(false);
            }
        };

        loadPlantations();
    }, []);

    // =====================================================
    // LOAD DIAGNOSIS HISTORY
    // =====================================================

    useEffect(() => {
        if (!selectedPlantationId) {
            setDiagnoses([]);
            setSummary(null);
            return;
        }

        const loadHistory = async () => {
            try {
                setLoadingHistory(true);
                setError("");

                const [historyData, summaryData] =
                    await Promise.all([
                        getDiagnosisHistory(
                            selectedPlantationId
                        ),

                        getDiagnosisSummary(
                            selectedPlantationId
                        ),
                    ]);

                setDiagnoses(
                    Array.isArray(historyData)
                        ? historyData
                        : []
                );

                setSummary(summaryData || null);
            } catch (err) {
                console.error(
                    "Loading diagnosis history failed:",
                    err
                );

                setDiagnoses([]);
                setSummary(null);

                setError(
                    err.response?.data?.message ||
                    "Unable to load diagnosis history."
                );
            } finally {
                setLoadingHistory(false);
            }
        };

        loadHistory();
    }, [selectedPlantationId]);

    // =====================================================
    // DISABLE BODY SCROLL WHEN MODAL OPEN
    // =====================================================

    useEffect(() => {
        if (selectedDiagnosis) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [selectedDiagnosis]);

    // =====================================================
    // ESC KEY CLOSE MODAL
    // =====================================================

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (
                event.key === "Escape" &&
                selectedDiagnosis
            ) {
                setSelectedDiagnosis(null);
            }
        };

        window.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {
            window.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, [selectedDiagnosis]);

    // =====================================================
    // IMAGE URL
    // =====================================================

    const getImageUrl = (diagnosis) => {
        if (!diagnosis?.imageUrl) {
            return null;
        }

        if (
            diagnosis.imageUrl.startsWith(
                "http://"
            ) ||
            diagnosis.imageUrl.startsWith(
                "https://"
            )
        ) {
            return diagnosis.imageUrl;
        }

        return `http://localhost:8080${diagnosis.imageUrl}`;
    };

    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (date) => {
        if (!date) {
            return "N/A";
        }

        return new Date(date).toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }
        );
    };

    // =====================================================
    // DISEASE NAME
    // =====================================================

    const getDiseaseName = (diagnosis) => {
        return (
            diagnosis?.diseaseInfo?.displayName ||
            diagnosis?.predictedDisease ||
            "Unknown"
        );
    };

    // =====================================================
    // SEVERITY
    // =====================================================

    const getSeverity = (diagnosis) => {
        return (
            diagnosis?.diseaseInfo?.severity ||
            "N/A"
        );
    };

    const selectedPlantation =
        plantations.find(
            (plantation) =>
                String(plantation.id) ===
                String(selectedPlantationId)
        );

    // =====================================================
    // CLOSE MODAL
    // =====================================================

    const closeModal = () => {
        setSelectedDiagnosis(null);
    };

    // =====================================================
    // UI
    // =====================================================

    return (
        <div className="history-page">

            {/* ================= HEADER ================= */}

            <header className="history-header">

                <div className="history-header-left">

                    <button
                        className="history-back-button"
                        onClick={() =>
                            navigate("/dashboard")
                        }
                        type="button"
                    >
                        <ArrowLeft size={20} />
                    </button>

                    <div className="history-logo">
                        <History size={25} />
                    </div>

                    <div>
                        <h1>Diagnosis History</h1>

                        <p>
                            Review previous BananaCare AI
                            leaf diagnoses.
                        </p>
                    </div>

                </div>

                <button
                    className="new-diagnosis-button"
                    type="button"
                    onClick={() => {
                        if (selectedPlantationId) {
                            navigate(
                                `/diagnose?plantationId=${selectedPlantationId}`
                            );
                        } else {
                            navigate("/diagnose");
                        }
                    }}
                >
                    <ScanLine size={18} />
                    New Diagnosis
                </button>

            </header>

            {/* ================= ERROR ================= */}

            {error && (
                <div className="history-error">

                    <AlertTriangle size={19} />

                    {error}

                </div>
            )}

            {/* ================= FILTER ================= */}

            <section className="history-filter-card">

                <div>

                    <label>
                        Select Plantation
                    </label>

                    <div className="history-select-wrapper">

                        <Leaf size={18} />

                        <select
                            value={selectedPlantationId}
                            disabled={loadingPlantations}
                            onChange={(event) =>
                                setSelectedPlantationId(
                                    event.target.value
                                )
                            }
                        >

                            {loadingPlantations ? (

                                <option value="">
                                    Loading plantations...
                                </option>

                            ) : plantations.length === 0 ? (

                                <option value="">
                                    No plantations available
                                </option>

                            ) : (

                                plantations.map(
                                    (plantation) => (

                                        <option
                                            key={plantation.id}
                                            value={plantation.id}
                                        >
                                            {
                                                plantation.plantationName
                                            }
                                            {" - "}
                                            {plantation.farmName}
                                        </option>

                                    )
                                )

                            )}

                        </select>

                        <ChevronDown size={17} />

                    </div>

                </div>

                {selectedPlantation && (

                    <div className="selected-plantation-info">

            <span>
              Viewing history for
            </span>

                        <strong>
                            {
                                selectedPlantation.plantationName
                            }
                        </strong>

                    </div>

                )}

            </section>

            {/* ================= SUMMARY ================= */}

            {summary && (

                <section className="history-summary-grid">

                    <div className="history-summary-card">

            <span>
              Total Diagnoses
            </span>

                        <strong>
                            {summary.totalDiagnoses ?? 0}
                        </strong>

                    </div>

                    <div className="history-summary-card healthy">

            <span>
              Healthy
            </span>

                        <strong>
                            {summary.healthyCount ?? 0}
                        </strong>

                    </div>

                    <div className="history-summary-card diseased">

            <span>
              Diseased
            </span>

                        <strong>
                            {summary.diseasedCount ?? 0}
                        </strong>

                    </div>

                    <div className="history-summary-card">

            <span>
              Health Status
            </span>

                        <strong className="summary-health-status">

                            {summary.plantationHealthStatus
                                    ?.replaceAll("_", " ") ||
                                "N/A"}

                        </strong>

                    </div>

                </section>

            )}

            {/* ================= HISTORY ================= */}

            <section className="history-content">

                <div className="history-section-heading">

                    <div>

                        <h2>
                            Previous Diagnoses
                        </h2>

                        <p>
                            AI analysis results for the
                            selected plantation.
                        </p>

                    </div>

                    {!loadingHistory && (

                        <span>
              {diagnoses.length}{" "}
                            {diagnoses.length === 1
                                ? "record"
                                : "records"}
            </span>

                    )}

                </div>

                {/* LOADING */}

                {loadingHistory ? (

                    <div className="history-empty">

                        <div className="history-spinner" />

                        <h3>
                            Loading diagnosis history...
                        </h3>

                    </div>

                ) : diagnoses.length === 0 ? (

                    /* EMPTY */

                    <div className="history-empty">

                        <div className="history-empty-icon">

                            <History size={50} />

                        </div>

                        <h3>
                            No diagnoses yet
                        </h3>

                        <p>
                            This plantation has not been
                            analysed yet. Upload a banana
                            leaf image to create the first
                            diagnosis.
                        </p>

                        <button
                            type="button"
                            onClick={() => {
                                if (
                                    selectedPlantationId
                                ) {
                                    navigate(
                                        `/diagnose?plantationId=${selectedPlantationId}`
                                    );
                                } else {
                                    navigate("/diagnose");
                                }
                            }}
                        >
                            <ScanLine size={18} />

                            Diagnose Leaf
                        </button>

                    </div>

                ) : (

                    /* RECORDS */

                    <div className="history-list">

                        {diagnoses.map(
                            (diagnosis) => {

                                const imageUrl =
                                    getImageUrl(
                                        diagnosis
                                    );

                                return (

                                    <article
                                        className="diagnosis-history-card"
                                        key={diagnosis.id}
                                    >

                                        {/* IMAGE */}

                                        <div className="history-image">

                                            {imageUrl ? (

                                                <img
                                                    src={imageUrl}
                                                    alt="Diagnosed banana leaf"
                                                />

                                            ) : (

                                                <div className="history-no-image">

                                                    <Leaf size={35} />

                                                    <span>
                            No Image
                          </span>

                                                </div>

                                            )}

                                        </div>

                                        {/* DETAILS */}

                                        <div className="history-diagnosis-info">

                                            <div className="history-disease-heading">

                                                <div>

                          <span className="history-ai-label">
                            AI DIAGNOSIS
                          </span>

                                                    <h3>
                                                        {getDiseaseName(
                                                            diagnosis
                                                        )}
                                                    </h3>

                                                </div>

                                                <span className="history-severity">

                          {getSeverity(
                              diagnosis
                          )}

                        </span>

                                            </div>

                                            <div className="history-metrics">

                                                <div>

                          <span>
                            Confidence
                          </span>

                                                    <strong>
                                                        {diagnosis.confidencePercentage ??
                                                            0}
                                                        %
                                                    </strong>

                                                </div>

                                                <div>

                          <span>
                            Plantation
                          </span>

                                                    <strong>

                                                        {selectedPlantation?.plantationName ||
                                                            `#${diagnosis.plantationId}`}

                                                    </strong>

                                                </div>

                                            </div>

                                            <div className="history-date">

                                                <CalendarDays
                                                    size={16}
                                                />

                                                {formatDate(
                                                    diagnosis.diagnosedAt
                                                )}

                                            </div>

                                        </div>

                                        {/* BUTTON */}

                                        <div className="history-card-action">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setSelectedDiagnosis(
                                                        diagnosis
                                                    )
                                                }
                                            >
                                                <Eye size={17} />

                                                View Details
                                            </button>

                                        </div>

                                    </article>

                                );
                            }
                        )}

                    </div>

                )}

            </section>

            {/* =====================================================
          DIAGNOSIS DETAILS MODAL
      ===================================================== */}

            {selectedDiagnosis && (

                <div
                    className="history-modal-overlay"
                    onClick={closeModal}
                >

                    <div
                        className="history-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        {/* STICKY HEADER */}

                        <div className="history-modal-header">

                            <div>

                <span>
                  AI DIAGNOSIS RESULT
                </span>

                                <h2>
                                    {getDiseaseName(
                                        selectedDiagnosis
                                    )}
                                </h2>

                            </div>

                            {/* CLOSE BUTTON */}

                            <button
                                className="history-modal-close"
                                type="button"
                                onClick={closeModal}
                                aria-label="Close diagnosis details"
                                title="Close"
                            >
                                <X size={24} />
                            </button>

                        </div>

                        {/* SCROLLABLE CONTENT */}

                        <div className="history-modal-body">

                            {/* IMAGE */}

                            {getImageUrl(
                                selectedDiagnosis
                            ) ? (

                                <img
                                    className="history-modal-image"
                                    src={getImageUrl(
                                        selectedDiagnosis
                                    )}
                                    alt="Diagnosed banana leaf"
                                />

                            ) : (

                                <div className="history-modal-no-image">

                                    <Leaf size={45} />

                                    <span>
                    Image not available
                  </span>

                                </div>

                            )}

                            {/* STATS */}

                            <div className="history-modal-stats">

                                <div>

                  <span>
                    Confidence
                  </span>

                                    <strong>
                                        {selectedDiagnosis.confidencePercentage ??
                                            0}
                                        %
                                    </strong>

                                </div>

                                <div>

                  <span>
                    Severity
                  </span>

                                    <strong>
                                        {getSeverity(
                                            selectedDiagnosis
                                        )}
                                    </strong>

                                </div>

                            </div>

                            {/* DESCRIPTION */}

                            {selectedDiagnosis
                                .diseaseInfo
                                ?.description && (

                                <div className="history-detail-section">

                                    <h3>
                                        Description
                                    </h3>

                                    <p>
                                        {
                                            selectedDiagnosis
                                                .diseaseInfo
                                                .description
                                        }
                                    </p>

                                </div>

                            )}

                            {/* SYMPTOMS */}

                            {selectedDiagnosis
                                    .diseaseInfo
                                    ?.symptoms?.length >
                                0 && (

                                    <div className="history-detail-section">

                                        <h3>
                                            Symptoms
                                        </h3>

                                        <ul>

                                            {selectedDiagnosis.diseaseInfo.symptoms.map(
                                                (
                                                    symptom,
                                                    index
                                                ) => (

                                                    <li key={index}>
                                                        {symptom}
                                                    </li>

                                                )
                                            )}

                                        </ul>

                                    </div>

                                )}

                            {/* RECOMMENDATIONS */}

                            {selectedDiagnosis
                                .diseaseInfo
                                ?.recommendations
                                ?.length > 0 && (

                                <div className="history-detail-section recommendation-box">

                                    <h3>
                                        Recommendations
                                    </h3>

                                    <ul>

                                        {selectedDiagnosis.diseaseInfo.recommendations.map(
                                            (
                                                recommendation,
                                                index
                                            ) => (

                                                <li key={index}>
                                                    {
                                                        recommendation
                                                    }
                                                </li>

                                            )
                                        )}

                                    </ul>

                                </div>

                            )}

                            {/* DATE */}

                            <div className="history-diagnosed-date">

                                <CalendarDays
                                    size={16}
                                />

                                Diagnosed:{" "}

                                {formatDate(
                                    selectedDiagnosis.diagnosedAt
                                )}

                            </div>

                            {/* BOTTOM CLOSE */}

                            <button
                                type="button"
                                className="history-bottom-close"
                                onClick={closeModal}
                            >
                                <X size={18} />

                                Close Details
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default DiagnosisHistory;