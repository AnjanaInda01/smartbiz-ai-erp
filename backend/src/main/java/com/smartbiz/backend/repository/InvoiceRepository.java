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


    @Query("""
            select coalesce(sum((ii.unitPrice - ii.costPrice) * ii.qty), 0)
            from InvoiceItem ii
            where ii.invoice.business.id = :businessId
              and ii.invoice.status = com.smartbiz.backend.enums.InvoiceStatus.CONFIRMED
              and ii.invoice.invoiceDate = :date
            """)
    BigDecimal calculateProfitForDate(Long businessId, LocalDate date);

    @Query("""
            select coalesce(sum((ii.unitPrice - ii.costPrice) * ii.qty), 0)
            from InvoiceItem ii
            where ii.invoice.business.id = :businessId
              and ii.invoice.status = com.smartbiz.backend.enums.InvoiceStatus.CONFIRMED
              and ii.invoice.invoiceDate between :from and :to
            """)
    BigDecimal calculateProfitBetween(Long businessId, LocalDate from, LocalDate to);


}
