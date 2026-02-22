import { faker } from '@faker-js/faker';
import {
    UserRegistrationData,
    LoginData,
    ContactFormData,
    ProductData,
    PaymentData,
    SubscriptionData,
    ProductSearchData,
} from '../types/TestData.types';

/**
 * TestDataHelper - Provides typed test data for all test cases.
 * Can use static data or dynamically generated data via Faker.
 */
export class TestDataHelper {

    /**
     * Generate dynamic user registration data with unique email
     */
    static generateUserData(overrides?: Partial<UserRegistrationData>): UserRegistrationData {
        return {
            title: 'Mr.',
            firstName: faker.person.firstName('male'),
            lastName: faker.person.lastName(),
            email: `test_${faker.string.alphanumeric(8)}@mailinator.com`,
            password: 'Test@1234',
            dateOfBirth: '15',
            monthOfBirth: 'January',
            yearOfBirth: '1990',
            firstName_address: faker.person.firstName('male'),
            lastName_address: faker.person.lastName(),
            company: faker.company.name(),
            address1: faker.location.streetAddress(),
            address2: faker.location.secondaryAddress(),
            country: 'United States',
            state: 'California',
            city: faker.location.city(),
            zipcode: faker.location.zipCode('#####'),
            mobileNumber: faker.phone.number('##########'),
            ...overrides,
        };
    }

    /**
     * Valid login credentials (matches .env or Excel)
     */
    static getValidLoginData(): LoginData {
        return {
            email: process.env.VALID_EMAIL || 'testuser@mailinator.com',
            password: process.env.VALID_PASSWORD || 'Test@1234',
            expectedResult: 'success',
        };
    }

    /**
     * Invalid login credentials to test error handling
     */
    static getInvalidLoginData(): LoginData {
        return {
            email: 'invalid_user@mailinator.com',
            password: 'WrongPassword!',
            expectedResult: 'failure',
            errorMessage: 'Your email or password is incorrect!',
        };
    }

    /**
     * Product search test data
     */
    static getProductSearchData(): ProductSearchData {
        return {
            searchTerm: 'Top',
            expectedResults: 'Searched Products',
        };
    }

    /**
     * Contact form test data
     */
    static getContactFormData(): ContactFormData {
        return {
            name: faker.person.fullName(),
            email: faker.internet.email(),
            subject: `Automation Test - ${faker.string.alphanumeric(6)}`,
            message: faker.lorem.paragraph(),
        };
    }

    /**
     * Product data for cart/checkout tests
     */
    static getProductData(): ProductData {
        return {
            productName: 'Blue Top',
            category: 'Women',
            quantity: 1,
        };
    }

    /**
     * Payment card data (test data only)
     */
    static getPaymentData(): PaymentData {
        return {
            cardName: faker.person.fullName(),
            cardNumber: '4111111111111111',
            cvc: '123',
            expiryMonth: '12',
            expiryYear: '2027',
        };
    }

    /**
     * Subscription test data
     */
    static getSubscriptionData(): SubscriptionData {
        return {
            email: `subscribe_${faker.string.alphanumeric(6)}@mailinator.com`,
        };
    }
}
