package com.smartbiz.backend.repository;

import com.smartbiz.backend.entity.InvoiceItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InvoiceItemRepository extends JpaRepository<InvoiceItem, Long> {
    List<InvoiceItem> findAllByInvoice_Id(Long invoiceId);
}
