export default function QuantitySelector({
    quantity,
    setQuantity,
}) {
    // Shared button styling matching the micro-interactions of your variant selector
    const buttonStyle = {
        width: "36px",
        height: "36px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#ffffff",
        border: "1px solid var(--color-border, rgba(195, 198, 215, 0.4))",
        borderRadius: "var(--radius-md, 0.5rem)",
        fontSize: "16px",
        fontWeight: "500",
        color: "var(--color-text-main, #141b2b)",
        cursor: "pointer",
        transition: "all 0.2s ease-in-out",
        userSelect: "none"
    };

    return (
        <div 
            className="quantity-selector"
            style={{
                display: "inline-flex",
                alignItems: "center",
                background: "#ffffff",
                border: "1px solid var(--color-border, rgba(195, 198, 215, 0.4))",
                borderRadius: "var(--radius-md, 0.5rem)",
                padding: "4px",
                gap: "4px",
                width: "fit-content"
            }}
        >




            
            <button
                style={{
                    ...buttonStyle,
                    opacity: quantity <= 1 ? 0.4 : 1,
                    cursor: quantity <= 1 ? "not-allowed" : "pointer"
                }}
                onClick={() =>
                    quantity > 1 &&
                    setQuantity(quantity - 1)
                }
                disabled={quantity <= 1}
                onMouseEnter={(e) => {
                    if (quantity > 1) e.currentTarget.style.borderColor = "var(--color-primary, #004ac6)";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--color-border, rgba(195, 198, 215, 0.4))";
                }}
            >
                -
            </button>

            <span
                style={{
                    minWidth: "32px",
                    textAlign: "center",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "var(--color-text-main, #141b2b)",
                    userSelect: "none"
                }}
            >
                {quantity}
            </span>

            <button
                style={buttonStyle}
                onClick={() =>
                    setQuantity(quantity + 1)
                }
                onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--color-primary, #004ac6)";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--color-border, rgba(195, 198, 215, 0.4))";
                }}
            >
                +
            </button>
        </div>
    );
}