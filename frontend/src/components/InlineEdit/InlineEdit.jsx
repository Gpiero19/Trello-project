import {useState, useEffect} from "react";
import { FaEdit } from "react-icons/fa";
import "./InlineEdit.css";

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
        e.stopPropagation();
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
                aria-label="Edit title"
                onChange={(e) => setValue(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                autoFocus
                />
            ) : (
                <span className={textClassName}>
                    {initialValue}
                    <FaEdit
                    className="edit-icon"
                    role="button"
                    tabIndex={0}
                    aria-label={`Edit "${initialValue}"`}
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsEditing(true);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsEditing(true);
                        }
                    }}
                    />
                </span>
            )}
        </div>
    )
}