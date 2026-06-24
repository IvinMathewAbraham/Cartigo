import { useEffect, useState } from "react";

import Header from "../components/layout/Header/Header";
import Footer from "../components/layout/Footer/Footer";

import Breadcrumbs from "../components/product/Breadcrumbs/Breadcrumbs";
import FilterSidebar from "../components/product/FilterSidebar/FilterSidebar";
import ProductToolbar from "../components/product/ProductToolbar/ProductToolbar";
import ProductGrid from "../components/product/ProductGrid/ProductGrid";
import Pagination from "../components/product/Pagination/Pagination";

import { getProducts } from "../services/product.service";
import { useSearchParams } from "react-router-dom";

import "./ProductListingPage.css";

export default function ProductListingPage() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(12);
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();

  const search = searchParams.get("search") || "";

  useEffect(() => {
    loadProducts();
  }, [page, search]);

  async function loadProducts(pageNumber = 1) {
    try {
      const response = await getProducts({
        page: pageNumber,
        search,
      });

      setProducts(response.products);
      setTotal(response.total);
      setPage(response.page);
      setLimit(response.limit);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  // Calculate total pages and the range of products being displayed
  const totalPages =
    Math.ceil(total / limit);

  // Calculate the range of products being displayed
  const start =
    (page - 1) * limit + 1;

  const end =
    Math.min(
      page * limit,
      total
    );


  return (
    <>
      <Header />

      <main className="listing-page">
        <Breadcrumbs />

        <div className="listing-layout">
          <FilterSidebar />

          <section className="listing-content">
            <ProductToolbar
              start={start}
              end={end}
              total={total}
            />

            <ProductGrid products={products} />
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}