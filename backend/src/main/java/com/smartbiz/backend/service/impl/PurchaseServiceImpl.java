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
    private final SupplierProductRepository supplierProductRepository;
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

            boolean linked = supplierProductRepository.existsByBusiness_IdAndSupplier_IdAndProduct_Id(
                    businessId, supplier.getId(), product.getId()
            );
            if (!linked) {
                throw new BadRequestException("Supplier " + supplier.getId() + " is not linked to product " + product.getId());
            }

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

        // Stock IN
        for (PurchaseItem item : purchase.getItems()) {
            Product product = item.getProduct();
            product.setStockQty(product.getStockQty() + item.getQty());
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
