package dev.baotrinh.personal_site_api;

import dev.baotrinh.personal_site_api.dto.VisitRequest;
import dev.baotrinh.personal_site_api.dto.VisitResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.function.Function;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("dev")
class PersonalSiteApiApplicationTests {

	@Autowired(required = false)
	private Function<VisitRequest, VisitResponse> visitFunction;

	@Test
	void contextLoads() {
		// Verify that the Spring context loads successfully
		assertNotNull(visitFunction, "Visit function should be loaded");
	}

	@Test
	void visitFunctionExists() {
		// Verify that the visit function bean is available
		assertNotNull(visitFunction, "Visit function bean should exist");
	}

	@Test
	void visitRequestCreation() {
		// Test DTO creation and defaults
		VisitRequest request1 = new VisitRequest();
		assertEquals("home", request1.getPage());
		assertNull(request1.getUserAgent());

		VisitRequest request2 = new VisitRequest("about", "test-agent");
		assertEquals("about", request2.getPage());
		assertEquals("test-agent", request2.getUserAgent());
	}

	@Test
	void visitResponseCreation() {
		// Test response DTO creation
		VisitResponse successResponse = VisitResponse.success(42L);
		assertEquals(42L, successResponse.getCount());
		assertTrue(successResponse.isSuccess());
		assertNotNull(successResponse.getTimestamp());

		VisitResponse failureResponse = VisitResponse.failure();
		assertEquals(0L, failureResponse.getCount());
		assertFalse(failureResponse.isSuccess());
		assertNotNull(failureResponse.getTimestamp());
	}
}
