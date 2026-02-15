package com.smartbiz.backend.repository;

import com.smartbiz.backend.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {

    Optional<Invoice> findByIdAndBusiness_Id(Long id, Long businessId);

    boolean existsByBusiness_IdAndInvoiceNo(Long businessId, String invoiceNo);

    List<Invoice> findAllByBusiness_IdOrderByIdDesc(Long businessId);

    long countByBusiness_IdAndInvoiceDate(Long businessId, LocalDate invoiceDate);


    @Query("""
        select coalesce(sum(i.grandTotal), 0)
        from Invoice i
        where i.business.id = :businessId
          and i.status = com.smartbiz.backend.enums.InvoiceStatus.CONFIRMED
          and i.invoiceDate = :date
    """)
    BigDecimal sumSalesForDate(Long businessId, LocalDate date);

    @Query("""
        select coalesce(sum(i.grandTotal), 0)
        from Invoice i
        where i.business.id = :businessId
          and i.status = com.smartbiz.backend.enums.InvoiceStatus.CONFIRMED
          and i.invoiceDate between :from and :to
    """)
    BigDecimal sumSalesBetween(Long businessId, LocalDate from, LocalDate to);
}
