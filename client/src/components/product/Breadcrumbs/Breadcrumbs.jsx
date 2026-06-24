import { Link } from "react-router-dom";
import "./Breadcrumbs.css";

export default function Breadcrumbs({ items = [] }) {
  return (
    <nav className="breadcrumbs" aria-label="breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <span key={index} className="breadcrumb-item">
            {isLast ? (
              <span className="active">{item.label}</span>
            ) : (
              <>
                <Link to={item.path}>{item.label}</Link>
                <span className="separator">/</span>
              </>
            )}
          </span>
        );
      })}
    </nav>
  );
}