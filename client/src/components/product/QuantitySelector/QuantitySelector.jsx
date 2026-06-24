import { useState } from "react";
import "./QuantitySelector.css";

export default function QuantitySelector({
  quantity = 1,
  onChange
}) {
  const [count, setCount] = useState(quantity);

  const increase = () => {
    const newCount = count + 1;
    setCount(newCount);
    onChange?.(newCount);
  };

  const decrease = () => {
    if (count > 1) {
      const newCount = count - 1;
      setCount(newCount);
      onChange?.(newCount);
    }
  };

  return (
    <div className="quantity-selector">
      <button onClick={decrease}>−</button>
      <span>{count}</span>
      <button onClick={increase}>+</button>
    </div>
  );
}