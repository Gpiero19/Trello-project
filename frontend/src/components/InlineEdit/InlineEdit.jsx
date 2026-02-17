import {useState, useEffect} from "react";
import { FaEdit } from "react-icons/fa";

export default function InlineEdit({ 
    initialValue, 
    onSave,
    className = "",
    textClassName = ""
} ) {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    const handleSave = () => {
        const trimmed = value.trim();
        if (trimmed && trimmed !== initialValue) {
            onSave(trimmed)
        }
        setIsEditing(false);
    };

     const handleKeyDown = (e) => {
        if (e.key === "Enter") handleSave()
        if (e.key === "Escape") {
            setValue(initialValue);
            setIsEditing(false)
        }
     };

    return (
        <div className={`inline-edit ${className}`}>
            {isEditing ? (
                <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                autoFocus
                />
            ) : (
                <span className={textClassName}>
                    {initialValue}
                    <FaEdit
                    className="edit-icon"
                    onClick={() => setIsEditing(true)}
                    style={{ marginLeft:"6px", cursor:"pointer" }}
                    />
                </span>
            )}
        </div>
    )
}