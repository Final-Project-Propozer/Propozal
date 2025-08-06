package com.propozal.repository;

import com.propozal.domain.Product;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;


public class ProductSpecification {

    public static Specification<Product> withfilters(String keyword, Long lv1, Long lv2, Long lv3) {
        return (root, query, builder) -> {
            Predicate predicate = builder.conjunction();

            if (lv1 != null) {
                predicate = builder.and(predicate, builder.equal(root.get("categoryLv1").get("id"), lv1));
            }

            if (lv2 != null) {
                predicate = builder.and(predicate, builder.equal(root.get("categoryLv2").get("id"), lv2));
            }

            if (lv3 != null) {
                predicate = builder.and(predicate, builder.equal(root.get("categoryLv3").get("id"), lv3));
            }

            if (keyword != null && !keyword.isEmpty()) {
                String likeKeyword = "%" + keyword.toLowerCase() + "%";

                Predicate nameLike = builder.like(builder.lower(root.get("name")), likeKeyword);
                Predicate codeLike = builder.like(builder.lower(root.get("code")), likeKeyword);

                predicate = builder.and(predicate, builder.or(nameLike, codeLike));
            }
            return predicate;
        };
    }
}
