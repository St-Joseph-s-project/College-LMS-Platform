# Module API Documentation

Base URL: `/api/v1/admin/module` (assuming standard mounting)

## 1. Add Module

**Endpoint**: `POST /add/:courseId`

**Description**: Creates a new module for a specific course.

### Request
- **Path Parameters**:
  - `courseId` (integer, required): ID of the course to add the module to.
- **Body**:
  ```json
  {
    "name": "string (required, max 100 chars)",
    "description": "string (optional)",
    "orderIndex": "integer (optional)"
  }
  ```

### Response
- **Status Code**: 201 Created
- **Body**:
  ```json
  {
    "data": {
      "id": 1,
      "course_id": 101,
      "name": "Module Name",
      "description": "Module Description",
      "order_index": 1,
      "is_published": false,
      "created_at": "2024-01-01T00:00:00.000Z"
    },
    "message": "Module added successfully",
    "statusCode": 201
  }
  ```

---

## 2. Update Module

**Endpoint**: `PUT /update/:moduleId`

**Description**: Updates the details of an existing module.

### Request
- **Path Parameters**:
  - `moduleId` (integer, required): ID of the module to update.
- **Body**:
  ```json
  {
    "name": "string (optional, max 100 chars)",
    "description": "string (optional)",
    "orderIndex": "integer (optional)"
  }
  ```

### Response
- **Status Code**: 200 OK
- **Body**:
  ```json
  {
    "data": {
      "id": 1,
      "course_id": 101,
      "name": "Updated Name",
      "description": "Updated Description",
      "order_index": 2,
      "is_published": false,
      "created_at": "2024-01-01T00:00:00.000Z"
    },
    "message": "Module updated successfully",
    "statusCode": 200
  }
  ```

---

## 3. Update Module Visibility

**Endpoint**: `PUT /update-visiblity/:moduleId`

**Description**: Toggles the publication status of a module.

### Request
- **Path Parameters**:
  - `moduleId` (integer, required): ID of the module to update.
- **Body**:
  ```json
  {
    "isPublished": "boolean (required)"
  }
  ```

### Response
- **Status Code**: 200 OK
- **Body**:
  ```json
  {
    "data": {
      "id": 1,
      "is_published": true
      // ... other fields
    },
    "message": "Module visibility updated successfully",
    "statusCode": 200
  }
  ```

---

## 4. Delete Module

**Endpoint**: `DELETE /delete/:moduleId`

**Description**: Deletes a module and all its associated data (submodules, questions, etc.).

### Request
- **Path Parameters**:
  - `moduleId` (integer, required): ID of the module to delete.

### Response
- **Status Code**: 200 OK
- **Body**:
  ```json
  {
    "data": {
      "message": "Module deleted successfully"
    },
    "message": "Module deleted successfully",
    "statusCode": 200
  }
  ```

---

## 5. Get All Modules

**Endpoint**: `GET /get-all/:courseId`

**Description**: Retrieves all modules for a specific course.

### Request
- **Path Parameters**:
  - `courseId` (integer, required): ID of the course.

### Response
- **Status Code**: 200 OK
- **Body**:
  ```json
  {
    "data": [
      {
        "id": 1,
        "course_id": 101,
        "name": "Module 1",
        "description": "Description",
        "order_index": 1,
        "is_published": true,
        "created_at": "2024-01-01T00:00:00.000Z"
      }
      // ... more modules
    ],
    "message": "Modules fetched successfully",
    "statusCode": 200
  }
  ```
