package com.smartbiz.backend.service.impl;

import com.smartbiz.backend.dto.request.PurchaseCreateRequest;
import com.smartbiz.backend.dto.request.PurchaseItemRequest;
import com.smartbiz.backend.dto.response.PurchaseResponse;
import com.smartbiz.backend.entity.*;
import com.smartbiz.backend.enums.PurchaseStatus;
import com.smartbiz.backend.exception.BadRequestException;
import com.smartbiz.backend.exception.ResourceNotFoundException;
import com.smartbiz.backend.repository.*;
import com.smartbiz.backend.service.CurrentUserService;
import com.smartbiz.backend.service.PurchaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PurchaseServiceImpl implements PurchaseService {

    private final PurchaseRepository purchaseRepository;
    private final BusinessRepository businessRepository;
    private final SupplierRepository supplierRepository;
    private final ProductRepository productRepository;
    private final CurrentUserService currentUserService;

    @Override
    public PurchaseResponse create(PurchaseCreateRequest request) {
        Long businessId = currentUserService.getCurrentBusinessId();

        Business business = businessRepository.findById(businessId)
                .orElseThrow(() -> new ResourceNotFoundException("Business not found: " + businessId));

        Supplier supplier = supplierRepository.findByIdAndBusiness_Id(request.getSupplierId(), businessId)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found: " + request.getSupplierId()));

        Purchase purchase = new Purchase();
        purchase.setBusiness(business);
        purchase.setSupplier(supplier);
        purchase.setPurchaseNo(generatePurchaseNo(businessId));
        purchase.setPurchaseDate(request.getPurchaseDate() != null ? request.getPurchaseDate() : LocalDate.now());
        purchase.setStatus(PurchaseStatus.DRAFT);

        BigDecimal total = BigDecimal.ZERO;

        for (PurchaseItemRequest itemReq : request.getItems()) {

            Product product = productRepository.findByIdAndBusiness_Id(itemReq.getProductId(), businessId)
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + itemReq.getProductId()));

            // Allow any supplier to purchase any product - no pre-linking required
            // The purchase itself creates the relationship between supplier and product
            // This supports the business model where:
            // - Many suppliers can provide the same product category in various brands
            // - One supplier can provide many products
            // - One product category can be supplied by many supplier brands

            BigDecimal lineTotal = itemReq.getCostPrice().multiply(BigDecimal.valueOf(itemReq.getQty()));
            total = total.add(lineTotal);

            PurchaseItem pi = new PurchaseItem();
            pi.setPurchase(purchase);
            pi.setProduct(product);
            pi.setQty(itemReq.getQty());
            pi.setCostPrice(itemReq.getCostPrice());
            pi.setLineTotal(lineTotal);

            purchase.getItems().add(pi);
        }

        purchase.setTotalCost(total);

        Purchase saved = purchaseRepository.save(purchase);
        return toResponse(saved);
    }

    @Override
    public PurchaseResponse confirm(Long id) {
        Long businessId = currentUserService.getCurrentBusinessId();

        Purchase purchase = purchaseRepository.findByIdAndBusiness_Id(id, businessId)
                .orElseThrow(() -> new ResourceNotFoundException("Purchase not found: " + id));

        if (purchase.getStatus() == PurchaseStatus.CONFIRMED) {
            return toResponse(purchase);
        }
        if (purchase.getStatus() == PurchaseStatus.CANCELLED) {
            throw new BadRequestException("Cancelled purchase cannot be confirmed");
        }

        // Stock IN - Update inventory and cost prices
        for (PurchaseItem item : purchase.getItems()) {
            Product product = item.getProduct();
            
            // Increase stock quantity
            product.setStockQty(product.getStockQty() + item.getQty());
            
            // Update cost prices for profit calculation
            // costPrice = average cost (for accurate profit tracking)
            // lastCostPrice = latest purchase cost
            BigDecimal newCostPrice = item.getCostPrice();
            product.setLastCostPrice(newCostPrice);
            
            // Calculate average cost price (weighted average)
            int oldStock = product.getStockQty() - item.getQty();
            if (oldStock > 0 && product.getCostPrice() != null && product.getCostPrice().compareTo(BigDecimal.ZERO) > 0) {
                // Weighted average: (oldStock * oldCost + newQty * newCost) / totalStock
                BigDecimal oldTotalCost = product.getCostPrice().multiply(BigDecimal.valueOf(oldStock));
                BigDecimal newTotalCost = newCostPrice.multiply(BigDecimal.valueOf(item.getQty()));
                BigDecimal totalCost = oldTotalCost.add(newTotalCost);
                BigDecimal averageCost = totalCost.divide(BigDecimal.valueOf(product.getStockQty()), 2, java.math.RoundingMode.HALF_UP);
                product.setCostPrice(averageCost);
            } else {
                // First purchase or no previous stock - use purchase cost price
                product.setCostPrice(newCostPrice);
            }
            
            productRepository.save(product);
        }

        purchase.setStatus(PurchaseStatus.CONFIRMED);
        return toResponse(purchaseRepository.save(purchase));
    }

    @Override
    @Transactional(readOnly = true)
    public List<PurchaseResponse> getAll() {
        Long businessId = currentUserService.getCurrentBusinessId();
        return purchaseRepository.findAllByBusiness_IdOrderByIdDesc(businessId)
                .stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public PurchaseResponse getById(Long id) {
        Long businessId = currentUserService.getCurrentBusinessId();
        Purchase p = purchaseRepository.findByIdAndBusiness_Id(id, businessId)
                .orElseThrow(() -> new ResourceNotFoundException("Purchase not found: " + id));
        return toResponse(p);
    }

    private PurchaseResponse toResponse(Purchase p) {
        return new PurchaseResponse(
                p.getId(),
                p.getPurchaseNo(),
                p.getPurchaseDate(),
                p.getStatus(),
                p.getTotalCost()
        );
    }

    private String generatePurchaseNo(Long businessId) {
        long seq = purchaseRepository.countByBusiness_Id(businessId) + 1;
        String date = LocalDate.now().toString().replace("-", "");
        return "PO-" + date + "-" + String.format("%04d", seq);
    }
}
