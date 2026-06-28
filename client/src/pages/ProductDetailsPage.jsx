import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./ProductDetailsPage.css";

import { getProductById } from "../services/product.service";
import { getImageUrl } from "../utils/image";

import Breadcrumbs from "../components/product/Breadcrumbs/Breadcrumbs";
import ProductGallery from "../components/product/ProductGallery/ProductGallery";
import ProductInfo from "../components/product/ProductInfo/ProductInfo";
import ProductTabs from "../components/product/ProductTabs/ProductTabs";
import ProductDescription from "../components/product/ProductDescription/ProductDescription";
import SpecificationsTable from "../components/product/SpecificationsTable/SpecificationsTable";
import ReviewsSection from "../components/product/ReviewsSection/ReviewsSection";
import RelatedProducts from "../components/product/RelatedProducts/RelatedProducts";

import Header from "../components/layout/Header/Header";

export default function ProductDetailsPage() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);


  useEffect(() => {
    loadProduct();
  }, [id]);



  async function loadProduct() {
    try {
      const response = await getProductById(id);

      setProduct(response.data.data);

    } catch (error) {
      console.error(error);
    }
  }

  if (!product) {
    return <div>Loading...</div>;
  }
const galleryImages =
  product.images
    ?.map((image) => getImageUrl(image.url))
    .filter(Boolean) || [];

  const uiProduct = {
    name: product?.name || "",

    badge: product?.brand?.name || "",

    rating: 4.5,

    reviewCount: 0,

    price: product?.variants?.[0]?.price || 0,

    oldPrice: product?.variants?.[0]?.price || 0,

    discount: 0,

    inStock:
      product?.variants?.some(
        (variant) => variant.stock > 0
      ) || false,
  };



  return (

    <>
      <Header />
      <Breadcrumbs
        items={[
          { label: "Home", path: "/" },
          {
            label: product.category?.name || "Category",
            path: `/category/${product.category?.slug}`,
          },
          {
            label: product.name,
          },
        ]}
      />

      <section className="product-hero">
        <ProductGallery images={galleryImages} />

        <ProductInfo product={uiProduct} /> 
        {/*create a functional add to cart button*/}
      </section>

      <ProductTabs />

      <ProductDescription product={product} />

      <SpecificationsTable product={product} />

      <ReviewsSection productId={product.id} />

      <RelatedProducts categoryId={product.categoryId} />
    </>
  );
}