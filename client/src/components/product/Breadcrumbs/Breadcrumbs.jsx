import "./Breadcrumbs.css";

export default function Breadcrumbs({ items }) {
  return (
    <div className="breadcrumbs">
      {items.map((item, index) => (
        <span key={index}>
          {index === items.length - 1 ? (
            <strong>{item}</strong>
          ) : (
            <>
              <span>{item}</span>
              <span className="separator">/</span>
            </>
          )}
        </span>
      ))}
    </div>
  );
}

{/* <Breadcrumbs
  items={[
    { label: "Home", path: "/" },
    { label: "Electronics", path: "/electronics" },
    { label: "Laptops", path: "/laptops" },
    { label: "MacBook Pro" }
  ]}
/> 

how do this work?

*/}