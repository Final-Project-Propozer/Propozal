package com.propozal.repository;

import com.propozal.domain.ActivityLog;
import com.propozal.dto.admin.ActivityLogFilterRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

public class ActivityLogSpecifications {

    public static Specification<ActivityLog> build(ActivityLogFilterRequest f) {
        Specification<ActivityLog> spec = (root, query, cb) -> cb.conjunction();

        if (f == null) return spec;

        if (f.getUserId() != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("user").get("id"), f.getUserId()));
        }
        if (StringUtils.hasText(f.getUsername())) {
            String like = "%" + f.getUsername().toLowerCase() + "%";
            spec = spec.and((root, query, cb) -> cb.like(cb.lower(root.get("username")), like));
        }
        if (f.getActionType() != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("actionType"), f.getActionType()));
        }
        if (f.getFrom() != null) {
            spec = spec.and((root, query, cb) -> cb.greaterThanOrEqualTo(root.get("createdAt"), f.getFrom()));
        }
        if (f.getTo() != null) {
            spec = spec.and((root, query, cb) -> cb.lessThanOrEqualTo(root.get("createdAt"), f.getTo()));
        }
        if (StringUtils.hasText(f.getResourceType())) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("resourceType"), f.getResourceType()));
        }
        if (StringUtils.hasText(f.getResourceId())) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("resourceId"), f.getResourceId()));
        }
        return spec;
    }
}
