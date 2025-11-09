package dev.baotrinh.personal_site_api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main application class for the Personal Site API.
 * This application is designed to run as an AWS Lambda function using Spring Cloud Function.
 */
@SpringBootApplication
public class PersonalSiteApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(PersonalSiteApiApplication.class, args);
	}
}
