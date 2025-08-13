import React, {useState, useEffect} from "react";

function editModal({
    isOpen,
    initialValue,
    title,
    onSave,
    onCancel
    }) {
    const [value, setValue] = useState(initialValue || "");

    useEffect(() => {
        setValue(initialValue || "");
    }, [initialValue, isOpen]);

    if(!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h3>{title}</h3>
                <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    autoFocus
                />
                <div className="modal-actions">
                    <button onClick={() => onSave(value.trim())} disabled={!value.trim()}>
                        Save
                    </button>
                    <button onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default editModal;