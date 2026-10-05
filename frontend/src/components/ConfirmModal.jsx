import "./ConfirmModal.css";

/**
 * Reusable confirmation modal — replaces window.confirm() with
 * something that actually matches the app's design.
 *
 * Props:
 *  - open: boolean — whether the modal is visible
 *  - title: string
 *  - message: string
 *  - confirmLabel / cancelLabel: string (optional overrides)
 *  - variant: "danger" | "default" — controls the confirm button color
 *  - loading: boolean — disables buttons + shows a loading label
 *  - onConfirm / onCancel: functions
 */
function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  loading = false,
  onConfirm,
  onCancel,
}) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="confirm-modal-overlay"
      onClick={loading ? undefined : onCancel}
    >
      <div
        className="confirm-modal-card"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        aria-describedby="confirm-modal-message"
        // Stop clicks inside the card from bubbling to the
        // overlay (which would close the modal).
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`confirm-modal-icon ${
            variant === "danger" ? "danger" : ""
          }`}
        >
          {variant === "danger" ? "!" : "?"}
        </div>

        <h3
          id="confirm-modal-title"
          className="confirm-modal-title"
        >
          {title}
        </h3>

        <p
          id="confirm-modal-message"
          className="confirm-modal-message"
        >
          {message}
        </p>

        <div className="confirm-modal-actions">
          <button
            type="button"
            className="confirm-modal-cancel"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            className={`confirm-modal-confirm ${
              variant === "danger" ? "danger" : ""
            }`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Please wait..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;