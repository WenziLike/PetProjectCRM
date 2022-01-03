package com.crm.backendcrm.monitoring;

import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;

@Component
public class DatabaseService implements HealthIndicator {

    private final String DATABASE_SERVICE = "DatabaseService";

    @Override
    public Health health() {
        if (isDatabaseHealth()) {
            return Health.up().withDetail(DATABASE_SERVICE, "Service is running").build();
        }
        return Health.down().withDetail(DATABASE_SERVICE, "Service in not available").build();
    }

    private boolean isDatabaseHealth() {
        //logic
        return true;
    }
}
