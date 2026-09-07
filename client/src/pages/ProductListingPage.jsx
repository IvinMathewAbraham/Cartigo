import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";

import Header from "../components/layout/Header/Header";
import Footer from "../components/layout/Footer/Footer";

import Breadcrumbs from "../components/product/Breadcrumbs/Breadcrumbs";
import FilterSidebar from "../components/product/FilterSidebar/FilterSidebar";
import ProductToolbar from "../components/product/ProductToolbar/ProductToolbar";
import ProductGrid from "../components/product/ProductGrid/ProductGrid";
import Pagination from "../components/product/Pagination/Pagination";

import { getProducts } from "../services/product.service";

import "./ProductListingPage.css";

export default function ProductListingPage() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(12);
  const [loading, setLoading] = useState(true);

  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") || "";
  const categoryId = searchParams.get("categoryId") || "";
  const brandId = searchParams.get("brandId") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const sortBy = searchParams.get("sortBy") || "newest";

  const updateFilterParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setPage(1);
    setSearchParams(newParams);
  };

  const resetAllFilters = () => {
    const newParams = new URLSearchParams();
    if (search) newParams.set("search", search);
    setPage(1);
    setSearchParams(newParams);
  };

  const loadProducts = useCallback(async (pageNumber = page) => {
    try {
      setLoading(true);
      const response = await getProducts({
        page: pageNumber,
        limit,
        search,
        categoryId,
        brandId,
        maxPrice,
        sortBy,
      });

      setProducts(response.products || []);
      setTotal(response.total || 0);
      setPage(response.page || pageNumber);
      setLimit(response.limit || limit);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, categoryId, brandId, maxPrice, sortBy]);

  useEffect(() => {
    loadProducts(page);
  }, [loadProducts, page]);

  const totalPages = Math.ceil(total / limit) || 1;
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <>
      <Header />

      <main className="listing-page">
        <Breadcrumbs />

        <div className="listing-layout">
          <FilterSidebar
            selectedCategory={categoryId}
            onSelectCategory={(catId) => updateFilterParam("categoryId", catId)}
            selectedBrand={brandId}
            onSelectBrand={(bId) => updateFilterParam("brandId", bId)}
            maxPrice={maxPrice}
            onChangeMaxPrice={(price) => updateFilterParam("maxPrice", price)}
            onResetFilters={resetAllFilters}
          />

          <section className="listing-content">
            <ProductToolbar
              start={start}
              end={end}
              total={total}
              sortBy={sortBy}
              onChangeSortBy={(sort) => updateFilterParam("sortBy", sort)}
            />

            {loading ? (
              <div style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>
                Loading products...
              </div>
            ) : products.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center", background: "#f9fafb", borderRadius: "12px", margin: "20px 0" }}>
                <h3>No products found</h3>
                <p style={{ color: "#6b7280", marginTop: "8px" }}>Try adjusting your filters or search terms.</p>
              </div>
            ) : (
              <ProductGrid products={products} />
            )}

            {totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            )}
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}