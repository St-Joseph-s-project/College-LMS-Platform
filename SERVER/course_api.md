# Admin Course Module API Endpoints

## Base URL
Prefix: `/api/admin/course`

## 1. Get All Courses
- **Endpoint**: `/get-all`
- **Method**: `GET`
- **Description**: Retrieves a list of all courses, ordered by creation date descending.
- **Permissions**: `LMS_COURSE_VIEW`
- **Request Body**: None
- **Response**:
  ```json
  {
    "success": true,
    "message": "Courses fetched successfully",
    "data": [
      {
        "id": 1,
        "name": "Introduction to Programming",
        "description": "Learn the basics of coding.",
        "is_published": false,
        "created_at": "2023-10-27T10:00:00.000Z"
      },
      ...
    ]
  }
  ```

## 2. Get Course By ID
- **Endpoint**: `/get/:id`
- **Method**: `GET`
- **Description**: Retrieves details of a specific course, including its modules.
- **Permissions**: `LMS_COURSE_VIEW`
- **Path Parameters**:
  - `id`: course ID (integer)
- **Request Body**: None
- **Response**:
  ```json
  {
    "success": true,
    "message": "Course fetched successfully",
    "data": {
      "id": 1,
      "name": "Introduction to Programming",
      "description": "Learn the basics of coding.",
      "is_published": false,
      "created_at": "2023-10-27T10:00:00.000Z",
      "lms_module": []
    }
  }
  ```

## 3. Create Course
- **Endpoint**: `/add`
- **Method**: `POST`
- **Description**: Creates a new course. The course is created as **unpublished** by default.
- **Permissions**: `LMS_COURSE_ADD`
- **Request Body**:
  ```json
  {
    "name": "Advanced React Patterns", // Required, String
    "description": "Deep dive into React." // Optional, String
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Course created successfully",
    "data": {
      "id": 2,
      "name": "Advanced React Patterns",
      "description": "Deep dive into React.",
      "is_published": false, // Enforced default
      "created_at": "2023-10-27T10:05:00.000Z"
    }
  }
  ```

## 4. Update Course
- **Endpoint**: `/update/:id`
- **Method**: `PUT`
- **Description**: Updates the details of an existing course.
- **Permissions**: `LMS_COURSE_UPDATE`
- **Path Parameters**:
  - `id`: course ID (integer)
- **Request Body**:
  ```json
  {
    "name": "React Patterns V2", // Optional, String
    "description": "Updated description.", // Optional, String
    "is_published": true // Optional, Boolean
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Course updated successfully",
    "data": {
      "id": 2,
      "name": "React Patterns V2",
      "description": "Updated description.",
      "is_published": true,
      "created_at": "2023-10-27T10:05:00.000Z"
    }
  }
  ```

## 5. Delete Course
- **Endpoint**: `/delete/:id`
- **Method**: `PUT`
- **Description**: Deletes a course. (Note: Currently implemented as a hard delete via `params.id`).
- **Permissions**: `LMS_COURSE_DELETE`
- **Path Parameters**:
  - `id`: course ID (integer)
- **Request Body**: None
- **Response**:
  ```json
  {
    "success": true,
    "message": "Course deleted successfully",
    "data": null
  }
  ```

## 6. Update Course Visibility
- **Endpoint**: `/update-visibility/:id`
- **Method**: `PUT`
- **Description**: Toggles or sets the visibility status of a course.
- **Permissions**: `LMS_COURSE_UPDATE`
- **Path Parameters**:
  - `id`: course ID (integer)
- **Request Body**:
  ```json
  {
    "is_published": true // Required, Boolean
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Course visibility updated successfully",
    "data": {
      "id": 1,
      "is_published": true,
      ...
    }
  }
  ```
