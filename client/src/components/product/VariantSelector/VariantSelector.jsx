import { useEffect, useMemo, useState } from "react";
import "./VariantSelector.css";

export default function VariantSelector({
  variants = [],
  onVariantChange,
  selectedVariant,
}) {
  // Build { Color: [...], Storage: [...], ... }
  const attributeGroups = useMemo(() => {
    const groups = {};

    variants.forEach((variant) => {
      variant.attributes.forEach(({ attribute, value }) => {
        if (!groups[attribute]) {
          groups[attribute] = new Set();
        }

        groups[attribute].add(value);
      });
    });

    return Object.fromEntries(
      Object.entries(groups).map(([key, values]) => [key, [...values]])
    );
  }, [variants]);

const selectedAttributes = useMemo(() => {
  if (!selectedVariant) return {};

  return Object.fromEntries(
    selectedVariant.attributes.map(({ attribute, value }) => [
      attribute,
      value,
    ])
  );
}, [selectedVariant]);



function handleSelect(attributeName, value) {

    const nextVariant = variants.find(variant => {

        const attrs = Object.fromEntries(
            variant.attributes.map(a => [a.attribute, a.value])
        );

        return Object.entries(selectedAttributes).every(([name, current]) => {

            if (name === attributeName)
                return attrs[name] === value;

            return attrs[name] === current;

        });

    });

    if (nextVariant) {
        onVariantChange(nextVariant);
    }

}

  if (!variants.length) return null;

  return (
    <div className="variant-selector">
      {Object.entries(attributeGroups).map(([attribute, values]) => (
        <div className="variant-group" key={attribute}>
          <h4 className="variant-title">
            {attribute}:{" "}
            <span>{selectedAttributes[attribute]}</span>
          </h4>

          <div className="variant-options">
            {values.map((value) => (
              <button
                key={value}
                className={`variant-option ${
                  selectedAttributes[attribute] === value
                    ? "active"
                    : ""
                }`}
                onClick={() => handleSelect(attribute, value)}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}