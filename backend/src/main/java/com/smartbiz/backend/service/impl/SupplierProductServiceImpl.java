package com.smartbiz.backend.service.impl;

import com.smartbiz.backend.dto.request.SupplierProductCreateRequest;
import com.smartbiz.backend.dto.request.SupplierProductUpdateRequest;
import com.smartbiz.backend.dto.response.SupplierProductResponse;
import com.smartbiz.backend.entity.Business;
import com.smartbiz.backend.entity.Product;
import com.smartbiz.backend.entity.Supplier;
import com.smartbiz.backend.entity.SupplierProduct;
import com.smartbiz.backend.exception.ConflictException;
import com.smartbiz.backend.exception.ResourceNotFoundException;
import com.smartbiz.backend.repository.BusinessRepository;
import com.smartbiz.backend.repository.ProductRepository;
import com.smartbiz.backend.repository.SupplierProductRepository;
import com.smartbiz.backend.repository.SupplierRepository;
import com.smartbiz.backend.service.CurrentUserService;
import com.smartbiz.backend.service.SupplierProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class SupplierProductServiceImpl implements SupplierProductService {
    private final SupplierProductRepository supplierProductRepository;
    private final SupplierRepository supplierRepository;
    private final ProductRepository productRepository;
    private final BusinessRepository businessRepository;
    private final CurrentUserService currentUserService;

    @Override
    public SupplierProductResponse create(SupplierProductCreateRequest request) {
        Long businessId = currentUserService.getCurrentBusinessId();

        if (supplierProductRepository.existsByBusiness_IdAndSupplier_IdAndProduct_Id(
                businessId, request.getSupplierId(), request.getProductId()
        )) {
            throw new ConflictException("This supplier is already linked to this product");
        }

        Business business = businessRepository.findById(businessId)
                .orElseThrow(() -> new ResourceNotFoundException("Business not found: " + businessId));

        Supplier supplier = supplierRepository.findByIdAndBusiness_Id(request.getSupplierId(), businessId)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found: " + request.getSupplierId()));

        Product product = productRepository.findByIdAndBusiness_Id(request.getProductId(), businessId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + request.getProductId()));

        SupplierProduct sp = SupplierProduct.builder()
                .business(business)
                .supplier(supplier)
                .product(product)
                .costPrice(request.getCostPrice())
                .active(true)
                .build();

        return toResponse(supplierProductRepository.save(sp));
    }

    @Override
    public SupplierProductResponse update(Long id, SupplierProductUpdateRequest request) {
        Long businessId = currentUserService.getCurrentBusinessId();

        SupplierProduct sp = supplierProductRepository.findByIdAndBusiness_Id(id, businessId)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier-Product link not found: " + id));

        if (request.getCostPrice() != null) {
            sp.setCostPrice(request.getCostPrice());
        }
        if (request.getActive() != null) {
            sp.setActive(request.getActive());
        }

        return toResponse(supplierProductRepository.save(sp));
    }

    @Override
    public void delete(Long id) {
        Long businessId = currentUserService.getCurrentBusinessId();

        SupplierProduct sp = supplierProductRepository.findByIdAndBusiness_Id(id, businessId)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier-Product link not found: " + id));

        sp.setActive(false); // soft delete
        supplierProductRepository.save(sp);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SupplierProductResponse> getAllActive() {
        Long businessId = currentUserService.getCurrentBusinessId();
        return supplierProductRepository.findAllByBusiness_IdAndActiveTrue(businessId)
                .stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<SupplierProductResponse> getSuppliersForProduct(Long productId) {
        Long businessId = currentUserService.getCurrentBusinessId();
        return supplierProductRepository.findAllByBusiness_IdAndProduct_IdAndActiveTrue(businessId, productId)
                .stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<SupplierProductResponse> getProductsForSupplier(Long supplierId) {
        Long businessId = currentUserService.getCurrentBusinessId();
        return supplierProductRepository.findAllByBusiness_IdAndSupplier_IdAndActiveTrue(businessId, supplierId)
                .stream().map(this::toResponse).toList();
    }

    private SupplierProductResponse toResponse(SupplierProduct sp) {
        return new SupplierProductResponse(
                sp.getId(),
                sp.getSupplier().getId(),
                sp.getSupplier().getName(),
                sp.getProduct().getId(),
                sp.getProduct().getName(),
                sp.getProduct().getSku(),
                sp.getCostPrice(),
                sp.isActive(),
                sp.getCreatedAt(),
                sp.getUpdatedAt()
        );
    }
}
