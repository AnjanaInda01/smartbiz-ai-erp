package com.smartbiz.backend.service;

import com.smartbiz.backend.entity.User;

public interface CurrentUserService {
    User getCurrentUser();
    Long getCurrentBusinessId();
}
