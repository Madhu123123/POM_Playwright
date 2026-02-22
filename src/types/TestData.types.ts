/**
 * Test control interface - maps to Excel TestControl sheet
 */
export interface TestControl {
    testId: string;
    testName: string;
    run: 'Y' | 'N';
    description: string;
    priority: 'High' | 'Medium' | 'Low';
    tag: string;
}

/**
 * User registration data interface
 */
export interface UserRegistrationData {
    title: 'Mr.' | 'Mrs.';
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    dateOfBirth: string;
    monthOfBirth: string;
    yearOfBirth: string;
    firstName_address: string;
    lastName_address: string;
    company: string;
    address1: string;
    address2: string;
    country: string;
    state: string;
    city: string;
    zipcode: string;
    mobileNumber: string;
}

/**
 * Login data interface
 */
export interface LoginData {
    email: string;
    password: string;
    expectedResult: 'success' | 'failure';
    errorMessage?: string;
}

/**
 * Product search data interface
 */
export interface ProductSearchData {
    searchTerm: string;
    expectedResults: string;
}

/**
 * Contact form data interface
 */
export interface ContactFormData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

/**
 * Product data interface
 */
export interface ProductData {
    productName: string;
    category: string;
    quantity: number;
}

/**
 * Payment data interface
 */
export interface PaymentData {
    cardName: string;
    cardNumber: string;
    cvc: string;
    expiryMonth: string;
    expiryYear: string;
}

/**
 * Subscription data interface
 */
export interface SubscriptionData {
    email: string;
}

/**
 * All test data combined
 */
export interface AllTestData {
    testControl: TestControl[];
    userRegistration: UserRegistrationData;
    loginValid: LoginData;
    loginInvalid: LoginData;
    productSearch: ProductSearchData;
    contactForm: ContactFormData;
    product: ProductData;
    payment: PaymentData;
    subscription: SubscriptionData;
}
