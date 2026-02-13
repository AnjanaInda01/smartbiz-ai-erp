package com.smartbiz.backend.service.impl;

import com.smartbiz.backend.dto.request.ProductCreateRequest;
import com.smartbiz.backend.dto.response.ProductResponse;
import com.smartbiz.backend.entity.Business;
import com.smartbiz.backend.entity.Product;
import com.smartbiz.backend.exception.ConflictException;
import com.smartbiz.backend.exception.ResourceNotFoundException;
import com.smartbiz.backend.repository.BusinessRepository;
import com.smartbiz.backend.repository.ProductRepository;
import com.smartbiz.backend.service.CurrentUserService;
import com.smartbiz.backend.service.ProductService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final BusinessRepository businessRepository;
    private final CurrentUserService currentUserService;


    @Override
    public ProductResponse create(ProductCreateRequest request) {
        Long businessId = currentUserService.getCurrentBusinessId();

        if (request.getSku() != null && !request.getSku().isBlank()) {
            if (productRepository.existsBySkuAndBusiness_Id(request.getSku(), businessId)) {
                throw new ConflictException("SKU already exists for this business");
            }
        }
        Business business = businessRepository.findById(businessId)
                .orElseThrow(() -> new ResourceNotFoundException("Business not found: " + businessId));

        Product p = new Product();
        p.setBusiness(business);
        p.setName(request.getName());
        p.setSku(request.getSku());
        p.setUnitPrice(request.getUnitPrice());
        p.setStockQty(request.getStockQty());
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
