# Implementation Plan: Stock Module CRUD

## Overview

This implementation plan breaks down the Stock Module CRUD feature into discrete, actionable coding tasks. Each task builds incrementally on previous work, with testing integrated throughout to catch errors early. The implementation follows the existing codebase patterns using Node.js, Express, Prisma ORM, and PostgreSQL.

## Tasks

- [x] 1. Set up Stock data model in Prisma schema
  - Add Stock model to `backend/prisma/schema.prisma` with all required fields (id, name, description, quantity, price, category, supplier, createdAt, updatedAt)
  - Run Prisma migration to create database table
  - Generate Prisma client
  - _Requirements: 1.1_

- [ ] 2. Implement input validation functions
  - [x] 2.1 Create validation utility functions in `backend/src/utils/validation.js`
    - Implement `validateCreateStock(data)` function
    - Implement `validateUpdateStock(data)` function
    - Both functions should return array of error messages
    - _Requirements: 1.2, 1.3, 1.4, 3.2, 4.4_
  
  - [ ]* 2.2 Write property test for name validation
    - **Property 2: Name validation**
    - **Validates: Requirements 1.2**
  
  - [ ]* 2.3 Write property test for quantity validation
    - **Property 3: Quantity non-negativity**
    - **Validates: Requirements 1.3**
  
  - [ ]* 2.4 Write property test for price validation
    - **Property 4: Price positivity**
    - **Validates: Requirements 1.4**
  
  - [ ]* 2.5 Write property test for validation idempotence
    - **Property 14: Idempotent validation**
    - **Validates: Requirements 3.2, 4.4**

- [ ] 3. Implement Stock controller with all CRUD operations
  - [x] 3.1 Create `getAllStock` controller function
    - Implement pagination logic (page, limit query params with defaults)
    - Support optional filtering by category and supplier
    - Return paginated response with metadata
    - _Requirements: 2.1, 2.2_
  
  - [ ] 3.2 Create `getStockById` controller function
    - Parse and validate ID parameter
    - Query database for stock item
    - Return 404 if not found, 400 if invalid ID
    - _Requirements: 2.3, 2.4, 7.1_
  
  - [-] 3.3 Create `createStock` controller function
    - Validate request body using validation utility
    - Create stock item in database
    - Return created item with 201 status
    - _Requirements: 3.1, 3.2_
  
  - [ ] 3.4 Create `updateStock` controller function
    - Parse and validate ID parameter
    - Validate request body for partial updates
    - Update stock item in database
    - Return 404 if not found, 400 if invalid
    - _Requirements: 4.1, 4.2, 4.3, 4.4_
  
  - [ ] 3.5 Create `deleteStock` controller function
    - Parse and validate ID parameter
    - Delete stock item from database
    - Return success message or 404 if not found
    - _Requirements: 5.1, 5.2_

- [ ] 4. Set up Stock routes with authentication and authorization
  - Configure routes in `backend/src/routes/stockRoutes.js`
  - Apply authMiddleware to all routes
  - Apply roleMiddleware(['admin']) to write operations (POST, PUT, DELETE)
  - Wire up all controller functions to appropriate HTTP methods and paths
  - _Requirements: 6.1, 6.2, 6.3_

- [ ] 5. Integrate Stock routes into main application
  - Import stockRoutes in `backend/src/app.js`
  - Mount routes at `/api/stock` path
  - Ensure routes are registered before error middleware
  - _Requirements: All_

- [ ] 6. Write property-based tests for CRUD operations
  - [ ]* 6.1 Write property test for create-then-retrieve consistency
    - **Property 5: Create-then-retrieve consistency (Round trip)**
    - **Validates: Requirements 3.1, 3.3**
  
  - [ ]* 6.2 Write property test for update preserves unmodified fields
    - **Property 6: Update preserves unmodified fields**
    - **Validates: Requirements 4.2**
  
  - [ ]* 6.3 Write property test for update-then-retrieve consistency
    - **Property 7: Update-then-retrieve consistency**
    - **Validates: Requirements 4.1**
  
  - [ ]* 6.4 Write property test for delete removes item
    - **Property 8: Delete removes item**
    - **Validates: Requirements 5.1, 5.3**
  
  - [ ]* 6.5 Write property test for pagination correctness
    - **Property 9: Pagination subset correctness**
    - **Validates: Requirements 2.1, 2.2**

