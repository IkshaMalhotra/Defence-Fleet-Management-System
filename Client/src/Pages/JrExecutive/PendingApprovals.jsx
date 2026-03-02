import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { maintenanceAPI, handleAPIError } from "../../utils/api";
import { CheckCircle2, XCircle, Eye, Clock } from "lucide-react";

const PendingApprovals = () => {
    const navigate = useNavigate();

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [actionType, setActionType] = useState("");
    const [comment, setComment] = useState("");
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchPendingRequests();
    }, []);

    const fetchPendingRequests = async () => {
        try {
            const { data } = await maintenanceAPI.getPendingForJrExec();
            setRequests(data);
        } catch (err) {
            console.error("Error:", handleAPIError(err));
        } finally {
            setLoading(false);
        }
    };

    const openActionModal = (request, action) => {
        setSelectedRequest(request);
        setActionType(action);
        setComment("");
        setShowModal(true);
    };

    const handleAction = async () => {
        if (!comment.trim()) return alert("Please provide a comment");

        setActionLoading(true);
        try {
            const apiCall =
                actionType === "approve"
                    ? maintenanceAPI.approveByJrExec
                    : maintenanceAPI.rejectByJrExec;

            await apiCall(selectedRequest._id, comment);

            await fetchPendingRequests();
            setShowModal(false);
            setSelectedRequest(null);
            setComment("");
        } catch (err) {
            alert(handleAPIError(err));
        } finally {
            setActionLoading(false);
        }
    };

    if (loading)
        return (
            <Layout>
                <div className="flex items-center justify-center h-full">
                    <div className="loading-spinner" />
                </div>
            </Layout>
        );

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-display font-bold text-military-100 mb-2">
                        Pending Approvals
                    </h1>
                    <p className="text-military-400">
                        Review and approve maintenance requests awaiting your decision
                    </p>
                </div>

                {/* Stats */}
                <div className="grid md:grid-cols-3 gap-6">
                    <StatCard icon={<Clock className="w-5 h-5 text-amber-400" />} label="Pending Requests" value={requests.length} />
                </div>

                {/* Requests */}
                <div className="card p-6">
                    <h2 className="text-xl font-display font-semibold text-military-100 mb-6">
                        Requests Awaiting Your Review
                    </h2>

                    {requests.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <div className="space-y-4">
                            {requests.map((req) => (
                                <RequestCard
                                    key={req._id}
                                    request={req}
                                    navigate={navigate}
                                    openActionModal={openActionModal}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {showModal && (
                <ApprovalModal
                    request={selectedRequest}
                    actionType={actionType}
                    comment={comment}
                    setComment={setComment}
                    actionLoading={actionLoading}
                    onConfirm={handleAction}
                    onClose={() => setShowModal(false)}
                />
            )}
        </Layout>
    );
};

export default PendingApprovals;

/* ---------- Small Components ---------- */

const StatCard = ({ icon, label, value }) => (
    <div className="card p-6 border-l-4 border-amber-500">
        <div className="flex items-center gap-3 mb-2">
            {icon}
            <h3 className="text-military-400 text-sm font-medium">{label}</h3>
        </div>
        <p className="text-3xl font-bold text-military-100">{value}</p>
    </div>
);

const EmptyState = () => (
    <div className="text-center py-12">
        <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
        <p className="text-military-400 text-lg mb-2">All caught up!</p>
        <p className="text-military-500 text-sm">No pending requests at the moment.</p>
    </div>
);

const RequestCard = ({ request, navigate, openActionModal }) => {
    const {
        _id,
        vehicle,
        description,
        currentState,
        requiredParts = [],
        estimatedBill,
        reportedBy,
        createdAt,
    } = request;

    return (
        <div className="flex justify-between gap-4">
            <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-military-100">
                        {vehicle?.name || "N/A"}
                    </h3>
                    <span className="text-xs font-mono text-military-500">
                        #{_id.slice(-6).toUpperCase()}
                    </span>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <InfoBlock label="Fault Description" text={description} />
                    <InfoBlock label="Current State" text={currentState} />
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <p className="text-xs text-military-500 mb-1">Required Parts</p>
                        <div className="flex flex-wrap gap-1">
                            {requiredParts.slice(0, 3).map((p, i) => (
                                <span key={i} className="px-2 py-1 bg-military-800 text-military-300 text-xs rounded">
                                    {p}
                                </span>
                            ))}
                            {requiredParts.length > 3 && (
                                <span className="px-2 py-1 bg-military-800 text-military-300 text-xs rounded">
                                    +{requiredParts.length - 3} more
                                </span>
                            )}
                        </div>
                    </div>

                    <InfoBlock
                        label="Estimated Bill"
                        text={<span className="text-lg font-bold text-military-100">₹{estimatedBill?.toLocaleString() || "0"}</span>}
                    />

                    <div>
                        <p className="text-xs text-military-500 mb-1">Reported By</p>
                        <p className="text-military-300">{reportedBy?.name || "N/A"}</p>
                        <p className="text-xs text-military-500">
                            {new Date(createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => navigate(`/dashboard/jr-executive/issue/${_id}`)}
                        className="btn-secondary flex items-center gap-2"
                    >
                        <Eye className="w-4 h-4" /> View Details
                    </button>

                    <button
                        onClick={() => openActionModal(request, "approve")}
                        className="btn-success flex items-center gap-2"
                    >
                        <CheckCircle2 className="w-4 h-4" /> Approve
                    </button>

                    <button
                        onClick={() => openActionModal(request, "reject")}
                        className="btn-danger flex items-center gap-2"
                    >
                        <XCircle className="w-4 h-4" /> Reject
                    </button>
                </div>
            </div>
        </div>
    );
};

const InfoBlock = ({ label, text }) => (
    <div>
        <p className="text-xs text-military-500 mb-1">{label}</p>
        <p className="text-military-300">{text}</p>
    </div>
);

const ApprovalModal = ({
    request,
    actionType,
    comment,
    setComment,
    actionLoading,
    onConfirm,
    onClose,
}) => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="card p-8 max-w-lg w-full animate-fade-in">
            <h3 className="text-2xl font-display font-bold text-military-100 mb-4">
                {actionType === "approve" ? "Approve Request" : "Reject Request"}
            </h3>

            <div className="mb-6">
                <div className="p-4 bg-military-900/50 rounded-lg border border-military-700 mb-4">
                    <p className="text-military-400 text-sm">Vehicle:</p>
                    <p className="text-military-100 font-semibold text-lg">
                        {request?.vehicle?.name}
                    </p>
                    <p className="text-military-400 text-sm mt-2">
                        {request?.description.substring(0, 100)}...
                    </p>
                </div>

                <label className="label-field">Comment / Reason *</label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="input-field h-32 resize-none"
                    placeholder="Provide your decision rationale..."
                />
                <p className="text-xs text-military-500 mt-2">
                    💡 Tip: For detailed approval with assessment, use "View Details"
                </p>
            </div>

            <div className="flex gap-3">
                <button
                    onClick={onConfirm}
                    disabled={actionLoading}
                    className={`flex-1 ${actionType === "approve" ? "btn-success" : "btn-danger"
                        } disabled:opacity-50`}
                >
                    {actionLoading ? "Processing..." : `Confirm ${actionType === "approve" ? "Approval" : "Rejection"}`}
                </button>
                <button onClick={onClose} className="flex-1 btn-secondary">
                    Cancel
                </button>
            </div>
        </div>
    </div>
);
