import { describe, expect, it } from "vitest";
import { products } from "@/data/products";

describe("Gallery category assortment", () => {
  it.each(["rings", "watches", "straps"] as const)("contains six products in %s", (category) => {
    expect(products.filter((product) => product.category === category)).toHaveLength(6);
  });
});