- [ ] 7. Write property-based tests for authentication and authorization
  - [ ]* 7.1 Write property test for authentication requirement
    - **Property 10: Authentication requirement**
    - **Validates: Requirements 6.1**
  
  - [ ]* 7.2 Write property test for admin-only write operations
    - **Property 11: Admin-only write operations**
    - **Validates: Requirements 6.2**
  
  - [ ]* 7.3 Write property test for authenticated read access
    - **Property 12: Authenticated read access**
    - **Validates: Requirements 6.3**

- [ ] 8. Write property-based tests for error handling
  - [ ]* 8.1 Write property test for invalid input rejection
    - **Property 13: Invalid input rejection**
    - **Validates: Requirements 3.2, 4.4, 7.3**

- [ ] 9. Write unit tests for edge cases and specific scenarios
  - [ ]* 9.1 Write unit test for non-existent stock item (404)
    - Test GET, PUT, DELETE with non-existent ID
    - _Requirements: 2.4, 4.3, 5.2_
  
  - [ ]* 9.2 Write unit test for invalid ID format (400)
    - Test with non-numeric and negative IDs
    - _Requirements: 7.1_
  
  - [ ]* 9.3 Write unit test for creating stock with only required fields
    - Verify optional fields default to null
    - _Requirements: 1.1, 3.1_
  
  - [ ]* 9.4 Write unit test for creating stock with all fields
    - Verify all fields are stored correctly
    - _Requirements: 1.1, 3.1_
  
  - [ ]* 9.5 Write unit test for partial update (single field)
    - Update only quantity, verify other fields unchanged
    - _Requirements: 4.2_
  
  - [ ]* 9.6 Write unit test for empty database pagination
    - Verify correct response when no stock items exist
    - _Requirements: 2.1, 2.2_

- [ ] 10. Checkpoint - Ensure all tests pass
  - Run all unit tests and property tests
  - Verify test coverage meets goals (80% line coverage, 75% branch coverage)
  - Ensure all tests pass, ask the user if questions arise

- [ ] 11. Create Postman collection for manual testing
  - [ ] 11.1 Set up Postman environment with variables
    - Create environment with baseUrl, adminToken, userToken, stockId
    - _Requirements: All_
  
  - [ ] 11.2 Create authentication test requests
    - Test missing token (401)
    - Test invalid token (401)
    - _Requirements: 6.1_
  
  - [ ] 11.3 Create authorization test requests
    - Test regular user attempting write operations (403)
    - Test admin user write operations (success)
    - _Requirements: 6.2, 6.3_
  
  - [ ] 11.4 Create CRUD operation requests
    - POST /api/stock (create)
    - GET /api/stock (list with pagination)
    - GET /api/stock/:id (get single)
    - PUT /api/stock/:id (update)
    - DELETE /api/stock/:id (delete)
    - _Requirements: 2.1, 2.2, 2.3, 3.1, 4.1, 5.1_
  
  - [ ] 11.5 Create validation test requests
    - Test missing required fields
    - Test invalid data types
    - Test out-of-range values
    - _Requirements: 1.2, 1.3, 1.4, 3.2, 4.4_
  
  - [ ] 11.6 Add Postman test scripts for automated assertions
    - Add status code checks
    - Add response body validation
    - Add dynamic variable extraction (stockId)
    - _Requirements: All_

- [ ] 12. Add code comments and documentation
  - Add JSDoc comments to all controller functions
  - Add comments explaining validation logic
  - Add comments for authentication/authorization flow
  - Document pagination logic
  - _Requirements: All_

- [ ] 13. Final checkpoint - Complete testing and verification
  - Run full test suite (unit + property tests)
  - Execute Postman collection end-to-end
  - Verify all 5 endpoints working correctly
  - Verify authentication and authorization working
  - Verify input validation working
  - Ensure all tests pass, ask the user if questions arise

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties with 100+ iterations
- Unit tests validate specific examples and edge cases
- Postman collection enables manual verification of all functionality
- Checkpoints ensure incremental validation throughout implementation
