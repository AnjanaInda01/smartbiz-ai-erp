package com.smartbiz.backend.service.impl;

import com.smartbiz.backend.dto.request.ProductCreateRequest;
import com.smartbiz.backend.dto.response.ProductResponse;
import com.smartbiz.backend.entity.Business;
import com.smartbiz.backend.entity.Product;
import com.smartbiz.backend.exception.BadRequestException;
import com.smartbiz.backend.exception.ConflictException;
import com.smartbiz.backend.exception.ResourceNotFoundException;
import com.smartbiz.backend.repository.BusinessRepository;
import com.smartbiz.backend.repository.ProductRepository;
import com.smartbiz.backend.service.CurrentUserService;
import com.smartbiz.backend.service.ProductService;
import com.smartbiz.backend.service.SubscriptionAssignmentService;
import com.smartbiz.backend.service.SubscriptionService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CurrentUserService currentUserService;
    private final SubscriptionService subscriptionService;
    private final SubscriptionAssignmentService subscriptionAssignmentService;

    @Override
    public ProductResponse create(ProductCreateRequest request) {

        Long businessId = currentUserService.getCurrentBusinessId();

        // 🔥 PLAN LIMIT CHECK
        long currentProductCount =
                productRepository.countByBusiness_Id(businessId);

        try {
            int maxProducts =
                    subscriptionService.getCurrentPlan(businessId)
                            .getMaxProducts();

            // Check limit only if maxProducts is not unlimited (-1)
            if (maxProducts != -1 && currentProductCount >= maxProducts) {
                throw new ConflictException("Product limit reached for your subscription plan. Please upgrade your plan to add more products.");
            }
        } catch (Exception e) {
            // If no subscription found, try to assign FREE plan automatically
            if (e instanceof BadRequestException && e.getMessage().contains("No active subscription")) {
                try {
                    subscriptionAssignmentService.assignFreePlanToBusinessIfNeeded(businessId);
                    // Retry getting the plan after assignment
                    int maxProducts = subscriptionService.getCurrentPlan(businessId).getMaxProducts();
                    if (maxProducts != -1 && currentProductCount >= maxProducts) {
                        throw new ConflictException("Product limit reached for your subscription plan. Please upgrade your plan to add more products.");
                    }
                } catch (Exception retryException) {
                    // If assignment fails, allow creation anyway (graceful degradation)
                    // This handles edge cases where FREE plan doesn't exist yet
                }
            } else if (e instanceof ConflictException) {
                throw e;
            }
            // Otherwise, continue without limit check (for businesses without subscription)
        }

        if (request.getSku() != null && !request.getSku().isBlank()) {
            if (productRepository.existsBySkuAndBusiness_Id(request.getSku(), businessId)) {
                throw new ConflictException("SKU already exists for this business");
            }
        }

        Business business = currentUserService.getCurrentUser().getBusiness();

        Product p = new Product();
        p.setBusiness(business);
        p.setName(request.getName());
        p.setSku(request.getSku());
        p.setUnitPrice(request.getUnitPrice());
        p.setStockQty(request.getStockQty());
        // Set costPrice - use provided value or default to 0
        p.setCostPrice(request.getCostPrice() != null ? request.getCostPrice() : BigDecimal.ZERO);
        p.setLastCostPrice(request.getCostPrice() != null ? request.getCostPrice() : BigDecimal.ZERO);
        p.setActive(true);

        return toResponse(productRepository.save(p));
    }


    @Override
    public List<ProductResponse> getAll() {
        Long businessId = currentUserService.getCurrentBusinessId();
        return productRepository.findAllByBusiness_Id(businessId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public ProductResponse getById(Long id) {
        Long businessId = currentUserService.getCurrentBusinessId();
        Product p = productRepository.findByIdAndBusiness_Id(id, businessId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + id));
        return toResponse(p);
    }

    @Override
    public ProductResponse update(Long id, ProductCreateRequest request) {
        Long businessId = currentUserService.getCurrentBusinessId();

        Product p = productRepository.findByIdAndBusiness_Id(id, businessId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + id));

        // optional SKU check
        String newSku = request.getSku();
        if (newSku != null && !newSku.isBlank()) {
            boolean skuTaken = productRepository.existsBySkuAndBusiness_Id(newSku, businessId);
            if (skuTaken && (p.getSku() == null || !p.getSku().equals(newSku))) {
                throw new ConflictException("SKU already exists for this business");
            }
        }

        p.setName(request.getName());
        p.setSku(request.getSku());
        p.setUnitPrice(request.getUnitPrice());
        p.setStockQty(request.getStockQty());
        // Update costPrice if provided in request
        if (request.getCostPrice() != null) {
            p.setCostPrice(request.getCostPrice());
            p.setLastCostPrice(request.getCostPrice());
        }

        return toResponse(productRepository.save(p));
    }

    @Override
    public void delete(Long id) {
        Long businessId = currentUserService.getCurrentBusinessId();

        Product p = productRepository.findByIdAndBusiness_Id(id, businessId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + id));

        productRepository.delete(p);
    }

    private ProductResponse toResponse(Product p) {
        return new ProductResponse(
                p.getId(),
                p.getName(),
                p.getSku(),
                p.getUnitPrice(),
                p.getStockQty(),
                p.getActive()
        );
    }
}
