package com.smartbiz.backend.service;

import com.smartbiz.backend.dto.request.InvoiceCreateRequest;
import com.smartbiz.backend.dto.response.InvoiceResponse;

import java.util.List;

public interface InvoiceService {
    InvoiceResponse createDraft(InvoiceCreateRequest request);
    InvoiceResponse confirm(Long invoiceId); // stock OUT here
    InvoiceResponse getById(Long invoiceId);
    List<InvoiceResponse> list();
}
