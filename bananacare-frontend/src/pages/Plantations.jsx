import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    ArrowLeft,
    CalendarDays,
    Leaf,
    Pencil,
    Plus,
    ScanLine,
    Sprout,
    X,
} from "lucide-react";

import {
    createPlantation,
    getPlantationsByFarm,
    updatePlantation,
} from "../services/plantationService";

import { getFarmById } from "../services/farmService";

import "./Plantations.css";

const createInitialForm = {
    plantationName: "",
    bananaVariety: "",
    plantationDate: "",
    numberOfPlants: "",
    rowSpacing: "",
    plantSpacing: "",
};

const editInitialForm = {
    plantationName: "",
    bananaVariety: "",
    numberOfPlants: "",
    rowSpacing: "",
    plantSpacing: "",
    growthStage: "PLANTED",
    expectedHarvestDate: "",
    status: "ACTIVE",
};

function Plantations() {
    const navigate = useNavigate();
    const { farmId } = useParams();

    const [farm, setFarm] = useState(null);
    const [plantations, setPlantations] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [showCreateForm, setShowCreateForm] =
        useState(false);

    const [showEditForm, setShowEditForm] =
        useState(false);

    const [editingPlantationId, setEditingPlantationId] =
        useState(null);

    const [createForm, setCreateForm] =
        useState(createInitialForm);

    const [editForm, setEditForm] =
        useState(editInitialForm);

    // =====================================================
    // LOAD PAGE
    // =====================================================

    const loadPage = async () => {
        try {
            setLoading(true);
            setError("");

            const [farmData, plantationData] =
                await Promise.all([
                    getFarmById(farmId),
                    getPlantationsByFarm(farmId),
                ]);

            setFarm(farmData);

            setPlantations(
                Array.isArray(plantationData)
                    ? plantationData
                    : []
            );
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
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPage();
    }, [farmId]);

    // =====================================================
    // CREATE FORM CHANGE
    // =====================================================

    const handleCreateChange = (event) => {
        const { name, value } = event.target;

        setCreateForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // =====================================================
    // EDIT FORM CHANGE
    // =====================================================

    const handleEditChange = (event) => {
        const { name, value } = event.target;

        setEditForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // =====================================================
    // OPEN CREATE
    // =====================================================

    const openCreateForm = () => {
        setCreateForm(createInitialForm);
        setError("");
        setSuccess("");
        setShowCreateForm(true);
    };

    // =====================================================
    // CLOSE CREATE
    // =====================================================

    const closeCreateForm = () => {
        setShowCreateForm(false);
        setCreateForm(createInitialForm);
    };

    // =====================================================
    // OPEN EDIT
    // =====================================================

    const openEditForm = (plantation) => {
        setEditingPlantationId(plantation.id);

        setEditForm({
            plantationName:
                plantation.plantationName || "",

            bananaVariety:
                plantation.bananaVariety || "",

            numberOfPlants:
                plantation.numberOfPlants ?? "",

            rowSpacing:
                plantation.rowSpacing ?? "",

            plantSpacing:
                plantation.plantSpacing ?? "",

            growthStage:
                plantation.growthStage || "PLANTED",

            expectedHarvestDate:
                plantation.expectedHarvestDate || "",

            status:
                plantation.status || "ACTIVE",
        });

        setError("");
        setSuccess("");
        setShowEditForm(true);
    };

    // =====================================================
    // CLOSE EDIT
    // =====================================================

    const closeEditForm = () => {
        setShowEditForm(false);
        setEditingPlantationId(null);
        setEditForm(editInitialForm);
    };

    // =====================================================
    // CREATE PLANTATION
    // =====================================================

    const handleCreate = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (
            !createForm.plantationName.trim() ||
            !createForm.bananaVariety.trim() ||
            !createForm.plantationDate ||
            !createForm.numberOfPlants
        ) {
            setError(
                "Please fill all required fields."
            );

            return;
        }

        if (Number(createForm.numberOfPlants) <= 0) {
            setError(
                "Number of plants must be greater than zero."
            );

            return;
        }

        try {
            setSaving(true);

            const request = {
                farmId: Number(farmId),

                plantationName:
                    createForm.plantationName.trim(),

                bananaVariety:
                    createForm.bananaVariety.trim(),

                plantationDate:
                createForm.plantationDate,

                numberOfPlants:
                    Number(createForm.numberOfPlants),

                rowSpacing:
                    createForm.rowSpacing === ""
                        ? null
                        : Number(createForm.rowSpacing),

                plantSpacing:
                    createForm.plantSpacing === ""
                        ? null
                        : Number(createForm.plantSpacing),
            };

            await createPlantation(request);

            closeCreateForm();

            setSuccess(
                "Plantation created successfully."
            );

            await loadPage();
        } catch (err) {
            console.error(
                "Create plantation error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to create plantation."
            );
        } finally {
            setSaving(false);
        }
    };

    // =====================================================
    // UPDATE PLANTATION
    // =====================================================

    const handleUpdate = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (
            !editForm.plantationName.trim() ||
            !editForm.bananaVariety.trim() ||
            !editForm.numberOfPlants ||
            !editForm.growthStage ||
            !editForm.status
        ) {
            setError(
                "Please fill all required fields."
            );

            return;
        }

        try {
            setSaving(true);

            const request = {
                plantationName:
                    editForm.plantationName.trim(),

                bananaVariety:
                    editForm.bananaVariety.trim(),

                numberOfPlants:
                    Number(editForm.numberOfPlants),

                rowSpacing:
                    editForm.rowSpacing === ""
                        ? null
                        : Number(editForm.rowSpacing),

                plantSpacing:
                    editForm.plantSpacing === ""
                        ? null
                        : Number(editForm.plantSpacing),

                growthStage:
                editForm.growthStage,

                expectedHarvestDate:
                    editForm.expectedHarvestDate || null,

                status:
                editForm.status,
            };

            await updatePlantation(
                editingPlantationId,
                request
            );

            closeEditForm();

            setSuccess(
                "Plantation updated successfully."
            );

            await loadPage();
        } catch (err) {
            console.error(
                "Update plantation error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to update plantation."
            );
        } finally {
            setSaving(false);
        }
    };

    // =====================================================
    // DIAGNOSE
    // =====================================================

    const handleDiagnose = (plantationId) => {
        navigate(
            `/diagnose?plantationId=${plantationId}`
        );
    };

    // =====================================================
    // UI
    // =====================================================

    return (
        <div className="plantations-page">

            {/* HEADER */}

            <header className="plantations-header">

                <div className="plantations-header-left">

                    <button
                        className="plantation-back-button"
                        onClick={() => navigate("/farms")}
                    >
                        <ArrowLeft size={20} />
                    </button>

                    <div className="plantation-header-icon">
                        <Leaf size={26} />
                    </div>

                    <div>
                        <h1>Plantations</h1>

                        <p>
                            {farm
                                ? `${farm.farmName} • ${farm.district}, ${farm.state}`
                                : "Manage banana plantations"}
                        </p>
                    </div>

                </div>

                <button
                    className="add-plantation-button"
                    onClick={openCreateForm}
                >
                    <Plus size={20} />
                    Add Plantation
                </button>

            </header>

            {/* MESSAGES */}

            {error && (
                <div className="plantation-message plantation-error">
                    {error}
                </div>
            )}

            {success && (
                <div className="plantation-message plantation-success">
                    {success}
                </div>
            )}

            {/* SUMMARY */}

            <section className="plantation-summary">

                <div className="plantation-summary-card">
                    <Sprout size={24} />

                    <div>
                        <span>Total Plantations</span>

                        <strong>
                            {loading
                                ? "..."
                                : plantations.length}
                        </strong>
                    </div>
                </div>

                <div className="plantation-summary-card">
                    <Leaf size={24} />

                    <div>
                        <span>Total Plants</span>

                        <strong>
                            {loading
                                ? "..."
                                : plantations.reduce(
                                    (total, plantation) =>
                                        total +
                                        (plantation.numberOfPlants || 0),
                                    0
                                )}
                        </strong>
                    </div>
                </div>

            </section>

            {/* CONTENT */}

            {loading ? (

                <div className="plantations-empty">
                    <Sprout size={50} />
                    <h2>Loading plantations...</h2>
                </div>

            ) : plantations.length === 0 ? (

                <div className="plantations-empty">

                    <div className="plantations-empty-icon">
                        <Sprout size={52} />
                    </div>

                    <h2>No plantations yet</h2>

                    <p>
                        Add your first banana plantation to
                        start monitoring its health.
                    </p>

                    <button
                        onClick={openCreateForm}
                        className="empty-add-button"
                    >
                        <Plus size={19} />
                        Add Plantation
                    </button>

                </div>

            ) : (

                <section className="plantations-grid">

                    {plantations.map((plantation) => (

                        <article
                            className="plantation-card"
                            key={plantation.id}
                        >

                            <div className="plantation-card-top">

                                <div className="plantation-card-icon">
                                    <Leaf size={28} />
                                </div>

                                <span
                                    className={`plantation-status ${
                                        plantation.status === "ACTIVE"
                                            ? "plantation-active"
                                            : "plantation-inactive"
                                    }`}
                                >
                  {plantation.status || "N/A"}
                </span>

                            </div>

                            <h2>
                                {plantation.plantationName}
                            </h2>

                            <p className="banana-variety">
                                {plantation.bananaVariety}
                            </p>

                            <div className="plantation-details">

                                <div>
                                    <span>Number of Plants</span>
                                    <strong>
                                        {plantation.numberOfPlants}
                                    </strong>
                                </div>

                                <div>
                                    <span>Growth Stage</span>
                                    <strong>
                                        {plantation.growthStage ||
                                            "N/A"}
                                    </strong>
                                </div>

                                <div>
                                    <span>Row Spacing</span>
                                    <strong>
                                        {plantation.rowSpacing
                                            ? `${plantation.rowSpacing} m`
                                            : "N/A"}
                                    </strong>
                                </div>

                                <div>
                                    <span>Plant Spacing</span>
                                    <strong>
                                        {plantation.plantSpacing
                                            ? `${plantation.plantSpacing} m`
                                            : "N/A"}
                                    </strong>
                                </div>

                            </div>

                            <div className="plantation-date">

                                <CalendarDays size={17} />

                                <span>
                  Planted:{" "}
                                    {plantation.plantationDate ||
                                        "N/A"}
                </span>

                            </div>

                            {plantation.expectedHarvestDate && (

                                <div className="plantation-date">

                                    <CalendarDays size={17} />

                                    <span>
                    Expected Harvest:{" "}
                                        {
                                            plantation.expectedHarvestDate
                                        }
                  </span>

                                </div>

                            )}

                            <div className="plantation-actions">

                                <button
                                    className="edit-plantation-button"
                                    onClick={() =>
                                        openEditForm(plantation)
                                    }
                                >
                                    <Pencil size={18} />
                                    Edit
                                </button>

                                <button
                                    className="diagnose-plantation-button"
                                    onClick={() =>
                                        handleDiagnose(plantation.id)
                                    }
                                >
                                    <ScanLine size={18} />
                                    Diagnose Leaf
                                </button>

                            </div>

                        </article>

                    ))}

                </section>

            )}

            {/* =================================================
          CREATE MODAL
      ================================================= */}

            {showCreateForm && (

                <div className="plantation-modal-overlay">

                    <div className="plantation-modal">

                        <div className="plantation-modal-header">

                            <div>
                                <h2>Add Plantation</h2>

                                <p>
                                    Add a banana plantation to{" "}
                                    {farm?.farmName || "this farm"}.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeCreateForm}
                                className="plantation-close-button"
                            >
                                <X size={22} />
                            </button>

                        </div>

                        <form onSubmit={handleCreate}>

                            <div className="plantation-form-grid">

                                <div className="plantation-form-group full-width">
                                    <label>
                                        Plantation Name *
                                    </label>

                                    <input
                                        type="text"
                                        name="plantationName"
                                        value={
                                            createForm.plantationName
                                        }
                                        onChange={
                                            handleCreateChange
                                        }
                                        placeholder="Example: North Banana Block"
                                        required
                                    />
                                </div>

                                <div className="plantation-form-group">
                                    <label>
                                        Banana Variety *
                                    </label>

                                    <input
                                        type="text"
                                        name="bananaVariety"
                                        value={
                                            createForm.bananaVariety
                                        }
                                        onChange={
                                            handleCreateChange
                                        }
                                        placeholder="Example: Grand Naine"
                                        required
                                    />
                                </div>

                                <div className="plantation-form-group">
                                    <label>
                                        Plantation Date *
                                    </label>

                                    <input
                                        type="date"
                                        name="plantationDate"
                                        value={
                                            createForm.plantationDate
                                        }
                                        onChange={
                                            handleCreateChange
                                        }
                                        required
                                    />
                                </div>

                                <div className="plantation-form-group">
                                    <label>
                                        Number of Plants *
                                    </label>

                                    <input
                                        type="number"
                                        name="numberOfPlants"
                                        value={
                                            createForm.numberOfPlants
                                        }
                                        onChange={
                                            handleCreateChange
                                        }
                                        min="1"
                                        required
                                    />
                                </div>

                                <div className="plantation-form-group">
                                    <label>
                                        Row Spacing (m)
                                    </label>

                                    <input
                                        type="number"
                                        name="rowSpacing"
                                        value={
                                            createForm.rowSpacing
                                        }
                                        onChange={
                                            handleCreateChange
                                        }
                                        min="0.01"
                                        step="0.01"
                                        placeholder="Example: 2.5"
                                    />
                                </div>

                                <div className="plantation-form-group">
                                    <label>
                                        Plant Spacing (m)
                                    </label>

                                    <input
                                        type="number"
                                        name="plantSpacing"
                                        value={
                                            createForm.plantSpacing
                                        }
                                        onChange={
                                            handleCreateChange
                                        }
                                        min="0.01"
                                        step="0.01"
                                        placeholder="Example: 2.0"
                                    />
                                </div>

                            </div>

                            <div className="plantation-form-actions">

                                <button
                                    type="button"
                                    className="plantation-cancel-button"
                                    onClick={closeCreateForm}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="plantation-save-button"
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Saving..."
                                        : "Create Plantation"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

            {/* =================================================
          EDIT MODAL
      ================================================= */}

            {showEditForm && (

                <div className="plantation-modal-overlay">

                    <div className="plantation-modal">

                        <div className="plantation-modal-header">

                            <div>
                                <h2>Edit Plantation</h2>
                                <p>Update plantation details.</p>
                            </div>

                            <button
                                type="button"
                                onClick={closeEditForm}
                                className="plantation-close-button"
                            >
                                <X size={22} />
                            </button>

                        </div>

                        <form onSubmit={handleUpdate}>

                            <div className="plantation-form-grid">

                                <div className="plantation-form-group full-width">
                                    <label>
                                        Plantation Name *
                                    </label>

                                    <input
                                        type="text"
                                        name="plantationName"
                                        value={
                                            editForm.plantationName
                                        }
                                        onChange={handleEditChange}
                                        required
                                    />
                                </div>

                                <div className="plantation-form-group">
                                    <label>
                                        Banana Variety *
                                    </label>

                                    <input
                                        type="text"
                                        name="bananaVariety"
                                        value={
                                            editForm.bananaVariety
                                        }
                                        onChange={handleEditChange}
                                        required
                                    />
                                </div>

                                <div className="plantation-form-group">
                                    <label>
                                        Number of Plants *
                                    </label>

                                    <input
                                        type="number"
                                        name="numberOfPlants"
                                        value={
                                            editForm.numberOfPlants
                                        }
                                        onChange={handleEditChange}
                                        min="1"
                                        required
                                    />
                                </div>

                                <div className="plantation-form-group">
                                    <label>
                                        Row Spacing (m)
                                    </label>

                                    <input
                                        type="number"
                                        name="rowSpacing"
                                        value={editForm.rowSpacing}
                                        onChange={handleEditChange}
                                        min="0.01"
                                        step="0.01"
                                    />
                                </div>

                                <div className="plantation-form-group">
                                    <label>
                                        Plant Spacing (m)
                                    </label>

                                    <input
                                        type="number"
                                        name="plantSpacing"
                                        value={
                                            editForm.plantSpacing
                                        }
                                        onChange={handleEditChange}
                                        min="0.01"
                                        step="0.01"
                                    />
                                </div>

                                <div className="plantation-form-group">
                                    <label>
                                        Growth Stage *
                                    </label>

                                    <select
                                        name="growthStage"
                                        value={editForm.growthStage}
                                        onChange={handleEditChange}
                                        required
                                    >
                                        <option value="PLANTED">
                                            Planted
                                        </option>

                                        <option value="VEGETATIVE">
                                            Vegetative
                                        </option>

                                        <option value="FLOWERING">
                                            Flowering
                                        </option>

                                        <option value="FRUITING">
                                            Fruiting
                                        </option>

                                        <option value="HARVEST_READY">
                                            Harvest Ready
                                        </option>
                                    </select>
                                </div>

                                <div className="plantation-form-group">
                                    <label>
                                        Expected Harvest Date
                                    </label>

                                    <input
                                        type="date"
                                        name="expectedHarvestDate"
                                        value={
                                            editForm.expectedHarvestDate
                                        }
                                        onChange={handleEditChange}
                                    />
                                </div>

                                <div className="plantation-form-group">
                                    <label>Status *</label>

                                    <select
                                        name="status"
                                        value={editForm.status}
                                        onChange={handleEditChange}
                                        required
                                    >
                                        <option value="ACTIVE">
                                            Active
                                        </option>

                                        <option value="HARVESTED">
                                            Harvested
                                        </option>

                                        <option value="INACTIVE">
                                            Inactive
                                        </option>
                                    </select>
                                </div>

                            </div>

                            <div className="plantation-form-actions">

                                <button
                                    type="button"
                                    className="plantation-cancel-button"
                                    onClick={closeEditForm}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="plantation-save-button"
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Updating..."
                                        : "Update Plantation"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Plantations;