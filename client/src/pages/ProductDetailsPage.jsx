import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../components/layout/Header/Header";
import Footer from "../components/layout/Footer/Footer";
import Breadcrumbs from "../components/product/Breadcrumbs/Breadcrumbs";
import ProductGallery from "../components/product/ProductGallery/ProductGallery";
import ProductInfo from "../components/product/ProductInfo/ProductInfo";
import ProductTabs from "../components/product/ProductTabs/ProductTabs";
import ProductDescription from "../components/product/ProductDescription/ProductDescription";
import SpecificationsTable from "../components/product/SpecificationsTable/SpecificationsTable";
import ReviewsSection from "../components/product/ReviewsSection/ReviewsSection";
import RelatedProducts from "../components/product/RelatedProducts/RelatedProducts";

import { getProductById } from "../services/product.service";
import { getImageUrl } from "../utils/image";
import "./ProductDetailsPage.css";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProduct();
  }, [id]);

  useEffect(() => {
    if (product?.variants?.length) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product]);

  async function loadProduct() {
    try {
      setLoading(true);
      const response = await getProductById(id);
      setProduct(response.data?.data || response.data || null);
    } catch (error) {
      console.error("Failed to load product details:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="container pdp-loading-state">
          <div className="pdp-spinner" />
          <p>Loading product details...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <div className="container pdp-empty-state">
          <h2>Product Not Found</h2>
          <p>The product you are looking for does not exist or has been removed.</p>
        </div>
        <Footer />
      </>
    );
  }

  const galleryImages =
    product.images
      ?.map((image) => getImageUrl(image.url))
      .filter(Boolean) || [];

  const currentVariant = selectedVariant || product.variants?.[0];

  const uiProduct = {
    id: product.id,
    name: product.name || "",
    badge: product.brand?.name || product.category?.name || "Cartigo Choice",
    rating: product.rating || 4.5,
    reviewCount: product.reviewsCount || product.reviews?.length || 24,
    price: currentVariant?.price || 0,
    oldPrice: currentVariant?.price ? Math.round(Number(currentVariant.price) * 1.25) : 0,
    variant: currentVariant,
    inStock: (currentVariant?.stock ?? 1) > 0,
  };

  return (
    <div className="pdp-page-wrapper">
      <Header />

      <main className="container pdp-main-content">
        <Breadcrumbs
          items={[
            { label: "Home", path: "/" },
            {
              label: product.category?.name || "Products",
              path: `/products?category=${encodeURIComponent(product.category?.name || '')}`,
            },
            {
              label: product.name,
            },
          ]}
        />

        {/* 2-Column Product Showcase Grid */}
        <section className="product-showcase-grid">
          <div className="showcase-gallery-column">
            <ProductGallery images={galleryImages} productName={product.name} />
          </div>

          <div className="showcase-info-column">
            <ProductInfo
              product={uiProduct}
              variants={product.variants}
              selectedVariant={selectedVariant}
              onVariantChange={setSelectedVariant}
            />
          </div>
        </section>

        {/* Product Details Tabs (Description, Specs, Reviews) */}
        <ProductTabs />
        <ProductDescription product={product} />
        <SpecificationsTable product={product} />
        <ReviewsSection productId={product.id} />
        <RelatedProducts categoryId={product.categoryId} />
      </main>

      <Footer />
    </div>
  );
}