import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    ArrowLeft,
    MapPin,
    Plus,
    Sprout,
    Pencil,
    Trash2,
    Droplets,
    FlaskConical,
    Ruler,
    X,
    AlertTriangle,
    LoaderCircle,
    Leaf,
} from "lucide-react";

import {
    getMyFarms,
    createFarm,
    updateFarm,
    deleteFarm,
} from "../services/farmService";

import "./Farms.css";

const initialForm = {
    farmName: "",
    state: "",
    district: "",
    village: "",
    area: "",
    areaUnit: "ACRE",
    soilType: "",
    soilPh: "",
    waterSource: "",
    irrigationType: "",
    latitude: "",
    longitude: "",
};

function Farms() {
    const navigate = useNavigate();

    const [farms, setFarms] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [editingFarm, setEditingFarm] = useState(null);

    const [formData, setFormData] = useState(initialForm);

    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // =====================================================
    // LOAD FARMS
    // =====================================================

    const loadFarms = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getMyFarms();

            setFarms(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Unable to load farms:", err);

            setError(
                err.response?.data?.message ||
                "Unable to load farms. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFarms();
    }, []);

    // =====================================================
    // BODY SCROLL
    // =====================================================

    useEffect(() => {
        if (showModal) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [showModal]);

    // =====================================================
    // INPUT CHANGE
    // =====================================================

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // =====================================================
    // OPEN CREATE MODAL
    // =====================================================

    const openCreateModal = () => {
        setEditingFarm(null);
        setFormData(initialForm);
        setError("");
        setSuccess("");
        setShowModal(true);
    };

    // =====================================================
    // OPEN EDIT MODAL
    // =====================================================

    const openEditModal = (farm) => {
        setEditingFarm(farm);

        setFormData({
            farmName: farm.farmName || "",
            state: farm.state || "",
            district: farm.district || "",
            village: farm.village || "",
            area: farm.area ?? "",
            areaUnit: farm.areaUnit || "ACRE",
            soilType: farm.soilType || "",
            soilPh: farm.soilPh ?? "",
            waterSource: farm.waterSource || "",
            irrigationType: farm.irrigationType || "",
            latitude: farm.latitude ?? "",
            longitude: farm.longitude ?? "",
        });

        setError("");
        setSuccess("");
        setShowModal(true);
    };

    // =====================================================
    // CLOSE MODAL
    // =====================================================

    const closeModal = () => {
        if (saving) {
            return;
        }

        setShowModal(false);
        setEditingFarm(null);
        setFormData(initialForm);
    };

    // =====================================================
    // PREPARE REQUEST
    // =====================================================

    const prepareRequest = () => {
        return {
            farmName: formData.farmName.trim(),
            state: formData.state.trim(),
            district: formData.district.trim(),

            village: formData.village.trim() || null,

            area: Number(formData.area),

            areaUnit: formData.areaUnit || null,

            soilType: formData.soilType.trim() || null,

            soilPh:
                formData.soilPh === ""
                    ? null
                    : Number(formData.soilPh),

            waterSource:
                formData.waterSource.trim() || null,

            irrigationType:
                formData.irrigationType.trim() || null,

            latitude:
                formData.latitude === ""
                    ? null
                    : Number(formData.latitude),

            longitude:
                formData.longitude === ""
                    ? null
                    : Number(formData.longitude),
        };
    };

    // =====================================================
    // CREATE / UPDATE FARM
    // =====================================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            const request = prepareRequest();

            if (editingFarm) {
                await updateFarm(editingFarm.id, request);

                setSuccess("Farm updated successfully.");
            } else {
                await createFarm(request);

                setSuccess("Farm created successfully.");
            }

            await loadFarms();

            setShowModal(false);
            setEditingFarm(null);
            setFormData(initialForm);
        } catch (err) {
            console.error("Saving farm failed:", err);

            setError(
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Unable to save farm."
            );
        } finally {
            setSaving(false);
        }
    };

    // =====================================================
    // DELETE FARM
    // =====================================================

    const handleDelete = async (farm) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${farm.farmName}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingId(farm.id);
            setError("");
            setSuccess("");

            await deleteFarm(farm.id);

            setSuccess("Farm deleted successfully.");

            await loadFarms();
        } catch (err) {
            console.error("Delete farm failed:", err);

            setError(
                err.response?.data?.message ||
                "Unable to delete farm."
            );
        } finally {
            setDeletingId(null);
        }
    };

    // =====================================================
    // UI
    // =====================================================

    return (
        <div className="farms-page">
            {/* HEADER */}

            <header className="farms-header">
                <div className="farms-title-section">
                    <button
                        type="button"
                        className="farms-back-button"
                        onClick={() => navigate("/dashboard")}
                    >
                        <ArrowLeft size={20} />
                    </button>

                    <div className="farms-header-icon">
                        <Sprout size={25} />
                    </div>

                    <div>
                        <h1>My Farms</h1>

                        <p>
                            Manage your banana farms and plantations.
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    className="add-farm-button"
                    onClick={openCreateModal}
                >
                    <Plus size={19} />
                    Add Farm
                </button>
            </header>

            {/* SUCCESS */}

            {success && (
                <div className="farms-success">
                    <Leaf size={18} />
                    {success}
                </div>
            )}

            {/* ERROR */}

            {error && !showModal && (
                <div className="farms-error">
                    <AlertTriangle size={18} />
                    {error}
                </div>
            )}

            {/* LOADING */}

            {loading ? (
                <div className="farms-loading">
                    <LoaderCircle
                        className="farms-spinner"
                        size={35}
                    />

                    <h3>Loading your farms...</h3>
                </div>
            ) : farms.length === 0 ? (
                /* EMPTY */

                <div className="farms-empty">
                    <div className="farms-empty-icon">
                        <Sprout size={50} />
                    </div>

                    <h2>No farms added yet</h2>

                    <p>
                        Add your first banana farm to start
                        managing plantations and AI diagnoses.
                    </p>

                    <button
                        type="button"
                        onClick={openCreateModal}
                    >
                        <Plus size={18} />
                        Add Your First Farm
                    </button>
                </div>
            ) : (
                /* FARM GRID */

                <div className="farms-grid">
                    {farms.map((farm) => (
                        <article
                            className="farm-card"
                            key={farm.id}
                        >
                            <div className="farm-card-header">
                                <div className="farm-icon">
                                    <Sprout size={25} />
                                </div>

                                <div className="farm-card-actions">
                                    <button
                                        type="button"
                                        className="farm-edit-button"
                                        title="Edit Farm"
                                        onClick={() =>
                                            openEditModal(farm)
                                        }
                                    >
                                        <Pencil size={17} />
                                    </button>

                                    <button
                                        type="button"
                                        className="farm-delete-button"
                                        title="Delete Farm"
                                        disabled={
                                            deletingId === farm.id
                                        }
                                        onClick={() =>
                                            handleDelete(farm)
                                        }
                                    >
                                        {deletingId === farm.id ? (
                                            <LoaderCircle
                                                className="farms-spinner"
                                                size={17}
                                            />
                                        ) : (
                                            <Trash2 size={17} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <h2>{farm.farmName}</h2>

                            <div className="farm-location">
                                <MapPin size={16} />

                                <span>
                  {farm.village
                      ? `${farm.village}, `
                      : ""}

                                    {farm.district},{" "}
                                    {farm.state}
                </span>
                            </div>

                            <div className="farm-details-grid">
                                <div className="farm-detail">
                                    <Ruler size={18} />

                                    <div>
                                        <span>Farm Area</span>

                                        <strong>
                                            {farm.area}{" "}
                                            {farm.areaUnit || ""}
                                        </strong>
                                    </div>
                                </div>

                                <div className="farm-detail">
                                    <FlaskConical size={18} />

                                    <div>
                                        <span>Soil Type</span>

                                        <strong>
                                            {farm.soilType ||
                                                "Not specified"}
                                        </strong>
                                    </div>
                                </div>

                                <div className="farm-detail">
                                    <Droplets size={18} />

                                    <div>
                                        <span>Water Source</span>

                                        <strong>
                                            {farm.waterSource ||
                                                "Not specified"}
                                        </strong>
                                    </div>
                                </div>

                                <div className="farm-detail">
                                    <Leaf size={18} />

                                    <div>
                                        <span>Soil pH</span>

                                        <strong>
                                            {farm.soilPh ?? "N/A"}
                                        </strong>
                                    </div>
                                </div>
                            </div>

                            <div className="farm-card-footer">
                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(
                                            `/farms/${farm.id}/plantations`
                                        )
                                    }
                                >
                                    <Leaf size={18} />

                                    View Plantations
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            )}

            {/* =================================================
          CREATE / EDIT MODAL
      ================================================= */}

            {showModal && (
                <div
                    className="farm-modal-overlay"
                    onClick={closeModal}
                >
                    <div
                        className="farm-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <div className="farm-modal-header">
                            <div>
                <span>
                  BANANACARE FARM MANAGEMENT
                </span>

                                <h2>
                                    {editingFarm
                                        ? "Edit Farm"
                                        : "Add New Farm"}
                                </h2>
                            </div>

                            <button
                                type="button"
                                className="farm-modal-close"
                                onClick={closeModal}
                            >
                                <X size={22} />
                            </button>
                        </div>

                        <form
                            className="farm-form"
                            onSubmit={handleSubmit}
                        >
                            {error && (
                                <div className="farms-error">
                                    <AlertTriangle size={18} />
                                    {error}
                                </div>
                            )}

                            <div className="farm-form-grid">
                                {/* FARM NAME */}

                                <div className="farm-form-group full">
                                    <label>
                                        Farm Name *
                                    </label>

                                    <input
                                        type="text"
                                        name="farmName"
                                        value={formData.farmName}
                                        onChange={handleChange}
                                        placeholder="Example: Patil Banana Farm"
                                        required
                                    />
                                </div>

                                {/* STATE */}

                                <div className="farm-form-group">
                                    <label>State *</label>

                                    <input
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        placeholder="Maharashtra"
                                        required
                                    />
                                </div>

                                {/* DISTRICT */}

                                <div className="farm-form-group">
                                    <label>District *</label>

                                    <input
                                        type="text"
                                        name="district"
                                        value={formData.district}
                                        onChange={handleChange}
                                        placeholder="Jalgaon"
                                        required
                                    />
                                </div>

                                {/* VILLAGE */}

                                <div className="farm-form-group">
                                    <label>Village</label>

                                    <input
                                        type="text"
                                        name="village"
                                        value={formData.village}
                                        onChange={handleChange}
                                        placeholder="Village name"
                                    />
                                </div>

                                {/* AREA */}

                                <div className="farm-form-group">
                                    <label>Farm Area *</label>

                                    <input
                                        type="number"
                                        name="area"
                                        value={formData.area}
                                        onChange={handleChange}
                                        min="0.01"
                                        step="0.01"
                                        placeholder="5"
                                        required
                                    />
                                </div>

                                {/* AREA UNIT */}

                                <div className="farm-form-group">
                                    <label>Area Unit</label>

                                    <select
                                        name="areaUnit"
                                        value={formData.areaUnit}
                                        onChange={handleChange}
                                    >
                                        <option value="ACRE">
                                            Acre
                                        </option>

                                        <option value="HECTARE">
                                            Hectare
                                        </option>

                                        <option value="SQ_METER">
                                            Square Meter
                                        </option>
                                    </select>
                                </div>

                                {/* SOIL TYPE */}

                                <div className="farm-form-group">
                                    <label>Soil Type</label>

                                    <select
                                        name="soilType"
                                        value={formData.soilType}
                                        onChange={handleChange}
                                    >
                                        <option value="">
                                            Select soil type
                                        </option>

                                        <option value="LOAMY">
                                            Loamy
                                        </option>

                                        <option value="CLAY">
                                            Clay
                                        </option>

                                        <option value="SANDY">
                                            Sandy
                                        </option>

                                        <option value="SILT">
                                            Silt
                                        </option>

                                        <option value="BLACK">
                                            Black Soil
                                        </option>

                                        <option value="RED">
                                            Red Soil
                                        </option>
                                    </select>
                                </div>

                                {/* SOIL PH */}

                                <div className="farm-form-group">
                                    <label>Soil pH</label>

                                    <input
                                        type="number"
                                        name="soilPh"
                                        value={formData.soilPh}
                                        onChange={handleChange}
                                        min="0"
                                        max="14"
                                        step="0.1"
                                        placeholder="6.5"
                                    />
                                </div>

                                {/* WATER SOURCE */}

                                <div className="farm-form-group">
                                    <label>Water Source</label>

                                    <select
                                        name="waterSource"
                                        value={formData.waterSource}
                                        onChange={handleChange}
                                    >
                                        <option value="">
                                            Select water source
                                        </option>

                                        <option value="WELL">
                                            Well
                                        </option>

                                        <option value="BOREWELL">
                                            Borewell
                                        </option>

                                        <option value="RIVER">
                                            River
                                        </option>

                                        <option value="CANAL">
                                            Canal
                                        </option>

                                        <option value="RAINWATER">
                                            Rainwater
                                        </option>
                                    </select>
                                </div>

                                {/* IRRIGATION */}

                                <div className="farm-form-group">
                                    <label>
                                        Irrigation Type
                                    </label>

                                    <select
                                        name="irrigationType"
                                        value={
                                            formData.irrigationType
                                        }
                                        onChange={handleChange}
                                    >
                                        <option value="">
                                            Select irrigation
                                        </option>

                                        <option value="DRIP">
                                            Drip
                                        </option>

                                        <option value="SPRINKLER">
                                            Sprinkler
                                        </option>

                                        <option value="FLOOD">
                                            Flood
                                        </option>

                                        <option value="MANUAL">
                                            Manual
                                        </option>
                                    </select>
                                </div>

                                {/* LATITUDE */}

                                <div className="farm-form-group">
                                    <label>Latitude</label>

                                    <input
                                        type="number"
                                        name="latitude"
                                        value={formData.latitude}
                                        onChange={handleChange}
                                        min="-90"
                                        max="90"
                                        step="any"
                                        placeholder="21.0077"
                                    />
                                </div>

                                {/* LONGITUDE */}

                                <div className="farm-form-group">
                                    <label>Longitude</label>

                                    <input
                                        type="number"
                                        name="longitude"
                                        value={formData.longitude}
                                        onChange={handleChange}
                                        min="-180"
                                        max="180"
                                        step="any"
                                        placeholder="75.5626"
                                    />
                                </div>
                            </div>

                            <div className="farm-form-actions">
                                <button
                                    type="button"
                                    className="farm-cancel-button"
                                    onClick={closeModal}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="farm-save-button"
                                    disabled={saving}
                                >
                                    {saving ? (
                                        <>
                                            <LoaderCircle
                                                className="farms-spinner"
                                                size={18}
                                            />

                                            Saving...
                                        </>
                                    ) : editingFarm ? (
                                        <>
                                            <Pencil size={17} />
                                            Update Farm
                                        </>
                                    ) : (
                                        <>
                                            <Plus size={18} />
                                            Create Farm
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Farms;