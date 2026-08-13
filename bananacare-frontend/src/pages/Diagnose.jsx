import { useEffect, useRef, useState } from "react";
import {
    useNavigate,
    useSearchParams,
} from "react-router-dom";

import {
    ArrowLeft,
    CheckCircle2,
    ImagePlus,
    Leaf,
    ScanLine,
    Upload,
    X,
    AlertTriangle,
    History,
} from "lucide-react";

import { getMyFarms } from "../services/farmService";

import {
    getPlantationsByFarm,
} from "../services/plantationService";

import {
    diagnoseBananaLeaf,
} from "../services/aiService";

import "./Diagnose.css";

function Diagnose() {
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    const fileInputRef = useRef(null);

    const plantationIdFromUrl =
        searchParams.get("plantationId");

    const [plantations, setPlantations] =
        useState([]);

    const [selectedPlantationId, setSelectedPlantationId] =
        useState(
            plantationIdFromUrl || ""
        );

    const [selectedFile, setSelectedFile] =
        useState(null);

    const [previewUrl, setPreviewUrl] =
        useState("");

    const [result, setResult] =
        useState(null);

    const [loadingPlantations, setLoadingPlantations] =
        useState(true);

    const [diagnosing, setDiagnosing] =
        useState(false);

    const [error, setError] =
        useState("");

    // =====================================================
    // LOAD PLANTATIONS
    // =====================================================

    useEffect(() => {
        const loadPlantations = async () => {
            try {
                setLoadingPlantations(true);
                setError("");

                // Get user's farms
                const farmData =
                    await getMyFarms();

                const safeFarms =
                    Array.isArray(farmData)
                        ? farmData
                        : [];

                if (safeFarms.length === 0) {
                    setPlantations([]);
                    return;
                }

                // Get plantations for every farm
                const requests =
                    safeFarms.map((farm) =>
                        getPlantationsByFarm(
                            farm.id
                        )
                    );

                const results =
                    await Promise.all(requests);

                const allPlantations =
                    results
                        .filter(Array.isArray)
                        .flat();

                setPlantations(
                    allPlantations
                );

                // If plantationId came from:
                // /diagnose?plantationId=1
                if (
                    plantationIdFromUrl &&
                    allPlantations.some(
                        (plantation) =>
                            String(
                                plantation.id
                            ) ===
                            String(
                                plantationIdFromUrl
                            )
                    )
                ) {
                    setSelectedPlantationId(
                        String(
                            plantationIdFromUrl
                        )
                    );
                } else if (
                    allPlantations.length > 0
                ) {
                    setSelectedPlantationId(
                        String(
                            allPlantations[0].id
                        )
                    );
                }

            } catch (err) {
                console.error(
                    "Plantation loading error:",
                    err
                );

                setError(
                    err.response?.data?.message ||
                    "Unable to load plantations."
                );
            } finally {
                setLoadingPlantations(
                    false
                );
            }
        };

        loadPlantations();
    }, [plantationIdFromUrl]);

    // =====================================================
    // CLEAN PREVIEW
    // =====================================================

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(
                    previewUrl
                );
            }
        };
    }, [previewUrl]);

    // =====================================================
    // FILE SELECTION
    // =====================================================

    const handleFileChange = (
        event
    ) => {
        const file =
            event.target.files?.[0];

        if (!file) {
            return;
        }

        setError("");
        setResult(null);

        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
        ];

        if (
            !allowedTypes.includes(
                file.type
            )
        ) {
            setError(
                "Please select a JPG, JPEG or PNG image."
            );

            event.target.value = "";

            return;
        }

        // 10 MB frontend limit
        const maxSize =
            10 * 1024 * 1024;

        if (
            file.size > maxSize
        ) {
            setError(
                "Image size must be less than 10 MB."
            );

            event.target.value = "";

            return;
        }

        if (previewUrl) {
            URL.revokeObjectURL(
                previewUrl
            );
        }

        setSelectedFile(file);

        setPreviewUrl(
            URL.createObjectURL(
                file
            )
        );
    };

    // =====================================================
    // REMOVE IMAGE
    // =====================================================

    const removeImage = () => {
        if (previewUrl) {
            URL.revokeObjectURL(
                previewUrl
            );
        }

        setSelectedFile(null);
        setPreviewUrl("");
        setResult(null);

        if (
            fileInputRef.current
        ) {
            fileInputRef.current.value =
                "";
        }
    };

    // =====================================================
    // DIAGNOSE
    // =====================================================

    const handleDiagnose =
        async () => {
            setError("");
            setResult(null);

            if (
                !selectedPlantationId
            ) {
                setError(
                    "Please select a plantation."
                );

                return;
            }

            if (!selectedFile) {
                setError(
                    "Please select a banana leaf image."
                );

                return;
            }

            try {
                setDiagnosing(true);

                const diagnosisResult =
                    await diagnoseBananaLeaf(
                        selectedPlantationId,
                        selectedFile
                    );

                setResult(
                    diagnosisResult
                );

            } catch (err) {
                console.error(
                    "AI diagnosis error:",
                    err
                );

                const backendData =
                    err.response?.data;

                setError(
                    backendData?.message ||
                    backendData?.detail ||
                    "Unable to diagnose the image. Make sure the Spring Boot and AI servers are running."
                );
            } finally {
                setDiagnosing(false);
            }
        };

    // =====================================================
    // DISPLAY HELPERS
    // =====================================================

    const diseaseDisplayName =
        result?.diseaseInfo
            ?.displayName ||
        result?.predictedDisease ||
        "Unknown";

    const severity =
        result?.diseaseInfo
            ?.severity ||
        "N/A";

    const symptoms =
        result?.diseaseInfo
            ?.symptoms ||
        [];

    const recommendations =
        result?.diseaseInfo
            ?.recommendations ||
        [];

    // =====================================================
    // UI
    // =====================================================

    return (
        <div className="diagnose-page">

            {/* HEADER */}

            <header className="diagnose-header">

                <div className="diagnose-header-left">

                    <button
                        className="diagnose-back-button"
                        onClick={() =>
                            navigate(
                                "/dashboard"
                            )
                        }
                    >
                        <ArrowLeft
                            size={20}
                        />
                    </button>

                    <div className="diagnose-logo">
                        <Leaf
                            size={26}
                        />
                    </div>

                    <div>
                        <h1>
                            AI Leaf Diagnosis
                        </h1>

                        <p>
                            Analyse banana leaf
                            images using BananaCare
                            AI
                        </p>
                    </div>

                </div>

                <button
                    className="history-button"
                    onClick={() =>
                        navigate(
                            "/history"
                        )
                    }
                >
                    <History
                        size={18}
                    />

                    Diagnosis History
                </button>

            </header>

            {/* ERROR */}

            {error && (
                <div className="diagnose-error">
                    <AlertTriangle
                        size={20}
                    />

                    <span>
            {error}
          </span>
                </div>
            )}

            {/* MAIN */}

            <div className="diagnose-layout">

                {/* LEFT SIDE */}

                <section className="diagnose-card">

                    <div className="diagnose-card-title">

                        <div>
                            <ScanLine
                                size={24}
                            />
                        </div>

                        <div>
                            <h2>
                                Diagnose Leaf
                            </h2>

                            <p>
                                Select a plantation
                                and upload a banana
                                leaf image.
                            </p>
                        </div>

                    </div>

                    {/* PLANTATION */}

                    <div className="diagnose-form-group">

                        <label>
                            Plantation *
                        </label>

                        <select
                            value={
                                selectedPlantationId
                            }
                            onChange={(event) => {
                                setSelectedPlantationId(
                                    event.target.value
                                );

                                setResult(null);
                            }}
                            disabled={
                                loadingPlantations
                            }
                        >

                            {loadingPlantations ? (

                                <option value="">
                                    Loading plantations...
                                </option>

                            ) : plantations.length ===
                            0 ? (

                                <option value="">
                                    No plantations available
                                </option>

                            ) : (

                                plantations.map(
                                    (plantation) => (

                                        <option
                                            key={
                                                plantation.id
                                            }
                                            value={
                                                plantation.id
                                            }
                                        >
                                            {
                                                plantation.plantationName
                                            }
                                            {" - "}
                                            {
                                                plantation.farmName
                                            }
                                        </option>

                                    )
                                )

                            )}

                        </select>

                    </div>

                    {/* UPLOAD */}

                    {!previewUrl ? (

                        <div
                            className="upload-area"
                            onClick={() =>
                                fileInputRef
                                    .current
                                    ?.click()
                            }
                        >

                            <div className="upload-icon">
                                <ImagePlus
                                    size={40}
                                />
                            </div>

                            <h3>
                                Upload Banana Leaf
                            </h3>

                            <p>
                                Click here to choose
                                a banana leaf image.
                            </p>

                            <span>
                JPG, JPEG or PNG •
                Maximum 10 MB
              </span>

                        </div>

                    ) : (

                        <div className="image-preview-container">

                            <img
                                src={previewUrl}
                                alt="Selected banana leaf"
                                className="leaf-preview"
                            />

                            <button
                                type="button"
                                className="remove-image-button"
                                onClick={
                                    removeImage
                                }
                            >
                                <X
                                    size={18}
                                />
                            </button>

                            <div className="selected-file-name">
                                {
                                    selectedFile?.name
                                }
                            </div>

                        </div>

                    )}

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png"
                        onChange={
                            handleFileChange
                        }
                        className="hidden-file-input"
                    />

                    {/* DIAGNOSE BUTTON */}

                    <button
                        className="run-diagnosis-button"
                        onClick={
                            handleDiagnose
                        }
                        disabled={
                            diagnosing ||
                            !selectedFile ||
                            !selectedPlantationId
                        }
                    >

                        {diagnosing ? (

                            <>
                                <span className="diagnosis-spinner"></span>
                                Analysing Leaf...
                            </>

                        ) : (

                            <>
                                <Upload
                                    size={19}
                                />
                                Diagnose Leaf
                            </>

                        )}

                    </button>

                    <p className="diagnose-help">
                        For better results, use a
                        clear image showing the
                        affected banana leaf.
                    </p>

                </section>

                {/* RIGHT SIDE */}

                <section className="diagnose-card result-card">

                    <div className="diagnose-card-title">

                        <div>
                            <Leaf
                                size={24}
                            />
                        </div>

                        <div>
                            <h2>
                                AI Diagnosis Result
                            </h2>

                            <p>
                                Disease prediction and
                                plant-care guidance.
                            </p>
                        </div>

                    </div>

                    {!result ? (

                        <div className="no-result">

                            <ScanLine
                                size={55}
                            />

                            <h3>
                                No diagnosis yet
                            </h3>

                            <p>
                                Upload a banana leaf
                                image and click
                                Diagnose Leaf to see
                                the AI result.
                            </p>

                        </div>

                    ) : (

                        <div className="diagnosis-result">

                            {/* RESULT HEADER */}

                            <div className="result-success">

                                <CheckCircle2
                                    size={28}
                                />

                                <div>
                  <span>
                    AI ANALYSIS
                    COMPLETE
                  </span>

                                    <h2>
                                        {
                                            diseaseDisplayName
                                        }
                                    </h2>
                                </div>

                            </div>

                            {/* CONFIDENCE */}

                            <div className="result-stat-grid">

                                <div>
                  <span>
                    Confidence
                  </span>

                                    <strong>
                                        {
                                            result.confidencePercentage
                                        }
                                        %
                                    </strong>
                                </div>

                                <div>
                  <span>
                    Severity
                  </span>

                                    <strong>
                                        {severity}
                                    </strong>
                                </div>

                            </div>

                            {/* DESCRIPTION */}

                            {result.diseaseInfo
                                ?.description && (

                                <div className="result-section">

                                    <h3>
                                        About this result
                                    </h3>

                                    <p>
                                        {
                                            result
                                                .diseaseInfo
                                                .description
                                        }
                                    </p>

                                </div>

                            )}

                            {/* SYMPTOMS */}

                            {symptoms.length >
                                0 && (

                                    <div className="result-section">

                                        <h3>
                                            Symptoms
                                        </h3>

                                        <ul>
                                            {symptoms.map(
                                                (
                                                    symptom,
                                                    index
                                                ) => (

                                                    <li
                                                        key={
                                                            index
                                                        }
                                                    >
                                                        {
                                                            symptom
                                                        }
                                                    </li>

                                                )
                                            )}
                                        </ul>

                                    </div>

                                )}

                            {/* RECOMMENDATIONS */}

                            {recommendations.length >
                                0 && (

                                    <div className="result-section recommendation-section">

                                        <h3>
                                            Recommendations
                                        </h3>

                                        <ul>
                                            {recommendations.map(
                                                (
                                                    recommendation,
                                                    index
                                                ) => (

                                                    <li
                                                        key={
                                                            index
                                                        }
                                                    >
                                                        {
                                                            recommendation
                                                        }
                                                    </li>

                                                )
                                            )}
                                        </ul>

                                    </div>

                                )}

                            <button
                                className="result-history-button"
                                onClick={() =>
                                    navigate(
                                        "/history"
                                    )
                                }
                            >
                                <History
                                    size={18}
                                />
                                View Diagnosis History
                            </button>

                        </div>

                    )}

                </section>

            </div>

        </div>
    );
}

export default Diagnose;