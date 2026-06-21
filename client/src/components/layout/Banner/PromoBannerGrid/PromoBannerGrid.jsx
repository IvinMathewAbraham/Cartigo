import PromoBanner from "../PromoBanner/PromoBanner.jsx";
import "./PromoBannerGrid.css";
import vegetables from "../../../../assets/banners/vegetables.png";
import s24 from "../../../../assets/banners/s24.png";
import grocery from "../../../../assets/banners/grocery.png";

export default function PromoBannerGrid() {
  return (
    <section className="banner-grid">

      <PromoBanner
        title="Daily Groceries"
        subtitle="Up To 50% Off"
        image={grocery}
        bgColor="linear-gradient(135deg,#ff594d,#ff2d20)"
        imageSize="120px"
        pattern="pattern-dots"
      />

      <PromoBanner
        title="Galaxy S24 FE"
        subtitle="Samsung"
        image={s24}
        bgColor="linear-gradient(135deg,#dcecff,#c8daf3)"
        imageSize="240px"
        pattern="pattern-wave"  
      />

      <PromoBanner
        title="Fresh Vegetables"
        subtitle="Farm Fresh"
        image={vegetables}
        bgColor="linear-gradient(135deg,#c2185b,#e91e63)"
        imageSize="200px"
        pattern="pattern-grid"
      />

    </section>
  );
}