package com.smartbiz.backend.repository;

import com.smartbiz.backend.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {

    Optional<Invoice> findByIdAndBusiness_Id(Long id, Long businessId);

    boolean existsByBusiness_IdAndInvoiceNo(Long businessId, String invoiceNo);

    List<Invoice> findAllByBusiness_IdOrderByIdDesc(Long businessId);

    long countByBusiness_IdAndInvoiceDate(Long businessId, LocalDate invoiceDate);
}
