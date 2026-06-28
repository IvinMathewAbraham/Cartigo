export default function QuantitySelector({
    quantity,
    setQuantity,
}) {
    return (
        <div className="quantity-selector">

            <button
                onClick={() =>
                    quantity > 1 &&
                    setQuantity(quantity - 1)
                }
            >
                -
            </button>

            <span>{quantity}</span>

            <button
                onClick={() =>
                    setQuantity(quantity + 1)
                }
            >
                +
            </button>

        </div>
    );
}